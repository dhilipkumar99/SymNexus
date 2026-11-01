'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addSuppressions,
  canUseCampaigns,
  changeCampaign,
  createCampaign,
  deleteTemplate,
  getSettings,
  launchCampaign,
  removeSuppression,
  saveSettings,
  saveTemplate,
  senderFrom,
  sendTest,
  setReplied,
  type CampaignChange,
  type StepInput,
} from '@/lib/mail/campaigns';
import { composeEmail } from '@/lib/mail/compose';
import { MailError, mailerFromEnv } from '@/lib/mail/graph';
import { dispatchSoon } from '@/lib/mail/run';
import { clientIp, currentSession, publicOrigin } from '@/lib/request';

export interface ActionState {
  ok: boolean;
  message: string;
}

const denied: ActionState = { ok: false, message: 'You do not have permission to do that.' };
const str = (form: FormData, key: string) => form.get(key)?.toString() ?? '';

async function user() {
  const session = await currentSession();
  return canUseCampaigns(session) ? session! : null;
}

export async function createCampaignAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  let steps: StepInput[];
  try {
    steps = JSON.parse(str(form, 'steps'));
    if (!Array.isArray(steps)) throw new Error();
  } catch {
    return { ok: false, message: 'Choose the emails to send.' };
  }
  const r = await createCampaign(actor, { name: str(form, 'name'), csv: str(form, 'csv'), steps }, await clientIp());
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/campaigns');
  redirect(`/campaigns/${r.id}`);
}

export async function launchAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const id = str(form, 'id');
  if (!mailerFromEnv()) return { ok: false, message: 'Email sending is not connected yet. See Campaign settings.' };
  const at = str(form, 'start_at');
  const r = await launchCampaign(actor, id, str(form, 'when') === 'later' && at ? new Date(at) : null, await clientIp());
  if (!r.ok) return { ok: false, message: r.error };
  dispatchSoon(await publicOrigin());
  revalidatePath(`/campaigns/${id}`);
  return { ok: true, message: 'Launched.' };
}

export async function changeAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const id = str(form, 'id');
  const op = str(form, 'op') as CampaignChange;
  if (!['pause', 'resume', 'stop', 'delete'].includes(op)) return { ok: false, message: 'Unknown action.' };
  const r = await changeCampaign(actor, id, op, await clientIp());
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/campaigns');
  if (op === 'delete') redirect('/campaigns');
  if (op === 'resume') dispatchSoon(await publicOrigin());
  revalidatePath(`/campaigns/${id}`);
  return { ok: true, message: { pause: 'Paused. Nothing more is sent until you resume.', resume: 'Resumed.', stop: 'Stopped. Emails not yet sent were cancelled.', delete: '' }[op] };
}

export async function testAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const r = await sendTest(
    actor,
    mailerFromEnv(),
    { campaignId: str(form, 'id'), position: Number(str(form, 'position')) || 0, to: str(form, 'to') },
    await publicOrigin(),
    await clientIp(),
  );
  return r.ok ? { ok: true, message: `Test sent to ${r.to}.` } : { ok: false, message: r.error };
}

export async function repliedAction(form: FormData): Promise<void> {
  const actor = await user();
  if (!actor) return;
  const id = str(form, 'campaign');
  await setReplied(actor, id, str(form, 'recipient'), str(form, 'replied') === 'true', await clientIp());
  revalidatePath(`/campaigns/${id}`);
}

export async function saveTemplateAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const r = await saveTemplate(
    actor,
    { id: str(form, 'id') || undefined, name: str(form, 'name'), subject: str(form, 'subject'), body: str(form, 'body') },
    await clientIp(),
  );
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/campaigns/templates');
  redirect(`/campaigns/templates?edit=${r.id}&saved=1`);
}

export async function deleteTemplateAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const r = await deleteTemplate(actor, str(form, 'id'), await clientIp());
  if (!r.ok) return { ok: false, message: r.error };
  revalidatePath('/campaigns/templates');
  redirect('/campaigns/templates');
}

export async function saveSettingsAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const r = await saveSettings(
    actor,
    { fromName: str(form, 'from_name'), signature: str(form, 'signature'), footer: str(form, 'footer'), dailyLimit: Number(str(form, 'daily_limit')) },
    await clientIp(),
  );
  revalidatePath('/campaigns/settings');
  return r.ok ? { ok: true, message: 'Settings saved.' } : { ok: false, message: r.error };
}

// Checks the Microsoft 365 connection and, given an address, sends a short
// email there (to check that it arrives, and is not marked as spam).
export async function connectionTestAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const mailer = mailerFromEnv();
  if (!mailer) return { ok: false, message: 'Not connected: set MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET.' };
  try {
    await mailer.check();
    const to = str(form, 'to').trim();
    if (!to) return { ok: true, message: `Connected to ${mailer.mailbox}: the mailbox can be read.` };
    const email = composeEmail(
      { subject: 'Test email from SymNexus campaigns', body: 'This is a test from SymNexus Team campaigns.\n\nIf it arrived in your inbox (not spam), sending works.' },
      {},
      senderFrom(await getSettings(), mailer.mailbox),
      `${await publicOrigin()}/unsubscribe/test`,
    );
    await mailer.send({ to, subject: email.subject, html: email.html, fragment: email.fragment });
    return { ok: true, message: `Connected to ${mailer.mailbox}, and a test email was sent to ${to}. Check it arrived in the inbox.` };
  } catch (err) {
    if (err instanceof MailError) return { ok: false, message: `Microsoft 365: ${err.message}` };
    throw err;
  }
}

export async function suppressAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const actor = await user();
  if (!actor) return denied;
  const r = await addSuppressions(actor, str(form, 'emails'), await clientIp());
  revalidatePath('/campaigns/settings');
  if (!r.ok) return { ok: false, message: r.error };
  return { ok: true, message: `${r.added} added.${r.invalid.length ? ` Not valid addresses: ${r.invalid.slice(0, 10).join(', ')}.` : ''}` };
}

export async function unsuppressAction(form: FormData): Promise<void> {
  const actor = await user();
  if (!actor) return;
  await removeSuppression(actor, str(form, 'email'), await clientIp());
  revalidatePath('/campaigns/settings');
}
