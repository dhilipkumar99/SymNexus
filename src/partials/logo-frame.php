<?php
/**
 * Hero brand panel: the animated Symnexus logo inside a frame of industry tiles.
 *
 * The video is placed over the frame's empty centre using percentages measured
 * from the 1792×1008 frame artwork (inner edge of the tiles: x 148–1648, y 103–878),
 * so the logo's construction lines run exactly to the tiles at every width.
 * `mix-blend-multiply` drops the video's white background into the artwork.
 *
 * public/assets/video/symnexus-logo.<hash>.mp4 is pre-rendered from the source
 * animation: cropped to the inner aspect ratio (1501:776), sped up to 1.2x, and
 * followed by a 40-second hold on the final frame, then looped with `loop`.
 * Regenerate it with:
 *   ffmpeg -i logo.mp4 -an -vf "crop=1168:604:0:85,setpts=PTS/1.2,fps=144/5,
 *     tpad=stop_mode=clone:stop_duration=40,format=yuv420p" -c:v libx264 -crf 22
 *     -movflags +faststart symnexus-logo.mp4
 * and rename it with its content hash (the /assets/ path is cached immutably).
 */
$logoVideo = '/assets/video/symnexus-logo.4d89a46b6f.mp4';

$industries = 'Life sciences, pharmaceuticals, healthcare, food safety, chemicals, clinical research, biotechnology, '
    . 'regulatory, compliance, legal, finance, telecom, environment, manufacturing, energy, aerospace, logistics and automotive';
?>
<figure class="relative w-full max-w-5xl mx-auto aspect-[1792/1008] mb-10 overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-200/70 dark:border-white/10"
    role="img" aria-label="Symnexus — building AI for <?= e(strtolower($industries)) ?>.">
    <img src="<?= e(asset('images/industries-frame.webp')) ?>"
        srcset="<?= e(asset('images/industries-frame-900.webp')) ?> 900w, <?= e(asset('images/industries-frame.webp')) ?> 1792w"
        sizes="(min-width: 1280px) 1024px, 92vw" width="1792" height="1008" alt="" aria-hidden="true"
        fetchpriority="high" decoding="async" class="absolute inset-0 h-full w-full select-none">
    <video data-motion-video muted playsinline loop preload="auto" aria-hidden="true" tabindex="-1"
        poster="<?= e(asset('images/symnexus-logo-poster.webp')) ?>"
        class="absolute left-[8.2589%] top-[10.2183%] h-[76.9841%] w-[83.7612%] object-cover mix-blend-multiply pointer-events-none">
        <source src="<?= e($logoVideo) ?>" type="video/mp4">
    </video>
</figure>
