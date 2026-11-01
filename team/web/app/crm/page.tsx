import Link from 'next/link';
import { Shell } from '@/app/components/Shell';
import { card, day, input, primaryButton, secondaryButton, today } from '@/app/components/ui';
import { listContacts, pipelineSummary, STAGE_LABEL, STAGES, type Contact, type Stage } from '@/lib/work/crm';
import { listPeople } from '@/lib/work/people';
import { requireSession } from '@/lib/request';
import { ContactForm, StageSelect } from './forms';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'CRM · SymNexus Team' };

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const OPEN: Stage[] = ['lead', 'contacted', 'qualified', 'proposal'];

function NextStep({ c }: { c: Contact }) {
  if (!c.nextStep && !c.nextStepOn) return <span className="text-amber-700">No next step</span>;
  const overdue = c.nextStepOn !== null && c.nextStepOn < today() && OPEN.includes(c.stage);
  return (
    <span className={overdue ? 'text-red-600' : 'text-zinc-500'}>
      {c.nextStepOn && <span className="font-medium">{day(c.nextStepOn)}{overdue ? ' (overdue)' : ''} · </span>}
      {c.nextStep}
    </span>
  );
}

export default async function CrmPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await requireSession('/crm');
  const sp = await searchParams;
  const view = sp.view === 'list' ? 'list' : 'board';
  const mine = sp.owner === 'me';
  const filter = { q: sp.q, stage: view === 'list' ? sp.stage : undefined, owner: mine ? session.id : undefined };
  const [contacts, summary, people] = await Promise.all([listContacts(filter), pipelineSummary(), listPeople()]);

  const open = OPEN.reduce((n, s) => n + summary[s].value, 0);
  const href = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const next = { view, q: sp.q, stage: sp.stage, owner: sp.owner, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/crm?${s}` : '/crm';
  };
  const exportHref = `/crm/export?${new URLSearchParams(Object.entries(filter).filter(([, v]) => v) as [string, string][]).toString()}`;

  return (
    <Shell session={session} title="CRM" wide>
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        {STAGES.map((s) => (
          <Link key={s} href={href({ view: 'list', stage: s })} className={`${card} px-4 py-3 hover:border-zinc-300`}>
            <p className="text-xs font-medium text-zinc-500">{STAGE_LABEL[s]}</p>
            <p className="text-xl font-semibold text-zinc-900 tabular-nums">{summary[s].count}</p>
            {summary[s].value > 0 && <p className="text-xs text-zinc-500 tabular-nums">{money(summary[s].value)}</p>}
          </Link>
        ))}
        <div className={`${card} px-4 py-3 col-span-2 sm:col-span-1`}>
          <p className="text-xs font-medium text-zinc-500">Open pipeline</p>
          <p className="text-xl font-semibold text-zinc-900 tabular-nums">{money(open)}</p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="flex gap-1 text-sm" aria-label="View">
          <Link href={href({ view: 'board', stage: undefined })} aria-current={view === 'board' ? 'page' : undefined} className={`px-3 py-1.5 rounded-lg ${view === 'board' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>Pipeline</Link>
          <Link href={href({ view: 'list' })} aria-current={view === 'list' ? 'page' : undefined} className={`px-3 py-1.5 rounded-lg ${view === 'list' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>List</Link>
          <Link href={href({ owner: mine ? undefined : 'me' })} className={`px-3 py-1.5 rounded-lg ${mine ? 'bg-teal-100 text-teal-900' : 'text-zinc-600 hover:bg-zinc-100'}`}>{mine ? 'Mine ✓' : 'Mine'}</Link>
        </div>
        <form className="flex gap-2 lg:ml-auto w-full lg:w-auto" action="/crm">
          <input type="hidden" name="view" value={view} />
          {sp.stage && view === 'list' && <input type="hidden" name="stage" value={sp.stage} />}
          {mine && <input type="hidden" name="owner" value="me" />}
          <input name="q" type="search" defaultValue={sp.q} placeholder="Search name, email, organization" className={`${input} lg:w-72`} aria-label="Search contacts" />
          <button type="submit" className={secondaryButton}>Search</button>
        </form>
        <div className="flex gap-2">
          <a href={exportHref} className={`${secondaryButton} whitespace-nowrap`} title="A CSV the Campaigns tool can import">Export CSV</a>
          <a href="#add" className={`${primaryButton} whitespace-nowrap`}>Add contact</a>
        </div>
      </div>

      {view === 'board' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-10">
          {OPEN.map((s) => {
            const col = contacts.filter((c) => c.stage === s);
            return (
              <section key={s} className="bg-zinc-100/70 rounded-2xl p-3 min-h-40" aria-label={STAGE_LABEL[s]}>
                <h2 className="px-1 pb-2 text-sm font-semibold text-zinc-700 flex justify-between">
                  {STAGE_LABEL[s]} <span className="text-zinc-400 tabular-nums">{col.length}</span>
                </h2>
                <ul className="space-y-2">
                  {col.map((c) => (
                    <li key={c.id} className={`${card} p-3`}>
                      <Link href={`/crm/${c.id}`} className="block">
                        <p className="font-medium text-zinc-900 truncate">{c.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{[c.title, c.organization].filter(Boolean).join(' · ') || c.email}</p>
                      </Link>
                      <p className="mt-2 text-xs line-clamp-2"><NextStep c={c} /></p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <StageSelect id={c.id} stage={c.stage} />
                        <span className="text-xs text-zinc-500 tabular-nums truncate">
                          {c.valueUsd !== null && money(c.valueUsd)}{c.ownerName ? ` · ${c.ownerName.split(' ')[0]}` : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                  {col.length === 0 && <li className="px-1 text-xs text-zinc-400">Nobody here.</li>}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <section className={`${card} overflow-hidden mb-10`}>
          <div className="flex flex-wrap gap-1 px-4 pt-4 text-sm">
            <Link href={href({ stage: undefined })} className={`px-2.5 py-1 rounded-lg ${!sp.stage ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>All</Link>
            {STAGES.map((s) => (
              <Link key={s} href={href({ stage: s })} className={`px-2.5 py-1 rounded-lg ${sp.stage === s ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>{STAGE_LABEL[s]}</Link>
            ))}
          </div>
          {contacts.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-zinc-500">No contacts match.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2">
                <thead className="text-left text-xs text-zinc-500 border-b border-zinc-100">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Organization</th>
                    <th className="px-4 py-2 font-medium">Stage</th>
                    <th className="px-4 py-2 font-medium">Owner</th>
                    <th className="px-4 py-2 font-medium">Next step</th>
                    <th className="px-4 py-2 font-medium text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-2.5">
                        <Link href={`/crm/${c.id}`} className="font-medium text-zinc-900 hover:underline">{c.name}</Link>
                        <p className="text-xs text-zinc-500">{c.email}</p>
                      </td>
                      <td className="px-4 py-2.5 text-zinc-600">{c.organization}<p className="text-xs text-zinc-500">{c.title}</p></td>
                      <td className="px-4 py-2.5"><StageSelect id={c.id} stage={c.stage} /></td>
                      <td className="px-4 py-2.5 text-zinc-600">{c.ownerName ?? '—'}</td>
                      <td className="px-4 py-2.5 text-xs max-w-xs"><NextStep c={c} /></td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-zinc-600">{c.valueUsd !== null ? money(c.valueUsd) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section id="add" className={`${card} p-6 max-w-3xl scroll-mt-6`}>
        <h2 className="text-lg font-semibold text-zinc-900 mb-1">Add a contact</h2>
        <p className="text-sm text-zinc-500 mb-4">Website contact and demo forms are added automatically.</p>
        <ContactForm people={people} me={session.id} />
      </section>
    </Shell>
  );
}
