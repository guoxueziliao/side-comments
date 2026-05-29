# Stage 11: Planning Index

Status: Confirmed

## Scope

This document is the planning entry point for Stage 11 / `0.11.0`.

Stage 10 / `0.10.0` is completed and moved to the completed baseline. Stage 11 planning can proceed from the completed Stage 10 behavior.

## Current Context

- Completed baseline: Stage 1 through Stage 10.
- Current planning target in this session: Stage 11 / `0.11.0`.

## Planning Rules

- Discuss one decision at a time when requirements are open.
- Write confirmed decisions into focused documents immediately.
- Keep each document under roughly 200 lines.
- Do not reopen the Stage 8 annotation model unless a concrete bug or compatibility issue requires it.
- Do not duplicate Stage 9 UI polish or Stage 10 workflow regression unless a follow-up is explicitly moved into Stage 11.
- Keep desktop Obsidian as the only target platform.

Detailed documentation workflow is defined in [Documentation Workflow](./132-stage-11-documentation-workflow.md).

## Confirmed Positioning

Stage 11 / `0.11.0` is a release and review hardening version.

It focuses on official Obsidian submission and review readiness, release documentation, repository presentation, packaging discipline, settings polish where it affects first use or review, and validation workflow.

The confirmed answer is recorded in [Version Positioning](./133-stage-11-version-positioning.md).

## Document Map

- [Documentation Workflow](./132-stage-11-documentation-workflow.md): how Stage 11 planning should be split and handed off.
- [Version Positioning](./133-stage-11-version-positioning.md): confirmed release and review hardening positioning.
- [Release Hardening Scope](./135-stage-11-release-hardening-scope.md): confirmed included scope and explicit non-goals.
- [Implementation Order](./141-stage-11-implementation-order.md): recommended implementation sequence.
- [Acceptance Checklist](./142-stage-11-acceptance-checklist.md): Stage 11-specific acceptance boundary referencing reusable release criteria.
- [Code Review Checklist](./143-stage-11-code-review-checklist.md): Stage 11-specific review boundary referencing reusable release review criteria.
- [Release Boundary](./144-stage-11-release-boundary.md): included, conditional, deferred, and excluded scope.
- [Implementation Readiness](./145-stage-11-implementation-readiness.md): handoff checks before implementation.
- [Development Index](./146-stage-11-development-index.md): implementation entry point.

## Reusable Release References

- [Release Guide](../../release/README.md): reusable release and review guidance.
- [Official Obsidian Readiness](../../release/01-official-obsidian-readiness.md): official submission, manifest, versions, release assets, and review checklist scope.
- [Repository Presentation](../../release/02-repository-presentation.md): README, screenshots, user fit, data storage, limitations, and development status.
- [Release Process](../../release/03-release-process.md): repeatable versioning, build, local install sync, GitHub Release, and verification flow.
- [External Copy](../../release/04-external-copy.md): manifest description, repository description, README opening, official directory copy, and terminology.
- [Settings And First-Use Polish](../../release/05-settings-first-use-polish.md): settings clarity, defaults, empty states, notices, and language consistency.
- [Validation And Review Checklists](../../release/06-validation-review-checklists.md): official review, technical release, manual usage, and repository presentation checks.
- [Release Acceptance Checklist](../../release/07-release-acceptance-checklist.md): reusable release-hardening completion criteria.
- [Release Code Review Checklist](../../release/08-release-code-review-checklist.md): reusable release-hardening review focus.
- [Release Evidence Template](../../release/09-release-evidence-template.md): reusable format for recording actual release verification evidence.

## Planning Completion

Stage 11 planning is ready for implementation preparation.

Before implementation begins, refresh Stage 11 against the final Stage 10 behavior and current official Obsidian documentation.

Implementation should start from [Development Index](./146-stage-11-development-index.md).

## Boundary With Stage 10

This planning session does not start Stage 10 implementation.

Stage 10 is now under `docs/completed/stage-10/` and is treated as the current completed baseline.

Stage 11 planning should refresh release claims against the completed Stage 10 behavior before implementation begins.
