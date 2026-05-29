# Stage 8: Card Actions

Status: Confirmed

## Scope

This document defines sidebar and cross-note card action menus after Stage 8 separates visual marks from note content.

Stage 8 should use one consistent action model across:

- mark-only annotations;
- note-only annotations;
- mark-and-note annotations;
- orphaned annotations.

## Shared Actions

All non-orphaned cards expose:

- Jump to source text.
- Adjust range.
- Delete.

Clicking the card body should still jump to the source text.

## Mark-Only Cards

Mark-only cards contain a visual mark but no note content.

Additional action:

- Add note.

Behavior:

- `Add note` opens the card edit state focused on the note field.
- Saving note content turns the card into a mark-and-note card.
- Empty or whitespace-only note content should not create a note.

## Note-Only Cards

Note-only cards contain note content but no visible mark. Internally, `0.8.0` may still represent these with the compatibility `note` mark type.

Additional actions:

- Add mark.
- Edit note.

Behavior:

- `Add mark` lets the user choose highlight, underline, or strikethrough plus color.
- `Edit note` opens the note editor.
- The internal compatibility `note` mark is not shown as a user-facing mark type.

## Mark-And-Note Cards

Mark-and-note cards contain both a visual mark and note content.

Additional actions:

- Edit mark.
- Edit note.
- Remove mark.

Behavior:

- `Edit mark` changes visual mark type and color.
- `Edit note` changes note content.
- `Remove mark` keeps the note and turns the card into a note-only card.
- Removing note content keeps the visual mark and turns the card into a mark-only card.

## Remove Mark And Delete Note Semantics

Stage 8 separates deleting a whole annotation from removing one part of it.

Rules:

- Mark-and-note, delete note: remove note content, keep the visual mark, and turn the card into mark-only.
- Mark-and-note, remove mark: remove the visual mark, keep note content, and turn the card into note-only.
- Mark-only, remove mark: delete the whole annotation because no note would remain.
- Note-only, delete note: delete the whole annotation because no visual mark would remain.
- Delete card: always delete the whole annotation.

The implementation should never leave an empty annotation with no visible mark and no note content.

Menu wording should keep whole-annotation deletion separate from part removal:

- `Delete` or `Delete annotation` removes the whole annotation.
- `Remove mark` removes only the visual mark when note content remains.
- `Delete note` removes only note content when a visual mark remains.

## Orphaned Cards

Orphaned cards expose:

- Rebind.
- Delete.
- Show original context.

Rules:

- Orphaned cards do not expose Adjust range until they are rebound.
- After successful rebind, actions follow the normal mark-only, note-only, or mark-and-note rules.

## Menu Labels

Final Chinese and English labels are confirmed later in the Stage 8 UI copy document.

This document confirms behavior, not final wording.

## Out Of Scope

- Multi-select bulk actions.
- Saved action presets.
- Keyboard shortcuts for these menu actions.
- Automatic conversion between mark-only and note-bearing annotations without user action.
