import { Shell } from '@/app/components/Shell';
import { requireSession } from '@/lib/request';
import { WikiEditor } from '../Editor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'New page · SymNexus Team' };

export default async function NewWikiPage() {
  const session = await requireSession('/wiki/new');
  return (
    <Shell session={session} title="New wiki page">
      <WikiEditor canDelete={false} />
    </Shell>
  );
}
