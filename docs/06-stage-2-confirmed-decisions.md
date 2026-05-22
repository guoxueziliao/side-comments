# Stage 2 Confirmed Decisions

Status: Confirmed

This document records decisions already agreed for `v0.2`. It should be used as the implementation baseline.

## Version Direction

- `v0.2` focuses on anchor reliability.
- The development version for this stage is `0.2.0`.
- Main work: safer relocation, orphaned comment rebind, manual range adjustment, and source/reading mode selection mapping.
- Official review fixes still take priority if they appear.

## Rebind Scope

- Manual rebind is only for orphaned comments in `v0.2`.
- Rebind uses the current text selection in the active document as the new anchor.
- Rebind preserves comment note, mark type, color, created time, and comment identity.
- Rebind success changes comment status to `active`.
- Rebind does not modify Markdown source.

## Range Adjustment Scope

- Active and resolved comments need a separate range adjustment action.
- Range adjustment handles cases where the intended annotation span changes.
- Example: original annotation covers 5 characters, later the user wants it to cover 10 characters.
- Example: original annotation covers 10 characters, later the user wants it narrowed to 5 characters.
- Range adjustment uses the current text selection in the active document as the new anchor.
- Range adjustment preserves comment note, mark type, color, created time, comment identity, and current status.
- Range adjustment is explicit. The plugin should not automatically guess a longer or shorter intended range.

## Mode Coverage

- Both source mode and reading mode must be considered.
- Source mode selection offsets should remain exact.
- Reading mode selection should be mapped back to Markdown source as safely as possible.
- Unsupported reading mode selections should fail visibly instead of creating or updating a wrong anchor.

## Orphaned Card Display

- Orphaned comment cards should show the original selected text.
- Orphaned comment cards should show original prefix and suffix context by default.
- The goal is to help the user remember and find the intended text.

## UI Placement

- The floating selection toolbar remains for creating new comments only.
- Rebind and range adjustment actions are placed on sidebar comment cards.
- The user flow is:
  - select target text in the current document;
  - click the relevant card action.

## Button Labels

- Orphaned comment rebind button short label: `绑`
- Orphaned comment rebind tooltip: `重新绑定到当前选区`
- Active or resolved comment range adjustment button short label: `调`
- Active or resolved comment range adjustment tooltip: `调整到当前选区`

## Notices

- Rebind without valid selection: `请先在当前文档中选中要绑定的文字`
- Rebind unsupported selection: `当前选区暂不支持绑定`
- Range adjustment without valid selection: `请先在当前文档中选中要调整的文字`
- Range adjustment unsupported selection: `当前选区暂不支持调整`

## Safety Rules

- Do not write hidden anchor IDs or annotation markers into Markdown.
- Do not automatically delete orphaned comments.
- Do not run full-vault repair on startup.
- Do not perform low-confidence automatic repairs.
- Keep current-document performance acceptable.

## Anchor Data Decisions

- Do not upgrade sidecar `schemaVersion` in `v0.2`.
- Add new anchor metadata as optional fields.
- New context length is 80 characters before and after the selected text.
- Store line and column metadata for new anchors.
- Line and column metadata uses 1-based numbers.
- Store anchor source mode for new anchors: `source` or `reading`.
- Refresh anchor `source.updatedAt` when automatic relocation moves the anchor.
- Do not refresh anchor `source.updatedAt` when the original offsets still match exactly.
- Old `0.1.x` anchors without these fields must continue to work.
