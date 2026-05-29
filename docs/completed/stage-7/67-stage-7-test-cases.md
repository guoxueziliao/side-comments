# Stage 7 Test Cases

Status: Confirmed

These cases combine unit, integration, and manual checks. They are organized by surface.

## Data Layer

### T-DL-1: v2 JSON Export Round-Trip

1. Create three annotations in a test note: one excerpt (with two tags), one question (no tags), one task (one tag).
2. Run `Export current note → JSON`.
3. Open the exported file. Confirm `exportFormatVersion: 2` and `annotationType`, `tags` fields on each annotation.
4. Delete the sidecar.
5. Run `Import` and pick the export file. Confirm preview shows 3 new annotations.
6. Confirm the import. Reload the note. All three annotations show with their original type and tags.

### T-DL-2: v1 Import Default-Fill

1. Hand-edit a JSON file: set `exportFormatVersion: 1`, remove `annotationType` and `tags` from each annotation object.
2. Run `Import`. Preview shows `Defaulted N` count matching annotation count.
3. Each annotation row shows the `Defaulted` badge.
4. Confirm import. New sidecar is `v2` and annotations carry `annotationType: excerpt` and `tags: []`.

### T-DL-3: Markdown Export Four Fields

1. Export current note as Markdown.
2. Open the Markdown file. Each annotation entry shows `Mark`, `Annotation type`, `Color` lines. `Tags` line appears only for tagged annotations.

## Import

### T-IMP-1: Rejecting Markdown File

1. Open the import modal. Pick a `.md` file. The modal shows the `Only JSON export files can be imported` error and disables the Confirm button.

### T-IMP-2: Cancel Does Not Write

1. Open the import modal. Pick a valid file. See the preview. Click Cancel.
2. Confirm no `.backups/<timestamp>-import/` folder was created and no sidecar was modified.

### T-IMP-3: Per-Document Grouping

1. Import a multi-document export. Preview body shows N grouped rows.
2. Click one row. The expanded view shows all annotations under that document with status badges.
3. Collapse and confirm. Backup folder mirrors the document structure under `.backups/<timestamp>-import/`.

## Health Check

### T-HC-1: Current-Note Scan

1. Vault contains: one note with a duplicate-anchor pair, one note with an orphaned anchor.
2. Open the second note. Run `health check on current note` from the command palette.
3. The view shows one issue under `Orphaned anchors`, zero under others.

### T-HC-2: Full-Vault Scan

1. Same setup as T-HC-1.
2. From settings, run `Run health check → All sidecars`.
3. The view shows both issues, each in its category.

### T-HC-3: Click Navigation

1. From a populated report, click an issue row.
2. The source document opens. The viewport scrolls so the annotation is visible. The annotation flashes with a brief highlight pulse.

### T-HC-4: Chip Filtering

1. Toggle off the `Warning` chip. All warning rows disappear. Category headers update their counts.
2. Toggle it back. Rows reappear.

### T-HC-5: Missing Source Cleanup

1. Create an annotation in a note.
2. Delete the note, leaving its sidecar under `.obsidian-side-comments/files/`.
3. Run `Run health check → All sidecars`.
4. The report shows `Missing source` with a restore-or-cleanup suggested action.
5. Click `Clean up annotation data`, cancel once, and confirm the row remains.
6. Click it again and confirm. The report refreshes and the row disappears.
7. Backup folder `.backups/<timestamp>-cleanup/` exists with the previous sidecar.

## Repair

### T-RP-1: Sidebar Rebind

1. Create an annotation. Edit the source text so the anchor goes orphaned.
2. Open the sidebar overflow menu on the orphaned card. Click `Rebind to selection`.
3. Select new text. Click `Rebind to selection` from the card or the toolbar (per Stage 5 doc).
4. Preview modal shows old and new text. Confirm.
5. Annotation returns to `active`. Backup folder `.backups/<timestamp>-rebind/` exists with the previous sidecar.

### T-RP-2: Report Rebind

1. Same orphaned annotation as T-RP-1.
2. Run health check. Click `Suggested action: Rebind to selection` on the orphaned row.
3. Same flow as T-RP-1 from step 3.

### T-RP-3: Duplicate Keep All

1. Create two annotations with identical selected text and identical comment.
2. Run health check. Expand the duplicate group. Click `Keep all`.
3. The group collapses. No backup folder is created. The sidecar is unchanged.

### T-RP-4: Duplicate Merge Comments

1. Two duplicate annotations with different comment text.
2. Expand the group. Click `Merge comments`.
3. Preview modal shows annotations. Pick one as primary. Edit merged comment text. Confirm.
4. Sidecar now has one annotation with the merged comment. Backup folder `.backups/<timestamp>-dedup/` exists.

### T-RP-5: Duplicate Delete Selected

1. Three duplicate annotations.
2. Expand group. Click `Delete selected`. Checkboxes appear. Tick two.
3. Confirm modal lists the two to delete. Confirm.
4. Sidecar has one annotation. Backup contains the pre-delete sidecar.

## Non-Goals

### N-1: No Automatic Background Scan

1. Open Obsidian with the plugin enabled. Wait two minutes.
2. Confirm no health check view appears on its own. The plugin makes no notifications about data quality without a user trigger.

### N-2: No Backup Auto-Cleanup

1. Create five backups across the day.
2. Restart Obsidian. Confirm all five backup folders are still present.

### N-3: No Multi-Vault Path Rewrite

1. Take a JSON export from one vault, change the vault root, try to import.
2. Source documents that do not match the vault path show in preview as `Missing source` and import does not create dangling sidecars.

## Manual Verification

- Switch language between Simplified Chinese and English. All new copy updates correctly.
- Import a large export (more than 200 annotations across more than 10 documents). Confirm the modal stays responsive.
- Run health check on an empty vault. Confirm a meaningful "no issues found" state.
- Open the backups folder in the filesystem. Confirm one folder copy successfully restores prior sidecar state when manually copied back.
