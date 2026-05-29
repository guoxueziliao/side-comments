# Stage 9: Acceptance Checklist

Status: Confirmed

## Scope

This document defines the completion checklist for `0.9.0`.

Stage 9 is complete only when the desktop Obsidian UI and interaction polish can be verified against this checklist.

## Product Boundary

- [ ] The release is tested for desktop Obsidian.
- [ ] Mobile, tablet, and other non-desktop-specific behavior is not included in acceptance.
- [ ] Small desktop windows are checked only as desktop layout robustness.
- [ ] No new feature in this release depends on mobile-specific interaction.

## Terminology And I18n

- [ ] User-facing UI uses `标注 / Annotation` for the whole item.
- [ ] User-facing UI uses `标记 / Mark` for visual marks.
- [ ] User-facing UI uses `备注 / Note` for written notes.
- [ ] User-facing UI uses `标签 / Tag` for user labels.
- [ ] User-facing UI does not offer `批注类型 / 摘录 / 问题 / 想法 / 任务` as selectable categories.
- [ ] Icon-only buttons have localized tooltips.
- [ ] Chinese and English labels both fit compact surfaces.
- [ ] Notices are short and do not mention storage internals.

## Sidebar Cards

- [ ] Normal card mode is readable for mark-only, note-only, and mark-and-note annotations.
- [ ] Compact card mode remains usable and does not hide essential identity.
- [ ] Selected text, note preview, mark, status, tags, and actions have stable positions.
- [ ] Long selected text does not overlap actions or metadata.
- [ ] Long notes wrap or clamp predictably.
- [ ] Tags and metadata wrap, collapse, or move without breaking layout.
- [ ] Resolved annotations remain in document order with lower visual emphasis.
- [ ] Orphaned annotations remain near last-known document position when possible.

## Card Actions

- [ ] Direct card actions are minimal and match the confirmed design.
- [ ] Secondary actions are grouped in the more menu.
- [ ] Dangerous actions require confirmation.
- [ ] Add or edit note works from the card.
- [ ] Edit mark and edit tags work from the card or local edit panel.
- [ ] Rebind is available for orphaned annotations.
- [ ] Adjust range is available for normal annotations when supported.
- [ ] Only one local edit panel is open at a time.

## Sidebar Toolbar And Filters

- [ ] Sidebar count shows total count when no filter is active.
- [ ] Sidebar count shows filtered count and total count when filters are active.
- [ ] Density switch does not reset filters or reorder cards.
- [ ] Hide or show source marks toggle does not hide sidebar cards.
- [ ] Status, mark, note-state, and keyword filters work together.
- [ ] Color and tag filters remain accessible where planned.
- [ ] Filtering preserves document-order sorting.
- [ ] Empty, filtered-empty, loading, unsupported, and marks-hidden states are distinct.

## Navigation And Focus

- [ ] Clicking a card navigates to the source text when possible.
- [ ] There is no separate jump button on the card.
- [ ] Clicking source text or source mark focuses the matching card when possible.
- [ ] Source target scrolls toward the visual center when possible.
- [ ] Sidebar target scrolls toward the visual center when possible.
- [ ] Temporary focus feedback is visible and not distracting.
- [ ] No connector-line system is introduced in `0.9.0`.

## Creation Toolbar And More Panel

- [ ] Selection toolbar appears only for usable selections.
- [ ] Toolbar direct actions include highlight, underline, strikethrough, and More.
- [ ] Direct mark actions do not require note text.
- [ ] More panel supports optional note, mark, color, and tags.
- [ ] More panel does not include fixed annotation type fields.
- [ ] Duplicate selection updates existing annotations where planned.
- [ ] Invalid selections fail without creating partial annotations.

## Cross-Note Overview

- [ ] Cross-note cards share visual language with sidebar cards.
- [ ] Cross-note cards show source document context more clearly than current-document cards.
- [ ] Clicking a cross-note card opens the source document.
- [ ] After opening, the source annotation is focused or the failure state is clear.
- [ ] Cross-note overview does not become the primary complex editing surface.
- [ ] Mark-only annotations remain visible in cross-note overview.

## Settings And Global Controls

- [ ] Settings are grouped by display, creation, sidebar, data maintenance, and language.
- [ ] Data maintenance tools are visually separate from normal preferences.
- [ ] Language setting is easy to find.
- [ ] Sidebar toolbar can link to settings without duplicating the settings page.
- [ ] Card-level actions and plugin-level controls are not mixed together.

## Responsive Layout And Theme

- [ ] Narrow desktop sidebar remains usable.
- [ ] Normal and wide desktop sidebars remain readable.
- [ ] Increased Obsidian zoom does not clip text or overlap controls.
- [ ] Simplified Chinese and English are both checked.
- [ ] Light and dark themes are both checked.
- [ ] Cards, toolbars, filters, panels, and settings do not show incoherent overlap.
- [ ] The UI uses Obsidian theme variables where appropriate.

## Stage 8 Compatibility

- [ ] Stage 8 mark/note model is not reopened.
- [ ] Mark-only annotations remain visible in the sidebar.
- [ ] Note-only annotations remain understandable without a visible source mark.
- [ ] Markdown draft copy still excludes mark-only entries according to Stage 8.
- [ ] Legacy `annotationType` data remains compatible but is not exposed as current UI.

## Release Readiness

- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Local desktop Obsidian test install is updated.
- [ ] Manual checks are completed in source mode and reading mode.
- [ ] Release notes describe UI and interaction polish without claiming mobile support.
