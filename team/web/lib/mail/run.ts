// Starting dispatcher runs (lib/mail/dispatch.ts).
//
// Runs happen after the response, with next/server's after(): from the cron
// route, after a campaign is launched or resumed, and when the campaign pages
// are viewed while something is sending. A run that stops with emails still due
// (it sends for about four minutes) asks /campaigns/tick for the next one.

import { timingSafeEqual } from 'node:crypto';
import { after } from 'next/server';
import { runDispatch } from './dispatch.ts';
import { mailerFromEnv } from './graph.ts';

export function cronAuthorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET ?? '';
  const given = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  return secret.length >= 16 && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

export function publicUrl(fallbackOrigin: string): string {
  return (process.env.TEAM_PUBLIC_URL ?? fallbackOrigin).replace(/\/$/, '');
}

// Schedules a run after the current response. Never throws.
export function dispatchSoon(origin: string): void {
  const mailer = mailerFromEnv();
  if (!mailer) return;
  const base = publicUrl(origin);
  after(async () => {
    try {
      const result = await runDispatch({ mailer, publicUrl: base });
      if (result.more && process.env.CRON_SECRET) {
        // The tick route answers at once and runs in its own after().
        await fetch(`${base}/campaigns/tick`, {
          method: 'POST',
          headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
          signal: AbortSignal.timeout(15_000),
        }).catch((err) => console.error('[campaigns] could not start the next run:', err));
      }
    } catch (err) {
      console.error('[campaigns] dispatcher run failed:', err);
    }
  });
}
