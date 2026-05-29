# Stage 7: Data Maintenance Build-out

Status: Confirmed

## Version Boundary

This stage is released as `0.7.0` in a single version. It is the implementation pass for the Stage 5 maintenance design plus the deltas required to align with Stage 6 (annotation type and tags) and Stage 6.5 (mark type and color decoupling, four-group settings page).

Stage 5 design documents under `docs/completed/stage-5/` stay as the confirmed baseline. Stage 7 documents under `docs/completed/stage-7/` supplement them by recording the deltas and the implementation pass. No Stage 5 document is rewritten or invalidated.

Version number and release slicing are confirmed in `68-stage-7-release-boundary.md`.

## Goal

Finish the data maintenance surfaces that Stage 5 designed but did not implement:

- export beyond current-note (already shipped) into selected-note and full-vault scopes;
- import preview, merge, and automatic sidecar backup;
- read-only data health check reports;
- manual orphaned annotation repair and manual duplicate annotation handling.

Align the data model and UI surfaces with the changes Stage 6 and Stage 6.5 introduced after Stage 5 was confirmed.

## Why This Is The Next Stage

- Stage 5 design is fully confirmed across 10 detail documents but only the export entry points were implemented.
- Stage 6.5 retained Stage 5 orphan i18n keys with a header comment, deferring promotion until those keys had real UI bindings.
- Stage 6 added `annotationType` and `tags` fields after Stage 5 was designed; the JSON and Markdown export schema needs an explicit delta pass rather than another silent extension.
- Stage 6.5 reset the visual layer; building maintenance surfaces on the new card, chip-row, and four-group settings patterns is cheaper than retrofitting them later.

## Planning Rule

Each issue is resolved through one focused discussion. Decisions land in the corresponding detail document before any implementation begins.

## Issues

The work is split into five issues in dependency order. Decisions in earlier issues constrain the design space of later ones.

1. Data model and export delta. See `60-stage-7-issue-1-data-model-delta.md`. Confirmed.
2. Import preview, merge, and backup UI. See `61-stage-7-issue-2-import.md`. Confirmed.
3. Health check report UI. See `62-stage-7-issue-3-health-check.md`. Confirmed.
4. Repair tools UI. See `63-stage-7-issue-4-repair.md`. Confirmed.
5. Implementation order and version boundary. See `64-stage-7-implementation-order.md` and `68-stage-7-release-boundary.md`. Confirmed.

## Implementation Sequencing

Implementation follows a six-step order defined in `64-stage-7-implementation-order.md`. The order interleaves i18n key promotion with the feature step that needs it. All six steps land in a single `0.7.0` release rather than separate intermediate releases.

## Out Of Scope For 0.7.0

- Recent-cache export scope (Stage 5 already excluded this).
- CSV export and Markdown import (Stage 5 already excluded these).
- Automatic destructive cleanup, automatic bulk deletion, or automatic similarity-based rebinding.
- Automatic background full-vault scans.
- Cloud sync, remote backup storage, or account-based synchronization.
- AI-driven summary, annotation analysis, or repair suggestions.
- Cross-vault path remapping or folder-level path rewrite rules.
- Backup auto-cleanup or backup retention policy. Backups are kept until manually deleted. A manual "clear backups" action may land in a later stage.
- Multi-select bulk operations across maintenance surfaces.
- Mobile or touch-specific interactions.

## Open Decisions

None. All decisions for `0.7.0` are confirmed across issues 1 through 5 and the release boundary.
