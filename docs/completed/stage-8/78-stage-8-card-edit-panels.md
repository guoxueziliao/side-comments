# Stage 8: Card Edit Panels

Status: Confirmed

## Scope

This document defines edit panels after Stage 8 separates visual marks from written notes.

Card actions are defined in `72-stage-8-card-actions.md`. This document defines what each edit action opens.

## Editing Principle

Edit one concept at a time.

Do not use one large edit panel that mixes mark, color, note, status, tags, and old annotation type concepts.

## Edit Note

`Edit note` opens a note-only editor:

- textarea;
- Save;
- Cancel.

Rules:

- Saving non-empty content updates note content.
- Whitespace-only content counts as empty.
- If the card is mark-and-note and note is saved empty, the card becomes mark-only.
- If the card is note-only and note is saved empty, the user must confirm deleting the whole annotation.

## Edit Mark

`Edit mark` opens a visual mark editor:

- mark selector;
- color selector;
- Save;
- Cancel;
- Remove mark when the card has a visible mark.

Mark options:

- Highlight.
- Underline.
- Strikethrough.

Rules:

- Editing mark changes visual mark type and color.
- Note-only `Add mark` uses the same editor without `Remove mark`.
- `Remove mark` follows the rules in `72-stage-8-card-actions.md`.
- The internal compatibility `note` mark type is not shown.

## Edit Tags

Tags remain separate from mark and note editing.

Direction:

- Keep tag chips and tag input on the expanded card or a focused tag-edit surface.
- Do not add tags to the primary selection toolbar.
- Do not mix tag editing into the note textarea panel.

## Status

Status remains a lightweight card action.

Rules:

- Active and resolved can be toggled from the card status control.
- Orphaned state is controlled by anchor recovery and rebind, not by the note or mark editor.
- Status is not edited inside the note or mark panel.

## Removed Fields

The edit panels do not include:

- Annotation type.
- Excerpt.
- Question.
- Thought.
- Task.

## Out Of Scope

- Multi-field bulk edit panels.
- Keyboard shortcut customization.
- Batch tag editing.
- Priority or importance.
