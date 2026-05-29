# Stage 6: Annotation Filters

Status: Confirmed

## Goal

Make the annotation organization model usable through combined filters in both current-note and cross-note review workflows.

## Version Boundary

Annotation filters are planned as part of `0.6.0`.

They should build on existing Stage 3 current-document filters and Stage 4 cross-note review filters.

## Confirmed Filter Dimensions

`0.6.0` should support combined filtering by:

- status;
- type;
- tag;
- color;
- keyword.

Color remains a visual marker, but filtering by color is still useful as a visual lookup tool. Color should not become a semantic category.

## Confirmed Surfaces

Combined filters should be available in:

- the current-note sidebar;
- the cross-note annotation review page.

The exact layout can differ between the two surfaces, but filter behavior should stay consistent.

## Relationship To Type And Tags

Type filtering uses the fixed type set:

- Excerpt.
- Question.
- Thought.
- Task.

Tag filtering uses user-defined annotation tags.

For multiple selected tags, the first version uses include-any matching: an annotation matches when it has any selected tag.

## Confirmed Combination Logic

Different filter dimensions combine with AND logic.

Within the same dimension, multiple selected values combine with OR logic.

Example:

```text
Status: Active
Type: Question
Tags: 爱情观, 记忆
```

This means:

- status must be Active;
- type must be Question;
- tag can be either `爱情观` or `记忆`.

Empty filters mean show all.

When no filter value is selected, the current-note sidebar and cross-note review page should show all annotations available in that view.

Filter state should be remembered separately per surface during the current Obsidian session.

- The current-note sidebar has its own filter state.
- The cross-note review page has its own filter state.
- Filter state does not need to persist across Obsidian restarts in `0.6.0`.

The UI should provide a one-click reset action.

- Reset clears filters for the current surface only.
- Reset does not clear the other surface's remembered session filters.
- After reset, the view returns to the empty-filter state and shows all annotations available in that view.

## Initial Boundary

`0.6.0` should keep filtering understandable.

The first version should not include:

- nested query builders;
- saved views;
- exclude conditions;
- complex boolean expressions;
- full-text search over Markdown body.

Keyword filtering should search annotation-derived fields, not the entire source note body.

Saved views and saved filters are explicitly out of scope for `0.6.0`.

The first version should rely on:

- combined filters;
- session-level filter memory per surface;
- one-click reset.

## Undecided Items

No open decisions for combined filters in the first version.
