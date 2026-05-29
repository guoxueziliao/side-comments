# Stage 11: Implementation Order

Status: Confirmed

## Purpose

This document defines the recommended implementation order for Stage 11 / `0.11.0`.

Stage 11 is a release and review hardening version. Implementation should reduce release risk before polishing optional presentation details.

## Order

## 1. Refresh Official Requirements

Start by checking current official Obsidian documentation.

Verify:

- submission flow;
- manifest rules;
- versions behavior;
- GitHub Release asset requirements;
- official self-critique checklist.

Update [Official Obsidian Readiness](../../release/01-official-obsidian-readiness.md) if official requirements changed.

## 2. Audit Current Repository State

Inspect:

- `manifest.json`;
- `versions.json`;
- `package.json`;
- `README.md`;
- `LICENSE`;
- GitHub repository metadata, when available;
- current release assets and build output;
- current active Stage 10 state if it affects release readiness.

Do not rewrite broad docs before the actual gaps are known.

## 3. Fix Official Review Blockers

Handle blockers first:

- invalid manifest fields;
- missing required root files;
- broken or stale version metadata;
- release asset mismatch;
- unsupported claims in public copy;
- official checklist failures that can block review.

P0 and P1 review blockers should be fixed before presentation polish.

## 4. Update External Copy

Align:

- manifest description;
- GitHub short description;
- README opening;
- release summary;
- Chinese and English terminology.

Follow [External Copy](../../release/04-external-copy.md).

## 5. Update Repository Presentation

Then update:

- README structure;
- feature summary;
- installation section;
- data storage explanation;
- limitations;
- development status;
- screenshots or screenshot checklist.

Follow [Repository Presentation](../../release/02-repository-presentation.md).

## 6. Harden Release Process

Document or adjust:

- version update procedure;
- build and artifact checks;
- local test install sync;
- GitHub Release steps;
- release notes format;
- pre-release and post-release checks.

Follow [Release Process](../../release/03-release-process.md).

## 7. Review Settings And First Use

Perform a lightweight clarity pass over:

- settings labels;
- descriptions;
- empty states;
- notices;
- language consistency.

Do not turn this into a new UI redesign.

## 8. Run Validation And Review Checklists

Run or prepare evidence for:

- official review checklist;
- technical pre-release checklist;
- manual usage checklist;
- repository presentation checklist.

Follow [Validation And Review Checklists](../../release/06-validation-review-checklists.md).

## 9. Final Release Readiness Review

Before treating Stage 11 as complete:

- confirm all P0 and P1 issues are fixed;
- record deferred P2 and P3 issues;
- ensure release docs match actual commands and outcomes;
- ensure no Stage 11 doc claims checks were run without evidence.

## Stop Conditions

Pause and reopen planning if:

- official requirements contradict the planned release process;
- Stage 10 changes make Stage 11 assumptions stale;
- a product-model change appears necessary for review;
- a new capability request enters the release hardening scope;
- release readiness depends on unresolved P0 or P1 usage bugs.
