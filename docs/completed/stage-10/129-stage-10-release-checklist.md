# Stage 10: Release Checklist

Status: Confirmed

## Purpose

This document defines the release checks for Stage 10 / `0.10.0`.

It is a release readiness checklist, not a feature list.

## Pre-Release Code Checks

- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Built `main.js`, `manifest.json`, and `styles.css` are present.
- [ ] Manifest, package, and versions metadata are consistent.
- [ ] No unrelated dirty changes are included in release work by accident.

## Documentation Checks

- [ ] Stage 10 documents remain under roughly 200 lines each.
- [ ] Markdown relative-link check passes.
- [ ] Acceptance checklist is updated.
- [ ] Test cases document reflects implemented behavior.
- [ ] Code review checklist has no blocking items.
- [ ] Release notes are prepared from the final implementation, not only from planning docs.

## Local Obsidian Checks

- [ ] Local test install is updated with built files.
- [ ] Plugin loads in the test vault.
- [ ] Current-document sidebar opens.
- [ ] Source-mode workflow smoke test passes.
- [ ] Reading-mode workflow smoke test passes where supported.
- [ ] No console error appears during basic workflow use.

## Workflow Checks

- [ ] Create flow passes critical cases.
- [ ] Update flow passes critical cases.
- [ ] Jump flow passes critical cases.
- [ ] Resolve flow passes critical cases.
- [ ] Rebind flow passes critical cases.
- [ ] Delete flow passes critical cases.
- [ ] P0/P1 usage issues are fixed or explicitly deferred with reason.

## Publication Checks

- [ ] Version number is final for the release.
- [ ] Git tag plan is clear.
- [ ] GitHub Release notes are concise.
- [ ] Release assets match the built files.
- [ ] Local test install remains available after publishing.

## Non-Release Condition

Do not publish `0.10.0` if any P0 issue is open.

Do not publish with open P1 issues unless the user explicitly accepts the risk.
