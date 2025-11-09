import { usersData } from '../memory/db.ts';

export const parseUserId = (path: string) => {
  return path.split('/').at(-1);
};

export const getUserById = (idx: string | undefined) => {
  if (!idx) return null;
  return usersData.find(({ id }) => id === idx);
};
