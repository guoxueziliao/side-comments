# Stage 6.5 Issue 3: Comment Card

Status: Confirmed

## Scope

This issue restructures the comment card to wire up the Stage 6 fields and to remove the dense five-button header that the current implementation produces.

## Decision 1: Edit Panel Layout

The edit panel is grouped into two semantic rows plus the note textarea and the action row:

- Appearance row: `mark type`, `color`, `status` selects.
- Classification row: `annotation type` select, `tag chips + input`.
- Note textarea.
- Action row: `Cancel`, `Save`.

This wires up the annotation type editor and tag editor that Stage 6 defined as CSS classes (`.side-comments-card-organization`, `.side-comments-annotation-type-select`, `.side-comments-tag-editor`) but never created in `commentCard.ts`.

Field behavior:

- `mark type` includes the new `note` option from issue 1.
- `status` retains `active` and `resolved`. `orphaned` is not a user-settable target.
- `annotation type` defaults to `excerpt` when unchanged.
- Tag chips render existing tags with a remove control. The tag input supports autocomplete from existing tags in the current document.

## Decision 2: View State Information Hierarchy

The view state replaces the current five-button header with a single overflow menu and ambient status indicators on the card itself.

Structure:

- A 4 px left color bar tinted with the mark color.
- A status indicator at the top of the color bar:
  - Solid dot: active.
  - Hollow dot: resolved.
  - Red broken-link icon: orphaned.
- A single trailing overflow button "..." in the top-right corner of the card.
- A meta row with: mark type icon, annotation type chip, tag chips (first two visible, plus an overflow count chip if there are more), updated time.
- The card body shows the source excerpt and the note.

Interactions:

- Single click on the status indicator: toggles between active and resolved. Orphaned cannot be toggled this way; it must be rebound through the "..." menu.
- Single click on the card body: jumps to the source text.
- Single click on "...": opens the action menu with `Edit`, `Expand` or `Collapse`, `Adjust range` (active and resolved) or `Rebind` (orphaned), and `Delete`.

The previous five textual buttons (Expand and Collapse, Adjust and Rebind, Edit and Save, Resolve and Restore, Delete) are removed from the always-visible header.

## Decision 3: Display Mode Consolidation

The previous `normal` and `compact` modes are merged into a single default density that is closer to the current compact mode. Each card has its own expand and collapse state.

- The `settings.sidebarDisplayMode` setting is removed.
- The Normal / Compact segmented control in the sidebar header is removed.
- The `collapsedCommentIds` and `expandedCompactCommentIds` state in `sidebarView.ts` is unified under a single per-card expand set.
- The sidebar header gains an `Expand all` and `Collapse all` action accessible through a small overflow menu, so a user can still see every card's full body in one click.

## Decision 4: Resolved Card Behavior

Resolved cards default to a single-line summary (the status indicator plus the source excerpt). The card body is collapsed by default.

- Single click on the card body still jumps to the source.
- Expanding goes through "...".
- The previous `expandedResolvedCommentIds` separate set is replaced by the unified per-card expand set, but resolved cards start collapsed.

Orphaned cards use the same layout as active cards, with the red status indicator. The "..." menu shows `Rebind` instead of `Adjust range`.

## Meta Row Content

The meta row no longer repeats color and status as text. It contains, in order:

- Mark type icon (highlight, underline, strikethrough, or note).
- Annotation type chip.
- Tag chips, limited to two visible plus an overflow count chip if there are more.
- Updated time.

Status is communicated by the status indicator on the color bar. Color is communicated by the color bar itself.

## Downstream Effects

- Issue 4 reuses this card layout in the cross-note view, prepending the source file name as the first meta chip.
- Issue 5 must remove `settings.sidebarDisplayMode` and the related i18n keys (`sidebar.mode.normal`, `sidebar.mode.compact`, `sidebar.mode.switch`).
- Issue 5 must also remove or shorten the i18n keys for the removed textual buttons (`action.expand.short`, `action.collapse.short`, `action.edit.short`, `action.save.short`, and similar), keeping only the full forms that are still used as menu labels.
