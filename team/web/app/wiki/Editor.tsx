'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { card, dangerButton, emptyState, input, label, Notice, primaryButton, secondaryButton } from '@/app/components/ui';
import { renderMarkdown } from '@/lib/work/markdown';
import { deletePageAction, savePageAction } from './actions';

export function WikiEditor({ page, canDelete }: { page?: { slug: string; title: string; body: string }; canDelete: boolean }) {
  const [state, action, pending] = useActionState(savePageAction, emptyState);
  const [deleteState, deleteAction, deleting] = useActionState(deletePageAction, emptyState);
  const [body, setBody] = useState(page?.body ?? '');
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  return (
    <div className={`${card} p-6 space-y-4`}>
      <form action={action} className="space-y-4">
        {page && <input type="hidden" name="slug" value={page.slug} />}
        <div>
          <label className={label} htmlFor="title">Title</label>
          <input id="title" name="title" required maxLength={120} defaultValue={page?.title} className={input} />
        </div>
        <div>
          <div className="flex items-center gap-1 mb-2 text-sm">
            <button type="button" onClick={() => setTab('write')} className={`px-3 py-1 rounded-lg ${tab === 'write' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>Write</button>
            <button type="button" onClick={() => setTab('preview')} className={`px-3 py-1 rounded-lg ${tab === 'preview' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>Preview</button>
            <span className="ml-auto text-xs text-zinc-500 hidden sm:block"># Heading · - list · - [ ] checkbox · **bold** · [link](https://…)</span>
          </div>
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={22}
            aria-label="Page content (Markdown)"
            className={`${input} font-mono text-[13px] leading-relaxed ${tab === 'write' ? '' : 'hidden'}`}
          />
          {tab === 'preview' && (
            <div className="wiki-prose min-h-64 rounded-xl border border-zinc-200 p-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
          )}
        </div>
        <Notice state={state} />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Saving…' : 'Save page'}</button>
          <Link href={page ? `/wiki/${page.slug}` : '/wiki'} className={secondaryButton}>Cancel</Link>
        </div>
      </form>
      {page && canDelete && (
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (!window.confirm(`Delete "${page.title}"? This cannot be undone.`)) e.preventDefault();
          }}
          className="pt-4 border-t border-zinc-100 space-y-2"
        >
          <input type="hidden" name="slug" value={page.slug} />
          <button type="submit" disabled={deleting} className={dangerButton}>Delete page</button>
          <Notice state={deleteState} />
        </form>
      )}
    </div>
  );
}
