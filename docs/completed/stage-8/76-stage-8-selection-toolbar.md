# Stage 8: Selection Toolbar

Status: Confirmed

## Scope

This document defines the primary selection toolbar after Stage 8 separates visual marks from written notes.

The toolbar should stay small and fast. Secondary choices live in the `More` modal.

## Primary Buttons

The toolbar shows:

- Highlight.
- Underline.
- Strikethrough.
- More.

It does not show:

- Note as a primary mark button.
- Annotation type.
- Tag input.
- Color pickers attached to each primary button.

## Primary Button Color Behavior

Single-clicking a visual mark button creates a mark-only annotation using that mark's default color or last-used color.

Default colors:

- Highlight: yellow.
- Underline: blue.
- Strikethrough: red.

If the implementation already tracks last-used colors per mark type, the primary button should reuse that color after the first change.

## Color Selection

Color selection is handled in the `More` modal.

The primary toolbar should not show small chevron color pickers in `0.8.0`.

Reason:

- `0.8.0` is a simplification release.
- The primary path should be quick visual marking.
- Color customization is useful but secondary.

## More Button

The `More` button opens the advanced create modal defined in `73-stage-8-advanced-create-modal.md`.

Use `More` for:

- No visible mark plus note.
- Choosing a non-default color.
- Creating a mark plus initial note.

## Out Of Scope

- Per-button color picker chevrons.
- Keyboard shortcut customization.
- Tags in the selection toolbar.
- Fixed annotation type controls.
