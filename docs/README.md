# Development Notes

This directory records Side Comments planning, implementation history, and release preparation.

Use this file as the entry point. Detailed decisions live in status-based folders.

## Main Sections

- [core](./core/): current status, roadmap, principles, and short work queues.
- [completed](./completed/): historical completed stages and current completed baseline, currently Stage 1 through Stage 11.
- [active](./active/): actively developed stages, currently none.
- [planned](./planned/): future planning, currently Stage 12 / `0.12.0`.
- [release](./release/): reusable release, review, and public-presentation guidance.
- [archive/mvp-spec](./archive/mvp-spec/): original MVP specification split.

## Start Here

- [Current Status](./core/00-current-status.md): current version and work state.
- [Roadmap](./core/02-roadmap.md): short staged development sequence.
- [Implemented Work](./core/03-implemented.md): completed implementation baseline.
- [In Progress](./core/04-in-progress.md): active development and planning queue.
- [Future Work](./core/05-future.md): work not active yet.

## Current Work

- Current package baseline: Stage 11 / `0.11.0`.
- Next implementation target: [Stage 12 / `0.12.0`](./planned/stage-12/147-stage-12-planning-index.md).
- Current planning target: [Stage 12 / `0.12.0`](./planned/stage-12/147-stage-12-planning-index.md).
- Latest completed: [Stage 11 Development Index](./completed/stage-11/146-stage-11-development-index.md).

Older completed stages are references, not always current behavior. Later stages can supersede earlier details.

## Writing Rules

- Keep each document focused on one stage or decision area.
- Put completed stages under `docs/completed/`.
- Put active development stages under `docs/active/`.
- Put future planning stages under `docs/planned/`.
- Keep root `docs/` limited to this README unless there is a strong reason.
- Mark undecided items as `Status: To discuss`.
- Mark confirmed items as `Status: Confirmed`.
- Add implementation notes only after the direction is agreed.
- Prefer concrete next steps over broad feature lists.
