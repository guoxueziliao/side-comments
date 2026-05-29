# Stage 5: Acceptance Checklist

Status: Confirmed

This checklist defines what must be true before `0.5.0` is considered complete.

## Entry Points

- The settings page has a main `数据维护` section.
- The settings page groups maintenance actions in the order Export, Import, Data Health Check, Repair Tools.
- The current-document sidebar provides only a lightweight current-note export entry.
- The sidebar does not expose full-vault export, import, bulk repair, or other high-impact maintenance actions.

## Export

- Current note annotations can be exported.
- Selected note annotations can be exported.
- All sidecar metadata can be exported.
- Recent-cache export does not exist.
- JSON export is available.
- Markdown export is available.
- CSV export does not exist.
- JSON export uses an explicit export package with format and formatVersion.
- JSON export preserves enough structured data for later import.
- Markdown export is human-readable and not importable.

## Import

- Import accepts only plugin JSON export files.
- Import shows a preview before writing.
- Import backs up the target sidecar before writing.
- Import merges missing annotations by default instead of silently overwriting data.
- Import flags likely duplicates as conflicts instead of replacing them silently.
- Import can restore to the original path or import into the current document.
- Markdown files are rejected as import sources.

## Health Check

- Health checks are read-only in `0.5.0`.
- Health checks do not auto-repair data.
- Health checks can detect missing sidecars, path mismatches, duplicate annotations, orphaned anchors, version mismatches, missing target documents, and export package structure errors.
- Health check reports show an overview, issue categories, and issue details.
- Health checks support current note, selected notes, and all sidecar metadata scopes.
- Health checks do not add a recent-cache scope.
- Health checks do not run as an automatic background scan on startup.

## Repair Tools

- Orphaned annotation repair is manual and confirmation-based.
- Duplicate annotation handling is manual and confirmation-based.
- Orphaned repair opens the source document, lets the user pick a new target selection, previews the change, and writes only after confirmation.
- Duplicate handling shows a group view, previews the change, and writes only after confirmation.
- Automatic bulk deletion does not exist.
- Automatic bulk anchor rewriting does not exist.
- Automatic similarity-based rebinding does not exist.
- One-click cleanup of abnormal data does not exist.

## Safety And Boundary

- Mutation flows back up the target sidecar first.
- No silent destructive rewrite happens across the full vault.
- No full-vault migration happens without explicit user action.
- No cloud sync or remote storage is introduced.
- No AI summary or automatic analysis is introduced.
- No batch path remapping across unrelated vaults is introduced.
