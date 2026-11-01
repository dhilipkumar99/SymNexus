// Styles and small pieces shared by the app's own pages (campaigns, CRM,
// tasks, wiki): server and client components.

const field = 'px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent';
// One width class each: Tailwind does not let a later class override w-full.
export const input = `w-full ${field}`;
export const autoInput = `w-auto ${field}`;
export const inlineInput = `w-20 ${field}`; // inside a sentence: "Wait [3] days"
export const card = 'bg-white rounded-2xl border border-zinc-200';
export const primaryButton = 'px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-60 bg-[var(--primary)] hover:opacity-90';
export const secondaryButton = 'px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60';
export const dangerButton = 'px-3 py-1.5 rounded-xl border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50 disabled:opacity-60';
export const label = 'block text-sm font-medium text-zinc-700 mb-1';

export interface ActionState {
  ok: boolean;
  message: string;
}
export const emptyState: ActionState = { ok: true, message: '' };

export function Notice({ state }: { state: { ok: boolean; message: string } }) {
  if (!state.message) return null;
  return (
    <p role={state.ok ? 'status' : 'alert'} className={`rounded-xl px-4 py-3 text-sm ${state.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-700'}`}>
      {state.message}
    </p>
  );
}

export function when(d: Date | string | null): string {
  return d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
}

// A YYYY-MM-DD date as "Nov 3", or "Nov 3, 2027" outside this year.
export function day(d: string | null): string {
  if (!d) return '';
  const date = new Date(`${d}T12:00:00`);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }) });
}

// Today in the server's or browser's local time, as YYYY-MM-DD.
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
