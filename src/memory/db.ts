import { randomUUID } from 'node:crypto';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export const usersData: User[] = [
  {
    id: randomUUID(),
    username: 'John Doe',
    age: 30,
    hobbies: ['Crime and Justice Department'],
  },
  {
    id: randomUUID(),
    username: 'Jane Doe',
    age: 25,
    hobbies: ['State Department of Education'],
  },
];
