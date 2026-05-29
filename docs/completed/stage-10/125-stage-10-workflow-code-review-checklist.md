# Stage 10: Workflow Code Review Checklist

Status: Confirmed

## Scope

This checklist is for reviewing Stage 10 current-document workflow implementation.

Use it before treating the workflow as complete.

## Data Safety

- [ ] No annotation syntax is written into Markdown files.
- [ ] Sidecar writes are atomic enough for the existing storage layer.
- [ ] Failed create/update/rebind/delete operations leave prior data unchanged.
- [ ] Deleting last meaningful annotation part requires confirmation.
- [ ] Rebind does not create partial anchor data on failure.

## State Model

- [ ] `Annotation = Anchor + Optional Mark + Optional Note` remains intact.
- [ ] Fixed user-facing annotation types are not reintroduced.
- [ ] Active, resolved, and orphaned states remain distinct.
- [ ] Resolved cards are not visually disabled or opacity-reduced by default.
- [ ] Orphaned annotations use recovery-oriented behavior.

## Source And Reading Modes

- [ ] Source-mode selection creation still works.
- [ ] Reading-mode selection creation still maps back to source when supported.
- [ ] Source-mode mark click focuses the sidebar card.
- [ ] Reading-mode mark click focuses the sidebar card.
- [ ] Unsupported selections show notices and do not mutate data.

## Sidebar Workflow

- [ ] Card order remains source order unless range changes.
- [ ] Card click jumps to source except on interactive controls.
- [ ] Direct actions do not trigger jump.
- [ ] Normal and compact density keep the same behavior.
- [ ] Filter-hidden target behavior is explicit, not silent.

## Create And Update

- [ ] Same-range creation updates or merges instead of duplicating.
- [ ] More panel supports mark-only, note-only, and mark-and-note outputs.
- [ ] Note panel changes only note content.
- [ ] Mark panel changes only mark type and color.
- [ ] Tag panel changes only tags.
- [ ] Adjust range preserves note, mark, color, tags, and status.

## Rebind And Delete

- [ ] Rebind requires an orphaned annotation and usable selection.
- [ ] Rebind preview shows old and new text before saving.
- [ ] Successful rebind clears orphaned state and preserves metadata.
- [ ] Delete annotation removes the whole record.
- [ ] Delete note and remove mark preserve the other meaningful part when present.

## User Feedback

- [ ] Normal successful high-frequency operations avoid noisy success toasts.
- [ ] Failure notices are concise and actionable.
- [ ] Source and card focus feedback are visible but do not resize layout.
- [ ] Confirm dialogs clearly distinguish whole annotation deletion from partial deletion.

## Tests And Regression

- [ ] New or updated tests cover practical Stage 10 workflow cases where possible.
- [ ] Manual test cases are documented for behavior that cannot be automated easily.
- [ ] Existing Stage 9 UI behavior is not regressed.
- [ ] Cross-note reveal still routes into current-document behavior.

## Release Readiness

- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Local Obsidian test install is updated before manual testing.
- [ ] Acceptance checklist has no blocking unchecked items.
