# Stage 10: Current-Document Annotation Workflow

Status: To discuss

## Scope

This document designs the first Stage 10 stability area: the current-document annotation workflow.

The workflow covers:

- create;
- update;
- jump;
- resolve;
- rebind;
- delete.

This is not only a regression checklist. It defines the expected user flow and interaction behavior for high-frequency daily use.

## Workflow Goal

The current-document workflow should feel like one continuous loop:

1. Select text.
2. Create an annotation.
3. See it in the source and sidebar.
4. Review or edit it later.
5. Jump between source and card.
6. Resolve, repair, or delete it when needed.

The user should not need to understand sidecar storage, internal mark types, or anchor recovery to complete this loop.

## Shared Rules

- Source mode and reading mode are both first-class.
- Current-document sidebar is the primary management surface.
- The source text and sidebar card must stay visibly connected through navigation and focus feedback.
- Card order follows document order.
- Filters must not silently hide the result of a direct user action.
- No dedicated jump button is needed; card click handles navigation.
- Do not reintroduce fixed user-facing annotation types.
- Do not change the Stage 8 annotation model.

## Create Flow

Detailed behavior is confirmed in [Create Flow](./116-stage-10-create-flow.md).

Entry points:

- User selects text in source mode.
- User selects text in reading mode.

Primary toolbar actions:

- highlight;
- underline;
- strikethrough;
- More.

More panel actions:

- optional note;
- mark type;
- color;
- tags.

Expected behavior:

- If there is no usable selection, show a clear notice and do not create a broken annotation.
- Direct mark actions create mark-only annotations.
- More can create mark-only, note-only, or mark-and-note annotations.
- Creating on the same range should update or merge with the existing annotation instead of creating an accidental duplicate.
- After creation, the annotation appears in the sidebar in document order.
- The new card and source mark receive temporary focus feedback.

## Update Flow

Detailed behavior is confirmed in [Update Flow](./117-stage-10-update-flow.md).

Update surfaces:

- card direct action;
- card more menu;
- card edit panel;
- source selection plus adjust range when supported.

Editable fields:

- note content;
- mark type;
- color;
- tags;
- range;
- status.

Expected behavior:

- Updating note, mark, color, or tags does not change document order.
- Adjusting range may change document order if the source position changes.
- Mark-only annotations can add a note.
- Note-only annotations can add a visible mark.
- Mark-and-note annotations can remove note or mark without forcing deletion of the other part.
- Removing the last meaningful part should be treated as deleting the annotation and require clear confirmation.

## Jump Flow

Detailed behavior is confirmed in [Jump Flow](./118-stage-10-jump-flow.md).

Entry points:

- click a sidebar card;
- click a source mark;
- reveal from cross-note view when routed to the current-document sidebar.

Expected behavior:

- Card click jumps to the source range when the range can be located.
- Source mark click focuses the matching sidebar card.
- Jump target should scroll into the visual center of the editor pane when practical.
- Temporary focus feedback appears even if the target is already visible.
- If filters hide the card, show a notice and provide a clear way to reveal or clear filters.
- If the annotation is orphaned, do not pretend navigation succeeded.

## Resolve Flow

Detailed behavior is confirmed in [Resolve Flow](./119-stage-10-resolve-flow.md).

Entry points:

- status indicator;
- card more menu.

Expected behavior:

- Resolved annotations remain in document order.
- Resolved cards are not visually weakened by default.
- Resolved annotations can be restored to active.
- Resolving does not remove source marks unless a separate hide setting is enabled.
- Resolved state does not block navigation, editing, or deletion.
- Orphaned annotations use a separate recovery state and should not be treated as resolved.

## Rebind Flow

Detailed behavior is confirmed in [Rebind Flow](./120-stage-10-rebind-flow.md).

Entry point:

- orphaned annotation card.

Expected behavior:

- Rebind is for orphaned annotations.
- User selects the replacement source text first.
- Rebind action previews the old text and new selected text before saving.
- If no usable selection exists, show a clear notice and do not modify data.
- After successful rebind, the annotation becomes locatable again and receives focus feedback.
- Original context should remain visible enough for the user to identify the lost annotation before rebinding.

## Delete Flow

Detailed behavior is confirmed in [Delete Flow](./121-stage-10-delete-flow.md).

Delete actions:

- delete annotation;
- delete note;
- remove mark.

Expected behavior:

- Delete annotation removes the whole annotation and its source mark.
- Delete note removes only the note when a visible mark remains.
- Remove mark removes only the visible mark when a note remains.
- Removing the only remaining meaningful part requires confirmation as annotation deletion.
- After deletion, the sidebar list and source marks update immediately.

## Regression Targets

Stage 10 implementation should turn this workflow into concrete regression coverage:

- create from source mode;
- create from reading mode;
- create mark-only, note-only, and mark-and-note annotations;
- update note, mark, color, tags, and range;
- jump card to source and source to card;
- resolve and restore;
- rebind orphaned annotations;
- delete note, remove mark, and delete whole annotation;
- confirm filters do not silently hide direct-action results.

## Next Discussion

Confirm implementation readiness next.

The detailed flows are now split into create, update, jump, resolve, rebind, and delete documents. Implementation order is confirmed in [Workflow Implementation Order](./122-stage-10-workflow-implementation-order.md), completion criteria are confirmed in [Workflow Acceptance Checklist](./123-stage-10-workflow-acceptance-checklist.md), tests are confirmed in [Workflow Test Cases](./124-stage-10-workflow-test-cases.md), review criteria are confirmed in [Workflow Code Review Checklist](./125-stage-10-workflow-code-review-checklist.md), and scope is confirmed in [Release Boundary](./126-stage-10-release-boundary.md).
