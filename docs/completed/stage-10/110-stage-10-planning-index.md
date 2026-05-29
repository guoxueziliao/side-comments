# Stage 10: Planning Index

Status: Confirmed

## Scope

This document is the planning entry point for `0.10.0`.

Stage 10 planning is confirmed after Stage 9 / `0.9.0` has been implemented and moved to the completed baseline. Keep this folder as planning-only until the user explicitly asks for implementation.

## Current Context

- Completed baseline: Stage 1 through Stage 9.
- Active development: none.
- Next implementation target: Stage 10 / `0.10.0`.

## Planning Rules

- Discuss one decision at a time.
- Write confirmed decisions into focused documents immediately.
- Keep each document under roughly 200 lines.
- Do not reopen the Stage 8 annotation model unless a concrete bug or compatibility issue requires it.
- Do not duplicate Stage 9 UI polish unless a Stage 9 follow-up is intentionally moved to Stage 10.
- Keep desktop Obsidian as the only target platform.

Detailed documentation workflow is defined in [Documentation Workflow](./111-stage-10-documentation-workflow.md).

## Confirmed Positioning

Stage 10 / `0.10.0` is a stability, regression, and release-quality consolidation version after Stage 9.

It should make the plugin more reliable in real desktop use instead of expanding the product with another major capability.

Detailed positioning is recorded in [Version Positioning](./112-stage-10-version-positioning.md).

## Document Map

- [Documentation Workflow](./111-stage-10-documentation-workflow.md): how Stage 10 planning should be split, confirmed, and moved later.
- [Version Positioning](./112-stage-10-version-positioning.md): confirmed version goal, focus, non-goals, and relationship to Stage 9.
- [Relationship To 1.0.0](./113-stage-10-1-0-relationship.md): why `0.10.0` prepares for `1.0.0` without becoming a release candidate.
- [Usage Feedback Workflow](./114-stage-10-usage-feedback-workflow.md): how mainline development and daily-use issues run in parallel.
- [Current-Document Annotation Workflow](./115-stage-10-current-document-workflow.md): create, update, jump, resolve, rebind, and delete workflow design.
- [Create Flow](./116-stage-10-create-flow.md): confirmed creation entry points, toolbar behavior, More panel behavior, duplicate handling, and feedback.
- [Update Flow](./117-stage-10-update-flow.md): confirmed update entry points, edit panels, range adjustment, status changes, and feedback.
- [Jump Flow](./118-stage-10-jump-flow.md): confirmed card-to-source, source-to-card, cross-note reveal, filter-hidden, orphaned, and focus feedback behavior.
- [Resolve Flow](./119-stage-10-resolve-flow.md): confirmed active/resolved behavior, visual treatment, ordering, and orphaned-state separation.
- [Rebind Flow](./120-stage-10-rebind-flow.md): confirmed orphaned annotation display, selection requirements, preview, recovery, and failure behavior.
- [Delete Flow](./121-stage-10-delete-flow.md): confirmed whole annotation deletion, note deletion, mark removal, confirmation, and feedback behavior.
- [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md): recommended build sequence for current-document workflow stabilization.
- [Workflow Acceptance Checklist](./123-stage-10-workflow-acceptance-checklist.md): completion criteria for the current-document workflow.
- [Workflow Test Cases](./124-stage-10-workflow-test-cases.md): concrete manual and regression cases for the current-document workflow.
- [Workflow Code Review Checklist](./125-stage-10-workflow-code-review-checklist.md): review criteria for data safety, state model, source/reading behavior, and release readiness.
- [Release Boundary](./126-stage-10-release-boundary.md): included, deferred, and excluded scope for Stage 10.
- [Implementation Readiness](./127-stage-10-implementation-readiness.md): pre-implementation checks and stop conditions.
- [Usage Issue Template](./128-stage-10-usage-issue-template.md): standard format for daily-use issues.
- [Release Checklist](./129-stage-10-release-checklist.md): release readiness checks.
- [Development Index](./130-stage-10-development-index.md): implementation entry point.

## Implementation Readiness

Stage 10 is ready for implementation preparation.

Confirmed starting area:

- Stage 10 should start with current-document annotation workflow regression: create, update, jump, resolve, rebind, and delete.

Implementation should start from:

- [Development Index](./130-stage-10-development-index.md)

Confirmed workflow documents:

- [Create Flow](./116-stage-10-create-flow.md)
- [Update Flow](./117-stage-10-update-flow.md)
- [Jump Flow](./118-stage-10-jump-flow.md)
- [Resolve Flow](./119-stage-10-resolve-flow.md)
- [Rebind Flow](./120-stage-10-rebind-flow.md)
- [Delete Flow](./121-stage-10-delete-flow.md)
- [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md)
- [Workflow Acceptance Checklist](./123-stage-10-workflow-acceptance-checklist.md)
- [Workflow Test Cases](./124-stage-10-workflow-test-cases.md)
- [Workflow Code Review Checklist](./125-stage-10-workflow-code-review-checklist.md)
- [Release Boundary](./126-stage-10-release-boundary.md)
- [Implementation Readiness](./127-stage-10-implementation-readiness.md)
- [Usage Issue Template](./128-stage-10-usage-issue-template.md)
- [Release Checklist](./129-stage-10-release-checklist.md)
- [Development Index](./130-stage-10-development-index.md)
