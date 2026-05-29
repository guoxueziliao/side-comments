# Stage 9: Implementation Order

Status: Confirmed

## Scope

This document defines the recommended implementation order for `0.9.0`.

The goal is to reduce rework while polishing UI, interaction, copy, and layout after Stage 8.

## Preconditions

Stage 9 should begin after the Stage 8 mark/note simplification is stable enough to build on.

Preconditions:

- user-facing fixed annotation type controls are removed or hidden;
- mark-only, note-only, and mark-and-note annotations are represented consistently;
- current-document sidebar and cross-note overview can read the simplified model;
- desktop Obsidian remains the only supported platform target.

If Stage 8 is still changing heavily, pause Stage 9 implementation and finish the model boundary first.

## Step 1: Copy And I18n Foundation

Start with terminology and i18n cleanup.

Work:

- apply `102-stage-9-ui-copy-and-labels.md`;
- remove user-visible `批注类型 / 摘录 / 问题 / 想法 / 任务` entry points;
- align Chinese and English labels for marks, notes, tags, status, and actions;
- add missing tooltips for icon-only controls;
- keep legacy terms only in compatibility code or legacy data handling.

Reason:

Text and naming affect every surface. Fixing this first prevents repeated UI churn.

## Step 2: Card Structure And Visual Hierarchy

Next, stabilize the card component structure.

Work:

- apply `87-stage-9-card-information-hierarchy.md`;
- apply `88-stage-9-card-visual-style.md`;
- apply `89-stage-9-card-density-modes.md`;
- ensure selected text, note, marks, tags, metadata, and actions have stable positions;
- support both normal and compact modes.

Reason:

Most sidebar and cross-note work depends on the card's internal structure.

## Step 3: Card Actions And Local Editing

After the card structure is stable, implement card-level operations.

Work:

- apply `90-stage-9-card-actions-menu.md`;
- apply `93-stage-9-card-edit-panels.md`;
- apply `94-stage-9-resolved-orphaned-card-experience.md`;
- keep direct actions minimal;
- place secondary and dangerous actions in the more menu;
- keep one local edit panel open at a time.

Reason:

Actions and edit panels depend on the final card hierarchy and density behavior.

## Step 4: Sidebar Toolbar, Filters, And Empty States

Then polish the current-document list controls.

Work:

- apply `92-stage-9-filter-row-empty-states.md`;
- apply `96-stage-9-sidebar-toolbar.md`;
- apply `97-stage-9-list-order-grouping.md`;
- keep default order tied to source document order;
- show count as total or filtered count;
- distinguish empty, filtered-empty, loading, unsupported, and marks-hidden states.

Reason:

Filters and toolbar controls should reflect the final card and list behavior.

## Step 5: Navigation, Focus, And Scroll Feedback

Then improve movement between source text and cards.

Work:

- apply `91-stage-9-navigation-focus-feedback.md`;
- apply `95-stage-9-current-focus-scroll-behavior.md`;
- make card click navigate to source text;
- make source mark click focus the corresponding card;
- scroll target text and cards toward the visual center where possible;
- use temporary focus feedback without adding connector lines.

Reason:

Navigation depends on stable cards, list order, and source mark visibility.

## Step 6: Creation Toolbar And More Panel

After review surfaces are stable, polish creation.

Work:

- apply `99-stage-9-creation-toolbar-more-panel.md`;
- keep toolbar actions icon-led and fast;
- support highlight, underline, strikethrough, and More;
- keep More for optional note, mark, color, and tag fields;
- update existing annotations on duplicate selection when appropriate.

Reason:

Creation should use the final terminology and produce cards that match the final sidebar experience.

## Step 7: Cross-Note Shared Card Rules

Then align cross-note overview with the card system.

Work:

- apply `98-stage-9-shared-card-cross-note-rules.md`;
- reuse visual language where useful;
- make source document context more prominent;
- route high-risk edits back to the source document/sidebar flow;
- avoid making cross-note overview the primary editing surface.

Reason:

Cross-note cards should benefit from sidebar card polish without copying every current-document behavior.

## Step 8: Settings, Responsive Layout, And Theme Pass

Finish with global polish and layout robustness.

Work:

- apply `100-stage-9-settings-global-controls.md`;
- apply `101-stage-9-responsive-zoom-theme.md`;
- verify desktop Obsidian light and dark themes;
- verify normal and increased zoom;
- verify narrow, normal, and wide desktop sidebars;
- confirm no incoherent overlap in Chinese or English.

Reason:

Settings and responsive cleanup should happen after the main surfaces are close to final.

## Step 9: Final Review Pass

End with a full Stage 9 review.

Checks:

- no user-visible fixed annotation type controls;
- no separate jump button on cards;
- card click navigates to source;
- source click focuses card;
- mark-only annotations remain visible in the sidebar and cross-note overview;
- mark-only entries remain excluded from Markdown draft copy according to Stage 8;
- desktop-only platform boundary is respected.

Any remaining issue should be sorted into release blocker, follow-up, or out of scope.

## Out Of Scope

- Reopening the Stage 8 data model.
- Adding mobile, tablet, or other non-desktop-specific support.
- Adding saved views, review queues, or priority.
- Adding AI summary, classification, rewrite, or repair suggestions.
- Adding new import/export behavior unless required by existing compatibility.
