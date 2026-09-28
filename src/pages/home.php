<?php
$pageTitle = 'Symnexus — Domain-Native Software Systems for Regulated Industries';
$pageMeta  = [
    'description' => 'Symnexus designs and builds domain-native software systems for regulated, technical industries — currently offering FluorocellAI, automated cell image analysis, and ComplianceCall, real-time pharmaceutical compliance tracking.',
];

$gallery = [
    ['darkLab',         'Laboratory at night, lit by instrument displays', '-rotate-2'],
    ['purpleCells',     'Fluorescence microscopy of cells',                'rotate-3'],
    ['labGlassware',    'Laboratory glassware and research equipment',     '-rotate-2'],
    ['microscopeSetup', 'Microscope set up for imaging',                   'rotate-2'],
    ['scientistScope',  'Researcher working at a microscope',              '-rotate-2'],
];

$approach = [
    ['icon' => 'users',        'title' => 'Unique wedge',        'tags' => ['Domain-native', 'Practitioner-validated'], 'body' => 'We build domain-native software, and the working scientists and compliance professionals who use it validate it — we don\'t adapt generic enterprise technology after the fact for the lab.'],
    ['icon' => 'database',     'title' => 'Proprietary data',    'tags' => ['Microscopy', 'Regulatory precedent'],      'body' => 'Every deployment adds annotated microscopy data and mapped regulatory precedent across FDA — a compounding dataset a generic tool cannot replicate.'],
    ['icon' => 'shield-check', 'title' => 'Compliance by design', 'tags' => ['Audit trail', 'FDA'],                     'body' => 'We build full audit-trail transparency into every Symnexus platform by design, rather than bolt it on — critical trust infrastructure for customers operating under FDA and other regulatory bodies.'],
];

require SRC_DIR . '/includes/header.php';
?>

<!-- HERO -->
<?php partial('logo-frame'); ?>

<h1 class="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight transition-colors duration-300">
    Domain-native software<br class="hidden sm:block"> systems, built to fit.
</h1>

<p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-10 transition-colors duration-300">
    We design and build software systems for regulated, technical industries — we engineer them around how your
    team already works, instead of bending your team to fit a generic tool.
    <a href="/about" class="link-inline">A Silicon Valley engineering team</a>, deployed for clients operating globally.
</p>

<div class="flex flex-wrap items-center gap-x-6 gap-y-4">
    <a href="/demo" class="btn-primary group">
        Request a demonstration
        <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?>
    </a>
    <a href="<?= e(mailto()) ?>" class="text-gray-400 hover:text-brandPrimary dark:hover:text-white transition-colors duration-200" aria-label="Email <?= e(SITE_EMAIL) ?>">
        <?= icon('mail', 'w-5 h-5') ?>
    </a>
    <a href="tel:<?= e(SITE_PHONE_TEL) ?>" class="text-gray-400 hover:text-brandPrimary dark:hover:text-white transition-colors duration-200" aria-label="Call <?= e(SITE_PHONE) ?>">
        <?= icon('phone', 'w-5 h-5') ?>
    </a>
</div>

<!-- GALLERY -->
<div class="relative w-screen left-1/2 -translate-x-1/2 overflow-visible my-6">
    <div tabindex="0" role="region" aria-label="Photo gallery" class="focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary flex flex-row items-center lg:justify-center gap-10 overflow-x-auto overflow-y-visible py-10 w-full px-6 sm:px-8 no-scrollbar">
        <?php foreach ($gallery as $i => [$key, $alt, $rotate]): ?>
            <div class="group relative w-64 h-80 shadow-2xl border border-white/5 flex-shrink-0 transform <?= $rotate ?>">
                <div class="w-full h-full rounded-3xl overflow-hidden relative">
                    <img src="<?= e(img($key, 640)) ?>" alt="<?= e($alt) ?>" width="256" height="320"
                        <?= $i > 1 ? 'loading="lazy"' : '' ?> decoding="async" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                <span class="absolute bottom-4 left-4 z-20 text-white/80 text-xs font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Photo: Unsplash
                </span>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- CURRENTLY OFFERING -->
<section class="panel mt-6" aria-labelledby="offering-title">
    <div class="mb-6 md:mb-8">
        <h2 id="offering-title" class="section-title">Currently Offering</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <?php foreach (PRODUCTS as $slug => $p): ?>
            <article class="card-ghost flex flex-col h-full group">
                <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2"><?= e($p['category']) ?></p>
                <h3 class="font-sans text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300"><?= e($p['name']) ?></h3>
                <p class="font-body text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow transition-colors duration-300">
                    <?= e($p['summary']) ?>
                </p>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/60 dark:border-gray-700/40">
                    <div>
                        <?php if ($p['pricing'] !== null): ?>
                            <a href="/pricing#<?= e($slug) ?>" class="text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 text-sm font-medium transition-colors">Pricing</a>
                        <?php else: ?>
                            <a href="/contact" class="text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 text-sm font-medium transition-colors">Custom system</a>
                        <?php endif; ?>
                    </div>
                    <a href="<?= e($p['href']) ?>" <?= $p['external'] ? 'target="_blank" rel="noopener noreferrer"' : '' ?>
                        class="text-teal-700 dark:text-teal-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium inline-flex items-center transition-colors">
                        <?= e($p['link']) ?>
                        <?= icon($p['external'] ? 'arrow-up-right' : 'arrow-right', 'w-3.5 h-3.5 ml-1') ?>
                    </a>
                </div>
            </article>
        <?php endforeach; ?>
    </div>

    <p class="mt-10 body-copy text-sm max-w-2xl">
        We build domain-native software systems for many industries —
        <a href="/contact" class="link-inline">reach out</a> if you&rsquo;re seeking AI development services.
    </p>

    <div class="mt-6">
        <a href="/products" class="link-arrow group">
            View all products
            <?= icon('chevron-right', 'w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform') ?>
        </a>
    </div>
