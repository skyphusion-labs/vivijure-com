// vivijure.com -- the Vivijure product site worker.
//
// Deliberately tiny: serve the static marketing site from public/ via Workers
// Assets. Keep it that way. The studio app (planner / cast / render) lives at
// vivijure.skyphusion.org, and the source lives on GitHub; this repo is the
// front door that explains and sells (for $0) the product.

export interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = "vivijure.com";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true, service: "vivijure-com" }), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
