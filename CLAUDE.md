# CLAUDE.md

Guidance for Claude Code (and the crew) working in this repo.

## What this is

**vivijure.com: the Vivijure product site.** The public front door for Vivijure, the self-hosted
AGPL-3.0 AI film studio. A single thin Cloudflare Worker that serves a static site from `public/`
over Workers Assets; the Worker code only adds a `/health` endpoint and a `www` -> apex redirect.
**No build step, no framework** -- vanilla HTML/CSS/JS by design. This is a MARKETING /
EDUCATIONAL site, **NOT the app**. Live demo: `demo.vivijure.com`. Self-host / Labs panel code:
`vivijure-cf` (and local panel `vivijure-local`). Hub `vivijure` is docs/legal history only.

**Hosted tenant studios (control-plane product):** each hosted studio is a tenant Worker on
**`<slug>.studio.vivijure.com`** (wildcard `*.studio.vivijure.com`). The multi-tenant front door
(signup / account / admin) is **`studio.vivijure.com`** -- owned by `vivijure-control-plane`, not
this marketing site. Do not conflate `vivijure.com` (this repo) with `*.studio.vivijure.com`
(hosted product surface).

Keep this lean.

Version: see root `package.json` / latest tag / `CHANGELOG.md`.

## Commands

```bash
npm install
npm run dev          # wrangler dev -> http://localhost:8787
npm run typecheck    # tsc --noEmit -- the CI gate; run before pushing
npm run deploy       # wrangler deploy (account from CLOUDFLARE_ACCOUNT_ID)
npx vitest run       # the router tests (index.test.ts)
```

Edit `public/` for content and design. `src/index.ts` stays tiny (serve assets + `/health` + the
canonical-host redirect).

### Verifying changes

`npm run typecheck` is the gate (`tsc` is not part of any vitest run, so type errors pass silently).
Behavior is covered by `index.test.ts` (Vitest): the root serves 200, `www` 301-redirects to the
apex preserving the path, and `/health` returns `{ok: true, service: "vivijure-com"}` as JSON
without touching the `ASSETS` binding. CI runs typecheck + **deploy on `main`** (`ci.yml`; this site
is merge-deploy, not tag-gated like the studio panel), a standalone typecheck (`typecheck.yml`), and
a Vitest coverage run (`code-coverage.yml`), all on GitHub-hosted `ubuntu-latest` (PUBLIC repo;
fork-safe hosted path, not the self-hosted fleet). Verify the live site after deploy, not only CI.

## Architecture

- **The Worker is deliberately tiny.** `src/index.ts` exports a single `fetch` handler: 301-redirect
  `www.vivijure.com` to the apex (preserving path), answer `/health` with JSON, otherwise hand off
  to `env.ASSETS.fetch(request)`.
- **Static assets, served by Workers Assets.** `wrangler.toml` binds `public/` as `ASSETS`. Content:
  `index.html`, `styles.css`, `fonts.css`, `main.js`, self-hosted `fonts/`, `logo-icon.svg`,
  `robots.txt`, `sitemap.xml`.
- **Showcase media is external.** Showcase films and the pipeline diagram are served from
  `assets.skyphusion.net`; do not vendor large media into this repo.
- **Both hostnames are Workers Custom Domains** (`vivijure.com` + `www.vivijure.com`). Routing
  changes are infra work: coordinate with Strummer.

## Conventions

- **No em-dashes (U+2014) or en-dashes (U+2013) anywhere** (source, comments, docs, or site copy).
  Use commas, semicolons, parentheses, or `--`.
- **No framework, no build step, no CSS preprocessor.** Vanilla HTML/CSS/JS is deliberate. Minimal
  runtime deps; justify any new one.
- **Handle / username is `skyphusion`** across all services.
- **Mirror every `wrangler.toml` binding in the hand-authored `Env`** in `src/index.ts` (currently
  just `ASSETS: Fetcher`). Runtime types come from the pinned `@cloudflare/workers-types` devDep; do
  not generate `worker-configuration.d.ts`.
- **`account_id` is never hardcoded** -- injected from `CLOUDFLARE_ACCOUNT_ID`.
- **Copy accuracy:** the site describes a **stable Studio 1.0 product** on an open host/module
  train. Keep claims honest and in sync with the constellation (`vivijure-cf`, `vivijure-local`,
  `vivijure-mcp`, `vivijure-control-plane`, GPU doors, finish satellites, `vivijure-wan-train`, slate).
  Product line stays "1.0"; host package versions are not the marketing version. Do not call
  CogVideoX 16GB experimental. Wan cast LoRA train is working for the cloud i2v path; say so.
  Homelab does not wire `RUNPOD_WAN_TRAIN_ENDPOINT_ID` by default.
- **CSAM bright-line** absolute in any policy/copy that touches AUP.
- **Ignore Cursor `AGENTS.md`.** No em-dashes/en-dashes. Never freeze endpoint IDs or sprint boards.
- **Licensing:** the site CODE is AGPL-3.0-only (`LICENSE`), same as Vivijure the product.

## Design system

The visual language matches the Skyphusion Labs family (skyphusion.org): dark `#070b14` base, a
cyan/violet gradient (`--gradient-viv`), Instrument Serif display + DM Sans body + JetBrains Mono
labels, pill tags, IntersectionObserver reveal-on-scroll. Fonts are self-hosted (SIL OFL) in
`public/fonts/`.

## Crew + identity

- Crew members work as their own Unix + gh identity. The FIRST command in any op is the member's own
  login shell: `sudo -u <member> bash -lc '<ops>'`.
- Crew commits land under the member's own `skyphusion-<member>` identity, never Conrad's. (Conrad
  devs ONLY on his laptop, where his commits author as `Conrad Rockenhaus <conrad@skyphusion.org>`.)

## Commits & versioning

Conventional Commits (`feat(scope):` / `fix(scope):` / `docs:` / `ci:`); the body explains the why.
SemVer on the package line in `package.json`; bump version in the release commit when cutting a site
release.
