'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionState } from '@/app/components/ui';
import { deletePage, savePage } from '@/lib/work/wiki';
import { clientIp, currentSession } from '@/lib/request';

const str = (form: FormData, key: string) => form.get(key)?.toString() ?? '';

export async function savePageAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await currentSession();
  if (!actor) return { ok: false, message: 'Your session has ended. Sign in again.' };
  const r = await savePage(actor, str(form, 'slug') || null, str(form, 'title'), str(form, 'body'));
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/wiki', 'layout');
  redirect(`/wiki/${r.slug}`);
}

export async function deletePageAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await currentSession();
  if (!actor) return { ok: false, message: 'Your session has ended. Sign in again.' };
  const r = await deletePage(actor, str(form, 'slug'), await clientIp());
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/wiki', 'layout');
  redirect('/wiki');
}
