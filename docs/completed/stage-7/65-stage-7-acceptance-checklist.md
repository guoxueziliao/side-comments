# Stage 7 Acceptance Checklist

Status: Confirmed

This checklist defines what must be verifiable in a test vault before `0.7.0` is released.

## Data Layer

- [ ] JSON export of a current note produces a file with `exportFormatVersion: 2`.
- [ ] Each annotation object in the JSON export contains `annotationType` and `tags` fields.
- [ ] Markdown export of a current note shows four labeled fields per annotation: `Mark`, `Annotation type`, `Color`, `Tags`.
- [ ] `Tags` row is omitted when an annotation has no tags.
- [ ] Importing a hand-edited `v1` JSON file (without `annotationType` and `tags`) succeeds and applies defaults.
- [ ] After importing a `v1` file and accepting the merge, the resulting sidecar is `v2`.

## Import

- [ ] Settings `Data maintenance` group has a working `Import` button that opens the import modal.
- [ ] The modal file picker accepts a JSON file and rejects a Markdown file with a clear error.
- [ ] Preview shows `New · Skipped · Conflict · Defaulted · Sources` counts at the top.
- [ ] Per-document accordion expands to show each annotation with status badge, mark icon, color dot, selected text, and comment text.
- [ ] Confirming creates a backup folder under `.obsidian-side-comments/.backups/<timestamp>-import/`.
- [ ] Cancelling does not create a backup and does not write any sidecar.
- [ ] `Restore to original paths` correctly writes each annotation to the sidecar matching its source document path.
- [ ] `Import into current document` correctly writes all annotations to the current document's sidecar.

## Health Check

- [ ] Settings `Data maintenance` group has a working `Run health check` button that opens a scope picker.
- [ ] Command palette has a `Side Comments: run health check on current note` command.
- [ ] The view tab opens with overview, category sections, and issue rows.
- [ ] Severity chips show counts and toggle row visibility independently.
- [ ] Clicking an issue row opens the source document and scrolls to the annotation with a highlight pulse.
- [ ] Re-running replaces the existing report in the same view tab.
- [ ] Categories with zero issues are still rendered with a clear empty state instead of being hidden.
- [ ] Issue rows for missing source documents show `Missing source`, explain restore-or-cleanup options, and do not throw on click.

## Repair

- [ ] Orphaned annotation card overflow menu shows `Rebind to selection`.
- [ ] Orphaned health report rows show `Suggested action: Rebind to selection`.
- [ ] Rebind preview modal shows original text and new text before write.
- [ ] After confirm, the annotation status changes from `orphaned` to `active` and a backup folder `.backups/<timestamp>-rebind/` exists.
- [ ] Duplicate group rows expand inline to show all annotations in the group.
- [ ] `Keep all` collapses the group without writing.
- [ ] `Merge comments` opens a preview modal allowing primary selection and text editing, then writes one annotation and removes the others.
- [ ] `Delete selected` shows checkboxes, then a confirm modal, then writes.
- [ ] Missing-source rows can clean up annotation data only after confirmation, and the row disappears after the report refreshes.
- [ ] All repair writes create a `<timestamp>-rebind`, `<timestamp>-dedup`, or `<timestamp>-cleanup` backup folder.
- [ ] Settings `Data maintenance` `Open health check (orphaned only)` button opens the health view filtered to orphaned anchors.

## i18n And Settings

- [ ] All Stage 5 orphan i18n keys are now bound to UI (Import, Health, Repair).
- [ ] The file-header orphan-keys comment introduced in Stage 6.5 is removed for Import, Health, and Repair sections.
- [ ] Switching the language setting (Stage 6.5) between Simplified Chinese and English correctly updates all new copy.

## Release

- [ ] `manifest.json`, `package.json`, and `versions.json` all show `0.7.0`.
- [ ] `npm run typecheck` and `npm run build` both pass.
- [ ] Release folder contains `main.js`, `manifest.json`, and `styles.css`.
- [ ] CHANGELOG contains a `0.7.0 - Data Maintenance Build-out` section.
- [ ] All annotations created in `0.6.x` still load and render after upgrade.
