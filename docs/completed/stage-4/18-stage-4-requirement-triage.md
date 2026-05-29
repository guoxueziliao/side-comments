# Stage 4: Requirement Triage

Status: To discuss

This document records new requirements raised before finalizing `0.4.0` scope.

## Confirmed Stage 4 Baseline

`0.4.0` is planned around cross-note annotation review and search.

Baseline constraints:

- use sidecar annotation data as the main source;
- do not default to full-vault Markdown content scanning;
- keep import, export, data maintenance, and AI summary out of the baseline unless separately confirmed.

## New Requirements

### 1. One-Click Hide Annotation Marks

Status: Confirmed

Need:

- a fast way to hide visible annotation marks while keeping annotation data unchanged.

Confirmed decisions:

- one-click hiding is a global temporary display mode;
- it hides annotation marks in document content;
- it does not delete, edit, migrate, or otherwise mutate sidecar data;
- the sidebar remains visible and usable while marks are hidden;
- comment cards can still be edited, jumped to, filtered, resolved, restored, adjusted, or rebound according to their normal status rules;
- hidden mode does not persist across Obsidian restart;
- after restart, annotation marks are shown by default.
- users can still select text while marks are hidden, but the create-annotation toolbar should not appear;
- creating a new annotation requires switching marks back to visible first.

UI entry points:

- sidebar top toggle button: `隐藏标注` / `显示标注`;
- command palette command: `切换正文批注标记显示`.

Rationale:

- hidden mode is mainly for reading, screenshots, and focused review;
- if creation stayed enabled, users could create an annotation but not see its document mark, which is easy to mistake for a failed action.

### 2. Duplicate Rendering on Repeated Text

Status: Confirmed pre-`0.4.0` bugfix

Case document:

- `01-文档/2026/05/2026-05-20_520现在的爱藏在过去之中.md`

Vault path used for reproduction:

- `/mnt/c/Users/FAN/Desktop/全域智库/01-文档/2026/05/2026-05-20_520现在的爱藏在过去之中.md`

Observed data:

- sidecar file has 3 comments for this document;
- the selected text for each comment appears multiple times in the Markdown document;
- repeated text appears in both the main article body and later distilled/related sections.

Observed occurrence counts:

- `但是关于这部电影的解读，群友说其我早就已经写完了。`: 3 occurrences.
- `如今这个时代或者下一个时代就不好说了`: 4 occurrences.
- `时代主流价值背离的评价或者贬损呢`: 3 occurrences.

Requirement:

- one comment should render at its resolved anchor location only;
- identical text elsewhere in the same note must not receive the same annotation mark;
- the sidebar should still show one card per sidecar comment, not one card per text occurrence.
- if offset, context, and line-column data cannot identify one reliable location, the comment should become orphaned instead of rendering in multiple places.

Likely implementation direction:

- rendering should use resolved anchor ranges, not plain selected-text matching;
- when selected text repeats, offset/context/line-column data should decide the target;
- repeated matches outside the resolved range should be ignored;
- if confidence is low, mark the comment as orphaned instead of rendering it in multiple places.

Release placement:

- fix before `0.4.0` cross-note review work;
- treat as a current-document annotation correctness bug, not as a Stage 4 search feature;
- use this document as a regression test case.

Rationale:

- cross-note review will depend on reliable card-to-document jumps;
- leaving repeated-text rendering unresolved would make later search results appear unreliable even if the search itself is correct.

### 3. Zoom and Scale Adaptation

Status: Confirmed

Need:

- annotation UI should stay usable under different Obsidian zoom levels, pane widths, and display scale settings.

Confirmed scope:

- sidebar buttons, filters, and card content must not overlap after zoom changes;
- narrow sidebars should wrap, collapse, or compact controls instead of overflowing;
- the create-annotation floating toolbar should stay within the visible pane area;
- annotation marks should not break text line height or reading flow under zoom;
- compact mode is the preferred fallback for narrow pane widths;
- the plugin should adapt to Obsidian's current display environment, not control browser or app zoom itself.

Acceptance targets:

- usable at 100%, 125%, and 150% display scale;
- usable in a narrow sidebar;
- no incoherent text overlap in toolbar buttons, filter controls, or comment cards;
- primary actions remain reachable without horizontal scrolling.

### 4. Multi-Language Support

Status: Confirmed

Need:

- the plugin should be usable by both Chinese-speaking and English-speaking users.

Scope:

- UI labels;
- button tooltips;
- empty states;
- setting names and descriptions;
- notices and error messages;
- command names;
- README/release-facing text when needed.

Confirmed decisions:

- first supported languages are Simplified Chinese and English;
- language follows Obsidian's current locale by default;
- unsupported locales fall back to English;
- existing Chinese UI copy remains the source intent, then English is translated from it.

Still undecided:

- whether the plugin should also provide a manual language override in settings.

Likely implementation direction:

- avoid hard-coded visible UI strings in view/component code;
- add a small translation dictionary keyed by stable message IDs;
- default to English when the current locale is unsupported;
- support Simplified Chinese with `zh` / `zh-CN` matching;
- keep short action labels such as `绑` and `调` configurable through the same translation layer.

## Scope Decision Pending

The major new requirements in this document are now triaged. Remaining planning should move back to the core Stage 4 cross-note review questions.
