# Stage 9: Sidebar Card Experience

Status: Confirmed

## Scope

This document records the first main priority for `0.9.0`.

Stage 9 starts with the right sidebar and current-document annotation list.

## Why This Comes First

The right sidebar is the surface users see most often while reading and writing.

It is where annotations are reviewed, edited, filtered, resolved, deleted, and used for navigation. If this surface feels crowded or unclear, the whole plugin feels heavier than it is.

Improving the sidebar first gives the largest day-to-day user experience gain without changing the product model again.

## Confirmed Priority

The first `0.9.0` priority is:

Right sidebar cards and the current-document annotation list.

Other surfaces may be adjusted only when directly affected by sidebar behavior, such as source-to-card navigation or shared card rendering in cross-note overview.

## Candidate Discussion Areas

These are discussion areas, not final scope yet:

- Card visual hierarchy.
- Card density in normal and compact modes.
- Selected text, note content, mark, color, tags, and status placement.
- Mark-only, note-only, and mark-and-note card distinction.
- Orphaned and resolved card presentation.
- Action buttons and overflow menu grouping.
- Inline edit panels.
- Card-to-source and source-to-card navigation feedback.
- Temporary target feedback after jumping.
- Active filter state and list empty states.
- Current annotation focus state.

## Design Direction

The sidebar should be compact, readable, and calm.

Cards should support scanning:

- selected text should be easy to identify;
- note content should be readable without overwhelming mark-only entries;
- mark and color should be visible but not dominate;
- tags and status should be present without creating clutter;
- destructive actions should not compete with common actions.

## Out Of Scope For This Priority

- Reopening the Stage 8 mark/note model.
- Redesigning the whole settings page.
- Redesigning the whole cross-note overview unless shared card behavior requires it.
- Adding new annotation workflow concepts.
- Adding saved views, review queues, priority, or AI behavior.

## Next Decision To Discuss

The card information hierarchy is confirmed in `87-stage-9-card-information-hierarchy.md`.

Navigation and focus feedback is confirmed in `91-stage-9-navigation-focus-feedback.md`.

Confirmed visual style is recorded in `88-stage-9-card-visual-style.md`.

Confirmed normal and compact density behavior is recorded in `89-stage-9-card-density-modes.md`.

Confirmed action grouping and more-menu behavior is recorded in `90-stage-9-card-actions-menu.md`.

Confirmed filter row and empty-state behavior is recorded in `92-stage-9-filter-row-empty-states.md`.

Confirmed card edit panel behavior is recorded in `93-stage-9-card-edit-panels.md`.

Confirmed resolved and orphaned card behavior is recorded in `94-stage-9-resolved-orphaned-card-experience.md`.

Confirmed current focus and scroll behavior is recorded in `95-stage-9-current-focus-scroll-behavior.md`.

Confirmed sidebar toolbar behavior is recorded in `96-stage-9-sidebar-toolbar.md`.

Confirmed list ordering and grouping behavior is recorded in `97-stage-9-list-order-grouping.md`.
