<?php
// QR code generator (shared by direct link; not in navigation or the sitemap).
// Visitors enter a link and get a styled blue QR code for it, generated in the
// browser by public/assets/js/qr/ (nothing is sent to the server), with SVG and
// PNG downloads. It opens on the code for /contact, which is also the no-JS view.
// Renders its own document, so the SPA router falls back to a full load.
// Regenerate that default image with:
//   node scripts/qr/make-qr.mjs https://symnexus.co/contact public/assets/images/qr-contact.svg
header('Content-Type: text/html; charset=utf-8');
$defaultLink = 'https://symnexus.co/contact';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex">
    <meta name="color-scheme" content="light">
    <title>QR code generator · Symnexus</title>
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <style>
        :root { --navy: #0a2a66; --blue: #1652d9; --ink: #0f172a; --muted: #64748b; --line: #cbd5e1; --error: #b91c1c; }
        * { box-sizing: border-box; }
        html, body { margin: 0; min-height: 100%; background: #fff; color: var(--ink); }
        body {
            font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 100vh; min-height: 100dvh; padding: 24px 16px;
        }
        main { width: 100%; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .code { display: block; width: min(100%, 520px, 60vh); height: auto; aspect-ratio: 1; }
        form { width: 100%; display: flex; gap: 8px; }
        label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        input {
            flex: 1; min-width: 0; height: 48px; padding: 0 16px; font: inherit; color: inherit;
            border: 1px solid var(--line); border-radius: 999px; background: #fff;
        }
        input:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(22, 82, 217, .2); }
        input[aria-invalid="true"] { border-color: var(--error); }
        button, .download {
            height: 48px; padding: 0 20px; font: inherit; font-weight: 600; border-radius: 999px; cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center; text-decoration: none; white-space: nowrap;
        }
        button[type="submit"] { border: 0; color: #fff; background: linear-gradient(135deg, var(--navy), var(--blue)); }
        button[type="submit"]:hover { filter: brightness(1.1); }
        button:focus-visible, .download:focus-visible { outline: 3px solid rgba(22, 82, 217, .45); outline-offset: 2px; }
        .status { min-height: 1.5em; margin: -8px 0 0; font-size: 14px; color: var(--muted); text-align: center; overflow-wrap: anywhere; }
        .status.error { color: var(--error); }
        .downloads { display: flex; gap: 8px; }
        .download { height: 40px; padding: 0 16px; font-size: 14px; color: var(--navy); background: #fff; border: 1px solid var(--line); }
        .download:hover { border-color: var(--blue); }
        [hidden] { display: none !important; }
        @media (max-width: 420px) { form { flex-direction: column; } input { flex: none; width: 100%; } button[type="submit"] { width: 100%; } }
    </style>
</head>

<body>
    <main data-qr>
        <img class="code" data-qr-image src="<?= e(asset('images/qr-contact.svg')) ?>"
            alt="QR code linking to <?= e($defaultLink) ?>" width="1024" height="1024">

        <form data-qr-form novalidate>
            <label for="qr-link">Link</label>
            <input id="qr-link" name="link" type="text" inputmode="url" autocomplete="url" autocapitalize="off"
                spellcheck="false" maxlength="2000" placeholder="Paste a link" value="<?= e($defaultLink) ?>"
                aria-describedby="qr-status" required>
            <button type="submit">Generate</button>
        </form>

        <p class="status" id="qr-status" data-qr-status role="status" aria-live="polite"><?= e($defaultLink) ?></p>

        <div class="downloads" data-qr-downloads hidden>
            <a class="download" data-qr-download="svg" href="#" download>Download SVG</a>
            <button type="button" class="download" data-qr-download="png">Download PNG</button>
        </div>
    </main>

    <script src="<?= e(asset('js/qr/qrcodegen.js')) ?>"></script>
    <script src="<?= e(asset('js/qr/qr-svg.js')) ?>"></script>
    <script src="<?= e(asset('js/qr/qr-page.js')) ?>"></script>
</body>

</html>
