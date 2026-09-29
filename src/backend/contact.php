<?php

declare(strict_types=1);

/**
 * POST /api/contact — contact and demo-request forms.
 *
 * Validates the submission and emails it to the company inbox through the
 * Resend API (https://resend.com), with the visitor's address as Reply-To so a
 * reply from Outlook goes straight back to them.
 *
 * Environment:
 *   RESEND_API_KEY      required — provisioned by the Vercel Marketplace integration
 *   CONTACT_TO_EMAIL    default SITE_EMAIL (info@symnexus.co)
 *   CONTACT_FROM_EMAIL  default "Symnexus Website <website@symnexus.co>"; the domain
 *                       must be verified in Resend
 *
 * Works with fetch (JSON in/out, used by site.js) and with a plain HTML form
 * post when JavaScript is off (redirects back to the page with ?sent=1 / ?error=1).
 */

require_once __DIR__ . '/http.php';

const CONTACT_RATE_LIMIT   = 5;    // submissions…
const CONTACT_RATE_WINDOW  = 600;  // …per 10 minutes per IP
const CONTACT_GLOBAL_LIMIT = 100;
const CONTACT_MAX_BODY     = 32768;

/** Single-line field: trimmed, control characters (incl. CR/LF) removed, length-capped. */
function contact_line(mixed $value, int $max): string
{
    $value = is_string($value) ? $value : '';
    $value = (string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    return trim(mb_substr($value, 0, $max));
}

/** Multi-line field: keeps line breaks, strips other control characters. */
function contact_text(mixed $value, int $max): string
{
    $value = is_string($value) ? str_replace(["\r\n", "\r"], "\n", $value) : '';
    $value = (string) preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $value);
    return trim(mb_substr($value, 0, $max));
}

/**
 * @return array{0: array<string, string>, 1: list<string>} [clean data, error messages]
 */
function contact_validate(array $in): array
{
    $form = ($in['form'] ?? '') === 'demo' ? 'demo' : 'contact';

    $d = [
        'form'         => $form,
        'firstName'    => contact_line($in['firstName'] ?? null, 100),
        'lastName'     => contact_line($in['lastName'] ?? null, 100),
        'email'        => contact_line($in['email'] ?? null, 254),
        'phone'        => contact_line($in['phone'] ?? null, 40),
        'organization' => contact_line($in['organization'] ?? null, 200),
        'role'         => contact_line($in['role'] ?? null, 120),
        'subject'      => contact_line($in['subject'] ?? null, 150),
        'product'      => CONTACT_PRODUCTS[$in['product'] ?? ''] ?? '',
        'labType'      => CONTACT_ORG_TYPES[$in['labType'] ?? ''] ?? '',
        'message'      => contact_text($in['message'] ?? null, 5000),
    ];

    $errors = [];
    foreach (['firstName' => 'first name', 'lastName' => 'last name', 'organization' => 'organization', 'message' => 'message'] as $key => $label) {
        if ($d[$key] === '') {
            $errors[] = "Please enter your $label.";
        }
    }
    if ($d['email'] === '' || filter_var($d['email'], FILTER_VALIDATE_EMAIL) === false) {
        $errors[] = 'Please enter a valid email address.';
    }
    if ($form === 'contact' && $d['subject'] === '') {
        $errors[] = 'Please enter a subject.';
    }
    if ($form === 'demo' && $d['product'] === '') {
        $errors[] = 'Please choose a product of interest.';
    }

    return [$d, $errors];
}

/** @return array{subject: string, text: string, html: string} */
function contact_compose(array $d): array
{
    $name = $d['firstName'] . ' ' . $d['lastName'];
    $subject = $d['form'] === 'demo'
        ? 'Demonstration request — ' . $d['organization']
        : 'Website enquiry: ' . $d['subject'];

    $rows = array_filter([
        'Name'                => $name,
        'Email'               => $d['email'],
        'Phone'               => $d['phone'],
        'Organization'        => $d['organization'],
        'Role'                => $d['role'],
        'Subject'             => $d['form'] === 'contact' ? $d['subject'] : '',
        'Product of interest' => $d['product'],
        'Organization type'   => $d['labType'],
    ], static fn(string $v): bool => $v !== '');

    $source = $d['form'] === 'demo' ? '/demo (Request a Demonstration)' : '/contact (Contact)';

    $text = '';
    foreach ($rows as $label => $value) {
        $text .= "$label: $value\n";
    }
    $text .= "\nMessage:\n" . $d['message'] . "\n\n— Sent from the symnexus.co form at $source";

    $html = '<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">';
    foreach ($rows as $label => $value) {
        $html .= '<tr><td style="color:#555;vertical-align:top"><strong>' . e($label) . '</strong></td><td>' . e($value) . '</td></tr>';
    }
    $html .= '</table><p style="font-family:Arial,sans-serif;font-size:14px"><strong>Message</strong></p>'
        . '<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">' . nl2br(e($d['message'])) . '</p>'
        . '<p style="font-family:Arial,sans-serif;font-size:12px;color:#888">Sent from the symnexus.co form at ' . e($source) . '</p>';

    return ['subject' => $subject, 'text' => $text, 'html' => $html];
}

