<?php
/**
 * Enquiry form posted to /api/contact, which emails it to the company inbox.
 * site.js submits it with fetch and shows the result inline; without
 * JavaScript it is a normal form post that redirects back with ?sent=1 / ?error=1.
 *
 * @var string      $form          'contact' | 'demo' (selects server-side validation and email subject)
 * @var string|null $heading
 * @var bool        $withSubject   Show a Subject field
 * @var array       $inputs        [name, label, type, required, autocomplete]
 * @var array       $selects       [name, label, required, options => [value => label]]
 * @var array       $textarea      [name, label, placeholder, rows]
 * @var string      $submitLabel
 * @var string|null $footnote
 */
$sent   = ($_GET['sent'] ?? '') === '1';
$failed = ($_GET['error'] ?? '') === '1';
$id     = $form;
// Preselect an option from ?interest= (links from the pricing tiers and product pages).
$interest = is_string($_GET['interest'] ?? null) ? $_GET['interest'] : '';
?>
<div id="enquiry" data-form-root class="scroll-mt-28">
    <form action="/api/contact" method="post" data-contact-form
        class="card space-y-5 <?= $sent ? 'hidden' : '' ?>">
        <input type="hidden" name="form" value="<?= e($form) ?>">

        <?php if (!empty($heading)): ?>
            <h2 class="font-sans text-xl font-bold text-gray-900 dark:text-white"><?= e($heading) ?></h2>
        <?php endif; ?>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <?php foreach ($inputs as [$name, $label, $type, $required, $autocomplete]): ?>
                <div>
                    <label for="<?= e($id . '-' . $name) ?>" class="form-label"><?= e($label) ?><?= $required ? ' *' : '' ?></label>
                    <input id="<?= e($id . '-' . $name) ?>" name="<?= e($name) ?>" type="<?= e($type) ?>"
                        autocomplete="<?= e($autocomplete) ?>" maxlength="<?= $type === 'email' ? 254 : 200 ?>" <?= $required ? 'required' : '' ?> class="form-field">
                </div>
            <?php endforeach; ?>
        </div>

        <?php if (!empty($selects)): ?>
            <div class="grid grid-cols-1 gap-5 <?= count($selects) > 1 ? 'sm:grid-cols-2' : '' ?>">
                <?php foreach ($selects as $select): ?>
                    <div>
                        <label for="<?= e($id . '-' . $select['name']) ?>" class="form-label"><?= e($select['label']) ?><?= $select['required'] ? ' *' : '' ?></label>
                        <select id="<?= e($id . '-' . $select['name']) ?>" name="<?= e($select['name']) ?>"
                            <?= $select['required'] ? 'required' : '' ?> class="form-field">
                            <?php foreach ($select['options'] as $value => $optionLabel): ?>
                                <option value="<?= e($value) ?>" <?= $value !== '' && $value === $interest ? 'selected' : '' ?>><?= e($optionLabel) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($withSubject)): ?>
            <div>
                <label for="<?= e($id) ?>-subject" class="form-label">Subject *</label>
                <input id="<?= e($id) ?>-subject" name="subject" type="text" maxlength="150" required class="form-field">
            </div>
        <?php endif; ?>

        <div>
            <label for="<?= e($id . '-' . $textarea['name']) ?>" class="form-label"><?= e($textarea['label']) ?> *</label>
            <textarea id="<?= e($id . '-' . $textarea['name']) ?>" name="<?= e($textarea['name']) ?>"
                required rows="<?= (int) $textarea['rows'] ?>" maxlength="5000" placeholder="<?= e($textarea['placeholder']) ?>"
                class="form-field resize-y"></textarea>
        </div>

        <!-- Spam trap: hidden from people, filled in by bots. -->
        <div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label for="<?= e($id) ?>-website">Leave this field empty</label>
            <input id="<?= e($id) ?>-website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <p data-form-error role="alert" class="<?= $failed ? '' : 'hidden' ?> rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-800 dark:text-rose-200">
            <?php if ($failed): ?>
                We couldn&rsquo;t send your message. Please check the form and try again, or email us at
                <a href="<?= e(mailto()) ?>" class="font-semibold underline"><?= e(SITE_EMAIL) ?></a>.
            <?php endif; ?>
        </p>

        <button type="submit" class="btn-primary w-full group">
            <span data-submit-label><?= e($submitLabel) ?></span>
            <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?>
        </button>

        <?php if (!empty($footnote)): ?>
            <p class="font-body text-xs text-center text-gray-600 dark:text-gray-300"><?= e($footnote) ?></p>
        <?php endif; ?>
        <?php if (booking_url() !== null): ?>
            <p class="font-body text-xs text-center text-gray-600 dark:text-gray-300">
                Prefer to pick a time? <a href="<?= e(booking_url()) ?>" target="_blank" rel="noopener" data-cta="booking-<?= e($form) ?>" class="link-inline">Book a call directly</a>.
            </p>
        <?php endif; ?>
    </form>

    <div data-form-success tabindex="-1" role="status"
        class="<?= $sent ? '' : 'hidden' ?> card flex flex-col items-center justify-center text-center p-12 sm:p-16 min-h-[360px] focus:outline-none">
        <div class="mb-4 h-1 w-10 rounded-full bg-brandPrimary mx-auto" aria-hidden="true"></div>
        <h2 class="font-sans text-2xl font-bold text-gray-900 dark:text-white">Thank you — your message has been sent.</h2>
        <p class="mt-3 max-w-sm body-copy text-sm">
            A member of our team will reply to the email address you provided within one business day.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/" class="btn-primary">Back to home</a>
        </div>
    </div>
</div>
