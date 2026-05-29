# Stage 8 Release Boundary

Status: Confirmed

## Version Number

`0.8.0`.

This version is the Simplification And Annotation Model Redesign release.

Stage 8 lands after `0.7.0` is completed. It should not interrupt the `0.7.0` data maintenance review, test, or release packaging.

Version files should move to `0.8.0` only when implementation is ready for release.

## Naming

- `CHANGELOG.md` should add a section titled `0.8.0 - Simplification And Annotation Model Redesign`.
- Release notes should describe the move from fixed annotation types to mark/note composition.
- User-facing copy should avoid fixed type wording: `摘录`, `问题`, `想法`, `任务`, and `批注类型`.
- English user-facing copy should avoid fixed type wording: `Excerpt`, `Question`, `Thought`, `Task`, and `Annotation type`.

## Included Scope

- Remove fixed annotation type controls from user-facing UI.
- Redesign the product model around `Annotation = Anchor + Optional Mark + Optional Note`.
- Support mark-only annotations.
- Support note-only annotations.
- Support mark-and-note annotations.
- Keep highlight, underline, and strikethrough as visual marks.
- Keep color as visual presentation.
- Keep tags as flexible user organization.
- Keep status as active, resolved, or orphaned.
- Update the selection toolbar to highlight, underline, strikethrough, and more.
- Update the more modal to support mark, color, and optional initial note.
- Show mark-only annotations by default in the current-document sidebar.
- Show mark-only annotations by default in the cross-note overview.
- Exclude mark-only annotations from Markdown draft copy.
- Keep JSON compatibility for legacy `annotationType`.
- Interpret old sidecar data at read time without batch migration.
- Remove annotation type filters from current-document and cross-note filters.
- Add or keep filters for status, visual mark, color, tags, keyword, and note state.
- Update health check to report invalid empty annotation data after Stage 8 interpretation.

## Required Completion

`0.8.0` must complete these implementation areas:

- Data interpretation layer.
- Creation entry points.
- Source and reading-mode rendering.
- Sidebar cards and card actions.
- Current-document and cross-note filters.
- Import, export, draft copy, and health-check compatibility.
- Simplified Chinese and English UI copy cleanup.
- Automated tests.
- Manual tests.
- Acceptance checklist.
- Code review checklist.

## Deferred Scope

These items are out of scope for `0.8.0` and may be reconsidered only in a later stage:

- A schema-breaking sidecar cleanup that makes `mark` truly optional in storage.
- Batch migration that deletes old `annotationType` fields.
- Batch rewrite of existing sidecars just to normalize Stage 8 data.
- Multiple independent notes on the same anchor.
- Saved views or saved filters.
- Full-vault Markdown body search.
- Mobile-specific interaction design.
- Cloud sync or remote storage.

## Permanent Exclusions

These items should not be added in `0.8.0` or later unless the product direction is explicitly reopened:

- Review queues.
- Priority or importance as a first-class field.
- Automatic AI summary.
- Automatic AI classification.
- Automatic AI rewrite.
- Automatic AI repair suggestions.
- Color as semantic classification.

## Acceptance

`0.8.0` is considered complete when:

- All steps in `79-stage-8-implementation-order.md` are complete.
- `80-stage-8-acceptance-checklist.md` is fully verified in a test vault.
- `81-stage-8-code-review-checklist.md` has no blocking issues.
- `82-stage-8-automated-test-cases.md` are implemented where practical and passing.
- `83-stage-8-manual-test-cases.md` are walked manually in a test vault.
- Existing sidecars from `0.7.0` and earlier still load without data loss.
- Fixed annotation type controls no longer appear in user-facing UI.

## Release Steps

- Update `manifest.json`, `package.json`, and `versions.json` to `0.8.0`.
- Add `CHANGELOG.md` section `0.8.0 - Simplification And Annotation Model Redesign`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Run Markdown relative link check.
- Confirm the release folder contains `main.js`, `manifest.json`, and `styles.css`.
- Sync the built files to the local Obsidian test install before release handoff.
- Publish through GitHub Releases when the release package is verified.

## Open Decisions

None. All decisions for the `0.8.0` release boundary are confirmed.
