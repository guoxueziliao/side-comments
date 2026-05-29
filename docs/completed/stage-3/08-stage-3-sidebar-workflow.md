# Stage 3: Sidebar Workflow

Status: Confirmed

## Goal

Improve the current-document annotation sidebar so it stays usable when a note has many annotations.

This stage should happen after `v0.2` anchor reliability work. It should not expand into cross-note review or full-vault search.

## Scope

Stage 3 focuses on the sidebar for the active document:

- document-order comment list;
- status display without changing order;
- resolved and orphaned card behavior;
- normal and compact display modes;
- card-to-text and text-to-card navigation;
- combined current-document filtering.

Keyboard navigation is not included in this stage.

## Data Boundary

`0.3.0` should not change the sidecar comment data schema.

Allowed data changes:

- plugin-level display settings;
- plugin-level resolved-comment visibility preference.

Disallowed data changes:

- sidecar schema changes;
- historical comment data migration;
- per-document sidebar UI state;
- per-comment expanded or collapsed UI state.

This keeps `0.3.0` focused on sidebar workflow and avoids mixing UI improvements with annotation data migration.

## Decision Documents

- `09-stage-3-order-and-status.md`: document-order sorting, status display, resolved comments, orphaned comments.
- `10-stage-3-display-modes.md`: normal mode, compact mode, and global display preference persistence.
- `11-stage-3-navigation.md`: sidebar-card-to-document jump and document-mark-to-sidebar-card focus.
- `12-stage-3-filtering.md`: combined current-document filters.
- `13-stage-3-acceptance-checklist.md`: completion checklist for `0.3.0`.
- `14-stage-3-code-review-checklist.md`: code review checklist for `0.3.0`.
- `15-stage-3-test-cases.md`: concrete test cases for `0.3.0`.
- `16-stage-3-ui-copy.md`: final UI labels, tooltips, and empty states for `0.3.0`.

These files live together in `docs/completed/stage-3/`.

## Implementation Order

1. Add deterministic position-based sorting for one main comment list.
2. Add clear status labels and visual styles without changing list order.
3. Add in-place folded display for resolved comments with a visible hide/show control.
4. Add full in-place orphaned card display with original text, context, and rebind action.
5. Add compact sidebar mode.
6. Add sidebar-card-to-document jump with temporary target highlight.
7. Add document-mark-to-sidebar-card focus on click.
8. Add combined current-document filters.

## Implementation Batches

### `0.3.0-alpha`: Stable List Structure

- document-order sorting;
- status labels and visual styles;
- in-place folded display for resolved comments;
- full in-place orphaned card display.

### `0.3.0-beta`: Display Modes and Navigation

- normal and compact display modes;
- global display setting persistence;
- card-to-document jump with visual-center scrolling;
- document-mark-to-sidebar-card focus;
- temporary text and card highlights.

### `0.3.0-final`: Filtering and Polish

- combined current-document filters;
- empty states;
- clear filters action;
- show resolved action;
- regression testing;
- release preparation.

## Out of Scope

- Keyboard navigation.
- Recent annotations across notes.
- Full-vault annotation search.
- Full-vault indexing.
- Import, export, or repair tools.
