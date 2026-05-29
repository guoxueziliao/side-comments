# Stage 11: Development Index

Status: Implemented

## Purpose

This is the implementation entry point for Stage 11 / `0.11.0`.

Stage 11 is implemented and moved to the completed baseline.

## Version Positioning

Stage 11 / `0.11.0` is a release and review hardening version.

It should improve official Obsidian readiness, repository presentation, release process, external copy, settings clarity, and validation workflow.

It should not add a major new product capability by default.

## Read First

1. [Release Boundary](./144-stage-11-release-boundary.md).
2. [Implementation Readiness](./145-stage-11-implementation-readiness.md).
3. [Implementation Order](./141-stage-11-implementation-order.md).
4. [Acceptance Checklist](./142-stage-11-acceptance-checklist.md).
5. [Code Review Checklist](./143-stage-11-code-review-checklist.md).

## Reusable Release Guidance

Read these reusable release documents before editing release-facing files:

- [Release Guide](../../release/README.md).
- [Official Obsidian Readiness](../../release/01-official-obsidian-readiness.md).
- [Repository Presentation](../../release/02-repository-presentation.md).
- [Release Process](../../release/03-release-process.md).
- [External Copy](../../release/04-external-copy.md).
- [Settings And First-Use Polish](../../release/05-settings-first-use-polish.md).
- [Validation And Review Checklists](../../release/06-validation-review-checklists.md).
- [Release Acceptance Checklist](../../release/07-release-acceptance-checklist.md).
- [Release Code Review Checklist](../../release/08-release-code-review-checklist.md).
- [Release Evidence Template](../../release/09-release-evidence-template.md).

## Implementation Sequence

Follow [Implementation Order](./141-stage-11-implementation-order.md):

1. Refresh official requirements.
2. Audit current repository state.
3. Fix official review blockers.
4. Update external copy.
5. Update repository presentation.
6. Harden release process.
7. Review settings and first use.
8. Run validation and review checklists.
9. Final release readiness review.

## Stage Boundary

Stage 11 implementation should not:

- reopen Stage 10 workflow regression work;
- add new annotation capabilities;
- rewrite the annotation model;
- broaden the plugin beyond desktop Markdown use;
- duplicate reusable release documents inside the Stage 11 folder.

## Completion Rule

Stage 11 implementation is not complete until:

- release-hardening changes are implemented or explicitly waived;
- reusable release checks have been applied to `0.11.0`;
- P0 and P1 release blockers are fixed or explicitly waived by the user;
- docs links pass;
- build and local release verification have evidence from the implementation or release session.
