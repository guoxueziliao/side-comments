# Stage 4: Search and Review Across Notes

Status: Confirmed

## Goal

Support reviewing annotations beyond the current document without harming large-vault performance.

## Planning Rule

Stage 4 decisions should be confirmed one topic at a time. Confirmed decisions should be written into this document or split into smaller `docs/completed/stage-4/` documents when the topic grows.

## Initial Candidate Scope

- Recent annotations view.
- Cross-note annotation search.
- Limited-scope filtering.
- Sidecar metadata index.
- Large-vault performance limits.

## Confirmed Direction

Stage 4 is planned as `0.4.0`.

The core release direction is cross-note annotation review and search:

- provide an annotation overview/search surface beyond the current document;
- read annotation sidecar data as the primary source;
- avoid default full-vault Markdown content scanning;
- keep the first version focused on annotation review and retrieval;
- make the first cross-note review page read-only;
- defer import, export, data maintenance, AI summary, and unrelated workflow expansion unless explicitly added later.

The first cross-note review page should allow:

- searching annotations;
- filtering annotations;
- opening the source note;
- jumping from a result to the source document and matching sidebar card.

Default loading should reuse the existing recent-document range:

- use the same range as the existing progressive loading/cache setting;
- default to the latest `maxCachedDocuments` sidecar previews, currently 100;
- read from `.obsidian-side-comments/cache/recent.json` when available;
- do not introduce a separate default range for the cross-note review page;
- do not scan all sidecar files on startup.

Searchable fields in the first release:

- selected text excerpt from sidecar data;
- comment note content;
- source file path and file name;
- comment status values when entered as search terms.

Fields used mainly for filtering rather than keyword search:

- annotation type;
- annotation color;
- status controls.

Markdown source content should not be searched in the first release.

The first release should reuse the current-document sidebar filter model and add a source-document filter:

- keyword;
- status: all, active, resolved, orphaned;
- annotation color;
- annotation type;
- source document by file name or path.

Date filtering is deferred because annotation creation date, annotation update date, and article/document date can mean different things across notes.

Result cards in the first release should show only user-facing review information:

- source file name;
- selected text excerpt;
- comment note preview;
- status;
- annotation type and color;
- actions: open source document, jump to document text.

Result cards should not expose internal fields such as hash, offset, line, column, or sidecar path.

Index/loading strategy for the first release:

- use lazy loading plus the existing recent preview cache;
- read `.obsidian-side-comments/cache/recent.json` when the cross-note page opens;
- render lightweight results from recent preview data first;
- load a full sidecar only when a result needs full data, such as jumping to the source document;
- do not build an index at plugin startup;
- do not run background full-vault sidecar scanning;
- defer load-more and full-vault index design to a later Stage 4 increment or a future stage.

The first cross-note review page should not allow direct mutation:

- no direct editing;
- no direct deletion;
- no direct resolve or restore action;
- no direct rebind or range adjustment.

Editing and state changes should still happen in the source document sidebar. This keeps cross-note search focused and avoids cross-view synchronization problems in the first release.

## Confirmed Cross-Cutting Requirement

Multi-language support should be added as a foundation for broader use:

- support Simplified Chinese and English;
- follow Obsidian's current locale by default;
- fall back to English when the current locale is unsupported;
- keep visible UI copy, tooltips, notices, command names, setting labels, and empty states out of component code where practical;
- use stable message IDs and translation dictionaries;
- keep existing Chinese UI wording as the source intent, with English translation provided through the same translation layer.

One-click annotation mark hiding is included in `0.4.0` planning:

- provide a global temporary display mode for hiding document annotation marks;
- keep sidecar data unchanged;
- keep the sidebar visible and usable while marks are hidden;
- suppress the create-annotation toolbar while marks are hidden;
- restore visible marks by default after Obsidian restart;
- provide both a sidebar toggle and a command palette command.

Zoom and scale adaptation is a required UI stability target:

- keep sidebar controls, cards, annotation marks, and floating toolbars usable at 100%, 125%, and 150% scale;
- avoid text overlap and horizontal scrolling for primary actions;
- use compact mode as the preferred narrow-pane fallback.

## Out of Scope Until Confirmed

- Full Markdown content search.
- Default full-vault scanning.
- Import, export, and data maintenance.
- Keyboard navigation.
- AI summary or automatic analysis.

## Undecided Items

No core first-release behavior is currently undecided. Implementation details can be split into smaller documents when development begins.

## Pre-`0.4.0` Bugfix

Repeated selected text must not cause one annotation to render in multiple document locations.

This should be fixed before cross-note review work because search results and card-to-document jumps depend on reliable anchor rendering.

## Detail Documents

- `18-stage-4-requirement-triage.md`: new requirements and issue triage before Stage 4 scope is finalized.
- `19-stage-4-cross-note-review-page.md`: read-only first version of the cross-note review page.
- `20-stage-4-implementation-order.md`: confirmed `0.4.0` implementation sequence.
- `21-stage-4-acceptance-checklist.md`: completion checklist for `0.4.0`.
- `22-stage-4-code-review-checklist.md`: review checklist for `0.4.0`.
- `23-stage-4-test-cases.md`: concrete test cases for `0.4.0`.
- `24-stage-4-ui-copy.md`: confirmed Chinese and English UI copy for `0.4.0`.
- `25-stage-4-release-boundary.md`: explicit included and deferred scope for `0.4.0`.
