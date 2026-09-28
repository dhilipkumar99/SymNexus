<?php
/**
 * Media carousel with lightbox support (reference "projects" card media).
 *
 * @var string $label   Accessible name, e.g. "FluorocellAI media"
 * @var array  $slides  List of ['img' => key, 'alt' => text] or ['partial' => name]
 */
$count = count($slides);
?>
<div class="relative w-full aspect-video bg-slate-950 overflow-hidden group/carousel" data-carousel
    role="region" aria-roledescription="carousel" aria-label="<?= e($label) ?>">

    <div class="flex h-full w-full transition-transform duration-300 ease-out" data-carousel-track data-current="0">
        <?php foreach ($slides as $i => $slide): ?>
            <div class="w-full h-full flex-shrink-0 relative select-none" role="group" aria-roledescription="slide" aria-label="<?= $i + 1 ?> of <?= $count ?>">
                <?php if (isset($slide['asset'])): ?>
                    <img src="<?= e(asset($slide['asset'])) ?>"
                        <?php if (isset($slide['small'])): ?>srcset="<?= e(asset($slide['small'])) ?> <?= (int) $slide['smallWidth'] ?>w, <?= e(asset($slide['asset'])) ?> <?= (int) $slide['width'] ?>w" sizes="(min-width: 768px) 560px, 92vw"<?php endif; ?>
                        alt="<?= e($slide['alt']) ?>" loading="<?= $i === 0 ? 'eager' : 'lazy' ?>" decoding="async"
                        class="w-full h-full <?= e($slide['fit'] ?? 'object-cover') ?> bg-black cursor-zoom-in" data-lightbox role="button" tabindex="0"
                        data-lightbox-src="<?= e(asset($slide['asset'])) ?>" data-lightbox-alt="<?= e($slide['alt']) ?>">
                <?php elseif (isset($slide['img'])): ?>
                    <img src="<?= e(img($slide['img'], 1000)) ?>" alt="<?= e($slide['alt']) ?>" loading="<?= $i === 0 ? 'eager' : 'lazy' ?>" decoding="async"
                        class="w-full h-full object-cover cursor-zoom-in" data-lightbox role="button" tabindex="0"
                        data-lightbox-src="<?= e(img($slide['img'], 1800)) ?>" data-lightbox-alt="<?= e($slide['alt']) ?>">
                <?php else: ?>
                    <div class="w-full h-full cursor-zoom-in" data-lightbox role="button" tabindex="0" aria-label="Enlarge interface preview">
                        <?php partial($slide['partial']); ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>

    <?php if ($count > 1): ?>
        <button type="button" data-carousel-prev aria-label="Previous slide"
            class="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-brandNeutral/60 hover:bg-brandNeutral text-white rounded-full p-2 sm:opacity-0 sm:group-hover/carousel:opacity-100 focus:opacity-100 transition-opacity duration-200 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <?= icon('chevron-left', 'w-5 h-5') ?>
        </button>
        <button type="button" data-carousel-next aria-label="Next slide"
            class="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-brandNeutral/60 hover:bg-brandNeutral text-white rounded-full p-2 sm:opacity-0 sm:group-hover/carousel:opacity-100 focus:opacity-100 transition-opacity duration-200 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <?= icon('chevron-right', 'w-5 h-5') ?>
        </button>
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5" aria-hidden="true">
            <?php for ($i = 0; $i < $count; $i++): ?>
                <span data-carousel-dot aria-current="<?= $i === 0 ? 'true' : 'false' ?>"
                    class="h-1.5 w-1.5 rounded-full bg-white/40 aria-[current=true]:bg-white aria-[current=true]:w-4 transition-all"></span>
            <?php endfor; ?>
        </div>
    <?php endif; ?>
</div>
