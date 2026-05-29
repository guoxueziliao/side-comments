# Stage 10: Version Positioning

Status: Confirmed

## Version

Stage 10 targets `0.10.0`.

## Positioning

Stage 10 is a stability, regression, and release-quality consolidation version after Stage 9.

It should make the plugin more reliable in real desktop use instead of expanding the product with another major capability.

## Confirmed Focus

- Stabilize high-frequency annotation workflows after Stage 9 UI/UX changes.
- Regress source mode and reading mode behavior.
- Regress selection creation, duplicate selection handling, navigation, orphaned annotations, and range adjustment.
- Review consistency between sidebar cards, source marks, reading marks, cross-note overview, and settings.
- Strengthen release readiness through checklists, tests, and manual verification.

## Non-Goals

Do not use Stage 10 for:

- a new annotation data model;
- new AI features;
- mobile, tablet, or non-desktop-specific support;
- a new knowledge-management module;
- broad UI redesign that belongs to Stage 9;
- import/export redesign unless a concrete regression or release-quality issue requires it.

## Relationship To Stage 9

Stage 9 is the completed UI and interaction implementation baseline.

Stage 10 should test and stabilize the resulting Stage 9 product surface.

If a Stage 9 item is unfinished, decide whether it remains a Stage 9 task or is explicitly moved into Stage 10.

## Product Principle

For this version, reliability beats novelty.

If a proposed feature increases implementation risk without directly improving stability, regression confidence, or release quality, defer it.
