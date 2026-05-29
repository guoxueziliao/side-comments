# Stage 9: Interface And Interaction Experience

Status: Confirmed

## Version Boundary

Target version: `0.9.0`.

Stage 9 is planned after `0.8.0`. It should build on the simplified mark/note model instead of reopening the Stage 8 product model.

## Goal

Improve the day-to-day interface and interaction experience after the annotation model is simplified.

`0.9.0` should focus on how the plugin feels while creating, reviewing, editing, filtering, and navigating annotations.

## Confirmed Positioning

`0.9.0` starts from interface and interaction.

The core feature set is treated as largely complete for this planning stage. The version should focus on user experience, visual clarity, and interaction flow rather than adding another major product capability.

This means the version is not primarily:

- a new data model version;
- a new import/export version;
- a large-vault performance version;
- a knowledge-management expansion version;
- an AI feature version.

## Initial Discussion Areas

These are candidate areas for discussion, not confirmed scope yet:

- Selection toolbar interaction after Stage 8.
- More modal ergonomics.
- Sidebar card layout, density, and visual hierarchy.
- Card edit panels and action menus.
- Jump, scroll, and temporary target feedback.
- Text-to-card and card-to-text navigation clarity.
- Cross-note overview readability.
- Filter row layout and active-filter feedback.
- Empty states, loading states, and error states.
- Settings page wording and grouping.
- Bilingual UI copy consistency.

## Product Direction

The UI should stay work-focused and compact.

The plugin is used while reading and writing notes, so UI should not compete with the document. It should make common actions easy to discover without turning every annotation into a heavy card.

The design work should improve the feeling of existing workflows:

- creating annotations;
- reviewing annotations;
- editing marks, notes, tags, and status;
- filtering and finding annotations;
- jumping between source text and cards;
- understanding current state without reading long instructions.

Preferred direction:

- fewer competing controls;
- clearer action grouping;
- compact but readable cards;
- predictable navigation feedback;
- consistent current-document and cross-note behavior;
- no decorative UI that reduces reading focus.

## First Decision To Discuss

The first `0.9.0` decision should be the main surface priority:

- creation toolbar and more modal;
- right sidebar and card interaction;
- cross-note overview;
- settings and global controls.

Only one should be treated as the first priority. Other surfaces can still be adjusted when directly affected.

Confirmed first priority:

- Right sidebar cards and the current-document annotation list.

See `86-stage-9-sidebar-card-experience.md`.

Confirmed card information hierarchy is recorded in `87-stage-9-card-information-hierarchy.md`.

## Out Of Scope For Initial Planning

- Reopening the Stage 8 mark/note data model.
- Adding saved views or review queues.
- Adding priority or importance.
- Adding AI summary, classification, rewrite, or repair suggestions.
- Adding full-vault Markdown body search.
- Adding mobile, tablet, or other non-desktop-specific interaction design.
