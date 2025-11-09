import type { ServerResponse } from 'node:http';
import type { STATUS_CODES } from './constants';

type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

export function sendJSON<T>({
  res,
  status,
  data,
}: {
  res: ServerResponse;
  status: StatusCode;
  data: T;
}) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