/** Deliver through Resend. Returns true on success; logs details (never shown to visitors). */
function contact_send(array $d, string $apiKey): bool
{
    $mail = contact_compose($d);
    $payload = json_encode([
        'from'     => env('CONTACT_FROM_EMAIL', 'Symnexus Website <website@symnexus.co>'),
        'to'       => [env('CONTACT_TO_EMAIL', SITE_EMAIL)],
        'reply_to' => $d['firstName'] . ' ' . $d['lastName'] . ' <' . $d['email'] . '>',
        'subject'  => $mail['subject'],
        'text'     => $mail['text'],
        'html'     => $mail['html'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $ch = curl_init(env('RESEND_API_URL', 'https://api.resend.com/emails'));
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            // Same submission within the same minute is sent once, even if double-submitted.
            'Idempotency-Key: contact-' . hash('sha256', $payload . floor(time() / 60)),
        ],
    ]);
    $response = curl_exec($ch);
    $status   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($status >= 200 && $status < 300) {
        return true;
    }
    error_log(sprintf('[symnexus contact] Resend failure: HTTP %d %s %s', $status, $curlErr, is_string($response) ? mb_substr($response, 0, 500) : ''));
    return false;
}

function handle_contact(): void
{
    $wantsJson = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')
        || str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

    // Where a no-JS form post returns to (only our own two form pages).
    $back = ($_POST['form'] ?? '') === 'demo' ? '/demo' : '/contact';

    $fail = static function (int $status, string $message) use ($wantsJson, $back): void {
        if ($wantsJson) {
            json_respond($status, ['ok' => false, 'error' => $message]);
        } else {
            header('Location: ' . $back . '?error=1#enquiry', true, 303);
        }
    };

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Allow: POST');
        json_respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
        return;
    }
    if (!request_is_same_origin()) {
        $fail(403, 'Forbidden.');
        return;
    }
    if (rate_limited('contact', CONTACT_RATE_LIMIT, CONTACT_GLOBAL_LIMIT, CONTACT_RATE_WINDOW)) {
        $fail(429, 'Too many messages from your connection — please try again in a few minutes, or email ' . SITE_EMAIL . '.');
        return;
    }

    if ($wantsJson) {
        $raw = file_get_contents('php://input', false, null, 0, CONTACT_MAX_BODY + 1);
        if ($raw === false || strlen($raw) > CONTACT_MAX_BODY) {
            $fail(413, 'Your message is too long.');
            return;
        }
        $input = json_decode($raw, true);
        $input = is_array($input) ? $input : [];
    } else {
        $input = $_POST;
    }

    // Honeypot: real visitors never see or fill the "website" field. Pretend success for bots.
    if (trim((string) ($input['website'] ?? '')) !== '') {
        $wantsJson ? json_respond(200, ['ok' => true]) : header('Location: ' . $back . '?sent=1#enquiry', true, 303);
        return;
    }

    [$data, $errors] = contact_validate($input);
    if ($errors !== []) {
        $fail(422, implode(' ', $errors));
        return;
    }

    $apiKey = env('RESEND_API_KEY');
    if ($apiKey === null) {
        error_log('[symnexus contact] RESEND_API_KEY is not configured; message not sent.');
        $fail(503, 'Our message service is temporarily unavailable. Please email us directly at ' . SITE_EMAIL . '.');
        return;
    }

    if (!contact_send($data, $apiKey)) {
        $fail(502, 'We couldn\'t send your message just now. Please try again, or email us directly at ' . SITE_EMAIL . '.');
        return;
    }

    if ($wantsJson) {
        json_respond(200, ['ok' => true]);
    } else {
        header('Location: ' . $back . '?sent=1#enquiry', true, 303);
    }
}
