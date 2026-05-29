# Stage 8: Compatibility And Export Behavior

Status: Confirmed

## Scope

This document records how `0.8.0` handles legacy `annotationType` data after fixed annotation types are removed from the user-facing UI.

Stage 8 should simplify the product without breaking backups, imports, or older sidecar data produced before `0.8.0`.

## JSON Export

JSON export should keep legacy `annotationType` fields when they exist.

Reason:

- JSON export is a backup and restore format.
- Backup data should preserve old fields as completely as practical.
- Users may need to restore, transfer, or inspect data created before `0.8.0`.

New annotations created after `0.8.0` do not need to write meaningful annotation type values. If the current storage compatibility layer still carries a default internally, export may preserve that internal field for compatibility, but the UI should not present it as a product concept.

## JSON Import

JSON import should continue accepting `annotationType`.

Imported values:

- do not fail validation merely because `annotationType` exists;
- are preserved where practical;
- are not shown in the UI;
- are not used for filtering or display.

Missing `annotationType` should not be treated as a warning or error.

## Markdown Export

Markdown export should omit annotation type.

Markdown export is human-readable output. Since fixed annotation types are removed from the product UI, Markdown export should not keep displaying `Excerpt`, `Question`, `Thought`, or `Task`.

## Markdown Draft Copy

Copied Markdown drafts should omit annotation type.

Draft copy should focus on writing material:

- selected text;
- note content;
- tags;
- source document;
- anchor or position when useful.

It should not include fixed annotation type.

## Health Check

The health check should not treat `annotationType` as a data problem.

Rules:

- Existing `annotationType` is not an error.
- Missing `annotationType` is not an error.
- Unknown legacy `annotationType` values may be ignored or preserved as inert legacy data.

## Legacy Data Display Rules

Old sidecar data should be interpreted at read time. Do not batch-migrate existing sidecars only to fit the Stage 8 product model.

Confirmed rules:

- Legacy `annotationType` values are not displayed in the UI.
- Legacy `annotationType` values are kept only as compatibility data for JSON-oriented flows.
- Existing `mark.type = "note"` with note content is displayed as a note-only annotation: no visible mark plus note content.
- Existing `mark.type = "note"` without note content is treated as an invalid empty annotation and should be reported by health check.
- Existing highlight, underline, or strikethrough annotations without note content are displayed as mark-only annotations.
- Existing highlight, underline, or strikethrough annotations with note content are displayed as mark-and-note annotations.
- Legacy purple highlight or older comment-like visual styling is not treated as a special semantic type. It should display as a normal visual mark with its stored color.

Implementation should prefer read-time interpretation over destructive cleanup. Any later storage cleanup must be designed separately.

## Translation Keys

User-facing annotation type translations should be removed in `0.8.0`.

Remove or stop exposing UI copy for:

- `摘录 / Excerpt`
- `问题 / Question`
- `想法 / Thought`
- `任务 / Task`
- `批注类型 / Annotation type`

Compatibility code may continue reading and writing raw `annotationType` values in JSON, but it should not translate them into visible UI labels.

## Out Of Scope

- Batch-deleting `annotationType` from existing sidecars.
- Failing imports because old exports contain `annotationType`.
- Reintroducing fixed annotation type controls in the UI.
- Adding new semantic replacement categories.
