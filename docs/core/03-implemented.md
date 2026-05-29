# Implemented Work

Status: Confirmed

This document lists work that is already implemented in the repository or treated as a completed implementation baseline.

Older implemented stages are historical references. Later stages can supersede names, UI concepts, and behavior from earlier stages.

Publication status is separate. The latest published GitHub release may lag behind the repository implementation.

## Published Baseline

- Latest published release: `0.4.0`.
- Official plugin repository: `guoxueziliao/side-comments`.
- Local development path: `/home/fan/obsidian插件`.

## Implemented In Repository

The current package version is `0.11.0`.

Stage 11 / `0.11.0` is implemented and moved to completed baseline.

Implemented user-facing foundations:

- Create annotations from selected Markdown text.
- Support source mode and reading mode.
- Support highlight, underline, and strikethrough mark types; note-only annotations without visible marks.
- Store annotation data outside Markdown files under `.obsidian-side-comments/`.
- Render marks in editor and reading view.
- Show current-document annotations in the right sidebar.
- Support sidebar edit, delete, resolve, search, filter, and jump actions.
- Load current-document sidecar data lazily.
- Relocate anchors conservatively after document edits.
- Support lazy sidecar schema migration.
- Support bilingual UI infrastructure.

Implemented stage baselines:

- Stage 1: MVP stabilization baseline.
- Stage 2: anchor reliability improvements.
- Stage 3: current-document sidebar workflow.
- Stage 4: cross-note annotation review and search.
- Stage 5 export entry points: current note, selected notes, and all sidecars.
- Stage 6: annotation type and user-defined tags data model, combined filters, and Markdown draft copy.
- Stage 6.5: UX refresh, shared card direction, settings grouping, and language switcher.
- Stage 7: data maintenance build-out.
- Stage 8: simplification and annotation model redesign around `Annotation = Anchor + Optional Mark + Optional Note`.
- Stage 9: interface and interaction experience. Card hierarchy restructure, density modes, filter chips, sidebar toolbar, settings reorganization, navigation feedback, creation toolbar, cross-note consistency. Removed fixed annotation types from UI and data flow, added note-state filtering, added empty-annotation health checks, added `annotationState` module.
- Stage 10: stability and workflow regression. Duplicate-range upsert update, filter-hidden notices for create/update/resolve/rebind, AdvancedCreationModal pre-fill on existing range, annotation workflow regression verification.
- Stage 11: release and review hardening. LICENSE fix, manifest/README alignment with official Obsidian conventions, settings headings converted to Setting.setHeading() API, all four validation checklist groups verified.

## Implemented Detail Entry Points

Use these as historical entry points, not as equal-weight current contracts.

- Stage 1: `../completed/stage-1/03-stage-1-stabilization.md`.
- Stage 2: `../completed/stage-2/04-stage-2-anchor-reliability.md`.
- Stage 3: `../completed/stage-3/08-stage-3-sidebar-workflow.md`.
- Stage 4: `../completed/stage-4/17-stage-4-cross-note-review.md`.
- Stage 5: `../completed/stage-5/26-stage-5-data-maintenance.md`.
- Stage 6: `../completed/stage-6/37-stage-6-advanced-review-workflow.md`.
- Stage 6.5: `../completed/stage-6.5/51-stage-6-5-overview.md`.
- Stage 7: `../completed/stage-7/59-stage-7-overview.md`.
- Stage 8: `../completed/stage-8/69-stage-8-simplification.md`.
- Stage 9: `../completed/stage-9/109-stage-9-development-index.md`.
- Stage 10: `../completed/stage-10/130-stage-10-development-index.md`.
- Stage 11: `../completed/stage-11/146-stage-11-development-index.md`.

## Review Boundary

Before publishing a release, verify:

- `npm run typecheck` passes.
- `npm run build` passes.
- The local Obsidian test install uses the current built `main.js`, `manifest.json`, and `styles.css`.
- The relevant acceptance checklist for the target release is complete.
