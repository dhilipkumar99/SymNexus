<?php
/**
 * Enquiry form that opens the visitor's email client with a pre-filled
 * message to the company inbox (see site.js → submitMailtoForm). Without
 * JavaScript it falls back to a plain mailto: form submission.
 *
 * @var string      $id            Unique prefix for field ids
 * @var string|null $heading
 * @var string      $subject       Email subject prefix
 * @var string      $subjectField  Field whose value is appended to the subject
 * @var array       $inputs        [name, label, type, required, autocomplete]
 * @var array       $selects       [name, label, required, options => [value => label]]
 * @var array       $textarea      [name, label, placeholder, rows]
 * @var string      $submitLabel
 * @var string|null $footnote
 * @var string      $successTitle
 */
?>
<div data-form-root>
    <form action="<?= e(mailto($subject)) ?>" method="post" enctype="text/plain"
        data-mailto-form="<?= e(SITE_EMAIL) ?>" data-subject="<?= e($subject) ?>" data-subject-field="<?= e($subjectField) ?>"
        class="card space-y-5">

        <?php if (!empty($heading)): ?>
            <h2 class="font-sans text-xl font-bold text-gray-900 dark:text-white"><?= e($heading) ?></h2>
        <?php endif; ?>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <?php foreach ($inputs as [$name, $label, $type, $required, $autocomplete]): ?>
                <div>
                    <label for="<?= e($id . '-' . $name) ?>" class="form-label"><?= e($label) ?><?= $required ? ' *' : '' ?></label>
                    <input id="<?= e($id . '-' . $name) ?>" name="<?= e($name) ?>" type="<?= e($type) ?>" data-label="<?= e($label) ?>"
                        autocomplete="<?= e($autocomplete) ?>" maxlength="200" <?= $required ? 'required' : '' ?> class="form-field">
                </div>
            <?php endforeach; ?>
        </div>

        <?php if (!empty($selects)): ?>
            <div class="grid grid-cols-1 gap-5 <?= count($selects) > 1 ? 'sm:grid-cols-2' : '' ?>">
                <?php foreach ($selects as $select): ?>
                    <div>
                        <label for="<?= e($id . '-' . $select['name']) ?>" class="form-label"><?= e($select['label']) ?><?= $select['required'] ? ' *' : '' ?></label>
                        <select id="<?= e($id . '-' . $select['name']) ?>" name="<?= e($select['name']) ?>" data-label="<?= e($select['label']) ?>"
                            <?= $select['required'] ? 'required' : '' ?> class="form-field">
                            <?php foreach ($select['options'] as $value => $optionLabel): ?>
                                <option value="<?= e($value) ?>"><?= e($optionLabel) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div>
            <label for="<?= e($id . '-' . $textarea['name']) ?>" class="form-label"><?= e($textarea['label']) ?> *</label>
            <textarea id="<?= e($id . '-' . $textarea['name']) ?>" name="<?= e($textarea['name']) ?>" data-label="<?= e($textarea['label']) ?>"
                required rows="<?= (int) $textarea['rows'] ?>" maxlength="4000" placeholder="<?= e($textarea['placeholder']) ?>"
                class="form-field resize-y"></textarea>
        </div>

        <button type="submit" class="btn-primary w-full group">
            <?= e($submitLabel) ?>
            <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?>
        </button>

        <p class="font-body text-xs text-center text-gray-500 dark:text-gray-400">
            <?= e($footnote ?? 'Submitting opens your email app with your message ready to send.') ?>
        </p>
    </form>

    <div data-form-success tabindex="-1" role="status"
        class="hidden card flex flex-col items-center justify-center text-center p-12 sm:p-16 min-h-[360px] focus:outline-none">
        <div class="mb-4 h-1 w-10 rounded-full bg-brandPrimary mx-auto" aria-hidden="true"></div>
        <h2 class="font-sans text-2xl font-bold text-gray-900 dark:text-white"><?= e($successTitle) ?></h2>
        <p class="mt-3 max-w-sm body-copy text-sm">
            Your email client should have opened with your message pre-filled — just hit send. If it didn't open, email us
            directly at <a href="<?= e(mailto($subject)) ?>" class="link-inline"><?= e(SITE_EMAIL) ?></a>.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" data-form-reset class="btn-secondary">Edit your message</button>
            <a href="/" class="btn-primary">Back to home</a>
        </div>
    </div>
</div>
