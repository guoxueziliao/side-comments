# Stage 11: Version Positioning

Status: Confirmed

## Purpose

This document records the first open decision for Stage 11 / `0.11.0`.

It should define what kind of version `0.11.0` is before detailed requirements are added.

## Known Baseline

- Stage 10 / `0.10.0` is implemented and moved to the completed baseline.
- Stage 11 / `0.11.0` planning can proceed from the completed Stage 10 behavior.

## Confirmed Positioning

Stage 11 / `0.11.0` is a release and review hardening version.

Its primary goal is to make the plugin easier to publish, review, present, and maintain as a public Obsidian community plugin.

It should focus on:

- official plugin review readiness;
- official Obsidian submission and validation readiness;
- README and release documentation quality;
- versioning and release process discipline;
- settings and external-facing polish where it affects review or first use;
- packaging and repository hygiene;
- validation checklists before public release.

Stage 11 should not become a broad new product-capability version.

## Rejected Positioning Options

Option A: continued stabilization.

- Use `0.11.0` for the second stabilization pass after real Stage 10 use.
- Best if daily use keeps exposing workflow bugs, confusing states, or regressions.

Option B: next product capability.

- Use `0.11.0` for a new capability after the current-document workflow is reliable.
- Best if Stage 10 lands cleanly and the plugin needs a new meaningful work surface.

Option C: release and review hardening.

- Use `0.11.0` for packaging, official plugin review readiness, docs quality, settings polish, and release discipline.
- Best if the product is usable but the release process and external presentation still feel rough.

This option is confirmed as the Stage 11 direction.

## Decision Outcome

- `0.11.0` should not add a major new user-facing capability by default.
- `0.11.0` should not mostly continue Stage 10 workflow regression unless release-blocking usage issues appear.
- Official release readiness is the main goal.
- Release, review, documentation, packaging, settings polish, and validation workflow belong in scope.
- Official Obsidian requirements belong in scope as a separate review area.
- Broad product expansion stays out of scope.

## Planning Outcome

The confirmed Stage 11 release hardening scope has been split into implementation-facing documents:

- Stage 11 release boundary;
- Stage 11 implementation order;
- Stage 11 acceptance checklist;
- Stage 11 code review checklist;
- Stage 11 implementation readiness;
- Stage 11 development index;
- reusable release guidance under [release](../../release/).
