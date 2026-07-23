# Security audit false positives

Documented dismissals for adversarial-audit (K2.7/K3) findings that are not actionable bugs in this repo's threat model.

## Fork PR CI pattern

Coverage workflows request `id-token: write` and `pull-requests: write` on `pull_request` events. Upload steps are gated to same-repo PRs; fork PRs run tests only with no secrets in job env. This matches the org aviation-grade CI pattern.

## Record

| Date | Audit | Finding | Rationale |
| --- | --- | --- | --- |
| 2026-07-23 | K3 verify ~18:04 | Coverage workflow id-token/write on pull_request | Fork-safe org CI pattern; upload gated |
