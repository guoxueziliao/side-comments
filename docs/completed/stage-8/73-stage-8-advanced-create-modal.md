# Stage 8: Advanced Create Modal

Status: Confirmed

## Scope

This document defines the `More` modal used after selecting text in `0.8.0`.

The modal keeps the current advanced creation shape but removes fixed annotation type.

## Fields

The modal contains:

- Mark.
- Color.
- Initial note.
- Cancel.
- Create.

It does not contain annotation type.

## Mark Field

The mark field replaces the old mark type concept in the user-facing UI.

Options:

- No visible mark.
- Highlight.
- Underline.
- Strikethrough.

`No visible mark` creates a note-only annotation when note content is provided.

The internal compatibility `note` mark type is not shown as an option.

## Default Mark

Default: Highlight.

Reason:

- The dominant selection flow is visual marking.
- Users opening `More` often want to adjust color or add an initial note while keeping highlight as the base action.
- Pure note creation remains available by changing Mark to `No visible mark`.

## Creation Rules

Valid:

- No visible mark plus note content: creates note-only.
- Highlight, underline, or strikethrough without note content: creates mark-only.
- Highlight, underline, or strikethrough with note content: creates mark-and-note.

Invalid:

- No visible mark and no note content.

For the invalid case, the Create button should be disabled or the modal should show a clear notice such as "Add a note or choose a mark."

Whitespace-only note content counts as empty.

## Removed Field

Remove the fixed annotation type field:

- Excerpt.
- Question.
- Thought.
- Task.

The modal should not show `摘录 / 问题 / 想法 / 任务`.

## Out Of Scope

- Tags in the creation modal.
- Multi-select creation.
- Keyboard shortcut customization for modal fields.
- New semantic classification fields.
