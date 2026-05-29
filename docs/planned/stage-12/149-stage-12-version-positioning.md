# Stage 12: Version Positioning

Status: Confirmed

## Purpose

This document defines the version positioning for Stage 12 / `0.12.0`.

## Confirmed Positioning

Stage 12 is a simplification and scalability cleanup version.

It should remove confusing or low-value UI concepts and improve workflows that break down in large vaults.

## Confirmed Starting Scope

Stage 12 starts with:

- removing the note-only mark concept from user-facing flows;
- keeping only three visible mark types: highlight, underline, and strikethrough;
- simplifying card density and expand/collapse behavior;
- adding search to selected-document export;
- updating settings to match the simplified UI.

## Product Direction

Stage 12 should make the plugin easier to understand in daily use.

It should prefer fewer visible modes over more controls.

It should also respect large-vault reality: workflows that ask the user to choose from many Markdown files need search or filtering.

## Non-Goals

Stage 12 should not:

- add new annotation types;
- add a new storage schema unless compatibility requires it;
- add mobile support;
- add PDF or EPUB annotation;
- add AI summary or classification;
- redesign the whole settings page;
- duplicate Stage 11 release and review hardening.

## Implementation Boundary

Stage 12 may include compatibility handling for existing data created before the simplification.

Compatibility work should be conservative and should not delete user note content.
