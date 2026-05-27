# Stage 7 Release Boundary

Status: Confirmed

## Version Number

`0.7.0`.

This version is the entire Data Maintenance Build-out. All five issues plus the release-docs step land in a single version. The six steps in `64-stage-7-implementation-order.md` are internal merge boundaries, not user-facing releases.

`manifest.json`, `package.json`, and `versions.json` move from `0.6.5` to `0.7.0` in the same commit that finalizes the release.

## Naming

- `manifest.json` `description` is unchanged.
- `CHANGELOG.md` adds a section titled `0.7.0 - Data Maintenance Build-out` with a short summary and the per-issue bullet list below.
- `README.md` `Features` section may be updated to reflect that import, health check, and manual repair are now available in addition to export.

## Included Scope

- Issue 1: JSON `v2` export schema with `annotationType` and `tags`; Markdown export with `Mark`, `Annotation type`, `Color`, `Tags` fields; importer default-fill for `v1`.
- Issue 2: import modal with file picker, scope selector, per-document accordion preview, summary counts, and `.backups/<timestamp>-import/` automatic backup.
- Issue 3: health check view tab with overview, category sections, severity chip filter, and click-to-source navigation.
- Issue 4: sidebar and health-report dual entry points for orphaned rebind; duplicate-group inline expansion with `Keep all`, `Merge comments`, `Delete selected`; confirmed missing-source cleanup; shared backup folder.
- Stage 5 orphan i18n keys for Import, Health, and Repair promoted to bound keys.

## Deferred Scope

These items are out of scope for `0.7.0` and tracked for future versions:

- Backup auto-cleanup or retention policy. A manual `Clear backups` action may land in a later stage.
- Markdown file import.
- CSV export.
- Compressed export packages.
- Automatic background health check on startup or on file change.
- Saved health check reports or report history.
- Export of the health check report.
- Saved filter views (also deferred in Stage 6.5).
- Multi-select bulk operations in any maintenance surface.
- Vault-wide indexing or full-vault search.
- Mobile or touch-specific interactions.
- Cross-vault path remapping or folder-level path rewrite rules.

## Permanent Exclusions

These align with `docs/core/02-roadmap.md`, the Stage 5 release boundary, and the Stage 6 / 6.5 release boundaries:

- Automatic destructive cleanup of any kind.
- Silent sidecar rewriting across the full vault.
- Automatic similarity-based rebinding.
- Cloud sync or remote backup storage.
- AI-driven summary, classification, or repair suggestions.
- Color as a semantic dimension.
- Review priority or importance as a first-class field.

## Acceptance

`0.7.0` is considered complete when:

- All six implementation steps in `64-stage-7-implementation-order.md` are merged.
- `npm run typecheck` and `npm run build` both pass.
- The acceptance checklist in `65-stage-7-acceptance-checklist.md` is fully ticked in a test vault.
- All annotations created in `0.6.x` and earlier still load and render. The legacy `highlight + purple` "Comment" label preserved by Stage 6.5 still appears.

## Release Steps

Mirror the standard checklist in the project README:

- Update `manifest.json`, `package.json`, and `versions.json` to `0.7.0`.
- Run `npm run typecheck` and `npm run build`.
- Confirm the release folder contains `main.js`, `manifest.json`, and `styles.css`.
- Manually walk through the acceptance checklist on a test vault.
- Write the `CHANGELOG.md` `0.7.0 - Data Maintenance Build-out` section with per-issue bullets.
- Publish through GitHub Releases.

## Open Decisions

None. All decisions for `0.7.0` are confirmed.
