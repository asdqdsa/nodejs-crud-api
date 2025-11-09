import type { IncomingMessage, ServerResponse } from 'node:http';
import { usersData, type User } from '../memory/db.ts';
import { ENDPOINTS, METHODS, STATUS_CODES } from '../utils/constants.ts';
import { getUserById, parseUserId } from './utils.ts';
import { sendJSON } from '../utils/sendJSON.ts';
import { randomUUID } from 'node:crypto';

export function handleUsers({
  req,
  res,
  url,
}: {
  req: IncomingMessage;
  res: ServerResponse;
  url: URL;
}) {
  switch (req.method) {
    case METHODS.GET:
      return handleGet({
        pathname: url.pathname,
        res,
        endpoint: ENDPOINTS.users,
      });

    case METHODS.POST:
      return handlePost({
        pathname: url.pathname,
        res,
        req,
        endpoint: ENDPOINTS.users,
      });

    case METHODS.PUT:
      return handlePut({
        pathname: url.pathname,
        res,
        req,
        endpoint: ENDPOINTS.users,
      });

    case METHODS.DELETE:
      return handleDelete({
        pathname: url.pathname,
        res,
        req,
        endpoint: ENDPOINTS.users,
      });

    default:
      return false;
  }
}

export async function handleDelete({
  pathname,
  res,
  endpoint,
}: {
  pathname: string;
  res: ServerResponse;
  req: IncomingMessage;
  endpoint: string;
}) {
  if (!pathname.startsWith(endpoint + '/')) return false;

  const userId = parseUserId(pathname);

  const user = getUserById(userId);

  if (!user) {
    return sendJSON({
      res,
      data: { message: 'User not Found' },
      status: STATUS_CODES.NOT_FOUND,
    });
  }

  removeInPlace({ id: user.id, entries: usersData });

  res.writeHead(STATUS_CODES.NO_CONTENT);
  res.end();

  return true;
}

export function removeInPlace({
  id,
  entries,
}: {
  id: string;
  entries: User[];
}) {
  const idx = entries.findIndex((ent) => ent.id === id);
  if (idx !== -1) entries.splice(idx, 1);
  return;
}

export async function handlePut({
  pathname,
  res,
  req,
  endpoint,
}: {
  pathname: string;
  res: ServerResponse;
  req: IncomingMessage;
  endpoint: string;
}) {
  if (pathname.startsWith(endpoint)) {
    const userId = parseUserId(pathname);
    const user = getUserById(userId);

    if (!user) {
      return sendJSON({
        res,
        data: { message: 'User not Found' },
        status: STATUS_CODES.NOT_FOUND,
      });
    }

    try {
      const body = await waitBody({ req });
      Object.assign(user, body);
      return sendJSON({
        res,
        data: user,
        status: STATUS_CODES.OK,
      });
    } catch {
      return sendJSON({
        res,
        data: { message: 'Invalid JSON' },
        status: STATUS_CODES.BAD_REQUEST,
      });
    }
  }
}

export async function waitBody({ req }: { req: IncomingMessage }) {
  let body = '';
  return await new Promise((resolve, reject) => {
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', () => reject());
  });
}

export function handleGet({
  pathname,
  res,
  endpoint,
}: {
  pathname: string;
  res: ServerResponse;
  endpoint: string;
}) {
  if (pathname === endpoint) {
    sendJSON({
      res,
      data: usersData,
      status: STATUS_CODES.OK,
    });
    return true;
  }

  if (pathname.startsWith(endpoint + '/')) {
    const userId = parseUserId(pathname);
    const user = getUserById(userId);

    if (!user) {
      sendJSON({
        res,
        data: { message: 'User not Found' },
        status: STATUS_CODES.NOT_FOUND,
      });
      return true;
    }

    sendJSON({
      res,
      data: user,
      status: STATUS_CODES.OK,
    });
    return true;
  }

  return false;
}

export function handlePost({
  pathname,
  res,
  req,
  endpoint,
}: {
  pathname: string;
  res: ServerResponse;
  req: IncomingMessage;
  endpoint: string;
}) {
  if (pathname === endpoint) {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const { name, age, info } = parsed;

        const required = [name, age, info].every(
          (value) => value !== undefined
        );

        if (!required) {
          sendJSON({
            res,
            data: { message: 'Missing required fields' },
            status: STATUS_CODES.BAD_REQUEST,
          });
          return;
        }

        const newUser: User = {
          id: randomUUID(),
          name,
          age,
          info,
        };

        usersData.push(newUser);

        sendJSON({
          res,
          data: newUser,
          status: STATUS_CODES.CREATED,
        });
      } catch {
        sendJSON({
          res,
          data: { message: 'Invalid JSON' },
          status: STATUS_CODES.BAD_REQUEST,
        });
      }
    });
  }
  return true;
}
