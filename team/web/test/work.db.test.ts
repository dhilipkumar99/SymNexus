// CRM, tasks and wiki against a real Postgres:
//   TEST_DATABASE_URL=postgres://team:team-dev-only@127.0.0.1:5434/team_test npm test
// Skipped when TEST_DATABASE_URL is not set. The team_work schema in that
// database is dropped and recreated.

import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

const url = process.env.TEST_DATABASE_URL;
process.env.SESSION_SECRET = 'z'.repeat(48);

describe('team tools (database)', { skip: !url }, async () => {
  process.env.DATABASE_URL = url;
  const { db, pool } = await import('../lib/db.ts');
  const crm = await import('../lib/work/crm.ts');
  const tasks = await import('../lib/work/tasks.ts');
  const wiki = await import('../lib/work/wiki.ts');
  type Session = import('../lib/roles.ts').Session;

  const admin: Session = { id: '00000000-0000-4000-8000-0000000000a1', email: 'crm-ann@symnexus.co', name: 'Ann Lee', role: 'admin' };
  const member: Session = { id: '00000000-0000-4000-8000-0000000000b2', email: 'crm-max@symnexus.co', name: 'Max Roe', role: 'member' };
  const ip = '203.0.113.9';
  const blank = { name: '', email: '', phone: '', organization: '', title: '', stage: 'lead', source: '', value: '', ownerId: '', nextStep: '', nextStepOn: '' };

  before(async () => {
    await pool().query('DROP SCHEMA IF EXISTS team_work CASCADE');
    globalThis.__teamSchema = undefined;
    const p = await db();
    for (const s of [admin, member]) {
      await p.query(
        `INSERT INTO team_auth.accounts (id, email, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [s.id, s.email, s.name, s.role],
      );
    }
  });
  after(async () => {
    await pool().end();
  });

  test('contacts: validation, duplicates, stage history', async () => {
    assert.equal((await crm.createContact(member, { ...blank })).ok, false);
    assert.equal((await crm.createContact(member, { ...blank, name: 'X', email: 'nope' })).ok, false);
    assert.equal((await crm.createContact(member, { ...blank, name: 'X', value: '12.5' })).ok, false);

    const r = await crm.createContact(member, { ...blank, name: ' Jane   Doe ', email: 'Jane@Lab.org', organization: 'Lab', value: '$25,000', ownerId: member.id, nextStepOn: '2026-11-04', nextStep: 'Call' });
    assert.ok(r.ok);
    const dup = await crm.createContact(admin, { ...blank, name: 'Jane again', email: 'jane@lab.org' });
    assert.deepEqual(dup, { ok: false, error: 'jane@lab.org is already in the CRM.' });

    const found = await crm.getContact(r.id);
    assert.equal(found?.contact.name, 'Jane Doe');
    assert.equal(found?.contact.email, 'jane@lab.org');
    assert.equal(found?.contact.valueUsd, 25000);
    assert.equal(found?.contact.ownerName, 'Max Roe');
    assert.equal(found?.contact.nextStepOn, '2026-11-04');

    await crm.setStage(member, r.id, 'qualified');
    await crm.setStage(member, r.id, 'qualified'); // no change, no entry
    assert.equal((await crm.setStage(member, r.id, 'bogus')).ok, false);
    await crm.updateContact(admin, r.id, { ...blank, name: 'Jane Doe', email: 'jane@lab.org', stage: 'proposal', value: '30000' });
    const h = await crm.getContact(r.id);
    assert.deepEqual(h?.activities.map((a) => [a.kind, a.body, a.author]), [
      ['stage', 'Qualified → Proposal', 'Ann Lee'],
      ['stage', 'Lead → Qualified', 'Max Roe'],
    ]);
    assert.equal(h?.contact.ownerId, null); // the edit form cleared it

    const summary = await crm.pipelineSummary();
    assert.deepEqual(summary.proposal, { count: 1, value: 30000 });
    assert.equal((await crm.listContacts({ q: 'lab' })).length, 1);
    assert.equal((await crm.listContacts({ q: '%' })).length, 0);
    assert.equal((await crm.listContacts({ stage: 'lead' })).length, 0);
  });

  test('activities: anyone adds, authors or admins remove, history entries stay', async () => {
    const { id } = (await crm.createContact(member, { ...blank, name: 'Notes Person' })) as { id: string };
    assert.equal((await crm.addActivity(member, id, 'call', '  ')).ok, false);
    assert.equal((await crm.addActivity(member, id, 'form', 'x')).ok, false);
    assert.ok((await crm.addActivity(member, id, 'call', 'Spoke to Max')).ok);
    assert.ok((await crm.addActivity(admin, id, 'note', 'Admin note')).ok);
    const acts = (await crm.getContact(id))!.activities;
    const mine = acts.find((a) => a.body === 'Spoke to Max')!;
    const theirs = acts.find((a) => a.body === 'Admin note')!;
    assert.equal((await crm.deleteActivity(member, theirs.id)).ok, false);
    assert.ok((await crm.deleteActivity(member, mine.id)).ok);
    assert.ok((await crm.deleteActivity(admin, theirs.id)).ok);
    assert.equal((await crm.addActivity(member, '00000000-0000-4000-8000-000000000000', 'note', 'x')).ok, false);
  });

  test('website leads: new address creates a lead, a known one gets a note and reopens', async () => {
    assert.equal((await crm.recordLead({ email: 'not an email' })).ok, false);
    const first = await crm.recordLead({ source: 'Website demo request', firstName: 'Ravi', lastName: 'K', email: 'Ravi@Pharma.com', organization: 'Pharma Co', role: 'QA Lead', product: 'ComplianceCall', message: 'Hello' });
    assert.ok(first.ok && first.created);
    const c1 = (await crm.getContact(first.id))!;
    assert.equal(c1.contact.name, 'Ravi K');
    assert.equal(c1.contact.stage, 'lead');
    assert.equal(c1.contact.source, 'Website demo request');
    assert.equal(c1.activities[0].kind, 'form');
    assert.match(c1.activities[0].body, /^Website demo request\nProduct of interest: ComplianceCall\n\nHello$/);

    await crm.setStage(admin, first.id, 'lost');
    const again = await crm.recordLead({ firstName: 'R', email: 'ravi@pharma.com', message: 'Back again', phone: '555' });
    assert.ok(again.ok && !again.created && again.id === first.id);
    const c2 = (await crm.getContact(first.id))!;
    assert.equal(c2.contact.stage, 'lead');
    assert.equal(c2.contact.name, 'Ravi K'); // the name a person typed in the CRM is kept
    assert.equal(c2.contact.phone, '555');
    assert.equal(c2.activities.filter((a) => a.kind === 'form').length, 2);

    // Two submissions at once from a new address: one contact, two notes.
    const [a, b] = await Promise.all([crm.recordLead({ email: 'race@x.io' }), crm.recordLead({ email: 'race@x.io' })]);
    assert.ok(a.ok && b.ok && a.id === b.id);
    assert.equal((await crm.getContact(a.id))!.activities.length, 2);
  });

  test('deleting contacts: admins only, audited, tasks kept', async () => {
    const { id } = (await crm.createContact(member, { ...blank, name: 'Gone Soon', email: 'gone@x.io' })) as { id: string };
    const t = await tasks.saveTask(member, null, { title: 'Follow up', notes: '', status: 'todo', assigneeId: '', dueOn: '', contactId: id });
    assert.ok(t.ok);
    assert.equal((await crm.deleteContact(member, id, ip)).ok, false);
    assert.ok((await crm.deleteContact(admin, id, ip)).ok);
    assert.equal(await crm.getContact(id), null);
    const { rows } = await pool().query("SELECT target_email FROM team_auth.audit_log WHERE action = 'crm.contact_deleted'");
    assert.deepEqual(rows.map((r) => r.target_email), ['gone@x.io']);
    const kept = (await tasks.listTasks()).find((x) => x.id === t.id);
    assert.equal(kept?.contactId, null);
  });

  test('tasks: create, move, done timestamps, filters, delete', async () => {
    assert.equal((await tasks.saveTask(member, null, { title: ' ', notes: '', status: 'todo', assigneeId: '', dueOn: '', contactId: '' })).ok, false);
    const r = await tasks.saveTask(member, null, { title: 'Write case study', notes: 'n', status: 'todo', assigneeId: admin.id, dueOn: '2026-11-10', contactId: '' });
    assert.ok(r.ok);
    await tasks.moveTask(r.id, 'done');
    let t = (await tasks.listTasks({ assignee: admin.id })).find((x) => x.id === r.id)!;
    assert.equal(t.status, 'done');
    assert.ok(t.doneAt);
    assert.equal(t.assigneeName, 'Ann Lee');
    assert.equal(t.dueOn, '2026-11-10');
    await tasks.moveTask(r.id, 'doing');
    t = (await tasks.listTasks()).find((x) => x.id === r.id)!;
    assert.equal(t.doneAt, null);
    assert.equal((await tasks.listTasks({ assignee: member.id })).some((x) => x.id === r.id), false);

    // Done more than 14 days ago: off the board.
    await tasks.moveTask(r.id, 'done');
    await pool().query("UPDATE team_work.tasks SET done_at = now() - interval '15 days' WHERE id = $1", [r.id]);
    assert.equal((await tasks.listTasks()).some((x) => x.id === r.id), false);
    assert.ok((await tasks.deleteTask(r.id)).ok);
    assert.equal((await tasks.deleteTask(r.id)).ok, false);
  });

  test('wiki: seeded once, unique slugs, admin-only delete', async () => {
    const pages = await wiki.listPages();
    assert.deepEqual(pages.map((p) => p.slug).sort(), ['brand-kit', 'how-we-work', 'onboarding-checklist', 'product-one-pagers', 'sales-playbook', 'setup-checklist']);
    assert.equal((await wiki.savePage(member, null, '', 'x')).ok, false);
    const a = await wiki.savePage(member, null, 'How we work', 'dup');
    assert.deepEqual(a, { ok: true, slug: 'how-we-work-2' });
    const n = await wiki.savePage(member, null, 'New', 'x');
    assert.deepEqual(n, { ok: true, slug: 'new-2' });
    assert.ok((await wiki.savePage(member, 'how-we-work-2', 'Renamed', 'body')).ok);
    assert.equal((await wiki.getPage('how-we-work-2'))?.title, 'Renamed');
    assert.equal((await wiki.deletePage(member, 'how-we-work-2', ip)).ok, false);
    assert.ok((await wiki.deletePage(admin, 'how-we-work-2', ip)).ok);

    // An empty wiki gets the starter pages again.
    await pool().query('DELETE FROM team_work.pages');
    assert.equal((await wiki.listPages()).length, 6);
  });
});
