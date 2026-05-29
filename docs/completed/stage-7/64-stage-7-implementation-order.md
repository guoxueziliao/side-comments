# Stage 7 Implementation Order

Status: Confirmed

## Goal

Define the merge order for `0.7.0`. Each step keeps the codebase coherent: type-check and build pass at the end of every step, no orphan code, no orphan i18n keys.

The Stage 5 `31-stage-5-implementation-order.md` order is the historical baseline. This document supersedes it for `0.7.0` by collapsing the original ten steps into six and threading the Stage 6 / 6.5 deltas through them.

## Step 1: Data Layer

Implement Issue 1 in full.

- Bump JSON export `exportFormatVersion` to `2` in the exporter.
- Add `annotationType` and `tags` to each annotation object in JSON exports.
- Rewrite the Markdown export per-annotation template to use the four labeled fields (`Mark`, `Annotation type`, `Color`, `Tags`).
- Extend the importer to read both `v1` and `v2`. For `v1`, fill `annotationType = excerpt` and `tags = []`.

Verification:

- Round-trip an existing `v1` export through the importer and confirm defaults are applied.
- Confirm a fresh export from current data emits `v2` with both fields populated.
- Confirm the Markdown export shows all four fields in order.

## Step 2: Backup Module

Build the shared backup module that Issues 2 and 4 both depend on.

- Module location: `src/storage/backup.ts` (or similar).
- API: `createBackupBatch(operation, sidecarPaths) -> backupFolder` and `getBackupRoot()`.
- Folder layout: `.obsidian-side-comments/.backups/<timestamp>-<operation>/<original-relative-path>.json`.
- No retention policy. No automatic cleanup.

Verification:

- Manual test that a backup call produces the expected folder structure.
- Manual test that two backups in the same second still produce distinct folders. Timestamp granularity is seconds; if a collision is possible, the module appends `-1`, `-2`, ...

## Step 3: Import Modal

Implement Issue 2 in full.

- Add the `Data maintenance` group import button if not already present from the Stage 6.5 settings refactor.
- Build the import modal: file picker, scope selector, preview body, footer.
- Preview body: per-document accordion with summary row.
- Confirm write path uses the Step 2 backup module with operation `import`.
- Promote i18n keys: `import.chooseFile`, `import.preview`, `import.confirm`, `import.restoreOriginalPath`, `import.intoCurrentNote`, `import.invalidFile`, `import.success`, `import.failed`. Remove the file-header orphan-keys comment introduced in Stage 6.5 for these keys.

Verification:

- Import a `v1` export and confirm `Defaulted` badges appear.
- Import a `v2` export and confirm merge, skip, and conflict badges.
- Cancel the modal and confirm no sidecar was touched and no backup was created.

## Step 4: Health Check Report View

Implement Issue 3 in full.

- Register a new leaf view for the health report.
- Implement the scope picker modal for the settings entry point.
- Implement the command palette command for current-note scope.
- Implement the report body: overview, category sections, issue rows.
- Implement the chip row for severity filtering.
- Implement click-to-source-document with highlight pulse, reusing Stage 3 navigation behavior.
- Promote i18n keys: `health.runCurrentNote`, `health.runSelectedNotes`, `health.runAllSidecars`, `health.overview`, `health.categories`, `health.details`, `health.severity.error`, `health.severity.warning`, `health.severity.info`.

Verification:

- Run health check on a vault with at least one duplicate, one orphaned anchor, and one path problem, and confirm all three appear in their categories.
- Click each issue type and confirm the correct navigation outcome.
- Toggle each severity chip and confirm rows show or hide.

## Step 5: Repair Tools

Implement Issue 4 in full.

- Sidebar card overflow menu: add `Rebind to selection` when status is `orphaned`.
- Health report rows for orphaned anchors: add `Suggested action: Rebind to selection`.
- Settings `Data maintenance` group: add `Open health check (orphaned only)` button.
- Duplicate group rows: expand-inline behavior with `Keep all`, `Merge comments`, `Delete selected`.
- Merge-comments preview modal and delete-selected confirm modal.
- Missing-source health rows: add `Clean up annotation data` for source documents that were intentionally deleted.
- All write paths use the Step 2 backup module with operation `rebind`, `dedup`, or `cleanup`.
- Promote i18n keys: `repair.orphaned`, `repair.duplicates`, `repair.rebindToSelection`, `repair.previewChange`, `repair.confirmChange`, `repair.keepAll`, `repair.mergeComments`, `repair.deleteSelected`, `repair.cleanupMissingSource`, `repair.cleanupMissingSourceConfirm`, `repair.cleanupMissingSourceSuccess`.

Verification:

- Create an orphaned annotation by editing the source text, rebind from the sidebar card, and confirm the status returns to `active`.
- Same flow but entered from the health report row.
- Create a duplicate annotation, run health check, expand the group, and exercise each of the three actions in a fresh test vault.
- Delete a source document with existing annotations, run health check, confirm cleanup, and verify a `.backups/<timestamp>-cleanup/` folder exists.

## Step 6: Release Documents And Version Bump

Finalize the release-related documents under `docs/completed/stage-7/` and bump versions.

- Verify `65-stage-7-acceptance-checklist.md`, `66-stage-7-code-review-checklist.md`, `67-stage-7-test-cases.md`, and `68-stage-7-release-boundary.md` reflect the as-built behavior. Update any cell that drifted during implementation.
- Bump `manifest.json`, `package.json`, and `versions.json` to `0.7.0`.
- Write the CHANGELOG entry `0.7.0 - Data Maintenance Build-out` with per-issue bullets.

Verification:

- `npm run typecheck` passes.
- `npm run build` passes.
- Release folder contains `main.js`, `manifest.json`, and `styles.css`.

## Why Not The Stage 5 Ten-Step Order

The Stage 5 order separated export-current-note, export-selected, and export-all into three distinct steps. The current-note export is already shipped; the remaining export work is field-level (Issue 1) rather than scope-level. Re-running the ten-step order would re-implement working code.

The ten-step order also did not separate the shared backup module. The Stage 7 order makes it a dedicated step because both Import and Repair depend on the same folder convention.
