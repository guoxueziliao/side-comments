# Stage 6.5 Release Boundary

Status: Confirmed

## Version Number

`0.6.5`.

This version is the entire UX refresh: all five issues are released together. The intermediate steps in `57-stage-6-5-implementation-order.md` are internal merge boundaries, not user-facing releases.

`manifest.json`, `package.json`, and `versions.json` move from `0.6.0` to `0.6.5` in the same commit that finalizes the release.

## Naming

- `manifest.json` `description` is unchanged. It stays as the existing user-facing plugin description shown in the Obsidian plugin gallery.
- `CHANGELOG.md` adds a section titled `0.6.5 - UX Refresh` with a short summary and the per-issue bullet list below.
- `README.md` is not retitled but its `Features` section may be updated to reflect the new annotation type and tag UI now being surfaced.

## Included Scope

- Issue 1: semantics consolidation (`note` mark type, mark type and color decoupling, "resolved" controls compressed from three to two).
- Issue 2: selection toolbar split-button-plus-chevron redesign, icon-only buttons, three command-palette commands for annotation type at creation.
- Issue 3: comment card edit panel with annotation type and tag editor, color bar plus status indicator view state, single-density display, resolved-by-default-collapsed behavior.
- Issue 4: cross-note overview using the shared card, source-based grouping, chip-style filter row including type and tag filters, primary `Copy Markdown draft` button, separated loading and empty states.
- Issue 5: four-group settings page, language switcher, i18n cleanup, no legacy migration tool, Stage 5 keys retained with comment.

## Deferred Scope

These items are out of scope for `0.6.5` and tracked for future versions:

- Stage 5 Import, Health Check, and Repair UI implementation. Detail documents already exist in `docs/completed/stage-5/`. Target release is `0.7.0` or later.
- Manual migration tool for legacy `highlight + purple` annotations. Revisit if user feedback warrants it.
- Multi-select with checkboxes in the sidebar or the cross-note view, and any bulk operations built on top of multi-select.
- Saved filter views or saved cross-note layouts.
- Vault-wide indexing or full-vault search.
- Mobile or touch-specific interactions.
- Modifier-key shortcuts on the toolbar (Shift + click and similar).

## Permanent Exclusions

These align with `docs/core/02-roadmap.md` and the Stage 6 release boundary:

- Color as a semantic dimension.
- Review priority or importance as a first-class field.
- Annotation collections or review queues.
- Automatic summary generation or AI-driven classification.

## Acceptance

`0.6.5` is considered complete when:

- All six implementation steps in `57-stage-6-5-implementation-order.md` are merged.
- `npm run typecheck` and `npm run build` both pass.
- The Obsidian dev install shows:
  - New selection toolbar with icon buttons and chevron color picker.
  - Comment card with color bar, status indicator, single overflow menu, and visible annotation type and tag editor.
  - Cross-note view grouped by source by default, with chip filters including type and tag.
  - Settings page split into four labeled groups including the language switcher.
- All existing annotations (created in `0.6.0` or earlier) still load and render. Legacy `highlight + purple` annotations still display with the "Comment" label in their meta row.

## Release Steps

These mirror the standard checklist in the project README:

- Update `manifest.json`, `package.json`, and `versions.json` to `0.6.5`.
- Run `npm run typecheck` and `npm run build`.
- Confirm the release folder contains `main.js`, `manifest.json`, and `styles.css`.
- Manually verify the acceptance bullets above in a test vault.
- Write the `CHANGELOG.md` `0.6.5 - UX Refresh` section.
- Publish through GitHub Releases.

## Open Decisions

None. All decisions for `0.6.5` are confirmed.
