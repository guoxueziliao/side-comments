# Stage 10: Delete Flow

Status: Confirmed

## Scope

This document defines delete behavior for current-document annotations in `0.10.0`.

Delete flow covers:

- deleting the whole annotation;
- deleting note content only;
- removing visible mark only;
- confirmation rules;
- post-delete feedback;
- filter and sidebar behavior.

## User Goal

The user should be able to remove the part they intend to remove without accidentally losing the whole annotation.

Deletion must distinguish between annotation identity, note content, and visible mark.

## Delete Actions

Supported delete actions:

- delete annotation;
- delete note;
- remove mark.

These actions are not equivalent and should not share ambiguous wording.

## Delete Annotation

Delete annotation removes the whole annotation.

It removes:

- note content;
- visible mark;
- tags;
- status;
- anchor/range;
- sidecar annotation record.

Rules:

- Always require confirmation.
- Make clear that the entire annotation will be deleted.
- After deletion, remove the sidebar card immediately.
- Remove source rendering immediately when a visible mark existed.

## Delete Note

Delete note removes note content only when another meaningful annotation part remains.

Rules:

- Mark-and-note becomes mark-only.
- Note-only has no remaining meaningful part, so deleting the note becomes delete annotation and requires confirmation.
- Deleting note must not remove mark type, color, tags, status, or anchor when a visible mark remains.

Confirmation:

- Required when deleting the note would delete the whole annotation.
- Not required when deleting the note leaves a visible mark, unless later testing shows this is too easy to trigger accidentally.

## Remove Mark

Remove mark removes the visible source mark only when another meaningful annotation part remains.

Rules:

- Mark-and-note becomes note-only.
- Mark-only has no remaining meaningful part, so removing the mark becomes delete annotation and requires confirmation.
- Removing mark must not remove note content, tags, status, or anchor when note content remains.

Confirmation:

- Required when removing the mark would delete the whole annotation.
- Not required when removing the mark leaves note content, unless later testing shows this is too easy to trigger accidentally.

## Action Placement

Delete actions should be placed in the card more menu.

Rules:

- Do not expose destructive actions as primary direct card buttons.
- Put destructive actions below edit and status actions.
- Visually distinguish delete annotation from delete note and remove mark.
- Use clear labels, not generic "delete" for all cases.

## State Handling

Delete rules apply across active, resolved, and orphaned annotations.

Rules:

- Active annotation can be deleted.
- Resolved annotation can be deleted.
- Orphaned annotation can be deleted.
- Deleting an orphaned annotation does not require rebind first.
- Delete annotation always removes the record regardless of status.

## Filter Interaction

Deletion changes the visible list immediately.

Rules:

- If the deleted card was visible, remove it from the list.
- If filters are active, keep filters unchanged.
- If the list becomes empty, show the matching empty state.
- Do not show deletion as a filter problem.

## Feedback

After successful deletion:

- update the source marks immediately;
- update the sidebar list immediately;
- keep the sidebar scroll stable when possible;
- avoid ordinary success toasts.

Use notices for:

- failed delete;
- failed sidecar save;
- deletion unavailable because the target annotation no longer exists.

Canceling a confirmation is not an error and does not need a notice.

## Undo

Stage 10 does not add a dedicated undo system.

Reason:

- Sidecar-safe undo needs a larger data design.
- Obsidian editor undo does not cover sidecar records reliably.

Future versions can revisit undo if deletion friction remains high.

## Test Targets

Delete regression should cover:

- delete whole active annotation;
- delete whole resolved annotation;
- delete whole orphaned annotation;
- delete note from mark-and-note;
- delete note from note-only with confirmation;
- remove mark from mark-and-note;
- remove mark from mark-only with confirmation;
- cancel confirmation leaves data unchanged;
- source marks update after deletion;
- sidebar list updates after deletion;
- deleting visible item under active filters keeps filters unchanged.

## Next Discussion

The current-document workflow now has create, update, jump, resolve, rebind, and delete flows.

The next topic should be workflow-level implementation order and acceptance checklist.
