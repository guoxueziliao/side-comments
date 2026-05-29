# Stage 11: Release Boundary

Status: Confirmed

## Purpose

This document defines what belongs in Stage 11 / `0.11.0` and what must stay out.

Stage 11 is a release and review hardening version.

## Included

Stage 11 includes:

- official Obsidian readiness;
- manifest and versions review;
- repository presentation;
- README cleanup;
- external copy alignment;
- release process documentation;
- settings and first-use clarity pass;
- validation and review checklists;
- local test install release flow documentation;
- release notes format;
- official-review blocker handling.

## Conditional

The following may enter Stage 11 only if directly required for release readiness:

- small settings copy fixes;
- small empty-state or notice wording fixes;
- small README screenshot or image asset work;
- minor manifest or package metadata correction;
- small release script or command documentation updates.

These should remain narrow and review-driven.

## Deferred

Defer by default:

- new annotation features;
- saved views or saved filters;
- review queues;
- large sidebar redesign;
- large settings redesign;
- new storage schema;
- new import or export formats;
- broad automated release tooling;
- full manual or tutorial documentation.

## Excluded

Do not include:

- mobile support;
- tablet-specific support;
- PDF annotation;
- EPUB annotation;
- cloud sync;
- account systems;
- multi-user collaboration;
- telemetry;
- AI summary;
- AI classification;
- AI rewrite;
- AI repair suggestions;
- automatic product-model changes based on speculative review concerns.

## Relationship To Stage 10

Stage 10 handled workflow regression and stability implementation.

Stage 11 should not reopen Stage 10's current-document workflow work unless a release-blocking issue is discovered.

If release-blocking behavior is discovered from completed Stage 10, Stage 11 may record the issue, but the fix should stay narrow and release-driven unless the user redirects it.

## Relationship To 1.0.0

Stage 11 improves public release readiness, but it is not a `1.0.0` release candidate.

Do not use Stage 11 to promise near-final product maturity.

## Completion Boundary

Stage 11 can be complete when:

- official readiness has been reviewed;
- repository presentation is honest and current;
- release process is repeatable;
- validation checklists exist and are usable;
- no P0 or P1 release blockers remain unresolved.
