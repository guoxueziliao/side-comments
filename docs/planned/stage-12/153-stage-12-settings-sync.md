# Stage 12: Settings Sync

Status: Confirmed

## Purpose

This document defines settings updates required by Stage 12 simplification.

Settings must stay aligned with the product surface.

## Confirmed Settings Work

Stage 12 should update settings for:

- selected-document export search;
- card display simplification;
- removal of the user-facing note-only mark type.

## Selected Export

The settings entry `Export selected note annotations` currently opens a modal listing Markdown files.

Because large vaults can contain thousands of notes, the modal should include search.

No new setting is required only for search.

The settings page should not imply that users must manually scroll through every note.

## Default Card Density

The current `Default card density` setting exposes standard and compact card density.

If Stage 12 removes or hides the compact/standard distinction, this setting should be removed, renamed, or replaced.

Do not leave a setting that controls a hidden or confusing mode.

If the implementation keeps one default layout, the setting should be removed from the UI.

## Mark Type Settings And Copy

If note-only mark creation is removed, settings and UI copy should not mention a separate note-only mark type.

Any remaining note-related copy should describe written notes attached to a visible mark.

## Compatibility

Existing saved settings should not break plugin startup.

If `defaultDensity` remains in saved data for compatibility, it can be ignored or normalized during load.

Do not require users to manually edit plugin settings JSON.

## Out Of Scope

Stage 12 should not:

- redesign all settings groups;
- add a new advanced settings section;
- add export search configuration;
- add new hidden feature flags.
