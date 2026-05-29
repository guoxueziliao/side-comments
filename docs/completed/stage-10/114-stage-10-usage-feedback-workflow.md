# Stage 10: Usage Feedback Workflow

Status: Confirmed

## Context

Starting with Stage 10 / `0.10.0`, the plugin is expected to be used frequently in daily desktop Obsidian work.

Development will no longer be only planned mainline work. Real usage can interrupt the plan with bugs, confusing interactions, visual problems, and workflow friction.

## Work Tracks

Stage 10 should use two parallel tracks:

- Mainline development.
- Usage feedback and regression fixes.

The two tracks should be recorded separately so daily issues do not erase the version plan, and the version plan does not bury real usage problems.

## Mainline Development

Mainline development contains planned Stage 10 work:

- confirmed stability areas;
- planned implementation order;
- release boundary;
- acceptance checklist;
- code review checklist;
- automated and manual test cases.

Mainline work should continue unless a usage issue is severe enough to interrupt it.

## Usage Feedback

Usage feedback includes problems found during daily use:

- broken or unreliable core behavior;
- confusing UI or interaction behavior;
- visual layout problems;
- navigation or selection regressions;
- performance problems in normal vault use;
- release-blocking packaging or settings issues;
- documentation gaps that cause wrong implementation decisions.

Each usage issue should be written as a small, concrete item:

- what happened;
- where it happened;
- expected behavior;
- actual behavior;
- severity;
- whether it blocks mainline work.

## Severity

Use this priority order:

- P0: data loss, corrupted sidecar data, plugin cannot load, or core annotation creation is broken.
- P1: high-frequency workflow is broken, such as create, jump, edit, delete, rebind, or reading/source mode mismatch.
- P2: confusing UI, visual mismatch, inconsistent button behavior, or workflow friction.
- P3: polish, wording, documentation, or low-frequency cleanup.

P0 and P1 can interrupt mainline work.

P2 should usually be batched unless it blocks the current development surface.

P3 should be collected and handled during polish or release review.

## Documentation Rule

Do not put all usage feedback into the planning index.

When usage feedback accumulates, create focused Stage 10 documents such as:

- usage issue list;
- UI regression list;
- source and reading mode regression list;
- release-blocking issue list.

Keep each document under roughly 200 lines.

## Fix Rule

For every usage issue that is fixed:

- record the expected behavior;
- note the affected surface;
- update or add a test case when practical;
- include it in the release checklist if it is release-relevant.

## Relationship To 1.0.0

This workflow supports future `1.0.0` readiness by making real usage problems visible.

It does not mean `0.10.0` is a `1.0.0` release candidate.
