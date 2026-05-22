# Stage 3: Navigation

Status: Confirmed

## Goal

Make it fast to move between a sidebar comment card and the corresponding text in the document.

## Card to Document

Clicking a sidebar card body or jump action should navigate to the corresponding text range in the document.

After navigation, the target text should scroll into the current pane's visual center as much as possible. The goal is for the target to appear near the user's visual focus, not merely somewhere inside the visible viewport.

After navigation, the target text should receive a temporary highlight so the user can confirm the jump target.

Confirmed behavior:

- scroll the target text into the current window or pane's visual center when possible;
- temporarily highlight the target text for 2 seconds;
- do not modify the comment color;
- do not write any jump state into sidecar data;
- if the user jumps to another comment while a temporary highlight is active, clear the previous temporary highlight and show the new one.

Temporary text highlight style:

- use a temporary outline, subtle background emphasis, or similar non-persistent visual treatment;
- do not replace or mutate the annotation's own color or mark style;
- keep the effect visually distinct from normal annotation marks.

## Document to Card

Interacting with marked text in the document should reveal or focus the corresponding sidebar card.

Document mark to sidebar card behavior:

- clicking an annotation mark in the document should reveal the matching sidebar card;
- if the sidebar is closed, open it before revealing the card;
- temporarily highlight the target card for 2 seconds after revealing it;
- do not use double-click as the primary trigger because it conflicts with editing and text selection;
- do not scroll the sidebar on hover;
- hover may only provide a lightweight visual cue on the document mark;
- if multiple annotations overlap, first target the topmost or most specific annotation. A full disambiguation menu is not part of Stage 3.

Temporary card highlight style:

- use a temporary border, left accent line, or subtle background emphasis;
- keep the effect distinct from status and color markers;
- clear the previous temporary card highlight when another card is focused.

## Future Candidate: Connector Line

A temporary line between the document text and sidebar card can make the relationship more visible, but it is not required for `0.3.0`.

Reasons to defer:

- editor mode, reading mode, split panes, and sidebar scrolling all affect line coordinates;
- the line needs recalculation during scrolling and resizing;
- off-screen text or cards need separate behavior;
- multiple overlapping annotations can make persistent lines visually noisy.

If implemented in a later `0.3.x` version, use conservative rules:

- show only one connector line for the current jump;
- show it only when both the document target and sidebar card are visible;
- hide it after roughly 1.5 to 2 seconds;
- do not keep multiple permanent connector lines on screen.

## Acceptance Criteria

- Jumping from a card to text places the target near the current pane's visual center when possible.
- Jumping from a card to text makes the destination obvious.
- Clicking marked text can bring the matching card into view.
- Hovering document marks does not unexpectedly move the sidebar.
- Connector lines are documented as a future candidate, not a `0.3.0` requirement.
