# Stage 5: Repair Tools

Status: Confirmed

## Goal

Define the manual data repair tools for `0.5.0`.

## Confirmed Boundary

`0.5.0` repair tools should stay manual and confirmation-based.

The first release should only include:

- manual orphaned annotation repair;
- manual duplicate annotation handling.

`0.5.0` should not include:

- automatic bulk deletion;
- automatic bulk anchor rewriting;
- automatic similarity-based rebinding;
- one-click cleanup of abnormal data.

## Confirmed Orphaned Annotation Repair

Orphaned annotation repair should be explicit and user-directed.

The flow should be:

1. User enters from the health check report, an orphaned annotation card, or the settings repair tools section.
2. Plugin opens the related source document.
3. Sidebar shows the original annotation, original selected text, original context, and orphaned status.
4. User selects the new target text in the document body.
5. User clicks `重新绑定到当前选区`.
6. Plugin previews the change, including original text, new text, and affected annotation.
7. User confirms the change.
8. Plugin backs up the old sidecar and writes the updated anchor.
9. Annotation status changes from orphaned to active.

This repair flow should preserve the earlier wording split:

- orphaned annotations use rebind behavior;
- active or resolved annotations use range adjustment behavior.

## Confirmed Duplicate Annotation Handling

Duplicate annotation handling should be manual and group-based. It should not automatically merge or delete annotations.

The flow should be:

1. Health check lists duplicate annotation groups.
2. User opens one duplicate group.
3. UI shows each annotation in the group, including source document, selected text, comment content, status, timestamp, and anchor information.
4. User chooses one of these actions:
   - keep all annotations;
   - merge comment content and keep one annotation;
   - delete selected duplicate annotations.
5. Plugin previews the change before writing.
6. User confirms the change.
7. Plugin backs up the old sidecar and writes the updated data.

Duplicate handling should avoid automatic cleanup because annotation similarity can be ambiguous and accidental deletion is hard to recover from without a backup.
