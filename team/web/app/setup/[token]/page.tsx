import { findPasswordLink } from '@/lib/auth';
import { SetPasswordForm } from './SetPasswordForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Set your password · SymNexus Team', referrer: 'no-referrer' };

export default async function SetupPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const link = await findPasswordLink(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'var(--primary)' }}>
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {link ? (link.purpose === 'invite' ? `Welcome, ${link.name.split(' ')[0]}` : 'Reset your password') : 'Link not valid'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {link ? `Set a password for ${link.email}` : 'This link has expired or was already used. Ask an admin for a new one.'}
          </p>
        </div>
        {link && <SetPasswordForm token={token} />}
      </div>
    </div>
  );
}
