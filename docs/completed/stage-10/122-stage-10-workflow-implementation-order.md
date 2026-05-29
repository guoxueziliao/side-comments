# Stage 10: Workflow Implementation Order

Status: Confirmed

## Scope

This document defines the recommended implementation order for the Stage 10 current-document annotation workflow.

It covers the workflow documents from create through delete.

## Principle

Implement from the most common path outward.

The current-document workflow should be stabilized in this order:

1. create;
2. update;
3. jump;
4. resolve;
5. rebind;
6. delete;
7. regression review.

## Step 1: Create Flow

Reference:

- [Create Flow](./116-stage-10-create-flow.md)

Goal:

- Ensure source-mode and reading-mode creation produce correct annotation state and immediate UI feedback.

Work:

- Validate unsupported selection behavior.
- Verify direct toolbar mark creation.
- Verify More panel creation.
- Verify same-range update or merge behavior.
- Verify sidebar card focus and source feedback after creation.
- Verify active filters do not make creation look like failure.

## Step 2: Update Flow

Reference:

- [Update Flow](./117-stage-10-update-flow.md)

Goal:

- Make existing annotations reliably editable without data loss or accidental state changes.

Work:

- Verify direct note actions.
- Verify note, mark, and tag edit panels.
- Verify range adjustment from current selection.
- Verify status updates do not affect other fields.
- Verify final-part removal requires confirmation.

## Step 3: Jump Flow

Reference:

- [Jump Flow](./118-stage-10-jump-flow.md)

Goal:

- Make source and sidebar feel connected in daily use.

Work:

- Verify card-to-source jump in normal, compact, collapsed, expanded, and resolved states.
- Verify source-to-card focus in source mode and reading mode.
- Verify cross-note reveal routes into current-document behavior.
- Verify filter-hidden target behavior.
- Verify target centering and temporary feedback.

## Step 4: Resolve Flow

Reference:

- [Resolve Flow](./119-stage-10-resolve-flow.md)

Goal:

- Treat resolved as a normal workflow state, not a disabled or weakened card.

Work:

- Remove any resolved-card visual weakening if present.
- Verify resolved cards remain in document order.
- Verify resolved cards remain navigable and editable.
- Verify resolved and orphaned states stay distinct.
- Verify status filters treat active, resolved, and orphaned separately.

## Step 5: Rebind Flow

Reference:

- [Rebind Flow](./120-stage-10-rebind-flow.md)

Goal:

- Recover orphaned annotations safely and visibly.

Work:

- Verify orphaned card context display.
- Verify no-selection and invalid-selection behavior.
- Verify preview and confirmation.
- Verify successful rebind preserves annotation content and metadata.
- Verify orphaned-only filter behavior after recovery.

## Step 6: Delete Flow

Reference:

- [Delete Flow](./121-stage-10-delete-flow.md)

Goal:

- Make deletion precise and conservative.

Work:

- Verify delete annotation confirmation.
- Verify delete note behavior for note-only and mark-and-note.
- Verify remove mark behavior for mark-only and mark-and-note.
- Verify cancel leaves data unchanged.
- Verify source marks and sidebar update immediately.

## Step 7: Regression Review

Reference:

- [Current-Document Annotation Workflow](./115-stage-10-current-document-workflow.md)
- [Usage Feedback Workflow](./114-stage-10-usage-feedback-workflow.md)

Goal:

- Confirm the whole loop works as one workflow.

Work:

- Walk create -> update -> jump -> resolve -> restore -> adjust range -> rebind -> delete in one test note.
- Repeat in source mode and reading mode.
- Repeat with active filters.
- Record any daily-use issues using the usage feedback workflow.

## Development Boundary

Do not add new product features while implementing this order unless a bug makes the workflow impossible to complete.

If a large design change appears necessary, return to planning before implementation.
