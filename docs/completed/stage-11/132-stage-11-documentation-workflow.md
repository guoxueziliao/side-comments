# Stage 11: Documentation Workflow

Status: Confirmed

## Purpose

This document defines how `0.11.0` planning should be recorded while `0.10.0` implementation happens in a separate development session.

Stage 11 planning should stay lightweight until its version positioning is confirmed.

## Folder Rule

All Stage 11 planning belongs under `docs/planned/stage-11/` until Stage 11 becomes active development.

The planning session should stop at implementation readiness. It should not declare active development or move Stage 11 into `docs/active/`.

When Stage 11 becomes active, the development session moves the whole `stage-11` folder under `docs/active/` and updates only the indexes and links needed for that move.

When Stage 11 becomes an accepted baseline, move it under `docs/completed/` and treat old discussion details as historical.

## Split Rule

Do not put all Stage 11 decisions into one large file.

Use small documents by responsibility:

- planning index and version positioning;
- requirement decisions;
- workflow or UI decisions, if any;
- data model or compatibility decisions, if any;
- implementation order;
- acceptance checklist;
- code review checklist;
- automated test cases;
- manual test cases;
- release boundary.

Keep each document under roughly 200 lines.

## Decision Logging Rule

Discuss one decision at a time when requirements are open.

After a decision is confirmed:

- write it into the matching Stage 11 document immediately;
- mark the item as confirmed;
- add the next unresolved decision to the planning flow;
- avoid reopening completed decisions unless new information makes the old decision unsafe or incoherent.

## Source Work Boundary

Stage 11 planning must not modify source implementation by default.

Source code work belongs to the development session when the user explicitly asks for implementation, bug fixing, review, or release preparation.

## Stage 10 Boundary

Stage 10 implementation may change what Stage 11 should do.

When Stage 10 completes, refresh Stage 11 planning against the final Stage 10 behavior before implementation begins.
