// Active team members, for owner and assignee pickers.

import { db } from '../db.ts';

export async function listPeople(): Promise<{ id: string; name: string }[]> {
  const { rows } = await (await db()).query(
    'SELECT id, name FROM team_auth.accounts WHERE active ORDER BY lower(name)',
  );
  return rows;
}
