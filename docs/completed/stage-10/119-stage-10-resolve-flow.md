# Stage 10: Resolve Flow

Status: Confirmed

## Scope

This document defines resolve and restore behavior for current-document annotations in `0.10.0`.

Resolve flow covers:

- active to resolved;
- resolved to active;
- relationship between resolved and orphaned states;
- visual treatment;
- editing and jump behavior.

## User Goal

The user should be able to mark an annotation as handled without losing it, hiding it, or making it feel broken.

Resolved is a workflow state, not a visual punishment.

## State Meaning

Active:

- annotation still needs attention or remains part of current review.

Resolved:

- annotation has been handled or no longer needs active attention.
- annotation remains valid and connected to source text.

Orphaned:

- annotation cannot currently be reliably connected to source text.
- orphaned is a separate state from resolved.
- orphaned requires recovery or rebind behavior, not ordinary resolve styling.

## Visual Treatment

Resolved cards should not be visually weakened by default.

Rules:

- Do not lower opacity for resolved cards.
- Do not make resolved cards look disabled.
- Do not hide resolved cards by default.
- Show resolved state through a clear status indicator or label.
- Keep source mark visibility unchanged unless the user uses a separate hide setting.

Reason:

- Resolved annotations are still valid annotations.
- The user may need to review, jump to, edit, restore, or delete them later.
- Lower visual weight makes resolved annotations feel less trustworthy than active annotations.

## Ordering

Resolved annotations remain in document order.

Rules:

- Resolving does not move a card to the bottom.
- Restoring does not move a card.
- Filters may show only active, resolved, or orphaned annotations, but default order remains source order.

## Entry Points

Supported entry points:

- card status indicator;
- card more menu.

Expected actions:

- active annotation can be marked resolved;
- resolved annotation can be restored to active.

Orphaned annotations should not use ordinary active/resolved toggling as their primary recovery path.

## Behavior

Resolving should only change workflow status.

It must not change:

- note content;
- mark type;
- color;
- tags;
- anchor range;
- source mark rendering, except through independent hide settings.

Resolved annotations remain:

- navigable;
- editable;
- deletable;
- restorable.

## Relationship To Orphaned

Orphaned state must be visually and behaviorally distinct.

Rules:

- Orphaned annotations use recovery-oriented UI.
- Rebind is the primary action for orphaned annotations.
- Orphaned cards may use a warning or lost-link signal.
- Orphaned cards should not be styled like ordinary resolved cards.
- If an annotation was previously resolved and later becomes orphaned, the UI should prioritize orphaned recovery.

Stage 10 can later decide whether historical resolved status is preserved internally while an annotation is orphaned.

## Filter Interaction

Status filters should treat states separately.

Filter options should distinguish:

- all;
- active;
- resolved;
- orphaned.

Rules:

- Selecting resolved should not show orphaned annotations unless they are explicitly included by all.
- Selecting orphaned should show lost annotations regardless of whether they were previously active or resolved.
- Changing status can cause a card to leave the current filter; if so, show clear feedback.

## Feedback

After resolve or restore:

- update the card status immediately;
- keep the card in document order;
- keep focus on the card when possible;
- avoid ordinary success toasts;
- use a notice only if active filters hide the card after the change.

## Test Targets

Resolve regression should cover:

- active to resolved;
- resolved to active;
- resolved card still jumps to source;
- resolved card still allows note, mark, tag, and delete actions;
- resolved card stays in document order;
- resolved card is not opacity-reduced or disabled-looking;
- resolved filter does not include orphaned annotations;
- orphaned state uses distinct recovery behavior;
- status change that hides the card under current filters gives clear feedback.

## Next Discussion

The next workflow topic is rebind flow.

Rebind flow should define how orphaned annotations are identified, displayed, previewed, and restored to a source selection.
