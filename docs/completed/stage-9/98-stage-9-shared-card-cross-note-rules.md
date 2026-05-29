# Stage 9: Shared Card And Cross-Note Rules

Status: Confirmed

## Scope

This document defines which sidebar card rules can be shared with the cross-note overview in `0.9.0`.

The goal is to keep visual language consistent while avoiding a cross-note view that copies every current-document interaction.

## Core Direction

The current-document sidebar is the primary design target for Stage 9 card work.

The cross-note overview may reuse the same card component foundation, but it should adapt behavior to the fact that the source document may not already be open.

Rules:

- Share card visual language between current-document and cross-note views.
- Keep interaction rules different where the source context is different.
- Do not make cross-note cards as locally editable as current-document cards unless the source document context is available.
- Do not let cross-note requirements make the current-document sidebar heavier.

The current-document sidebar remains the place for precise reading, editing, rebinding, and source-position review.

## Shared Card Parts

These parts should stay consistent between current-document cards and cross-note cards:

- selected text or anchor summary;
- mark-only, note-only, and mark-and-note distinction;
- visual mark type and color display;
- note preview;
- status labels;
- tag chips;
- lightweight metadata style;
- resolved and orphaned visual treatment;
- compact and normal density principles.

Shared visual rules should follow:

- `87-stage-9-card-information-hierarchy.md`;
- `88-stage-9-card-visual-style.md`;
- `89-stage-9-card-density-modes.md`;
- `94-stage-9-resolved-orphaned-card-experience.md`.

## Current-Document Sidebar Behavior

Current-document cards can assume the source document is already the active context.

Current-document-only behaviors:

- clicking a card scrolls to and focuses the source range;
- source text or source mark click focuses the matching sidebar card;
- local card edit panels are available;
- adjust range is available for normal annotations;
- rebind is available for orphaned annotations;
- current focus state is shown in the sidebar;
- scroll behavior targets the visual center where possible.

These behaviors depend on a live editor or reading view, so they should not be blindly copied into cross-note cards.

## Cross-Note Overview Behavior

Cross-note cards must make source context more visible.

Rules:

- Show source document name or path more prominently than in the current-document sidebar.
- Clicking a card opens the source document.
- After opening, focus or jump to the annotation when possible.
- If focus cannot be completed, keep the card visible and show a clear status.
- Grouping by source document can remain a cross-note-specific layout option.
- Editing may be limited, or routed into the source document/sidebar workflow.

Cross-note overview should support review across documents, not replace the current-document sidebar.

## Editing Boundary

Cross-note editing should stay conservative.

Allowed if implementation remains simple:

- copy text or note;
- open source document;
- basic status changes when data integrity is clear.

Prefer routing to source document for:

- editing selected text range;
- adjusting range;
- rebinding orphaned anchors;
- complex mark and note edits;
- resolving conflicts after the source document changed.

This keeps high-risk edits close to the source text.

## Density Difference

The cross-note overview may need more source context than the current-document sidebar.

Rules:

- Do not force cross-note cards to be as dense as current-document compact cards.
- Keep document name, path, or source grouping readable.
- Avoid repeating long path text on every card if cards are grouped by source.
- Preserve the Stage 9 visual style even when cross-note cards carry extra context.

The shared component should support variation without creating two unrelated card designs.

## Terminology

Terminology should stay consistent across both surfaces.

Use the same words for:

- annotation;
- mark;
- note;
- tag;
- resolved;
- orphaned;
- rebind;
- adjust range.

Cross-note-specific text can mention opening the source document, but it should not introduce a separate product vocabulary.

## Out Of Scope

- Making cross-note overview the primary editing surface.
- Adding saved cross-note layouts.
- Adding cross-note review queues.
- Adding connector lines between cards and source text.
- Adding new data fields only for cross-note display.
