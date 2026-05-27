# Stage 7 Issue 4: Repair Tools UI

Status: Confirmed

## Scope

Stage 5 confirmed in `30-stage-5-repair-tools.md`:

- manual orphaned annotation repair using the rebind flow;
- manual duplicate annotation handling using the group-based flow;
- repair tools must be confirmation-based; no automatic destructive cleanup.

Stage 5 did not settle the entry points, the duplicate group UI form, or the backup convention shared with the import flow.

## Decision 1: Orphaned Repair Has Two Entry Points

The two entry points for orphaned annotation rebind are:

- The sidebar card for an orphaned annotation, in its overflow menu: `Rebind to selection`.
- The health check report row for an orphaned anchor, in its `Suggested action` row: `Rebind to selection`.

The settings `Data maintenance` group does not get a third independent repair surface. It gets a single button `Open health check (orphaned only)` that opens the health view filtered to orphaned-anchor issues. This keeps repair grounded in either the in-context card or the report.

Rebind flow (unchanged from Stage 5 `30-stage-5-repair-tools.md`):

1. Plugin opens the source document.
2. Sidebar shows the orphaned annotation, original selected text, original context, and orphaned status.
3. User selects new target text in the document body.
4. User clicks `Rebind to selection`.
5. Preview modal shows original text, new text, and affected annotation.
6. User confirms.
7. Plugin backs up the old sidecar (Decision 3) and writes the new anchor.
8. Annotation status changes from `orphaned` to `active`.

## Decision 2: Duplicate Groups Expand Inline With A Confirm Modal

Duplicate annotation handling lives entirely inside the health check view. There is no separate repair view or repair queue.

Each duplicate-group row in the health report is collapsed by default. Clicking expands it to show:

- All annotations in the group, each as a sub-card showing source document, selected text, comment text, status, timestamp, and anchor information.
- An action row: `Keep all`, `Merge comments`, `Delete selected`.

Action behavior:

- `Keep all` collapses the group without writing.
- `Merge comments` opens a preview modal that lets the user choose a primary annotation and edit the merged comment text. Confirming writes the merged annotation and removes the others.
- `Delete selected` requires the user to tick which sub-cards to delete (checkboxes appear only after clicking this action). After ticking, a confirm modal shows the deletion list. Confirming writes.

All write paths back up the affected sidecars (Decision 3) before writing.

## Decision 3: Missing Source Cleanup Is Manual And Confirmed

When a health check row reports `Missing source`, the plugin cannot rebind the annotation because there is no source document to select from.

The user has two valid choices:

- restore or rename the source document back to the stored path, then re-run health check;
- if the source document was intentionally deleted, click `Clean up annotation data`.

Cleanup behavior:

1. Plugin shows a confirmation prompt with the missing source path.
2. On confirm, plugin creates a backup of the missing document's sidecar.
3. Plugin removes that sidecar from `.obsidian-side-comments/files/`.
4. Plugin removes that document from recent preview cache.
5. Plugin refreshes the health report; the `Missing source` row disappears.

This is a single-row cleanup action, not a bulk cleanup tool. There is no automatic destructive cleanup and no startup cleanup.

## Decision 4: Backups Reuse The Import Backup Folder Layout

All repair writes use the same backup module Issue 2 introduces.

Path structure:

- `.obsidian-side-comments/.backups/<timestamp>-<operation>/<original-relative-path>.json`
- `<operation>` is `rebind` for orphaned annotation repair, `dedup` for duplicate handling, and `cleanup` for confirmed missing-source cleanup.

A single repair action that touches multiple sidecars creates one timestamped folder with all affected sidecars inside it, so a manual rollback is one folder copy.

Backups are kept indefinitely. Same retention policy as Issue 2.

## Downstream Effects

- The sidebar card overflow menu (Stage 6.5 Issue 3) gains the `Rebind to selection` item when the card status is `orphaned`. The item is hidden otherwise.
- The shared backup module from Issue 2 handles repair writes too.
- i18n keys promoted out of orphan in this step: `repair.orphaned`, `repair.duplicates`, `repair.rebindToSelection`, `repair.previewChange`, `repair.confirmChange`, `repair.keepAll`, `repair.mergeComments`, `repair.deleteSelected`, `repair.cleanupMissingSource`, `repair.cleanupMissingSourceConfirm`, `repair.cleanupMissingSourceSuccess`.

## Out Of Scope

- Automatic similarity-based rebinding.
- Bulk anchor rewriting.
- One-click cleanup of all duplicates.
- A separate repair view tab.
- Repair history or rollback UI inside the plugin. Manual rollback uses the backup folder.
