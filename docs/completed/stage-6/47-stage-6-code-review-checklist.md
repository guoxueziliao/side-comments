# Stage 6: Code Review Checklist

Status: Confirmed

This document defines review checks for `0.6.0` implementation.

## Storage And Compatibility

- New type and tag fields are optional.
- Existing sidecar data loads without requiring migration.
- Missing type is interpreted as Excerpt in UI and filter logic.
- Missing tags are interpreted as an empty tag list.
- Existing annotations are not rewritten merely because the plugin loaded them.
- Type and tags are only written when creating or editing annotations.
- Export, import, health check, and repair tools still preserve or tolerate the new optional fields.

## Annotation Type UI

- Creation toolbar still supports fast annotation creation without forcing type selection.
- Type dropdown defaults to Excerpt.
- Sidebar type changes persist correctly.
- Type labels come from the translation layer.
- Task type does not introduce task-management behavior.
- Type values are stored as stable internal IDs, not localized labels.

## Tags

- Tag chip UI handles add and remove without corrupting other annotation fields.
- Empty tag input does not create blank tags.
- Duplicate tags on the same annotation are prevented after normalization.
- English tag matching is case-insensitive.
- Display can preserve original casing while matching uses normalized values.
- Autocomplete suggestions only come from already-used annotation tags.
- Tags are not written into Markdown body text.
- Tags are not synchronized with Obsidian native tags.
- No tag management center or batch tag edit behavior is introduced accidentally.

## Filters

- Current-note and cross-note filters share the same matching semantics.
- Different filter dimensions combine with AND logic.
- Multiple selected values inside one dimension combine with OR logic.
- Empty filters show all annotations in the current surface.
- Tag filters use include-any behavior.
- Keyword filtering does not scan the full Markdown source body.
- Color filtering does not treat colors as semantic categories.
- Filter state is scoped per surface during the current session.
- Filter state is not persisted across restarts.
- `Clear filters` resets only the current surface.

## Markdown Draft Copy

- `Copy draft` copies the current filtered result set only.
- Manual multi-select is not added in the first version.
- Output is grouped by source document.
- Active, resolved, and orphaned annotations are included when present in the filtered result set.
- Orphaned annotations are clearly marked as orphaned.
- Output includes source text, note, status, type, tags, color, source document link, and position or anchor reference when available.
- Empty results show the confirmed empty message.
- Clipboard success and failure paths are handled.
- The implementation does not save files.
- The implementation does not mutate source documents.

## Explicit Non-Goals

- No automatic summary generation.
- No AI-generated conclusions.
- No automatic rewrite.
- No automatic `thought-distillation` invocation.
- No saved views or saved filters.
- No timeline or date-based filters.
- No annotation collections.
- No review queues.
- No priority or importance field.
- No semantic color categories.
- No source-document writing workflow integration.

## Internationalization

- All new visible strings go through the translation layer where practical.
- Chinese and English keys are complete.
- English fallback remains available.
- Localized labels are not used as stored enum values.

## Tests And Manual Verification

- Unit tests cover type defaults and missing fields.
- Unit tests cover tag normalization and duplicate prevention.
- Unit tests cover combined filter logic.
- Unit tests cover Markdown draft formatting.
- Manual checks cover current-note sidebar and cross-note review page.
- Manual checks cover copy failure behavior if clipboard access is unavailable.

## Undecided Items

No open decisions for the code review checklist.
