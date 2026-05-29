# Stage 11: Code Review Checklist

Status: Confirmed

## Purpose

This document defines the Stage 11-specific code review boundary.

Reusable release review criteria live in [Release Code Review Checklist](../../release/08-release-code-review-checklist.md).

## Stage 11 Review Focus

Review Stage 11 changes for:

- correct use of reusable release guidance;
- no duplicated release process content inside Stage 11 docs;
- no unsupported public claims introduced for `0.11.0`;
- no broad UI redesign folded into release hardening;
- no new product capability added by accident;
- no Stage 10 workflow regression work pulled into Stage 11;
- no annotation model change unless an explicit blocker requires it.

## Evidence Rule

The review should distinguish:

- checklist items that were actually run;
- checklist items that are not applicable;
- checklist items deferred with reason;
- checklist items blocked by Stage 10 state or official review feedback.

## Blocking Rule

P0 and P1 release blockers should prevent Stage 11 completion unless the user explicitly waives them.
