import Link from 'next/link';
import { Shell } from '@/app/components/Shell';
import { card, day, today } from '@/app/components/ui';
import { listContacts } from '@/lib/work/crm';
import { listPeople } from '@/lib/work/people';
import { listTasks, TASK_STATUS_LABEL, TASK_STATUSES, type TaskStatus } from '@/lib/work/tasks';
import { requireSession } from '@/lib/request';
import { deleteTaskAction, moveTaskAction } from './actions';
import { TaskForm } from './forms';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Tasks · SymNexus Team' };

const NEXT: Record<TaskStatus, TaskStatus | null> = { todo: 'doing', doing: 'done', done: null };
const PREV: Record<TaskStatus, TaskStatus | null> = { todo: null, doing: 'todo', done: 'doing' };

function Move({ id, to, label }: { id: string; to: TaskStatus; label: string }) {
  return (
    <form action={moveTaskAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={to} />
      <button type="submit" className="px-2 py-1 rounded-lg text-xs text-zinc-600 hover:bg-zinc-100">{label}</button>
    </form>
  );
}

export default async function TasksPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await requireSession('/tasks');
  const sp = await searchParams;
  const mine = sp.who === 'me';
  const [tasks, people, contacts] = await Promise.all([
    listTasks({ assignee: mine ? session.id : undefined }),
    listPeople(),
    listContacts(),
  ]);
  const contactOptions = contacts.map((c) => ({ id: c.id, name: c.organization ? `${c.name} (${c.organization})` : c.name }));
  const now = today();

  return (
    <Shell session={session} title="Tasks" wide>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 text-sm">
          <Link href="/tasks" className={`px-3 py-1.5 rounded-lg ${!mine ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>Everyone</Link>
          <Link href="/tasks?who=me" className={`px-3 py-1.5 rounded-lg ${mine ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>Mine</Link>
        </div>
        <p className="text-sm text-zinc-500">Done tasks leave the board after 14 days.</p>
        <a href="#add" className="ml-auto text-sm font-semibold text-[var(--primary)] hover:underline">Add task</a>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {TASK_STATUSES.map((status) => {
          const col = tasks.filter((t) => t.status === status);
          return (
            <section key={status} className="bg-zinc-100/70 rounded-2xl p-3 min-h-40" aria-label={TASK_STATUS_LABEL[status]}>
              <h2 className="px-1 pb-2 text-sm font-semibold text-zinc-700 flex justify-between">
                {TASK_STATUS_LABEL[status]} <span className="text-zinc-400 tabular-nums">{col.length}</span>
              </h2>
              <ul className="space-y-2">
                {col.map((t) => {
                  const overdue = t.dueOn !== null && t.dueOn < now && status !== 'done';
                  const prev = PREV[status];
                  const next = NEXT[status];
                  return (
                    <li key={t.id} className={`${card} p-3`}>
                      <p className={`font-medium ${status === 'done' ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>{t.title}</p>
                      {t.notes && <p className="mt-1 text-xs text-zinc-500 line-clamp-3 whitespace-pre-wrap">{t.notes}</p>}
                      <p className="mt-2 flex flex-wrap gap-x-2 text-xs text-zinc-500">
                        {t.assigneeName && <span>{t.assigneeName}</span>}
                        {t.dueOn && <span className={overdue ? 'text-red-600 font-medium' : ''}>Due {day(t.dueOn)}</span>}
                        {t.contactId && <Link href={`/crm/${t.contactId}`} className="underline">{t.contactName}</Link>}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        {prev && <Move id={t.id} to={prev} label={`← ${TASK_STATUS_LABEL[prev]}`} />}
                        {next && <Move id={t.id} to={next} label={`${TASK_STATUS_LABEL[next]} →`} />}
                      </div>
                      <details className="mt-1">
                        <summary className="cursor-pointer px-2 py-1 text-xs text-zinc-500 hover:text-zinc-800">Edit</summary>
                        <div className="mt-2 pt-3 border-t border-zinc-100 space-y-3">
                          <TaskForm task={t} people={people} contacts={contactOptions} />
                          <form action={deleteTaskAction}>
                            <input type="hidden" name="id" value={t.id} />
                            <button type="submit" className="text-xs text-red-600 hover:underline">Delete task</button>
                          </form>
                        </div>
                      </details>
                    </li>
                  );
                })}
                {col.length === 0 && <li className="px-1 text-xs text-zinc-400">Nothing here.</li>}
              </ul>
            </section>
          );
        })}
      </div>

      <section id="add" className={`${card} p-6 max-w-2xl scroll-mt-6`}>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Add a task</h2>
        <TaskForm people={people} contacts={contactOptions} defaults={{ assignee: session.id, contact: sp.contact }} />
      </section>
    </Shell>
  );
}
