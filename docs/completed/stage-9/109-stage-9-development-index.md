# Stage 9: Development Index

Status: Completed

## Scope

This document is the implementation entry point for `0.9.0`.

Use it to navigate the Stage 9 documents without rereading every planning note in numeric order.

## Version Goal

Stage 9 is a desktop Obsidian UI and interaction polish release.

It focuses on:

- current-document sidebar card experience;
- creation toolbar and More panel polish;
- cross-note card consistency;
- settings and global control cleanup;
- Simplified Chinese and English UI copy consistency;
- desktop zoom, sidebar width, and theme robustness.

## Implementation Summary

Stage 9 is implemented. The annotation data model (`Annotation = Anchor + Optional Mark + Optional Note`) was preserved from Stage 8.

Key outcomes beyond the original plan:

- Removed fixed annotation types (`annotationType`) from all data flow: create, update, draft, export, cross-note view, and commands.
- Removed typed create commands (`addAsQuestion`, `addAsThought`, `addAsTask`).
- Simplified selection toolbar: removed color picker chevron, removed "note" mark button, removed wrapper div. Toolbar shows highlight/underline/strikethrough and a More overflow button.
- Replaced `AnnotationTypeFilter` with `NoteStateFilter` ("all" | "has-note" | "no-note") in both current-document sidebar and cross-note overview.
- Added `annotationState.ts` module with `getAnnotationState`, `hasNoteContent`, `isVisualMark`, `isNoteOnlyMark`, `matchesNoteStateFilter`.
- Editor extension filters out note-only marks from inline rendering.
- Health check detects empty annotations (no mark and no note content).
- Settings reorganized into 4 groups: Display, Creation, Maintenance (with Sidebar as h4), Language.
- Menu positioning uses `showMenuAtElement` / `showMenuAtEventTarget` for stable anchoring.
- Markdown draft output filters out mark-only annotations and removes the type line.
- Card hierarchy, density modes, filter chips, navigation feedback, and flash animation implemented as planned.

## Read First

Start with these documents before implementation:

1. [Interface And Interaction Experience](./85-stage-9-ui-interaction.md): version positioning and product direction.
2. [UI Copy And Labels](./102-stage-9-ui-copy-and-labels.md): final terminology and UI copy.
3. [Implementation Order](./103-stage-9-implementation-order.md): recommended build sequence.
4. [Release Boundary](./108-stage-9-release-boundary.md): included and excluded release scope.
5. [Post-Implementation UI Regression Fixes](./110-stage-9-post-implementation-ui-regression.md): corrections found after initial Stage 9 implementation.

These four documents define the working frame.

## Implementation Sequence

Follow this order unless code state makes a narrow adjustment necessary:

1. Copy and i18n foundation.
   - [UI Copy And Labels](./102-stage-9-ui-copy-and-labels.md)

2. Card structure and visual hierarchy.
   - [Sidebar Card Experience](./86-stage-9-sidebar-card-experience.md)
   - [Card Information Hierarchy](./87-stage-9-card-information-hierarchy.md)
   - [Card Visual Style](./88-stage-9-card-visual-style.md)
   - [Card Density Modes](./89-stage-9-card-density-modes.md)

3. Card actions and local editing.
   - [Card Actions And More Menu](./90-stage-9-card-actions-menu.md)
   - [Card Edit Panels](./93-stage-9-card-edit-panels.md)
   - [Resolved And Orphaned Card Experience](./94-stage-9-resolved-orphaned-card-experience.md)

4. Sidebar toolbar, filters, and list state.
   - [Filter Row And Empty States](./92-stage-9-filter-row-empty-states.md)
   - [Sidebar Toolbar](./96-stage-9-sidebar-toolbar.md)
   - [List Order And Grouping](./97-stage-9-list-order-grouping.md)

5. Navigation and focus feedback.
   - [Navigation And Focus Feedback](./91-stage-9-navigation-focus-feedback.md)
   - [Current Focus And Scroll Behavior](./95-stage-9-current-focus-scroll-behavior.md)

6. Creation toolbar and More panel.
   - [Creation Toolbar And More Panel](./99-stage-9-creation-toolbar-more-panel.md)

7. Cross-note shared card rules.
   - [Shared Card And Cross-Note Rules](./98-stage-9-shared-card-cross-note-rules.md)

8. Settings, responsive layout, and theme pass.
   - [Settings And Global Controls](./100-stage-9-settings-global-controls.md)
   - [Responsive Zoom And Theme Adaptation](./101-stage-9-responsive-zoom-theme.md)

9. Final review.
   - [Acceptance Checklist](./104-stage-9-acceptance-checklist.md)
   - [Code Review Checklist](./105-stage-9-code-review-checklist.md)
   - [Automated Test Cases](./106-stage-9-automated-test-cases.md)
   - [Manual Test Cases](./107-stage-9-manual-test-cases.md)

## Surface Map

Use this map when working on a specific UI surface.

Current-document sidebar:

- [Sidebar Card Experience](./86-stage-9-sidebar-card-experience.md)
- [Card Information Hierarchy](./87-stage-9-card-information-hierarchy.md)
- [Card Visual Style](./88-stage-9-card-visual-style.md)
- [Card Density Modes](./89-stage-9-card-density-modes.md)
- [Sidebar Toolbar](./96-stage-9-sidebar-toolbar.md)
- [List Order And Grouping](./97-stage-9-list-order-grouping.md)

Card operations:

- [Card Actions And More Menu](./90-stage-9-card-actions-menu.md)
- [Card Edit Panels](./93-stage-9-card-edit-panels.md)
- [Resolved And Orphaned Card Experience](./94-stage-9-resolved-orphaned-card-experience.md)

Navigation:

- [Navigation And Focus Feedback](./91-stage-9-navigation-focus-feedback.md)
- [Current Focus And Scroll Behavior](./95-stage-9-current-focus-scroll-behavior.md)

Creation:

- [Creation Toolbar And More Panel](./99-stage-9-creation-toolbar-more-panel.md)

Cross-note overview:

- [Shared Card And Cross-Note Rules](./98-stage-9-shared-card-cross-note-rules.md)

Settings and global controls:

- [Settings And Global Controls](./100-stage-9-settings-global-controls.md)

Responsive and theme checks:

- [Responsive Zoom And Theme Adaptation](./101-stage-9-responsive-zoom-theme.md)

Post-implementation corrections:

- [Post-Implementation UI Regression Fixes](./110-stage-9-post-implementation-ui-regression.md)

## Release Gates

Do not treat Stage 9 as complete until these are satisfied:

- [Acceptance Checklist](./104-stage-9-acceptance-checklist.md);
- [Code Review Checklist](./105-stage-9-code-review-checklist.md);
- [Automated Test Cases](./106-stage-9-automated-test-cases.md);
- [Manual Test Cases](./107-stage-9-manual-test-cases.md);
- [Release Boundary](./108-stage-9-release-boundary.md).
- [Post-Implementation UI Regression Fixes](./110-stage-9-post-implementation-ui-regression.md).

## Non-Goals

Do not add these while implementing Stage 9:

- new data model version;
- fixed annotation type UI;
- mobile, tablet, or other non-desktop-specific support;
- AI summary, classification, rewrite, or repair suggestions;
- saved views, review queues, priority, or importance;
- new import or export system;
- connector-line system between source text and cards.

If one of these becomes necessary, stop and reopen planning before implementation.
