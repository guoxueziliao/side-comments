# Stage 6: Acceptance Checklist

Status: Confirmed

This document defines completion checks for `0.6.0`.

## Metadata Compatibility

- Existing annotations without type fields still load.
- Existing annotations without tag fields still load.
- Missing type displays as Excerpt.
- Missing tags display as no tags.
- Existing annotations are not batch-migrated during normal load.
- Type and tags are written when a new annotation is created or an existing annotation is edited.

## Annotation Types

- New annotations default to Excerpt when the user does not choose a type.
- Creation toolbar exposes a compact type dropdown.
- Sidebar cards expose the same type dropdown for editing.
- Supported types are Excerpt, Question, Thought, and Task.
- Task type does not create task-management behavior.
- Type filters work in the current-note sidebar.
- Type filters work in the cross-note review page.

## Tags

- Sidebar cards allow adding tags.
- Sidebar cards allow removing tags.
- Tags are not shown in the creation floating toolbar.
- Tags are saved in annotation metadata.
- Tags are not automatically written into Markdown body text.
- Tags are not automatically synchronized with Obsidian native tags.
- Tag autocomplete only suggests already-used annotation tags.
- English tag matching is case-insensitive.
- Tag filtering uses include-any behavior for multiple selected tags.

## Combined Filters

- Current-note sidebar supports filters for status, type, tag, color, and keyword.
- Cross-note review supports filters for status, type, tag, color, and keyword.
- Different dimensions combine with AND logic.
- Multiple values inside one dimension combine with OR logic.
- Empty filters show all annotations in the current surface.
- Filter state is remembered separately for current-note sidebar and cross-note review during the current Obsidian session.
- Filter state is not persisted across Obsidian restarts.
- `Clear filters` resets only the current surface.
- Keyword filtering searches annotation-derived fields, not the full Markdown body.

## Markdown Draft Copy

- Current-note sidebar exposes `Copy draft`.
- Cross-note review exposes `Copy draft`.
- The action copies the current filtered result set to the clipboard.
- Manual multi-select is not required.
- Output is grouped by source document.
- Output includes active, resolved, and orphaned annotations when they are present in the filtered result set.
- Each output entry includes source text, note, status, type, tags, color, source document link, and position or anchor reference when available.
- Empty result sets show a clear no-annotations-to-copy message.
- Copy success and failure notices use confirmed UI copy.

## Explicit Non-Goals

- No automatic summary generation.
- No AI-generated conclusions.
- No automatic rewrite.
- No automatic `thought-distillation` invocation.
- No saved views or saved filters.
- No timeline or date-based filters.
- No review queues or annotation collections.
- No priority or importance field.
- No semantic color categories.
- No source-document writing workflow integration.
- No save-to-file behavior for Markdown drafts.

## Documentation

- Stage 6 overview links every Stage 6 detail document.
- `docs/README.md` links every Stage 6 detail document.
- `docs/core/02-roadmap.md` reflects confirmed `0.6.0` scope and exclusions.
- Markdown relative link check passes.

## Undecided Items

No open decisions for the acceptance checklist.
