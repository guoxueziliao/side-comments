# Stage 10: Release Boundary

Status: Confirmed

## Scope

This document defines what belongs in Stage 10 / `0.10.0`.

Stage 10 is a stability, regression, and release-quality consolidation version after Stage 9.

It prepares for a future `1.0.0`, but it is not a `1.0.0` release candidate.

## Included

Stage 10 includes the current-document annotation workflow:

- create;
- update;
- jump;
- resolve;
- rebind;
- delete.

It also includes:

- source mode and reading mode regression for the workflow;
- sidebar and source feedback consistency;
- filter-hidden behavior for direct workflow actions;
- orphaned annotation recovery behavior;
- data-safety fixes required by the workflow;
- test cases, acceptance checklist, code review checklist, and release readiness checks;
- high-priority usage feedback discovered during daily use.

## Usage Feedback Inclusion Rule

Daily-use issues can enter Stage 10 when they affect:

- data safety;
- annotation creation;
- annotation update;
- jump and focus behavior;
- resolved or orphaned state behavior;
- rebind or delete behavior;
- sidebar/source consistency;
- release readiness.

P0 and P1 usage issues can interrupt mainline work.

P2 issues should usually be batched unless they affect the current workflow surface.

P3 issues should be collected for polish or release review.

## Deferred

The following are deferred unless a concrete Stage 10 workflow bug requires a narrow fix:

- broad cross-note redesign;
- new import/export features;
- saved views or saved filters;
- review queues;
- full-vault Markdown body search;
- new large settings architecture;
- connector-line system between source and sidebar;
- dedicated undo system for sidecar operations.

## Excluded

Do not include these in Stage 10:

- new annotation data model;
- fixed user-facing annotation types;
- AI summary, AI classification, AI rewrite, or AI repair suggestions;
- mobile, tablet, or non-desktop-specific support;
- cloud sync or remote storage;
- PDF, EPUB, canvas, or non-Markdown annotation;
- multi-user collaboration;
- `1.0.0` release candidate packaging.

## Implementation Boundary

Implementation should follow [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md).

Do not start with broad refactors.

Refactor only when it directly reduces risk for the current workflow or removes duplication that blocks a safe implementation.

## Completion Boundary

Stage 10 workflow work is not complete until:

- [Workflow Acceptance Checklist](./123-stage-10-workflow-acceptance-checklist.md) has no blocking unchecked items;
- [Workflow Test Cases](./124-stage-10-workflow-test-cases.md) are covered manually or automated where practical;
- [Workflow Code Review Checklist](./125-stage-10-workflow-code-review-checklist.md) has no blocking issues;
- typecheck and build pass;
- local Obsidian test install is updated and manually verified.

## Release Decision

After Stage 10 is implemented and verified, decide whether to release as `0.10.0` or continue with another `0.x` stabilization pass.

Do not automatically treat a successful `0.10.0` as readiness for `1.0.0`.
