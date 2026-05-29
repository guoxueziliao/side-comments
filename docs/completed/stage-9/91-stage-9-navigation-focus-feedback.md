# Stage 9: Navigation And Focus Feedback

Status: Confirmed

## Scope

This document defines card-to-source and source-to-card navigation feedback for `0.9.0`.

The goal is to make the relationship between source text and sidebar cards clear without adding a separate jump button.

## Navigation Entry Points

Cards do not need a dedicated jump button.

Confirmed behavior:

- Clicking a card navigates to the source text when the source range can be located.
- Clicking source text or a rendered annotation mark focuses the matching sidebar card when possible.
- Add note, edit note, rebind, and other actions remain separate from card-click navigation.

Reason:

- A separate jump button adds visual weight but does not add meaningful capability.
- The whole card already represents the source range.
- Card click is easier to discover and leaves the header less crowded.

## Card To Source

When the user clicks a card:

- open or focus the source document if needed;
- scroll the source target into view;
- aim for the visual center of the current editor pane when practical;
- apply temporary source feedback.

If the source target is already visible, still apply temporary feedback so the user can confirm the relationship.

## Source To Card

When the user clicks source text or a rendered annotation mark:

- focus the matching sidebar card when it is visible;
- scroll the card into view when needed;
- apply temporary card feedback.

If the card is hidden by filters:

- show a clear notice that the current filters hide the annotation;
- provide a path to clear filters or reveal the target;
- do not silently fail.

Filter-row and empty-state behavior is confirmed in `92-stage-9-filter-row-empty-states.md`.

## Temporary Feedback

Feedback should be short and restrained.

Recommended duration:

- 1.2-1.8 seconds.

Source target feedback:

- temporarily strengthen the existing mark boundary or decoration;
- use a subtle pulse only if it does not distract from reading;
- avoid large-area flashing.

Card feedback:

- temporarily strengthen the card border;
- temporarily strengthen the left color bar when present;
- avoid changing card size or layout.

## Orphaned Annotations

Orphaned annotations cannot reliably navigate to source text.

Rules:

- Card click should not pretend navigation succeeded when the source range is unavailable.
- The primary visible action for orphaned cards is rebind.
- If an old source location or context can still be shown, it should be secondary to rebind.
- Adjust range remains unavailable until the annotation is rebound.

## Lines And Connectors

Do not add visual connector lines between source text and sidebar cards in `0.9.0`.

Reason:

- Lines increase visual complexity.
- Lines can interfere with reading and scrolling.
- Focus feedback is enough for the current sidebar experience.

Connector lines can be reconsidered only if future testing shows focus feedback is not enough.

## Implementation Notes

Implementation should reuse existing scroll and pulse behavior where practical.

Avoid creating a second navigation system if Stage 3 or Stage 7 helpers already cover:

- opening the source document;
- scrolling a target into view;
- applying temporary target feedback;
- focusing a sidebar card.

Current focus and scroll behavior is confirmed in `95-stage-9-current-focus-scroll-behavior.md`.

## Out Of Scope

- A dedicated jump button on every card.
- Persistent source-to-card connector lines.
- Keyboard navigation shortcuts.
- New navigation history.
- Changing anchor recovery behavior.
