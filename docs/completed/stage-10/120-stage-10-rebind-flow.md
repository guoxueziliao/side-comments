# Stage 10: Rebind Flow

Status: Confirmed

## Scope

This document defines rebind behavior for orphaned current-document annotations in `0.10.0`.

Rebind flow covers:

- orphaned annotation display;
- source context recall;
- replacement selection requirements;
- preview and confirmation;
- successful recovery;
- failure behavior.

## User Goal

The user should be able to recover a lost annotation by selecting the correct replacement text and rebinding the annotation to it.

The user should not need to inspect sidecar data or manually edit JSON.

## State Boundary

Rebind is for orphaned annotations.

Rules:

- Active annotations use adjust range, not rebind.
- Resolved annotations use adjust range when still locatable.
- Orphaned annotations use rebind as the primary recovery action.
- Orphaned is a separate state from resolved.

## Orphaned Card Display

Orphaned cards should help the user identify what was lost.

Required visible information:

- original selected text;
- available before/after context;
- current note, mark, color, tags, and status where relevant;
- clear orphaned/lost-source signal.

Primary action:

- rebind.

Secondary actions:

- edit tags;
- delete annotation;
- restore or status actions only if they do not hide the need for recovery.

## Rebind Entry Flow

Expected flow:

1. User reads the orphaned card and original context.
2. User selects the intended replacement text in the current document.
3. User clicks rebind on the orphaned card.
4. Plugin validates the selection.
5. Plugin previews old text and new selected text.
6. User confirms.
7. Plugin updates anchor/range and clears orphaned state.

## Selection Requirements

The replacement selection must be usable.

Rules:

- Selection must belong to the current Markdown document.
- Empty selection is invalid.
- Selection must map to source text.
- Reading mode selections must map back to Markdown source before saving.
- If mapping confidence is too low, do not modify data.

Invalid selection behavior:

- show a concise notice;
- keep the annotation orphaned;
- do not create partial anchor data.

## Preview And Confirmation

Rebind should require confirmation.

Preview must show:

- old selected text;
- new selected text;
- enough context to avoid accidental binding.

The preview should make the change obvious:

- old -> new;
- lost context -> new context when available.

If the user cancels, data remains unchanged.

## Successful Rebind

After successful rebind:

- update the anchor/range;
- clear orphaned state;
- preserve note content;
- preserve mark type;
- preserve color;
- preserve tags;
- preserve resolved/active workflow status if the data model supports it safely;
- update source rendering immediately;
- keep the card in document order according to the new source position;
- apply temporary source and card feedback.

If preserving prior active/resolved status is ambiguous, Stage 10 implementation should choose the least surprising visible result and document it.

## Relationship To Adjust Range

Rebind and adjust range are separate operations.

Adjust range:

- used when the annotation is still locatable;
- changes the range intentionally;
- does not recover lost anchors.

Rebind:

- used when the annotation is orphaned;
- restores a lost anchor;
- requires original context and confirmation.

## Failure Behavior

Failure cases:

- no selection;
- selection cannot map to source;
- selected text belongs to another document;
- sidecar update fails;
- annotation is no longer orphaned by the time action runs;
- annotation was deleted before confirmation.

Expected behavior:

- show a concise notice;
- keep data unchanged;
- keep the orphaned card visible;
- do not mark the annotation as recovered.

## Filter Interaction

Rebinding can change whether the card matches active filters.

Rules:

- If the current filter is orphaned-only, successful rebind may remove the card from the visible list.
- Show a clear notice or focus transition so this does not look like data loss.
- Do not automatically clear filters unless later confirmed.

## Test Targets

Rebind regression should cover:

- orphaned card shows original selected text and context;
- rebind with no selection;
- rebind with source-mode selection;
- rebind with reading-mode selection;
- preview old text and new selected text;
- cancel preview leaves data unchanged;
- confirm preview clears orphaned state;
- note, mark, color, and tags are preserved;
- document order updates after rebind;
- orphaned-only filter behavior after successful rebind.

## Next Discussion

The next workflow topic is delete flow.

Delete flow should define deleting the whole annotation, deleting only the note, removing only the mark, confirmations, and post-delete feedback.
