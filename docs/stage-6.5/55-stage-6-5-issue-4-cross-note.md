# Stage 6.5 Issue 4: Cross-Note Overview

Status: Confirmed

## Scope

This issue upgrades the cross-note view from a flat list with a duplicated header into a grouped overview that reuses the shared card layout from issue 3.

## Decision 1: Shared Card Component

The cross-note view reuses the comment card from issue 3. The only differences are:

- The meta row prepends the source file name as the first chip.
- The "..." menu adds an `Open source` action that opens the source document without revealing the annotation.
- Single click on the card body navigates to the annotation in its source document and reveals the matching sidebar card, matching the current `openSourceComment` behavior.

A shared module exposes:

- The card renderer (used by both `sidebarView.ts` and `crossNoteView.ts`).
- A small icon-button utility (replacing the duplicated `createToolbarButton` helpers).
- A shared filter chip primitive used by issue 4's filter row.

The duplicated `createToolbarButton` and card markup currently living in both view files is deleted in favor of this shared module.

## Decision 2: Default Grouping By Source

The cross-note list groups annotations by source file by default.

Group header:

- Source file name (truncated to the file's basename if the path is long, with the full path as a tooltip). Clicking the header collapses or expands the group.
- Annotation count for the file.
- A small status distribution showing how many of the file's annotations are active, resolved, and orphaned. Each is rendered as a colored dot with a number.
- An `Open` button that opens the source document without filtering.

Within a group, annotations are sorted in document order, matching the sidebar.

A header-level toggle switches the list between two modes:

- `Group by file` (default).
- `Time descending, no grouping`.

This toggle is a small segmented control or chip in the header row.

## Decision 3: Filter Region

The current single row of search input plus four selects (search, source, color, status) is replaced with a search input row plus a chip-style filter row below it.

Search input row:

- Full-width search input. Placeholder: `Search annotations`.

Filter chip row:

- `Status` chip, opening a single-select dropdown for `All`, `Active`, `Resolved`, `Orphaned`.
- `Color` chip, opening a single-select dropdown for the five colors and `All`.
- `Type` chip, opening a single-select dropdown for `All`, `Excerpt`, `Question`, `Thought`, `Task`.
- `Tag` chip, opening a multi-select dropdown of tags present in the recent preview set.
- `Source` chip, opening a multi-select panel listing files with an internal search input. This replaces the freetext source input from the current implementation.

Active chips render in accent color. Inactive chips render with reduced emphasis. A `Clear` chip appears as the last item when any filter is active.

The `Type` and `Tag` chips wire up filters that match the editor surfaces added in issue 3. They are the primary user-facing payoff of "wiring up Stage 6".

## Decision 4: Primary Action

The `Copy Markdown draft` action is promoted to a primary button in the top-right of the header.

- It always copies the current filtered results.
- Multi-select with checkboxes is explicitly out of scope for `0.6.5`.

## Loading And Empty States

The current cross-note implementation uses the same string for both the `loading` and `missing` states. These are separated into four distinct copies:

- Loading: `Loading recent annotations...`. Distinct from "no data".
- Missing: `Recent annotations are not available yet. Open a few notes to populate the overview.`.
- Failed: `Failed to read annotation data. Check '.obsidian-side-comments/'.`.
- No matches: `No annotations match the current filters.` shown when filters are active and the result set is empty.

Wording in Chinese mirrors these distinctions.

## Out Of Scope For Issue 4

- Multi-select with checkboxes for bulk actions.
- Saved filter views.
- Vault-wide indexing of all annotations beyond the existing recent preview source.

## Downstream Effects

- Issue 5 must remove or repurpose the `crossNote.subtitle` and `filter.source.placeholder` keys that this issue's chip-style filter row no longer uses in the same way.
- Issue 5 must add new i18n keys for the four loading and empty states, replacing the conflated copy in `empty.crossNote.*`.
- The shared card module deletes duplicated markup in `crossNoteView.ts`, simplifying future view additions.
