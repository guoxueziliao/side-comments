# Stage 10: Development Index

Status: Completed

## Purpose

This is the implementation entry point for Stage 10 / `0.10.0`.

## Implementation Summary

Stage 10 is implemented. The annotation data model (`Annotation = Anchor + Optional Mark + Optional Note`) was preserved from Stage 8/9.

Key outcomes:

- `upsertComment` in sidecarStore now accepts optional update fields and applies them when an existing annotation is found on the same range, instead of returning the existing annotation unchanged.
- AdvancedCreationModal pre-fills with existing annotation data (markType, color, noteContent, tags) when creating on a range that already has an annotation.
- Filter-hidden notice (`notice.commentHiddenByFilter`) shown after create, update, status toggle, and rebind when active filters hide the affected card.
- `isCommentIdVisible` method added to sidebar view for external visibility checks.
- Annotation workflow regression verified across all six flows: create, update, jump, resolve, rebind, delete.
- Code review found and fixed two issues: (1) saveEdit early return path for clearing note on mark-and-note bypassed filter check; (2) More modal silently overwrote existing annotation data on duplicate range.
- Version bumped to `0.10.0`.

## Read First

1. [Version Positioning](./112-stage-10-version-positioning.md).
2. [Release Boundary](./126-stage-10-release-boundary.md).
3. [Implementation Readiness](./127-stage-10-implementation-readiness.md).
4. [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md).

## Workflow Documents

- [Current-Document Annotation Workflow](./115-stage-10-current-document-workflow.md).
- [Create Flow](./116-stage-10-create-flow.md).
- [Update Flow](./117-stage-10-update-flow.md).
- [Jump Flow](./118-stage-10-jump-flow.md).
- [Resolve Flow](./119-stage-10-resolve-flow.md).
- [Rebind Flow](./120-stage-10-rebind-flow.md).
- [Delete Flow](./121-stage-10-delete-flow.md).

## Quality Gates

- [Workflow Acceptance Checklist](./123-stage-10-workflow-acceptance-checklist.md).
- [Workflow Test Cases](./124-stage-10-workflow-test-cases.md).
- [Workflow Code Review Checklist](./125-stage-10-workflow-code-review-checklist.md).
- [Release Checklist](./129-stage-10-release-checklist.md).

## Usage Feedback

- [Usage Feedback Workflow](./114-stage-10-usage-feedback-workflow.md).
- [Usage Issue Template](./128-stage-10-usage-issue-template.md).

## Implementation Sequence

Follow [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md):

1. Create flow.
2. Update flow.
3. Jump flow.
4. Resolve flow.
5. Rebind flow.
6. Delete flow.
7. Regression review.

## Completion Rule

Stage 10 implementation is not complete until typecheck, build, local test install, acceptance checklist, test cases, code review checklist, and release checklist are all satisfied or explicitly waived by the user.
