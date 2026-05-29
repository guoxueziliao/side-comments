# Stage 6: Annotation Types

Status: Confirmed

## Goal

Add a lightweight type dimension so annotations can be distinguished by intent instead of only by color, status, or note position.

## Version Boundary

Annotation type is the first confirmed classification dimension for `0.6.0`.

## Confirmed Decision

`0.6.0` should introduce annotation type before more flexible organization features such as free tags, saved views, or review queues.

The default type for new annotations is Excerpt.

Type selection is optional in the creation flow. The user should be able to create an annotation without explicitly choosing a type.

Existing annotations should not be batch-migrated just to add a type field.

## Confirmed Type Set

Initial annotation types for `0.6.0`:

- Excerpt.
- Question.
- Thought.
- Task.

These four types are enough for the first version. More types should not be added unless a concrete workflow requires them.

## Product Role

Annotation type should help with:

- filtering annotations in the current-note sidebar;
- filtering annotations in cross-note review;
- deciding which annotations can connect naturally to later workflows;
- distinguishing a simple excerpt from a question that may later enter `thought-distillation`.
- distinguishing a task-like annotation without turning the plugin into a task manager.

## Initial Boundary

Type should be a lightweight metadata field.

It should not replace:

- annotation status;
- color;
- user-defined tags;
- Obsidian native tags;
- source-note folders or links.

`0.6.0` should only support type marking and type-based filtering. It should not implement task management, distillation generation, or workflow automation based only on type.

The default Excerpt type preserves the current creation flow: selecting text and creating an annotation should still work without requiring an extra classification decision.

If the user does not explicitly choose a type when creating a new annotation, the annotation should be treated as Excerpt.

When reading an existing annotation without a type field, the UI should display it as Excerpt. The plugin should only write the type field back when that annotation is edited or otherwise saved by the user.

Type should be available in both creation and later review:

- The creation floating toolbar should provide a compact type selector.
- The sidebar card should allow changing the type after creation.
- The creation selector must not block fast annotation creation; leaving it untouched keeps the default Excerpt type.

The type selector should use the same dropdown interaction in both places:

- In the creation floating toolbar, show a compact dropdown with Excerpt selected by default.
- In the sidebar card, show the same dropdown for later edits.
- Do not use four separate permanent buttons for the initial version; the toolbar should stay compact.

## Undecided Items

No open decisions for the first annotation type pass.
