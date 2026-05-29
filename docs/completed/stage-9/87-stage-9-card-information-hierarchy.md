# Stage 9: Card Information Hierarchy

Status: Confirmed

## Scope

This document defines the information hierarchy for current-document sidebar cards in `0.9.0`.

It builds on the Stage 8 annotation model:

`Annotation = Anchor + Optional Mark + Optional Note`

## Card Row Structure

Each card should be arranged around three zones:

1. Header row: location, visual identity, and quick state.
2. Body: selected text and note content.
3. Metadata/action area: tags, low-priority metadata, and secondary actions.

## Header Row

The header row should stay compact.

Left side:

- Visual mark signal: color bar, color dot, or mark icon.
- The signal should identify highlight, underline, strikethrough, or no visible mark.

Middle:

- Selected text summary.
- This is the main card title because it tells the user which source range the annotation belongs to.

Right side:

- Status indicator.
- More menu.

Do not overload the header row with long labels. The header should make cards scannable, not explain every field.

## Body

The body prioritizes note content when it exists.

Rules:

- Cards with note content show the note prominently.
- Normal mode may show up to 3-4 lines of note content.
- Compact mode may show 1-2 lines of note content.
- Cards without note content do not show an empty-note placeholder.
- Mark-only cards stay lightweight.

The selected text remains visible, but note content should become the most readable part of note-bearing cards.

## Metadata Area

Low-priority metadata should not compete with selected text or note content.

Metadata includes:

- tags;
- source position;
- updated time;
- detailed status text;
- secondary mark information.

Rules:

- Tags may show the first 2-3 values.
- Extra tags use `+N`.
- Long metadata should be hidden, truncated, or placed behind an expanded state.
- Status should be visible but should not push selected text or note content out of view.

## Action Area

Only high-frequency actions should be directly exposed.

Direct actions:

- Add note or edit note.

Navigation does not need a dedicated jump button. Card click handles card-to-source navigation.

More menu actions:

- Adjust range.
- Edit mark.
- Delete note.
- Remove mark.
- Delete annotation.
- Rebind orphaned annotation.

Dangerous actions should stay in the more menu and require confirmation where data would be lost.

Detailed action grouping and menu behavior is confirmed in `90-stage-9-card-actions-menu.md`.

## Card Type Distinction

### Mark-Only

Mark-only cards should emphasize visual mark identity.

Rules:

- Show selected text.
- Show mark type and color.
- Do not show empty-note placeholder text.
- Keep the card visually light.

### Note-Only

Note-only cards should emphasize note content.

Rules:

- Show selected text.
- Show note content prominently.
- Show `No visible mark` as a lightweight label when needed.
- Do not make the source text look visually marked.

### Mark-And-Note

Mark-and-note cards should show both concepts, but note content comes first.

Rules:

- Show visual mark identity.
- Show selected text.
- Show note content prominently.
- Keep mark metadata lower priority than note content.

## Out Of Scope

- Changing Stage 8 state-transition rules.
- Adding multiple independent notes on the same anchor.
- Adding priority or importance.
- Adding saved card layouts.
- Adding decorative card styles.

Visual styling direction is confirmed separately in `88-stage-9-card-visual-style.md`.

Normal and compact density behavior is confirmed separately in `89-stage-9-card-density-modes.md`.

Navigation and focus feedback is confirmed separately in `91-stage-9-navigation-focus-feedback.md`.
