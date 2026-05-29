# Stage 10: Implementation Readiness

Status: Confirmed

## Purpose

This document defines what to check before starting Stage 10 source implementation.

It is not a requirements document. It is a handoff checklist for implementation preparation.

## Current Baseline

- Stage 9 / `0.9.0` is the completed baseline.
- Stage 10 / `0.10.0` is confirmed planning.
- Stage 10 remains under `docs/planned/` until the development session begins implementation and moves it to `docs/active/`.

This planning handoff does not itself start implementation.

## Read First

Before editing source code, read these documents:

1. [Development Index](./130-stage-10-development-index.md).
2. [Release Boundary](./126-stage-10-release-boundary.md).
3. [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md).
4. [Workflow Acceptance Checklist](./123-stage-10-workflow-acceptance-checklist.md).
5. [Workflow Code Review Checklist](./125-stage-10-workflow-code-review-checklist.md).

## Repository Check

Before implementation:

- inspect `git status --short`;
- identify unrelated dirty source changes;
- avoid reverting user or other-session work;
- inspect current code before assuming Stage 10 gaps;
- confirm package version and manifest version;
- run typecheck if code state is unclear.

## Implementation Start Rule

Start with the first step in [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md).

The development session is responsible for declaring the active start, moving the folder from `docs/planned/` to `docs/active/`, and then updating links.

Do not start with broad refactors.

Do not begin release packaging before the acceptance checklist is substantially complete.

## Validation Baseline

Minimum validation during implementation:

- `npm run typecheck`;
- `npm run build`;
- Markdown relative-link check after doc edits;
- local Obsidian test install sync before manual verification.

## Stop Conditions

Pause implementation and reopen planning if:

- Stage 8 data model must change;
- a new storage schema is required;
- a requested change expands beyond current-document workflow stabilization;
- a usage issue becomes P0 or P1 and changes the implementation order;
- the code state conflicts with the confirmed documents.
