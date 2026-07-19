import { describe, expect, it, vi } from 'vitest';
import { ForgeApiClient } from '../src/forge/client.js';

describe('ForgeApiClient', () => {
  it('validates a Forge health response', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ status: 'ok', service: 'forge' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    }));
    const client = new ForgeApiClient({
      baseUrl: 'https://ksforge.app/api/integrations/discord/v1',
      serviceToken: 'test-token',
      fetchImpl: fetchImpl as typeof fetch
    });
    await expect(client.health()).resolves.toEqual({ status: 'ok', service: 'forge' });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});
