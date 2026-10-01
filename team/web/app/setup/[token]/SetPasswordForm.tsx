'use client';

import { useActionState } from 'react';
import { setPassword } from './actions';

const input =
  'w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent';

export function SetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(setPassword, { error: '' });
  return (
    <form action={action} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 space-y-4">
      <input type="hidden" name="token" value={token} />
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1.5">New password</span>
        <input name="password" type="password" autoComplete="new-password" minLength={12} required className={input} />
      </label>
      <label className="block text-sm">
        <span className="block font-medium text-zinc-700 mb-1.5">Confirm password</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={12} required className={input} />
      </label>
      <p className="text-xs text-zinc-500">At least 12 characters. A few unrelated words make a strong, memorable password.</p>
      {state.error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60" style={{ background: 'var(--primary)' }}>
        {pending ? 'Saving…' : 'Set password and sign in'}
      </button>
    </form>
  );
}
