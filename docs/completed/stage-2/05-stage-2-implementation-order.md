# Stage 2 Implementation Order

Status: Confirmed

This document breaks `v0.2` anchor reliability work into implementation order.

## Step 1: Anchor Test Baseline

Goal: protect current behavior before changing relocation logic.

Work:

- Add focused tests for anchor creation.
- Add focused tests for direct offset relocation.
- Add focused tests for context relocation.
- Add focused tests for fuzzy fallback.
- Add focused tests for orphaned behavior.

Acceptance:

- Current expected relocation behavior is covered.
- Future scoring changes can be checked without manual vault testing only.

## Step 2: Anchor Metadata Extension

Goal: store enough context to support better recovery without breaking old sidecar files.

Status: Implemented in first pass

Work:

- Add optional anchor metadata fields.
- Keep current `startOffset`, `endOffset`, `selectedText`, `prefix`, and `suffix`.
- Regenerate richer metadata for new or manually adjusted anchors.
- Migrate old data lazily only when needed.

Acceptance:

- Existing `0.1.x` sidecar files still load.
- New comments include richer anchor metadata.
- Old comments continue to relocate with existing fields.

## Step 3: Relocation Scoring

Goal: make automatic recovery stricter and safer.

Work:

- Score selected text match quality.
- Score prefix and suffix context quality.
- Use distance from old offset as a secondary signal.
- Penalize ambiguous repeated matches.
- Keep fuzzy matching as the final fallback.

Acceptance:

- Exact offset matches still win.
- Repeated selected text chooses the best context match.
- Ambiguous matches remain orphaned instead of being moved incorrectly.

## Step 4: Orphaned Card Context

Goal: make lost comments understandable to the user.

Status: Implemented in first pass

Work:

- Show original selected text in orphaned cards.
- Show original prefix and suffix context by default.
- Keep orphaned comments at the bottom of the sidebar.
- Make the rebind action visible only for orphaned cards.
- Keep rebind actions on sidebar cards, not in the floating selection toolbar.
- Use button short label `绑` and tooltip `重新绑定到当前选区`.

Acceptance:

- Users can see what text the lost comment used to refer to.
- Orphaned comments are recoverable without inspecting JSON files.

## Step 5: Manual Rebind for Orphaned Comments

Goal: let users repair lost anchors explicitly.

Status: Implemented in first pass

Work:

- User selects new text in the current note.
- User triggers rebind from the orphaned sidebar card.
- Plugin regenerates anchor offsets and context from the current selection.
- Comment note, mark type, color, created time, and card identity are preserved.
- Status becomes `active` after successful rebind.
- If no valid current selection exists, show a notice and make no data change.
- No-selection notice: `请先在当前文档中选中要绑定的文字`.
- Unsupported-selection notice: `当前选区暂不支持绑定`.

Acceptance:

- Rebinding does not create a duplicate comment.
- Rebinding does not modify Markdown source.
- Rebound comment renders in source mode and reading mode.

## Step 6: Manual Range Adjustment

Goal: support intentional expansion or narrowing of an existing annotation.

Status: Implemented in first pass

Work:

- User selects the desired new range in the current note.
- User triggers range adjustment from an active or resolved comment.
- Plugin regenerates anchor offsets and context from the current selection.
- Comment note, mark type, color, created time, and status are preserved.
- If no valid current selection exists, show a notice and make no data change.
- Use button short label `调` and tooltip `调整到当前选区`.
- No-selection notice: `请先在当前文档中选中要调整的文字`.
- Unsupported-selection notice: `当前选区暂不支持调整`.

Acceptance:

- A 5-character annotation can be expanded to 10 characters.
- A 10-character annotation can be narrowed to 5 characters.
- Range adjustment is explicit and never guessed automatically.
- Range adjustment actions are on sidebar cards, not in the floating selection toolbar.

## Step 7: Source Mode and Reading Mode Mapping

Goal: make selection-to-source mapping reliable in both main Obsidian views.

Work:

- Verify source mode offset mapping after common edits.
- Improve reading mode whitespace normalization.
- Improve reading mode matching for links, emphasis, headings, and list text.
- Avoid unsupported rendered regions instead of creating unsafe anchors.

Acceptance:

- Source mode remains exact.
- Reading mode works at least as well as `0.1.1`.
- Unsupported selections fail visibly instead of creating wrong anchors.

## Step 8: Local Vault Verification

Goal: test behavior in the real local Obsidian vault.

Work:

- Build the plugin.
- Copy release files to the local test plugin directory.
- Test source mode creation, relocation, rebind, and range adjustment.
- Test reading mode creation, relocation, rebind, and range adjustment.

Acceptance:

- No regression in current MVP workflows.
- `v0.2` anchor repair workflows work in the local vault.
