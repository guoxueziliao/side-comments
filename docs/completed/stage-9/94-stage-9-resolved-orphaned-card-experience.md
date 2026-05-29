# Stage 9: Resolved And Orphaned Card Experience

Status: Confirmed

## Scope

This document defines resolved and orphaned card behavior for the current-document sidebar in `0.9.0`.

The goal is to make non-active annotations clear without breaking document-order review.

## Ordering Principle

Resolved and orphaned annotations remain tied to their source position.

Rules:

- Do not move resolved annotations to the bottom by default.
- Do not move orphaned annotations to the bottom by default.
- Keep the main list ordered by document position where position is known or recoverable.
- If an orphaned annotation has only a last-known position, use that position for ordering.
- Status should change presentation, not list order.

Detailed list ordering and grouping behavior is confirmed in `97-stage-9-list-order-grouping.md`.

## Resolved Cards

Resolved cards should remain readable but visually quieter than active cards.

Rules:

- Keep selected text visible.
- Keep note summary visible when present.
- Show a clear resolved status label.
- Lower visual contrast slightly.
- Do not make the card look disabled or unavailable.
- Keep card click navigation available when the source range can be located.

Resolved cards should support review without competing with active work.

## Resolved Actions

Resolved card actions:

- Restore as active.
- Edit note, mark, or tags when allowed by the normal card rules.
- Delete annotation.

Action placement:

- Restore as active belongs in the state group.
- Delete annotation belongs in the remove group and requires confirmation.
- Direct edit actions may be visually quieter than on active cards.

Resolved cards can be hidden through status filters, but they should not disappear because of a separate ordering rule.

## Orphaned Cards

Orphaned cards should make recovery obvious.

Rules:

- Show a clear orphaned status label.
- Show original selected text or stored context.
- Show enough context for the user to decide where to rebind.
- Use a gentle warning treatment.
- Do not use aggressive error-red styling unless there is actual data loss.
- Keep the card in document order using last-known position when possible.

The card should communicate: the annotation still exists, but its source range needs recovery.

## Orphaned Actions

Primary action:

- Rebind.

Secondary actions:

- Show original context.
- Edit tags when useful.
- Mark as resolved or restore as active only when allowed by the existing state model.
- Delete annotation.

Unavailable until rebound:

- Adjust range.

Navigation:

- Card click should not pretend source navigation succeeded when the source range cannot be located.
- If a source document can still open but the range is missing, the UI may open the document only when that behavior is clearly communicated.

## Filtering

Status filters must make resolved and orphaned visibility explicit.

Rules:

- Users should be able to filter to active, resolved, or orphaned annotations.
- If status filters hide resolved or orphaned cards, active filter feedback should make that clear.
- Empty states must not say the document has no annotations when status filters are hiding them.

## Empty States

Empty states should distinguish:

- no annotations exist;
- filters hide all resolved annotations;
- filters hide all orphaned annotations;
- all annotations are hidden by current filters.

The no-results state should offer clear all filters when filters are active.

## Visual Style

Resolved:

- lower contrast;
- retain readable text;
- avoid disabled appearance.

Orphaned:

- gentle warning accent;
- clear status label;
- recovery action easy to find.

Both states should follow the Stage 9 card visual style rules.

## Out Of Scope

- Moving resolved cards to the bottom by default.
- Moving orphaned cards to the bottom by default.
- Automatic rebind suggestions.
- Automatic bulk repair.
- Changing Stage 8 state semantics.
- Treating orphaned annotations as deleted annotations.
