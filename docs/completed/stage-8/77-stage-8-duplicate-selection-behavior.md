# Stage 8: Duplicate Selection Behavior

Status: Confirmed

## Scope

This document defines what happens when the user selects text that already has an annotation and creates another mark or note.

Stage 8 separates marks from notes, so repeated selection should usually update the existing annotation instead of creating duplicates.

## Principle

Do not create duplicate annotations for the same selected range by default.

When the selected range matches an existing annotation anchor closely enough, the create action should update the existing annotation and focus its card.

## Confirmed Rules

Same selection already has the same visual mark:

- Do not create a new annotation.
- Focus the existing card or show a lightweight "already exists" notice.

Same selection has mark-only and the user adds a note:

- Update the existing annotation.
- Convert it to mark-and-note.

Same selection has note-only and the user adds a visual mark:

- Update the existing annotation.
- Convert it to mark-and-note.

Same selection has mark-and-note and the user changes mark type or color:

- Update the existing annotation.
- Do not create a second annotation.

## Duplicate Anchor Policy

Fully duplicate anchors are not allowed by default in `0.8.0`.

If future workflows need multiple independent notes on the exact same selected text, that should be designed as a separate multi-note feature. It is not part of Stage 8.

## Matching Heuristic

Implementation should start conservative:

- exact same file;
- same selected text;
- same start and end offsets, or a high-confidence relocated equivalent.

If confidence is low, prefer creating a separate annotation over incorrectly merging unrelated annotations.

## Out Of Scope

- Multiple independent notes on the same anchor.
- Bulk duplicate cleanup.
- Automatic semantic merging of similar annotations.
- Similarity-based merge across different selected ranges.
