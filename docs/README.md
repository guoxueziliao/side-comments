# Development Notes

This directory records post-MVP planning and implementation progress for Side Comments.

Docs are grouped by stage. Keep this root file as the entry point, and put new planning files in the relevant stage directory instead of adding more numbered files to the root.

## Directory Layout

- [core](./core/): current status, development principles, and roadmap.
- [stage-1](./stage-1/): MVP stabilization.
- [stage-2](./stage-2/): anchor reliability.
- [stage-3](./stage-3/): `0.3.0` current-document sidebar workflow.
- [stage-4](./stage-4/): cross-note annotation search and review planning.
- [stage-5](./stage-5/): import, export, and data maintenance planning.
- [stage-6](./stage-6/): advanced review and knowledge workflow planning.
- [stage-6.5](./stage-6.5/): mid-cycle UX refresh between `0.6.0` and `0.7.0`.
- [stage-7](./stage-7/): `0.7.0` data maintenance build-out.
- [stage-8](./stage-8/): `0.8.0` simplification and annotation model redesign planning.
- [archive/mvp-spec](./archive/mvp-spec/): original MVP specification split.

Future stages should use the same pattern:

- `docs/stage-4/`
- `docs/stage-5/`
- `docs/stage-N/`

## Main Documents

- [Current Status](./core/00-current-status.md): what is already done and what should stay stable.
- [Development Principles](./core/01-development-principles.md): constraints that guide future feature choices.
- [Roadmap](./core/02-roadmap.md): staged development order.
- [Stage 1: Stabilize MVP](./stage-1/03-stage-1-stabilization.md): current maintenance stage.
- [Stage 2: Anchor Reliability](./stage-2/04-stage-2-anchor-reliability.md): proposed `v0.2` direction.
- [Stage 3: Sidebar Workflow](./stage-3/08-stage-3-sidebar-workflow.md): confirmed `0.3.0` sidebar workflow plan.
- [Stage 4: Search and Review Across Notes](./stage-4/17-stage-4-cross-note-review.md): next-stage cross-note planning.
- [Stage 5: Import, Export, and Maintenance](./stage-5/26-stage-5-data-maintenance.md): later data maintenance planning.
- [Stage 6: Advanced Review and Knowledge Workflow](./stage-6/37-stage-6-advanced-review-workflow.md): `0.6.0` planning entry point.
- [Stage 6: Thought Distillation Bridge](./stage-6/38-stage-6-thought-distillation-bridge.md): review-to-distillation handoff planning for `0.6.0`.
- [Stage 6: Annotation Organization](./stage-6/39-stage-6-annotation-organization.md): annotation organization and classification planning for `0.6.0`.
- [Stage 6: Annotation Types](./stage-6/40-stage-6-annotation-types.md): first classification dimension for `0.6.0`.
- [Stage 6: Annotation Tags](./stage-6/41-stage-6-annotation-tags.md): optional user-defined annotation tags for `0.6.0`.
- [Stage 6: Annotation Filters](./stage-6/42-stage-6-annotation-filters.md): combined filters for annotation organization.
- [Stage 6: Markdown Draft Export](./stage-6/43-stage-6-markdown-draft-export.md): copy or export filtered annotations as Markdown drafts.
- [Stage 6: UI Copy](./stage-6/44-stage-6-ui-copy.md): UI copy and button naming for `0.6.0`.
- [Stage 6: Implementation Order](./stage-6/45-stage-6-implementation-order.md): confirmed development sequence for `0.6.0`.
- [Stage 6: Acceptance Checklist](./stage-6/46-stage-6-acceptance-checklist.md): completion checklist for `0.6.0`.
- [Stage 6: Code Review Checklist](./stage-6/47-stage-6-code-review-checklist.md): implementation review checklist for `0.6.0`.
- [Stage 6: Test Cases](./stage-6/48-stage-6-test-cases.md): concrete test cases for `0.6.0`.
- [Stage 6: Release Boundary](./stage-6/49-stage-6-release-boundary.md): explicit included and excluded scope for `0.6.0`.
- [Stage 6: Manual And Non-Goal Test Cases](./stage-6/50-stage-6-manual-and-non-goal-test-cases.md): manual verification and non-goal tests for `0.6.0`.
- [Stage 6.5: UX Refresh](./stage-6.5/51-stage-6-5-overview.md): mid-cycle UX refresh planning between `0.6.0` and `0.7.0`.
- [Stage 7: Data Maintenance Build-out](./stage-7/59-stage-7-overview.md): `0.7.0` planning entry point.
- [Stage 4: Requirement Triage](./stage-4/18-stage-4-requirement-triage.md): new requirements and issue triage before `0.4.0` scope is finalized.
- [Stage 4: Cross-Note Review Page](./stage-4/19-stage-4-cross-note-review-page.md): read-only first version of the cross-note review page.
- [Stage 4: Implementation Order](./stage-4/20-stage-4-implementation-order.md): confirmed `0.4.0` development sequence.
- [Stage 4: Acceptance Checklist](./stage-4/21-stage-4-acceptance-checklist.md): completion checklist for `0.4.0`.
- [Stage 4: Code Review Checklist](./stage-4/22-stage-4-code-review-checklist.md): review checklist for `0.4.0`.
- [Stage 4: Test Cases](./stage-4/23-stage-4-test-cases.md): concrete test cases for `0.4.0`.
- [Stage 4: UI Copy](./stage-4/24-stage-4-ui-copy.md): confirmed Chinese and English UI copy for `0.4.0`.
- [Stage 4: Release Boundary](./stage-4/25-stage-4-release-boundary.md): explicit included and deferred scope for `0.4.0`.
- [Stage 5: Data Maintenance](./stage-5/26-stage-5-data-maintenance.md): `0.5.0` overview and document index.

