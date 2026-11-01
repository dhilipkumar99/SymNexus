'use server';

import { redirect } from 'next/navigation';
import { unsubscribe } from '@/lib/mail/campaigns';

export async function unsubscribeAction(form: FormData): Promise<void> {
  const token = form.get('token')?.toString() ?? '';
  await unsubscribe(token);
  redirect(`/unsubscribe/${encodeURIComponent(token)}?done=1`);
}
