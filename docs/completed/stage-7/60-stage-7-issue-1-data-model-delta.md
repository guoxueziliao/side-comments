# Stage 7 Issue 1: Data Model And Export Delta

Status: Confirmed

## Scope

Stage 5 confirmed:

- JSON export format identifier `side-comments-export` at format version `1` (`28-stage-5-import-export.md`).
- Markdown export should include `selected text`, `comment content`, `status`, `type`, `color`, `original context`, and `timestamps`.

Stage 6 added `annotationType` (`excerpt`, `question`, `thought`, `task`) and user-defined `tags` to the sidecar data model. Stage 6.5 decoupled mark type from color, so "type" in the Stage 5 doc is now ambiguous between mark type and annotation type.

This issue resolves three deltas before any export, import, or health-check work begins.

## Decision 1: JSON Export Schema Bumps To `v2`

The JSON export format version increases from `1` to `2`.

Version `2` adds two annotation-level fields:

- `annotationType`: one of `excerpt`, `question`, `thought`, `task`.
- `tags`: array of normalized tag strings; may be empty.

All other Stage 5 fields stay unchanged.

The format identifier `side-comments-export` is unchanged. Only the `exportFormatVersion` field bumps.

Exporters write `v2` exclusively. Importers read both `v1` and `v2`. When an importer reads `v1`, missing fields are filled with the default values described in Decision 3.

## Decision 2: Markdown Export Splits "type" Into Four Fields

Markdown export entries replace the single "type" line with four labeled fields, in this fixed order:

- `Mark`: one of `highlight`, `underline`, `strikethrough`, `note` (Stage 6.5 mark types).
- `Annotation type`: one of `excerpt`, `question`, `thought`, `task`.
- `Color`: one of the five Stage 1 color names.
- `Tags`: comma-separated tag list; omitted when empty.

Existing Stage 5 fields (`selected text`, `comment content`, `status`, `original context`, `timestamps`, orphaned marker) stay unchanged. The internal fields excluded by Stage 5 (`hash`, sidecar path, offsets, line, column, schema version, cache keys) remain excluded.

This decision affects only the Markdown export. JSON export keeps every field on each annotation object.

## Decision 3: Import V1 Backward Compatibility Uses Silent Defaults

When an importer reads a `v1` export package, each annotation receives:

- `annotationType` = `excerpt`.
- `tags` = `[]`.

The defaults match the lazy sidecar migration already used by the plugin when reading older sidecar files without these fields.

The import preview (Issue 2) labels these annotations with a small `Defaulted` badge so the user can see which annotations were back-filled before confirming the import. No per-annotation manual selection is required.

`v1` exports are not rejected. They are upgraded on read and written to disk as `v2` sidecars after the user confirms the import.

## Downstream Effects

- The exporter module gains a `formatVersion: 2` constant and writes both new fields.
- The importer module gains a `v1` read path with default-fill logic.
- The Markdown exporter rewrites its per-annotation template to include the four labeled fields.
- The health check (Issue 3) detects `exportFormatVersion` mismatches by recognizing both `1` and `2` as valid and warning on any other value.

## Out Of Scope

- Format version `3` or any further field additions in `0.7.0`.
- A schema-version negotiation prompt during import.
- Format conversion tools that rewrite `v1` packages to `v2` outside the import flow.
- CSV export.
