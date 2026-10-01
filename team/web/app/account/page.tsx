import { Shell } from '@/app/components/Shell';
import { ROLE_LABEL } from '@/lib/roles';
import { requireSession } from '@/lib/request';
import { PasswordForm } from './PasswordForm';
import { signOutOtherDevices } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My account · SymNexus Team' };

export default async function AccountPage() {
  const session = await requireSession('/account');
  return (
    <Shell session={session} title="My account">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Profile</h2>
          <dl className="text-sm space-y-3">
            <div><dt className="text-zinc-500">Name</dt><dd className="font-medium text-zinc-900">{session.name}</dd></div>
            <div><dt className="text-zinc-500">Email</dt><dd className="font-medium text-zinc-900">{session.email}</dd></div>
            <div><dt className="text-zinc-500">Role</dt><dd className="font-medium text-zinc-900">{ROLE_LABEL[session.role]}</dd></div>
          </dl>
          <p className="text-xs text-zinc-400 mt-4">Your photo, display name and status are set in Messages, under your profile.</p>
        </section>

        <section className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Change password</h2>
          <PasswordForm />
        </section>

        <section className="bg-white rounded-2xl border border-zinc-200 p-6 lg:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Sign out everywhere</h2>
            <p className="text-sm text-zinc-500 mt-1">Ends your session on every device, including this one. Use it if you lost a device or signed in on a shared computer.</p>
          </div>
          <form action={signOutOtherDevices}>
            <button type="submit" className="px-4 py-2 rounded-xl border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-50 whitespace-nowrap">
              Sign out everywhere
            </button>
          </form>
        </section>
      </div>
    </Shell>
  );
}
