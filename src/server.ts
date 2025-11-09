import http, { IncomingMessage, ServerResponse } from 'node:http';
import { config } from './utils/config.ts';

console.log('Booting...');

console.log(`PORT: ${config.port}`);

const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: 'Henlo ',
      msg: 'OK',
    })
  );
});

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
