# Stage 9: List Order And Grouping

Status: Confirmed

## Scope

This document defines current-document sidebar list ordering and grouping behavior for `0.9.0`.

The goal is to preserve the relationship between annotations and source document position.

## Core Direction

The default list order remains document order.

Rules:

- Do not group by status by default.
- Do not move resolved annotations to the bottom by default.
- Do not move orphaned annotations to the bottom by default.
- Do not reorder cards when note content, tags, or status are edited.
- Status changes presentation, not default order.

The sidebar is tied to the source document. The list should keep that mental model.

## Why Not Status Grouping By Default

Grouping by active, resolved, and orphaned status can look tidy, but it breaks source-position review.

Problems:

- The same annotation appears to move when its status changes.
- Resolved annotations become harder to compare with nearby active annotations.
- Orphaned annotations lose their last-known source context.
- Users can no longer scan the sidebar as a map of the document.

Status grouping may be considered later as an optional view, but it is not the default for `0.9.0`.

## Filtered Lists

Filtering does not change the ordering rule.

Examples:

- Filtering to active annotations still displays results in document order.
- Filtering to resolved annotations still displays results in document order.
- Filtering to orphaned annotations still displays results by last-known document position when available.

Filter state narrows the list. It should not change the sort model.

## Orphaned Ordering

Orphaned annotations should stay near their last-known source position when possible.

Rules:

- Use last-known position for ordering when available.
- Use recovered anchor metadata when reliable.
- If no usable position exists, place the card at the end.
- Cards placed at the end due to missing position should show why.

This keeps orphaned annotations tied to their source context without pretending their range is still valid.

## Resolved Ordering

Resolved annotations remain in their source position.

Rules:

- Do not move resolved cards to the bottom.
- Do not collapse resolved cards by default.
- Lower visual emphasis according to `94-stage-9-resolved-orphaned-card-experience.md`.
- Let status filters hide resolved annotations when the user wants a focused active list.

## Position Metadata

Position hints may be shown lightly.

Candidate hints:

- line number;
- paragraph position;
- relative source order;
- last-known position for orphaned cards.

Rules:

- Position hints should be low priority metadata.
- Position hints should not dominate selected text or note content.
- Avoid turning every card into a metadata-heavy record.

## Stability

Ordering should be stable.

Actions that should not reorder the card:

- editing note content;
- editing tags;
- editing mark type or color;
- resolving or restoring the annotation;
- switching normal or compact mode.

Actions that may affect order:

- adjusting range;
- rebinding an orphaned annotation;
- anchor recovery that updates source position.

When order changes because the source position changed, the card should not jump without clear feedback.

## Optional Future Views

Status grouping can be reconsidered later as an optional view.

If added later, it must be clearly separate from the default document-order view.

Out of scope for `0.9.0`:

- default status grouping;
- saved grouping views;
- manual card ordering;
- drag-and-drop card ordering;
- priority-based sorting.
