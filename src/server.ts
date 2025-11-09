import http, { IncomingMessage, ServerResponse } from 'node:http';
import { handleUsers } from './routes/user.ts';
import { config } from './utils/config.ts';
import { sendJSON } from './utils/sendJSON.ts';
import { STATUS_CODES } from './utils/constants.ts';

console.log('Booting...');

console.log(`PORT: ${config.port}`);

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);

    const users = handleUsers({
      req,
      res,
      url,
    });

    if (!users) {
      sendJSON({
        res,
        data: { message: 'Endpoint not Found' },
        status: STATUS_CODES.NOT_FOUND,
      });
    }
  }
);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
