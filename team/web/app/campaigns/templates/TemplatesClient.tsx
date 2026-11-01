'use client';

import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import { composeEmail } from '@/lib/mail/compose';
import { TemplateError, templateVariables } from '@/lib/mail/template';
import { deleteTemplateAction, saveTemplateAction, type ActionState } from '../actions';
import { card, dangerButton, input, Notice, primaryButton, when } from '../ui';

interface Row {
  id: string;
  name: string;
  subject: string;
  body: string;
  updatedBy: string | null;
  updatedAt: string;
}

const empty: ActionState = { ok: true, message: '' };

const STARTER = `Hi {{ first_name | default("there") }},

I'm reaching out from SymNexus because {% if company %}{{ company }}{% else %}your team{% endif %} …

Would you be open to a 20-minute call next week?`;

// Sample values for the preview: each variable shows as [name].
function sampleData(subject: string, body: string): Record<string, string> {
  const data: Record<string, string> = {};
  try {
    for (const src of [subject, body]) for (const name of templateVariables(src).keys()) data[name] = `[${name}]`;
  } catch {
    // shown as an error below
  }
  return data;
}

export function TemplatesClient({
  templates,
  selected,
  saved,
  sender,
}: {
  templates: Row[];
  selected: string | null;
  saved: boolean;
  sender: { fromName: string; signature: string; footer: string };
}) {
  const current = templates.find((t) => t.id === selected) ?? null;
  const [saveState, saveAction, saving] = useActionState(saveTemplateAction, saved ? { ok: true, message: 'Template saved.' } : empty);
  const [deleteState, deleteAction] = useActionState(deleteTemplateAction, empty);
  const [name, setName] = useState(current?.name ?? '');
  const [subject, setSubject] = useState(current?.subject ?? '');
  const [body, setBody] = useState(current?.body ?? (current ? '' : STARTER));

  const preview = useMemo(() => {
    try {
      const email = composeEmail({ subject, body }, sampleData(subject, body), { ...sender, fromEmail: 'info@symnexus.co' }, '#');
      return { email, error: null };
    } catch (err) {
      return { email: null, error: err instanceof TemplateError ? err.message : String(err) };
    }
  }, [subject, body, sender]);

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <aside className={`${card} p-2 h-fit`}>
        <Link href="/campaigns/templates" className={`block px-3 py-2 rounded-lg text-sm font-medium ${!current ? 'bg-zinc-100 text-zinc-900' : 'text-[var(--primary)] hover:bg-zinc-50'}`}>
          + New template
        </Link>
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/campaigns/templates?edit=${t.id}`}
            className={`block px-3 py-2 rounded-lg text-sm ${t.id === current?.id ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-700 hover:bg-zinc-50'}`}
          >
            <span className="block truncate">{t.name}</span>
            <span className="block truncate text-xs text-zinc-400">{t.subject || 'Reply in thread'}</span>
          </Link>
        ))}
      </aside>

      <div className="space-y-6 min-w-0">
        <Notice state={deleteState.message ? deleteState : saveState} />
        <form action={saveAction} className={`${card} p-6 space-y-4`}>
          {current && <input type="hidden" name="id" value={current.id} />}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">{current ? 'Edit template' : 'New template'}</h2>
            {current && <p className="text-xs text-zinc-400 text-right">Last saved {when(current.updatedAt)}{current.updatedBy ? ` by ${current.updatedBy}` : ''}</p>}
          </div>
          <label className="block text-sm">
            <span className="block font-medium text-zinc-700 mb-1">Name</span>
            <input name="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} className={input} placeholder="Intro: healthcare compliance" />
          </label>
          <label className="block text-sm">
            <span className="block font-medium text-zinc-700 mb-1">Subject</span>
            <input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={250} className={input} placeholder="Quick question, {{ first_name }}" />
            <span className="block text-xs text-zinc-500 mt-1">For a follow-up sent as a reply, leave it blank to keep the thread&rsquo;s &ldquo;RE:&rdquo; subject.</span>
          </label>
          <label className="block text-sm">
            <span className="block font-medium text-zinc-700 mb-1">Email</span>
            <textarea name="body" value={body} onChange={(e) => setBody(e.target.value)} required rows={14} className={`${input} font-mono text-[13px] leading-relaxed`} />
          </label>
          {preview.error && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{preview.error}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" disabled={saving || Boolean(preview.error)} className={primaryButton}>
              {saving ? 'Saving…' : 'Save template'}
            </button>
          </div>
        </form>
        {current && (
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (!window.confirm(`Delete the template "${current.name}"? Campaigns already created keep their copy.`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={current.id} />
            <button type="submit" className={dangerButton}>Delete template</button>
          </form>
        )}

        <section className={`${card} p-6`}>
          <h2 className="text-lg font-semibold text-zinc-900 mb-1">Preview</h2>
          <p className="text-xs text-zinc-500 mb-4">Variables show as [name]; they are filled from each person&rsquo;s row when sent.</p>
          {preview.email && (
            <div className="rounded-xl border border-zinc-200">
              <p className="px-4 py-2 border-b border-zinc-100 text-sm">
                <span className="text-zinc-500">Subject: </span>
                <span className="font-medium">{preview.email.subject || 'RE: (the first email’s subject)'}</span>
              </p>
              {/* The preview is our own escaped rendering of the template. */}
              <div className="px-4 py-3 text-sm" dangerouslySetInnerHTML={{ __html: preview.email.fragment }} />
            </div>
          )}
        </section>

        <section className={`${card} p-6 text-sm text-zinc-700 space-y-2`}>
          <h2 className="text-lg font-semibold text-zinc-900">Writing templates</h2>
          <p>Write plain text; a blank line starts a new paragraph, and links become clickable. The signature and an unsubscribe footer (Settings) are added to every email.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code className="font-mono text-[13px]">{'{{ first_name }}'}</code>: a column of the CSV list. Headers become snake_case: &ldquo;First Name&rdquo; is <code className="font-mono">first_name</code>.</li>
            <li><code className="font-mono text-[13px]">{'{{ first_name | default("there") }}'}</code>: used when the cell is blank.</li>
            <li><code className="font-mono text-[13px]">{'{% if company %}…{% else %}…{% endif %}'}</code>, also <code className="font-mono">{'{% elif %}'}</code>, <code className="font-mono">not company</code>, <code className="font-mono">{'industry == "health"'}</code> and <code className="font-mono">!=</code> (case is ignored).</li>
            <li>Always available: <code className="font-mono">from_name</code> and <code className="font-mono">from_email</code>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
