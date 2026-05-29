# Stage 4: Implementation Order

Status: Confirmed

This document defines the recommended implementation sequence for `0.4.0`.

## Release Shape

`0.4.0` should include:

- pre-release fix for duplicate annotation rendering on repeated text;
- Simplified Chinese and English UI infrastructure;
- one-click annotation mark hiding;
- zoom and scale adaptation checks;
- read-only cross-note annotation review page.

## Order

### 1. Fix Duplicate Rendering On Repeated Text

Goal:

- one sidecar comment renders at one resolved anchor location only.

Work:

- use resolved anchor ranges for rendering;
- ignore identical selected text outside the resolved range;
- prefer offset, context, and line-column data when text repeats;
- mark low-confidence matches as orphaned instead of rendering in multiple locations;
- add a regression case for `01-文档/2026/05/2026-05-20_520现在的爱藏在过去之中.md`.

Reason:

- cross-note review depends on reliable jumps from result cards to document text.

### 2. Add Multi-Language Foundation

Goal:

- make visible plugin UI available in Simplified Chinese and English.

Work:

- add stable translation keys;
- move visible strings, tooltips, notices, setting labels, command names, and empty states into translation dictionaries where practical;
- default to Obsidian locale;
- fall back to English for unsupported locales;
- keep Simplified Chinese wording as the source intent and provide English translations.

Reason:

- later Stage 4 UI should not add more hard-coded text that must be migrated again.

### 3. Add One-Click Annotation Mark Hiding

Goal:

- allow temporary reading mode without visible document annotation marks.

Work:

- add global temporary hide/show state;
- add sidebar toggle: `隐藏标注` / `显示标注`;
- add command palette command: `切换正文批注标记显示`;
- hide document marks without mutating sidecar data;
- keep sidebar cards usable;
- suppress the create-annotation toolbar while marks are hidden;
- restore visible marks by default after Obsidian restart.

Reason:

- this is a focused workflow improvement and does not depend on cross-note indexing.

### 4. Verify Zoom And Scale Adaptation

Goal:

- keep the annotation UI usable under common zoom and pane-width conditions.

Work:

- check 100%, 125%, and 150% display scale;
- check narrow sidebar behavior;
- ensure toolbar buttons, filters, and cards do not overlap;
- keep floating annotation toolbar within the visible pane;
- use compact mode as the preferred narrow-pane fallback.

Reason:

- Stage 4 adds more UI surface, so layout stability should be checked before the cross-note page is finalized.

### 5. Build Read-Only Cross-Note Review Page

Goal:

- provide the first cross-note annotation overview and search page.

Work:

- open a dedicated review page/view;
- read `.obsidian-side-comments/cache/recent.json` on page open;
- use the existing `maxCachedDocuments` range, currently 100;
- render lightweight result cards;
- support keyword search over sidecar-derived fields;
- support filters for status, color, type, and source document;
- allow opening the source note;
- allow jumping to document text and matching sidebar card;
- do not directly edit, delete, resolve, restore, rebind, or adjust ranges from this page.

Reason:

- the first version should prove retrieval, performance, and navigation before adding cross-note mutation actions.

## Deferred

- full-vault sidecar index;
- background index refresh;
- load-more beyond the recent range;
- cross-note direct editing;
- date filtering;
- folder or tag scoped filtering;
- import, export, and data maintenance.
