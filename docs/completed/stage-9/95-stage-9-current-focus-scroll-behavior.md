# Stage 9: Current Focus And Scroll Behavior

Status: Confirmed

## Scope

This document defines current card focus and sidebar scroll behavior for `0.9.0`.

The goal is to make the relationship between source position and sidebar card clear without introducing a complex selection model.

## Current Focus State

The sidebar should support a current focus card state.

Meaning:

- The focused card is the card that corresponds to the current source target or most recent explicit navigation target.
- Focus is a relationship indicator, not an edit selection state.

Focus is different from hover:

- hover means the pointer is over a card;
- focus means this card currently corresponds to the source context.

## Source To Card

When the user clicks source text or a rendered annotation mark:

- locate the matching sidebar card;
- scroll the sidebar so the card is visible;
- aim to place the card near the visual center of the sidebar when practical;
- apply temporary focus feedback.

If the card is already visible, still apply feedback so the user can identify it.

## Card To Source

When the user clicks a card:

- navigate to the source target when possible;
- scroll the source target into the visual center of the current editor pane when practical;
- apply temporary source feedback;
- keep the card in focus briefly.

Card click is the navigation action. No dedicated jump button is needed.

## Manual Scrolling

The plugin should not fight the user's manual scrolling.

Rules:

- Do not constantly auto-scroll the sidebar while the user is scrolling.
- Auto-scroll only after explicit actions such as card click, source mark click, rebind, or command-driven navigation.
- Do not use passive cursor movement alone to repeatedly steal sidebar scroll.

## Filter And Density Changes

When filters or density mode change:

- preserve the current focus card when possible;
- try to keep it visible;
- do not reset focus only because card height changed;
- do not change sort order.

Sort and grouping behavior is confirmed in `97-stage-9-list-order-grouping.md`.

If the focused card becomes hidden by filters:

- show a clear notice that the focused annotation is hidden by current filters;
- offer a path to clear filters or reveal the target;
- do not silently drop focus without feedback.

## Temporary Feedback

Focus feedback should be clear but restrained.

Card feedback:

- strengthen border temporarily;
- strengthen left color signal temporarily when present;
- avoid changing card dimensions.

Source feedback:

- reuse the existing annotation decoration where possible;
- briefly strengthen the target mark or boundary;
- avoid large flashing backgrounds.

Recommended duration:

- 1.2-1.8 seconds.

## Not A Selection Model

Current focus should not become a complex selection feature.

Rules:

- Do not add multi-select.
- Do not add persistent selected-card state.
- Do not add keyboard navigation in `0.9.0`.
- Do not make focus imply the card is being edited.

## Orphaned Cards

Orphaned cards can receive focus, but source navigation may not be available.

Rules:

- Focusing an orphaned card should highlight the card.
- Card click should not imply source navigation succeeded when the source range is missing.
- Rebind remains the main next action.

## Out Of Scope

- Keyboard up/down navigation between cards.
- Multi-select cards.
- Persistent selected-card state.
- Navigation history.
- Connector lines between cards and source text.
