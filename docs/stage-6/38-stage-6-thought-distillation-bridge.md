# Stage 6: Thought Distillation Bridge

Status: To discuss

## Goal

Define how annotation review can hand off material into the explicit `thought-distillation` workflow without turning the plugin into an automatic AI writing system.

## Version Boundary

This work is part of `0.6.0`.

It is a bridge between review workflow and downstream distillation, not a replacement for the `thought-distillation` skill.

## Planning Rule

Confirmed decisions should stay split into small documents.

Do not merge this bridge work into the general Stage 6 overview.

## What the Skill Tells Us

- `thought-distillation` only triggers on explicit user request.
- It preserves raw user questions and AI answers in a human-readable layer.
- It also writes a hidden model layer for later export.
- For article-triggered flows, it can write back an `AI补充解读（非原文）` section and create or update a separate distilled record.

## Confirmed Input Shape

- In the usual usage pattern, the user first提出问题 and marks the relevant text before invoking the skill.
- The bridge should therefore assume an explicit question plus an already marked source span.
- Open-ended notes without a clear question should not be treated as the primary bridge case.

## Candidate Directions

- Add a manual handoff from a reviewed annotation to a distillation draft.
- Add a manual handoff from a note or annotation to a source-note AI supplement area.
- Preserve the original selected text, note link, and review context as source material for downstream distillation.
- Keep the handoff explicit so the user still controls whether `thought-distillation` is actually invoked.
- Reuse the distillation skill's two-layer output model instead of inventing a new record format.

## Initial Boundary

`0.6.0` should provide a bridge, not automatic generation.

The plugin can organize and launch the handoff, but it should not silently create distilled content or pretend to have run the skill.

## Out Of Scope Until Confirmed

- Automatic distillation from every reviewed annotation.
- Hidden background generation of AI supplement text.
- Replacing the existing `thought-distillation` skill workflow.
- Full vault-wide semantic summarization.

## Undecided Items

- Which annotation states should expose the handoff entry point.
- Whether the handoff targets a source-note supplement, a separate distilled note, or both.
- Whether the bridge should only pass material, or also open a prepared template.
- Whether this belongs in the sidebar, the note panel, or settings.
- Whether the bridge should support non-question notes as a secondary path.
