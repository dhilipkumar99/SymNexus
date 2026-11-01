'use client';

import { useActionState } from 'react';
import { connectionTestAction, saveSettingsAction, suppressAction, type ActionState } from '../actions';
import { input, Notice, primaryButton, secondaryButton } from '../ui';

const empty: ActionState = { ok: true, message: '' };

export function SenderForm({ settings }: { settings: { fromName: string; signature: string; footer: string; dailyLimit: number } }) {
  const [state, action, pending] = useActionState(saveSettingsAction, empty);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">Sender name</span>
        <input name="from_name" defaultValue={settings.fromName} required maxLength={100} className={input} />
        <span className="block text-xs text-zinc-500 mt-1">
          Available in templates as <code className="font-mono">{'{{ from_name }}'}</code>. The name recipients see next to the address is the mailbox&rsquo;s
          display name in Microsoft 365.
        </span>
      </label>
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">Signature</span>
        <textarea name="signature" defaultValue={settings.signature} rows={4} maxLength={2000} className={input} placeholder={'Best regards,\nThe SymNexus team\nsymnexus.co'} />
      </label>
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">Footer</span>
        <textarea name="footer" defaultValue={settings.footer} rows={2} maxLength={1000} className={input} placeholder="SymNexus, street address, city, state ZIP" />
        <span className="block text-xs text-zinc-500 mt-1">
          Shown small, before the unsubscribe link. US law (CAN-SPAM) requires a valid postal address in commercial email.
        </span>
      </label>
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">Daily limit</span>
        <input name="daily_limit" type="number" min={1} max={10000} defaultValue={settings.dailyLimit} required className={`${input} w-32`} />
        <span className="block text-xs text-zinc-500 mt-1">
          Emails in any 24 hours, across all campaigns. Microsoft 365 allows 10,000 recipients a day, but a new sending address should start low (a few hundred) to
          protect its reputation.
        </span>
      </label>
      <Notice state={state} />
      <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

export function ConnectionPanel({ defaultTo }: { defaultTo: string }) {
  const [state, action, pending] = useActionState(connectionTestAction, empty);
  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">Send a test email to (optional)</span>
        <input name="to" type="email" defaultValue={defaultTo} className={input} />
        <span className="block text-xs text-zinc-500 mt-1">Use an outside address, such as Gmail, to check the email lands in the inbox and not in spam.</span>
      </label>
      <Notice state={state} />
      <button type="submit" disabled={pending} className={secondaryButton}>{pending ? 'Checking…' : 'Check connection'}</button>
    </form>
  );
}

export function SuppressForm() {
  const [state, action, pending] = useActionState(suppressAction, empty);
  return (
    <form action={action} className="space-y-2">
      <textarea name="emails" rows={2} required className={input} placeholder="One or more addresses" aria-label="Addresses not to email" />
      <Notice state={state} />
      <button type="submit" disabled={pending} className={secondaryButton}>{pending ? 'Adding…' : 'Add'}</button>
    </form>
  );
}
