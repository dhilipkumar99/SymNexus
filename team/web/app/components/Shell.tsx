import Link from 'next/link';
import { BrandIcon } from '@/app/components/BrandIcon';
import { logout } from '@/app/login/actions';
import { ROLE_LABEL, type Session } from '@/lib/auth';

// The app's own pages; Messages (/) is the Burst chat.
function links(admin: boolean) {
  return [
    { href: '/', label: 'Messages' },
    { href: '/crm', label: 'CRM' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/wiki', label: 'Wiki' },
    ...(admin ? [{ href: '/campaigns', label: 'Campaigns' }, { href: '/accounts', label: 'Accounts' }] : []),
    { href: '/account', label: 'My account' },
  ];
}

// Page frame for the app's own pages, in the spark-admin style.
export function Shell({
  session,
  title,
  wide = false,
  children,
}: {
  session: Session;
  title: string;
  wide?: boolean; // the CRM pipeline and task board use the full width
  children: React.ReactNode;
}) {
  const nav = links(session.role !== 'member');
  const width = wide ? 'max-w-7xl' : 'max-w-5xl';
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className={`${width} mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold text-zinc-900 shrink-0">
              <BrandIcon size={28} className="h-7 w-7" />
              SymNexus Team
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm">
              {nav.map((l) => (
                <Link key={l.href} href={l.href} className="px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 whitespace-nowrap">{l.label}</Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm min-w-0">
            <span className="hidden xl:block text-zinc-500 truncate">
              {session.name} · {ROLE_LABEL[session.role]}
            </span>
            <form action={logout}>
              <button type="submit" className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 whitespace-nowrap">Sign out</button>
            </form>
          </div>
        </div>
        <nav className="md:hidden flex gap-1 px-4 pb-2 text-sm overflow-x-auto">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 whitespace-nowrap">{l.label}</Link>
          ))}
        </nav>
      </header>
      <main className={`${width} mx-auto px-4 sm:px-6 py-8`}>
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}
