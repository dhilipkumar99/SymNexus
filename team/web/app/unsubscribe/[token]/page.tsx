// /unsubscribe/{token}: the link in every campaign email's footer. Public: the
// token (random, one per person per campaign) is the proof. Unsubscribing takes
// a click on this page, so link scanners that open emails do not unsubscribe.

import { BrandIcon } from '@/app/components/BrandIcon';
import { recipientForToken } from '@/lib/mail/campaigns';
import { unsubscribeAction } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Unsubscribe · SymNexus', referrer: 'no-referrer' };

function mask(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}${'•'.repeat(Math.max(1, local.length - 2))}@${domain}`;
}

export default async function UnsubscribePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ done?: string }> }) {
  const [{ token }, { done }] = await Promise.all([params, searchParams]);
  const test = token === 'test';
  const r = test ? null : await recipientForToken(token);

  let title: string;
  let text: string;
  if (test) [title, text] = ['Test email', 'This is the unsubscribe link of a test email; it does nothing.'];
  else if (!r) [title, text] = ['Link not valid', 'This unsubscribe link is not valid. Reply to the email and ask us to stop, and we will.'];
  else if (r.unsubscribed || done) [title, text] = ['You are unsubscribed', `${mask(r.email)} will not receive these emails from SymNexus again.`];
  else [title, text] = ['Unsubscribe', `Stop SymNexus emails to ${mask(r.email)}?`];

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm text-center">
        <BrandIcon size={56} className="mx-auto mb-4 h-14 w-14" />
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-600 mt-2">{text}</p>
        {r && !r.unsubscribed && !done && (
          <form action={unsubscribeAction} className="mt-6">
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="w-full py-2.5 rounded-xl text-white text-sm font-semibold bg-[var(--primary)]">
              Unsubscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
