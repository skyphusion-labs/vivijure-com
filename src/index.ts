// The Vivijure OSS site worker: vivijure.dev, with vivijure.org and vivijure.com.
//
// Deliberately tiny: serve the static site from public/ via Workers Assets. Keep it that way.
// The source lives on GitHub; this repo is the front door that explains the product.
//
// Hosts (Conrad, 2026-11-11):
//   vivijure.dev           the home: serves the site. Canonical URLs point here.
//   www.vivijure.dev       301 to https://vivijure.dev, path and query kept.
//   vivijure.org, www.     301 to https://vivijure.dev, path and query kept.
//   vivijure.com           serves the same site for now (it becomes the hosted door later).
//   www.vivijure.com       301 to https://vivijure.com, as before.
//   *.vivijure.com         served as before (those names route to other Workers; this one
//                          never sees them unless a route is added here).
//   anything else          (workers.dev, a stray route) 301 to https://vivijure.dev.

export interface Env {
  ASSETS: Fetcher;
}

export const CANONICAL_HOST = "vivijure.dev";
const COM_HOST = "vivijure.com";

function redirect(url: URL, host: string): Response {
  const to = new URL(url.toString());
  to.protocol = "https:";
  to.hostname = host;
  to.port = "";
  return Response.redirect(to.toString(), 301);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    if (host === `www.${COM_HOST}`) return redirect(url, COM_HOST);

    const serves = host === CANONICAL_HOST || host === COM_HOST || host.endsWith(`.${COM_HOST}`);
    // Everything else is redirected home: www.vivijure.dev, vivijure.org and www.vivijure.org by
    // design, and workers.dev or a stray route so they never serve duplicate content (K3).
    if (!serves) return redirect(url, CANONICAL_HOST);

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true, service: "vivijure-com" }), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
