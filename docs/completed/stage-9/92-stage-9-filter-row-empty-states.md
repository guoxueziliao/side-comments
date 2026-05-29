# Stage 9: Filter Row And Empty States

Status: Confirmed

## Scope

This document defines current-document sidebar filter row and empty-state behavior for `0.9.0`.

The goal is to make filtering clear without turning the sidebar into a large control panel.

## Core Direction

The filter row should stay compact.

Rules:

- Do not use a large filter panel by default.
- Keep the most common filters visible.
- Move lower-frequency filters into more filters.
- Show active filters clearly.
- Make clearing filters easy.

## Default Visible Filters

Default visible filters:

- status;
- visual mark type;
- note state;
- keyword.

These filters are most useful for quickly narrowing the current document list.

## More Filters

More filters may include:

- color;
- tags;
- advanced metadata filters if later needed.

Reason:

- Color and tags are useful, but showing everything at once makes the sidebar row crowded.
- More filters keeps the default row readable while preserving access to detail.

## Active Filter Feedback

When filters are active, the sidebar should make that state obvious.

Required feedback:

- active filter count;
- clear all filters action;
- visible filter chips or compact active-filter summary;
- clear individual filter where practical.

Rules:

- Active filters should not be hidden only inside a menu.
- The user should be able to understand why the list changed.
- Clearing all filters should be one obvious action.

## Empty States

Empty states must explain why the list is empty.

Use distinct empty states for:

- current document has no annotations;
- current filters have no results;
- annotation data is loading;
- current document does not support annotations;
- annotations are hidden by display settings.

Do not use one generic empty message for all cases.

## No Annotations

When the current document has no annotations:

- show a quiet empty state;
- do not show clear filters unless filters are active;
- avoid instructional text that repeats obvious toolbar behavior.

## No Filter Results

When filters hide all annotations:

- say that the current filters have no results;
- show clear all filters;
- keep active filter chips visible;
- do not imply the document has no annotations.

## Loading State

When annotation data is loading:

- show a lightweight loading state;
- avoid layout jumps where practical;
- do not show a no-results state until loading finishes.

## Unsupported Document State

When the current document cannot support annotations:

- show a short unsupported state;
- do not show annotation-specific actions that cannot work;
- keep the message factual and brief.

## Hidden Marks State

When annotations exist but display settings hide marks:

- do not imply annotations are missing;
- make it clear that display settings are affecting visibility;
- keep the sidebar list available.

## Orphaned And Resolved Annotations

Orphaned and resolved annotations remain real annotations.

Rules:

- They should not be hidden by a generic empty state.
- If filters hide them, the empty state should say filters have no results.
- If display mode or status filters hide them, active filter feedback should make that visible.

Detailed resolved and orphaned card behavior is confirmed in `94-stage-9-resolved-orphaned-card-experience.md`.

## Compact Mode

Compact mode keeps the filter row usable.

Rules:

- Keep default visible filters accessible.
- More filters may collapse more aggressively.
- Active filter count and clear all filters must remain visible when filters are active.

If filters hide the current focused annotation, focus behavior should follow `95-stage-9-current-focus-scroll-behavior.md`.

Toolbar-level filter entry and active filter display are confirmed in `96-stage-9-sidebar-toolbar.md`.

## Out Of Scope

- Saved filters.
- Saved views.
- Filter presets.
- Full-vault Markdown body search.
- A large advanced filter builder.
