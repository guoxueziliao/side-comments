# Stage 6.5 Implementation Order

Status: Confirmed

## Goal

Define a merge order for issues 1 through 5 that keeps the codebase in a coherent state after every step, so type checking, builds, and manual testing remain meaningful between merges.

## Constraints

- Each step should leave the plugin in a buildable, usable state.
- The data model (`note` mark type) must land before any UI surface that creates or filters by it.
- Visible UI changes that depend on each other should not be split across multiple merges if that would expose users to an inconsistent UI.
- I18n cleanup should follow the same step that removes its referenced UI, not lag behind.

## Order

The work proceeds in six steps. Issue 5 is split into two passes so that i18n cleanup stays in sync with each preceding issue.

### Step 1: Issue 1 - Data And Semantics Base

- Add `note` to the `MarkType` union in `src/types.ts`.
- Update `migration.ts` so existing sidecar data parses safely with the new union (no destructive migration).
- Remove the `showResolvedComments` setting from `src/settings/settings.ts`, `src/settings/settingsTab.ts`, and `src/views/sidebarView.ts` (the header toggle).
- Remove the "Show resolved" and "Hide resolved" buttons from the sidebar header.
- Keep the `showResolvedMarks` setting (it stays in issue 5's Appearance group).
- Keep `isCommentLikeMark` in `commentCard.ts` as the legacy-data label branch.

Verification:

- Typecheck passes.
- Existing annotations still render.
- The status filter dropdown is now the only way to show or hide resolved annotations in the sidebar list.

### Step 2: Issue 5 - I18n Cleanup For Issue 1

- Delete `sidebar.showResolved`, `sidebar.hideResolved`, `sidebar.showResolved.short`, `sidebar.hideResolved.short`, `settings.showResolvedComments.name`, `settings.showResolvedComments.desc` from `src/i18n.ts`.
- Add the Stage 5 pending comment block at the top of `i18n.ts` listing the deferred namespaces.

Verification:

- Typecheck passes (catches any leftover usages of the removed keys).
- No orphan key references remain for the removed UI.

### Step 3: Issue 2 - Selection Toolbar

- Rewrite `src/editor/selectionToolbar.ts` to render four icon buttons with chevron color sub-pickers and a trailing overflow button.
- Add `toolbar.note` to `i18n.ts`.
- Add the three command-palette commands (`Add as question`, `Add as thought`, `Add as task`) in `src/commands/commands.ts`.
- Update `src/types.ts` so the `SelectionAction` set reflects the new `note` action.
- Implement the `last-used color per mark type` cache (in-memory, no persistence).

Verification:

- All four mark types can be created from a selection.
- Chevron opens a five-color panel; selecting a color applies and updates the cached default.
- Three new commands appear in the command palette.

### Step 4: Issue 3 - Comment Card And Sidebar

- Rewrite `src/views/commentCard.ts` view state to color bar + status indicator + meta row + body + overflow menu.
- Add the classification row (annotation type select, tag editor) to the edit panel.
- Simplify `src/views/sidebarView.ts` state to a single per-card expand set (removing the three-set system).
- Remove the Normal / Compact segmented control from the sidebar header.
- Remove the `sidebarDisplayMode` setting and its references.
- Rewrite the card-related sections of `styles.css`.

Verification:

- Annotation type and tags are editable through the edit panel.
- Status toggling works through the status indicator on the color bar.
- Resolved cards collapse to a single-line summary by default.
- Overflow menu shows the correct actions for active, resolved, and orphaned cards.

### Step 5: Issue 5 - Settings Page And Language Switcher

- Restructure `src/settings/settingsTab.ts` into the four groups (Appearance, Behavior, Advanced, Data Maintenance) using `Setting.setHeading()` or `<h3>` headers.
- Add the `Interface language` dropdown wired to a new `language` setting.
- Delete remaining i18n keys removed by issues 2 and 3 (`toolbar.comment.short`, `sidebar.mode.*`, single-character `action.*.short` keys).
- Promote `settings.language.*`, `filter.type.all`, `filter.tags.all` from orphan to active.
- Verify the file-header comment block in `i18n.ts` correctly enumerates the Stage 5 pending namespaces.

Verification:

- Settings page renders with four labeled groups.
- Language switching takes effect without restart.
- Typecheck passes with no unused i18n keys (except the Stage 5 pending ones).

### Step 6: Issue 4 - Cross-Note Overview

- Extract the shared card renderer, filter chip primitive, and icon button utility into a new module under `src/views/shared/` (or similar).
- Rewrite `src/views/crossNoteView.ts` to use the shared card, with the file name prepended to the meta row.
- Implement source-based grouping with collapsible groups and the segmented `Group by file` / `Time descending` toggle.
- Replace the search-and-select row with a search input plus a chip-style filter row (status, color, type, tag, source).
- Implement the source chip as a multi-select panel.
- Promote `Copy Markdown draft` to a primary button in the top-right header position.
- Add the four distinct loading and empty-state messages.
- Add the new i18n keys (group header copy, four empty-state copies, source chip label).

Verification:

- Sidebar and cross-note cards render identically (apart from source filename and `Open source` action).
- Grouping toggle switches between by-file and by-time views.
- All five filter chips work.
- Primary `Copy Markdown draft` copies the filtered results.

## Release Step

After step 6, finalize the release as described in `58-stage-6-5-release-boundary.md`.

## Out Of Scope For The Implementation Order

- Acceptance checklist, code review checklist, and test cases. The scope of `0.6.5` is a UX refresh on existing functionality, not a feature stage. The verification bullets per step replace those documents.
- Per-issue PRs versus a single PR. That choice is left to the implementer; the order is what matters.
