<?php
// Standalone QR code linking to /contact, for display or printing (shared by
// direct link; not in navigation or the sitemap). Renders its own document, so
// the SPA router falls back to a full load. Regenerate the image with:
//   node scripts/qr/make-qr.mjs https://symnexus.co/contact public/assets/images/qr-contact.svg
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex">
    <meta name="color-scheme" content="light">
    <title>Symnexus</title>
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <style>
        html, body { margin: 0; height: 100%; background: #fff; }
        body { display: grid; place-items: center; }
        img { display: block; width: min(88vmin, 960px); height: auto; aspect-ratio: 1; }
    </style>
</head>

<body>
    <img src="<?= e(asset('images/qr-contact.svg')) ?>" alt="QR code linking to symnexus.co/contact" width="960" height="960">
</body>

</html>
