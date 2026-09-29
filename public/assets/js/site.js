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

    // ── Delegated listeners ─────────────────────────────────────────────────
    document.addEventListener('click', function (e) {
        var target = e.target;
        if (!(target instanceof Element)) return;

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

    document.addEventListener('spa:pageLoaded', function () {
        setMenuOpen(false);
        closeLightbox();
        initMotionVideos();
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
})();
