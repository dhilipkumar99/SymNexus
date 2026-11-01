// The team wiki: Markdown pages anyone signed in can read and edit. The first
// visit seeds the starter pages (lib/work/wiki-seed.ts) into an empty wiki.

import { isAdmin, type Result } from '../accounts.ts';
import { audit, type Session } from '../auth.ts';
import { db } from '../db.ts';
import { SEED_PAGES } from './wiki-seed.ts';

const fail = (error: string) => ({ ok: false as const, error });

export interface WikiPage {
  slug: string;
  title: string;
  body: string;
  updatedBy: string;
  updatedAt: Date;
}

export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

async function seed(): Promise<void> {
  const pool = await db();
  const { rows } = await pool.query('SELECT EXISTS (SELECT 1 FROM team_work.pages) AS any');
  if (rows[0].any) return;
  for (const p of SEED_PAGES) {
    await pool.query(
      "INSERT INTO team_work.pages (slug, title, body, updated_by) VALUES ($1, $2, $3, 'SymNexus Team') ON CONFLICT (slug) DO NOTHING",
      [p.slug, p.title, p.body],
    );
  }
}

export async function listPages(): Promise<Pick<WikiPage, 'slug' | 'title' | 'updatedBy' | 'updatedAt'>[]> {
  await seed();
  const { rows } = await (await db()).query(
    'SELECT slug, title, updated_by, updated_at FROM team_work.pages ORDER BY lower(title)',
  );
  return rows.map((r) => ({ slug: r.slug, title: r.title, updatedBy: r.updated_by, updatedAt: r.updated_at }));
}

export async function getPage(slug: string): Promise<WikiPage | null> {
  const { rows } = await (await db()).query(
    'SELECT slug, title, body, updated_by, updated_at FROM team_work.pages WHERE slug = $1',
    [slug],
  );
  const r = rows[0];
  return r ? { slug: r.slug, title: r.title, body: r.body, updatedBy: r.updated_by, updatedAt: r.updated_at } : null;
}

// Creates a page (slug null) or updates one. The slug is fixed at creation so links keep working.
export async function savePage(actor: Session, slug: string | null, title: string, body: string): Promise<Result<{ slug: string }>> {
  const t = title.trim().replace(/\s+/g, ' ');
  if (!t || t.length > 120) return fail('Give the page a title (up to 120 characters).');
  const text = body.replace(/\r\n/g, '\n');
  if (text.length > 100_000) return fail('Keep the page under 100,000 characters.');
  const pool = await db();
  if (slug) {
    const { rowCount } = await pool.query(
      'UPDATE team_work.pages SET title = $2, body = $3, updated_by = $4, updated_at = now() WHERE slug = $1',
      [slug, t, text, actor.name],
    );
    return rowCount ? { ok: true, slug } : fail('Page not found.');
  }
  const base = slugify(t) || 'page';
  for (let n = 1; n < 50; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    if (candidate === 'new') continue; // /wiki/new is the editor
    const { rowCount } = await pool.query(
      'INSERT INTO team_work.pages (slug, title, body, updated_by) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING',
      [candidate, t, text, actor.name],
    );
    if (rowCount) return { ok: true, slug: candidate };
  }
  return fail('Choose a different title.');
}

export async function deletePage(actor: Session, slug: string, ip: string): Promise<Result> {
  if (!isAdmin(actor)) return fail('Only admins can delete wiki pages.');
  const { rows } = await (await db()).query('DELETE FROM team_work.pages WHERE slug = $1 RETURNING title', [slug]);
  if (!rows[0]) return fail('Page not found.');
  await audit(actor, 'wiki.page_deleted', null, { title: rows[0].title }, ip);
  return { ok: true };
}
