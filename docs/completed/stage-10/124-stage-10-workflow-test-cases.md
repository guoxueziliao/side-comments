# Stage 10: Workflow Test Cases

Status: Confirmed

## Scope

This document defines concrete test cases for the Stage 10 current-document annotation workflow.

Use it with [Workflow Acceptance Checklist](./123-stage-10-workflow-acceptance-checklist.md).

## Test Data

Prepare a Markdown note with:

- repeated text appearing at least three times;
- headings, lists, links, and inline formatting;
- paragraphs long enough to require scrolling;
- existing active, resolved, and orphaned annotations when testing recovery.

## Create Cases

1. Source mode direct highlight.
   - Select text in source mode.
   - Click highlight.
   - Expect source mark and sidebar card.

2. Source mode More note-only.
   - Select text in source mode.
   - Open More and enter note without visible mark.
   - Expect sidebar card and no visible source mark.

3. Reading mode direct underline.
   - Select text in reading mode.
   - Click underline.
   - Expect source-backed annotation after returning to source mode.

4. Same-range duplicate update.
   - Create an annotation on a range.
   - Select the same range again and create another mark.
   - Expect existing annotation update, not a duplicate card.

5. Invalid selection.
   - Attempt creation with no usable selection.
   - Expect notice and no sidecar change.

## Update Cases

1. Add note to mark-only.
   - Start with highlight-only annotation.
   - Add note from card direct action.
   - Expect mark-and-note state.

2. Edit mark type and color.
   - Open mark panel.
   - Change mark type and color.
   - Expect source rendering update and note preserved.

3. Edit tags.
   - Add and remove tags from tag panel.
   - Expect normalized tags and card update.

4. Adjust range.
   - Select replacement text.
   - Adjust range from card menu.
   - Expect anchor moves, metadata preserved, order updated if needed.

5. Invalid range adjustment.
   - Clear selection.
   - Try adjust range.
   - Expect notice and no data change.

## Jump Cases

1. Collapsed card to source.
   - Click collapsed card.
   - Expect source target centered or comfortably visible.

2. Compact card to source.
   - Switch to compact density.
   - Click card.
   - Expect same jump behavior as normal mode.

3. Source mark to card.
   - Click source-mode mark.
   - Expect matching card focus.

4. Reading mark to card.
   - Click reading-mode mark.
   - Expect matching card focus.

5. Filter-hidden target.
   - Apply filters that hide a target card.
   - Trigger source-to-card jump.
   - Expect clear notice or reveal path.

## Resolve Cases

1. Active to resolved.
   - Mark active card resolved.
   - Expect status update and same document order.

2. Resolved to active.
   - Restore resolved card.
   - Expect status update and same document order.

3. Resolved card behavior.
   - Jump, edit note, edit mark, and delete from resolved card.
   - Expect all actions remain available.

4. Resolved visual treatment.
   - Verify resolved card is not opacity-reduced or disabled-looking.

## Rebind Cases

1. Orphaned display.
   - Load orphaned annotation.
   - Expect original text and context visible.

2. Rebind no selection.
   - Click rebind without selection.
   - Expect notice and unchanged data.

3. Rebind with source-mode selection.
   - Select replacement text.
   - Click rebind.
   - Confirm preview.
   - Expect orphaned state cleared.

4. Rebind cancel.
   - Open preview and cancel.
   - Expect unchanged data.

5. Rebind under orphaned filter.
   - Filter to orphaned only.
   - Rebind annotation.
   - Expect clear feedback if card leaves visible list.

## Delete Cases

1. Delete whole annotation.
   - Delete active annotation.
   - Confirm.
   - Expect card and source mark removed.

2. Delete note from mark-and-note.
   - Delete note.
   - Expect mark-only remains.

3. Delete note from note-only.
   - Delete note.
   - Confirm whole annotation deletion.
   - Expect card removed.

4. Remove mark from mark-and-note.
   - Remove mark.
   - Expect note-only remains.

5. Remove mark from mark-only.
   - Remove mark.
   - Confirm whole annotation deletion.
   - Expect card removed.

## Full Workflow Cases

1. Source-mode full loop.
   - Create, update, jump, resolve, restore, adjust range, delete.
   - Expect valid sidecar data throughout.

2. Reading-mode full loop.
   - Create, jump, update from sidebar, delete.
   - Expect behavior matches source mode where selection mapping is supported.

3. Filtered workflow.
   - Repeat create, update, resolve, and delete while filters are active.
   - Expect no silent disappearances.
