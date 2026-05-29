# Stage 11: Implementation Readiness

Status: Confirmed

## Purpose

This document defines what to check before starting Stage 11 source or repository implementation.

It is a handoff document for the future development or release session.

## Current Baseline

- Stage 10 / `0.10.0` is the completed package baseline in docs.
- Stage 11 / `0.11.0` is planned as release and review hardening.

Stage 11 implementation should wait until the development session is ready to handle release-facing work.

## Read First

Before implementation, read:

1. [Release Boundary](./144-stage-11-release-boundary.md).
2. [Implementation Order](./141-stage-11-implementation-order.md).
3. [Official Obsidian Readiness](../../release/01-official-obsidian-readiness.md).
4. [Release Process](../../release/03-release-process.md).
5. [Validation And Review Checklists](../../release/06-validation-review-checklists.md).

## Repository Check

Before editing:

- inspect `git status --short`;
- identify unrelated dirty changes from other sessions;
- inspect completed Stage 10 behavior before making release-facing claims;
- inspect current `manifest.json`, `package.json`, `versions.json`, and README;
- inspect current build scripts;
- confirm current local test install path;
- check official Obsidian docs again.

## Start Rule

Start with official requirement refresh and repository audit.

Do not start by rewriting README or changing copy before official and repository gaps are known.

Do not start by changing code behavior unless a release blocker requires it.

## Minimum Validation

During implementation, verify as applicable:

- Markdown relative-link check after doc edits;
- typecheck;
- build;
- local test install sync;
- desktop Obsidian plugin load;
- release asset presence;
- manifest and package version match.

## Stop Conditions

Pause implementation and reopen planning if:

- official rules have changed enough to invalidate Stage 11 scope;
- Stage 10 final behavior changes release claims;
- a new product capability becomes necessary;
- a storage schema change appears required;
- official review feedback requires product-model changes;
- P0 or P1 usage bugs block release readiness.

## Handoff Rule

The planning session does not mark Stage 11 implemented.

The development or release session must provide evidence for checks it runs before Stage 11 can move from `docs/planned/` to `docs/active/` or `docs/completed/`.
