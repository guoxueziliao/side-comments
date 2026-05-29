# Stage 9: Sidebar Toolbar

Status: Confirmed

## Scope

This document defines the current-document sidebar top toolbar for `0.9.0`.

The goal is to keep common controls visible without turning the sidebar header into a large control area.

## Core Direction

The sidebar toolbar should stay compact.

Rules:

- Prefer one-line layout.
- Avoid a large title area.
- Avoid long explanatory text.
- Keep controls short in Simplified Chinese and English.
- Move secondary controls into the more menu when width is limited.

The toolbar should help users understand the current list state and change display mode quickly.

## Toolbar Contents

The toolbar should include:

- annotation count;
- normal or compact mode switch;
- hide or show source marks toggle;
- filter entry or active filter state;
- more menu.

These controls should be arranged so the count and active state remain readable.

## Count Display

The count should be concise.

Rules:

- No active filters: show total count, for example `12`.
- Active filters: show filtered count and total count, for example `5 / 12`.
- Avoid long labels such as `5 annotations out of 12`.
- Tooltip may explain the count if needed.

The count should not wrap in common sidebar widths.

## Density Mode Switch

Normal and compact modes should be easy to switch.

Preferred control:

- segmented control;
- two compact icon buttons if segmented control does not fit.

Rules:

- Avoid long text buttons.
- Use tooltips for icon-only controls.
- Switching density should follow `89-stage-9-card-density-modes.md`.
- Mode switching should not clear filters or reset list order.

## Hide Source Marks Toggle

The hide or show source marks setting should be available from the toolbar.

Preferred control:

- eye icon toggle.

Rules:

- Tooltip explains the current action.
- The toggle changes source marks and note-only indicators according to Stage 8 rules.
- The sidebar list remains visible when source marks are hidden.
- The toggle should not be confused with filtering cards.

## Filter Entry And Active State

The toolbar should expose filtering without consuming the whole header.

Rules:

- Show a filter entry point or compact filter row near the toolbar.
- Show active filter count when filters are active.
- Show clear all filters when filters are active and space permits.
- If space is limited, active filter details can move below the toolbar or into the filter row.

Filter details are defined in `92-stage-9-filter-row-empty-states.md`.

## More Menu

The toolbar more menu is for secondary sidebar-level actions.

Candidate actions:

- refresh current document annotations;
- open cross-note overview when appropriate;
- open plugin settings;
- data maintenance shortcuts if already available elsewhere.

Rules:

- Do not duplicate card-level destructive actions in the toolbar.
- Do not turn the toolbar menu into a settings replacement.
- Keep menu labels short.

## Narrow Sidebar Behavior

When sidebar width is limited:

- keep count visible when possible;
- keep density mode switch accessible;
- keep hide marks toggle accessible;
- collapse secondary controls into more menu;
- avoid wrapping controls into multiple awkward rows.

If wrapping cannot be avoided, use a predictable two-row layout rather than overlapping controls.

## Bilingual Copy

Toolbar copy must fit in both Simplified Chinese and English.

Rules:

- Prefer icons with tooltips for compact controls.
- Avoid long button labels.
- Keep count format language-neutral where practical.
- Test common narrow widths in both languages.

## Out Of Scope

- Replacing the settings page.
- Adding new global navigation.
- Adding saved filter views.
- Adding keyboard shortcut design.
- Adding a large dashboard-style sidebar header.
