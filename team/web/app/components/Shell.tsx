import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { ROLE_LABEL, type Session } from '@/lib/auth';

// Page frame for the account pages, in the spark-admin style.
export function Shell({ session, title, children }: { session: Session; title: string; children: React.ReactNode }) {
  const admin = session.role !== 'member';
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold text-zinc-900 shrink-0">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-sm" style={{ background: 'var(--primary)' }}>
                S
              </span>
              SymNexus Team
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link href="/" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100">Messages</Link>
              {admin && <Link href="/accounts" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100">Accounts</Link>}
              <Link href="/account" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100">My account</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm min-w-0">
            <span className="hidden md:block text-zinc-500 truncate">
              {session.name} · {ROLE_LABEL[session.role]}
            </span>
            <form action={logout}>
              <button type="submit" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100">Sign out</button>
            </form>
          </div>
        </div>
        <nav className="sm:hidden flex gap-1 px-4 pb-2 text-sm">
          <Link href="/" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100">Messages</Link>
          {admin && <Link href="/accounts" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100">Accounts</Link>}
          <Link href="/account" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100">My account</Link>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}
