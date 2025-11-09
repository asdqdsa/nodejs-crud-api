import { usersData } from '../memory/db.ts';

export const parseUserId = (path: string) => {
  return path.split('/').at(-1);
};

export const getUserById = (idx: string | undefined) => {
  if (!idx) return null;
  return usersData.find(({ id }) => id === idx);
};

export function isValidUuid(uuid: string | undefined): boolean {
  const rx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid) return false;
  return rx.test(uuid);
}
