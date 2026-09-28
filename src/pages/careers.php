<?php
$pageTitle = 'Careers — Symnexus';
$pageMeta  = [
    'description' => 'Symnexus is a small team of Silicon Valley engineers and domain researchers building software systems for regulated industries. Get in touch if you think you\'d be a fit.',
    'og_image'    => img('labTeam', 1200),
];

$values = [
    ['title' => 'Small, senior team',         'body' => 'Silicon Valley engineers from NXP Semiconductors, Zoom, Amazon, and ServiceNow, plus Berkeley- and Stanford-trained researchers. We hire for depth, not headcount.'],
    ['title' => 'Domain-native, not generic', 'body' => 'We build software, and the working scientists and compliance professionals who use it validate it — we don\'t adapt it after the fact for the lab or the regulator.'],
    ['title' => 'Prove it, then teach it',    'body' => 'We prove our models first, then train businesses to manage these systems independently. The same discipline applies to how we build internally.'],
    ['title' => 'Compliance by design',       'body' => 'Full audit-trail transparency is built into everything we ship. That rigor extends to how we operate as a team.'],
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow' => 'Careers',
    'title'   => 'Build software that matters to',
    'highlight' => 'the people who use it.',
    'lead'    => 'We are a small, deep team of Silicon Valley engineers and researchers, deploying software for clients operating around the world. Every person here has meaningful impact on what we build and how we build it.',
]); ?>

<div class="flex flex-wrap gap-3 -mt-4 mb-12">
    <a href="/contact" class="btn-primary">Get in touch</a>
    <a href="/about" class="btn-secondary">About Symnexus</a>
</div>

<!-- How we work -->
<section class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-8" aria-labelledby="how-title">
    <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">How We Work</p>
        <h2 id="how-title" class="section-title">Small team. Deep expertise. Domain-native discipline.</h2>
        <p class="section-lead text-base mb-8">
            Symnexus is building software infrastructure for regulated industries that need precision and accountability
            over convenience. The same is true of how we build our team.
        </p>
        <div class="grid grid-cols-1 gap-4">
            <?php foreach ($values as $i => $v): ?>
                <div class="card p-6 flex gap-4">
                    <div class="flex-shrink-0 font-mono text-xl font-medium text-gray-300 dark:text-gray-500 leading-none mt-0.5">0<?= $i + 1 ?></div>
                    <div>
                        <h3 class="font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($v['title']) ?></h3>
                        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400"><?= e($v['body']) ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
        <div class="col-span-2 transform rotate-1 shadow-2xl rounded-3xl overflow-hidden border border-white/5 aspect-[16/10]">
            <img src="<?= e(img('labTeam', 1000)) ?>" alt="Team working in a research setting" loading="lazy" decoding="async" class="w-full h-full object-cover">
        </div>
        <div class="transform -rotate-2 shadow-xl rounded-3xl overflow-hidden border border-white/5 aspect-square">
            <img src="<?= e(img('labGlassware', 600)) ?>" alt="Laboratory glassware and research equipment" loading="lazy" decoding="async" class="w-full h-full object-cover">
        </div>
        <div class="transform rotate-2 shadow-xl rounded-3xl overflow-hidden border border-white/5 aspect-square">
            <img src="<?= e(img('pipette', 600)) ?>" alt="Researcher using a pipette" loading="lazy" decoding="async" class="w-full h-full object-cover">
        </div>
    </div>
</section>

<!-- Open roles -->
<section id="roles" class="py-16" aria-labelledby="roles-title">
    <div class="mb-6 md:mb-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">Open Roles</p>
        <h2 id="roles-title" class="section-title">No open roles listed right now.</h2>
    </div>
    <div class="rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-transparent p-8 sm:p-10 text-center">
        <h3 class="font-headline text-xl font-bold text-gray-900 dark:text-white">Think you'd be a fit anyway?</h3>
        <p class="mt-2 body-copy text-sm max-w-md mx-auto">We occasionally bring people on outside of a formal listing. If you're exceptional at something that matters for the work we do, introduce yourself.</p>
        <a href="/contact" class="mt-6 link-arrow group">
            Send an introduction
            <?= icon('chevron-right', 'w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform') ?>
        </a>
    </div>
</section>

<?php partial('cta', [
    'title'   => 'Questions before reaching out?',
    'body'    => 'Email us at ' . SITE_EMAIL . '. We read every message.',
    'primary' => ['label' => 'Email us', 'href' => mailto('Careers at Symnexus')],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
