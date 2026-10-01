'use server';

import { revalidatePath } from 'next/cache';
import {
  inviteAccount,
  isAdmin,
  removeAccount,
  resetPassword,
  setActive,
  setRole,
  signOutEverywhere,
} from '@/lib/accounts';
import type { Role } from '@/lib/auth';
import { clientIp, currentSession, publicOrigin } from '@/lib/request';

export interface ActionState {
  ok: boolean;
  message: string;
  link?: string; // a one-time set-password link to hand to the person
}

const denied: ActionState = { ok: false, message: 'You do not have permission to do that.' };

async function admin() {
  const session = await currentSession();
  return isAdmin(session) ? session! : null;
}

export async function invite(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await admin();
  if (!actor) return denied;
  const role = (form.get('role')?.toString() ?? 'member') as Role;
  const result = await inviteAccount(
    actor,
    { email: form.get('email')?.toString() ?? '', name: form.get('name')?.toString() ?? '', role },
    await clientIp(),
  );
  if (!result.ok) return { ok: false, message: result.error };
  revalidatePath('/accounts');
  return {
    ok: true,
    message: `Invitation created for ${result.email}. Send them this link; it works once and expires in 7 days.`,
    link: `${await publicOrigin()}/setup/${result.token}`,
  };
}

export async function manage(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await admin();
  if (!actor) return denied;
  const id = form.get('id')?.toString() ?? '';
  const ip = await clientIp();

  switch (form.get('op')?.toString()) {
    case 'make-admin':
    case 'make-member': {
      const r = await setRole(actor, id, form.get('op') === 'make-admin' ? 'admin' : 'member', ip);
      revalidatePath('/accounts');
      return r.ok ? { ok: true, message: 'Role updated.' } : { ok: false, message: r.error };
    }
    case 'deactivate':
    case 'reactivate': {
      const r = await setActive(actor, id, form.get('op') === 'reactivate', ip);
      revalidatePath('/accounts');
      return r.ok
        ? { ok: true, message: form.get('op') === 'reactivate' ? 'Account reactivated.' : 'Account deactivated and signed out everywhere.' }
        : { ok: false, message: r.error };
    }
    case 'reset': {
      const r = await resetPassword(actor, id, ip);
      revalidatePath('/accounts');
      return r.ok
        ? {
            ok: true,
            message: `Password reset for ${r.email}; they are signed out everywhere. Send them this link; it works once and expires in 24 hours.`,
            link: `${await publicOrigin()}/setup/${r.token}`,
          }
        : { ok: false, message: r.error };
    }
    case 'sign-out': {
      const r = await signOutEverywhere(actor, id, ip);
      return r.ok ? { ok: true, message: 'Signed out of every device.' } : { ok: false, message: r.error };
    }
    case 'remove': {
      const r = await removeAccount(actor, id, ip);
      revalidatePath('/accounts');
      return r.ok ? { ok: true, message: 'Account removed. Their messages remain in the workspace.' } : { ok: false, message: r.error };
    }
    default:
      return { ok: false, message: 'Unknown action.' };
  }
}
