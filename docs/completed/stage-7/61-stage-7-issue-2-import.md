# Stage 7 Issue 2: Import Preview, Merge, And Backup

Status: Confirmed

## Scope

Stage 5 confirmed the import semantics in `28-stage-5-import-export.md`:

- accept only JSON exports of this plugin;
- show a preview before any write;
- back up the target sidecar before writing;
- merge missing annotations by default;
- flag duplicates as conflicts;
- support restore-to-original-path and import-into-current-document.

Stage 5 did not decide the UI form, the preview layout, or the backup file location and naming. This issue settles those three.

## Decision 1: Preview Lives In An Obsidian Modal

The import preview UI is an Obsidian `Modal`. It opens from the settings `Data maintenance` group import button.

Modal structure (top to bottom):

- File picker at the top: select a JSON file, or paste a path.
- Scope selector: `Restore to original paths` or `Import into current document`. Defaults to `Restore to original paths` for full exports; defaults to `Import into current document` when the export is a single-note scope.
- Preview body: per-document grouped list (see Decision 2).
- Footer: `Cancel` and `Confirm import` buttons. Confirm is disabled until a valid file is loaded.

Reason for modal over a leaf view: import is a one-shot mutation. A modal closes after confirm or cancel and does not leave a persistent navigation surface.

## Decision 2: Preview Body Groups By Source Document With A Count Summary

The preview body has two parts:

- Top summary row: `New N · Skipped N · Conflict N · Defaulted N · Sources N documents`.
- Per-document accordion list. Each row shows source document path and per-document badge counts. Clicking a row expands it to show the annotation list under that document.

Each annotation row in the expanded view shows:

- Status badge: `New`, `Skipped`, `Conflict`, or `Defaulted`.
- Selected text (truncated to 80 characters).
- Comment text (truncated to 80 characters).
- Mark icon and color dot.

Stage 6.5 chip-row visuals and Stage 6.5 card meta-row visuals are reused where applicable.

Default state is all groups collapsed. The summary row is enough to confirm the import for typical cases.

## Decision 3: Backups Go To `.obsidian-side-comments/.backups/`

The plugin creates a backup of every sidecar that the import touches before any write.

Path structure:

- `.obsidian-side-comments/.backups/<timestamp>-import/<original-relative-path>.json`
- `<timestamp>` is `YYYYMMDD-HHmmss` in local time.
- `<original-relative-path>` mirrors the path of the original Markdown file relative to the vault root.

The backup folder structure is identical to the import set so a manual rollback is a folder copy.

Backups are kept indefinitely. `0.7.0` does not auto-delete or rotate them. A manual "clear backups" action is deferred to a later stage.

## Downstream Effects

- A shared backup module under `src/storage/backup.ts` (or equivalent) handles directory creation and file write. The same module is reused by Issue 4 repair tools.
- The import code path always writes a `v2` sidecar after confirm. `v1` data is upgraded on the way in (Issue 1 Decision 3).
- i18n keys promoted out of orphan in this step: `import.chooseFile`, `import.preview`, `import.confirm`, `import.restoreOriginalPath`, `import.intoCurrentNote`, `import.invalidFile`, `import.success`, `import.failed`.

## Out Of Scope

- Markdown file import.
- Cross-vault path remapping during import.
- Multi-select per-annotation choice in the preview ("skip this one only").
- A confirmation step beyond the modal `Confirm import` button. Backup, merge, and flag-conflict semantics already cover the safety case.
