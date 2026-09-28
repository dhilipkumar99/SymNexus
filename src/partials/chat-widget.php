<!-- AI assistant: rendered only when AI_API_KEY / GROQ_API_KEY is configured -->
<div id="chat-trigger-container" class="fixed bottom-5 right-4 sm:right-5 z-[9999] font-sans antialiased">
    <button id="chat-toggle-btn" type="button" aria-controls="ai-chat-window" aria-expanded="false" aria-label="Open the Symnexus AI assistant"
        class="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-brandNeutral text-brandNeutral dark:text-white shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,150,136,0.4)] hover:shadow-[0_0_25px_rgba(0,150,136,0.6)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary">
        <span id="toggle-icon-open" class="block" aria-hidden="true">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
        </span>
        <span id="toggle-icon-close" class="hidden" aria-hidden="true">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </span>
    </button>
</div>

<div id="ai-chat-window" role="dialog" aria-label="Symnexus AI assistant"
    class="hidden fixed bottom-0 left-0 right-0 sm:left-auto sm:right-4 sm:bottom-24 w-full sm:w-[380px] h-[60vh] sm:h-[520px] bg-white/70 dark:bg-slate-950/80 backdrop-blur-md border-t sm:border border-white/40 dark:border-slate-800/60 rounded-t-xl sm:rounded-xl flex-col overflow-hidden origin-bottom-right shadow-[0_8px_32px_0_rgba(15,23,42,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] z-[9999]">

    <div class="px-5 py-4 border-b border-gray-200/50 dark:border-slate-800/60 flex items-center justify-between bg-white/30 dark:bg-slate-950/40 flex-shrink-0">
        <div class="flex items-center gap-2.5">
            <span class="relative flex h-2 w-2" aria-hidden="true">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400"></span>
            </span>
            <span class="font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 font-semibold dark:font-normal">
                Symnexus AI
            </span>
        </div>
        <button type="button" data-chat-close
            class="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary rounded p-1"
            aria-label="Close chat">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

    <div id="chat-screen" class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scroll-smooth" aria-live="polite">
        <!-- Messages are rendered by chat.js -->
    </div>

    <form id="chat-form" class="p-3 sm:p-4 bg-white/60 dark:bg-slate-950/80 border-t border-gray-200/50 dark:border-slate-800/60 flex items-center gap-2.5 flex-shrink-0">
        <label for="chat-input" class="sr-only">Ask the Symnexus AI assistant</label>
        <input type="text" id="chat-input" maxlength="1000" autocomplete="off" placeholder="Ask about our products or services…"
            class="flex-1 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 font-normal dark:font-light text-sm rounded-lg px-4 py-2.5 border border-gray-200/60 dark:border-slate-800/80 focus:outline-none focus:border-brandPrimary dark:focus:border-slate-700 transition-colors shadow-inner min-w-0">
        <button type="submit"
            class="bg-slate-900 hover:bg-black text-white dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-slate-800 p-2.5 rounded-lg border border-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary flex items-center justify-center flex-shrink-0 shadow-md disabled:opacity-50"
            aria-label="Send message">
            <svg class="w-4 h-4 transform -rotate-45 -translate-x-0.5 translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
        </button>
    </form>
</div>

<script src="<?= e(asset('js/chat.js')) ?>" defer></script>
