# Stage 6.5 Issue 5: Settings Page And Orphan I18n Keys

Status: Confirmed

## Scope

This issue resolves the settings page structure, the disposition of orphan i18n keys, the inclusion of Stage 5 UI surfaces in `0.6.5`, and the migration policy for legacy `highlight + purple` annotations.

## Decision 1: Settings Page Is Grouped Into Four Sections

The current flat list under a single `<h2>` is replaced with four named groups, implemented through Obsidian's `Setting.setHeading()` or `<h3>` headers.

Group contents:

- Appearance
  - `Show resolved marks` (existing `showResolvedMarks` toggle).
- Behavior
  - `Auto-open sidebar after creating a comment` (existing `autoOpenSidebarAfterCreate` toggle).
  - `Interface language` (new, surfacing the orphan `settings.language.*` keys; options: `Follow Obsidian`, `Simplified Chinese`, `English`).
- Advanced
  - `Cached documents` (existing `maxCachedDocuments` text input).
  - `Anchor recovery delay` (existing `relocateDebounceMs` text input).
  - `Data directory` (existing read-only display of `dataDir`).
- Data maintenance
  - `Export current note annotations` (existing, JSON and Markdown buttons).
  - `Export selected note annotations` (existing, opens `SelectedNotesExportModal`).
  - `Export all annotation data` (existing).

The removed entries from issues 1 and 3 (`showResolvedComments` toggle and `sidebarDisplayMode` dropdown) leave their places in the file. Their related i18n keys are deleted.

## Decision 2: Stage 5 Import / Health Check / Repair Stay Deferred

The orphan i18n key sets for Stage 5 features are not surfaced in `0.6.5`. They remain in `i18n.ts` because the Stage 5 detail documents (`27-stage-5-entry-points.md` through `36-stage-5-release-boundary.md`) have already planned the feature behavior, and the translations will be reused when the UI is built.

To avoid future confusion about why these keys exist with no UI, a comment block is added near the top of `i18n.ts` that lists the deferred namespaces and points to the Stage 5 documents:

- `maintenance.import.*`
- `maintenance.health.*`
- `maintenance.repair.*`
- `import.*`
- `health.*`
- `repair.*`

These are explicitly marked as `Stage 5 pending, not surfaced in 0.6.5` rather than treated as dead code.

## Decision 3: Language Switcher Is The Only Newly Surfaced Stage-Era Setting

The `Interface language` dropdown is the single Stage-era UI addition that ships in `0.6.5`. It is small, independent of all other issues, and gives existing `settings.language.*` translations a home.

Behavior:

- Default value is `Follow Obsidian`, which uses the current `isChineseLocale` detection from `i18n.ts`.
- `Simplified Chinese` and `English` are explicit overrides that bypass the Obsidian locale.
- Changing the value rerenders all open views to reflect the new language without restarting Obsidian.

## Decision 4: No Migration Tool For Legacy "Comment" Annotations

The plugin does not offer a UI button or a command to migrate legacy `highlight + purple` annotations into the new `note` mark type.

Reasons:

- The conservative migration policy is already set in issue 1.
- Adding a migration button requires either irreversible data changes (with the risk of disagreement: not every legacy purple highlight was intended to be a comment) or substantial backup-and-restore plumbing.
- The `isCommentLikeMark` helper continues to label legacy `highlight + purple` data as "Comment" in the meta row, so legacy users see no visual regression after the upgrade.

If future user feedback indicates demand, a one-shot command can be added in `0.7+`.

## I18n Cleanup Performed In This Issue

Keys deleted (as a consequence of issues 1, 2, 3, and 4):

- `sidebar.showResolved`, `sidebar.hideResolved`, `sidebar.showResolved.short`, `sidebar.hideResolved.short`.
- `settings.showResolvedComments.name`, `settings.showResolvedComments.desc`.
- `settings.sidebarDisplayMode.name`, `settings.sidebarDisplayMode.desc`.
- `sidebar.mode.normal`, `sidebar.mode.compact`, `sidebar.mode.switch`.
- `toolbar.comment.short`. The toolbar entry becomes `toolbar.note` and `toolbar.note.short` (the short form may be omitted because the toolbar is icon-only after issue 2; the key is kept only if needed for the overflow panel).
- All single-character `action.*.short` keys, since issue 3 removes the textual five-button header: `action.expand.short`, `action.collapse.short`, `action.edit.short`, `action.save.short`, `action.resolve.short`, `action.restore.short`, `action.delete.short`, `action.cancel.short`, `action.rebind.short`, `action.adjust.short`, `action.jump.short`.
- `crossNote.subtitle`, `crossNote.cardSourcePrefix`, `crossNote.statusPrefix`.

Keys added:

- `toolbar.note` (and possibly `toolbar.note.short` if any non-toolbar surface needs it).
- Four new cross-note empty-state keys distinguishing `loading`, `missing`, `failed`, and `no matches` (replacing the conflated `empty.crossNote.recentUnavailable` and `empty.crossNote.noMatches` usages).
- Group header copy for the cross-note view (`crossNote.group.count`, `crossNote.group.openSource`, `crossNote.group.modeFile`, `crossNote.group.modeTime` or equivalent).
- Chip-filter labels reusing existing `filter.status.*`, `filter.color.*`, `filter.type.*`, `filter.tags.all`, plus a new `filter.source.label` for the source chip.

Keys promoted from orphan to active:

- `settings.language.*` (4 keys, surfaced by the language dropdown).
- `filter.type.all`, `filter.tags.all` (used by issue 4 chip filters).
- `annotationType.*` (6 keys, used by issue 3 edit panel).
- `tags.*` (5 keys, used by issue 3 edit panel).

## Out Of Scope For Issue 5

- Stage 5 Import / Health Check / Repair UI implementation.
- Backup or restore UI in the settings page (the existing `.obsidian-side-comments/backups/` directory is preserved untouched).
- Settings search or quick navigation across groups.
- Per-section reset to defaults.

## Downstream Effects

- The implementation order document tracks the order in which issues 1 through 5 should be merged.
- The release boundary document records the final version number and release slicing decision.
