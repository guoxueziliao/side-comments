# Stage 8: Simplification And Annotation Model Redesign

Status: To discuss

## Version Boundary

Stage 8 is planned after `0.7.0` is completed. It should not interrupt or rewrite the in-progress `0.7.0` data maintenance implementation.

Target version: `0.8.0`.

## Goal

Redesign the annotation model around the user's actual actions:

1. Select text.
2. Optionally leave a visual mark.
3. Optionally write a note.

The plugin should stop treating every visual mark as if it automatically required a comment.

## Confirmed Model

The Stage 8 model is:

`Annotation = Anchor + Optional Mark + Optional Note`

Fields:

- `anchor`: the selected text range and recovery metadata.
- `mark`: optional visual presentation in the product model.
- `note`: optional user-written note.
- `tags`: optional user-defined organization.
- `status`: active, resolved, or orphaned.

This separates visual marking from note-taking.

## Storage Compatibility Decision

`0.8.0` uses a compatibility-first storage approach.

The product model treats `mark` as optional, but the storage layer may continue using the internal `note` mark type for pure note/comment annotations.

Confirmed:

- Do not make `mark` truly optional in the sidecar schema in `0.8.0`.
- Keep using the existing internal `note` mark type for annotations with no visible mark.
- Hide this implementation detail from the UI.
- Do not introduce a sidecar schema migration only to remove `note` mark.

Reason:

- `0.7.0` is already building import, export, health check, and repair tools on the current data shape.
- `0.8.0` should simplify the product behavior without forcing another data maintenance rewrite immediately afterward.
- A real storage cleanup can be considered later only if the compatibility cost becomes worth it.

## Mark And Note Combinations

Valid combinations:

- Highlight with no note: visual highlight only.
- Highlight with note: highlighted text plus a sidebar note.
- Underline with no note: visual underline only.
- Underline with note: underlined text plus a sidebar note.
- Strikethrough with no note: visual strikethrough only.
- Strikethrough with note: struck text plus a sidebar note.
- No visual mark with note: pure note/comment anchored to the selected text.

Invalid combination:

- No visual mark and no note. This should not create an annotation.

## Annotation Type Removal

The fixed types `excerpt`, `question`, `thought`, and `task` made the interface feel like it was asking the user to classify every annotation too early. The plugin should return to a simpler model:

- mark controls visual presentation;
- note content controls whether the annotation is a comment;
- color remains a visual marker;
- tags provide flexible user-defined organization;
- status records workflow state.

## Confirmed Direction

The fixed annotation type feature should be removed from the UI in `0.8.0`.

Remove user-facing surfaces for:

- `摘录 / Excerpt`;
- `问题 / Question`;
- `想法 / Thought`;
- `任务 / Task`.

The feature should be deprecated conservatively rather than removed destructively from old data.

## UI Direction

The selection toolbar should be redesigned around two separate concepts:

- visual mark actions: highlight, underline, strikethrough;
- more action: opens additional creation options, including adding a note/comment.

The toolbar should not imply that `highlight`, `underline`, or `strikethrough` always creates a written comment.

Primary toolbar buttons:

- Highlight.
- Underline.
- Strikethrough.
- More.

The note/comment action is not a primary toolbar button. It lives under `More` so the fast path stays focused on visual marking.

`More` should keep the current advanced creation modal pattern:

- Title: create annotation.
- Mark type selector.
- Color selector.
- Initial note textarea.
- Cancel and Create buttons.

The fixed annotation type selector is removed from this modal. The modal should not show `摘录 / 问题 / 想法 / 任务`.

Detailed `More` modal behavior is confirmed in `73-stage-8-advanced-create-modal.md`.

Note-only rendering in source and reading mode is confirmed in `74-stage-8-note-only-rendering.md`.

The sidebar should distinguish:

- mark-only annotations, shown as lightweight entries with selected text and visual style;
- note annotations, shown with selected text plus note content;
- annotations that have both mark and note.

Mark-only annotations should appear in the sidebar by default. Highlight, underline, and strikethrough entries are still managed annotations even when the user writes no note.

Mark-only sidebar cards:

- show the selected source text;
- show mark type and color;
- do not show empty-note placeholder text;
- keep management actions available: jump, adjust range, delete, and add note;
- jump to the source text when the card body is clicked;
- become normal note cards after the user adds note content.

## Draft Copy Behavior

Copying a Markdown draft should include note-bearing annotations only.

Mark-only annotations are not copied into Markdown drafts. A pure highlight, underline, or strikethrough without note content is a visual reading mark, not draft writing material.

JSON export remains a separate maintenance concern and may still include mark-only annotations so data can be backed up and restored. See `70-stage-8-compatibility-and-export.md`.

The word `摘录 / Excerpt` should not be used as a user-facing type. The selected text is already the excerpt.

## Compatibility Policy

Existing sidecar data may already contain `annotationType`.

`0.8.0` should:

- continue reading old `annotationType` fields without failing;
- avoid batch-migrating or deleting old fields automatically;
- stop showing annotation type controls in the UI;
- stop writing annotation type for newly created annotations;
- ignore annotation type in filtering and display.

This keeps `0.7.0` exports and imports compatible while allowing the product UI to simplify afterward.

Detailed import/export behavior is confirmed in `70-stage-8-compatibility-and-export.md`.

Filtering behavior after annotation type removal is confirmed in `71-stage-8-filtering.md`.

Card action behavior is confirmed in `72-stage-8-card-actions.md`.

## Candidate Removal Points

Implementation should inspect and remove or hide annotation type behavior from:

- selection toolbar advanced creation modal;
- command palette typed creation commands;
- comment card meta row;
- comment card edit panel;
- current-document filters according to `71-stage-8-filtering.md`;
- cross-note filters according to `71-stage-8-filtering.md`;
- Markdown draft formatting if annotation type is still shown;
- import/export display fields according to `70-stage-8-compatibility-and-export.md`.

Implementation should also inspect every place that assumes `note.content` is always present or that `mark` is always present. Stage 8 should make both concepts optional at the product-model level, even if the storage migration keeps compatibility helpers internally.

## Out Of Scope

- Removing user-defined tags.
- Removing visual mark types: highlight, underline, strikethrough.
- Removing colors.
- Removing status: active, resolved, orphaned.
- Adding saved views, saved filters, review queues, priority, or automatic AI behavior.
- Interrupting `0.7.0` implementation.

## Open Decisions

None for the confirmed Stage 8 simplification scope.
