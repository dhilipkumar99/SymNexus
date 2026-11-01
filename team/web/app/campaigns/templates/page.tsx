import { redirect } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { canUseCampaigns, getSettings, listTemplates } from '@/lib/mail/campaigns';
import { requireSession } from '@/lib/request';
import { CampaignNav } from '../ui';
import { TemplatesClient } from './TemplatesClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Email templates · SymNexus Team' };

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  const session = await requireSession('/campaigns/templates');
  if (!canUseCampaigns(session)) redirect('/');
  const [{ edit, saved }, templates, settings] = await Promise.all([searchParams, listTemplates(), getSettings()]);

  return (
    <Shell session={session} title="Email campaigns">
      <CampaignNav current="templates" />
      <TemplatesClient
        key={edit ?? 'new'}
        templates={templates.map((t) => ({ id: t.id, name: t.name, subject: t.subject, body: t.body, updatedBy: t.updatedBy, updatedAt: t.updatedAt.toISOString() }))}
        selected={edit ?? null}
        saved={saved === '1'}
        sender={{ fromName: settings.fromName, signature: settings.signature, footer: settings.footer }}
      />
    </Shell>
  );
}
