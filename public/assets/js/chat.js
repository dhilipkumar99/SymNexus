/**
 * Symnexus AI assistant widget.
 *
 * Conversation state is kept as plain data in sessionStorage and every message
 * is rendered through textContent/escaping — model or user text is never
 * injected as raw HTML.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'symnexus_chat_history';
    var MAX_HISTORY = 10;
    var GREETING = "Hello! I'm the Symnexus AI assistant. Ask me about FluorocellAI, ComplianceCall, the custom systems we build, or how to request a demonstration.";

    var windowEl = document.getElementById('ai-chat-window');
    var screenEl = document.getElementById('chat-screen');
    var form = document.getElementById('chat-form');
    var input = document.getElementById('chat-input');
    var toggleBtn = document.getElementById('chat-toggle-btn');
    if (!windowEl || !screenEl || !form || !input || !toggleBtn) return;

    var sendBtn = form.querySelector('button[type="submit"]');
    var pending = false;
    var closeTimer = null;

    // ── State ───────────────────────────────────────────────────────────────
    function loadHistory() {
        try {
            var parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(parsed) ? parsed.filter(function (m) {
                return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
            }) : [];
        } catch (e) {
            return [];
        }
    }

    function saveHistory() {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
        } catch (e) { /* storage full or unavailable — chat still works */ }
    }

    var messages = loadHistory();

    // ── Formatting ──────────────────────────────────────────────────────────
    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // One pass over the raw text: URLs, site paths, emails and phone numbers become
    // links, everything else is escaped. Matching once means links never nest.
    var LINK_PATTERN = new RegExp([
        '(https?:\\/\\/[^\\s<>"\']*[^\\s<>"\'.,;:!?)\\]])',                                           // 1: URL
        '(?:^|(?<=[\\s(]))(\\/(?:demo|contact|pricing|products|about|research|careers|fluorocellai|compliancecall)\\b)', // 2: site path
        '([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})',                                            // 3: email
        '(\\+1 \\(\\d{3}\\) \\d{3}-\\d{4})',                                                           // 4: phone
    ].join('|'), 'g');
    var LINK_CLASS = 'text-brandPrimary hover:underline font-semibold';

    function formatReply(text) {
        var html = '';
        var last = 0;
        text.replace(LINK_PATTERN, function (match, url, path, email, phone, offset) {
            html += escapeHtml(text.slice(last, offset));
            last = offset + match.length;
            var label = escapeHtml(match);
            if (url) {
                html += '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="' + LINK_CLASS + ' break-all">' + label + '</a>';
            } else if (path) {
                html += '<a href="' + path + '" class="' + LINK_CLASS + '">' + label + '</a>';
            } else if (email) {
                html += '<a href="mailto:' + escapeHtml(email) + '" class="' + LINK_CLASS + '">' + label + '</a>';
            } else {
                html += '<a href="tel:' + phone.replace(/[^\d+]/g, '') + '" class="' + LINK_CLASS + '">' + label + '</a>';
            }
            return match;
        });
        html += escapeHtml(text.slice(last));
        return html.replace(/\n/g, '<br>');
    }

    // ── Rendering ───────────────────────────────────────────────────────────
    function bubble(role, content) {
        var isUser = role === 'user';
        var row = document.createElement('div');
        row.className = 'flex items-start gap-3 max-w-[92%] animate-fadeIn' + (isUser ? ' ml-auto flex-row-reverse' : '');

        var avatar = document.createElement('div');
        avatar.className = 'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm text-[10px] font-bold ' +
            (isUser ? 'bg-white border border-gray-200/80 text-slate-600' : 'bg-brandPrimary text-white');
        avatar.textContent = isUser ? 'You' : 'AI';
        avatar.setAttribute('aria-hidden', 'true');

        var body = document.createElement('div');
        body.className = 'space-y-1' + (isUser ? ' text-right' : '');

        var label = document.createElement('span');
        label.className = 'block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold dark:font-normal';
        label.textContent = isUser ? 'You' : 'Symnexus AI';

        var text = document.createElement('div');
        text.className = 'text-slate-800 dark:text-slate-100 text-sm font-normal dark:font-light leading-relaxed bg-white/60 dark:bg-slate-900/40 px-3.5 py-2.5 rounded-lg border border-white/80 dark:border-slate-800/50 shadow-sm text-left break-words';
        if (isUser) text.textContent = content;
        else text.innerHTML = formatReply(content);

        body.appendChild(label);
        body.appendChild(text);
        row.appendChild(avatar);
        row.appendChild(body);
        return row;
    }

    function renderAll() {
        screenEl.textContent = '';
        screenEl.appendChild(bubble('assistant', GREETING));
        messages.forEach(function (m) { screenEl.appendChild(bubble(m.role, m.content)); });
        screenEl.scrollTop = screenEl.scrollHeight;
    }

    function showTyping() {
        var el = document.createElement('div');
        el.id = 'ai-loading-placeholder';
        el.className = 'flex items-start gap-3 max-w-[85%] animate-pulse';
        el.setAttribute('aria-label', 'Symnexus AI is typing');
        el.innerHTML =
            '<div class="w-7 h-7 rounded-lg bg-brandPrimary/60 flex-shrink-0"></div>' +
            '<div class="space-y-2 w-full pt-1">' +
            '<div class="h-2.5 bg-gray-200 dark:bg-slate-800 rounded w-1/3"></div>' +
            '<div class="space-y-1.5 bg-white/40 dark:bg-slate-900/40 p-3 rounded-lg border border-white/80 dark:border-slate-800/30 w-full">' +
            '<div class="h-2 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>' +
            '<div class="h-2 bg-gray-200 dark:bg-slate-800 rounded w-5/6"></div>' +
            '</div></div>';
        screenEl.appendChild(el);
        screenEl.scrollTop = screenEl.scrollHeight;
    }

    function hideTyping() {
        var el = document.getElementById('ai-loading-placeholder');
        if (el) el.remove();
    }

    function showError(message) {
        var el = document.createElement('div');
        el.className = 'text-rose-800 dark:text-rose-300 text-xs leading-relaxed bg-rose-50/80 dark:bg-rose-950/30 px-3.5 py-2.5 rounded-lg border border-rose-200 dark:border-rose-900/40 animate-fadeIn';
        el.setAttribute('role', 'alert');
        el.textContent = message;
        screenEl.appendChild(el);
        screenEl.scrollTop = screenEl.scrollHeight;
    }

    // ── Open / close ────────────────────────────────────────────────────────
    function setOpen(open) {
        clearTimeout(closeTimer);
        document.getElementById('toggle-icon-open').classList.toggle('hidden', open);
        document.getElementById('toggle-icon-close').classList.toggle('hidden', !open);
        toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', open ? 'Close the Symnexus AI assistant' : 'Open the Symnexus AI assistant');

        if (open) {
            windowEl.classList.remove('hidden', 'animate-apple-close');
            windowEl.classList.add('flex', 'animate-apple-open');
            screenEl.scrollTop = screenEl.scrollHeight;
            adjustForKeyboard();
            input.focus();
        } else {
            var trigger = document.getElementById('chat-trigger-container');
            if (trigger) trigger.style.bottom = '';
            windowEl.classList.remove('animate-apple-open');
            windowEl.classList.add('animate-apple-close');
            closeTimer = setTimeout(function () {
                windowEl.classList.add('hidden');
                windowEl.classList.remove('flex', 'animate-apple-close');
                windowEl.style.bottom = '';
                windowEl.style.height = '';
            }, 340);
        }
    }

    function isOpen() {
        return !windowEl.classList.contains('hidden') && !windowEl.classList.contains('animate-apple-close');
    }

    // Keep the chat above the on-screen keyboard on phones.
    function adjustForKeyboard() {
        if (!window.visualViewport || window.innerWidth >= 640 || !isOpen()) return;
        var keyboard = window.innerHeight - window.visualViewport.height;
        var trigger = document.getElementById('chat-trigger-container');
        if (keyboard > 50) {
            windowEl.style.bottom = keyboard + 'px';
            windowEl.style.height = (window.visualViewport.height * 0.6) + 'px';
            if (trigger) trigger.style.bottom = (keyboard + 20) + 'px';
        } else {
            windowEl.style.bottom = '';
            windowEl.style.height = '';
            if (trigger) trigger.style.bottom = '';
        }
    }

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', adjustForKeyboard);
    }

    // ── Sending ─────────────────────────────────────────────────────────────
    function send(text) {
        pending = true;
        sendBtn.disabled = true;

        var prior = messages.slice(-MAX_HISTORY);
        messages.push({ role: 'user', content: text });
        saveHistory();
        screenEl.appendChild(bubble('user', text));
        showTyping();

        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ message: text, history: prior }),
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (!res.ok || typeof data.reply !== 'string') {
                    throw new Error(data.error || 'The assistant is unavailable right now.');
                }
                return data.reply;
            });
        }).then(function (reply) {
            hideTyping();
            messages.push({ role: 'assistant', content: reply });
            saveHistory();
            screenEl.appendChild(bubble('assistant', reply));
            screenEl.scrollTop = screenEl.scrollHeight;
        }).catch(function (err) {
            hideTyping();
            showError((err && err.message ? err.message : 'Something went wrong.') + ' You can always email us at cell.ai.solutions@gmail.com.');
        }).then(function () {
            pending = false;
            sendBtn.disabled = false;
            input.focus();
        });
    }

    toggleBtn.addEventListener('click', function () { setOpen(!isOpen()); });

    windowEl.addEventListener('click', function (e) {
        if (e.target instanceof Element && e.target.closest('[data-chat-close]')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) setOpen(false);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text || pending) return;
        input.value = '';
        send(text.slice(0, 1000));
    });

    renderAll();
})();
