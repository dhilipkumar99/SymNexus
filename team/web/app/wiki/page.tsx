import { redirect } from 'next/navigation';
import { listPages } from '@/lib/work/wiki';
import { requireSession } from '@/lib/request';

export const dynamic = 'force-dynamic';

// The wiki opens on "How we work", or the first page if that was removed.
export default async function WikiIndex() {
  await requireSession('/wiki');
  const pages = await listPages();
  const start = pages.find((p) => p.slug === 'how-we-work') ?? pages[0];
  redirect(start ? `/wiki/${start.slug}` : '/wiki/new');
}
