// Small pieces shared by the campaign pages (server and client components).

import Link from 'next/link';
import type { CampaignStatus, SendRule } from '@/lib/mail/campaigns';

export { autoInput, card, dangerButton, inlineInput, input, Notice, primaryButton, secondaryButton, when } from '@/app/components/ui';

const STATUS: Record<CampaignStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-zinc-100 text-zinc-700' },
  scheduled: { label: 'Scheduled', className: 'bg-indigo-100 text-indigo-800' },
  sending: { label: 'Sending', className: 'bg-teal-100 text-teal-800' },
  paused: { label: 'Paused', className: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800' },
  stopped: { label: 'Stopped', className: 'bg-red-100 text-red-700' },
};

export function StatusPill({ status }: { status: CampaignStatus }) {
  const s = STATUS[status];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${s.className}`}>{s.label}</span>;
}

export const RULE_LABEL: Record<SendRule, string> = {
  all: 'Everyone',
  not_replied: 'Only people who have not replied',
  replied: 'Only people who replied',
};

export function CampaignNav({ current }: { current: 'campaigns' | 'templates' | 'settings' }) {
  const tab = (key: typeof current, href: string, label: string) => (
    <Link
      href={href}
      aria-current={current === key ? 'page' : undefined}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${current === key ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}
    >
      {label}
    </Link>
  );
  return (
    <nav className="flex flex-wrap gap-1 mb-6" aria-label="Campaigns">
      {tab('campaigns', '/campaigns', 'Campaigns')}
      {tab('templates', '/campaigns/templates', 'Templates')}
      {tab('settings', '/campaigns/settings', 'Settings')}
    </nav>
  );
}
