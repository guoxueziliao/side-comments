# Stage 6: Annotation Organization and Classification

Status: Confirmed

## Goal

Make annotations easier to organize, distinguish, filter, and review after the plugin already supports stable anchors, sidebar workflow, cross-note review, and data maintenance.

## Version Boundary

This work is the first confirmed priority for `0.6.0`.

The classification model is type plus optional user-defined tags, supported by combined filters.

## Planning Rule

Do not design a large taxonomy in one step.

Confirm one classification dimension at a time, then add detail documents if the topic becomes large.

## Why This Comes First

Annotation organization is closer to the current plugin surface than distillation or summary generation.

It can also prepare cleaner inputs for later workflows, including manual handoff into `thought-distillation`.

## Candidate Classification Dimensions

- Annotation type, such as excerpt, question, thought, or task.
- Annotation status, building on active, resolved, and orphaned states.
- User-defined labels or tags.
- Source context, such as article section, document path, or review source.

## Initial Boundary

`0.6.0` should focus on classification that improves review and filtering.

It should avoid becoming a general knowledge management system or replacing Obsidian's native tags, links, and folders.

Review priority or importance is not part of the plan, now or later.

The plugin should not introduce a first-class important/core/priority dimension for annotations.

Color should remain a visual marker only.

Color should not become a semantic classification system. Type and tags are responsible for annotation organization.

Annotation collections and review queues are not part of the plan, now or later.

The plugin should use type, tags, and filters for annotation organization instead of introducing separate collection or queue concepts.

Saved views and saved filters are not part of `0.6.0`.

This version should use type, tags, combined filters, session-level filter memory, and one-click filter reset instead.

## Confirmed First Dimension

The first confirmed classification dimension is annotation type.

Details are tracked in `40-stage-6-annotation-types.md`.

## Confirmed Second Dimension

The second confirmed organization dimension is optional user-defined annotation tags.

Details are tracked in `41-stage-6-annotation-tags.md`.

## Confirmed Filter Direction

`0.6.0` should provide combined filters for status, type, tag, color, and keyword.

Details are tracked in `42-stage-6-annotation-filters.md`.

## Confirmed Draft Direction

`0.6.0` should support copying or exporting filtered annotations as a Markdown draft for manual organization and handoff.

Details are tracked in `43-stage-6-markdown-draft-export.md`.

## Out Of Scope

- Automatic semantic classification.
- AI-generated tags or categories.
- Full knowledge graph generation.
- Global ontology management.
- Mandatory classification for every annotation.
- Automatic summary generation.

## Confirmed Exclusion

- Review priority or importance.
- Semantic color categories.
- Annotation collections.
- Review queues.
- Automatic summary generation.

## Confirmed Deferral

- Saved views or saved filters in `0.6.0`.

## Undecided Items

No open decisions for annotation organization in the first version.
