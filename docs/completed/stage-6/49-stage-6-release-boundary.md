# Stage 6: Release Boundary

Status: Confirmed

This document defines the explicit release boundary for `0.6.0`.

## Version Position

`0.6.0` is the annotation organization release.

The release should improve how users classify, filter, review, and manually hand off annotation material without turning the plugin into an automatic writing, summary, or AI workflow tool.

## Included In `0.6.0`

### Annotation Type

- Add a lightweight annotation type field.
- Supported types are Excerpt, Question, Thought, and Task.
- New annotations default to Excerpt when unchanged.
- Type selection is optional in the creation flow.
- Existing annotations without type display as Excerpt.
- Creation toolbar and sidebar cards both expose a type dropdown.

### Annotation Tags

- Add optional user-defined annotation tags.
- Tags are edited from sidebar cards.
- Tags use a chip plus input UI.
- Tags support autocomplete from already-used annotation tags.
- English tag matching is case-insensitive.
- Tags are stored in annotation metadata.

### Combined Filters

- Support status, type, tag, color, and keyword filters.
- Current-note sidebar and cross-note review both support combined filters.
- Different dimensions combine with AND logic.
- Multiple values inside one dimension combine with OR logic.
- Empty filters show all annotations available in the current surface.
- Filter state is remembered per surface during the current Obsidian session.
- One-click Clear filters resets only the current surface.

### Markdown Draft Copy

- Add `Copy draft` to the current-note sidebar.
- Add `Copy draft` to the cross-note review page.
- Copy the current filtered result set to the clipboard.
- Group copied output by source document.
- Include active, resolved, and orphaned annotations when present in the filtered result set.
- Preserve source material and metadata without summarizing or rewriting.

### UI Copy And Verification

- Add confirmed Chinese and English UI copy.
- Follow the confirmed implementation order.
- Verify with the acceptance checklist, code review checklist, and test cases.

## Out Of Scope For `0.6.0`

These items are deferred for this release but are not necessarily permanently excluded:

- Saved views or saved filters.
- Timeline or date-based filters.
- Source-document writing workflow integration.
- Save-to-file behavior for Markdown drafts.
- Manual multi-select for draft copying.
- Template management for Markdown draft output.
- Multiple Markdown draft templates.
- Automatic grouping by topic.

## Permanently Excluded

These items should not be implemented in `0.6.0` or later versions unless the product direction is explicitly reopened:

- Automatic summary generation.
- AI-generated conclusions.
- Automatic rewrite of annotation material.
- Annotation collections.
- Review queues.
- Review priority or importance fields.
- Semantic color categories.
- Automatic task management behavior from Task type.

## Preserved As Discussion Only

The `thought-distillation` bridge remains a discussion topic.

For `0.6.0`, the plugin may produce Markdown draft material that the user can manually use in a later explicit `thought-distillation` request, but the plugin should not:

- invoke `thought-distillation` automatically;
- claim copied drafts are distilled content;
- create or update distillation records;
- write AI supplement sections into source documents.

## Storage Boundary

`0.6.0` should add optional metadata only.

- Do not require a major sidecar schema migration.
- Do not batch-rewrite existing annotations just to add type or tag fields.
- Do not change anchor behavior unless required for compatibility with existing rendering.

## Performance Boundary

`0.6.0` should not add background full-vault indexing.

Filtering and tag suggestions should use already-loaded or explicitly available annotation metadata from the relevant current-note or cross-note review context.

## Undecided Items

No open decisions for the release boundary.
