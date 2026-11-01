// /crm/export: the contacts shown in the CRM (same filters) as a CSV that the
// Campaigns tool imports as-is.

import { contactsCsv, listContacts } from '@/lib/work/crm';
import { currentSession } from '@/lib/request';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const session = await currentSession();
  if (!session) return new Response(null, { status: 401 });
  const sp = new URL(request.url).searchParams;
  const contacts = await listContacts({
    q: sp.get('q') ?? undefined,
    stage: sp.get('stage') ?? undefined,
    owner: sp.get('owner') ?? undefined,
  });
  const date = new Date().toISOString().slice(0, 10);
  return new Response(contactsCsv(contacts.filter((c) => c.email)), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="symnexus-contacts-${date}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
