import { redirect } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { canUseCampaigns, getSettings, listTemplates } from '@/lib/mail/campaigns';
import { requireSession } from '@/lib/request';
import { CampaignNav } from '../ui';
import { NewCampaignForm } from './NewCampaignForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'New campaign · SymNexus Team' };

export default async function NewCampaignPage() {
  const session = await requireSession('/campaigns/new');
  if (!canUseCampaigns(session)) redirect('/');
  const [templates, settings] = await Promise.all([listTemplates(), getSettings()]);
  return (
    <Shell session={session} title="New campaign">
      <CampaignNav current="campaigns" />
      <NewCampaignForm
        templates={templates.map((t) => ({ id: t.id, name: t.name, subject: t.subject, body: t.body }))}
        sender={{ fromName: settings.fromName, signature: settings.signature, footer: settings.footer }}
      />
    </Shell>
  );
}
