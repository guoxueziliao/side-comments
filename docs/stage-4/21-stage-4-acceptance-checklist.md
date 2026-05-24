# Stage 4: Acceptance Checklist

Status: Confirmed

This checklist defines what must be true before `0.4.0` is considered complete.

## Pre-`0.4.0` Bugfix

- A comment whose selected text appears multiple times renders only at one resolved anchor location.
- Identical selected text outside the resolved range is not marked.
- If the plugin cannot determine one reliable location, the comment becomes orphaned instead of rendering in multiple places.
- The case document `01-文档/2026/05/2026-05-20_520现在的爱藏在过去之中.md` is covered as a regression case.
- Sidebar card count remains one card per sidecar comment.

## Multi-Language Support

- Simplified Chinese UI is available.
- English UI is available.
- Unsupported locales fall back to English.
- Visible UI text, tooltips, notices, commands, settings, and empty states use the translation layer where practical.
- Existing short action labels such as `绑` and `调` are represented through translation keys.
- No new Stage 4 UI hard-codes user-facing text directly in components unless there is a clear technical reason.

## One-Click Hide Annotation Marks

- Sidebar has a `隐藏标注` / `显示标注` toggle.
- Command palette has `切换正文批注标记显示`.
- Hiding marks does not change sidecar data.
- Existing document marks disappear while hidden mode is active.
- Sidebar cards remain visible and usable.
- Selecting text while hidden mode is active does not show the create-annotation toolbar.
- Restarting Obsidian restores visible marks by default.

## Zoom And Scale Adaptation

- Sidebar remains usable at 100%, 125%, and 150% display scale.
- Narrow sidebar layout does not create incoherent text overlap.
- Primary actions remain reachable without horizontal scrolling.
- Floating create toolbar stays inside the visible pane area.
- Annotation marks do not break line height or reading flow.
- Compact mode works as the fallback for narrow pane widths.

## Cross-Note Review Page

- A cross-note review page can be opened.
- Opening the page reads `.obsidian-side-comments/cache/recent.json` when available.
- The initial result range follows `maxCachedDocuments`, currently 100.
- Opening the page does not scan all sidecar files.
- Plugin startup does not build a cross-note index.
- No background full-vault sidecar scan runs in the first release.
- Results show source file name, selected text excerpt, note preview, status, type, and color.
- Results do not expose hash, sidecar path, offset, line, column, schema version, or internal cache keys.
- Keyword search matches selected text, note content, source file path, source file name, and status text.
- Keyword search does not scan Markdown document body content.
- Filters support status, color, annotation type, keyword, and source document.
- Date filtering is not present in the first release.
- Result actions can open the source note.
- Result actions can jump to document text and the matching sidebar card.

## Read-Only Boundary

- The cross-note review page does not directly edit comment content.
- The cross-note review page does not delete comments.
- The cross-note review page does not resolve or restore comments.
- The cross-note review page does not rebind orphaned comments.
- The cross-note review page does not adjust annotation ranges.
- Editing and state changes still happen in the source document sidebar.

## Performance Boundary

- Large vaults are not penalized on startup.
- The cross-note page is usable when only recent preview data is available.
- Full sidecar data is loaded on demand only when an action requires it.
- Missing or invalid recent preview data shows a recoverable empty/error state rather than breaking the plugin.

## Release Boundary

- `0.4.0` does not add import, export, or data maintenance tools.
- `0.4.0` does not add AI summary or automatic analysis.
- `0.4.0` does not add full Markdown content search.
- `0.4.0` does not add full-vault indexing.
- Deferred features remain documented for later stages.
