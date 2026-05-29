# Stage 9: Manual Test Cases

Status: Confirmed

## Scope

This document lists manual desktop Obsidian test cases for `0.9.0`.

Manual tests should verify real interaction feel, source-mode and reading-mode behavior, visual layout, theme adaptation, and language switching.

## Test Boundary

Manual testing targets desktop Obsidian only.

Rules: do not include mobile or tablet acceptance; use a local desktop vault with representative annotations; test source mode, reading mode, Simplified Chinese, English, light theme, dark theme, normal zoom, and increased zoom.

## Test Data

Prepare at least one test document with:

- several short paragraphs;
- repeated text fragments;
- long selected text;
- one long note;
- multiple tags;
- active annotations;
- resolved annotations;
- one orphaned annotation if possible;
- mark-only, note-only, and mark-and-note annotations.

Use another document with annotations for cross-note overview checks.

## Desktop Layout Matrix

Check the main workflows in narrow sidebar, normal sidebar, wide sidebar, split-pane layout, and small desktop window.

Expected result: no incoherent overlap; controls remain clickable; text wraps, clamps, or truncates predictably; sidebar remains usable.

## Language And Theme Matrix

Check core flows in Simplified Chinese light theme, Simplified Chinese dark theme, English light theme, and English dark theme.

Expected result: labels fit their surfaces; icon buttons have tooltips; marks and focus states remain visible; no old visible annotation type labels appear.

## Creation Toolbar

In source mode:

- select text and create highlight;
- select text and create underline;
- select text and create strikethrough;
- select text and open More;
- create annotation with note only from More;
- create annotation with mark and note from More;
- cancel More and confirm no partial change.

Repeat the same practical checks in reading mode.

Expected result:

- toolbar appears only for usable selections;
- direct mark actions do not require note text;
- More panel fields are optional;
- duplicate selection updates existing annotation where planned;
- invalid selection does not create partial annotation data.

## Sidebar Cards

Check cards for:

- mark-only annotation;
- note-only annotation;
- mark-and-note annotation;
- resolved annotation;
- orphaned annotation;
- long selected text;
- long note;
- multiple tags.

Expected result:

- normal mode is readable;
- compact mode is usable;
- status, tags, marks, notes, and actions do not overlap;
- resolved and orphaned states are visually distinct without leaving document order.

## Card Actions

From the sidebar:

- add note to mark-only annotation;
- edit existing note;
- edit mark if supported;
- edit tags;
- resolve annotation;
- restore resolved annotation;
- rebind orphaned annotation;
- adjust range for a normal annotation when supported;
- delete annotation and cancel confirmation;
- delete annotation and confirm.

Expected result:

- destructive action requires confirmation;
- cancelled edits preserve original data;
- one local edit panel is open at a time;
- errors produce clear feedback.

## Navigation And Focus

Check these flows:

- click card to navigate to source text;
- click source mark to focus sidebar card;
- navigate from a card with long surrounding text;
- navigate after filters are active;
- navigate to resolved annotation;
- navigate to orphaned annotation when source range cannot be found;
- open cross-note card and focus source when possible.

Expected result:

- no separate jump button is needed;
- target scrolls toward visual center where possible;
- temporary focus feedback is visible and fades;
- failure state is understandable.

## Sidebar Toolbar And Filters

Check:

- total count without filters;
- filtered count with filters;
- density switch;
- hide or show source marks;
- status filter;
- mark filter;
- note-state filter;
- keyword filter;
- combined filters;
- clear filters.

Expected result:

- filtering preserves document order;
- hide source marks does not hide sidebar cards;
- empty, filtered-empty, loading, unsupported, and marks-hidden states are distinct.

## Cross-Note Overview

Check:

- cards share sidebar visual language;
- source document context is visible;
- mark-only annotations appear;
- clicking card opens source document;
- source focus succeeds when possible;
- failure state is clear when focus cannot complete.

Expected result:

- cross-note overview supports review across documents;
- it does not become the main complex editing surface.

## Settings

Check settings groups: display, creation, sidebar, data maintenance, and language.

Expected result: groups are easy to scan; data maintenance tools are visually separate; language switching affects plugin UI text; settings do not imply mobile support.

## Release Smoke Test

Before release:

- run typecheck;
- run build;
- copy built files to local desktop Obsidian test plugin folder;
- restart or reload Obsidian;
- verify plugin loads;
- create one annotation;
- edit one annotation;
- navigate card to source;
- open cross-note overview if available.

Expected result: no startup error; no console error during core flows; release notes do not claim mobile or tablet support.
