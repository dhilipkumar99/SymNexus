// Role names and the session shape, safe to import from client components.

export type Role = 'owner' | 'admin' | 'member';

export const ROLE_LABEL: Record<Role, string> = {
  owner: 'Master admin',
  admin: 'Admin',
  member: 'Member',
};

export interface Session {
  id: string;
  email: string;
  name: string;
  role: Role;
}
