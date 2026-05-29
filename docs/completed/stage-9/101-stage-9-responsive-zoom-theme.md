# Stage 9: Responsive Zoom And Theme Adaptation

Status: Confirmed

## Scope

This document defines `0.9.0` layout requirements for Obsidian zoom, narrow sidebars, long text, bilingual UI, and theme adaptation.

The goal is to make the existing interface remain usable across common Obsidian window and sidebar sizes.

## Core Direction

`0.9.0` should treat layout stability as part of the user experience polish.

Rules:

- Cards, toolbars, filters, panels, and settings must not overlap at common widths.
- Text must remain readable or degrade predictably through truncation, wrapping, or compact controls.
- Controls must remain clickable after Obsidian zoom changes.
- Simplified Chinese and English labels must both fit the intended surfaces.
- Light and dark themes must both remain legible.

This is not a mobile or tablet design release. The plugin is planned for desktop Obsidian only.

## Width Targets

The plugin should be checked at several practical widths.

Recommended targets:

- narrow sidebar;
- normal sidebar;
- wide sidebar;
- split-pane layout;
- small desktop window.

Rules:

- The right sidebar must remain usable in narrow widths.
- Cross-note overview may use more horizontal space, but it still needs a usable narrow state.
- Settings page should not require an unusually wide window.
- No control row should rely on one fixed width that only works in the developer's current layout.

Exact pixel values can be chosen during implementation, but the design must support more than one comfortable width.

Small desktop windows are included for robustness. They do not imply support for mobile or tablet layouts.

## Obsidian Zoom

Obsidian zoom changes effective UI density.

Rules:

- Do not assume the default zoom level.
- Test normal zoom and increased zoom.
- Avoid fixed-height rows that clip text when zoom is increased.
- Avoid icon buttons that become too small to hit.
- Preserve spacing between adjacent controls when zoom changes.

Zoom adaptation should favor readable wrapping over clipped or overlapping text.

## Sidebar Cards

Sidebar cards are the most important responsive target.

Rules:

- Selected text preview must not overlap status, tags, or action controls.
- Note preview must wrap or clamp predictably.
- Metadata chips must wrap, collapse, or move to a secondary row when needed.
- Action buttons should remain accessible in narrow width.
- Compact mode must be genuinely usable, not only smaller.
- Normal mode should remain readable without becoming overly tall.

If a card has long selected text, long tags, and a note, the card should expand cleanly instead of compressing every part into one unreadable row.

## Toolbar And Filter Rows

Toolbar and filter rows should be compact but resilient.

Rules:

- Use icon-led controls where possible.
- Put secondary actions into a more menu when width is limited.
- Allow predictable two-row wrapping when a single row cannot fit.
- Keep active filter count visible where possible.
- Avoid controls that resize the entire sidebar when labels change.

The toolbar should stay useful even when the sidebar is narrow.

## Creation Toolbar And More Panel

The selection creation toolbar must not cover too much source text.

Rules:

- Direct mark buttons should be icon-led.
- Tooltips provide names for icon-only buttons.
- The More panel may use text labels because it has more room.
- Long labels in the More panel should wrap rather than overflow.
- The panel should fit normal editor widths without requiring horizontal scrolling.

This follows `99-stage-9-creation-toolbar-more-panel.md`.

## Settings Page

Settings should remain scannable in narrow and normal settings widths.

Rules:

- Section headings should stay readable.
- Setting descriptions should wrap cleanly.
- Buttons for data maintenance actions should not collide with descriptions.
- Dangerous action confirmations must fit without truncating critical meaning.
- Language selector labels should fit in Simplified Chinese and English.

Settings layout should follow `100-stage-9-settings-global-controls.md`.

## Bilingual Text

Every Stage 9 surface must tolerate both Simplified Chinese and English.

Rules:

- Avoid long visible button labels on compact surfaces.
- Prefer icons plus localized tooltips for tight controls.
- Let longer English labels wrap in panels and settings.
- Avoid layout assumptions based on Chinese text length only.
- Keep terminology consistent across both languages.

Any visual review should switch languages at least once.

## Theme Adaptation

The plugin should adapt to Obsidian light and dark themes.

Rules:

- Prefer Obsidian CSS variables for text, background, border, and accent colors.
- Avoid hard-coded backgrounds that fight user themes.
- Ensure marks, cards, chips, and focus feedback remain visible in light and dark themes.
- Do not rely only on color to show status.
- Keep contrast acceptable for selected, focused, resolved, and orphaned states.

The plugin may have its own identity, but it should still feel native inside Obsidian.

## No Overlap Rule

No Stage 9 UI surface should allow incoherent overlap.

Surfaces to check:

- current-document sidebar;
- cross-note overview;
- card edit panels;
- filter rows;
- selection toolbar;
- More panel;
- settings page;
- empty and loading states.

If space is insufficient, the layout should choose wrapping, hiding secondary details, or moving actions into a menu.

## Out Of Scope

- Mobile, tablet, or other non-desktop-specific interaction design.
- Custom per-theme design packs.
- User-defined CSS theme builder.
- Saved responsive layouts.
- Replacing Obsidian's built-in zoom behavior.
- Redesigning all plugin visuals only for one theme.
