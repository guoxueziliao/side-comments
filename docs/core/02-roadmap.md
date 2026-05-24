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
