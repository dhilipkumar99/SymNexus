<?php

declare(strict_types=1);

/**
 * POST /api/chat — the Symnexus AI assistant.
 *
 * Proxies a short conversation to an OpenAI-compatible chat-completions API
 * (Groq by default) with the company briefing in src/ai/instructions.md as the
 * system prompt. Configure with environment variables:
 *
 *   AI_API_KEY (or GROQ_API_KEY)  required — the widget is hidden without it
 *   AI_API_URL                    default https://api.groq.com/openai/v1/chat/completions
 *   AI_MODEL                      default llama-3.3-70b-versatile
 */

require_once __DIR__ . '/http.php';

const CHAT_MAX_MESSAGE_CHARS = 1000;
const CHAT_MAX_HISTORY       = 10;
const CHAT_MAX_BODY_BYTES    = 32768;
const CHAT_RATE_LIMIT        = 20;   // requests…
const CHAT_RATE_WINDOW       = 300;  // …per 5 minutes per IP (best effort, per instance)
const CHAT_GLOBAL_LIMIT      = 300;  // total requests per window per instance

function chat_rate_limited(): bool
{
    return rate_limited('chat', CHAT_RATE_LIMIT, CHAT_GLOBAL_LIMIT, CHAT_RATE_WINDOW);
}

/** @return list<array{role: string, content: string}> */
function chat_clean_history(mixed $history): array
{
    if (!is_array($history)) {
        return [];
    }

    $clean = [];
    foreach (array_slice(array_values($history), -CHAT_MAX_HISTORY) as $msg) {
        if (!is_array($msg) || !is_string($msg['content'] ?? null)) {
            continue;
        }
        $content = trim(mb_substr($msg['content'], 0, 2000));
        if ($content === '') {
            continue;
        }
        $clean[] = [
            'role'    => ($msg['role'] ?? '') === 'user' ? 'user' : 'assistant',
            'content' => $content,
        ];
    }
    return $clean;
}

function handle_chat(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Allow: POST');
        json_respond(405, ['error' => 'Method not allowed.']);
        return;
    }

    $apiKey = env('AI_API_KEY') ?? env('GROQ_API_KEY');
    if ($apiKey === null) {
        json_respond(503, ['error' => 'The assistant is not configured.']);
        return;
    }

    if (!request_is_same_origin()) {
        json_respond(403, ['error' => 'Forbidden.']);
        return;
    }

    if (chat_rate_limited()) {
        json_respond(429, ['error' => "You're sending messages quickly — please wait a moment."]);
        return;
    }

    $raw = file_get_contents('php://input', false, null, 0, CHAT_MAX_BODY_BYTES + 1);
    if ($raw === false || strlen($raw) > CHAT_MAX_BODY_BYTES) {
        json_respond(413, ['error' => 'Message too long.']);
        return;
    }

    $input   = json_decode($raw, true);
    $message = is_array($input) && is_string($input['message'] ?? null) ? trim($input['message']) : '';
    if ($message === '') {
        json_respond(422, ['error' => 'Please type a question.']);
        return;
    }
    if (mb_strlen($message) > CHAT_MAX_MESSAGE_CHARS) {
        json_respond(422, ['error' => 'Please keep questions under ' . CHAT_MAX_MESSAGE_CHARS . ' characters.']);
        return;
    }

    $instructions = @file_get_contents(SRC_DIR . '/ai/instructions.md');
    if ($instructions === false) {
        $instructions = 'You are the assistant for Symnexus, a software company. Answer briefly and direct visitors to {{EMAIL}}.';
    }
    $instructions = str_replace(['{{EMAIL}}', '{{PHONE}}'], [SITE_EMAIL, SITE_PHONE], $instructions);

    $messages = array_merge(
        [['role' => 'system', 'content' => trim($instructions)]],
        chat_clean_history($input['history'] ?? []),
        [['role' => 'user', 'content' => $message]],
    );

    $payload = json_encode([
        'model'       => env('AI_MODEL', 'llama-3.3-70b-versatile'),
        'messages'    => $messages,
        'max_tokens'  => 350,
        'temperature' => 0.4,
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init(env('AI_API_URL', 'https://api.groq.com/openai/v1/chat/completions'));
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ],
    ]);

    $response = curl_exec($ch);
    $status   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    $data  = is_string($response) ? json_decode($response, true) : null;
    $reply = $data['choices'][0]['message']['content'] ?? null;

    if ($status !== 200 || !is_string($reply) || trim($reply) === '') {
        // Log the upstream detail server-side; never echo provider errors to visitors.
        error_log(sprintf('[symnexus chat] upstream failure: HTTP %d %s %s', $status, $curlErr, is_string($response) ? mb_substr($response, 0, 500) : ''));
        json_respond(502, ['error' => 'The assistant is unavailable right now.']);
        return;
    }

    json_respond(200, ['reply' => trim($reply)]);
}
