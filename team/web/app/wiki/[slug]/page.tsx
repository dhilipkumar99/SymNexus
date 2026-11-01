import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { card, secondaryButton, when } from '@/app/components/ui';
import { renderMarkdown } from '@/lib/work/markdown';
import { getPage, listPages } from '@/lib/work/wiki';
import { requireSession } from '@/lib/request';
import { WikiSidebar } from '../Sidebar';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const page = await getPage((await params).slug);
  return { title: `${page?.title ?? 'Wiki'} · SymNexus Team` };
}

export default async function WikiPageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await requireSession(`/wiki/${slug}`);
  const [pages, page] = await Promise.all([listPages(), getPage(slug)]);
  if (!page) notFound();

  return (
    <Shell session={session} title="Wiki" wide>
      <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
        <WikiSidebar pages={pages} current={slug} />
        <article className={`${card} p-6 sm:p-8 min-w-0`}>
          <header className="flex flex-wrap items-start justify-between gap-3 mb-6 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">{page.title}</h2>
              <p className="text-xs text-zinc-500 mt-1">Last edited by {page.updatedBy}, {when(page.updatedAt)}</p>
            </div>
            <Link href={`/wiki/${slug}/edit`} className={secondaryButton}>Edit</Link>
          </header>
          {/* renderMarkdown escapes everything it does not turn into its own markup. */}
          <div className="wiki-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} />
        </article>
      </div>
    </Shell>
  );
}
