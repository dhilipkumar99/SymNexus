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
            if (!response.ok || response.headers.get('X-SPA-Fragment') !== '1') {
                throw new Error('Not an SPA fragment (HTTP ' + response.status + ')');
            }
            var rawTitle = response.headers.get('X-SPA-Title');
            var title = null;
            if (rawTitle) {
                try { title = decodeURIComponent(rawTitle); } catch (e) { title = null; }
            }
            return response.text().then(function (html) {
                return { html: html, title: title, url: response.url || key };
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

    function scrollToHash(hash, smooth) {
        var target = null;
        if (hash && hash.length > 1) {
            try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { target = null; }
        }
        if (target) {
            target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        } else {
            window.scrollTo(0, 0);
        }
    }

    function saveScrollPosition() {
        var state = Object.assign({}, history.state || {}, { spaScrollY: window.scrollY });
        history.replaceState(state, '');
    }

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

            // Honour server-side redirects (e.g. legacy URLs) in the address bar.
            var finalUrl = new URL(result.url, window.location.href);
            finalUrl.hash = requested.hash;

            if (options.push) {
                saveScrollPosition();
                history.pushState({ spa: true }, '', finalUrl.href);
            }

            container.innerHTML = result.html;
            renderedKey = cacheKey(finalUrl.href);
            if (result.title) document.title = result.title;
            executeScripts(container);
            updateActiveNavigation(finalUrl.href);

            if (typeof options.restoreY === 'number') {
                window.scrollTo(0, options.restoreY);
            } else {
                scrollToHash(finalUrl.hash, false);
            }

            // Move focus to the new content for keyboard and screen-reader users.
            container.setAttribute('tabindex', '-1');
            container.focus({ preventScroll: true });

            document.dispatchEvent(new CustomEvent('spa:pageLoaded', { detail: { url: finalUrl.href } }));
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
                    history.pushState(history.state, '', target.href);
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
            if (cacheKey(window.location.href) === renderedKey) {
                scrollToHash(window.location.hash, true);
                return;
            }
            var state = e.state || {};
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