## Stage 5 Detail Documents

- [Entry Points](./stage-5/27-stage-5-entry-points.md): settings-page and sidebar entry-point structure for `0.5.0`.
- [Import and Export](./stage-5/28-stage-5-import-export.md): export scopes, export formats, and import behavior for `0.5.0`.
- [Data Health Check](./stage-5/29-stage-5-health-check.md): read-only data health check behavior for `0.5.0`.
- [Repair Tools](./stage-5/30-stage-5-repair-tools.md): manual repair tool behavior for `0.5.0`.
- [Implementation Order](./stage-5/31-stage-5-implementation-order.md): recommended development sequence for `0.5.0`.
- [Acceptance Checklist](./stage-5/32-stage-5-acceptance-checklist.md): completion checklist for `0.5.0`.
- [Code Review Checklist](./stage-5/33-stage-5-code-review-checklist.md): review checklist for `0.5.0`.
- [Test Cases](./stage-5/34-stage-5-test-cases.md): concrete test cases for `0.5.0`.
- [UI Copy](./stage-5/35-stage-5-ui-copy.md): confirmed Chinese and English UI copy for `0.5.0`.
- [Release Boundary](./stage-5/36-stage-5-release-boundary.md): explicit included and deferred scope for `0.5.0`.

## Stage 6 Detail Documents

- [Advanced Review and Knowledge Workflow](./stage-6/37-stage-6-advanced-review-workflow.md): `0.6.0` overview and discussion index.
- [Thought Distillation Bridge](./stage-6/38-stage-6-thought-distillation-bridge.md): explicit handoff planning into `thought-distillation`.
- [Annotation Organization](./stage-6/39-stage-6-annotation-organization.md): first confirmed `0.6.0` priority.
- [Annotation Types](./stage-6/40-stage-6-annotation-types.md): type dimension and initial type set discussion.
- [Annotation Tags](./stage-6/41-stage-6-annotation-tags.md): user-defined tag behavior and boundaries.
- [Annotation Filters](./stage-6/42-stage-6-annotation-filters.md): combined filter behavior for status, type, tag, color, and keyword.
- [Markdown Draft Export](./stage-6/43-stage-6-markdown-draft-export.md): manual Markdown draft output for filtered annotations.
- [UI Copy](./stage-6/44-stage-6-ui-copy.md): Chinese and English labels, buttons, notices, and output labels.
- [Implementation Order](./stage-6/45-stage-6-implementation-order.md): confirmed build order and dependencies.
- [Acceptance Checklist](./stage-6/46-stage-6-acceptance-checklist.md): feature completion checks for `0.6.0`.
- [Code Review Checklist](./stage-6/47-stage-6-code-review-checklist.md): storage, UI, filtering, draft copy, and i18n review checks.
- [Test Cases](./stage-6/48-stage-6-test-cases.md): unit, integration, and manual test cases.
- [Release Boundary](./stage-6/49-stage-6-release-boundary.md): included scope, deferred scope, permanent exclusions, and discussion-only items.
- [Manual And Non-Goal Test Cases](./stage-6/50-stage-6-manual-and-non-goal-test-cases.md): manual verification and explicit non-goal checks.

## Stage 6.5 Detail Documents

- [UX Refresh Overview](./stage-6.5/51-stage-6-5-overview.md): scope, version boundary, issue index, and out-of-scope items for the mid-cycle refresh.
- [Issue 1: Semantics Consolidation](./stage-6.5/52-stage-6-5-issue-1-semantics.md): comment becomes an independent mark type; mark type and color decouple; "resolved" controls compress from three to two.
- [Issue 2: Selection Toolbar And Creation Flow](./stage-6.5/53-stage-6-5-issue-2-selection-toolbar.md): split-button toolbar with chevron color picker; icon-only buttons; annotation type at creation time.
- [Issue 3: Comment Card](./stage-6.5/54-stage-6-5-issue-3-comment-card.md): two-row edit panel wires up Stage 6 fields; color bar plus status indicator plus single overflow menu replaces the five-button header; display modes merge into one.
- [Issue 4: Cross-Note Overview](./stage-6.5/55-stage-6-5-issue-4-cross-note.md): shared card layout; grouping by source by default; chip-style filter row; Copy Markdown draft promoted to primary action.
- [Issue 5: Settings Page And Orphan I18n Keys](./stage-6.5/56-stage-6-5-issue-5-settings.md): four-group settings layout; language switcher; Stage 5 keys retained with comment; no legacy migration tool.
- [Implementation Order](./stage-6.5/57-stage-6-5-implementation-order.md): six-step merge order that keeps the codebase coherent between steps.
- [Release Boundary](./stage-6.5/58-stage-6-5-release-boundary.md): included scope, deferred scope, permanent exclusions, acceptance criteria, and release steps for `0.6.5`.

