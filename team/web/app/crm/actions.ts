'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionState } from '@/app/components/ui';
import {
  addActivity,
  createContact,
  deleteActivity,
  deleteContact,
  setStage,
  updateContact,
  type ContactInput,
} from '@/lib/work/crm';
import { clientIp, currentSession } from '@/lib/request';

const str = (form: FormData, key: string) => form.get(key)?.toString() ?? '';
const signedOut: ActionState = { ok: false, message: 'Your session has ended. Sign in again.' };

function contactInput(form: FormData): ContactInput {
  return {
    name: str(form, 'name'),
    email: str(form, 'email'),
    phone: str(form, 'phone'),
    organization: str(form, 'organization'),
    title: str(form, 'title'),
    stage: str(form, 'stage'),
    source: str(form, 'source'),
    value: str(form, 'value'),
    ownerId: str(form, 'owner'),
    nextStep: str(form, 'next_step'),
    nextStepOn: str(form, 'next_step_on'),
  };
}

export async function saveContactAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await currentSession();
  if (!actor) return signedOut;
  const id = str(form, 'id');
  if (!id) {
    const r = await createContact(actor, contactInput(form));
    if (!r.ok) return { ok: false, message: r.error };
    revalidatePath('/crm');
    redirect(`/crm/${r.id}`);
  }
  const r = await updateContact(actor, id, contactInput(form));
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/crm');
  revalidatePath(`/crm/${id}`);
  return { ok: true, message: 'Saved.' };
}

export async function stageAction(form: FormData): Promise<void> {
  const actor = await currentSession();
  if (!actor) return;
  const id = str(form, 'id');
  await setStage(actor, id, str(form, 'stage'));
  revalidatePath('/crm');
  revalidatePath(`/crm/${id}`);
}

export async function activityAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await currentSession();
  if (!actor) return signedOut;
  const id = str(form, 'id');
  const r = await addActivity(actor, id, str(form, 'kind'), str(form, 'body'));
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath(`/crm/${id}`);
  return { ok: true, message: '' };
}

export async function deleteActivityAction(form: FormData): Promise<void> {
  const actor = await currentSession();
  if (!actor) return;
  await deleteActivity(actor, str(form, 'activity'));
  revalidatePath(`/crm/${str(form, 'id')}`);
}

export async function deleteContactAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await currentSession();
  if (!actor) return signedOut;
  const r = await deleteContact(actor, str(form, 'id'), await clientIp());
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/crm');
  redirect('/crm');
}
