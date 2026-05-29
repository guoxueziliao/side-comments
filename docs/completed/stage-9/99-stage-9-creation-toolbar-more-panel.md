# Stage 9: Creation Toolbar And More Panel

Status: Confirmed

## Scope

This document defines `0.9.0` interaction polish for the selection creation toolbar and the More panel.

The goal is to make annotation creation faster and clearer after the Stage 8 model change.

## Core Direction

`0.9.0` should not reopen the Stage 8 model.

The creation flow remains based on:

`Annotation = Anchor + Optional Mark + Optional Note`

Rules:

- Do not bring back fixed annotation type buttons such as `摘录 / 问题 / 想法 / 任务`.
- Do not add a new required creation step.
- Do not make users choose a classification before creating a simple mark.
- Keep fast visual marking as the primary toolbar job.
- Use the More panel for optional details.

The toolbar should feel quick. The More panel should feel complete but not heavy.

## Selection Toolbar Role

The selection toolbar appears after the user selects source text.

Its role:

- create a visual mark quickly;
- open the More panel for richer creation;
- avoid long labels that block the document;
- stay easy to scan in both Simplified Chinese and English.

Preferred direct actions:

- highlight;
- underline;
- strikethrough;
- more.

The existing More entry can continue to serve as the expanded path.

## Direct Button Behavior

Direct toolbar buttons create or update the annotation for the current selection.

Rules:

- Highlight creates a highlight mark.
- Underline creates an underline mark.
- Strikethrough creates a strikethrough mark.
- If the same selected range already has an annotation, follow the duplicate selection behavior from Stage 8.
- Direct buttons should not require note text.
- Direct buttons should not ask for tags before creating the mark.

This preserves the lightweight reading workflow.

## More Panel Role

The More panel is for optional information and less common choices.

It may include:

- note text;
- mark type;
- color;
- tags;
- resolved state only if appropriate for editing existing annotations;
- confirm and cancel actions.

Rules:

- The panel should not look like a full settings page.
- The panel should not require every field.
- Empty note is allowed when the user only wants a visual mark.
- No fixed annotation type field should appear.
- Field order should match common use: note first, then visual mark details, then tags or status.

The panel should support richer creation without making the default path slower.

## Visual Design

The toolbar should be compact and icon-led.

Rules:

- Prefer icons with tooltips over long text labels.
- Keep hit targets usable.
- Keep spacing stable when language changes.
- Do not let the toolbar cover too much selected text.
- Avoid decorative backgrounds that compete with the editor.

The More panel can use labels because it has more space, but labels should remain short.

## Bilingual Behavior

Toolbar and More panel copy must work in Simplified Chinese and English.

Rules:

- Icon buttons use localized tooltips.
- Text buttons should be short.
- Avoid labels that become awkwardly long in English.
- The same action should use the same term as card actions and filters.

Terminology should align with:

- `75-stage-8-ui-copy.md`;
- `90-stage-9-card-actions-menu.md`;
- `96-stage-9-sidebar-toolbar.md`.

## Update Existing Annotation From Selection

When the selected range already has an annotation, the toolbar should update rather than duplicate where possible.

Rules:

- Selecting an existing highlighted range and clicking underline changes or adds the visual mark according to Stage 8 duplicate-selection rules.
- Opening More on an existing annotation should show the current values.
- Saving More should update the existing annotation.
- Cancelling More should preserve the existing annotation unchanged.

This keeps the creation toolbar compatible with edit-like workflows without adding a separate mode.

## Error And Disabled States

The toolbar should fail quietly and clearly.

Examples:

- no valid selection;
- unsupported view;
- selection cannot be mapped;
- source document is not writable;
- annotation store is unavailable.

Rules:

- Hide the toolbar when there is no usable selection.
- Disable actions only when the reason is obvious or can be shown in a tooltip.
- Use short notices for failures.
- Do not create partial annotations when anchor creation fails.

## Out Of Scope

- Reintroducing fixed annotation type controls.
- Adding a multi-step creation wizard.
- Adding keyboard shortcut design.
- Adding AI-assisted note generation.
- Adding custom user-defined toolbar layouts.
- Adding a new storage schema only for toolbar polish.
