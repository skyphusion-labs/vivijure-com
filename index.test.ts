import { describe, it, expect, vi } from 'vitest';
import worker from './src/index.ts';

function assets() {
  return { fetch: vi.fn(async () => new Response('Mocked Vanilla Static HTML Payload')) };
}

async function get(url: string, a = assets()) {
  const response = await worker.fetch(new Request(url, { method: 'GET' }), { ASSETS: a } as never);
  return { response, a };
}

describe('vivijure.dev is the home', () => {
  it('serves the site on vivijure.dev', async () => {
    const { response, a } = await get('https://vivijure.dev/');
    expect(response.status).toBe(200);
    expect(a.fetch).toHaveBeenCalledTimes(1);
  });

  it('301s www.vivijure.dev to the apex, keeping path and query', async () => {
    const { response, a } = await get('https://www.vivijure.dev/showcase?ref=x');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://vivijure.dev/showcase?ref=x');
    expect(a.fetch).not.toHaveBeenCalled();
  });
});

describe('vivijure.org 301s to vivijure.dev', () => {
  for (const host of ['vivijure.org', 'www.vivijure.org']) {
    it(`${host}/x keeps the path`, async () => {
      const { response, a } = await get(`https://${host}/x`);
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('https://vivijure.dev/x');
      expect(a.fetch).not.toHaveBeenCalled();
    });
  }

  it('keeps the query and the fragment-free path, and moves http to https', async () => {
    const { response } = await get('http://vivijure.org/a/b?c=1&d=two');
    expect(response.headers.get('location')).toBe('https://vivijure.dev/a/b?c=1&d=two');
  });

  it('redirects /health too, so .org never answers as the site', async () => {
    const { response } = await get('https://vivijure.org/health');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://vivijure.dev/health');
  });
});

describe('vivijure.com serves the same site for now', () => {
  it('serves the site on vivijure.com, with no redirect', async () => {
    const { response, a } = await get('https://vivijure.com/');
    expect(response.status).toBe(200);
    expect(a.fetch).toHaveBeenCalledTimes(1);
  });

  it('still 301s www.vivijure.com to the .com apex, as before', async () => {
    const { response } = await get('https://www.vivijure.com/showcase');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://vivijure.com/showcase');
  });
});

describe('any other host goes to the home', () => {
  it('301s a workers.dev host to vivijure.dev', async () => {
    const { response, a } = await get('https://vivijure-com.example.workers.dev/p?q=1');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://vivijure.dev/p?q=1');
    expect(a.fetch).not.toHaveBeenCalled();
  });
});

describe('/health', () => {
  for (const host of ['vivijure.dev', 'vivijure.com']) {
    it(`answers JSON on ${host} without touching assets`, async () => {
      const { response, a } = await get(`https://${host}/health`);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');
      expect(a.fetch).not.toHaveBeenCalled();
      await expect(response.json()).resolves.toEqual({ ok: true, service: 'vivijure-com' });
    });
  }
});
