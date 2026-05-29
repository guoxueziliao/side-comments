# Stage 9: Card Visual Style

Status: Confirmed

## Scope

This document defines the visual style direction for current-document sidebar cards in `0.9.0`.

The goal is low visual noise, strong scanning, and weak decoration.

## Core Direction

Sidebar cards should support reading and review without competing with the source document.

Confirmed direction:

- low noise;
- strong scanning;
- weak decoration;
- compact spacing;
- theme-compatible color usage;
- clear focus feedback.

## Card Surface

Cards should not feel heavy.

Rules:

- Do not use large shadows.
- Do not use strong borders by default.
- Do not use full-card colored backgrounds for annotation color.
- Do not use decorative gradients or ornamental card treatments.
- Keep the card background neutral and compatible with Obsidian themes.

Preferred background tokens:

- `--background-secondary`;
- `--background-primary-alt`;
- other existing Obsidian theme variables when appropriate.

## Mark Color Signal

Use a narrow visual signal for mark color.

Preferred options:

- left-side thin color bar;
- small color dot near the mark icon;
- compact mark icon plus color accent.

Avoid:

- filling the whole card with mark color;
- using high-saturation backgrounds behind note content;
- making mark color stronger than the selected text or note.

## Border And Radius

Default card border should be quiet.

Rules:

- Use a low-contrast 1px border by default.
- Strengthen border only on hover, focus, or active target state.
- Keep radius small: 6-8px.
- Avoid large rounded card shapes.

## Spacing

Cards should remain dense enough for long annotation lists.

Rules:

- Card padding should generally stay around 8-10px.
- Gap between cards should generally stay around 6-8px.
- Compact mode may reduce padding and vertical gaps further.
- Hover and focus states must not change card dimensions.

## Focus And Jump Feedback

When source text jumps to a card, or a card jumps to source text, feedback should be clear but restrained.

Rules:

- Strengthen the card border temporarily.
- Strengthen the left color bar temporarily when present.
- Use a short-lived focus state.
- Avoid large-area highlight fills.
- Avoid animation that distracts from reading.

## State Styling

### Active

Active cards use normal contrast.

They should feel available and editable.

### Resolved

Resolved cards use reduced contrast.

Rules:

- Keep selected text readable.
- Keep location and state understandable.
- Do not fade the card so far that it feels disabled or lost.

### Orphaned

Orphaned cards use a gentle warning treatment.

Rules:

- Use a warm warning accent or state label.
- Do not use aggressive error-red styling unless data loss has occurred.
- Keep rebind action discoverable.

Detailed resolved and orphaned card behavior is confirmed in `94-stage-9-resolved-orphaned-card-experience.md`.

## Card Type Styling

### Mark-Only

Mark-only cards are visually lighter.

Rules:

- Emphasize mark color and selected text.
- Do not show empty-note space.
- Avoid making the card as tall as a note-bearing card.

### Note-Only

Note-only cards emphasize written content.

Rules:

- Use no colored mark bar, or use a neutral side line.
- Avoid visual styling that implies source text is highlighted.
- Make note content the main visual element.

### Mark-And-Note

Mark-and-note cards show both mark identity and note content.

Rules:

- Keep mark color visible but secondary.
- Keep note content easier to read than metadata.
- Do not let the visual mark signal dominate the note.

## Out Of Scope

- A decorative card redesign.
- Large shadows or floating card effects.
- Full-card color themes per annotation.
- New semantic meanings for colors.
- Changing the Stage 8 card state model.

Normal and compact density behavior is confirmed separately in `89-stage-9-card-density-modes.md`.
