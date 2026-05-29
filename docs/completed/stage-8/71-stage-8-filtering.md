# Stage 8: Filtering

Status: Confirmed

## Scope

This document defines filtering after Stage 8 removes fixed annotation types and makes mark-only annotations visible in the sidebar.

Filters apply to both the current-document sidebar and the cross-note overview unless an implementation note says otherwise.

## Removed Filter

The annotation type filter is removed.

Removed fixed values:

- `摘录 / Excerpt`
- `问题 / Question`
- `想法 / Thought`
- `任务 / Task`

The UI should not expose annotation type as a filter after `0.8.0`.

## Confirmed Filter Dimensions

Stage 8 keeps these filters:

- Status.
- Visual mark.
- Color.
- Tags.
- Keyword.
- Note state.

## Status Filter

Values:

- All.
- Active.
- Resolved.
- Orphaned.

This continues the existing workflow-state filter.

## Visual Mark Filter

Values:

- All.
- Highlight.
- Underline.
- Strikethrough.
- No visible mark.

`No visible mark` means a pure note/comment annotation represented internally by the compatibility `note` mark type.

## Color Filter

Values:

- All.
- Yellow.
- Blue.
- Red.
- Green.
- Purple.

Color remains a visual marker only. It does not become semantic classification.

## Tag Filter

Tags remain user-defined.

Rules:

- Multiple selected tags match include-any.
- Tag matching stays case-insensitive for English text.
- Tags are still stored in annotation metadata, not Markdown body.

## Keyword Filter

Keyword search should match annotation-derived fields only:

- selected source text;
- note content;
- tags;
- source document path or name in cross-note overview.

It should not search the full Markdown document body.

## Note State Filter

Values:

- All.
- Has note.
- No note.

This filter is added because Stage 8 makes mark-only annotations visible by default.

Use cases:

- `Has note`: show only annotations with user-written note content.
- `No note`: show pure visual marks without note content.

Whitespace-only notes should count as no note.

## Cross-Note Overview Default

The cross-note overview should show mark-only annotations by default.

Reason:

- The current-document sidebar and cross-note overview should both behave as annotation management surfaces.
- Mark-only highlights, underlines, and strikethroughs are still user-created annotations.

The note-state filter is the main control for narrowing the overview:

- `All`: shows mark-only, note-only, and mark-and-note annotations.
- `Has note`: shows only note-bearing annotations.
- `No note`: shows mark-only annotations.

`Copy draft` remains separate from overview visibility. Even when mark-only annotations are visible in the overview, they are not copied into Markdown drafts.

## Combination Semantics

Different filter dimensions combine with AND.

Multiple values inside the same dimension combine with OR where a dimension supports multi-select. In Stage 8, tag filtering keeps include-any semantics.

Empty filters show all annotations.

## Out Of Scope

- Saved views or saved filters.
- Timeline or date filters.
- Review queues.
- Priority or importance.
- Full-vault Markdown content search.
