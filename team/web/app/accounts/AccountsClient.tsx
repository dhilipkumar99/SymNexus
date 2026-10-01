'use client';

import { useActionState, useState } from 'react';
import { ROLE_LABEL, type Role, type Session } from '@/lib/roles';
import { invite, manage, type ActionState } from './actions';

interface Row {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  pending: boolean;
  lastLogin: string | null;
  created: string;
}

interface AuditRow {
  at: string;
  actor: string | null;
  action: string;
  target: string | null;
  detail: Record<string, unknown> | null;
}

const empty: ActionState = { ok: true, message: '' };

const ACTION_LABEL: Record<string, string> = {
  'account.owner_created': 'created the master admin',
  'account.owner_recovery': 'issued a master admin recovery link',
  'account.invited': 'invited',
  'account.role_changed': 'changed the role of',
  'account.deactivated': 'deactivated',
  'account.reactivated': 'reactivated',
  'account.removed': 'removed',
  'account.password_reset': 'reset the password of',
  'account.password_changed': 'changed their password',
  'account.password_set': 'set their password',
  'account.signed_out_everywhere': 'signed out everywhere:',
};

// Mirrors the server's rules (lib/accounts.ts) to decide which buttons to show.
// The server checks again on every action.
function canManage(me: Session, row: Row) {
  if (row.id === me.id || row.role === 'owner') return false;
  return me.role === 'owner' || (me.role === 'admin' && row.role === 'member');
}

function when(iso: string | null) {
  return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';
}

function Notice({ state }: { state: ActionState }) {
  const [copied, setCopied] = useState(false);
  if (!state.message) return null;
  return (
    <div
      role={state.ok ? 'status' : 'alert'}
      className={`mb-6 rounded-xl px-4 py-3 text-sm ${state.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-700'}`}
    >
      <p>{state.message}</p>
      {state.link && (
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <input readOnly value={state.link} className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-emerald-200 bg-white font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
          <button
            type="button"
            className="px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold"
            onClick={() => navigator.clipboard.writeText(state.link!).then(() => setCopied(true))}
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  id,
  op,
  label,
  confirm,
  danger,
  action,
}: {
  id: string;
  op: string;
  label: string;
  confirm?: string;
  danger?: boolean;
  action: (form: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="op" value={op} />
      <button
        type="submit"
        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
          danger ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
        }`}
      >
        {label}
      </button>
    </form>
  );
}

export function AccountsClient({ me, domains, accounts, audit }: { me: Session; domains: string[]; accounts: Row[]; audit: AuditRow[] }) {
  const [inviteState, inviteAction, inviting] = useActionState(invite, empty);
  const [manageState, manageAction] = useActionState(manage, empty);
  const state = manageState.message ? manageState : inviteState;

  return (
    <>
      <Notice state={state} />

      <section className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-zinc-900">Invite someone</h2>
        <p className="text-sm text-zinc-500 mt-1 mb-4">
          They get a one-time link to set their own password.
          {domains.length > 0 && ` Only ${domains.map((d) => '@' + d).join(', ')} addresses.`}
        </p>
        <form action={inviteAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] items-end">
          <label className="text-sm">
            <span className="block font-medium text-zinc-700 mb-1">Work email</span>
            <input name="email" type="email" required className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder={`name@${domains[0] ?? 'symnexus.co'}`} />
          </label>
          <label className="text-sm">
            <span className="block font-medium text-zinc-700 mb-1">Full name</span>
            <input name="name" required maxLength={100} className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
          </label>
          <label className="text-sm">
            <span className="block font-medium text-zinc-700 mb-1">Role</span>
            <select name="role" defaultValue="member" className="px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-white">
              <option value="member">Member</option>
              {me.role === 'owner' && <option value="admin">Admin</option>}
            </select>
          </label>
          <button type="submit" disabled={inviting} className="px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-60" style={{ background: 'var(--primary)' }}>
            {inviting ? 'Inviting…' : 'Create invite'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-zinc-200 mb-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">People</h2>
          <span className="text-sm text-zinc-500">{accounts.filter((a) => a.active).length} active</span>
        </div>
        <ul className="divide-y divide-zinc-100">
          {accounts.map((a) => (
            <li key={a.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 truncate">
                  {a.name}
                  {a.id === me.id && <span className="text-zinc-400 font-normal"> (you)</span>}
                </p>
                <p className="text-sm text-zinc-500 truncate">{a.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${a.role === 'owner' ? 'bg-teal-100 text-teal-800' : a.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-zinc-100 text-zinc-700'}`}>
                  {ROLE_LABEL[a.role]}
                </span>
                {!a.active && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">Deactivated</span>}
                {a.active && a.pending && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Invite pending</span>}
                <span className="text-zinc-400">Last sign-in: {when(a.lastLogin)}</span>
              </div>
              {canManage(me, a) && (
                <div className="flex flex-wrap gap-1.5">
                  {me.role === 'owner' && a.role === 'member' && <ActionButton id={a.id} op="make-admin" label="Make admin" action={manageAction} />}
                  {me.role === 'owner' && a.role === 'admin' && <ActionButton id={a.id} op="make-member" label="Make member" action={manageAction} />}
                  <ActionButton id={a.id} op="reset" label={a.pending ? 'New invite link' : 'Reset password'} action={manageAction} confirm={a.pending ? undefined : `Reset ${a.name}'s password? They will be signed out until they use the new link.`} />
                  <ActionButton id={a.id} op="sign-out" label="Sign out everywhere" action={manageAction} />
                  {a.active ? (
                    <ActionButton id={a.id} op="deactivate" label="Deactivate" danger action={manageAction} confirm={`Deactivate ${a.name}? They are signed out immediately and cannot sign in until reactivated.`} />
                  ) : (
                    <ActionButton id={a.id} op="reactivate" label="Reactivate" action={manageAction} />
                  )}
                  <ActionButton id={a.id} op="remove" label="Remove" danger action={manageAction} confirm={`Permanently remove ${a.name}'s account? Their messages stay in the workspace.`} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900">Account activity</h2>
          <p className="text-sm text-zinc-500 mt-0.5">The last 50 changes. Workspace activity (channels, messages, exports) is in the admin panel inside Messages.</p>
        </div>
        <ul className="divide-y divide-zinc-100 text-sm">
          {audit.length === 0 && <li className="px-6 py-4 text-zinc-500">No activity yet.</li>}
          {audit.map((e, i) => (
            <li key={i} className="px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="text-zinc-400 shrink-0 sm:w-44">{when(e.at)}</span>
              <span className="text-zinc-700">
                <strong className="font-medium">{e.actor ?? 'System'}</strong> {ACTION_LABEL[e.action] ?? e.action} {e.target && e.target !== e.actor ? <strong className="font-medium">{e.target}</strong> : null}
                {e.detail && 'to' in e.detail ? ` → ${ROLE_LABEL[e.detail.to as Role] ?? String(e.detail.to)}` : ''}
                {e.detail && e.action === 'account.invited' && 'role' in e.detail ? ` as ${ROLE_LABEL[e.detail.role as Role]}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
