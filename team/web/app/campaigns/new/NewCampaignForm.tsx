'use client';

import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import { composeEmail, missingVariables } from '@/lib/mail/compose';
import { CsvError, readRecipients, type RecipientList } from '@/lib/mail/csv';
import type { SendRule } from '@/lib/mail/campaigns';
import { createCampaignAction, type ActionState } from '../actions';
import { autoInput, card, inlineInput, input, Notice, primaryButton, RULE_LABEL, secondaryButton } from '../ui';

interface TemplateOption {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface Step {
  templateId: string;
  delayDays: number;
  rule: SendRule;
  asReply: boolean;
}

const MAX_FOLLOW_UPS = 5;
const empty: ActionState = { ok: true, message: '' };

export function NewCampaignForm({ templates, sender }: { templates: TemplateOption[]; sender: { fromName: string; signature: string; footer: string } }) {
  const [state, action, pending] = useActionState(createCampaignAction, empty);
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [steps, setSteps] = useState<Step[]>([{ templateId: (templates.find((t) => t.subject.trim()) ?? templates[0])?.id ?? '', delayDays: 0, rule: 'all', asReply: false }]);
  const [previewStep, setPreviewStep] = useState(0);

  const list = useMemo((): { data: RecipientList | null; error: string | null } => {
    if (!csv) return { data: null, error: null };
    try {
      return { data: readRecipients(csv), error: null };
    } catch (err) {
      return { data: null, error: err instanceof CsvError ? err.message : 'Could not read the file.' };
    }
  }, [csv]);

  const byId = useMemo(() => new Map(templates.map((t) => [t.id, t])), [templates]);
  const columns = list.data?.columns.map((c) => c.key) ?? [];
  const problems = steps.flatMap((s, i) => {
    const t = byId.get(s.templateId);
    const label = i === 0 ? 'First email' : `Follow-up ${i}`;
    if (!t) return [`${label}: choose a template.`];
    const out: string[] = [];
    if ((i === 0 || !s.asReply) && !t.subject.trim()) out.push(`${label}: "${t.name}" has no subject.`);
    if (list.data) {
      try {
        const missing = missingVariables(t, columns, sender.signature);
        if (missing.length) out.push(`${label}: "${t.name}" uses ${missing.map((m) => `{{ ${m} }}`).join(', ')}, which the list does not have.`);
      } catch {
        out.push(`${label}: "${t.name}" has an error; fix it in Templates.`);
      }
    }
    return out;
  });

  const preview = useMemo(() => {
    const t = byId.get(steps[previewStep]?.templateId ?? '');
    const person = list.data?.recipients[0];
    if (!t || !person) return null;
    try {
      return { to: person.email, email: composeEmail(t, person.data, { ...sender, fromEmail: 'info@symnexus.co' }, '#') };
    } catch {
      return null;
    }
  }, [byId, steps, previewStep, list.data, sender]);

  const update = (i: number, patch: Partial<Step>) => setSteps((all) => all.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  if (!templates.length) {
    return (
      <div className={`${card} p-8 text-center text-sm text-zinc-600`}>
        <p className="font-medium text-zinc-900">Create a template first.</p>
        <p className="mt-1">Campaigns send templates, filled in for each person on the list.</p>
        <Link href="/campaigns/templates" className={`${primaryButton} inline-block mt-4`}>New template</Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="csv" value={csv} />
      <input type="hidden" name="steps" value={JSON.stringify(steps)} />
      <Notice state={state} />

      <section className={`${card} p-6 space-y-4`}>
        <h2 className="text-lg font-semibold text-zinc-900">1. Name and list</h2>
        <label className="block text-sm">
          <span className="block font-medium text-zinc-700 mb-1">Campaign name</span>
          <input name="name" required maxLength={100} className={input} placeholder="Clinics outreach, November" />
        </label>
        <label className="block text-sm">
          <span className="block font-medium text-zinc-700 mb-1">Recipients (CSV)</span>
          <input
            type="file"
            accept=".csv,text/csv"
            required={!csv}
            className="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-zinc-100 file:text-zinc-800 file:font-medium"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              setFileName(file?.name ?? '');
              setCsv(file ? (file.size > 4 * 1024 * 1024 ? '' : await file.text()) : '');
              if (file && file.size > 4 * 1024 * 1024) window.alert('The file is larger than 4 MB. Split it into several campaigns.');
            }}
          />
          <span className="block text-xs text-zinc-500 mt-1">
            A header row, then one person per row. One column must hold email addresses (call it &ldquo;Email&rdquo;). Excel: File → Save As → CSV.
          </span>
        </label>
        {list.error && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{fileName}: {list.error}</p>}
        {list.data && (
          <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700 space-y-1">
            <p>
              <strong className="font-medium">{list.data.recipients.length}</strong> people from {fileName}
              {list.data.duplicates > 0 && `, ${list.data.duplicates} duplicate${list.data.duplicates === 1 ? '' : 's'} removed`}
              {list.data.invalid.length > 0 && `, ${list.data.invalid.length} row${list.data.invalid.length === 1 ? '' : 's'} skipped for an invalid address`}.
            </p>
            {list.data.invalid.length > 0 && (
              <p className="text-xs text-zinc-500">
                Skipped: {list.data.invalid.slice(0, 5).map((r) => `line ${r.line} (${r.value || 'blank'})`).join(', ')}
                {list.data.invalid.length > 5 && '…'}
              </p>
            )}
            <p className="text-xs text-zinc-500">
              Variables:{' '}
              {list.data.columns.map((c) => (
                <code key={c.key} className="font-mono mr-2" title={c.label}>{`{{ ${c.key} }}`}</code>
              ))}
            </p>
          </div>
        )}
      </section>

      <section className={`${card} p-6 space-y-4`}>
        <h2 className="text-lg font-semibold text-zinc-900">2. Emails</h2>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="rounded-xl border border-zinc-200 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-zinc-900">{i === 0 ? 'First email' : `Follow-up ${i}`}</h3>
                {i > 0 && i === steps.length - 1 && (
                  <button type="button" className="text-xs text-red-700 hover:underline" onClick={() => setSteps((all) => all.slice(0, -1))}>
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="block font-medium text-zinc-700 mb-1">Template</span>
                  <select value={s.templateId} onChange={(e) => update(i, { templateId: e.target.value })} className={input}>
                    <option value="">Choose…</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </label>
                {i > 0 && (
                  <label className="block text-sm">
                    <span className="block font-medium text-zinc-700 mb-1">Send to</span>
                    <select value={s.rule} onChange={(e) => update(i, { rule: e.target.value as SendRule })} className={input}>
                      {(['not_replied', 'all', 'replied'] as SendRule[]).map((r) => (
                        <option key={r} value={r}>{RULE_LABEL[r]}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              {i > 0 && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    Wait
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={s.delayDays}
                      onChange={(e) => update(i, { delayDays: Math.round(Number(e.target.value)) })}
                      className={inlineInput}
                    />
                    days after the previous email
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={s.asReply} onChange={(e) => update(i, { asReply: e.target.checked })} />
                    Send as a reply in the same thread
                  </label>
                </div>
              )}
            </li>
          ))}
        </ol>
        {steps.length <= MAX_FOLLOW_UPS && (
          <button
            type="button"
            className={secondaryButton}
            onClick={() => setSteps((all) => [...all, { templateId: '', delayDays: 3, rule: 'not_replied', asReply: true }])}
          >
            + Add follow-up
          </button>
        )}
        {problems.length > 0 && (
          <ul role="alert" className="text-sm text-red-700 bg-red-50 rounded-lg px-4 py-2 list-disc pl-8">
            {problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        )}
      </section>

      {preview && (
        <section className={`${card} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold text-zinc-900">Preview for {preview.to}</h2>
            {steps.length > 1 && (
              <select value={previewStep} onChange={(e) => setPreviewStep(Number(e.target.value))} className={autoInput}>
                {steps.map((_, i) => <option key={i} value={i}>{i === 0 ? 'First email' : `Follow-up ${i}`}</option>)}
              </select>
            )}
          </div>
          <div className="rounded-xl border border-zinc-200">
            <p className="px-4 py-2 border-b border-zinc-100 text-sm">
              <span className="text-zinc-500">Subject: </span>
              <span className="font-medium">{preview.email.subject || 'RE: (the first email’s subject)'}</span>
            </p>
            <div className="px-4 py-3 text-sm" dangerouslySetInnerHTML={{ __html: preview.email.fragment }} />
          </div>
        </section>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending || !list.data || problems.length > 0} className={primaryButton}>
          {pending ? 'Creating…' : 'Create draft'}
        </button>
        <p className="text-sm text-zinc-500">Nothing is sent yet: you can review, send yourself a test, and then launch.</p>
      </div>
    </form>
  );
}
