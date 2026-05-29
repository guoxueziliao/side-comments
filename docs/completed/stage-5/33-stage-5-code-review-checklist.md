# Stage 5: Code Review Checklist

Status: Confirmed

Use this checklist when reviewing `0.5.0` implementation.

## Entry Points

- Settings page exposes the confirmed `数据维护` section.
- Sidebar only exposes lightweight current-note export actions.
- High-impact maintenance actions stay out of the sidebar.

## Export And Import

- Export scopes match the confirmed set.
- Recent-cache export is not introduced.
- JSON export uses the explicit export package structure.
- Markdown export stays human-readable and non-importable.
- Import accepts only the plugin JSON export format.
- Import shows a preview before writing.
- Import creates a backup before mutating sidecar data.
- Import defaults to merge behavior instead of overwrite behavior.
- Import surfaces duplicate conflicts instead of silently replacing data.
- Import supports original-path restore and current-document import.

## Health Check

- Health checks remain read-only.
- Health checks do not auto-repair or mutate data.
- Health check findings cover the confirmed issue set.
- Health check reports include overview, categories, and details.
- Health checks follow the confirmed scope set.
- No background full-vault scan is added.

## Repair Tools

- Orphaned repair is manual and confirmation-based.
- Duplicate handling is manual and confirmation-based.
- Automatic bulk deletion is not introduced.
- Automatic anchor rewriting is not introduced.
- Similarity-based auto-rebinding is not introduced.
- One-click cleanup is not introduced.

## Safety

- No destructive action happens without preview and confirmation.
- No full-vault silent rewrite is introduced.
- No batch path remapping across unrelated vaults is introduced.
- No new data mutation path skips the backup step.
