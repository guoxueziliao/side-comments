# In Progress

Status: Confirmed

This document lists work that is currently active: being reviewed, tested, packaged, or implemented.

Use this document as the short working queue. Keep larger design decisions in the stage documents.

## Current Active Release

Target: `0.12.0`.

Stage: Stage 12, confirmed planning.

Current state:

- Stage 11 / `0.11.0` is implemented and moved to completed baseline.
- Stage 12 planning has started under `docs/planned/stage-12/`.

## Stage 11 Completion Summary

Stage 11 / `0.11.0` is implemented.

Key implementation outcomes:

- LICENSE copyright updated from TBD to FAN.
- manifest.json and package.json description updated to "Side comments and visual marks for Markdown notes, stored outside the note body."
- README.md rewritten with proper structure: features, installation, usage, data storage, limitations, development status, privacy, license.
- Settings tab section headings converted from raw `createEl("h3/h4")` to `Setting.setHeading()` per official Obsidian API conventions.
- Data directory setting description updated (removed stale "Read-only in the MVP" wording).
- versions.json updated with 0.11.0 entry.
- Version bumped to 0.11.0.
- Official Obsidian self-critique checklist reviewed: no console.log in production, no default hotkeys, no hardcoded .obsidian paths, no var usage, no fetch/axios, main.js in .gitignore.
- All four validation checklist groups verified: official review, technical pre-release, manual usage, repository presentation.

## Stage 10 Completion Summary

Stage 10 / `0.10.0` is implemented.

Key implementation outcomes:

- `upsertComment` in sidecarStore now updates existing annotations when creating on the same range (instead of returning the existing record unchanged).
- AdvancedCreationModal pre-fills existing annotation data when creating on a range that already has an annotation.
- Filter-hidden notice (`notice.commentHiddenByFilter`) shown after create, update, status toggle, and rebind when active filters hide the affected card.
- `isCommentIdVisible` method on sidebar view enables external visibility checks.
- Annotation workflow regression verified: create, update, jump, resolve, rebind, delete all match Stage 10 flow documents.

## Stage 9 Completion Summary

Stage 9 / `0.9.0` is implemented.

Key implementation outcomes beyond the original plan:

- Removed fixed annotation types (`annotationType`) from all data flow: create, update, draft, export, cross-note view, and commands.
- Removed typed create commands (`addAsQuestion`, `addAsThought`, `addAsTask`).
- Simplified selection toolbar: removed color picker chevron, removed "note" mark button, removed wrapper div. Toolbar now shows highlight/underline/strikethrough and a More overflow button.
- Replaced `AnnotationTypeFilter` with `NoteStateFilter` ("all" | "has-note" | "no-note") in both current-document sidebar and cross-note overview.
- Added `annotationState.ts` module with `getAnnotationState`, `hasNoteContent`, `isVisualMark`, `isNoteOnlyMark`, `matchesNoteStateFilter`.
- Editor extension filters out note-only marks from inline rendering.
- Health check now detects empty annotations (no mark and no note content).
- Settings reorganized into 4 groups: Display, Creation, Maintenance (with Sidebar as h4), Language.
- Menu positioning uses `showMenuAtElement` / `showMenuAtEventTarget` for stable anchoring.
- Markdown draft output filters out mark-only annotations and removes the type line.
- Card hierarchy, density modes, filter chips, navigation feedback, and flash animation all implemented as planned.

## Active Planning

Target: `0.12.0`.

Status: confirmed planning.

Planning starts from `../planned/stage-12/147-stage-12-planning-index.md`.

## Current Planning

Target: `0.12.0`.

Status: confirmed planning.

Planning starts from `../planned/stage-12/147-stage-12-planning-index.md`.

## Working Rules

- Keep this file short.
- Move a release from here to [Implemented Work](./03-implemented.md) after review, test, and release packaging are complete.
- Move future work into this file only when it becomes the active development or planning focus.
- Keep long discussion, acceptance, test, and review details inside the matching stage folder.
