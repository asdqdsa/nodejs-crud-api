import http, { IncomingMessage, ServerResponse } from 'node:http';
import { handleUsers } from './routes/user.ts';
import { config } from './utils/config.ts';

console.log('Booting...');

console.log(`PORT: ${config.port}`);

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);

    const users = handleUsers({
      req,
      res,
      url,
    });

    if (!users) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  }
);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
