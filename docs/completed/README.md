# Completed Stages

Status: Confirmed

This directory contains completed stages, historical planning, and implementation baselines.

Completed documents are not all current product contracts. Older stages can be partially superseded, renamed, or made obsolete by later stages. When documents disagree, use the newest completed baseline first, then active development docs, then planned docs.

Publication status can lag behind this directory. A stage belongs here when its planning is closed or it is treated as part of the repository history.

## Stage Entry Points

- [Stage 1: Stabilize MVP](./stage-1/03-stage-1-stabilization.md).
- [Stage 2: Improve Anchor Reliability](./stage-2/04-stage-2-anchor-reliability.md).
- [Stage 3: Improve Sidebar Workflow](./stage-3/08-stage-3-sidebar-workflow.md).
- [Stage 4: Search and Review Across Notes](./stage-4/17-stage-4-cross-note-review.md).
- [Stage 5: Import, Export, and Maintenance](./stage-5/26-stage-5-data-maintenance.md).
- [Stage 6: Advanced Review and Knowledge Workflow](./stage-6/37-stage-6-advanced-review-workflow.md).
- [Stage 6.5: UX Refresh](./stage-6.5/51-stage-6-5-overview.md).
- [Stage 7: Data Maintenance Build-out](./stage-7/59-stage-7-overview.md).
- [Stage 8: Simplification And Annotation Model Redesign](./stage-8/69-stage-8-simplification.md).
- [Stage 9: Interface And Interaction Experience](./stage-9/109-stage-9-development-index.md).
- [Stage 10: Stability And Workflow Regression](./stage-10/130-stage-10-development-index.md).
- [Stage 11: Release And Review Hardening](./stage-11/146-stage-11-development-index.md).

## Current Baseline

The current package baseline is Stage 11 / `0.11.0`.

Stage 11 is a release and review hardening release. It updated LICENSE copyright, manifest and README to official Obsidian conventions, converted settings headings to Setting.setHeading() API, and verified all four validation checklist groups.

The underlying annotation model remains:

`Annotation = Anchor + Optional Mark + Optional Note`

For future planning, prefer [Stage 12 planned docs](../planned/stage-12/147-stage-12-planning-index.md).

## Rules

- Do not add active work here until it becomes the accepted baseline.
- Do not over-normalize old completed documents; many details are intentionally historical or superseded.
- Only update completed documents for broken links, status drift, factual errors, or explicit user requests.
- Put new planning under [planned](../planned/) until it becomes active.
