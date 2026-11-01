'use client';

import { useActionState, useRef } from 'react';
import { autoInput, dangerButton, emptyState, input, label, Notice, primaryButton, secondaryButton } from '@/app/components/ui';
import type { Contact } from '@/lib/work/crm';
import { ACTIVITY_KINDS, ACTIVITY_LABEL, STAGE_LABEL, STAGES } from '@/lib/work/labels';
import { activityAction, deleteContactAction, saveContactAction, stageAction } from './actions';

export interface Person {
  id: string;
  name: string;
}

// Add a contact (no `contact`) or edit one.
export function ContactForm({ contact, people, me }: { contact?: Contact; people: Person[]; me: string }) {
  const [state, action, pending] = useActionState(saveContactAction, emptyState);
  const c = contact;
  return (
    <form action={action} className="space-y-4">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">Name</label>
          <input id="name" name="name" required maxLength={120} defaultValue={c?.name} className={input} autoComplete="off" />
        </div>
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={c?.email ?? ''} className={input} autoComplete="off" />
        </div>
        <div>
          <label className={label} htmlFor="organization">Organization</label>
          <input id="organization" name="organization" maxLength={160} defaultValue={c?.organization} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="title">Job title</label>
          <input id="title" name="title" maxLength={120} defaultValue={c?.title} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" maxLength={40} defaultValue={c?.phone} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="source">Source</label>
          <input id="source" name="source" maxLength={80} defaultValue={c?.source} placeholder="Referral, conference, LinkedIn…" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="stage">Stage</label>
          <select id="stage" name="stage" defaultValue={c?.stage ?? 'lead'} className={input}>
            {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="owner">Owner</label>
          <select id="owner" name="owner" defaultValue={c ? (c.ownerId ?? '') : me} className={input}>
            <option value="">No owner</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="value">Deal value (USD)</label>
          <input id="value" name="value" inputMode="numeric" defaultValue={c?.valueUsd ?? ''} placeholder="e.g. 25000" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="next_step_on">Next step date</label>
          <input id="next_step_on" name="next_step_on" type="date" defaultValue={c?.nextStepOn ?? ''} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="next_step">Next step</label>
          <input id="next_step" name="next_step" maxLength={300} defaultValue={c?.nextStep} placeholder="Send recap and two meeting times" className={input} />
        </div>
      </div>
      <Notice state={state} />
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? 'Saving…' : c ? 'Save changes' : 'Add contact'}
      </button>
    </form>
  );
}

// Moves a contact between stages as soon as a new one is picked.
export function StageSelect({ id, stage }: { id: string; stage: string }) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={stageAction}>
      <input type="hidden" name="id" value={id} />
      <select
        name="stage"
        defaultValue={stage}
        aria-label="Stage"
        onChange={() => form.current?.requestSubmit()}
        className="text-xs rounded-lg border border-zinc-200 bg-white px-1.5 py-1 text-zinc-600"
      >
        {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
      </select>
    </form>
  );
}

export function ActivityForm({ id }: { id: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: typeof emptyState, data: FormData) => {
    const r = await activityAction(prev, data);
    if (r.ok) form.current?.reset();
    return r;
  }, emptyState);
  return (
    <form ref={form} action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <textarea name="body" required rows={3} maxLength={10000} placeholder="What happened, what was agreed, what's next…" className={input} />
      <div className="flex flex-wrap items-center gap-3">
        <select name="kind" defaultValue="note" aria-label="Kind of entry" className={autoInput}>
          {ACTIVITY_KINDS.map((k) => <option key={k} value={k}>{ACTIVITY_LABEL[k]}</option>)}
        </select>
        <button type="submit" disabled={pending} className={secondaryButton}>{pending ? 'Adding…' : 'Add entry'}</button>
      </div>
      <Notice state={state} />
    </form>
  );
}

export function DeleteContact({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(deleteContactAction, emptyState);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Delete ${name} and their history? This cannot be undone.`)) e.preventDefault();
      }}
      className="space-y-2"
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className={dangerButton}>Delete contact</button>
      <Notice state={state} />
    </form>
  );
}
