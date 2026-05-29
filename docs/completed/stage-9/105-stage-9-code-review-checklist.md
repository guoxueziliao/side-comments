# Stage 9: Code Review Checklist

Status: Confirmed

## Scope

This document defines the code review checklist for `0.9.0`.

The review should focus on regressions and maintainability risks introduced while polishing UI, interaction, copy, and layout.

## Product Boundary

- [ ] The implementation remains desktop Obsidian only.
- [ ] No mobile, tablet, or other non-desktop-specific code path is introduced.
- [ ] Small-width handling is implemented as desktop layout robustness, not mobile support.
- [ ] Release notes and settings do not imply mobile support.

## Stage 8 Model Safety

- [ ] The Stage 8 model `Annotation = Anchor + Optional Mark + Optional Note` is not reopened.
- [ ] No required annotation type field is reintroduced.
- [ ] Mark-only annotations remain valid.
- [ ] Note-only annotations remain valid.
- [ ] Mark-and-note annotations remain valid.
- [ ] Legacy `annotationType` data remains readable where already supported.
- [ ] No batch migration is added only for Stage 9 UI polish.

## Import Export And Compatibility

- [ ] JSON export still preserves compatibility fields as planned.
- [ ] JSON import still handles older data safely.
- [ ] Markdown draft copy still excludes mark-only entries according to Stage 8.
- [ ] Health check and repair behavior is not weakened by UI copy changes.
- [ ] Data maintenance tools are not accidentally moved into card-level actions.

## I18n And Copy

- [ ] All new visible strings go through i18n.
- [ ] Chinese and English keys are both present.
- [ ] Terms match `102-stage-9-ui-copy-and-labels.md`.
- [ ] User-visible `批注类型 / 摘录 / 问题 / 想法 / 任务` entries are removed or hidden.
- [ ] Icon-only buttons have localized tooltips.
- [ ] Notices are short and do not expose storage internals.

## Card Component Design

- [ ] Card rendering supports mark-only, note-only, and mark-and-note states.
- [ ] Current-document sidebar and cross-note overview do not fork into unrelated card designs.
- [ ] Shared card code does not assume the source document is already open.
- [ ] Current-document-only behavior is not forced into cross-note cards.
- [ ] Resolved and orphaned visual states are handled consistently.
- [ ] Card order is not changed by edits to notes, tags, or status.

## Actions And Safety

- [ ] Destructive actions require confirmation.
- [ ] Delete, repair, rebind, and adjust-range failures show clear feedback.
- [ ] Rebind is limited to orphaned annotations unless a confirmed workflow says otherwise.
- [ ] Adjust range does not create duplicate annotations for the same selected range.
- [ ] Cancelling an edit panel leaves the annotation unchanged.
- [ ] Only one local edit panel can be active at a time.

## Navigation And Focus

- [ ] Card click handles navigation to source text.
- [ ] No separate jump button is reintroduced on cards.
- [ ] Source mark click focuses the matching card when possible.
- [ ] Scroll-to-target logic aims for visual center where practical.
- [ ] Temporary focus feedback is cleaned up after it expires.
- [ ] Navigation failure does not leave stale focus state.

## Toolbar Filters And Empty States

- [ ] Sidebar count handles unfiltered and filtered states.
- [ ] Density switching does not reset filters.
- [ ] Hide source marks does not hide sidebar cards.
- [ ] Filter combinations are deterministic.
- [ ] Empty, filtered-empty, loading, unsupported, and marks-hidden states are distinct.
- [ ] More menus do not become dumping grounds for unrelated actions.

## Creation Flow

- [ ] Selection toolbar only appears for valid selections.
- [ ] Direct mark actions do not require note text.
- [ ] More panel fields are optional where planned.
- [ ] Duplicate selection updates existing annotations where planned.
- [ ] Anchor creation failure does not leave partial annotations.
- [ ] Source mode and reading mode selection behavior are both reviewed.

## CSS Layout And Theme

- [ ] Styles prefer Obsidian CSS variables for colors and surfaces.
- [ ] Hard-coded colors are justified and theme-safe.
- [ ] Fixed heights do not clip text at increased zoom.
- [ ] Narrow desktop sidebar does not cause overlapping controls.
- [ ] Long selected text, long notes, and long tags degrade predictably.
- [ ] Light and dark themes remain legible.
- [ ] CSS selectors are scoped to the plugin and do not leak into Obsidian globally.

## Settings And Global Controls

- [ ] Settings are grouped by workflow rather than implementation internals.
- [ ] Data maintenance tools are visually separate from ordinary preferences.
- [ ] Sidebar toolbar links to settings without duplicating settings content.
- [ ] Card-level menus do not include unrelated global controls.
- [ ] Language switching is easy to find and does not require restart assumptions unless true.

## Tests And Verification

- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Relevant unit tests are updated or added.
- [ ] Manual desktop Obsidian verification covers source mode and reading mode.
- [ ] Manual verification covers Simplified Chinese and English.
- [ ] Manual verification covers light theme, dark theme, narrow sidebar, and increased zoom.

## Review Outcome

Any issue found during review should be classified as:

- release blocker;
- follow-up before release;
- follow-up after release;
- explicitly out of scope.

Do not silently accept regressions because Stage 9 is "only UI polish".
