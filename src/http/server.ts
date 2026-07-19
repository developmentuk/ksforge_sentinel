import { createServer } from 'node:http';
import type { Client } from 'discord.js';
import type { Logger } from '../core/logger.js';

export function startHealthServer(port: number, client: Client, logger: Logger) {
  const server = createServer((request, response) => {
    if (request.url !== '/health') {
      response.writeHead(404).end('Not found');
      return;
    }
    const ready = client.isReady();
    response.writeHead(ready ? 200 : 503, { 'content-type': 'application/json' });
    response.end(JSON.stringify({
      status: ready ? 'ok' : 'starting',
      service: 'ksforge-sentinel',
      discordReady: ready
    }));
  });
  server.listen(port, () => logger.info({ port }, 'Health server listening'));
  return server;
}
