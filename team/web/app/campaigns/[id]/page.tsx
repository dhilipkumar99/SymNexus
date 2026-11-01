import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { campaignActivity, canUseCampaigns, getCampaign, listRecipients, type RecipientFilter } from '@/lib/mail/campaigns';
import { graphConfigFromEnv } from '@/lib/mail/graph';
import { dispatchSoon } from '@/lib/mail/run';
import { publicOrigin, requireSession } from '@/lib/request';
import { repliedAction } from '../actions';
import { CampaignNav, card, RULE_LABEL, StatusPill, when } from '../ui';
import { CampaignControls, LaunchPanel, TestPanel } from './CampaignClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;
export const metadata = { title: 'Campaign · SymNexus Team' };

const FILTERS: { key: RecipientFilter; label: string }[] = [
  { key: 'all', label: 'Everyone' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'replied', label: 'Replied' },
  { key: 'failed', label: 'Failed' },
  { key: 'unsubscribed', label: 'Unsubscribed' },
];

const MESSAGE_STATUS: Record<string, string> = {
  queued: 'text-zinc-500',
  sending: 'text-teal-700',
  sent: 'text-emerald-700',
  failed: 'text-red-700',
  skipped: 'text-zinc-400',
  cancelled: 'text-zinc-400',
};

