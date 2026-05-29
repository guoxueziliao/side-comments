# Stage 12: Documentation Workflow

Status: Confirmed

## Purpose

This document defines how Stage 12 / `0.12.0` planning should be recorded once discussion begins.

## Folder Rule

All Stage 12 planning belongs under `docs/planned/stage-12/` until Stage 12 becomes active development.

The planning session should stop at implementation readiness.

When Stage 12 becomes active, the development session moves the whole `stage-12` folder under `docs/active/` and updates only the indexes and links needed for that move.

When Stage 12 becomes an accepted baseline, move it under `docs/completed/` and treat old discussion details as historical.

## Split Rule

Do not put all Stage 12 decisions into one large file.

Use small documents by responsibility:

- planning index and version positioning;
- requirement decisions;
- workflow or UI decisions, if any;
- data model or compatibility decisions, if any;
- implementation order;
- acceptance checklist;
- code review checklist;
- release boundary.

Keep each document under roughly 200 lines.

## Decision Logging Rule

Discuss one decision at a time when requirements are open.

After a decision is confirmed:

- write it into the matching Stage 12 document immediately;
- mark the item as confirmed;
- add the next unresolved decision to the planning flow;
- avoid reopening completed decisions unless new information makes the old decision unsafe or incoherent.

## Reusable Release Rule

If Stage 12 includes release or review work, reference [release](../../release/) instead of duplicating generic release process guidance.
