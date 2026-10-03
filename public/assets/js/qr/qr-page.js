// /qr: turns the entered link into a styled QR code (qr-svg.js) entirely in the
// browser, and offers it as SVG or a 1024px PNG. Runs after qrcodegen.js and qr-svg.js.
(function () {
    'use strict';

    var root = document.querySelector('[data-qr]');
    if (!root || typeof window.qrSvg !== 'function') return;

    var form = root.querySelector('[data-qr-form]');
    var input = form.querySelector('input');
    var image = root.querySelector('[data-qr-image]');
    var status = root.querySelector('[data-qr-status]');
    var downloads = root.querySelector('[data-qr-downloads]');
    var svgLink = root.querySelector('[data-qr-download="svg"]');
    var pngButton = root.querySelector('[data-qr-download="png"]');

    var PNG_SIZE = 1024;
    var SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];
    var current = null; // { link, url (object URL of the SVG), name }

    // Accepts web links with or without https://, plus mailto: and tel:.
    // Returns { link } or { error }.
    function normalise(raw) {
        var text = raw.trim();
        if (!text) return { error: 'Enter a link to make a QR code.' };

        var scheme = /^([a-z][a-z0-9+.-]*):/i.exec(text);
        if (!scheme || /^[^/:]+:\d+(\/|$)/.test(text)) { // no scheme, or host:port
            if (/\s/.test(text)) return { error: 'That doesn’t look like a link. Try something like symnexus.co/contact.' };
            text = 'https://' + text.replace(/^\/+/, '');
        }

        var url;
        try { url = new URL(text); } catch (e) { return { error: 'That doesn’t look like a link. Try something like symnexus.co/contact.' }; }
        if (SCHEMES.indexOf(url.protocol) === -1) return { error: 'Use a web link (https://…), an email (mailto:) or a phone number (tel:).' };
        if ((url.protocol === 'http:' || url.protocol === 'https:') && !/\.|^localhost$/.test(url.hostname)) {
            return { error: 'That link is missing its domain, like symnexus.co.' };
        }
        return { link: text };
    }

    // "https://www.symnexus.co/contact?x=1" -> "qr-symnexus-co-contact"
    function fileName(link) {
        var slug = link.replace(/^[a-z]+:(\/\/)?(www\.)?/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 60);
        return 'qr-' + (slug || 'code');
    }

    function setStatus(text, isError) {
        status.textContent = text;
        status.classList.toggle('error', !!isError);
        input.setAttribute('aria-invalid', isError ? 'true' : 'false');
    }

    function generate() {
        var result = normalise(input.value);
        if (result.error) {
            setStatus(result.error, true);
            input.focus();
            return;
        }

        var made;
        try {
            made = window.qrSvg(result.link);
        } catch (err) {
            setStatus(err instanceof RangeError ? 'That link is too long to make a QR code that scans reliably (the limit is about 1,000 characters). Try a shorter link.' : 'Couldn’t make a QR code for that link.', true);
            return;
        }

        if (current) URL.revokeObjectURL(current.url);
        current = {
            link: result.link,
            url: URL.createObjectURL(new Blob([made.svg], { type: 'image/svg+xml' })),
            name: fileName(result.link),
        };

        input.value = result.link;
        image.src = current.url;
        image.alt = 'QR code linking to ' + result.link;
        svgLink.href = current.url;
        svgLink.setAttribute('download', current.name + '.svg');
        downloads.hidden = false;
        setStatus(result.link, false);
    }

    function downloadPng() {
        if (!current) return;
        var job = current;
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = PNG_SIZE;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, PNG_SIZE, PNG_SIZE);
            ctx.drawImage(img, 0, 0, PNG_SIZE, PNG_SIZE);
            canvas.toBlob(function (blob) {
                if (!blob) return;
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = job.name + '.png';
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
            }, 'image/png');
        };
        img.src = job.url;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        generate();
    });
    input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') setStatus('', false);
    });
    pngButton.addEventListener('click', downloadPng);

    // Start from the server-rendered default so the downloads work straight away.
    generate();
})();
