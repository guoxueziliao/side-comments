# Stage 8 Manual Test Cases

Status: Confirmed

These cases cover manual UI and non-goal checks for `0.8.0`.

## Manual Tests: Creation Flow

### T-CR-1: Source Mode Toolbar

1. In source mode, select text.
2. Create highlight, underline, and strikethrough from primary toolbar buttons.
3. Confirm each creates mark-only by default.
4. Open more modal and create note-only, mark-only, and mark-and-note.
5. Confirm no fixed annotation type control is visible.

### T-CR-2: Reading Mode Toolbar

1. In reading mode, select text.
2. Repeat T-CR-1.
3. Confirm created annotations map back to the correct source range when selection mapping succeeds.

### T-CR-3: Duplicate Selection

1. Select the same text twice.
2. Create the same visual mark twice.
3. Confirm no duplicate card is created.
4. Add a note to the same selected range.
5. Confirm the existing annotation updates to mark-and-note.

## Manual Tests: Rendering And Sidebar

### T-RS-1: Source And Reading Rendering

1. Create mark-only, note-only, and mark-and-note annotations.
2. Check source mode rendering.
3. Check reading mode rendering.
4. Confirm note-only uses a lightweight indicator, not a highlight-style background.

### T-RS-2: Hide Marks

1. Create highlight, underline, strikethrough, note-only, and mark-and-note annotations.
2. Turn on hide annotation marks.
3. Confirm all source indicators are hidden.
4. Confirm sidebar cards remain visible.
5. Turn the setting off and confirm rendering returns.

### T-RS-3: Sidebar Cards

1. Confirm mark-only, note-only, and mark-and-note cards appear by default.
2. Confirm mark-only cards do not show empty-note placeholder text.
3. Confirm note-only cards do not imply a visible mark.
4. Confirm card click and jump action navigate to source text.

## Manual Tests: Cross-Note Overview

### T-XN-1: Mark-Only Visibility

1. Create mark-only annotations in two notes.
2. Open cross-note overview.
3. Confirm mark-only annotations appear by default.

### T-XN-2: Cross-Note Filters

1. Use a mixed set of mark-only, note-only, and mark-and-note annotations.
2. Test visual mark, note state, color, tags, keyword, and status filters.
3. Confirm annotation type is not present as a filter.

## Non-Goal Tests

### N-1: Fixed Types Do Not Return

1. Search the UI for fixed type controls.
2. Confirm `摘录`, `问题`, `想法`, `任务`, and `批注类型` are not exposed as annotation type controls.
3. Confirm `Excerpt`, `Question`, `Thought`, `Task`, and `Annotation type` are not exposed as annotation type controls.

### N-2: No Deferred Product Features

1. Confirm there are no saved views or saved filters.
2. Confirm there are no review queues.
3. Confirm there is no priority or importance field.
4. Confirm there is no automatic AI summary, classification, rewrite, or repair suggestion.
5. Confirm there is no full-vault Markdown body search.
