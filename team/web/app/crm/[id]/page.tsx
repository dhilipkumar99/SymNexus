import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shell } from '@/app/components/Shell';
import { card, day, when } from '@/app/components/ui';
import { isAdmin } from '@/lib/accounts';
import { ACTIVITY_LABEL, getContact } from '@/lib/work/crm';
import { listPeople } from '@/lib/work/people';
import { listTasks, TASK_STATUS_LABEL } from '@/lib/work/tasks';
import { requireSession } from '@/lib/request';
import { deleteActivityAction } from '../actions';
import { ActivityForm, ContactForm, DeleteContact } from '../forms';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contact · SymNexus Team' };

const KIND_STYLE: Record<string, string> = {
  form: 'bg-teal-100 text-teal-800',
  stage: 'bg-indigo-100 text-indigo-800',
  email: 'bg-sky-100 text-sky-800',
  call: 'bg-amber-100 text-amber-800',
  meeting: 'bg-violet-100 text-violet-800',
  note: 'bg-zinc-100 text-zinc-700',
};

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession(`/crm/${id}`);
  const [found, people, tasks] = await Promise.all([getContact(id), listPeople(), listTasks({ contact: id })]);
  if (!found) notFound();
  const { contact: c, activities } = found;
  const admin = isAdmin(session);

  return (
    <Shell session={session} title={c.name}>
      <p className="-mt-4 mb-6 text-sm text-zinc-500">
        <Link href="/crm" className="underline">CRM</Link>
        {' · '}
        {[c.title, c.organization].filter(Boolean).join(', ')}
        {c.email && (
          <>
            {' · '}
            <a href={`mailto:${c.email}`} className="underline">{c.email}</a>
          </>
        )}
        {c.phone && (
          <>
            {' · '}
            <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className="underline">{c.phone}</a>
          </>
        )}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="space-y-6 min-w-0">
          <section className={`${card} p-6`}>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">History</h2>
            <ActivityForm id={c.id} />
            <ol className="mt-6 space-y-4">
              {activities.map((a) => (
                <li key={a.id} className="border-t border-zinc-100 pt-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${KIND_STYLE[a.kind]}`}>{ACTIVITY_LABEL[a.kind]}</span>
                    <span>{a.author}</span>
                    <span>·</span>
                    <time dateTime={new Date(a.at).toISOString()}>{when(a.at)}</time>
                    {a.kind !== 'form' && a.kind !== 'stage' && (admin || a.author === session.name) && (
                      <form action={deleteActivityAction} className="ml-auto">
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="activity" value={a.id} />
                        <button type="submit" className="text-zinc-400 hover:text-red-600">Remove</button>
                      </form>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-zinc-800 whitespace-pre-wrap break-words">{a.body}</p>
                </li>
              ))}
              {activities.length === 0 && <li className="text-sm text-zinc-500">Nothing logged yet.</li>}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className={`${card} p-6`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-zinc-900">Tasks</h2>
              <Link href={`/tasks?contact=${c.id}#add`} className="text-sm underline text-zinc-600">Add task</Link>
            </div>
            <ul className="space-y-2 text-sm">
              {tasks.map((t) => (
                <li key={t.id} className="flex justify-between gap-3">
                  <span className={t.status === 'done' ? 'line-through text-zinc-400' : 'text-zinc-800'}>{t.title}</span>
                  <span className="text-xs text-zinc-500 whitespace-nowrap">{t.dueOn ? day(t.dueOn) : TASK_STATUS_LABEL[t.status]}</span>
                </li>
              ))}
              {tasks.length === 0 && <li className="text-zinc-500">No open tasks.</li>}
            </ul>
          </section>
          <p className="text-xs text-zinc-500 px-1">
            Added {when(c.createdAt)} by {c.createdBy}
            {c.source && <> · Source: {c.source}</>}
          </p>
        </aside>
      </div>

      <section className={`${card} p-6 mt-6`}>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Details</h2>
        <ContactForm contact={c} people={people} me={session.id} />
      </section>

      {admin && (
        <section className="mt-6">
          <DeleteContact id={c.id} name={c.name} />
        </section>
      )}
    </Shell>
  );
}
