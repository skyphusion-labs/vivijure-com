# vivijure.com

The product site for **Vivijure**, the self-hosted, AGPL-3.0 AI film studio by
[Skyphusion Labs](https://skyphusion.org). A single thin Cloudflare Worker that serves a static
site from `public/` over Workers Assets. No build step, no framework, vanilla HTML/CSS/JS by
design.

This repo is the front door that explains the product. The constellation map lives at
[github.com/skyphusion-labs/vivijure](https://github.com/skyphusion-labs/vivijure). Deploy the
control panel with [vivijure-cf](https://github.com/skyphusion-labs/vivijure-cf) (Cloudflare) or
[vivijure-local](https://github.com/skyphusion-labs/vivijure-local) (home PC or any cloud server).

## Commands

```bash
npm install
npm run dev          # wrangler dev -> http://localhost:8787
npm run typecheck    # tsc --noEmit -- the CI gate; run before pushing
npm run deploy       # wrangler deploy (account from CLOUDFLARE_ACCOUNT_ID)
npx vitest run       # the router tests (index.test.ts)
```

Edit `public/` for content and design. `src/index.ts` stays intentionally tiny: serve assets,
answer `/health`, and 301-redirect `www` to the apex.

## Architecture

- **The Worker is deliberately tiny.** `src/index.ts` exports a single `fetch` handler: it
  301-redirects `www.vivijure.com` to the bare apex (preserving path), answers `/health` with a
  JSON liveness object, and otherwise hands the request to `env.ASSETS.fetch(request)`. The static
  site in `public/` is the product; the Worker is just the shell.
- **Static assets, served by Workers Assets.** `wrangler.toml` binds `public/` as `ASSETS`. Content
  lives in `public/`: `index.html`, `styles.css`, `main.js` (a dependency-free
  IntersectionObserver reveal-on-scroll, skipped under `prefers-reduced-motion`), self-hosted
  `fonts/`, `logo-icon.svg`, `robots.txt`, `sitemap.xml`.
- **Both hostnames are Workers Custom Domains.** `[[routes]]` provisions proxied DNS + cert for the
  bare apex `vivijure.com` and `www.vivijure.com` via `custom_domain = true`.
- **Showcase media is external.** The showcase films and the pipeline diagram are served from
  `assets.skyphusion.net`, so this repo stays small and text-only.

## SEO

- **Structured data (JSON-LD):** `WebSite`, `WebPage`, `SoftwareApplication`, `Organization` and
  `Person` (both with full `sameAs` backlink arrays), a `BreadcrumbList`, and a `VideoObject` for
  each of the four showcase films (Google / Bing video rich results).
- **Sitemap:** `public/sitemap.xml` is a video + image sitemap (the four films as `video:video`
  entries, the OG image as `image:image`). Referenced from `robots.txt` and a `<link rel="sitemap">`.
- **Bing / IndexNow:** `public/<key>.txt` is the IndexNow key file. After a content change, resubmit:

  ```bash
  KEY=$(ls public/*.txt | xargs -n1 basename | sed 's/.txt//')
  curl "https://api.indexnow.org/indexnow?url=https://vivijure.com/&key=${KEY}&keyLocation=https://vivijure.com/${KEY}.txt"
  ```

- **Google:** the sitemap-ping API is retired; submit `https://vivijure.com/sitemap.xml` once in
  Google Search Console (and add the verification meta tag if you want property verification). Bing
  Webmaster Tools imports from Search Console or accepts the sitemap directly.
- **Analytics:** Self-hosted Umami at `analytics.skyphusion.org` (website id in `fleet-chezmoi/system/umami/websites.json`).

## Regenerating the OG image

The social card (`public/og-image.png`, 1200x630) is rendered from a brand-exact SVG source
(`scripts/og-image.svg`) with librsvg, using the real Instrument Serif / DM Sans / JetBrains Mono
fonts:

```bash
# one-time tooling (macOS): brew install librsvg woff2
# and install the brand fonts locally so librsvg can find them:
#   woff2_decompress each public/fonts/*.woff2 and copy the .ttf to ~/Library/Fonts
rsvg-convert -w 1200 -h 630 scripts/og-image.svg -o public/og-image.png
```

## Conventions

- **No em-dashes (U+2014) or en-dashes (U+2013) anywhere** (source, comments, docs, or site copy).
  Use commas, semicolons, parentheses, or `--`.
- **No framework, no build step, no CSS preprocessor.** Vanilla HTML/CSS/JS is deliberate. Minimal
  runtime deps; justify any new one.
- **Mirror every `wrangler.toml` binding in the hand-authored `Env`** in `src/index.ts` (currently
  just `ASSETS: Fetcher`). Runtime types come from the pinned `@cloudflare/workers-types` devDep; do
  not generate `worker-configuration.d.ts`.
- **`account_id` is never hardcoded**; it is injected from `CLOUDFLARE_ACCOUNT_ID` (env / CI
  secret).
- **Licensing:** the site CODE is AGPL-3.0-only (`LICENSE` in this repo), same as Vivijure itself.
  Site CONTENT (copy, design) follows the Skyphusion Labs house convention.

## License

The site code is AGPL-3.0-only, same as Vivijure the product. See [LICENSE](LICENSE).
