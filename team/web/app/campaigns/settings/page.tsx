import { redirect } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { canUseCampaigns, getSettings, listSuppressions } from '@/lib/mail/campaigns';
import { graphConfigFromEnv } from '@/lib/mail/graph';
import { requireSession } from '@/lib/request';
import { unsuppressAction } from '../actions';
import { CampaignNav, card, when } from '../ui';
import { ConnectionPanel, SenderForm, SuppressForm } from './SettingsClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Campaign settings · SymNexus Team' };

export default async function CampaignSettingsPage() {
  const session = await requireSession('/campaigns/settings');
  if (!canUseCampaigns(session)) redirect('/');
  const [settings, suppressions] = await Promise.all([getSettings(), listSuppressions()]);
  const cfg = graphConfigFromEnv();

  return (
    <Shell session={session} title="Email campaigns">
      <CampaignNav current="settings" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${card} p-6`}>
          <h2 className="text-lg font-semibold text-zinc-900 mb-1">Sender</h2>
          <p className="text-sm text-zinc-500 mb-4">Added to every campaign email.</p>
          <SenderForm settings={{ fromName: settings.fromName, signature: settings.signature, footer: settings.footer, dailyLimit: settings.dailyLimit }} />
        </section>

        <div className="space-y-6">
          <section className={`${card} p-6`}>
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">Connection</h2>
            {cfg ? (
              <p className="text-sm text-zinc-600 mb-4">
                Sending as <strong className="font-medium">{cfg.mailbox}</strong> through Microsoft 365. Last dispatcher run: {when(settings.lastRunAt)}.
              </p>
            ) : (
              <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mb-4">
                Not connected. An administrator sets MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in Vercel (README: &ldquo;Email
                campaigns&rdquo;).
              </p>
            )}
            {settings.lastRunError && <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 mb-4">Last run: {settings.lastRunError}</p>}
            <ConnectionPanel defaultTo={session.email} />
          </section>

          <section className={`${card} p-6`}>
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">Do not email</h2>
            <p className="text-sm text-zinc-500 mb-4">
              People who unsubscribed, or were added here, get no campaign email again, in any campaign. Add someone who asks by reply to stop.
            </p>
            <SuppressForm />
            <ul className="mt-4 divide-y divide-zinc-100 text-sm max-h-80 overflow-y-auto">
              {suppressions.length === 0 && <li className="py-2 text-zinc-500">Nobody yet.</li>}
              {suppressions.map((s) => (
                <li key={s.email} className="py-2 flex items-center gap-3">
                  <span className="flex-1 min-w-0 truncate">{s.email}</span>
                  <span className="text-xs text-zinc-400 whitespace-nowrap">
                    {s.reason === 'unsubscribed' ? 'Unsubscribed' : `Added by ${s.createdBy ?? 'admin'}`} · {when(s.createdAt)}
                  </span>
                  {s.reason === 'manual' && (
                    <form action={unsuppressAction}>
                      <input type="hidden" name="email" value={s.email} />
                      <button type="submit" className="text-xs text-zinc-500 hover:text-red-700">Remove</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Shell>
  );
}
