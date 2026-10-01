import { redirect } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { allowedDomains, isAdmin, listAccounts, listAudit } from '@/lib/accounts';
import { requireSession } from '@/lib/request';
import { AccountsClient } from './AccountsClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Accounts · SymNexus Team' };

export default async function AccountsPage() {
  const session = await requireSession('/accounts');
  if (!isAdmin(session)) redirect('/');

  const [accounts, auditLog] = await Promise.all([listAccounts(), listAudit(50)]);

  return (
    <Shell session={session} title="Accounts">
      <AccountsClient
        me={session}
        domains={allowedDomains()}
        accounts={accounts.map((a) => ({
          id: a.id,
          email: a.email,
          name: a.name,
          role: a.role,
          active: a.active,
          pending: a.pending,
          lastLogin: a.last_login_at?.toISOString() ?? null,
          created: a.created_at.toISOString(),
        }))}
        audit={auditLog.map((e) => ({
          at: e.at.toISOString(),
          actor: e.actor_email,
          action: e.action,
          target: e.target_email,
          detail: e.detail,
        }))}
      />
    </Shell>
  );
}
