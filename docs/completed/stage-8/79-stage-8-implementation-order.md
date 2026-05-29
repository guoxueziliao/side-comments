# Stage 8 Implementation Order

Status: Confirmed

## Goal

Define the development order for `0.8.0`.

Stage 8 changes the product model from fixed annotation types to:

`Annotation = Anchor + Optional Mark + Optional Note`

The order should keep compatibility stable while the UI is simplified.

## Step 1: Data Interpretation Layer

Implement the read-time interpretation layer first.

Required behavior:

- Keep reading legacy `annotationType` without showing it in the UI.
- Interpret existing `mark.type = "note"` with note content as note-only.
- Treat existing `mark.type = "note"` without note content as invalid empty annotation data for health check.
- Interpret highlight, underline, and strikethrough without note content as mark-only.
- Interpret highlight, underline, and strikethrough with note content as mark-and-note.
- Treat legacy purple or comment-like visual styling as a normal stored visual mark and color.
- Do not batch-migrate existing sidecars.

Verification:

- Old sidecars load without data loss.
- New product states can be derived consistently: mark-only, note-only, mark-and-note, and invalid empty.
- No user-facing surface depends on `annotationType`.

## Step 2: Creation Entry Points

Update all annotation creation entry points.

Required behavior:

- Selection toolbar primary buttons are highlight, underline, strikethrough, and more.
- Primary mark buttons create mark-only annotations unless the selected range already has compatible note content.
- The more modal supports mark, color, and optional initial note.
- The more modal blocks no visible mark plus empty note.
- Fixed annotation type controls are removed from creation UI.

Verification:

- Source mode creation works.
- Reading mode creation works.
- Duplicate selection behavior updates the existing annotation instead of creating duplicate cards.
- Keyboard or command-palette creation paths follow the same rules or are removed if they only exist for fixed annotation types.

## Step 3: Source Rendering

Update rendering in the source document.

Required behavior:

- Mark-only annotations render their visual mark.
- Mark-and-note annotations render their visual mark.
- Note-only annotations render a lightweight indicator, not a highlight-style background.
- Hide annotation marks also hides note-only indicators.
- Resolved and orphaned visual states remain distinguishable.

Verification:

- Source mode and reading mode both show the correct visual state.
- Toggling hidden marks does not leave stale decorations.
- Note-only indicators do not visually compete with highlight, underline, or strikethrough marks.

## Step 4: Sidebar Cards And Actions

Update current-document cards and card actions.

Required behavior:

- Mark-only cards show selected text, mark type, color, and management actions.
- Note-only cards show selected text, note content, and no visible mark.
- Mark-and-note cards show selected text, mark type, color, note content, tags, and status.
- Orphaned cards show original context and rebind actions.
- Actions follow the Stage 8 state-transition rules.
- No operation leaves an annotation with neither mark nor note.

Verification:

- Add note turns mark-only into mark-and-note.
- Add mark turns note-only into mark-and-note.
- Remove mark from mark-and-note turns it into note-only.
- Delete note from mark-and-note turns it into mark-only.
- Removing the only mark or only note deletes the whole annotation after confirmation where needed.

## Step 5: Filters And Cross-Note Overview

Update current-document filters and cross-note overview filters.

Required behavior:

- Remove annotation type filters.
- Keep status, visual mark, color, tags, keyword, and note state filters.
- Keyword searches annotation-derived fields only, not full Markdown body.
- Mark-only annotations are visible by default in current-document and cross-note views.
- Markdown draft copy still excludes mark-only annotations.

Verification:

- Note state can distinguish all, has note, and no note.
- Visual mark can distinguish highlight, underline, strikethrough, and no visible mark.
- Removed annotation type filters do not leave orphan UI state or saved defaults.

## Step 6: Import, Export, And Health Check

Update data maintenance behavior after the product simplification.

Required behavior:

- JSON export may preserve legacy `annotationType` for backup and restore.
- JSON import accepts `annotationType` without displaying it.
- Markdown export omits annotation type.
- Markdown draft copy omits annotation type.
- Health check does not flag missing or present `annotationType`.
- Health check reports invalid empty annotations when neither visible mark nor note content exists after interpretation.

Verification:

- Old JSON exports can still be imported.
- Fresh JSON exports can round-trip.
- Human-readable Markdown output no longer mentions fixed annotation types.
- Empty annotation data is reported clearly without deleting it automatically.

## Step 7: UI Copy And Command Cleanup

Remove fixed annotation type vocabulary from user-facing surfaces.

Required behavior:

- Remove or hide `摘录 / Excerpt`.
- Remove or hide `问题 / Question`.
- Remove or hide `想法 / Thought`.
- Remove or hide `任务 / Task`.
- Remove or hide `批注类型 / Annotation type`.
- Keep the confirmed Stage 8 terms: annotation, mark, note, no visible mark, has note, no note.

Verification:

- Simplified Chinese UI no longer exposes fixed annotation type wording.
- English UI no longer exposes fixed annotation type wording.
- Old translation keys may remain only if needed for compatibility code comments or temporary internal mapping.

## Step 8: Release Checks

Finish the release preparation documents and checks.

Required behavior:

- Add or update Stage 8 acceptance checklist.
- Add or update Stage 8 code review checklist.
- Add or update Stage 8 test cases.
- Add or update Stage 8 release boundary.
- Bump versions only when implementation is ready for release.

Verification:

- `npm run typecheck` passes.
- `npm run build` passes.
- Markdown link check passes.
- Local Obsidian test install is synced before release handoff.

## Why This Order

The data interpretation layer must come first because every later surface depends on the same understanding of old and new annotation states.

If UI work comes first, the same old sidecar can be interpreted differently by creation, rendering, filters, export, and health check. That would make `0.8.0` harder to test and easier to regress.
