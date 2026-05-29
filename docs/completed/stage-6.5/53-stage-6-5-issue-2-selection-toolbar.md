# Stage 6.5 Issue 2: Selection Toolbar And Creation Flow

Status: Confirmed

## Scope

This issue redesigns the selection toolbar to match the semantics confirmed in issue 1. It also defines how annotation type is expressed at creation time.

## Decision 1: Toolbar Shape

The selection toolbar shows four mark type buttons in a single row. Each button has a chevron affordance that opens a five-color sub-picker. A trailing overflow button opens an advanced creation panel.

Interaction:

- Mark type button, single click: applies the mark with the last-used color for that mark type. On first use the defaults from issue 1 apply.
- Chevron click: opens a five-color panel anchored to the button. Selecting a color applies the mark and updates the last-used color for that mark type.
- Overflow button, single click: opens an advanced creation panel that exposes mark type, color, annotation type, and an optional initial note in one form.

Reason for the split-button pattern:

- Single-click cost is unchanged for the dominant "highlight passage" path. Muscle memory is preserved.
- Color freedom is added without lengthening the common path.
- The chevron is a widely recognized affordance and needs no onboarding.
- The overflow button gives deliberate annotations (with type or initial note) an explicit entry point without forcing them onto the main path.

## Decision 2: Buttons Are Icon-Only

All toolbar buttons render as 28 by 28 px icon buttons with a tooltip on hover. The single-letter Chinese labels ("高", "下", "删", "注") and the English short labels currently used in `selectionToolbar.ts` and `commentCard.ts` are removed.

Icon assignment uses Lucide:

- Highlight: `highlighter`.
- Underline: `underline`.
- Strikethrough: `strikethrough`.
- Note: `sticky-note` or `message-square-text`.

Tooltips use the localized full labels from `i18n.ts` (`toolbar.highlight`, `toolbar.underline`, `toolbar.strikethrough`, and a new `toolbar.note` key replacing `toolbar.comment`).

## Decision 3: Annotation Type At Creation

Annotation type is not surfaced in the toolbar itself. It is set through two paths:

- The `note` mark auto-opens the comment card in edit mode with the annotation type dropdown visible, as defined in issue 1.
- Three command palette commands (`Add as question`, `Add as thought`, `Add as task`) accept the current selection. These commands can be bound to hotkeys.

This keeps the dominant `highlight passage as excerpt` path to a single click, while allowing deliberate annotations to express type at creation when the user wants to.

## Decision 4: Mode Parity

The selection toolbar behaves identically in source mode and reading mode. Only the underlying selection mapping differs, which is handled outside the toolbar and is unchanged by this issue.

## Visual Specifics

- Toolbar padding: 4 px.
- Mark type button size: 28 by 28 px.
- Icon size: 16 px.
- Chevron size: 12 px, positioned as a small caret at the bottom-right of each button.
- Overflow button: 28 by 28 px with a horizontal "..." icon, separated from the mark type buttons by a 1 px vertical divider.
- Positioning logic from `selectionToolbar.ts` (clamp to viewport) is preserved.

## Out Of Scope For Issue 2

- Modifier key shortcuts for the color picker (Shift + click and similar). These can be added later if needed.
- Stylus or touch interactions.
- Multi-select annotation creation.

## Downstream Effects

- Issue 3 must accept the `note` mark type in the comment card and treat it as visually distinct from highlight, underline, and strikethrough. The card's meta row icon must include a `note` glyph.
- Issue 5 must add the `toolbar.note` and `toolbar.note.short` keys (or omit short labels, since icon-only buttons no longer need them) and remove `toolbar.comment.short`.
