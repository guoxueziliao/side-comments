# Stage 6.5: UX Refresh

Status: Confirmed

## Version Boundary

This is a mid-cycle UX refresh between `0.6.0` and `0.7.0`. It is released as `0.6.5` in a single version. It does not introduce new feature dimensions. The intent is to:

- Surface the annotation type and tag UI that Stage 6 already plumbed into the data layer but did not wire into any view.
- Remove duplicate or overlapping controls produced by Stage 1 through Stage 6 accreting features onto the same surfaces.
- Re-establish a coherent visual and interaction layer that later stages can build on.

Version number and release slicing are confirmed in `58-stage-6-5-release-boundary.md`.

## Goal

Make the current plugin feel coherent and easy to use by:

- Cleaning up overlapping concepts before any new feature work.
- Wiring up the half-finished Stage 6 surfaces (annotation type editor, tag editor, type and tag filters).
- Re-establishing visual hierarchy in the selection toolbar, sidebar cards, and cross-note view.

## Why This Comes Before 0.7.0

Stage 6 shipped a data model, lazy migration, and Markdown draft logic for `annotationType` and `tags`, but the editor and filter UI for those fields was never created. The roadmap also recorded principles (color is not classification, color is not semantic) that the current selection toolbar violates by encoding "comment" as `highlight + purple`. Stacking another feature stage on top of this would compound the inconsistency.

A focused refresh removes that risk before the next stage begins.

## Planning Rule

Each issue is resolved through one focused discussion. Decisions land in the corresponding detail document before any implementation begins.

## Issues

The work is split into five issues in dependency order. Decisions in earlier issues constrain the design space of later ones.

1. Semantics consolidation. See `52-stage-6-5-issue-1-semantics.md`. Confirmed.
2. Selection toolbar and creation flow. See `53-stage-6-5-issue-2-selection-toolbar.md`. Confirmed.
3. Comment card. See `54-stage-6-5-issue-3-comment-card.md`. Confirmed.
4. Cross-note overview. See `55-stage-6-5-issue-4-cross-note.md`. Confirmed.
5. Settings page and orphan i18n keys. See `56-stage-6-5-issue-5-settings.md`. Confirmed.

## Implementation Sequencing

Implementation follows a six-step order defined in `57-stage-6-5-implementation-order.md`. Issue 5 is split into two passes so i18n cleanup stays in sync with each preceding issue. All six steps land in a single `0.6.5` release rather than separate intermediate releases.

## Out Of Scope For 0.6.5

- New annotation dimensions beyond the existing type, tag, color, and status.
- Saved views or saved filter sets.
- Multi-select operations in any view.
- Vault-wide indexing or full-vault search.
- Build-out of Stage 5 Import, Health Check, or Repair UI beyond surfacing or removing the orphan i18n keys for those features.
- Automatic or manual migration of legacy `highlight + purple` "comment" annotations. See issue 1 and issue 5 for the migration policy.

## Open Decisions

None. All decisions for `0.6.5` are confirmed across issues 1 through 5 and the release boundary.
