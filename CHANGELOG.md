# Changelog -- vivijure-com

The product site (`vivijure.com`) deploys from `main`; a `v<X.Y.Z>` tag is the version of record and
its GitHub Release is the bookkeeping pin rather than the deploy trigger. This file records the why
behind each release. Newest first.

## Unreleased

- Nothing yet.

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
