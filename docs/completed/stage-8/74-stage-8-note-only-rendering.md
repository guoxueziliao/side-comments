# Stage 8: Note-Only Rendering

Status: Confirmed

## Scope

This document defines how note-only annotations appear in the source document after Stage 8 separates visual marks from note content.

Note-only means:

- the annotation has an anchor;
- the annotation has note content;
- the user chose no visible mark.

In storage, `0.8.0` may still represent this with the internal compatibility `note` mark type. The UI should not expose that internal detail.

## Text Styling

Note-only annotations should not style the selected text as highlight, underline, or strikethrough.

The selected text should remain visually unchanged.

Reason:

- The user explicitly chose no visible mark.
- Note-only should mean "I attached a note here" rather than "I visually marked this text."

## Source Mode

In source mode, note-only annotations should use a lightweight editor-side indicator.

Preferred direction:

- show a small gutter or line-side note marker;
- do not alter inline text styling;
- clicking the marker opens or focuses the matching sidebar card.

The marker should follow the anchor line as closely as practical.

## Reading Mode

In reading mode, note-only annotations should avoid changing text styling.

Preferred direction:

- show a lightweight note indicator near the anchored text or line;
- avoid background color, underline, or strikethrough on the selected text;
- clicking the indicator opens or focuses the matching sidebar card.

If a stable reading-mode indicator is difficult in the first implementation pass, it is acceptable to start with a very subtle non-text marker, but not with a highlight-style background.

## Hide Marks Setting

The existing "hide annotation marks" behavior should also hide note-only indicators.

When marks are hidden:

- highlight, underline, and strikethrough rendering is hidden;
- note-only indicators are hidden;
- sidebar data remains unchanged.

## Out Of Scope

- Drawing connector lines between text and sidebar cards.
- Persistent inline icons that change Markdown content.
- Different note-only marker styles per tag or semantic category.
- Mobile-specific note-only rendering.
