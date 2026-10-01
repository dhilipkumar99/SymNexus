'use client';

import { useActionState } from 'react';
import { changePassword, type FormState } from './actions';

const input =
  'w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent';

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, { ok: true, message: '' } as FormState);
  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">Current password</span>
        <input name="current_password" type="password" autoComplete="current-password" required className={input} />
      </label>
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">New password</span>
        <input name="new_password" type="password" autoComplete="new-password" minLength={12} required className={input} />
      </label>
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1">Confirm new password</span>
        <input name="confirm_password" type="password" autoComplete="new-password" minLength={12} required className={input} />
      </label>
      <p className="text-xs text-zinc-500">At least 12 characters. A few unrelated words make a strong, memorable password.</p>
      {state.message && (
        <p role={state.ok ? 'status' : 'alert'} className={`text-sm rounded-lg px-3 py-2 ${state.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-600'}`}>
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60" style={{ background: 'var(--primary)' }}>
        {pending ? 'Saving…' : 'Change password'}
      </button>
    </form>
  );
}
