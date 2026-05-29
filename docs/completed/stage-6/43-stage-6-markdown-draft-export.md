# Stage 6: Markdown Draft Export

Status: Confirmed

## Goal

Let users turn filtered or selected annotations into a Markdown draft for manual reading, writing, or handoff to another workflow.

## Version Boundary

Markdown draft export is planned as part of `0.6.0`.

It is an organization and handoff feature, not an automatic summary feature.

## Confirmed Direction

`0.6.0` should support copying or exporting filtered annotations as a Markdown draft.

The output should preserve source material and annotation metadata. It should not summarize, rewrite, infer conclusions, or generate new analysis.

The first version should copy the Markdown draft to the clipboard.

Saving the draft directly to a file is not part of the first version.

The output should group annotations by source document.

For the current-note sidebar, this naturally produces one source-document group. For cross-note review, this keeps source context readable.

The draft should include active, resolved, and orphaned annotations when they are present in the source result set.

Each annotation entry should show its status so the exported draft does not hide whether a source anchor is healthy, resolved, or orphaned.

The draft action should appear in both primary review surfaces:

- current-note sidebar;
- cross-note annotation review page.

The action label should be `Copy draft`.

In the current-note sidebar, it copies the current-note filtered result set. In the cross-note review page, it copies the cross-note filtered result set.

## Confirmed Non-Goals

- No automatic summary generation.
- No AI-generated conclusions.
- No automatic rewrite.
- No automatic source-note mutation.
- No automatic `thought-distillation` invocation.

## Source Scope

The draft can be generated from:

- the current visible filtered result set.

Manual multi-select is not part of the first version. Users should narrow the draft content with status, type, tag, color, and keyword filters before copying.

## Initial Output Content

Each annotation entry should include:

- selected source text;
- annotation note or remark;
- annotation status;
- annotation type;
- annotation tags;
- annotation color;
- source document link;
- source position or anchor reference when available.

## Initial Boundary

The first version should keep output predictable and plain.

It should not include:

- template management;
- multiple export templates;
- automatic title generation;
- automatic grouping by topic;
- automatic conversion into a distillation record.
- save-to-file behavior.

## Relationship To Thought Distillation

The Markdown draft can be used as material for a later explicit `thought-distillation` request.

The plugin should not claim the draft is already distilled content.

## Undecided Items

No open decisions for Markdown draft export in the first version.
