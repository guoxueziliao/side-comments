# Stage 9: Card Edit Panels

Status: Confirmed

## Scope

This document defines sidebar card edit panel behavior for `0.9.0`.

The goal is to keep editing lightweight and local to the card without turning the whole card into a large form.

## Core Direction

Card editing should use local expandable panels.

Rules:

- Do not convert the entire card into a complex form.
- Do not use a full-screen editor.
- Do not use a modal for ordinary note, mark, or tag editing.
- Use confirmation modals only for destructive or dangerous actions.
- Keep editing focused on one concept at a time.

## One Panel At A Time

Only one edit panel should be open in the same card at a time.

Reasons:

- prevents the card from becoming too tall;
- keeps the user focused on one change;
- avoids accidental interactions between note, mark, and tag edits.

Rules:

- Opening note edit closes mark edit and tag edit.
- Opening mark edit closes note edit and tag edit.
- Opening tag edit closes note edit and mark edit.
- If the current panel has unsaved changes, ask the user to save or discard before switching panels.

## Note Edit Panel

The note edit panel edits only note content.

Behavior:

- Opens from add note or edit note.
- Textarea receives focus automatically.
- Save and cancel actions appear at the bottom of the panel.
- `Esc` or cancel closes without saving.
- Save persists note changes.

Empty note behavior follows Stage 8:

- Mark-and-note plus empty note becomes mark-only.
- Note-only plus empty note deletes the annotation after confirmation.
- Mark-only with no note remains mark-only if the panel is cancelled.

The note panel should not include mark or tag editing controls.

## Mark Edit Panel

The mark edit panel edits only visible mark settings.

Fields:

- mark type: no visible mark, highlight, underline, strikethrough;
- color.

Behavior:

- Save persists mark changes.
- Cancel closes without saving.
- No visible mark plus existing note becomes note-only.
- No visible mark without note deletes the annotation after confirmation when it would otherwise become empty.

The mark panel should not include note editing controls.

## Tag Edit Panel

The tag edit panel edits only tags.

Behavior:

- Show current tags as chips.
- Support tag input with completion.
- Save persists tag changes.
- Cancel closes without saving.
- Tag changes do not affect note content, mark type, color, or status.

## Compact Mode

Compact mode still supports editing.

Rules:

- Opening an edit panel may temporarily use normal card height.
- Closing the edit panel returns the card to compact presentation.
- Compact mode should not hide required save and cancel actions.
- Editing should not change density mode globally.

## Orphaned Cards

Orphaned cards prioritize recovery.

Rules:

- Rebind remains the primary visible action.
- Adjust range is unavailable until rebound.
- Editing tags may remain available.
- Editing note or mark may be allowed only if it does not confuse recovery.
- The UI should not encourage range edits before rebind.

## Unsaved Changes

If the user attempts to close, switch panels, or navigate away with unsaved changes:

- show a save or discard prompt;
- do not silently discard content;
- do not save partial edits without user action.

## Dangerous Actions

Dangerous actions still use confirmation.

Examples:

- deleting the only note on a note-only annotation;
- removing the only mark on a mark-only annotation;
- deleting the whole annotation;
- replacing a bound range in a way that changes the source anchor.

## Out Of Scope

- Full-screen editing.
- Complex multi-section card forms.
- Editing multiple cards at once.
- Bulk tag editing.
- Keyboard shortcut design for edit panels.
- Changing Stage 8 state-transition semantics.
