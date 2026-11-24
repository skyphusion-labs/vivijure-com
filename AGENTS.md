# Vivijure.com

This file is the guide for any coding agent and any contributor. Follow it.

## What this project is

This repo is the public site for Vivijure. It serves vivijure.dev and vivijure.com.

Vivijure is a self-hosted AGPL-3.0 AI film studio. This site is marketing and education. It is not the app.

One thin Cloudflare Worker serves static files from `public/` with Workers Assets. The Worker adds `/health` and routes by host.

`vivijure.dev` and `vivijure.com` are served. `www.vivijure.com` redirects (301) to the `.com` apex. Every other host redirects (301) to `https://vivijure.dev`. The path and the query stay. Other hosts include `www.vivijure.dev`, `vivijure.org`, `www.vivijure.org`, a `workers.dev` hostname, and any stray host.

There is no build step and no framework. The site is vanilla HTML, CSS, and JS.

The studio panel is [vivijure-cf](https://github.com/skyphusion-labs/vivijure-cf). The local panel is [vivijure-local](https://github.com/skyphusion-labs/vivijure-local). The hub [vivijure](https://github.com/skyphusion-labs/vivijure) is docs and legal history.

A hosted tenant studio is `<slug>.studio.vivijure.com`. Signup is not this marketing site. [vivijure-control-plane](https://github.com/skyphusion-labs/vivijure-control-plane) is a reference control plane. It is maintained. It is not operated as the Skyphusion studio. Do not mix `vivijure.com` with `*.studio.vivijure.com`.

See root `package.json`, the latest tag, and [CHANGELOG.md](CHANGELOG.md). Do not freeze a number here.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run deploy
npx vitest run
```

`npm run dev` is `wrangler dev` at `http://localhost:8787`. `npm run typecheck` is the CI gate. Run it before you push. `npm run deploy` is `wrangler deploy`. The account comes from `CLOUDFLARE_ACCOUNT_ID`.

Edit `public/` for content and design. Keep `src/index.ts` small. It serves assets, answers `/health`, and redirects the canonical host.

## Verify

`tsc` does not run inside vitest. A type error can pass tests. Run `npm run typecheck`.

`index.test.ts` checks three behaviors. The root returns 200. `www` returns 301 to the apex and keeps the path. `/health` returns `{ok: true, service: "vivijure-com"}` and does not touch `ASSETS`.

`public/ask-widget.js` is a pinned copy of `@skyphusion/search-mcp`. Do not hand-edit it. Bump `scripts/ask-widget.canonical.json`. See the README section on the ask widget.

CI runs typecheck, and it deploys on a merge to `main` (`.github/workflows/ci.yml`). This site is merge-deploy. It is not tag-gated like the studio panel. `coverage.yml` runs `npm test`. `corpus-notify.yml` notices a search corpus refresh on push to `main`. Runners are GitHub-hosted `ubuntu-latest`.

Verify the live site after deploy. Do not stop at CI.

## Architecture

`src/index.ts` exports one `fetch` handler. It redirects `www.vivijure.com` to the `.com` apex. It serves `vivijure.dev`, `vivijure.com`, and `*.vivijure.com`. It redirects every other host to `https://vivijure.dev`. It answers `/health` with JSON. Otherwise it calls `env.ASSETS.fetch(request)`.

`wrangler.toml` binds `public/` as `ASSETS`. Content includes `index.html`, `styles.css`, `fonts.css`, `main.js`, `fonts/`, `logo-icon.svg`, `robots.txt`, and `sitemap.xml`.

Showcase films and the pipeline diagram come from `assets.skyphusion.net`. Do not vendor large media into this repo.

Each public hostname is a Workers custom domain. A routing change is infrastructure work. Do not do it only in this repo.

## Copy

The site describes a stable Studio 1.0 product on an open host and module train. Keep claims honest. Host package versions are not the marketing version. Do not call the CogVideoX 16GB door experimental.

Wan cast LoRA training is self-host only. The hosted endpoint is retired. `vivijure-wan-train` is archived. Say that.

The operated RunPod path makes SDXL keyframes, plus upscale. Motion comes from a cloud door or from a GPU you run.

The CSAM ban is absolute in any policy or copy that touches the AUP.

The site code license is AGPL-3.0-only (`LICENSE`).

## Design

The visual language matches the Skyphusion Labs family. The base is `#070b14`. The accent is a cyan and violet gradient (`--gradient-viv`). Display type is Instrument Serif. Body type is DM Sans. Labels use JetBrains Mono. Fonts are self-hosted (SIL OFL) in `public/fonts/`.

## Conventions

Write Simplified Technical English in docs and in site copy. Use short sentences. Put one idea in each sentence. Use the active present tense. Use plain words. Use the same word every time.

Do not use an em dash (U+2014). Do not use an en dash (U+2013). This rule covers source, comments, docs, and site copy. Use a comma, a semicolon, parentheses, or two hyphens (`--`).

State the limit next to the capability. Do not turn a measured result into a promise.

There is no framework, no build step, and no CSS preprocessor. Justify a new runtime dependency.

The public handle is `skyphusion`.

Mirror every `wrangler.toml` binding in the hand-authored `Env` in `src/index.ts`. Today that is `ASSETS: Fetcher`. Use the pinned `@cloudflare/workers-types` dev dependency. Do not generate `worker-configuration.d.ts`.

Do not hardcode `account_id`. Inject `CLOUDFLARE_ACCOUNT_ID`.

Do not put a secret in a tracked file. Do not freeze an endpoint id in this file.

## Release

A version moves only in a release pull request. Bump `package.json`, then update [CHANGELOG.md](CHANGELOG.md). A feature pull request does not bump. A fix pull request does not bump.

The version of record is `package.json` (and the lockfile). The tag shape is `v*`.

Before a release pull request, check tags. If the current manifest version already has a tag, the cycle is closed, so the release pull request bumps. If it has no tag, stop. Read why before you bump again.

Use a Conventional Commit (`feat(scope):`, `fix(scope):`, `docs:`, `ci:`). The body says why.

A merge to `main` can deploy this site. Read the verify section before you treat a merge as a ship.