const ACTIVITY: Record<string, string> = {
  'campaign.created': 'created the campaign',
  'campaign.launched': 'launched it',
  'campaign.paused': 'paused it',
  'campaign.resumed': 'resumed it',
  'campaign.stopped': 'stopped it',
  'campaign.test_sent': 'sent a test to',
  'campaign.marked_replied': 'marked as replied:',
  'campaign.unmarked_replied': 'unmarked as replied:',
};

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ show?: string; q?: string }>;
}) {
  const { id } = await params;
  const session = await requireSession(`/campaigns/${id}`);
  if (!canUseCampaigns(session)) redirect('/');
  const { show, q = '' } = await searchParams;
  const filter = (FILTERS.some((f) => f.key === show) ? show : 'all') as RecipientFilter;

  const campaign = await getCampaign(id);
  if (!campaign) notFound();
  const [recipients, activity] = await Promise.all([listRecipients(id, filter, q), campaignActivity(id)]);
  if (campaign.status === 'sending' || campaign.status === 'scheduled') dispatchSoon(await publicOrigin());
  const live = campaign.status === 'sending';

  const stat = (label: string, value: number, note?: string) => (
    <div className={`${card} px-5 py-4`}>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold text-zinc-900 tabular-nums">{value}</p>
      {note && <p className="text-xs text-zinc-400">{note}</p>}
    </div>
  );
  const filterHref = (key: string) => `/campaigns/${id}?show=${key}${q ? `&q=${encodeURIComponent(q)}` : ''}`;

  return (
    <Shell session={session} title={campaign.name}>
      <CampaignNav current="campaigns" />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <StatusPill status={campaign.status} />
        <p className="text-sm text-zinc-500">
          Created by {campaign.createdBy} on {when(campaign.createdAt)}
          {campaign.status === 'scheduled' && ` · starts ${when(campaign.startAt)}`}
          {campaign.startedAt && ` · started ${when(campaign.startedAt)}`}
          {campaign.completedAt && ` · ended ${when(campaign.completedAt)}`}
        </p>
        <div className="ml-auto">
          <CampaignControls id={id} status={campaign.status} live={live} />
        </div>
      </div>

      {campaign.error && <p role="alert" className="mb-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{campaign.error}</p>}
      {campaign.status === 'draft' && campaign.emptyValues.length > 0 && (
        <p className="mb-6 rounded-xl bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          Some people have blank cells for variables the emails use without a default:{' '}
          {campaign.emptyValues.map((e) => `{{ ${e.variable} }} (${e.count})`).join(', ')}. Their emails will have a gap there; add a{' '}
          <code className="font-mono">default(&quot;…&quot;)</code> in the template or fill in the list.
        </p>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-6">
        {stat('People', campaign.recipients)}
        {stat('Emails sent', campaign.sent)}
        {stat('Replied', campaign.replied, campaign.recipients ? `${Math.round((100 * campaign.replied) / campaign.recipients)}% of people` : undefined)}
        {stat('Failed', campaign.failed)}
        {stat('Unsubscribed', campaign.unsubscribed)}
      </div>

      {campaign.status === 'draft' && (
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <LaunchPanel id={id} connected={Boolean(graphConfigFromEnv())} recipients={campaign.recipients} />
          <TestPanel id={id} steps={campaign.steps.length} defaultTo={session.email} />
        </div>
      )}

      <section className={`${card} overflow-hidden mb-6`}>
        <h2 className="px-6 py-4 border-b border-zinc-100 text-lg font-semibold text-zinc-900">Emails</h2>
        <ol className="divide-y divide-zinc-100">
          {campaign.steps.map((s) => (
            <li key={s.position} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900">
                  {s.position === 0 ? 'First email' : `Follow-up ${s.position}`} · <span className="font-normal">{s.templateName}</span>
                </p>
                <p className="text-sm text-zinc-500 truncate">
                  {s.position === 0
                    ? s.subject
                    : `${s.delayDays} day${s.delayDays === 1 ? '' : 's'} later · ${RULE_LABEL[s.rule]}${s.asReply ? ' · as a reply' : ''}`}
                </p>
              </div>
              <p className="text-sm text-zinc-600 tabular-nums flex flex-wrap gap-x-4">
                <span>{s.sent} sent</span>
                {s.queued > 0 && <span>{s.queued} waiting</span>}
                {s.skipped > 0 && <span className="text-zinc-400">{s.skipped} skipped</span>}
                {s.failed > 0 && <span className="text-red-600">{s.failed} failed</span>}
                {s.cancelled > 0 && <span className="text-zinc-400">{s.cancelled} cancelled</span>}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${card} overflow-hidden mb-6`}>
        <div className="px-6 py-4 border-b border-zinc-100 flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">People</h2>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex flex-wrap gap-1 text-sm" aria-label="Filter people">
              {FILTERS.map((f) => (
                <Link key={f.key} href={filterHref(f.key)} className={`px-2.5 py-1 rounded-lg ${filter === f.key ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>
                  {f.label}
                </Link>
              ))}
            </nav>
            <form className="flex">
              <input type="hidden" name="show" value={filter} />
              <input name="q" defaultValue={q} placeholder="Search email" className="px-3 py-1 rounded-lg border border-zinc-200 text-sm w-44" />
            </form>
          </div>
        </div>
        <ul className="divide-y divide-zinc-100 text-sm">
          {recipients.rows.length === 0 && <li className="px-6 py-4 text-zinc-500">Nobody here.</li>}
          {recipients.rows.map((r) => (
            <li key={r.id} className="px-6 py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 truncate">
                  {r.email}
                  {r.repliedAt && <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">Replied {when(r.repliedAt)}</span>}
                  {r.unsubscribed && <span className="ml-2 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold">Unsubscribed</span>}
                </p>
                <p className="text-xs text-zinc-500 flex flex-wrap gap-x-3">
                  {r.messages.length === 0 && <span>Not sent</span>}
                  {r.messages.map((m) => (
                    <span key={m.position} className={MESSAGE_STATUS[m.status]} title={m.error ?? undefined}>
                      {m.position === 0 ? 'First' : `Follow-up ${m.position}`}: {m.status}
                      {m.status === 'sent' || m.status === 'queued' ? ` ${when(m.at)}` : ''}
                      {m.error && m.status !== 'skipped' ? ` (${m.error})` : m.status === 'skipped' && m.error ? ` (${m.error.toLowerCase()})` : ''}
                    </span>
                  ))}
                </p>
              </div>
              {campaign.status !== 'draft' && (
                <form action={repliedAction}>
                  <input type="hidden" name="campaign" value={id} />
                  <input type="hidden" name="recipient" value={r.id} />
                  <input type="hidden" name="replied" value={r.repliedAt ? 'false' : 'true'} />
                  <button type="submit" className="px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 whitespace-nowrap">
                    {r.repliedAt ? 'Unmark replied' : 'Mark replied'}
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
        {recipients.total > recipients.rows.length && (
          <p className="px-6 py-3 text-xs text-zinc-500 border-t border-zinc-100">Showing {recipients.rows.length} of {recipients.total}. Search to find someone.</p>
        )}
      </section>

      <section className={`${card} overflow-hidden`}>
        <h2 className="px-6 py-4 border-b border-zinc-100 text-lg font-semibold text-zinc-900">Activity</h2>
        <ul className="divide-y divide-zinc-100 text-sm">
          {activity.map((e, i) => (
            <li key={i} className="px-6 py-3 flex flex-col sm:flex-row gap-1 sm:gap-4">
              <span className="text-zinc-400 shrink-0 sm:w-44">{when(e.at)}</span>
              <span className="text-zinc-700">
                <strong className="font-medium">{e.actor_email ?? 'System'}</strong> {ACTIVITY[e.action] ?? e.action}{' '}
                {e.target_email && <strong className="font-medium">{e.target_email}</strong>}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
