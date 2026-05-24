# Stage 6: Advanced Review and Knowledge Workflow

Status: Confirmed

## Goal

Turn existing annotation data into a more deliberate review and knowledge organization workflow after cross-note review and data maintenance are in place.

## Version Boundary

Stage 6 is planned as `0.6.0`.

`0.6.0` is the annotation organization release.

## Confirmed First Priority

The first confirmed direction for `0.6.0` is annotation organization and classification.

Other deferred directions can connect to this direction later, but they are not part of the confirmed `0.6.0` implementation scope unless explicitly reopened.

## Planning Rule

Confirmed Stage 6 decisions should be split into focused documents under `docs/stage-6/`.

Do not put all `0.6.0` decisions into this overview document. When one area is confirmed, create a separate numbered document and link it from this page.

## Confirmed Scope

- Annotation type.
- User-defined annotation tags.
- Combined filters in the current-note sidebar and cross-note review page.
- Copying filtered annotations to the clipboard as a Markdown draft.
- Confirmed UI copy, implementation order, acceptance checklist, code review checklist, test cases, and release boundary.

The `thought-distillation` bridge remains documented for later discussion, but it is not part of the confirmed `0.6.0` implementation scope.

## Initial Boundary

`0.6.0` should build on earlier foundations:

- Stage 3 current-document sidebar workflow.
- Stage 4 cross-note annotation review.
- Stage 5 import, export, health check, and repair tools.

`0.6.0` should avoid changing storage fundamentals unless a confirmed workflow requires it.

## Out Of Scope

- AI-generated summaries.
- Cloud sync or collaboration.
- Automatic knowledge graph generation.
- Major sidecar schema migration.
- Background full-vault indexing.
- Automatic invocation of `thought-distillation` without explicit user request.
- Automatic summary generation.
- Annotation collections.
- Review queues.
- Saved views or saved filters in `0.6.0`.
- Timeline or date-based filters in `0.6.0`.
- Source-document writing workflow integration in `0.6.0`.

## Confirmed Exclusions

Annotation collections and review queues should not be implemented in `0.6.0` or later versions.

The related organization need should be handled by annotation type, tags, and combined filters instead.

Saved views and saved filters should not be implemented in `0.6.0`.

For this version, annotation organization should rely on type, tags, combined filters, session-level filter memory, and one-click filter reset.

This is a `0.6.0` release-boundary decision, not a permanent exclusion.

Timeline or date-based filters should not be implemented in `0.6.0`.

This is a `0.6.0` release-boundary decision, not a permanent exclusion.

Source-document writing workflow integration should not be implemented in `0.6.0`.

This version should stop at annotation organization and Markdown draft copying. It should not add a separate workflow for writing back into source documents.

Automatic summary generation should not be implemented in `0.6.0` or later versions.

## Detail Documents

- `38-stage-6-thought-distillation-bridge.md`: review-to-distillation bridge discussion.
- `39-stage-6-annotation-organization.md`: annotation organization and classification planning.
- `40-stage-6-annotation-types.md`: annotation type planning.
- `41-stage-6-annotation-tags.md`: optional user-defined annotation tag planning.
- `42-stage-6-annotation-filters.md`: combined filter planning for annotation organization.
- `43-stage-6-markdown-draft-export.md`: copying or exporting filtered annotations as Markdown drafts.
- `44-stage-6-ui-copy.md`: UI copy and button naming discussion for `0.6.0`.
- `45-stage-6-implementation-order.md`: confirmed development sequence for `0.6.0`.
- `46-stage-6-acceptance-checklist.md`: completion checklist for `0.6.0`.
- `47-stage-6-code-review-checklist.md`: implementation review checklist for `0.6.0`.
- `48-stage-6-test-cases.md`: concrete test cases for `0.6.0`.
- `49-stage-6-release-boundary.md`: explicit included and excluded scope for `0.6.0`.
- `50-stage-6-manual-and-non-goal-test-cases.md`: manual verification and non-goal test cases for `0.6.0`.

## Undecided Items

No open decisions for the confirmed `0.6.0` scope.
