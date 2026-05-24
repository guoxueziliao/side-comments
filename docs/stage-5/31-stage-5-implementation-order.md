# Stage 5: Implementation Order

Status: Confirmed

## Goal

Define the recommended development sequence for `0.5.0`.

## Confirmed Order

`0.5.0` should be implemented in this order:

1. Add the data maintenance settings section and entry-point skeleton.
2. Add current-note JSON and Markdown export.
3. Add selected-note export.
4. Add all-sidecar metadata export.
5. Add JSON import preview.
6. Add merge import with automatic sidecar backup.
7. Add read-only data health check reports.
8. Add manual orphaned annotation repair.
9. Add manual duplicate annotation handling.
10. Add acceptance checklist, code review checklist, test cases, and UI copy documentation.

## Rationale

This order starts with low-risk export features, then adds import and backup behavior, and only then introduces inspection and repair tools.

Repair tools should be implemented after health checks so repair actions are grounded in visible reports instead of hidden automatic decisions.
