<?php

// Single entrypoint for every dynamic request — Vercel (vercel-php) routes all
// non-static paths here, and locally: php -S localhost:8000 -t public api/index.php
return require __DIR__ . '/../src/app.php';
