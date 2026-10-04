<?php
/**
 * Hero brand panel: the animated SymNexus logo inside a frame of industry tiles.
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
<!--
  Clicking the frame plays the SymNexus film (FEATURE_VIDEO) inside it, with sound;
  public/assets/js/site.js ("Hero film") drives it. The click target is a real link
  to /video, so without JavaScript (or with Cmd/Ctrl-click) it opens that page.
  The film is 3:2 and the frame 16:9; it shows whole, centred on white so it
  blends into the frame (cropping to fill would clip its title cards).
-->
<div data-logo-player
    class="relative w-full max-w-5xl mx-auto aspect-[1792/1008] mb-10 overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-200/70 dark:border-white/10">
    <figure class="absolute inset-0 m-0" role="img" aria-label="SymNexus — building AI for <?= e(strtolower($industries)) ?>.">
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

    <a href="/video" data-logo-play data-no-spa aria-label="Play the SymNexus film"
        class="group absolute inset-0 z-10 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-teal-600/70">
        <!-- Play cue: shows on hover and keyboard focus. -->
        <span aria-hidden="true"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-teal-700/85 text-white shadow-lg ring-4 ring-white/70 opacity-0 scale-90 transition duration-300 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100">
            <svg class="h-6 w-6 sm:h-8 sm:w-8 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.24-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z"/></svg>
        </span>
    </a>

    <video data-feature-video controls playsinline preload="none" tabindex="-1"
        aria-label="The SymNexus film"
        class="hidden absolute inset-0 z-20 h-full w-full bg-white object-contain">
        <source src="<?= e(FEATURE_VIDEO) ?>" type="video/mp4">
    </video>

    <button type="button" data-logo-close aria-label="Close the film and show the logo"
        class="hidden absolute right-3 top-3 z-30 h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z"/></svg>
    </button>
</div>
