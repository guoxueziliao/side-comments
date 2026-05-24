# Stage 3: Order and Status Display

Status: Confirmed

## Goal

Keep the sidebar aligned with the article structure while still making comment status visible.

## Sorting

Default sorting follows the annotation position in the document.

The sidebar uses one document-order list, not separate status groups.

All comments stay in the same main list:

- active comments;
- orphaned comments;
- resolved comments.

Status affects labels, visual style, filtering, and optional folding behavior. Status must not move a comment away from its document position.

This keeps the sidebar aligned with the article structure: if the text position does not change, the comment position in the sidebar should not change.

## Orphaned Comments

Orphaned comments should stay in the main document-order list by using their last known position.

Orphaned comments should use the full card display by default, not the folded resolved-comment display.

Default orphaned card display:

- show a clear orphaned status;
- show the original selected text;
- show original surrounding context;
- show the rebind action `绑`;
- do not expose internal offsets, line numbers, or column numbers in the normal UI.

The purpose is to help users decide where the comment should be rebound without requiring them to inspect sidecar JSON data.

## Resolved Comments

Resolved comments should stay at their document position, but use a folded display by default.

Default folded display:

- show a compact one-line resolved item;
- show resolved status;
- show selected text summary;
- keep necessary actions available;
- expand to the full card when clicked.

Resolved comments should not be moved into a separate bottom section.

The sidebar should keep a visible control or filter option that lets users hide or show resolved comments when needed.

## Acceptance Criteria

- Active, orphaned, and resolved comments remain in one document-order list.
- Comment order follows document position regardless of status.
- Orphaned comments use their last known position instead of being arbitrarily moved.
- Orphaned comments remain easy to identify and repair.
- Resolved comments stay at their document position but do not dominate the sidebar by default.
