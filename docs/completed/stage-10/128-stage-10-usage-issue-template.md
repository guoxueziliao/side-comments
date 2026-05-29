# Stage 10: Usage Issue Template

Status: Confirmed

## Purpose

This document defines how daily-use issues should be recorded during Stage 10.

It supports the usage feedback workflow without mixing every issue into the mainline plan.

## Issue Format

Use this format for each usage issue:

```text
ID:
Date:
Priority: P0 | P1 | P2 | P3
Surface:
Workflow step:
Environment:
Expected:
Actual:
Reproduction:
Impact:
Blocks mainline: yes | no
Decision:
Status: open | fixed | deferred | rejected
```

## Priority Guide

- P0: data loss, corrupted sidecar data, plugin cannot load, or core annotation creation is broken.
- P1: high-frequency workflow is broken.
- P2: confusing UI, visual mismatch, inconsistent button behavior, or workflow friction.
- P3: wording, documentation, polish, or low-frequency cleanup.

## Surface Values

Recommended surface names:

- selection toolbar;
- More panel;
- source mode;
- reading mode;
- current-document sidebar;
- cross-note reveal;
- settings;
- storage;
- release packaging.

## Workflow Step Values

Recommended workflow step names:

- create;
- update;
- jump;
- resolve;
- rebind;
- delete;
- filter;
- release.

## Handling Rule

P0 and P1 issues can interrupt implementation order.

P2 issues should be batched unless they affect the current implementation surface.

P3 issues should be collected for polish or release review.

## Documentation Rule

When issues accumulate, create a focused issue-list document instead of expanding this template.

Keep issue-list documents under roughly 200 lines.
