# Stage 6: Manual And Non-Goal Test Cases

Status: Confirmed

This document lists manual verification and explicit non-goal test cases for `0.6.0`.

Core functional test cases are tracked in `48-stage-6-test-cases.md`.

## Explicit Non-Goals

### No Automatic Summary

- Given the user copies a draft.
- When the output is inspected.
- Then it contains raw annotation material and metadata.
- And it does not contain generated conclusions, summaries, or rewritten analysis.

### No Save To File

- Given the user copies a draft.
- When the action completes.
- Then no Markdown file is created automatically.

### No Automatic Distillation

- Given the user copies a draft.
- When the action completes.
- Then `thought-distillation` is not invoked automatically.

### No Collections Or Queues

- Given the plugin is running `0.6.0`.
- When the annotation organization UI is inspected.
- Then no annotation collection or review queue UI appears.

### No Priority Field

- Given an annotation is created or edited.
- When metadata fields are inspected.
- Then no priority, importance, core, or similar first-class field is created.

### No Semantic Color Category

- Given the user chooses a color.
- When the annotation is filtered or exported.
- Then the color remains a visual marker and is not treated as a semantic category.

## Manual Verification

- Verify type dropdown in source mode annotation creation.
- Verify type dropdown in reading mode annotation creation.
- Verify sidebar type editing on existing annotations.
- Verify sidebar tag editing in a note with many annotations.
- Verify tag autocomplete from already-used tags.
- Verify current-note filters with mixed status, type, tag, color, and keyword values.
- Verify cross-note filters with annotations from multiple documents.
- Verify `Clear filters` only resets the current surface.
- Verify Copy draft output from current-note sidebar.
- Verify Copy draft output from cross-note review.
- Verify copied draft output is grouped by source document.
- Verify copied draft output includes active, resolved, and orphaned status labels.
- Verify UI copy in Simplified Chinese and English.

## Undecided Items

No open decisions for manual and non-goal test cases.
