# Stage 7 Code Review Checklist

Status: Confirmed

## Data Layer

- Exporter writes `exportFormatVersion: 2` only. No code path emits `v1`.
- Importer recognizes both `1` and `2`. Any other value is treated as a structure error reported by the health check.
- Default-fill for `v1` import uses the same constants as the lazy sidecar migration to avoid two sources of truth.
- Markdown export template treats empty `tags` by omitting the line, not by emitting an empty value.

## Backup Module

- Backup module is a single entry point used by every write path that mutates sidecars (import, rebind, dedup).
- No direct sidecar overwrite exists outside the backup-then-write helper.
- Timestamp collisions are resolved deterministically (`-1`, `-2`, ...), not by best-effort retry.
- Backup folder writes use vault-relative paths so the backup folder is the same on different OS installs.

## Import Modal

- Modal is opened from one place (settings entry). No second copy of the open-modal code exists elsewhere.
- Preview computation is pure: given an import package and the current vault state, it returns the same status badges every time.
- Preview does not touch disk. Only `Confirm import` triggers writes.
- Per-document accordion virtualization is not required. Large imports may be slow but must not crash.

## Health Check

- View registration matches the existing cross-note view pattern. No ad-hoc leaf wiring.
- Health check scan code is reusable. Scope selection (current / selected / all) is a parameter, not three duplicated implementations.
- Severity chip toggling is a pure filter. The underlying data set is computed once per run.
- Click-to-source-document reuses the Stage 3 navigation helper. No second copy of the scroll-and-pulse code.

## Repair Tools

- Sidebar card overflow menu construction adds `Rebind to selection` declaratively based on annotation status. No second code path computing "is this card orphaned".
- Duplicate-group expand-inline state is local to the row and resets correctly when the report is re-run.
- Merge-comments preview modal does not write on open. Only the confirm button writes.
- Delete-selected confirm modal lists the exact annotations that will be deleted.
- Missing-source cleanup is single-row, confirmation-based, and backs up the sidecar before removing it.

## i18n

- No code path uses hard-coded Chinese or English strings for Import, Health, or Repair labels.
- All keys promoted out of orphan are referenced in code. No key remains unused after promotion.
- The file-header orphan-keys comment is removed for the promoted sections.

## Non-Goals

- No automatic similarity-based rebinding code path.
- No background full-vault scan timer.
- No batch path remap helper.
- No backup retention or cleanup code.
- No multi-select bulk operation helpers in any maintenance surface.
- No automatic missing-source cleanup.
