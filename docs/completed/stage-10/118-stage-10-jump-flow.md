# Stage 10: Jump Flow

Status: Confirmed

## Scope

This document defines current-document jump behavior for `0.10.0`.

Jump flow covers:

- sidebar card to source text;
- source mark to sidebar card;
- cross-note reveal into current-document context;
- filter-hidden targets;
- orphaned annotations;
- temporary focus feedback.

## User Goal

The user should always understand the relationship between a sidebar card and its source text.

Jumping should answer two questions immediately:

- Where is this annotation in the document?
- Which sidebar card belongs to this source mark?

## Entry Points

Supported entry points:

- click a current-document sidebar card;
- click a source-mode annotation mark;
- click a reading-mode annotation mark;
- reveal from cross-note overview into the source document and matching sidebar card.

Unsupported entry points:

- orphaned annotation with no locatable source range;
- annotation hidden by a filter with no reveal path;
- non-Markdown source surfaces.

Unsupported jumps should show a clear notice and avoid pretending navigation succeeded.

## Card To Source

Clicking a sidebar card should jump to the source range.

Rules:

- The whole card is the jump target except interactive controls.
- Buttons, inputs, menus, and edit panels keep their own behavior.
- No separate jump button is needed.
- Collapsed, normal, compact, and resolved cards must all support jump when the source range is locatable.
- Clicking an orphaned card should not fake a successful jump.

Expected behavior:

- focus or open the source document if needed;
- locate the annotation range;
- scroll the target into view;
- aim for the visual center of the current editor pane when practical;
- apply temporary source feedback;
- keep or apply sidebar card focus feedback.

## Source To Card

Clicking a source mark should focus the matching sidebar card.

Rules:

- Source-mode marks and reading-mode marks should behave consistently.
- If the sidebar is closed, opening or revealing the sidebar is allowed when practical.
- If the sidebar is open, scroll the matching card into view.
- Apply temporary card feedback even if the card is already visible.

If multiple annotations overlap, the clicked mark should prefer the annotation directly associated with the clicked decoration.

## Cross-Note Reveal

Cross-note reveal is a routed jump into the current-document workflow.

Expected behavior:

- open the source document;
- load the current-document sidebar data;
- focus the matching card;
- jump to the source text when locatable;
- apply the same source and card feedback as local current-document jump.

Cross-note reveal should not invent a separate jump behavior.

## Filter-Hidden Targets

Jump should not silently fail because filters hide the target card.

Rules:

- If a direct jump targets a card hidden by active filters, show a clear notice.
- Provide a path to reveal the target, such as clearing filters or temporarily showing the target.
- Do not silently clear filters unless that behavior is explicitly confirmed later.
- Do not scroll to an empty list and leave the user guessing.

Stage 10 can later decide whether temporary reveal or clear-filter prompt is the better implementation.

## Orphaned Annotations

Orphaned annotations cannot reliably jump to source text.

Rules:

- Card click should show that the annotation needs rebind.
- Rebind remains the primary action.
- Original text and context should help the user decide what to select before rebinding.
- Do not apply source feedback when no source range was found.

## Temporary Feedback

Feedback should be short and restrained.

Source feedback:

- strengthen the existing mark or range highlight temporarily;
- avoid large flashes;
- do not change document content.

Card feedback:

- strengthen card border or background temporarily;
- do not resize the card;
- keep feedback visible long enough for the eye to land.

Recommended duration:

- about 1.2 to 1.8 seconds.

## Scroll Behavior

Scroll behavior should optimize for finding the target quickly.

Rules:

- Prefer visual center of the active editor pane.
- If exact centering is not possible, ensure the target is comfortably visible, not pinned to the top or bottom edge.
- Avoid unnecessary scroll jumps when the target is already clearly visible.
- Still apply focus feedback when no scroll is needed.

## Failure Behavior

Failure cases:

- source document no longer exists;
- source range cannot be located;
- annotation is orphaned;
- sidebar data fails to load;
- filters hide the target card.

Expected behavior:

- show a concise notice;
- do not mark the jump as successful;
- preserve the current sidebar/card state when possible;
- suggest rebind only when the annotation is orphaned or unlocatable.

## Test Targets

Jump regression should cover:

- collapsed normal card to source;
- collapsed compact card to source;
- expanded card to source;
- resolved card to source;
- source-mode mark to card;
- reading-mode mark to card;
- cross-note reveal to source and card;
- target card hidden by filters;
- orphaned card click;
- jump when target is already visible;
- jump when target is outside viewport.

## Next Discussion

The next workflow topic is resolve flow.

Resolve flow should define how active and resolved annotations behave without breaking document-order review or jump behavior.
