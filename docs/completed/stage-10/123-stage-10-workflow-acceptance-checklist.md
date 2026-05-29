# Stage 10: Workflow Acceptance Checklist

Status: Confirmed

## Scope

This checklist defines completion criteria for the Stage 10 current-document annotation workflow.

The workflow is not complete until create, update, jump, resolve, rebind, and delete pass together.

## Create

- [ ] Source-mode highlight creation works.
- [ ] Source-mode underline creation works.
- [ ] Source-mode strikethrough creation works.
- [ ] Source-mode More creates note-only annotation.
- [ ] Source-mode More creates mark-and-note annotation.
- [ ] Reading-mode direct mark creation works.
- [ ] Reading-mode More creation works when selection maps to source.
- [ ] Unsupported or unmappable selection leaves data unchanged.
- [ ] Same-range creation updates or merges instead of creating accidental duplicates.
- [ ] Created annotation appears in sidebar in document order.
- [ ] Created source target and card receive temporary feedback.

## Update

- [ ] Mark-only card can add note.
- [ ] Note-only card can edit note.
- [ ] Mark-and-note card can edit note.
- [ ] Mark type can be updated.
- [ ] Color can be updated.
- [ ] Tags can be updated.
- [ ] Range can be adjusted from a valid current-document selection.
- [ ] Invalid range adjustment leaves data unchanged.
- [ ] Updating note, mark, color, or tags does not change document order.
- [ ] Removing the last meaningful part requires confirmation.

## Jump

- [ ] Collapsed normal card jumps to source.
- [ ] Collapsed compact card jumps to source.
- [ ] Expanded card jumps to source.
- [ ] Resolved card jumps to source.
- [ ] Source-mode mark focuses sidebar card.
- [ ] Reading-mode mark focuses sidebar card.
- [ ] Cross-note reveal routes into current-document jump behavior.
- [ ] Target scrolls into comfortable visible area, preferably visual center.
- [ ] Target receives feedback even when already visible.
- [ ] Filter-hidden target does not fail silently.

## Resolve

- [ ] Active annotation can become resolved.
- [ ] Resolved annotation can become active.
- [ ] Resolved card remains in document order.
- [ ] Resolved card is not visually weakened by default.
- [ ] Resolved card remains navigable.
- [ ] Resolved card remains editable.
- [ ] Resolved and orphaned states remain visually and behaviorally distinct.
- [ ] Status filters distinguish active, resolved, and orphaned.

## Rebind

- [ ] Orphaned card shows original text and context.
- [ ] Rebind with no selection leaves data unchanged.
- [ ] Rebind with invalid selection leaves data unchanged.
- [ ] Rebind with source-mode selection previews old and new text.
- [ ] Rebind with reading-mode selection previews old and new text when mappable.
- [ ] Canceling preview leaves data unchanged.
- [ ] Confirming preview clears orphaned state.
- [ ] Rebind preserves note, mark, color, and tags.
- [ ] Rebound card moves to new document-order position.

## Delete

- [ ] Delete annotation removes the whole annotation after confirmation.
- [ ] Delete note from mark-and-note leaves mark-only.
- [ ] Delete note from note-only requires confirmation and deletes annotation.
- [ ] Remove mark from mark-and-note leaves note-only.
- [ ] Remove mark from mark-only requires confirmation and deletes annotation.
- [ ] Canceling confirmation leaves data unchanged.
- [ ] Source marks update immediately after deletion.
- [ ] Sidebar list updates immediately after deletion.
- [ ] Active filters remain unchanged after deletion.

## Whole Workflow

- [ ] The full loop works in source mode: create, update, jump, resolve, restore, adjust range, delete.
- [ ] The full loop works in reading mode where selection mapping is supported.
- [ ] The workflow remains usable with active filters.
- [ ] No ordinary success toast appears during high-frequency successful operations.
- [ ] Failure notices are concise and actionable.
- [ ] No workflow step writes annotation syntax into Markdown content.
- [ ] Sidecar data remains valid after the full workflow pass.

## Release Gate

Stage 10 current-document workflow cannot be treated as complete while any unchecked item above blocks daily high-frequency use.
