// CRM stages and task statuses, safe to import from client components.

export const STAGES = ['lead', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABEL: Record<Stage, string> = {
  lead: 'Lead',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export const ACTIVITY_KINDS = ['note', 'call', 'email', 'meeting'] as const;
export type ActivityKind = (typeof ACTIVITY_KINDS)[number] | 'form' | 'stage';
export const ACTIVITY_LABEL: Record<ActivityKind, string> = {
  note: 'Note',
  call: 'Call',
  email: 'Email',
  meeting: 'Meeting',
  form: 'Website form',
  stage: 'Stage',
};

export const TASK_STATUSES = ['todo', 'doing', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = { todo: 'To do', doing: 'Doing', done: 'Done' };
