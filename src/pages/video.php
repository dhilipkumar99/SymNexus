<?php
// Standalone full-screen video (shared by direct link; not in navigation or the sitemap).
// It deliberately renders its own document, so the SPA router falls back to a full load.
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex">
    <title>Symnexus</title>
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <style>
        html, body { margin: 0; height: 100%; overflow: hidden; background: #000; }
        video { position: fixed; inset: 0; width: 100vw; height: 100vh; object-fit: contain; background: #000; }
    </style>
</head>

<body>
    <video src="/video/symnexus.mp4" autoplay controls playsinline preload="auto"></video>
</body>

</html>
