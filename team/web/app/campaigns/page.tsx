import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { canUseCampaigns, hasActiveCampaigns, listCampaigns } from '@/lib/mail/campaigns';
import { graphConfigFromEnv } from '@/lib/mail/graph';
import { dispatchSoon } from '@/lib/mail/run';
import { publicOrigin, requireSession } from '@/lib/request';
import { CampaignNav, card, primaryButton, StatusPill, when } from './ui';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;
export const metadata = { title: 'Campaigns · SymNexus Team' };

export default async function CampaignsPage() {
  const session = await requireSession('/campaigns');
  if (!canUseCampaigns(session)) redirect('/');
  const [campaigns, active] = await Promise.all([listCampaigns(), hasActiveCampaigns()]);
  // Viewing the page also moves sending along (the cron runs only daily on Hobby).
  if (active) dispatchSoon(await publicOrigin());
  const connected = graphConfigFromEnv();

  return (
    <Shell session={session} title="Email campaigns">
      <CampaignNav current="campaigns" />
      {!connected && (
        <p className="mb-6 rounded-xl bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          Sending is not connected to Microsoft 365 yet. You can prepare templates and campaigns; see{' '}
          <Link href="/campaigns/settings" className="underline">Settings</Link> to connect.
        </p>
      )}
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-zinc-500">
          Sent from <strong className="font-medium text-zinc-700">{connected?.mailbox ?? 'info@symnexus.co'}</strong>. Personalised emails with
          follow-ups, from a CSV list.
        </p>
        <Link href="/campaigns/new" className={`${primaryButton} whitespace-nowrap`}>New campaign</Link>
      </div>

      <section className={`${card} overflow-hidden`}>
        {campaigns.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            <p className="font-medium text-zinc-700">No campaigns yet.</p>
            <p className="mt-1">
              Start with a <Link href="/campaigns/templates" className="underline">template</Link>, then create a campaign from a CSV list.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {campaigns.map((c) => (
              <li key={c.id}>
                <Link href={`/campaigns/${c.id}`} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 hover:bg-zinc-50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{c.name}</p>
                    <p className="text-sm text-zinc-500 truncate">
                      {c.createdBy} · {c.status === 'scheduled' ? `starts ${when(c.startAt)}` : `created ${when(c.createdAt)}`}
                    </p>
                    {c.error && <p className="text-xs text-red-600 mt-1 truncate">{c.error}</p>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-600 tabular-nums">
                    <span title="People">{c.recipients} people</span>
                    <span title="Emails sent">{c.sent} sent</span>
                    <span title="People who replied">{c.replied} replied</span>
                    {c.failed > 0 && <span className="text-red-600">{c.failed} failed</span>}
                    <StatusPill status={c.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Shell>
  );
}
