'use client';

import { useActionState, useRef } from 'react';
import { emptyState, input, label, Notice, primaryButton } from '@/app/components/ui';
import { TASK_STATUS_LABEL, TASK_STATUSES } from '@/lib/work/labels';
import type { Task } from '@/lib/work/tasks';
import { saveTaskAction } from './actions';

interface Option {
  id: string;
  name: string;
}

// Add a task (no `task`) or edit one.
export function TaskForm({
  task,
  people,
  contacts,
  defaults = {},
}: {
  task?: Task;
  people: Option[];
  contacts: Option[];
  defaults?: { assignee?: string; contact?: string };
}) {
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: typeof emptyState, data: FormData) => {
    const r = await saveTaskAction(prev, data);
    if (r.ok && !task) form.current?.reset();
    return r;
  }, emptyState);
  const t = task;
  const prefix = t ? `t-${t.id}-` : 'new-';
  return (
    <form ref={form} action={action} className="space-y-3">
      {t && <input type="hidden" name="id" value={t.id} />}
      <div>
        <label className={label} htmlFor={`${prefix}title`}>Task</label>
        <input id={`${prefix}title`} name="title" required maxLength={200} defaultValue={t?.title} className={input} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${prefix}assignee`}>For</label>
          <select id={`${prefix}assignee`} name="assignee" defaultValue={t ? (t.assigneeId ?? '') : (defaults.assignee ?? '')} className={input}>
            <option value="">Anyone</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor={`${prefix}due`}>Due</label>
          <input id={`${prefix}due`} name="due_on" type="date" defaultValue={t?.dueOn ?? ''} className={input} />
        </div>
        <div>
          <label className={label} htmlFor={`${prefix}status`}>Status</label>
          <select id={`${prefix}status`} name="status" defaultValue={t?.status ?? 'todo'} className={input}>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{TASK_STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor={`${prefix}contact`}>CRM contact</label>
          <select id={`${prefix}contact`} name="contact" defaultValue={t ? (t.contactId ?? '') : (defaults.contact ?? '')} className={input}>
            <option value="">None</option>
            {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={label} htmlFor={`${prefix}notes`}>Notes</label>
        <textarea id={`${prefix}notes`} name="notes" rows={3} maxLength={5000} defaultValue={t?.notes} className={input} />
      </div>
      <Notice state={state} />
      <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Saving…' : t ? 'Save' : 'Add task'}</button>
    </form>
  );
}
