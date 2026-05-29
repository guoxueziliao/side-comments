# Stage 8 Code Review Checklist

Status: Confirmed

This checklist defines the main implementation risks to review before `0.8.0` is released.

## Data Interpretation

- Product-state interpretation has one shared entry point or helper.
- Mark-only, note-only, mark-and-note, and invalid-empty states are not reimplemented independently in multiple UI surfaces.
- Legacy `annotationType` is treated as compatibility data only.
- Existing `mark.type = "note"` with note content maps to note-only consistently.
- Existing `mark.type = "note"` without note content maps to invalid empty annotation data consistently.
- Highlight, underline, and strikethrough without note content map to mark-only consistently.
- Highlight, underline, and strikethrough with note content map to mark-and-note consistently.
- Legacy purple or comment-like styling is not given a special semantic branch.
- No code path batch-migrates sidecars only to satisfy Stage 8.

## UI Exposure

- No selection toolbar surface shows fixed annotation type controls.
- No advanced create modal surface shows fixed annotation type controls.
- No current-document card surface shows fixed annotation type labels.
- No cross-note overview surface shows fixed annotation type labels.
- No filter surface shows annotation type.
- No user-facing notice depends on annotation type.
- Any remaining `annotationType` references are isolated to compatibility, import, export, or tests.

## State Transitions

- Add note to mark-only updates the existing annotation.
- Add mark to note-only updates the existing annotation.
- Remove mark from mark-and-note keeps the note and produces note-only.
- Delete note from mark-and-note keeps the mark and produces mark-only.
- Remove mark from mark-only deletes the annotation rather than leaving an empty record.
- Delete note from note-only deletes the annotation rather than leaving an empty record.
- Delete card deletes the whole annotation and does not call partial mark/note removal logic by accident.
- Confirmation behavior is used where the user could lose the only remaining mark or note.
- No write path can persist an annotation with neither visible mark nor note content unless it is explicitly legacy invalid data being reported.

## Duplicate Selection

- Duplicate detection runs before creating a new annotation record.
- Same selected range plus same visual mark focuses or updates the existing annotation instead of creating a duplicate.
- Same selected range with mark-only plus new note becomes mark-and-note.
- Same selected range with note-only plus new mark becomes mark-and-note.
- Same selected range with mark-and-note plus mark or color change updates the existing annotation.
- Stage 8 does not add support for multiple independent notes on the same anchor.
- Duplicate behavior is the same in source mode and reading mode where selection mapping succeeds.

## Rendering

- Source mode and reading mode use the same interpreted product state.
- Mark-only and mark-and-note use the same visual mark rendering path where practical.
- Note-only rendering uses a lightweight indicator and does not borrow highlight-style background behavior.
- Hide annotation marks hides highlight, underline, strikethrough, and note-only indicators.
- Hide annotation marks does not hide sidebar cards or delete annotation data.
- Resolved and orphaned rendering still works after mark/note simplification.
- Decoration cleanup prevents stale marks after edit, delete, resolve, rebind, or hide/show toggles.

## Sidebar And Cross-Note Views

- Current-document sidebar includes mark-only annotations by default.
- Cross-note overview includes mark-only annotations by default.
- Mark-only cards do not show empty-note placeholder text.
- Note-only cards do not imply a visible mark.
- Mark-and-note cards expose both visual mark and note editing paths.
- Orphaned cards keep rebind as the primary recovery action.
- Card body and jump action both navigate to source text when possible.
- Current-document and cross-note card summaries use the same mark/note vocabulary.

## Filters

- Current-document filters and cross-note filters use the same filter semantics.
- Annotation type filter is removed from current-document filters.
- Annotation type filter is removed from cross-note filters.
- Visual mark filter supports highlight, underline, strikethrough, and no visible mark.
- Note state filter supports all, has note, and no note.
- Keyword filter searches annotation-derived fields only.
- Keyword filter does not accidentally become full Markdown body search.
- Removed annotation type filters do not leave stale persisted settings that break view loading.

## Import, Export, And Health Check

- JSON export preserves legacy `annotationType` where it exists.
- JSON import accepts `annotationType` without surfacing it in UI.
- Markdown export omits annotation type.
- Markdown draft copy omits annotation type.
- Markdown draft copy excludes mark-only annotations.
- Health check does not flag present `annotationType`.
- Health check does not flag missing `annotationType`.
- Health check reports invalid empty annotation data after Stage 8 interpretation.
- Health check reporting is read-only unless the user explicitly invokes a repair action.

## i18n And Copy

- Simplified Chinese UI no longer exposes `摘录`, `问题`, `想法`, `任务`, or `批注类型` as annotation type controls.
- English UI no longer exposes `Excerpt`, `Question`, `Thought`, `Task`, or `Annotation type` as annotation type controls.
- New labels use the confirmed vocabulary: `标记`, `备注`, `批注`.
- New labels use the confirmed vocabulary: `Mark`, `Note`, `Annotation`.
- `无标记`, `有备注`, and `无备注` are used consistently.
- `No visible mark`, `Has note`, and `No note` are used consistently.
- Any retained legacy translation keys are either removed from user-facing code or documented as compatibility-only.

## Non-Goals

- No saved views or saved filters.
- No review queues.
- No priority or importance field.
- No automatic AI summary, classification, rewrite, or repair suggestion.
- No full-vault Markdown body search.
- No schema-breaking sidecar cleanup.
- No support for multiple independent notes on the same anchor.