## Stage 7 Detail Documents

- [UX Refresh Overview](./stage-7/59-stage-7-overview.md): scope, version boundary, issue index, and out-of-scope items for the data maintenance build-out.
- [Issue 1: Data Model And Export Delta](./stage-7/60-stage-7-issue-1-data-model-delta.md): JSON `v2` schema with `annotationType` and `tags`; Markdown export field split; importer default-fill for `v1`.
- [Issue 2: Import Preview, Merge, And Backup](./stage-7/61-stage-7-issue-2-import.md): Obsidian modal preview with per-document grouping and `.backups/<timestamp>-import/` automatic backup.
- [Issue 3: Health Check Report UI](./stage-7/62-stage-7-issue-3-health-check.md): dedicated view tab with overview, category sections, chip-row severity filter, and click-to-source navigation.
- [Issue 4: Repair Tools UI](./stage-7/63-stage-7-issue-4-repair.md): orphaned rebind from sidebar card and health report; duplicate group inline expansion; shared backup folder.
- [Implementation Order](./stage-7/64-stage-7-implementation-order.md): six-step merge order that supersedes the Stage 5 ten-step order for `0.7.0`.
- [Acceptance Checklist](./stage-7/65-stage-7-acceptance-checklist.md): test-vault verification list for `0.7.0`.
- [Code Review Checklist](./stage-7/66-stage-7-code-review-checklist.md): data layer, backup module, modal, view, repair, and i18n review checks.
- [Test Cases](./stage-7/67-stage-7-test-cases.md): unit, integration, manual, and non-goal test cases.
- [Release Boundary](./stage-7/68-stage-7-release-boundary.md): included scope, deferred scope, permanent exclusions, acceptance criteria, and release steps for `0.7.0`.

## Stage 8 Detail Documents

- [Simplification And Annotation Model Redesign](./stage-8/69-stage-8-simplification.md): `0.8.0` planning entry point for separating visual marks from written notes and removing fixed annotation types after `0.7.0`.
- [Compatibility And Export Behavior](./stage-8/70-stage-8-compatibility-and-export.md): JSON, Markdown, draft copy, import, and health-check behavior for legacy `annotationType`.
- [Filtering](./stage-8/71-stage-8-filtering.md): Stage 8 filter dimensions after annotation type removal and mark-only sidebar visibility.
- [Card Actions](./stage-8/72-stage-8-card-actions.md): action menu behavior for mark-only, note-only, mark-and-note, and orphaned cards.
- [Advanced Create Modal](./stage-8/73-stage-8-advanced-create-modal.md): `More` modal fields and creation rules after separating marks from notes.
- [Note-Only Rendering](./stage-8/74-stage-8-note-only-rendering.md): source-mode and reading-mode rendering rules for annotations with notes but no visible mark.
- [UI Copy](./stage-8/75-stage-8-ui-copy.md): confirmed Chinese and English terminology for marks, notes, annotations, actions, modal labels, and filters.

## Stage 3 Detail Documents

- [Order and Status Display](./stage-3/09-stage-3-order-and-status.md): document-order sorting and status behavior.
- [Display Modes](./stage-3/10-stage-3-display-modes.md): normal mode, compact mode, and display preference persistence.
- [Navigation](./stage-3/11-stage-3-navigation.md): card-to-text and text-to-card navigation decisions.
- [Filtering](./stage-3/12-stage-3-filtering.md): combined current-document filters.
- [Acceptance Checklist](./stage-3/13-stage-3-acceptance-checklist.md): `0.3.0` completion checklist.
- [Code Review Checklist](./stage-3/14-stage-3-code-review-checklist.md): `0.3.0` review checklist.
- [Test Cases](./stage-3/15-stage-3-test-cases.md): concrete `0.3.0` test cases.
- [UI Copy](./stage-3/16-stage-3-ui-copy.md): final `0.3.0` labels, tooltips, and empty states.

## Writing Rules

- Keep each document focused on one stage or decision area.
- Put stage-level documents under `docs/stage-N/`.
- Keep root `docs/` limited to `README.md` unless there is a strong reason.
- Mark undecided items as `Status: To discuss`.
- Mark confirmed items as `Status: Confirmed`.
- Add implementation notes only after the direction is agreed.
- Prefer concrete next steps over broad feature lists.
