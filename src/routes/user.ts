import type { IncomingMessage, ServerResponse } from 'node:http';
import { usersData } from '../memory/db.ts';
import { ENDPOINTS } from '../utils/constants.ts';
import { getUserById, parseUserId } from './utils.ts';

export function handleUsers({
  req,
  res,
  url,
}: {
  req: IncomingMessage;
  res: ServerResponse;
  url: URL;
}) {
  if (req.method === 'GET' && url.pathname === ENDPOINTS.users) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(usersData));
    return;
  }

  if (req.method == 'GET' && url.pathname.startsWith(ENDPOINTS.users)) {
    const userId = parseUserId(url.pathname);
    const user = getUserById(userId);

    if (!user) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify({ message: 'User Found' }));
      return true;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    return true;
  }

  return false;
}
