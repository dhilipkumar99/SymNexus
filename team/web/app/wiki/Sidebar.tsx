import Link from 'next/link';
import type { listPages } from '@/lib/work/wiki';

export function WikiSidebar({ pages, current }: { pages: Awaited<ReturnType<typeof listPages>>; current?: string }) {
  return (
    <nav aria-label="Wiki pages" className="space-y-1">
      {pages.map((p) => (
        <Link
          key={p.slug}
          href={`/wiki/${p.slug}`}
          aria-current={p.slug === current ? 'page' : undefined}
          className={`block px-3 py-1.5 rounded-lg text-sm truncate ${p.slug === current ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
        >
          {p.title}
        </Link>
      ))}
      <Link href="/wiki/new" className="block px-3 py-1.5 rounded-lg text-sm font-semibold text-[var(--primary)] hover:bg-zinc-100">+ New page</Link>
    </nav>
  );
}
