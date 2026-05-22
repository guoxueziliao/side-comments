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

- `03-stage-1-stabilization.md`

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

- `04-stage-2-anchor-reliability.md`

## Stage 3: Improve Sidebar Workflow

Status: To discuss

Goal: make comment review and editing smoother for real note-taking.

Candidate work:

- Better grouping or sorting.
- More compact sidebar layout.
- Better resolved comment visibility.
- Keyboard-friendly navigation.
- Faster jump behavior between cards and text.

Deliverable document:

- `08-stage-3-sidebar-workflow.md`

## Stage 4: Search and Review Across Notes

Status: To discuss

Goal: support reviewing annotations beyond the current document without harming large-vault performance.

Candidate work:

- Recent annotations view.
- Optional limited-scope search.
- Index only sidecar metadata, not Markdown content.
- Avoid default full-vault scanning.

Deliverable document:

- `13-stage-4-cross-note-review.md`

## Stage 5: Import, Export, and Maintenance

Status: To discuss

Goal: make annotation data easier to back up, inspect, and move.

Candidate work:

- Export current note annotations.
- Export all sidecar metadata.
- Basic data health check.
- Manual repair tools for unresolved anchors.

Deliverable document:

- `14-stage-5-data-maintenance.md`
