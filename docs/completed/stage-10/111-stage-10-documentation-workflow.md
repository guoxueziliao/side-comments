# Stage 10: Documentation Workflow

Status: Confirmed

## Purpose

This document defines how new `0.10.0` planning should be recorded before implementation starts.

Stage 10 is the first planned stage after Stage 9 became the completed baseline. Its documents should stay easy to navigate as new decisions accumulate.

## Folder Rule

All Stage 10 planning belongs under `docs/planned/stage-10/` until Stage 10 becomes active development.

When Stage 10 becomes active, the development session moves the whole `stage-10` folder under `docs/active/` and updates only the indexes and links needed for that move.

The planning session should stop at implementation readiness. It should not declare active development or move Stage 10 into `docs/active/`.

When Stage 10 becomes an accepted baseline, move it under `docs/completed/` and treat old discussion details as historical.

## Split Rule

Do not put all Stage 10 decisions into one large file.

Use small documents by responsibility:

- planning index and version positioning;
- requirement decisions;
- data model or compatibility changes, if any;
- UI and interaction decisions, if any;
- implementation order;
- acceptance checklist;
- code review checklist;
- automated test cases;
- manual test cases;
- release boundary.

Keep each document under roughly 200 lines.

## Decision Logging Rule

Discuss one decision at a time.

After a decision is confirmed:

- write it into the matching Stage 10 document immediately;
- mark the item as confirmed;
- add the next unresolved decision to the planning flow;
- avoid reopening completed decisions unless new information makes the old decision unsafe or incoherent.

## Source Work Boundary

Stage 10 planning must not modify Stage 9 source implementation by default.

Source code work is allowed only when the user explicitly asks for implementation, bug fixing, review, or release preparation.

## Current Effective References

Use these before creating Stage 10 details:

- Stage 8 completed baseline for the annotation model;
- Stage 9 active docs for current UI/UX direction;
- this Stage 10 folder for future decisions.

Older completed stages can be useful background, but many details are historical or superseded.
