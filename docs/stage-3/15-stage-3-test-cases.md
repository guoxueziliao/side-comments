# Stage 3: Test Cases

Status: Confirmed

## Goal

Define concrete test cases for `0.3.0` sidebar workflow changes.

These cases focus on current-document sidebar behavior. Cross-note search and full-vault review are out of scope.

## Test Notes

Prepare at least these local vault notes:

1. `side-comments-stage3-basic.md`
   - 5 to 10 comments;
   - mixed active, resolved, and orphaned comments;
   - comments placed near the top, middle, and bottom of the note.

2. `side-comments-stage3-many.md`
   - 50 or more comments;
   - enough comments to require sidebar scrolling;
   - mixed colors and annotation types.

3. `side-comments-stage3-repeated-text.md`
   - repeated selected text appears multiple times;
   - comments are placed on different repeated instances.

4. `side-comments-stage3-reading-mode.md`
   - headings;
   - lists;
   - bold and italic text;
   - links;
   - comments created or viewed in reading mode.

## Sorting and Status

### Mixed Status Order

Steps:

1. Open `side-comments-stage3-basic.md`.
2. Create or load active, resolved, and orphaned comments in mixed document positions.
3. Open the sidebar.

Expected:

- comments appear in document order;
- active, resolved, and orphaned comments are not moved into separate status groups;
- resolved comments remain at their original document positions;
- orphaned comments use their last known positions.

### Resolved In-Place Folding

Steps:

1. Mark a middle comment as resolved.
2. Refresh the sidebar or switch away and back.

Expected:

- the resolved comment remains in the same document position;
- it displays as a folded one-line item by default;
- clicking it expands the full card;
- it is not moved to the bottom.

### Orphaned Full Card

Steps:

1. Use a note with an orphaned comment.
2. Open the sidebar.

Expected:

- the orphaned comment remains in document-order position;
- it displays as a full card;
- it shows original selected text;
- it shows surrounding context;
- it shows the rebind action `绑`;
- it does not show internal offset, line, or column data.

## Display Modes

### Normal and Compact Switch

Steps:

1. Open a note with multiple comments.
2. Switch from normal mode to compact mode in the sidebar.
3. Switch back to normal mode.

Expected:

- both modes render the same filtered comment set;
- order does not change;
- compact mode shows status, type or color, selected text summary, note preview, and key actions;
- normal mode shows full card details.

### Display Preference Persistence

Steps:

1. Switch to compact mode.
2. Close and reopen the note.
3. Restart Obsidian or reload the plugin.

Expected:

- compact mode remains active because it is a global plugin setting;
- no per-document display setting is created;
- sidebar state does not depend on the specific note path.

### Non-Persisted Temporary UI State

Steps:

1. Expand a folded resolved item.
2. Apply temporary filters.
3. Switch files or reload the plugin.

Expected:

- per-card expanded state is not permanently stored;
- filter state is not permanently stored per document;
- global display mode remains stored.

## Navigation

### Card to Document in Source Mode

Steps:

1. Open a note in source mode.
2. Click a sidebar card body or jump action.

Expected:

- the target text scrolls near the current pane's visual center when possible;
- the target text receives a temporary highlight for 2 seconds;
- the comment's stored color and mark type are unchanged.

### Card to Document in Reading Mode

Steps:

1. Open a note in reading mode.
2. Click a sidebar card body or jump action.

Expected:

- the rendered target text scrolls near the current pane's visual center when possible;
- the target receives temporary highlight feedback;
- no sidecar data is modified by the jump.

### Document Mark to Card

Steps:

1. Click a marked annotation in the document.

Expected:

- the sidebar opens if it is closed;
- the matching card scrolls into view;
- the target card receives a temporary highlight for 2 seconds;
- hovering the mark does not move the sidebar.

### Repeated Jumps

Steps:

1. Jump to one comment.
2. Before the temporary highlight ends, jump to another comment.

Expected:

- the first temporary highlight is cleared;
- the new target receives the active temporary highlight;
- no stale highlight remains.

## Filtering

### Combined Filters

Steps:

1. Apply a keyword filter.
2. Add a status filter.
3. Add a color filter.
4. Add an annotation type filter.

Expected:

- filters combine together;
- only matching comments remain visible;
- document-order sorting is preserved among visible comments;
- clearing filters restores the full visible set.

### Empty States

Test these cases:

- no comments in the current document;
- comments exist but filters match nothing;
- only resolved comments exist while resolved comments are hidden;
- unsupported current view.

Expected:

- no comments: `当前文档还没有批注`;
- no filter matches: `没有符合筛选条件的批注`;
- only hidden resolved comments: `已解决批注已隐藏`;
- unsupported view: `当前视图暂不支持正文批注`;
- relevant actions appear: `清除筛选` or `显示已解决`.

## Performance

### Many Comments

Steps:

1. Open `side-comments-stage3-many.md`.
2. Switch between normal and compact mode.
3. Apply and clear filters.
4. Jump between several comments.

Expected:

- sidebar remains responsive;
- no full-vault scan occurs;
- no per-file settings map grows during the test;
- temporary highlight timers are cleaned up.

## Regression Checks

- Existing comment creation still works.
- Existing edit, delete, resolve, restore, jump, rebind, and range adjustment actions still work.
- Source mode still renders marks.
- Reading mode still renders marks.
- Existing `0.1.x` and `0.2.x` sidecar files still load.
- `npm run typecheck` passes.
- `npm run build` passes.
