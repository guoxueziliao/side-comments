# Stage 12: Confirmed User Inputs

Status: Confirmed

## Purpose

This document records the user-provided Stage 12 / `0.12.0` inputs that must be handled together.

Stage 12 is not only a new planning slot. It now has confirmed work from two separate user input batches.

## Input Batch 1

Confirmed user input:

- remove the confusing `mark-only` related feature surface;
- keep only highlight, strikethrough, and underline as user-facing mark choices;
- optimize compact/standard and expand/collapse because they are easy for users to confuse;
- explain the current JSON, Markdown, and Copy draft actions.

Planning documents:

- [Mark Model Simplification](./150-stage-12-mark-model-simplification.md)
- [Card Display Simplification](./151-stage-12-card-display-simplification.md)

Implementation note:

The code currently distinguishes between:

- `mark-only` as an annotation state where a visible mark has no note;
- `note` as a non-visible mark type.

Stage 12 implementation must confirm this distinction before deleting behavior, so it removes the intended confusing surface without deleting useful visual marks.

## Input Batch 2

Confirmed user input:

- add search to `Export selected note annotations`;
- handle large vaults where there may be thousands or tens of thousands of Markdown files;
- update settings so the selected-export flow and card-display simplification are reflected correctly;
- remove or adjust the `Default card density` setting if the standard/compact distinction is removed or hidden.

Planning documents:

- [Selected Export Search](./152-stage-12-selected-export-search.md)
- [Settings Sync](./153-stage-12-settings-sync.md)

Implementation note:

Selected export search should filter visible files without losing already selected files.

Settings should not expose controls for modes that no longer exist or are intentionally hidden.

## Stage 12 Must Handle Both Batches

Stage 12 implementation is incomplete if it handles only one batch.

The confirmed starting scope is:

1. mark model simplification;
2. card display simplification;
3. selected export search;
4. settings sync.

## Not Yet Implementation

This document confirms scope only.

Do not treat Stage 12 as implemented until a development session updates code, validates behavior, and records evidence.
