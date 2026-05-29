# Stage 9: Automated Test Cases

Status: Confirmed

## Scope

This document lists automated test cases for `0.9.0`.

Automated tests should protect data compatibility, state derivation, filtering, sorting, creation behavior, and i18n coverage. Visual inspection, theme review, and real Obsidian interaction should be covered by manual tests.

## Test Boundary

Automated tests should not try to prove every visual detail.

Use automated tests for:

- pure data transforms;
- state derivation;
- filtering and sorting;
- action availability;
- import, export, and draft copy regressions;
- i18n key coverage.

Use manual tests for:

- visual polish;
- real scroll feel;
- Obsidian theme contrast;
- actual source-mode and reading-mode selection behavior;
- desktop zoom and narrow-sidebar screenshots.

## Model Compatibility Tests

- Creating a mark-only annotation remains valid.
- Creating a note-only annotation remains valid.
- Creating a mark-and-note annotation remains valid.
- Legacy `annotationType` data can still be read.
- Legacy `annotationType` values are not required for new annotations.
- Stage 9 UI state derivation does not mutate stored annotation data.
- Orphaned annotation data retains last-known position metadata when available.

## Markdown Draft Tests

- Mark-only annotations are excluded from Markdown draft copy.
- Note-only annotations are included in Markdown draft copy when they have note text.
- Mark-and-note annotations are included in Markdown draft copy when they have note text.
- Legacy `annotationType` values do not reappear as current user-facing headings.
- Tags and status continue to be represented according to the existing draft rules.

## I18n Tests

- Every new Stage 9 visible label has Simplified Chinese and English entries.
- Toolbar icon buttons have localized tooltip strings.
- Card action labels have localized strings.
- Filter labels have localized strings.
- Settings group labels have localized strings.
- Old user-facing classification labels are absent from new Stage 9 UI keys.

If exact text assertions are brittle, test for key existence and use snapshot review sparingly.

## Card State Tests

- Mark-only annotation derives the correct card display state.
- Note-only annotation derives the correct card display state.
- Mark-and-note annotation derives the correct card display state.
- Resolved annotation derives lower-emphasis status state.
- Orphaned annotation derives rebind-available state.
- Normal annotation derives adjust-range-available state when the source range is valid.
- Card display state includes selected text, note preview, mark, tags, status, and metadata in stable fields.

## Ordering Tests

- Default sidebar list order follows source document order.
- Resolved annotations stay in source document order.
- Orphaned annotations use last-known source position when available.
- Orphaned annotations without usable position sort after positioned annotations.
- Editing note text does not reorder cards.
- Editing tags does not reorder cards.
- Resolving or restoring an annotation does not reorder cards.
- Adjusting range or rebinding may update order only when source position changes.

## Filtering Tests

- Status filter returns matching annotations in document order.
- Mark filter returns matching annotations in document order.
- Note-state filter distinguishes with-note and without-note annotations.
- Keyword filter searches planned text fields consistently.
- Combined filters use deterministic AND behavior.
- Clearing filters restores the full document-order list.
- Filtered count and total count are derived correctly.
- Empty and filtered-empty states are derived distinctly.

## Action Availability Tests

- Mark-only cards can add or edit note.
- Note-only cards can edit note and add visual mark if supported.
- Mark-and-note cards can edit note and mark.
- Orphaned cards expose rebind.
- Normal cards expose adjust range when supported.
- Resolved cards expose restore.
- Dangerous actions are marked as confirmation-required.
- Cross-note cards do not expose current-document-only edit workflows unless source context is available.

## Creation Flow Tests

- Direct highlight action creates or updates a highlight mark.
- Direct underline action creates or updates an underline mark.
- Direct strikethrough action creates or updates a strikethrough mark.
- Direct mark actions do not require note text.
- More panel save can create annotation with note only.
- More panel save can create annotation with mark only.
- More panel save can create annotation with mark and note.
- Duplicate selection updates existing annotation according to Stage 8 rules.
- Failed anchor creation does not leave partial annotation data.

## Navigation State Tests

- Card click requests source navigation with the correct annotation id.
- Source mark click requests sidebar focus with the correct annotation id.
- Focus state expires after the configured temporary feedback duration.
- Navigation failure clears or reports focus state instead of leaving stale active state.
- Cross-note card click requests opening the source document before focus.

These tests can use mocks; real scrolling remains a manual test.

## Settings State Tests

- Default density setting maps to the expected sidebar mode.
- Hide source marks setting does not remove sidebar cards from derived state.
- Language setting changes localized labels through the existing i18n path.
- Data maintenance entries remain settings-level actions, not card-level actions.

## Regression Tests

- Source mode and reading mode code paths still produce compatible annotation ids.
- Existing import/export tests still pass after Stage 9 UI changes.
- Existing health check and repair tests still pass after Stage 9 UI changes.
- Existing sidecar storage tests still pass without schema-breaking migration.
- Build and typecheck pass before release.

## Out Of Scope

- Pixel-perfect visual tests.
- Mobile, tablet, or non-desktop-specific tests.
- Full end-to-end Obsidian automation for every interaction.
- Theme contrast automation beyond basic class or token checks.
- AI-related tests.
