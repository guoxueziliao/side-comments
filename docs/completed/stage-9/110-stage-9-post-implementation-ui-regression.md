# Stage 9: Post-Implementation UI Regression Fixes

Status: Confirmed

## Scope

This document records UI and interaction corrections found after the initial `0.9.0` implementation.

These fixes refine Stage 9 behavior without changing the Stage 8 annotation model.

## Reported Issues

The following issues were found in the current-document sidebar:

- The header count appeared too far away from the title.
- Some collapsed card states did not navigate to the source text.
- The density toggle icon did not make the two modes feel distinct.
- Color filtering was hidden behind an extra filter expansion even when the main filter row had room.
- Menus opened at unstable mouse positions and felt visually detached from their trigger buttons.
- Card-to-source navigation worked reliably only in expanded states.
- Compact and normal density modes did not have a clear enough practical difference.

## Confirmed Corrections

Header:

- Keep the annotation count visually grouped with the sidebar title.
- Keep title actions separate from the title/count group.

Navigation:

- Clicking a card navigates to the source text whenever the annotation can be located.
- Navigation must not depend on whether the card is expanded.
- Interactive controls inside the card keep their own behavior and do not trigger navigation.

Density:

- Normal mode shows more review context.
- Compact mode is a tighter scanning mode.
- Density changes must not change annotation meaning, sorting, filters, or navigation behavior.
- Compact mode may reduce visible details, but should not remove core card identity or common safe actions.

Filters:

- Show status, mark type, note state, and color filters directly in the primary filter row.
- Do not hide color behind an extra more-filter toggle in the current-document sidebar.
- Tag filtering can appear directly when tags exist.

Menus:

- Menus should open anchored to their trigger buttons instead of the raw mouse position.
- The same anchoring rule should apply to card menus, sidebar header menus, and filter menus.

## Non-Goals

- Do not add a dedicated jump button.
- Do not reintroduce fixed user-facing annotation types.
- Do not redesign the whole sidebar again.
- Do not change storage or annotation schema.

## Verification Targets

- Collapsed normal cards navigate to source text.
- Collapsed compact cards navigate to source text.
- Expanded cards navigate to source text when clicking non-control areas.
- Edit, status, rebind, filter, and overflow buttons do not trigger source navigation.
- Header title and count read as one visual group.
- The filter row shows color without opening a separate filter expansion row.
- Menus appear under their trigger controls consistently.
