// The task board: to do, doing, done. Every signed-in employee can add, edit,
// move and delete tasks; a task can be tied to a CRM contact.

import type { Result } from '../accounts.ts';
import type { Session } from '../auth.ts';
import { db } from '../db.ts';
import { UUID_RE } from './crm.ts';
import { TASK_STATUSES, type TaskStatus } from './labels.ts';
export { TASK_STATUS_LABEL, TASK_STATUSES, type TaskStatus } from './labels.ts';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const fail = (error: string) => ({ ok: false as const, error });

export interface Task {
  id: string;
  title: string;
  notes: string;
  status: TaskStatus;
  assigneeId: string | null;
  assigneeName: string | null;
  dueOn: string | null; // YYYY-MM-DD
  contactId: string | null;
  contactName: string | null;
  createdBy: string;
  updatedAt: Date;
  doneAt: Date | null;
}

export interface TaskInput {
  title: string;
  notes: string;
  status: string;
  assigneeId: string;
  dueOn: string;
  contactId: string;
}

function clean(input: TaskInput) {
  const title = input.title.trim().replace(/\s+/g, ' ');
  if (!title || title.length > 200) return fail('Give the task a title (up to 200 characters).');
  const notes = input.notes.replace(/\r\n/g, '\n').trim();
  if (notes.length > 5000) return fail('Keep notes under 5,000 characters.');
  if (input.assigneeId && !UUID_RE.test(input.assigneeId)) return fail('Choose who it is for from the list.');
  if (input.contactId && !UUID_RE.test(input.contactId)) return fail('Contact not found.');
  if (input.dueOn && !DATE_RE.test(input.dueOn)) return fail('Enter the due date as a date.');
  const status = (TASK_STATUSES as readonly string[]).includes(input.status) ? (input.status as TaskStatus) : 'todo';
  return {
    ok: true as const,
    v: { title, notes, status, assigneeId: input.assigneeId || null, dueOn: input.dueOn || null, contactId: input.contactId || null },
  };
}

// Open tasks, and tasks finished in the last 14 days (older ones drop off the board).
export async function listTasks(filter: { assignee?: string; contact?: string } = {}): Promise<Task[]> {
  const args: unknown[] = [];
  const where = ["(t.status <> 'done' OR t.done_at > now() - interval '14 days')"];
  if (filter.assignee && UUID_RE.test(filter.assignee)) {
    args.push(filter.assignee);
    where.push(`t.assignee_id = $${args.length}`);
  }
  if (filter.contact && UUID_RE.test(filter.contact)) {
    args.push(filter.contact);
    where.push(`t.contact_id = $${args.length}`);
  }
  const { rows } = await (await db()).query(
    `SELECT t.id, t.title, t.notes, t.status, t.assignee_id, a.name AS assignee_name,
            to_char(t.due_on, 'YYYY-MM-DD') AS due_on, t.contact_id, c.name AS contact_name,
            t.created_by, t.updated_at, t.done_at
       FROM team_work.tasks t
       LEFT JOIN team_auth.accounts a ON a.id = t.assignee_id
       LEFT JOIN team_work.contacts c ON c.id = t.contact_id
      WHERE ${where.join(' AND ')}
      ORDER BY t.due_on ASC NULLS LAST, t.created_at ASC
      LIMIT 1000`,
    args,
  );
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    notes: r.notes,
    status: r.status,
    assigneeId: r.assignee_id,
    assigneeName: r.assignee_name,
    dueOn: r.due_on,
    contactId: r.contact_id,
    contactName: r.contact_name,
    createdBy: r.created_by,
    updatedAt: r.updated_at,
    doneAt: r.done_at,
  }));
}

export async function saveTask(actor: Session, id: string | null, input: TaskInput): Promise<Result<{ id: string }>> {
  const r = clean(input);
  if (!r.ok) return r;
  const v = r.v;
  const pool = await db();
  if (id) {
    if (!UUID_RE.test(id)) return fail('Task not found.');
    const u = await pool.query(
      `UPDATE team_work.tasks
          SET title = $2, notes = $3, status = $4, assignee_id = $5, due_on = $6, contact_id = $7, updated_at = now(),
              done_at = CASE WHEN $4 = 'done' THEN coalesce(done_at, now()) END
        WHERE id = $1`,
      [id, v.title, v.notes, v.status, v.assigneeId, v.dueOn, v.contactId],
    );
    return u.rowCount ? { ok: true, id } : fail('Task not found.');
  }
  const { rows } = await pool.query(
    `INSERT INTO team_work.tasks (title, notes, status, assignee_id, due_on, contact_id, created_by, done_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, CASE WHEN $3 = 'done' THEN now() END) RETURNING id`,
    [v.title, v.notes, v.status, v.assigneeId, v.dueOn, v.contactId, actor.email],
  );
  return { ok: true, id: rows[0].id };
}

export async function moveTask(id: string, status: string): Promise<Result> {
  if (!UUID_RE.test(id) || !(TASK_STATUSES as readonly string[]).includes(status)) return fail('Task not found.');
  const { rowCount } = await (await db()).query(
    `UPDATE team_work.tasks SET status = $2, updated_at = now(),
            done_at = CASE WHEN $2 = 'done' THEN coalesce(done_at, now()) END
      WHERE id = $1`,
    [id, status],
  );
  return rowCount ? { ok: true } : fail('Task not found.');
}

export async function deleteTask(id: string): Promise<Result> {
  if (!UUID_RE.test(id)) return fail('Task not found.');
  const { rowCount } = await (await db()).query('DELETE FROM team_work.tasks WHERE id = $1', [id]);
  return rowCount ? { ok: true } : fail('Task not found.');
}
