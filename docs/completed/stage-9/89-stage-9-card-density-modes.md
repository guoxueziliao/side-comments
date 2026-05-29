# Stage 9: Card Density Modes

Status: Confirmed

## Scope

This document defines normal and compact card density behavior for the current-document sidebar in `0.9.0`.

The two modes should share the same information hierarchy and state semantics. They differ only in how much detail is visible at once.

## Confirmed Direction

Keep both modes:

- normal mode;
- compact mode.

Both modes must preserve:

- sorting;
- filtering;
- status meaning;
- card actions;
- mark-only, note-only, and mark-and-note interpretation.

Changing density should not change what an annotation is or how it behaves.

## Normal Mode

Normal mode is for reading, editing, and focused review.

It may show more detail because the user is likely working through annotations one by one.

Rules:

- Show selected text summary.
- Show note content when present.
- Note content may show up to 3-4 lines.
- Show the first 2-3 tags.
- Extra tags use `+N`.
- Show status.
- Show mark type and color signal.
- Directly expose add note or edit note action.
- Keep secondary and dangerous actions in the more menu.
- Card click handles navigation to source.

Normal mode should still stay compact. It should not turn every annotation into a large document-like block.

## Compact Mode

Compact mode is for scanning many annotations.

It should minimize height while keeping enough context to identify the annotation.

Rules:

- Selected text should show at most 1-2 lines.
- Note content should show at most 1-2 lines.
- Show at most 1 tag.
- Extra tags use `+N`.
- Keep status signal minimal.
- Keep mark and color signal minimal.
- Reduce direct actions.
- Prefer the more menu for secondary actions.

Compact mode should make long annotation lists easier to scan without hiding the annotation's basic identity.

## Mark-Only Density

Mark-only cards should be especially light in compact mode.

Rules:

- Do not reserve note-content space.
- Show selected text and visual mark signal.
- Avoid matching the height of note-bearing cards unless selected text requires it.
- Do not show empty-note placeholder text.

## Note-Only Density

Note-only cards must still expose the beginning of the note in compact mode.

Rules:

- Show selected text.
- Show the first 1-2 lines of note content.
- Use a lightweight `No visible mark` signal only when needed.
- Do not collapse the card into only a no-mark label.

## Mark-And-Note Density

Mark-and-note cards should keep both identities visible.

Rules:

- Show visual mark signal.
- Show selected text.
- Show note content.
- In compact mode, note content should remain more important than mark metadata.

## Mode Switching

Switching modes should avoid disorienting the user.

Rules:

- Do not change sort order.
- Do not clear filters.
- Do not reset selected or focused card state.
- Try to keep the current card visible after switching.
- Avoid large scroll jumps when possible.

## Out Of Scope

- Creating more than two density modes.
- Per-card custom density.
- Saved card layouts.
- Changing annotation data based on density mode.
- Hiding mark-only annotations by default in compact mode.

Detailed action visibility in normal and compact modes is confirmed in `90-stage-9-card-actions-menu.md`.

Navigation and focus feedback is confirmed in `91-stage-9-navigation-focus-feedback.md`.

Toolbar density switching is confirmed in `96-stage-9-sidebar-toolbar.md`.
