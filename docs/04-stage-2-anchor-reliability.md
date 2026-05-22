# Stage 2: Anchor Reliability

Status: Confirmed

## Goal

Make annotations more reliable after Markdown content changes, especially when selected text appears multiple times or reading mode selection maps imperfectly back to source text.

This stage is the main `v0.2` development direction unless a higher-priority official review issue appears.

## Why This Comes Next

The MVP already supports creation, rendering, sidebar management, and conservative relocation. The next major risk is data trust: users need confidence that annotations keep pointing to the right text after editing notes.

## Current Behavior

- A comment stores `startOffset`, `endOffset`, `selectedText`, `prefix`, and `suffix`.
- Relocation first checks whether the original offsets still match.
- If offsets fail, relocation searches by selected text and context similarity.
- If context relocation fails, it tries fuzzy matching.
- If confidence is too low, the comment becomes `orphaned`.

## Confirmed Constraints

- Do not write anchor markers into Markdown.
- Do not automatically delete lost comments.
- Do not run full-vault repair on startup.
- Do not make low-confidence automatic repairs.
- Keep current-document performance acceptable.

## Proposed Scope

### 1. Better Anchor Metadata

Status: Confirmed

Add more context to anchors so repeated text is easier to distinguish.

Candidate changes:

- Store longer normalized context.
- Store line-level information when the annotation is created.
- Store an anchor version for future migration.
- Keep backward compatibility with current schema.

### 2. Better Relocation Scoring

Status: Confirmed

Improve confidence calculation so automatic recovery is stricter and more explainable.

Candidate changes:

- Score selected text, prefix, suffix, and distance from old offset together.
- Penalize repeated matches with similar confidence.
- Prefer exact selected text with best surrounding context.
- Keep fuzzy matching as a final fallback.

### 3. Unresolved State and Manual Rebind

Status: Confirmed

When automatic relocation fails, give the user a controlled way to repair the comment.

Confirmed behavior:

- Keep `orphaned` comments visible in the sidebar.
- Add a clear action to rebind an orphaned comment to a new selected text.
- Preserve the original selected text in the card for comparison.
- Show original prefix and suffix context in orphaned cards by default.
- Avoid automatic rebind after the user manually fixes it unless future edits require relocation again.
- In `v0.2`, manual rebind is only for orphaned comments.
- Manual rebind is triggered from the sidebar card, using the current text selection in the active document.
- The floating selection toolbar remains only for creating new comments.

### 4. Manual Range Adjustment

Status: Confirmed

Manual rebind is only for orphaned comments, but there is a separate real use case: the annotation is still valid, yet the user changed the intended selected range.

Examples:

- Original annotation selected 5 characters. Later the user wants the annotation to cover 10 characters.
- Original annotation selected 10 characters. Later the user deletes or narrows the relevant text to 5 characters.

Confirmed behavior:

- Add a separate range adjustment action for active or resolved comments.
- Range adjustment should use the user's current selection as the new anchor.
- The comment note, mark type, color, created time, and status should be preserved.
- The anchor selected text, offsets, prefix, and suffix should be regenerated from the current document.
- Range adjustment should be explicit. The plugin should not guess that a nearby longer or shorter text range is the user's intended new range.
- If the original text partly remains but no longer matches the old range, automatic relocation may recover the closest safe range. The user can then manually adjust the range if the recovered span is too short or too long.
- Range adjustment is triggered from the sidebar card, using the current text selection in the active document.
- The floating selection toolbar remains only for creating new comments.

## Interaction Decisions

Status: Confirmed

## Sidebar Actions

Confirmed behavior:

- Orphaned comments show a `重绑` action.
- Active and resolved comments show an `调范围` action.
- These actions are shown on the comment card, not in the floating selection toolbar.
- The user must first select the desired text in the active note, then click the card action.
- If there is no valid selection, show a notice and do not change the comment.
- If the selection belongs to another file or unsupported region, show a notice and do not change the comment.

Confirmed labels:

- Orphaned comment button short label: `绑`
- Orphaned comment tooltip: `重新绑定到当前选区`
- Active or resolved comment button short label: `调`
- Active or resolved comment tooltip: `调整到当前选区`

Confirmed notices:

- No valid selection for rebind: `请先在当前文档中选中要绑定的文字`
- Unsupported selection for rebind: `当前选区暂不支持绑定`
- No valid selection for range adjustment: `请先在当前文档中选中要调整的文字`
- Unsupported selection for range adjustment: `当前选区暂不支持调整`

## Floating Toolbar

Confirmed behavior:

- The floating toolbar keeps its current job: create a new annotation from the current selection.
- It should not include rebind or range adjustment actions in `v0.2`.
- This avoids mixing "create new comment" and "repair or modify existing comment" in the same UI.

## Status After Action

Confirmed behavior:

- Successful rebind changes an orphaned comment to `active`.
- Successful range adjustment preserves the existing status.
- Deleted source text does not delete the comment automatically.
- If automatic relocation later fails again, the comment can become `orphaned` again.

### 5. Source Mode and Reading Mode Mapping Refinement

Status: To discuss

Improve selection mapping for both source mode and reading mode.

Candidate changes:

- Confirm source mode offsets remain exact after common edit flows.
- Normalize whitespace for reading mode selections.
- Improve matching for links, emphasis, headings, and list text.
- Avoid mapping selections from unsupported rendered regions.

### 6. Focused Tests

Status: Confirmed

Add tests for the anchor layer before changing relocation behavior heavily.

Candidate cases:

- Direct offset hit.
- Same selected text appears multiple times.
- Text moved within the same file.
- Prefix changed but suffix remains.
- Fuzzy candidate below threshold remains orphaned.
- Manual rebind updates anchor data safely.
- Manual range adjustment expands an existing comment range.
- Manual range adjustment narrows an existing comment range.

## Out of Scope

- PDF or EPUB anchors.
- Full-vault repair.
- Cloud sync.
- Multi-user conflict handling.
- Writing hidden anchor IDs into Markdown.

## Proposed Acceptance Criteria

- Existing `0.1.x` sidecar data still loads.
- Existing comments do not disappear during migration.
- Automatic relocation only happens when confidence is high.
- Repeated selected text prefers the correct context match.
- Low-confidence comments are shown as orphaned, not silently moved.
- User can manually rebind an orphaned comment.
- User can manually adjust the selected range of an active or resolved comment.
- Orphaned cards show original selected text with surrounding context by default.
- Source mode behavior remains stable.
- Reading mode selection works at least as well as `0.1.1`.

## Open Questions

- Should line number metadata be stored if it may become stale after edits?
- Should range adjustment be available from the sidebar only, or also from the floating toolbar when a comment card is selected?
- Should source mode and reading mode mapping refinements be completed in the same implementation pass, or split into separate commits inside `v0.2`?
