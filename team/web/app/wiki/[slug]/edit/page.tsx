import { notFound } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { isAdmin } from '@/lib/accounts';
import { getPage } from '@/lib/work/wiki';
import { requireSession } from '@/lib/request';
import { WikiEditor } from '../../Editor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit page · SymNexus Team' };

export default async function EditWikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await requireSession(`/wiki/${slug}/edit`);
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <Shell session={session} title={`Edit: ${page.title}`}>
      <WikiEditor page={page} canDelete={isAdmin(session)} />
    </Shell>
  );
}
