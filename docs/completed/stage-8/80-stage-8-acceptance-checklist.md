# Stage 8 Acceptance Checklist

Status: Confirmed

This checklist defines what must be verifiable in a test vault before `0.8.0` is treated as complete.

## Data Compatibility

- [ ] Existing sidecars with `annotationType` load without errors.
- [ ] Existing `annotationType` values are not shown in the UI.
- [ ] Missing `annotationType` is not reported as a warning or error.
- [ ] Unknown legacy `annotationType` values are ignored or preserved as inert compatibility data.
- [ ] Existing `mark.type = "note"` with note content displays as note-only.
- [ ] Existing `mark.type = "note"` without note content is reported by health check as invalid empty annotation data.
- [ ] Existing highlight, underline, and strikethrough annotations without note content display as mark-only.
- [ ] Existing highlight, underline, and strikethrough annotations with note content display as mark-and-note.
- [ ] Legacy purple or comment-like visual styling displays as a normal visual mark with its stored color.
- [ ] No automatic batch migration rewrites old sidecars only for Stage 8 compatibility.

## Creation Flow

- [ ] Source mode selection toolbar shows highlight, underline, strikethrough, and more.
- [ ] Reading mode selection toolbar shows highlight, underline, strikethrough, and more.
- [ ] Primary highlight button creates mark-only with default or last-used highlight color.
- [ ] Primary underline button creates mark-only with default or last-used underline color.
- [ ] Primary strikethrough button creates mark-only with default or last-used strikethrough color.
- [ ] More modal shows mark, color, initial note, cancel, and create controls.
- [ ] More modal can create note-only when mark is no visible mark and note content is present.
- [ ] More modal can create mark-only when mark is visible and note content is empty.
- [ ] More modal can create mark-and-note when mark is visible and note content is present.
- [ ] More modal blocks no visible mark plus empty note.
- [ ] Creation UI does not show fixed annotation type controls.

## Duplicate Selection Behavior

- [ ] Creating the same mark on the same selected range does not create a duplicate annotation.
- [ ] Adding a note to an existing mark-only annotation turns it into mark-and-note.
- [ ] Adding a mark to an existing note-only annotation turns it into mark-and-note.
- [ ] Changing mark type or color on an existing mark-and-note annotation updates the existing annotation.
- [ ] Stage 8 does not create multiple independent notes on the same anchor.

## Source Rendering

- [ ] Mark-only annotations render their visible mark in source mode.
- [ ] Mark-only annotations render their visible mark in reading mode.
- [ ] Mark-and-note annotations render their visible mark in source mode.
- [ ] Mark-and-note annotations render their visible mark in reading mode.
- [ ] Note-only annotations use a lightweight indicator, not a highlight-style background.
- [ ] Hide annotation marks hides highlight, underline, strikethrough, and note-only indicators.
- [ ] Toggling hidden marks does not leave stale decorations.
- [ ] Resolved and orphaned states remain visually distinguishable.

## Sidebar Cards

- [ ] Mark-only cards appear by default in the current-document sidebar.
- [ ] Note-only cards appear by default in the current-document sidebar.
- [ ] Mark-and-note cards appear by default in the current-document sidebar.
- [ ] Mark-only cards show selected text, mark type, color, and management actions.
- [ ] Mark-only cards do not show an empty-note placeholder.
- [ ] Note-only cards show selected text and note content without implying a visible mark.
- [ ] Mark-and-note cards show selected text, mark type, color, note content, tags, and status.
- [ ] Orphaned cards show original context and rebind actions.
- [ ] Clicking a card or jump action navigates to the source text when possible.

## Card State Transitions

- [ ] Add note turns mark-only into mark-and-note.
- [ ] Add mark turns note-only into mark-and-note.
- [ ] Remove mark from mark-and-note turns it into note-only.
- [ ] Delete note from mark-and-note turns it into mark-only.
- [ ] Remove mark from mark-only deletes the whole annotation after confirmation where needed.
- [ ] Delete note from note-only deletes the whole annotation after confirmation where needed.
- [ ] Delete card always deletes the whole annotation.
- [ ] No action leaves an annotation with neither visible mark nor note content.
- [ ] Orphaned annotations can be rebound before normal adjust-range actions are used.

## Filters And Cross-Note Overview

- [ ] Current-document filters no longer include annotation type.
- [ ] Cross-note overview filters no longer include annotation type.
- [ ] Status filter works.
- [ ] Visual mark filter supports all, highlight, underline, strikethrough, and no visible mark.
- [ ] Color filter works.
- [ ] Tags filter works.
- [ ] Keyword filter searches annotation-derived fields only, not full Markdown body.
- [ ] Note state filter supports all, has note, and no note.
- [ ] Cross-note overview shows mark-only annotations by default.
- [ ] Copy Markdown draft excludes mark-only annotations.

## Import, Export, And Health Check

- [ ] JSON export preserves legacy `annotationType` where it exists.
- [ ] JSON import accepts legacy `annotationType` without showing it in the UI.
- [ ] Markdown export omits annotation type.
- [ ] Markdown draft copy omits annotation type.
- [ ] Health check does not report present `annotationType` as a problem.
- [ ] Health check does not report missing `annotationType` as a problem.
- [ ] Health check reports invalid empty annotation data after Stage 8 interpretation.

## UI Copy And i18n

- [ ] Simplified Chinese UI does not expose `摘录`, `问题`, `想法`, `任务`, or `批注类型` as annotation type controls.
- [ ] English UI does not expose `Excerpt`, `Question`, `Thought`, `Task`, or `Annotation type` as annotation type controls.
- [ ] UI consistently uses `标记`, `备注`, and `批注`.
- [ ] UI consistently uses `Mark`, `Note`, and `Annotation`.
- [ ] `无标记`, `有备注`, and `无备注` labels match the confirmed copy.
- [ ] `No visible mark`, `Has note`, and `No note` labels match the confirmed copy.

## Release Checks

- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Markdown relative link check passes.
- [ ] Version files are bumped only when implementation is ready for release.
- [ ] Local Obsidian test install is synced before release handoff.
- [ ] Built `main.js`, `manifest.json`, and `styles.css` are present in the release package.
