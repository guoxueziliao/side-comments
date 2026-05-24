# Stage 5: Import, Export, and Maintenance

Status: To discuss

## Goal

Make annotation data easier to back up, inspect, move, and repair without compromising large-vault performance.

## Version Boundary

Stage 5 is planned as `0.5.0`, and `0.5.0` is formally the import, export, and data maintenance release.

## Planning Rule

Confirmed Stage 5 decisions should be split into focused documents under `docs/stage-5/`.

## Initial Candidate Scope

- Export current note annotations.
- Export selected note annotations.
- Export all sidecar metadata.
- Import previously exported annotation data.
- Data health checks.
- Sidecar inspection tools.
- Manual bulk repair tools for orphaned anchors.

## Confirmed Scope

`0.5.0` should focus on annotation data maintenance:

- backup;
- migration;
- inspection;
- controlled manual repair.

`0.5.0` should not become a general vault content management release.

## Out Of Scope Until Confirmed

- Automatic destructive cleanup.
- Silent sidecar rewriting across the full vault.
- Full-vault migration without explicit user action.
- Cloud sync or remote storage.
- AI summary or automatic analysis.

## Initial Safety Principles

- Backups before mutation.
- Dry-run preview before bulk operations.
- Prefer current-note or selected-scope operations before full-vault operations.
- Never hide data loss behind convenience actions.
- Keep large-vault behavior explicit and interruptible.

## Detail Documents

- `27-stage-5-entry-points.md`: settings and sidebar entry-point structure.
- `28-stage-5-import-export.md`: export scopes, export formats, and import behavior.
- `29-stage-5-health-check.md`: read-only data health check behavior.
- `30-stage-5-repair-tools.md`: manual repair tool behavior.
- `31-stage-5-implementation-order.md`: recommended `0.5.0` development sequence.
- `32-stage-5-acceptance-checklist.md`: completion checklist for `0.5.0`.
- `33-stage-5-code-review-checklist.md`: review checklist for `0.5.0`.
- `34-stage-5-test-cases.md`: concrete test cases for `0.5.0`.
- `35-stage-5-ui-copy.md`: confirmed Chinese and English UI copy for `0.5.0`.
- `36-stage-5-release-boundary.md`: explicit included and deferred scope for `0.5.0`.

## Undecided Items

- Whether export should come before import.
- Whether health checks are read-only in the first release.
- Whether bulk repair is interactive or automated.
