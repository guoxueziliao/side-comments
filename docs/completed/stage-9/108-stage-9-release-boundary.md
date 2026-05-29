# Stage 9: Release Boundary

Status: Confirmed

## Scope

This document defines the release boundary for `0.9.0`.

The goal is to keep Stage 9 focused on desktop UI, visual clarity, interaction polish, copy consistency, and layout robustness.

## Included

`0.9.0` may include:

- current-document sidebar card hierarchy polish;
- card visual style and density mode polish;
- card action menu and local edit panel polish;
- resolved and orphaned card presentation polish;
- sidebar toolbar and filter row polish;
- empty, loading, unsupported, and marks-hidden state polish;
- card-to-source and source-to-card navigation feedback;
- current focus and scroll-to-visible behavior;
- creation toolbar and More panel interaction polish;
- cross-note card visual consistency;
- settings page grouping and copy cleanup;
- Simplified Chinese and English UI copy consistency;
- desktop zoom, narrow-sidebar, and theme adaptation;
- automated and manual tests needed to protect the above.

This is a desktop Obsidian experience release.

## Required Compatibility

`0.9.0` must preserve:

- Stage 8 mark/note model;
- sidecar storage strategy;
- existing import and export compatibility;
- existing Markdown draft copy rules;
- mark-only visibility in sidebar and cross-note overview;
- note-only display behavior;
- source mode and reading mode support.

UI polish must not become a hidden data migration.

## Deferred

The following are deferred beyond `0.9.0` unless explicitly reopened:

- saved views;
- saved filters;
- review queues;
- priority or importance;
- new cross-note workflow modes;
- full-vault Markdown body search;
- new import or export formats;
- mobile, tablet, or other non-desktop-specific support.

Deferred means not planned for this release, not partially implemented behind unclear UI.

## Explicitly Excluded

The following should not be added:

- new data model version only for UI polish;
- reintroduced fixed annotation type UI;
- user-facing `摘录 / 问题 / 想法 / 任务` classification;
- AI summary, classification, rewrite, or repair suggestions;
- cloud sync or remote storage;
- mobile-specific gestures or layout systems;
- connector-line system between source text and cards;
- pixel-perfect custom theme system.

These exclusions keep the release narrow and testable.

## Release Preconditions

Before release:

- typecheck passes;
- build passes;
- relevant automated tests pass;
- manual desktop Obsidian checks pass;
- source mode and reading mode are verified;
- Simplified Chinese and English are verified;
- light and dark themes are verified;
- narrow, normal, and wide desktop sidebar states are verified;
- local desktop Obsidian test install is updated and loads successfully.

Use `104-stage-9-acceptance-checklist.md`, `105-stage-9-code-review-checklist.md`, `106-stage-9-automated-test-cases.md`, and `107-stage-9-manual-test-cases.md` as release gates.

## Release Notes

Release notes should describe `0.9.0` as a desktop UI and interaction polish release.

Mention:

- clearer card layout;
- improved sidebar controls;
- better creation toolbar and More panel behavior;
- more consistent Chinese and English copy;
- better desktop zoom, sidebar width, and theme handling.

Do not claim:

- mobile support;
- new AI features;
- new data model;
- new import/export system;
- new review queue or saved-view system.

## Follow-Up Handling

Issues found late in release review should be classified as:

- blocker for `0.9.0`;
- follow-up before `0.9.0`;
- follow-up after `0.9.0`;
- out of scope.

Do not expand the release boundary late unless the issue blocks an included workflow.
