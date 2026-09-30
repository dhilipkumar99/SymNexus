/**
 * Site behaviour: theme toggle, header scroll states, mobile drawer, media
 * carousels, lightbox, enquiry forms and hero video.
 *
 * Everything is bound once with event delegation on `document`, so it keeps
 * working after the SPA router swaps page fragments in and out.
 */
(function () {
    'use strict';

    // ── Theme ────────────────────────────────────────────────────────────────
    function setTheme(dark) {
        document.documentElement.classList.toggle('dark', dark);
        try {
            localStorage.setItem('color-theme', dark ? 'dark' : 'light');
        } catch (e) {
            /* storage unavailable (private mode) — theme still applies for this page */
        }
    }

    // ── Mobile drawer ────────────────────────────────────────────────────────
    function setMenuOpen(open) {
        var menu = document.getElementById('mobile-menu');
        var btn = document.getElementById('mobile-menu-btn');
        if (!menu || !btn) return;
        menu.classList.toggle('hidden', !open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    // ── Carousel ─────────────────────────────────────────────────────────────
    function moveCarousel(root, direction) {
        var track = root.querySelector('[data-carousel-track]');
        if (!track) return;
        var total = track.children.length;
        var current = parseInt(track.getAttribute('data-current') || '0', 10);
        current = (current + direction + total) % total;
        track.setAttribute('data-current', String(current));
        track.style.transform = 'translateX(-' + current * 100 + '%)';

        var dots = root.querySelectorAll('[data-carousel-dot]');
        dots.forEach(function (dot, i) {
            dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
    }

    // ── Lightbox ─────────────────────────────────────────────────────────────
    var lastFocus = null;

    function openLightbox(trigger) {
        var box = document.getElementById('global-lightbox');
        var content = document.getElementById('lightbox-content');
        if (!box || !content) return;

        content.textContent = '';
        var src = trigger.getAttribute('data-lightbox-src');
        if (src) {
            var img = document.createElement('img');
            img.src = src;
            img.alt = trigger.getAttribute('data-lightbox-alt') || '';
            img.className = 'max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg';
            content.appendChild(img);
        } else {
            // Illustrative HTML slides (product interface mock-ups) are cloned in.
            var clone = trigger.cloneNode(true);
            clone.removeAttribute('data-lightbox');
            clone.removeAttribute('role');
            clone.removeAttribute('tabindex');
            clone.className = 'w-full max-w-3xl';
            content.appendChild(clone);
        }

        lastFocus = document.activeElement;
        box.classList.remove('hidden');
        box.classList.add('flex');
        document.body.style.overflow = 'hidden';
        var close = box.querySelector('[data-lightbox-close]');
        if (close) close.focus();
    }

    function closeLightbox() {
        var box = document.getElementById('global-lightbox');
        if (!box || box.classList.contains('hidden')) return;
        box.classList.add('hidden');
        box.classList.remove('flex');
        document.getElementById('lightbox-content').textContent = '';
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    // ── Enquiry forms ───────────────────────────────────────────────────────
    // Forms marked data-contact-form are posted to /api/contact, which emails
    // the company inbox. Without JavaScript they still work as a plain form post.
    function showFormError(form, message) {
        var box = form.querySelector('[data-form-error]');
        if (!box) return;
        box.textContent = message;
        box.classList.remove('hidden');
        box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function submitContactForm(form) {
        if (form.dataset.sending === '1') return; // ignore double-submits
        var button = form.querySelector('button[type="submit"]');
        var label = form.querySelector('[data-submit-label]');
        var idleLabel = label ? label.textContent : '';
        var errorBox = form.querySelector('[data-form-error]');
        if (errorBox) errorBox.classList.add('hidden');

        var payload = {};
        new FormData(form).forEach(function (value, key) {
            payload[key] = typeof value === 'string' ? value : '';
        });

        form.dataset.sending = '1';
        if (button) button.disabled = true;
        if (label) label.textContent = 'Sending…';

        fetch(form.getAttribute('action') || '/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(payload),
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (!res.ok || !data.ok) throw new Error(data.error || 'We couldn\u2019t send your message. Please try again.');
            });
        }).then(function () {
            var root = form.closest('[data-form-root]');
            var success = root ? root.querySelector('[data-form-success]') : null;
            form.reset();
            if (success) {
                form.classList.add('hidden');
                success.classList.remove('hidden');
                success.focus();
                success.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        }).catch(function (err) {
            showFormError(form, err && err.message ? err.message : 'We couldn\u2019t send your message. Please try again.');
        }).then(function () {
            delete form.dataset.sending;
            if (button) button.disabled = false;
            if (label) label.textContent = idleLabel;
        });
    }

    // ── Motion videos (hero logo) ───────────────────────────────────────────
    // Videos marked data-motion-video play only while on screen and never for
    // visitors who prefer reduced motion (they see the poster frame instead).
    var reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var videoObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var video = entry.target;
            if (entry.isIntersecting && !(reducedMotion && reducedMotion.matches)) {
                video.muted = true; // required for autoplay policies
                var playing = video.play();
                if (playing && playing.catch) playing.catch(function () { /* autoplay blocked: poster stays */ });
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.15 }) : null;

    // Called on load and after every SPA swap: drops videos from the previous page.
    function initMotionVideos() {
        if (videoObserver) videoObserver.disconnect();
        document.querySelectorAll('video[data-motion-video]').forEach(function (video) {
            if (videoObserver) videoObserver.observe(video);
            else if (!(reducedMotion && reducedMotion.matches)) video.play();
        });
    }

    if (reducedMotion && reducedMotion.addEventListener) {
        reducedMotion.addEventListener('change', function () {
            document.querySelectorAll('video[data-motion-video]').forEach(function (video) {
                if (reducedMotion.matches) video.pause();
                else if (videoObserver) { videoObserver.unobserve(video); videoObserver.observe(video); }
            });
        });
    }

    // ── Product catalog (/products) ─────────────────────────────────────────
    // The server renders every product section, so the page works without JS. This
    // narrows it to one product (or all) and filters tasks by text and department.
    // The selected product lives in the URL hash (#predict…) so it can be linked to.
    function productFromHash(root) {
        var key = window.location.hash.slice(1);
        return key && root.querySelector('[data-product-pill][data-product="' + CSS.escape(key) + '"]') ? key : null;
    }

    function applySolutions(root) {
        var scope = root.getAttribute('data-scope') || 'all';
        var dept = root.getAttribute('data-dept') || '';
        var input = root.querySelector('[data-solutions-search]');
        var terms = input ? input.value.toLowerCase().split(/\s+/).filter(Boolean) : [];
        var filtering = terms.length > 0 || dept !== '';
        var shown = 0, products = 0, elsewhere = 0;

        root.querySelectorAll('[data-product-section]').forEach(function (section) {
            var inScope = scope === 'all' || section.id === scope;
            var count = 0;
            section.querySelectorAll('[data-task]').forEach(function (task) {
                var text = task.getAttribute('data-search') || '';
                var match = (!dept || task.getAttribute('data-dept') === dept)
                    && terms.every(function (t) { return text.indexOf(t) !== -1; });
                if (match && !inScope) elsewhere++;
                match = match && inScope;
                task.classList.toggle('hidden', !match);
                if (match) count++;
            });
            section.classList.toggle('hidden', count === 0);
            shown += count;
            if (count) products++;
        });

        root.querySelectorAll('[data-product-pill]').forEach(function (pill) {
            pill.setAttribute('aria-current', pill.getAttribute('data-product') === scope ? 'true' : 'false');
        });
        root.querySelectorAll('[data-dept-chip]').forEach(function (chip) {
            chip.setAttribute('aria-pressed', chip.getAttribute('data-dept-chip') === dept ? 'true' : 'false');
        });

        var status = root.querySelector('[data-solutions-status]');
        if (status) {
            status.textContent = !filtering ? '' : shown === 0 ? 'No matching tasks.'
                : shown + (shown === 1 ? ' task' : ' tasks') + (products > 1 ? ' across ' + products + ' products' : '');
        }

        var empty = root.querySelector('[data-solutions-empty]');
        if (empty) {
            empty.classList.toggle('hidden', shown > 0);
            var allBtn = empty.querySelector('[data-solutions-all]');
            if (allBtn) allBtn.classList.toggle('hidden', elsewhere === 0);
            var text = empty.querySelector('[data-solutions-empty-text]');
            if (text) {
                text.textContent = elsewhere > 0
                    ? 'No tasks in this product match, but ' + elsewhere
                        + (elsewhere === 1 ? ' task in another product does.' : ' tasks in other products do.')
                    : 'No tasks match.';
            }
        }
    }

    function setSolutionsScope(root, scope) {
        root.setAttribute('data-scope', scope);
        // replaceState: switching products shouldn't fill the Back history.
        var url = window.location.pathname + window.location.search + (scope === 'all' ? '' : '#' + scope);
        history.replaceState(history.state, '', url);
        applySolutions(root);
    }

    // Called on load and after every SPA swap (the fragment is new each time).
    function initSolutions() {
        var root = document.querySelector('[data-solutions]');
        if (!root) return;
        var controls = root.querySelector('[data-solutions-controls]');
        if (controls) controls.classList.remove('hidden');

        var fromHash = productFromHash(root);
        var first = root.querySelector('[data-product-section]');
        root.setAttribute('data-scope', fromHash || (first ? first.id : 'all'));
        applySolutions(root);

        // The browser (or SPA router) may already have scrolled to #product while every
        // section was visible; re-align now that the others are hidden.
        if (fromHash) {
            var section = document.getElementById(fromHash);
            if (section) section.scrollIntoView();
        }
    }

    // ── Questionnaire popup ──────────────────────────────────────────────────
    // Links marked data-consult (a product site's /consult page) open in a
    // phone-sized window, falling back to a new tab if popups are blocked.
    function openConsult(link) {
        var w = 460;
        var h = Math.min(900, (window.screen && window.screen.availHeight) || 900);
        var left = Math.max(0, (window.screenX || 0) + ((window.outerWidth || w) - w) / 2);
        var top = Math.max(0, (window.screenY || 0) + 40);
        var win = window.open(link.href, 'symnexus-consult',
            'popup=yes,width=' + w + ',height=' + h + ',left=' + left + ',top=' + top);
        if (win) win.focus();
        else window.open(link.href, '_blank', 'noopener');
    }

    // ── Delegated listeners ─────────────────────────────────────────────────
    document.addEventListener('click', function (e) {
        var target = e.target;
        if (!(target instanceof Element)) return;

        var consult = target.closest('a[data-consult]');
        if (consult && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            openConsult(consult);
            return;
        }

        var solutions = target.closest('[data-solutions]');
        if (solutions) {
            var pill = target.closest('[data-product-pill]');
            if (pill) {
                e.preventDefault(); // also stops the SPA router's same-page anchor scroll
                setSolutionsScope(solutions, pill.getAttribute('data-product'));
                return;
            }
            var chip = target.closest('[data-dept-chip]');
            if (chip) {
                var dept = chip.getAttribute('data-dept-chip');
                solutions.setAttribute('data-dept', solutions.getAttribute('data-dept') === dept ? '' : dept);
                applySolutions(solutions);
                return;
            }
            if (target.closest('[data-solutions-all]')) {
                setSolutionsScope(solutions, 'all');
                return;
            }
            if (target.closest('[data-solutions-clear]')) {
                var search = solutions.querySelector('[data-solutions-search]');
                if (search) search.value = '';
                solutions.setAttribute('data-dept', '');
                applySolutions(solutions);
                if (search) search.focus();
                return;
            }
        }

        if (target.closest('#theme-toggle')) {
            setTheme(!document.documentElement.classList.contains('dark'));
            return;
        }

        if (target.closest('#mobile-menu-btn')) {
            var menu = document.getElementById('mobile-menu');
            setMenuOpen(menu ? menu.classList.contains('hidden') : false);
            return;
        }

        if (target.closest('#mobile-menu a')) {
            setMenuOpen(false);
        }

        var carouselBtn = target.closest('[data-carousel-prev], [data-carousel-next]');
        if (carouselBtn) {
            var root = carouselBtn.closest('[data-carousel]');
            if (root) moveCarousel(root, carouselBtn.hasAttribute('data-carousel-next') ? 1 : -1);
            return;
        }

        if (target.closest('[data-lightbox-close]') || target.id === 'global-lightbox') {
            closeLightbox();
            return;
        }

        var lightboxTrigger = target.closest('[data-lightbox]');
        if (lightboxTrigger) {
            openLightbox(lightboxTrigger);
            return;
        }

    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
            setMenuOpen(false);
            return;
        }
        // Keyboard activation for lightbox triggers that are not buttons.
        if ((e.key === 'Enter' || e.key === ' ') && e.target instanceof Element && e.target.matches('[data-lightbox][role="button"]')) {
            e.preventDefault();
            openLightbox(e.target);
        }
    });

    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (form instanceof HTMLFormElement && form.hasAttribute('data-contact-form')) {
            e.preventDefault();
            submitContactForm(form);
        }
    });

    document.addEventListener('input', function (e) {
        var target = e.target;
        if (target instanceof Element && target.matches('[data-solutions-search]')) {
            var root = target.closest('[data-solutions]');
            if (root) applySolutions(root);
        }
    });

    // A hand-edited #product in the address bar selects that product.
    window.addEventListener('hashchange', function () {
        var root = document.querySelector('[data-solutions]');
        var key = root ? productFromHash(root) : null;
        if (key) {
            root.setAttribute('data-scope', key);
            applySolutions(root);
        }
    });

    document.addEventListener('spa:pageLoaded', function () {
        setMenuOpen(false);
        closeLightbox();
        initMotionVideos();
        initSolutions();
    });

    // ── Header: hide on scroll down, frosted logo pill once scrolled ────────
    var lastScrollY = window.scrollY;
    var ticking = false;

    function onScroll() {
        var y = window.scrollY;
        var header = document.getElementById('main-header');
        var logoPill = document.getElementById('logo-pill');

        if (header) {
            var hide = y > lastScrollY && y > 60;
            header.classList.toggle('-translate-y-32', hide);
            header.classList.toggle('opacity-0', hide);
            if (hide) setMenuOpen(false);
        }
        if (logoPill) logoPill.classList.toggle('scrolled', y > 10);

        lastScrollY = y;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // Keyboard users tabbing into a hidden header should see it again.
    document.addEventListener('focusin', function (e) {
        var header = document.getElementById('main-header');
        if (header && e.target instanceof Element && header.contains(e.target)) {
            header.classList.remove('-translate-y-32', 'opacity-0');
        }
    });

    onScroll();
    initMotionVideos();
    initSolutions();
})();
