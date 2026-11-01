'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/app/components/ui';
import { deleteTask, moveTask, saveTask } from '@/lib/work/tasks';
import { currentSession } from '@/lib/request';

const str = (form: FormData, key: string) => form.get(key)?.toString() ?? '';

export async function saveTaskAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await currentSession();
  if (!actor) return { ok: false, message: 'Your session has ended. Sign in again.' };
  const r = await saveTask(actor, str(form, 'id') || null, {
    title: str(form, 'title'),
    notes: str(form, 'notes'),
    status: str(form, 'status'),
    assigneeId: str(form, 'assignee'),
    dueOn: str(form, 'due_on'),
    contactId: str(form, 'contact'),
  });
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/tasks');
  if (str(form, 'contact')) revalidatePath(`/crm/${str(form, 'contact')}`);
  return { ok: true, message: str(form, 'id') ? 'Saved.' : 'Added.' };
}

export async function moveTaskAction(form: FormData): Promise<void> {
  if (!(await currentSession())) return;
  await moveTask(str(form, 'id'), str(form, 'status'));
  revalidatePath('/tasks');
}

export async function deleteTaskAction(form: FormData): Promise<void> {
  if (!(await currentSession())) return;
  await deleteTask(str(form, 'id'));
  revalidatePath('/tasks');
}
