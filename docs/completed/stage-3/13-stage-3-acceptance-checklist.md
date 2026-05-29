# Stage 3: Acceptance Checklist

Status: Confirmed

## Goal

Provide a concrete checklist for deciding whether `0.3.0` sidebar workflow work is complete.

## `0.3.0-alpha`: Stable List Structure

- Comments render in one main document-order list.
- Active, orphaned, and resolved comments do not move into separate status groups.
- Comment order follows document position regardless of status.
- Orphaned comments use their last known position for sorting.
- Orphaned comments show full cards by default.
- Orphaned cards show original selected text and surrounding context.
- Orphaned cards expose the rebind action `绑`.
- Resolved comments stay at their document position.
- Resolved comments use in-place folded display by default.
- Resolved comments can expand to full cards.

## `0.3.0-beta`: Display Modes and Navigation

- Sidebar supports normal mode.
- Sidebar supports compact mode.
- Compact mode shows status, type or color, selected text summary, note preview, and key actions.
- Compact mode preserves document-order sorting.
- Sidebar display mode persists as a global plugin setting.
- Resolved visibility persists as a global plugin setting.
- No per-document sidebar display state is written.
- Card-to-document jump scrolls the target near the current pane's visual center when possible.
- Card-to-document jump shows a temporary text highlight for 2 seconds.
- Document-mark click opens or focuses the sidebar card.
- Document-mark click shows a temporary card highlight for 2 seconds.
- Hovering document marks does not scroll the sidebar.

## `0.3.0-final`: Filtering and Polish

- Keyword filter works in the current document.
- Status filter works in the current document.
- Color filter works in the current document.
- Annotation type filter works in the current document.
- Filters can be combined.
- Filtering hides non-matching comments without changing document-order sorting.
- Clear filters action works.
- Show resolved action works when resolved comments are hidden.
- Empty state `当前文档还没有批注` appears when the current document has no comments.
- Empty state `没有符合筛选条件的批注` appears when filters match nothing.
- Empty state `已解决批注已隐藏` appears when only hidden resolved comments remain.
- Empty state `当前视图暂不支持正文批注` appears for unsupported views.

## Local Obsidian Verification

- Test with source mode.
- Test with reading mode.
- Test with a note containing many comments.
- Test with active, resolved, and orphaned comments mixed together.
- Test with repeated selected text.
- Test sidebar behavior after switching files.
- Test sidebar behavior after reopening Obsidian.
- Test local vault install at `C:\Users\FAN\Desktop\全域智库\.obsidian\plugins\side-comments`.

## Release Readiness

- `npm run typecheck` passes.
- `npm run build` passes.
- Built files are copied to the local test plugin directory.
- `manifest.json` version is updated.
- `package.json` version is updated.
- `versions.json` is updated.
- Release assets include `main.js`, `manifest.json`, and `styles.css`.
