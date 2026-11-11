# Changelog -- vivijure-com

The site (`vivijure.dev`, also served on `vivijure.com`) deploys from `main`; a `v<X.Y.Z>` tag is the version of record and
its GitHub Release is the bookkeeping pin rather than the deploy trigger. This file records the why
behind each release. Newest first.

## Unreleased

- **docs(site): Wan cast training is self-host only.** Conrad, 2026-11-11: the Wan 2.2 dual-expert training line stays, and every place that names it now says you must self-host `vivijure-wan-train` to use it; it is not part of any hosted offer. Changed: the JSON-LD description, the "Wan character LoRAs" card (its heading said "live" and now says "self-hosted"), the cast step, the consistent-cast card, the RunPod door card, the repo row, and both `llms.txt` lines.

- **feat(site): vivijure.dev is the home; vivijure.org redirects to it.** The domain split Conrad
  set on 2026-11-11. `vivijure.dev` serves the site, and `www.vivijure.dev`, `vivijure.org` and
  `www.vivijure.org` 301 to `https://vivijure.dev`, keeping the path and query. All four are new
  custom-domain routes. `vivijure.com` serves the same site for now, and `www.vivijure.com` still
  301s to it. Stray hosts (workers.dev) now go to `https://vivijure.dev`. Canonical, og:url, the
  JSON-LD ids, the sitemap, robots.txt, llms.txt and every self-link point at
  `https://vivijure.dev`. `search.vivijure.com` is unchanged. The router tests cover every host.

- **fix(site): remove links to demo.vivijure.com (#76).** The demo host was
  retired and does not resolve. Nav, hero, install, footer, JSON-LD, `llms.txt`,
  and the README no longer point at it. Nothing was repointed at the apex:
  a link to this site is not a substitute for the retired demo.

- **docs(site):** X handle moved from `@skyphusion` to `@rockrockenhaus` (2026-11-05); `x.com/skyphusion` no longer resolves. Every X link and `twitter:` meta tag now points at `x.com/rockrockenhaus`.

## v1.1.1 -- 2026-08-04

- **fix(site): Wan cast train is working.** Copy treated dual-expert Wan LoRAs as provisional;
  Conrad confirmed `vivijure-wan-train` is live. Pipeline, cast feature, RunPod door, constellation
  row, Since-1.0 strip, and `llms.txt` now state it as working (high/low noise keys applied at
  cloud i2v). CLAUDE copy-accuracy updated.

## v1.1.0 -- 2026-08-04

- **feat(site): product surface catch-up after Studio 1.0 open train.** Hero and install no longer
  read as a one-shot 1.0.0 launch; "Since Studio 1.0" strip for MCP agents, dual own-GPU doors
  (LTX 12GB + production CogVideoX 16GB), dual-panel parity, and Slate session memory. Features /
  pipeline / hosts / constellation updated (control-plane, wan-train, MCP depth). Fixed the stale
  "CogVideoX experimental / not in this train" install note. `llms.txt` and CLAUDE copy-accuracy
  wording aligned.

## v1.0.1 -- 2026-07-22

- **PATCH: `sharp` 0.35.3 override (#30), plus site updates** -- demo CTA, LinkedIn SEO metadata,
  and the AGPL `NOTICE`.
- The site already deploys from `main` and was live when this tag was cut. The tag exists so the
  release line has a pin instead of a floating branch.
  (Backfilled 2026-07-28 from the v1.0.1 GitHub release; this file did not exist at the tag.)

## v1.0.0 -- 2026-07-15

- **First GitHub Release, aligned to `main`.** `package.json` already declared 1.0.0; this tag put
  the release line and the declared version in agreement.
  (Backfilled 2026-07-28 from the v1.0.0 GitHub release; this file did not exist at the tag.)
