# Stage 6: Implementation Order

Status: Confirmed

This document proposes the development order for `0.6.0`.

## Goal

Implement annotation organization in small, verifiable slices without disrupting existing annotation creation, sidebar review, cross-note review, or data maintenance behavior.

## Confirmed Order

1. Add annotation metadata fields for type and tags.
2. Add translation keys and UI copy for `0.6.0`.
3. Add annotation type display and editing.
4. Add sidebar tag editor.
5. Add tag autocomplete from already-used tags.
6. Extend current-note sidebar filters.
7. Extend cross-note review filters.
8. Add Markdown draft formatter.
9. Add `Copy draft` action to the current-note sidebar.
10. Add `Copy draft` action to the cross-note review page.
11. Add focused tests for metadata compatibility, filtering, tag normalization, and Markdown draft output.

## Implementation Notes

### 1. Metadata Fields

Add optional metadata fields first so older annotations remain readable.

- Missing type should display as Excerpt.
- Missing tags should display as no tags.
- Existing annotations should not be batch-migrated.
- The plugin should write type or tags only when a new annotation is created or an existing annotation is edited.

### 2. Translation Keys

Add the `0.6.0` UI copy before wiring controls so labels, notices, and tooltips stay consistent across current-note and cross-note surfaces.

### 3. Type Editing

Implement the type dropdown in both creation and sidebar review.

- Creation toolbar defaults to Excerpt.
- Sidebar cards allow changing the type after creation.
- The selector should not block fast annotation creation.

### 4. Tags

Implement sidebar-only tag editing before tag filters.

- Tags use chip plus input UI.
- Enter adds a tag.
- `x` removes a tag.
- Autocomplete only comes from already-used tags.
- English tag matching is case-insensitive.

### 5. Filters

Implement filters after type and tags exist.

- Different dimensions use AND.
- Multiple values inside one dimension use OR.
- Empty filters show all.
- Current-note sidebar and cross-note review remember filter state separately during the current Obsidian session.
- `Clear filters` resets the current surface only.

### 6. Markdown Draft Copy

Implement Markdown draft copying after filters are stable.

- Copy the current filtered result set.
- Do not implement manual multi-select.
- Group output by source document.
- Include active, resolved, and orphaned annotations that are present in the filtered result set.
- Do not generate summaries, conclusions, or AI output.

## Out Of Scope For This Order

- Saved views or saved filters.
- Timeline or date-based filters.
- Review queues or annotation collections.
- Source-document writing workflow integration.
- Automatic summary generation.
- Automatic `thought-distillation` invocation.

## Undecided Items

No open decisions for implementation order.
