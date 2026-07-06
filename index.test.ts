import { describe, it, expect, vi } from 'vitest';
import worker from './src/index.ts';

const mockAssets = {
  fetch: async () => new Response('Mocked Vanilla Static HTML Payload'),
};

describe('Vivijure product site router', () => {
  it('should process root request headers and execute cleanly', async () => {
    const request = new Request('https://vivijure.com', {
      method: 'GET',
    });

    const response = await worker.fetch(request, { ASSETS: mockAssets });

    expect(response.status).toBe(200);
  });

  it('should 301 redirect www to the apex domain', async () => {
    const request = new Request('https://www.vivijure.com/showcase', {
      method: 'GET',
    });

    const response = await worker.fetch(request, { ASSETS: mockAssets });

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://vivijure.com/showcase');
  });

  it('should return health JSON without hitting assets', async () => {
    const request = new Request('https://vivijure.com/health', {
      method: 'GET',
    });

    const assetsFetch = vi.fn();
    const response = await worker.fetch(request, {
      ASSETS: { fetch: assetsFetch },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(assetsFetch).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ ok: true, service: 'vivijure-com' });
  });
});
