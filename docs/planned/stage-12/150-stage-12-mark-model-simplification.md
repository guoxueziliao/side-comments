# Stage 12: Mark Model Simplification

Status: Confirmed

## Purpose

This document defines the Stage 12 mark simplification.

The user-facing mark model should keep only visible marks.

## Current Code Distinction

Current code uses two related concepts that should not be confused:

- `mark-only`: an annotation state where a visible mark has no note.
- `note` mark type: a non-visible mark used for note-only annotations.

Stage 12 removes the user-facing `note` mark type.

Stage 12 does not remove highlight-only, underline-only, or strikethrough-only annotations.

## Confirmed Behavior

The only user-facing mark types should be:

- highlight;
- underline;
- strikethrough.

Users should still be able to add a written note to any of these three marks.

Users should still be able to create a visual mark without a note.

Users should not see or choose a separate note-only mark type.

## Existing Data Compatibility

Existing annotations whose stored mark type is `note` should remain readable.

Stage 12 implementation should choose a compatibility behavior before editing code:

- display old note-only annotations as annotations with no visible mark;
- or normalize them to a default visible mark only when the user edits them.

Do not silently delete existing note content.

## UI Surfaces To Review

Review and update:

- selection toolbar;
- advanced creation modal;
- card mark edit panel;
- sidebar card actions;
- reading view rendering;
- source editor rendering;
- filters;
- health check wording;
- export and draft output labels.

## Out Of Scope

Do not remove the ability to create a note.

Do not remove visible mark-only annotations unless a separate decision explicitly changes sidebar visibility.

Do not add a fourth replacement mark type.
