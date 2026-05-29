# Stage 11: Release Hardening Scope

Status: Confirmed

## Purpose

This document defines the detailed scope boundary for Stage 11 / `0.11.0`.

Stage 11 is a release and review hardening version. It should improve the plugin's public release readiness without becoming a new feature release.

## Included Scope

Stage 11 includes six scope areas.

## 1. Official Obsidian Readiness

This includes:

- official community plugin submission flow;
- `manifest.json` validation;
- `versions.json` review;
- GitHub Release tag and asset requirements;
- official review checklist;
- official self-critique checklist;
- handling official review blockers.

Detailed official-facing rules are recorded in [Official Obsidian Readiness](../../release/01-official-obsidian-readiness.md).

## 2. Repository Presentation

This includes:

- root `README.md`;
- screenshots or visual examples, if needed;
- feature summary;
- installation instructions;
- usage boundaries;
- common questions;
- repository description and public-facing metadata.

The repository should explain what the plugin does, who it is for, and what it intentionally does not do.

## 3. Release Process

This includes:

- version number discipline;
- release tag naming;
- release notes structure;
- build artifact generation;
- local test install sync;
- GitHub Release asset checks;
- pre-release command checklist.

The release process should be repeatable enough that future versions do not depend on memory.

## 4. Plugin Description And External Copy

This includes:

- `manifest.json` description;
- GitHub repository short description;
- README opening summary;
- official directory-facing description;
- consistent Chinese and English wording where applicable.

External copy should avoid redundant words, especially where the platform context already implies the plugin is for Obsidian.

## 5. Settings And First-Use Polish

This includes only polish that affects new-user understanding, review clarity, or first-use confidence:

- settings labels;
- settings descriptions;
- default values;
- empty states;
- basic notices;
- first-use confusion points.

This does not include broad UI redesign.

## 6. Validation And Review Checklists

This includes:

- typecheck;
- build;
- manual desktop Obsidian verification;
- local install verification;
- release asset verification;
- official checklist review;
- repository presentation review;
- issue triage before release.

Stage 11 should produce practical checklists that the development session can run before publishing.

## Explicit Non-Goals

Stage 11 does not include:

- new product capabilities;
- Stage 10 workflow regression implementation;
- broad UI redesign;
- mobile, tablet, or non-desktop support;
- AI summary, AI classification, or AI rewrite;
- cloud sync;
- account systems;
- telemetry;
- product model changes based only on speculative review concerns.

If official review feedback explicitly requires a product model change, record it as a separate blocker before changing scope.

## Reusable Guidance

The detailed release and review guidance for these scope areas lives under [release](../../release/).

Stage 11 should adopt those reusable documents instead of duplicating their full content inside this stage folder.

Stage 11-specific planning should stay limited to:

- why `0.11.0` is using the release-hardening path;
- what is included or excluded for this version;
- implementation order;
- acceptance criteria;
- code review focus;
- implementation handoff.
