# Roadmap

Status: To discuss

This roadmap is ordered by development sequence. Each confirmed stage should get its own document before implementation begins.

## Stage 1: Stabilize MVP

Status: Confirmed

Goal: make the current plugin reliable enough for daily local use and official review.

Planned work:

- Track official plugin review feedback.
- Fix validation or packaging issues immediately.
- Keep local test installation aligned with built files.
- Confirm source mode and reading mode selection behavior across common note formats.

Deliverable document:

- `../stage-1/03-stage-1-stabilization.md`

## Stage 2: Improve Anchor Reliability

Status: Confirmed

Goal: reduce lost annotations after document edits, especially when selected text appears multiple times or reading mode selection maps imperfectly back to Markdown source.

Candidate work:

- Add better anchor metadata while keeping old sidecar data compatible.
- Improve relocation scoring for repeated selected text.
- Improve source mode and reading mode selection mapping.
- Add manual rebind for orphaned comments.
- Add manual range adjustment for active or resolved comments.
- Show a clear unresolved state when relocation confidence is low.
- Add tests for relocation and path hashing.

Deliverable document:

- `../stage-2/04-stage-2-anchor-reliability.md`

## Stage 3: Improve Sidebar Workflow

Status: Confirmed

Goal: make comment review and editing smoother for real note-taking.

Confirmed work:

- Keep one main document-order list.
- Show status without changing comment order.
- Add normal and compact sidebar display modes.
- Improve resolved and orphaned card display.
- Add card-to-text and text-to-card navigation.
- Add combined current-document filters.

Deliverable document:

- `../stage-3/08-stage-3-sidebar-workflow.md`

## Stage 4: Search and Review Across Notes

Status: Confirmed

Goal: support reviewing annotations beyond the current document without harming large-vault performance.

Confirmed work:

- Read-only cross-note annotation review page.
- Recent-preview-based lazy loading.
- Search sidecar-derived annotation fields only.
- Filter by keyword, status, color, type, and source document.
- Open source document and jump to the matching sidebar card.
- Avoid startup indexing and full-vault scanning.
- Add Simplified Chinese and English UI support.
- Add one-click annotation mark hiding.
- Fix repeated-text duplicate rendering before cross-note review work.

Deliverable document:

- `../stage-4/17-stage-4-cross-note-review.md`
- `../stage-4/18-stage-4-requirement-triage.md`
- `../stage-4/19-stage-4-cross-note-review-page.md`
- `../stage-4/20-stage-4-implementation-order.md`
- `../stage-4/21-stage-4-acceptance-checklist.md`
- `../stage-4/22-stage-4-code-review-checklist.md`
- `../stage-4/23-stage-4-test-cases.md`
- `../stage-4/24-stage-4-ui-copy.md`
- `../stage-4/25-stage-4-release-boundary.md`

## Stage 5: Import, Export, and Maintenance

Status: Confirmed

Goal: make annotation data easier to back up, inspect, move, and repair.

Confirmed work:

- Export current note, selected note, and all sidecar metadata.
- Import plugin JSON exports with preview, backup, and merge behavior.
- Provide read-only data health checks.
- Provide manual repair tools for orphaned annotations and duplicate annotations.
- Keep destructive cleanup and automatic bulk repair out of scope.

Deliverable document:

- `../stage-5/26-stage-5-data-maintenance.md`

## Stage 6: Advanced Review and Knowledge Workflow

Status: Confirmed

Goal: turn existing annotation data into a more deliberate review and knowledge organization workflow.

Confirmed first priority:

- Annotation organization and classification.
- Annotation type is the first confirmed classification dimension.
- User-defined annotation tags are the second confirmed organization dimension.
- Combined filters should support status, type, tag, color, and keyword.
- Filtered annotations can be copied to the clipboard as Markdown drafts.
- UI copy and button naming should be confirmed before implementation.
- Implementation should proceed from metadata compatibility to UI controls, filters, and Markdown draft copying.
- Acceptance should verify metadata compatibility, type and tag behavior, combined filters, and Markdown draft copying.
- Code review should focus on optional-field compatibility, filter semantics, tag normalization, clipboard behavior, and explicit non-goals.
- Tests should cover metadata defaults, type and tag editing, combined filters, Markdown draft output, manual verification, and explicit non-goals.
- Release boundary should keep `0.6.0` focused on annotation organization and Markdown draft copying.
- Saved views and saved filters are out of scope for `0.6.0`.
- Timeline or date-based filters are out of scope for `0.6.0`.
- Source-document writing workflow integration is out of scope for `0.6.0`.
- Review priority or importance is permanently excluded.
- Color remains a visual marker and should not become semantic classification.
- Annotation collections and review queues are permanently excluded.
- Automatic summary generation is permanently excluded.

Confirmed work:

- Annotation type and user-defined annotation tags.
- Combined filters for current-note and cross-note review.
- Copying filtered annotations to the clipboard as Markdown drafts.

Discussion-only:

- A review-to-distillation bridge may be revisited later, but it is not part of the confirmed `0.6.0` scope.

Deliverable document:

- `../stage-6/37-stage-6-advanced-review-workflow.md`

## Stage 6.5: UX Refresh

Status: Confirmed

Goal: clean up overlapping concepts and wire up the Stage 6 surfaces that the data layer plumbed but did not surface, in a single mid-cycle `0.6.5` release between `0.6.0` and `0.7.0`.

Confirmed work:

- Semantics consolidation: `note` becomes an independent mark type; mark type and color decouple; "resolved" controls compress from three to two.
- Selection toolbar redesign with split-button-plus-chevron and icon-only buttons.
- Comment card redesign with a two-row edit panel, color bar plus status indicator, and a single overflow menu.
- Cross-note overview using a shared card, source-based grouping, chip-style filter row, and primary `Copy Markdown draft` button.
- Settings page split into four labeled groups including a language switcher.

Deliverable document:

- `../stage-6.5/51-stage-6-5-overview.md`

## Stage 7: Data Maintenance Build-out

Status: Confirmed

Goal: finish the data maintenance surfaces that Stage 5 designed but did not implement, aligned with the data model and visual layer introduced by Stage 6 and Stage 6.5, in a single `0.7.0` release.

Confirmed work:

- JSON export schema bumps to `v2` to include `annotationType` and `tags`; Markdown export splits "type" into four labeled fields (mark, annotation type, color, tags); importer applies silent defaults for `v1` packages.
- Import preview modal with per-document grouping, count summary, and `.backups/<timestamp>-import/` automatic backup.
- Read-only health check report in a dedicated view tab with chip-row severity filtering and click-to-source navigation.
- Manual orphaned annotation rebind from both the sidebar card and the health report; duplicate annotation handling expanded inline inside the report.
- Stage 5 orphan i18n keys promoted to bound keys.

Deliverable document:

- `../stage-7/59-stage-7-overview.md`

## Stage 8: Simplification And Annotation Model Redesign

Status: To discuss

Goal: simplify the product after `0.7.0` by separating visual marks from written notes and removing the fixed annotation type layer from the user-facing UI.

- Remove the fixed `摘录 / 问题 / 想法 / 任务` annotation type controls from user-facing surfaces.
- Redesign the model as `Anchor + Optional Mark + Optional Note`.
- Keep mark type, color, tags, and status; continue reading old `annotationType` fields without batch migration or interrupting `0.7.0`.

Deliverable document:

- `../stage-8/69-stage-8-simplification.md`
