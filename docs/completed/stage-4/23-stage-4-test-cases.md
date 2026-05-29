# Stage 4: Test Cases

Status: Confirmed

These are concrete test cases for `0.4.0`.

## Duplicate Rendering

### Repeated selected text in one document

Setup:

- Use `01-文档/2026/05/2026-05-20_520现在的爱藏在过去之中.md`.
- Use sidecar comments whose selected text appears multiple times in the note.

Expected:

- each comment renders at one location only;
- repeated matching text elsewhere is not marked;
- the sidebar shows one card per sidecar comment.

### Ambiguous relocation

Setup:

- Create or modify a note so the same selected text appears in multiple equivalent locations.
- Remove enough context that the original location cannot be confidently determined.

Expected:

- the comment becomes orphaned;
- the comment does not render in multiple places.

## One-Click Hide Marks

### Hide and show document marks

Steps:

- Open a note with active annotations.
- Click `隐藏标注`.
- Click `显示标注`.

Expected:

- marks disappear while hidden;
- marks reappear after showing;
- sidecar files are unchanged.

### Hidden mode suppresses creation

Steps:

- Enable hidden mode.
- Select text in the document.

Expected:

- text selection still works;
- create-annotation toolbar does not appear.

### Restart behavior

Steps:

- Enable hidden mode.
- Restart Obsidian.

Expected:

- marks are visible by default after restart.

## Multi-Language

### Simplified Chinese locale

Setup:

- Run with Simplified Chinese locale.

Expected:

- visible labels, tooltips, notices, settings, commands, and empty states display Chinese text.

### English or unsupported locale

Setup:

- Run with English locale.
- Run with an unsupported locale.

Expected:

- English displays in English locale;
- unsupported locale falls back to English.

## Cross-Note Review Page

### Open review page from recent preview cache

Setup:

- Ensure `.obsidian-side-comments/cache/recent.json` exists.

Expected:

- the cross-note page opens;
- results are rendered from recent preview data;
- no full sidecar directory scan occurs.

### Missing recent preview cache

Setup:

- Temporarily remove or rename `recent.json`.

Expected:

- the page shows a recoverable empty or unavailable state;
- the plugin does not crash;
- startup remains unaffected.

### Keyword search

Steps:

- Search for text that appears in selected text.
- Search for text that appears in comment note content.
- Search for a source file name.

Expected:

- matching annotations are shown;
- non-matching annotations are hidden;
- Markdown body text outside sidecar data is not searched.

### Filters

Steps:

- Filter by status.
- Filter by color.
- Filter by annotation type.
- Filter by source document.
- Combine keyword and filters.

Expected:

- filters compose without changing underlying data;
- clearing filters restores the recent result set.

### Result actions

Steps:

- Click open source document.
- Click jump to document text.

Expected:

- the source note opens;
- the target annotation is revealed in the document;
- the matching sidebar card is revealed;
- the cross-note page does not directly mutate the comment.

## Read-Only Boundary

Expected absent actions:

- edit;
- delete;
- resolve;
- restore;
- rebind;
- adjust range.

These actions should remain available only through the source document sidebar where applicable.

## Zoom And Layout

### Scale checks

Setup:

- Test at 100%, 125%, and 150% display scale.

Expected:

- toolbar buttons do not overlap;
- filter controls remain usable;
- cards do not create incoherent text overlap;
- primary actions remain reachable.

### Narrow sidebar

Setup:

- Resize the sidebar to a narrow width.

Expected:

- compact mode remains usable;
- controls wrap, collapse, or fit without horizontal scrolling for primary actions.