</section>

<!-- APPROACH -->
<section class="panel mt-10" aria-labelledby="approach-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <h2 id="approach-title" class="section-title">Domain-native software systems.</h2>
        <p class="section-lead">
            For cell researchers, FluorocellAI turned a 3–4 day manual review into a same-day first pass — because the system is built around
            how a lab already works, not the other way around.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
        <?php foreach ($approach as $card): ?>
            <div class="card flex flex-col h-full">
                <div class="icon-badge mb-6"><?= icon($card['icon'], 'w-5 h-5') ?></div>
                <h3 class="font-sans text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300"><?= e($card['title']) ?></h3>
                <div class="font-body text-sm font-medium mb-4 flex flex-wrap gap-1.5 items-center">
                    <?php foreach ($card['tags'] as $t => $tag): ?>
                        <?php if ($t > 0): ?><span class="text-emerald-700/50 dark:text-emerald-500/50 font-bold" aria-hidden="true">·</span><?php endif; ?>
                        <span class="text-teal-700 dark:text-teal-400"><?= e($tag) ?></span>
                    <?php endforeach; ?>
                </div>
                <p class="font-body text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow transition-colors duration-300"><?= e($card['body']) ?></p>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="mt-10">
        <a href="/about" class="link-arrow group">
            What makes our software different
            <?= icon('chevron-right', 'w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform') ?>
        </a>
    </div>
</section>

<!-- RESEARCH + LEADERSHIP -->
<section class="panel mt-10" aria-labelledby="research-title">
    <div class="mb-6 md:mb-8">
        <h2 id="research-title" class="section-title">Latest Research</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start w-full">

        <div class="flex flex-col gap-12">
            <article class="group relative flex flex-col items-start">
                <h3 class="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                    <span class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl" aria-hidden="true"></span>
                    <a href="/research/fluorocellai-cancer-research-lab">
                        <span class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                        <span class="relative z-10">FluorocellAI, in a cancer-research lab.</span>
                    </a>
                </h3>
                <p class="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5">
                    <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                        <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
                    </span>
                    Case Study
                </p>
                <p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    A cancer-research lab's cell-analysis workflow, before and after FluorocellAI. FluorocellAI compresses
                    manual review of cells from a week of manual cross-referencing to a same-day first pass.
                </p>
                <div aria-hidden="true" class="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-700">
                    Read case study
                    <?= icon('arrow-up-right', 'ml-1 h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200') ?>
                </div>
            </article>

            <div>
                <a href="/research" class="link-arrow group">
                    View all research
                    <?= icon('chevron-right', 'w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform') ?>
                </a>
            </div>
        </div>

        <div class="card-inset">
            <div class="flex items-center gap-3 mb-6">
                <div class="text-gray-500 dark:text-teal-400"><?= icon('briefcase', 'w-5 h-5') ?></div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">Leadership</h3>
            </div>

            <div class="space-y-6 mb-6">
                <?php foreach ([['DR', 'Dhilip Raman', 'Chief Executive Officer'], ['JR', 'Jacob Matthew Rajesh', 'Chief Technical Officer']] as [$initials, $name, $role]): ?>
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-600/50">
                            <span class="text-xs font-bold text-brandNeutral tracking-tighter"><?= e($initials) ?></span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold text-gray-900 dark:text-white leading-tight"><?= e($name) ?></span>
                            <span class="text-xs text-teal-700 dark:text-teal-400 mt-0.5 font-medium"><?= e($role) ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-300 mb-6">
                Silicon Valley engineers from NXP Semiconductors, Zoom, Amazon, and ServiceNow, plus Berkeley- and
                Stanford-trained researchers.
            </p>

            <a href="/about"
                class="group w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium py-3 px-4 bg-gray-100 hover:bg-gray-200/80 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 dark:text-zinc-200 border border-gray-300/60 dark:border-gray-700/50 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200">
                Meet the team
                <?= icon('arrow-right', 'w-3.5 h-3.5 animate-drop-twice') ?>
            </a>
        </div>

    </div>
</section>

<?php partial('cta', [
    'title'     => 'We build new, innovative AI products for businesses around the world.',
    'body'      => 'The people who build the product run your demonstration and build it around your workflow.',
    'primary'   => ['label' => 'Request a demonstration', 'href' => '/demo'],
    'secondary' => ['label' => 'View pricing', 'href' => '/pricing'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
