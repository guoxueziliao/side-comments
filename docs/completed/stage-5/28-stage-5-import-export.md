# Stage 5: Import and Export

Status: Confirmed

## Goal

Define the export and import behavior for `0.5.0`.

## Confirmed Export Scope

`0.5.0` should support these export scopes:

- current note annotations;
- user-selected note annotations;
- all sidecar metadata.

`0.5.0` should not include recent-cache export. Recent-cache scope is useful for cross-note review loading, but export should stay explicit and user-controlled.

## Confirmed Export Formats

`0.5.0` should support two export formats:

- JSON;
- Markdown.

JSON is the primary backup, migration, and restore format. JSON exports should preserve enough structured data for later import.

Markdown is a human-readable review and sharing format. Markdown exports are not importable.

`0.5.0` should not add CSV export. CSV can be reconsidered later if a clear table-oriented workflow appears.

## Confirmed JSON Export Package

JSON exports should use an explicit export package structure instead of exporting a raw sidecar array.

The top-level package should include:

- export format identifier;
- export format version;
- plugin version;
- export time;
- export scope;
- optional vault metadata;
- document entries.

The initial format identifier should be `side-comments-export`, and the initial export format version should be `1`.

Each document entry should include:

- source Markdown file path;
- sidecar path;
- sidecar schema version;
- comment list;
- export-time statistics such as active, resolved, and orphaned counts.

Comment data should preserve the original sidecar fields as completely as practical. Export should avoid lossy transformation so that later import, migration, and debugging remain possible.

## Confirmed Markdown Export

Markdown exports are human-readable summaries for review and sharing.

Markdown exports should be grouped by source document and should include:

- source document path;
- export time;
- total annotation count;
- active, resolved, and orphaned counts;
- selected text;
- comment content;
- status;
- type;
- color;
- original context when available;
- timestamps when available;
- a clear orphaned marker for unresolved comments.

Markdown exports should not include internal fields such as:

- hash;
- sidecar path;
- offset;
- line;
- column;
- schema version;
- internal cache keys.

## Confirmed Import Behavior

`0.5.0` import should be a controlled restore-and-merge flow, not an overwrite sync flow.

Import should:

- accept only JSON files exported by this plugin;
- show a preview before any write;
- back up the target sidecar before writing;
- merge missing annotations by default instead of overwriting existing data;
- flag likely duplicate annotations as conflicts instead of silently replacing them;
- reject Markdown files as import sources;
- support restore to the original path and import into the current document.

Import should not attempt full-vault synchronization or silent destructive replacement.

## Out Of Scope Until Confirmed

- Automatic destructive cleanup;
- Silent sidecar rewriting across the full vault;
- Full-vault migration without explicit user action;
- Cloud sync or remote storage;
- AI summary or automatic analysis;
- Batch path remapping across unrelated vaults.
