'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import type { CampaignStatus } from '@/lib/mail/campaigns';
import { changeAction, launchAction, testAction, type ActionState } from '../actions';
import { autoInput, card, dangerButton, input, Notice, primaryButton, secondaryButton } from '../ui';

const empty: ActionState = { ok: true, message: '' };

// Pause / resume / stop / delete, and a refresh every 15 s while sending.
export function CampaignControls({ id, status, live }: { id: string; status: CampaignStatus; live: boolean }) {
  const [state, action, pending] = useActionState(changeAction, empty);
  const router = useRouter();
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => router.refresh(), 15_000);
    return () => clearInterval(t);
  }, [live, router]);

  const button = (op: string, label: string, className: string, confirm?: string) => (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="op" value={op} />
      <button type="submit" disabled={pending} className={className}>{label}</button>
    </form>
  );

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2 justify-end">
        {(status === 'sending' || status === 'scheduled') && button('pause', 'Pause', secondaryButton)}
        {status === 'paused' && button('resume', 'Resume', secondaryButton)}
        {['scheduled', 'sending', 'paused'].includes(status) &&
          button('stop', 'Stop', dangerButton, 'Stop this campaign? Emails not yet sent, including follow-ups, are cancelled. This cannot be undone.')}
        {['draft', 'completed', 'stopped'].includes(status) &&
          button('delete', 'Delete', dangerButton, 'Delete this campaign and its list? Emails already sent stay in the mailbox’s Sent Items.')}
      </div>
      {state.message && <div className="max-w-md"><Notice state={state} /></div>}
    </div>
  );
}

export function LaunchPanel({ id, connected, recipients }: { id: string; connected: boolean; recipients: number }) {
  const [state, action, pending] = useActionState(launchAction, empty);
  const [when, setWhen] = useState<'now' | 'later'>('now');
  const [local, setLocal] = useState('');
  // At about 24 emails a minute, within the daily limit.
  const minutes = Math.ceil(recipients / 24);

  return (
    <form
      action={action}
      className={`${card} p-6 space-y-3`}
      onSubmit={(e) => {
        if (!window.confirm(when === 'now' ? `Start sending to ${recipients} people now?` : `Schedule this campaign for ${new Date(local).toLocaleString()}?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="when" value={when} />
      {/* datetime-local is the browser's time zone; the server gets an exact instant. */}
      <input type="hidden" name="start_at" value={local ? new Date(local).toISOString() : ''} />
      <h2 className="text-lg font-semibold text-zinc-900">Launch</h2>
      <label className="flex items-center gap-2 text-sm">
        <input type="radio" checked={when === 'now'} onChange={() => setWhen('now')} /> Send now
      </label>
      <label className="flex flex-wrap items-center gap-2 text-sm">
        <input type="radio" checked={when === 'later'} onChange={() => setWhen('later')} /> Schedule for
        <input
          type="datetime-local"
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
            setWhen('later');
          }}
          className={autoInput}
          required={when === 'later'}
        />
      </label>
      <p className="text-xs text-zinc-500">
        Emails go out at about 24 a minute (Microsoft 365 allows 30), so the first email to everyone takes about {minutes} minute{minutes === 1 ? '' : 's'}, within
        the daily limit in Settings. Follow-ups are timed from each person&rsquo;s previous email.
      </p>
      <Notice state={state} />
      <button type="submit" disabled={pending || !connected || (when === 'later' && !local)} className={primaryButton}>
        {pending ? 'Launching…' : when === 'now' ? 'Launch now' : 'Schedule'}
      </button>
      {!connected && <p className="text-xs text-amber-800">Connect Microsoft 365 in Settings before launching.</p>}
    </form>
  );
}

export function TestPanel({ id, steps, defaultTo }: { id: string; steps: number; defaultTo: string }) {
  const [state, action, pending] = useActionState(testAction, empty);
  return (
    <form action={action} className={`${card} p-6 space-y-3`}>
      <input type="hidden" name="id" value={id} />
      <h2 className="text-lg font-semibold text-zinc-900">Send a test</h2>
      <p className="text-sm text-zinc-500">The email as the first person on the list will get it, with &ldquo;[Test]&rdquo; in the subject.</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input name="to" type="email" required defaultValue={defaultTo} className={input} aria-label="Send the test to" />
        <select name="position" className={autoInput} aria-label="Which email">
          {Array.from({ length: steps }, (_, i) => (
            <option key={i} value={i}>{i === 0 ? 'First email' : `Follow-up ${i}`}</option>
          ))}
        </select>
      </div>
      <Notice state={state} />
      <button type="submit" disabled={pending} className={secondaryButton}>{pending ? 'Sending…' : 'Send test'}</button>
    </form>
  );
}
