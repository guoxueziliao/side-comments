# Stage 10: Update Flow

Status: Confirmed

## Scope

This document defines how users update current-document annotations after creation.

Update flow covers note content, mark type, color, tags, range, and status.

## User Goal

The user should be able to revise an existing annotation without losing the connection between the source text, source mark, and sidebar card.

Update actions should be local, predictable, and easy to cancel.

## Entry Points

Supported update entry points:

- sidebar card direct action;
- sidebar card more menu;
- focused card edit panel;
- current source selection for range adjustment.

Unsupported entry points: direct Markdown edits, manual sidecar JSON edits through plugin UI, and bulk cross-document updates.

## Direct Card Actions

Direct card actions are for high-frequency safe edits.

Rules:

- mark-only card shows add note.
- note-only card shows edit note.
- mark-and-note card shows edit note.
- orphaned card prioritizes rebind, not ordinary range adjustment.
- Direct actions must not trigger card-to-source navigation.

## More Menu Actions

The card more menu contains lower-frequency or state-changing actions.

Actions:

- edit mark;
- edit tags;
- adjust range;
- mark as resolved;
- restore as active;
- rebind orphaned annotation;
- delete note;
- remove mark;
- delete annotation.

Rules:

- Dangerous actions stay below ordinary edit and state actions.
- Delete annotation should be visually and semantically distinct from delete note and remove mark.
- Adjust range is unavailable for orphaned annotations until they are rebound.

## Edit Panels

Use focused panels instead of one large full annotation form.

Panel types: note panel, mark panel, and tag panel.

Note panel:

- edits note content only;
- supports cancel;
- saves without changing mark, color, tags, range, or status.

Mark panel:

- edits mark type and color;
- supports cancel;
- does not edit note or tags.

Tag panel:

- edits tags only;
- supports adding and removing tags;
- does not edit note, mark, color, range, or status.

## Range Adjustment

Range adjustment uses the current document selection.

Expected flow:

1. User selects replacement text in the current document.
2. User chooses adjust range on the target annotation.
3. Plugin validates that the selection is usable.
4. Plugin updates the anchor/range.
5. Source mark and sidebar card update immediately.

Rules:

- If no usable selection exists, show a clear notice and keep data unchanged.
- Adjusting range can change document order if the source position changes.
- Adjusting range should preserve note, mark type, color, tags, and status.
- Adjust range is for locatable annotations; orphaned annotations use rebind.

## State Updates

Status changes are part of update flow but should stay lightweight.

Rules:

- active can become resolved;
- resolved can become active;
- orphaned cannot be treated as active by a simple status toggle;
- rebind is the path from orphaned back to a locatable annotation.

Status changes should not change note, mark, color, tags, or range.

## State Transitions By Annotation Shape

Mark-only:

- add note creates mark-and-note;
- edit mark changes mark type or color;
- remove mark deletes the annotation and requires confirmation.

Note-only:

- edit note changes note content;
- add or edit mark creates mark-and-note;
- delete note deletes the annotation and requires confirmation.

Mark-and-note:

- delete note leaves mark-only;
- remove mark leaves note-only;
- delete annotation removes both.

## Feedback

After successful update:

- card updates immediately;
- source mark updates immediately when mark or range changes;
- card remains visible when possible;
- focus remains on the updated card;
- temporary feedback may be applied to the card and source target.

Avoid success toasts for normal edits.

Use notices for:

- invalid selection;
- failed save;
- hidden-by-filter result;
- destructive confirmation cancellation is not an error and does not need a notice.

## Filter Interaction

Updates should not silently make the edited card disappear.

Rules:

- If an update causes the card to no longer match active filters, show a clear notice.
- Prefer keeping focus context visible long enough for the user to understand what happened.
- Do not automatically clear filters unless later confirmed.

## Test Targets

Update regression should cover:

- add note to mark-only;
- edit note on note-only;
- edit note on mark-and-note;
- edit mark type;
- edit color;
- edit tags;
- adjust range with valid selection;
- adjust range with no usable selection;
- resolve and restore;
- delete note from mark-and-note;
- remove mark from mark-and-note;
- delete last meaningful part with confirmation;
- update that causes active filters to hide the card.

## Next Discussion

The next workflow topic is jump flow.

Jump flow should define card-to-source, source-to-card, filter-hidden behavior, orphaned behavior, and focus feedback.
