// /api/leads: symnexus.co's contact and demo forms (src/backend/contact.php)
// post submissions here, server to server, with
// `Authorization: Bearer $LEADS_API_SECRET`. Each becomes a CRM lead, or a note
// on the contact when the address is already known.

import { timingSafeEqual } from 'node:crypto';
import { recordLead, type LeadInput } from '@/lib/work/crm';

export const dynamic = 'force-dynamic';

function authorised(request: Request): boolean {
  const secret = process.env.LEADS_API_SECRET ?? '';
  const given = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  return secret.length >= 16 && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

export async function POST(request: Request): Promise<Response> {
  if (!authorised(request)) return Response.json({ ok: false, error: 'Unauthorised.' }, { status: 401 });
  let input: LeadInput;
  try {
    const text = await request.text();
    if (text.length > 20_000) return Response.json({ ok: false, error: 'Too large.' }, { status: 413 });
    input = JSON.parse(text);
    if (!input || typeof input !== 'object') throw new Error();
  } catch {
    return Response.json({ ok: false, error: 'Send a JSON object.' }, { status: 400 });
  }
  const r = await recordLead(input);
  if (!r.ok) return Response.json(r, { status: 422 });
  return Response.json({ ok: true, id: r.id, created: r.created }, { status: r.created ? 201 : 200 });
}
