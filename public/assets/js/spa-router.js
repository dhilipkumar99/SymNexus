/**
 * Single Page Application (SPA) router — vanilla JS.
 *
 * Internal links are fetched with `X-SPA-Request: true`; the server replies with
 * only the inner page fragment (plus `X-SPA-Fragment` / `X-SPA-Title` headers),
 * which is swapped into #spa-container without a full reload. Links are
 * prefetched on hover/touch. Anything unexpected falls back to a normal
 * browser navigation, so the site works identically without this script.
 */
(function () {
    'use strict';

    if (!window.fetch || !window.history || !history.pushState) return;

    var CACHE_LIMIT = 30;
    var pageCache = new Map();
    var prefetchTimer = null;
    var navToken = 0;
    var renderedKey = null; // cache key of the page currently on screen

    // ── Loading bar ─────────────────────────────────────────────────────────
    var loadingBar = document.createElement('div');
    loadingBar.id = 'spa-loading-bar';
    loadingBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(loadingBar);

    function startLoading() {
        loadingBar.style.opacity = '1';
        loadingBar.style.width = '30%';
        setTimeout(function () {
            if (loadingBar.style.width === '30%') loadingBar.style.width = '70%';
        }, 300);
    }

    function stopLoading() {
        loadingBar.style.width = '100%';
        setTimeout(function () {
            loadingBar.style.opacity = '0';
            setTimeout(function () { loadingBar.style.width = '0'; }, 300);
        }, 150);
    }

    // ── Link eligibility ────────────────────────────────────────────────────
    function isRoutableLink(link) {
        if (!link || !link.href) return false;
        if (link.hasAttribute('download') || link.hasAttribute('data-no-spa')) return false;
        var target = link.getAttribute('target');
        if (target && target !== '_self') return false;

        var url;
        try { url = new URL(link.href, window.location.href); } catch (e) { return false; }
        if (url.origin !== window.location.origin) return false;
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

        // Files (videos, sitemap, assets) and API endpoints are not pages.
        var lastSegment = url.pathname.split('/').pop() || '';
        if (lastSegment.indexOf('.') !== -1) return false;
        if (url.pathname.indexOf('/api/') === 0) return false;
        return true;
    }

    function cacheKey(url) {
        var u = new URL(url, window.location.href);
        u.hash = '';
        return u.href;
    }

    // ── Fetching ────────────────────────────────────────────────────────────
    function fetchPage(url) {
        var key = cacheKey(url);
        if (pageCache.has(key)) return pageCache.get(key);

        var promise = fetch(key, {
            headers: { 'X-SPA-Request': 'true' },
            credentials: 'same-origin',
        }).then(function (response) {
            // Only accept genuine fragments; anything else triggers a full load.
            // Redirects also go through a full load: fetch hides the target's #fragment,
            // which the browser preserves (e.g. /fluorocellai/pricing → /pricing#fluorocellai).
            if (!response.ok || response.redirected || response.headers.get('X-SPA-Fragment') !== '1') {
                throw new Error('Not an SPA fragment (HTTP ' + response.status + ')');
            }
            var rawTitle = response.headers.get('X-SPA-Title');
            var title = null;
            if (rawTitle) {
                try { title = decodeURIComponent(rawTitle); } catch (e) { title = null; }
            }
            return response.text().then(function (html) {
                return { html: html, title: title };
            });
        });

        promise.catch(function () { pageCache.delete(key); });

        pageCache.set(key, promise);
        if (pageCache.size > CACHE_LIMIT) {
            pageCache.delete(pageCache.keys().next().value);
        }
        return promise;
    }

    function prefetch(url) {
        var conn = navigator.connection;
        if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return;
        fetchPage(url).catch(function () { /* navigation will retry or fall back */ });
    }

    // ── Rendering ───────────────────────────────────────────────────────────
    function executeScripts(container) {
        container.querySelectorAll('script').forEach(function (oldScript) {
            var script = document.createElement('script');
            Array.prototype.forEach.call(oldScript.attributes, function (attr) {
                script.setAttribute(attr.name, attr.value);
            });
            script.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(script, oldScript);
        });
    }

    function matchesPath(path, prefix) {
        return prefix === '/' ? path === '/' : (path === prefix || path.indexOf(prefix + '/') === 0);
    }

    function updateActiveNavigation(url) {
        var path = new URL(url, window.location.href).pathname;
        document.querySelectorAll('a[data-match]').forEach(function (link) {
            var active = (link.getAttribute('data-match') || '').split(' ').some(function (prefix) {
                return prefix && matchesPath(path, prefix);
            });
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    /**
     * Scroll to the element named by a #hash and move focus to it, as the browser
     * would natively (this is what makes "Skip to content" work). Returns false
     * when there is no such element.
     */
    function scrollToHash(hash, smooth) {
        var target = null;
        if (hash && hash.length > 1) {
            try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { target = null; }
        }
        if (!target) return false;
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) {
            target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
        return true;
    }

    function saveScrollPosition() {
        var state = Object.assign({}, history.state || {}, { spaScrollY: window.scrollY });
        history.replaceState(state, '');
    }

    // Keep the current entry's scroll position up to date, so Back *and* Forward
    // can restore it (with manual scrollRestoration the browser won't).
    var scrollSaveTimer = null;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollSaveTimer);
        scrollSaveTimer = setTimeout(saveScrollPosition, 150);
    }, { passive: true });

    // Pages the service worker has already been asked to store for offline use.
    var offlineQueued = new Set();

    function loadPage(url, options) {
        options = options || {};
        var token = ++navToken;
        var requested = new URL(url, window.location.href);
        var container = document.getElementById('spa-container');
        if (!container) {
            window.location.href = requested.href;
            return;
        }

        startLoading();

        fetchPage(requested.href).then(function (result) {
            if (token !== navToken) return; // a newer navigation won

            var finalUrl = requested;

            if (options.push) {
                saveScrollPosition();
                history.pushState({ spa: true }, '', finalUrl.href);
            }

            container.innerHTML = result.html;
            renderedKey = cacheKey(finalUrl.href);
            if (result.title) document.title = result.title;
            executeScripts(container);
            updateActiveNavigation(finalUrl.href);

            // Restore scroll, or jump to the #hash target (which also takes focus);
            // otherwise move focus to the new content for keyboard/screen-reader users.
            if (typeof options.restoreY === 'number') {
                window.scrollTo(0, options.restoreY);
            }
            if (typeof options.restoreY === 'number' || !scrollToHash(finalUrl.hash, false)) {
                if (typeof options.restoreY !== 'number') window.scrollTo(0, 0);
                container.setAttribute('tabindex', '-1');
                container.focus({ preventScroll: true });
            }

            document.dispatchEvent(new CustomEvent('spa:pageLoaded', { detail: { url: finalUrl.href } }));

            // Ask the service worker to store the full page for offline use — once per
            // page per session; the worker skips pages it already holds.
            if (navigator.serviceWorker && navigator.serviceWorker.controller && !offlineQueued.has(renderedKey)) {
                offlineQueued.add(renderedKey);
                navigator.serviceWorker.controller.postMessage({ type: 'cache-page', url: renderedKey });
            }
        }).catch(function (error) {
            if (token !== navToken) return;
            console.warn('[SPA Router] Falling back to full navigation:', error && error.message);
            if (options.push) window.location.href = requested.href;
            else window.location.reload();
        }).then(function () {
            if (token === navToken) stopLoading();
        });
    }

    // ── Wiring ──────────────────────────────────────────────────────────────
    function init() {
        if (!document.getElementById('spa-container')) return;

        renderedKey = cacheKey(window.location.href);
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        history.replaceState(Object.assign({}, history.state || {}, { spa: true }), '');

        document.addEventListener('click', function (e) {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            var link = e.target instanceof Element ? e.target.closest('a') : null;
            if (!isRoutableLink(link)) return;

            var target = new URL(link.href, window.location.href);
            var here = new URL(window.location.href);

            // Same-page anchor: just scroll.
            if (target.pathname === here.pathname && target.search === here.search) {
                if (target.hash) {
                    e.preventDefault();
                    saveScrollPosition();
                    history.pushState({ spa: true }, '', target.href);
                    scrollToHash(target.hash, true);
                }
                return;
            }

            e.preventDefault();
            loadPage(target.href, { push: true });
        });

        // Prefetch on hover intent (short delay avoids drive-by hovers).
        document.addEventListener('mouseover', function (e) {
            var link = e.target instanceof Element ? e.target.closest('a') : null;
            if (!isRoutableLink(link)) return;
            if (new URL(link.href).pathname === window.location.pathname) return;
            clearTimeout(prefetchTimer);
            prefetchTimer = setTimeout(function () { prefetch(link.href); }, 65);
        });

        document.addEventListener('mouseout', function (e) {
            var link = e.target instanceof Element ? e.target.closest('a') : null;
            if (link) clearTimeout(prefetchTimer);
        });

        document.addEventListener('touchstart', function (e) {
            var link = e.target instanceof Element ? e.target.closest('a') : null;
            if (!isRoutableLink(link)) return;
            if (new URL(link.href).pathname === window.location.pathname) return;
            prefetch(link.href);
        }, { passive: true });

        window.addEventListener('popstate', function (e) {
            // Back/forward between anchors of the page already on screen: no fetch.
            var state = e.state || {};
            if (cacheKey(window.location.href) === renderedKey) {
                if (typeof state.spaScrollY === 'number') window.scrollTo(0, state.spaScrollY);
                else if (!scrollToHash(window.location.hash, true)) window.scrollTo(0, 0);
                return;
            }
            loadPage(window.location.href, {
                push: false,
                restoreY: typeof state.spaScrollY === 'number' ? state.spaScrollY : undefined,
            });
        });

        updateActiveNavigation(window.location.href);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.spaNavigate = function (url) {
        loadPage(url, { push: true });
    };
})();
