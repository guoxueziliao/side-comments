# Stage 9: Card Actions And More Menu

Status: Confirmed

## Scope

This document defines visible card actions and more-menu grouping for current-document sidebar cards in `0.9.0`.

The goal is to keep cards scannable while preserving access to all management actions.

## Core Direction

Only high-frequency, low-risk edit actions should be directly visible on cards.

All secondary, rare, state-changing, or destructive actions should move into the more menu.

This keeps the card header from becoming a row of competing buttons.

Navigation is handled by clicking the card itself, not by a dedicated jump button.

## Direct Actions

Default direct actions:

- Add note or edit note.

Rules:

- Direct actions should be icon-first where possible.
- Tooltips should explain icon-only actions.
- Direct action buttons should not force card height changes.
- Direct actions should stay stable between hover and non-hover states where possible.

## More Menu Groups

The more menu should group actions by intent and risk.

### Edit

Editing actions:

- Edit mark.
- Edit tags.
- Adjust range.

These actions change metadata or anchor behavior but are not destructive by themselves.

### State

State actions:

- Mark as resolved.
- Restore as active.
- Rebind orphaned annotation.

These actions change workflow state or recovery state.

### Remove

Removal actions:

- Delete note.
- Remove mark.
- Delete annotation.

These actions can cause data loss or remove part of the annotation identity. They should appear below edit and state actions.

## Dangerous Actions

Dangerous actions should be placed at the bottom of the menu.

Rules:

- Delete annotation requires confirmation.
- Delete note requires confirmation when note is the only remaining content.
- Remove mark requires confirmation when mark is the only remaining content.
- Removing one part of a mark-and-note annotation follows Stage 8 state-transition rules.
- The UI should distinguish deleting the whole annotation from removing only a mark or only a note.

## Card-Type Actions

### Mark-Only

Direct actions:

- Add note.

More menu:

- Edit mark.
- Edit tags.
- Adjust range.
- Mark as resolved or restore as active.
- Remove mark.
- Delete annotation.

### Note-Only

Direct actions:

- Edit note.

Optional direct action:

- Add mark, only if the card has enough horizontal room without crowding.

More menu:

- Add or edit mark.
- Edit tags.
- Adjust range.
- Mark as resolved or restore as active.
- Delete note.
- Delete annotation.

### Mark-And-Note

Direct actions:

- Edit note.

More menu:

- Edit mark.
- Edit tags.
- Adjust range.
- Mark as resolved or restore as active.
- Delete note.
- Remove mark.
- Delete annotation.

### Orphaned

Direct actions:

- Rebind.

Optional direct action:

- Show source context, only when useful and not confusing.

More menu:

- Show original context.
- Edit tags.
- Mark as resolved or restore as active when allowed by the existing state model.
- Delete annotation.

Rules:

- Rebind should be easy to find.
- Adjust range should not appear until the annotation is rebound.
- Card click should not pretend navigation succeeded when the plugin cannot locate the source range.

## Compact Mode

Compact mode should expose fewer actions.

Rules:

- Move add/edit note into the more menu if the card becomes crowded.
- Keep rebind directly visible for orphaned cards.
- Do not expose destructive actions directly.

## Out Of Scope

- Adding bulk actions.
- Adding saved action presets.
- Adding keyboard shortcuts for card actions in `0.9.0`.
- Changing Stage 8 state-transition semantics.
- Supporting multiple independent notes on the same anchor.

Navigation and focus feedback is confirmed in `91-stage-9-navigation-focus-feedback.md`.

Card edit panel behavior is confirmed in `93-stage-9-card-edit-panels.md`.

Resolved and orphaned card behavior is confirmed in `94-stage-9-resolved-orphaned-card-experience.md`.
