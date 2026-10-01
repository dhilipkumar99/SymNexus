'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BrandIcon } from '@/app/components/BrandIcon';
import { login } from './actions';

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: '', email: '' });
  const next = useSearchParams().get('next') ?? '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <BrandIcon size={64} className="mx-auto mb-4 h-16 w-16" />
          <h1 className="text-2xl font-bold text-zinc-900">SymNexus Team</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to team messaging</p>
        </div>

        <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
          <input type="hidden" name="next" value={next} />
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                defaultValue={state?.email}
                key={state?.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition"
                placeholder="you@symnexus.co"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60"
              style={{ background: 'var(--primary)' }}
            >
              {pending ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p className="text-xs text-zinc-400 text-center mt-4">
            For SymNexus employees. Ask an administrator if you need an account.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
