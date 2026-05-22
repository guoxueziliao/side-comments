# Development Notes

This directory records post-MVP planning and implementation progress for Side Comments.

Docs are split by development order instead of collected into one large document. When a direction is confirmed, add or update the smallest relevant document here.

## Documents

- [Current Status](./00-current-status.md): what is already done and what should stay stable.
- [Development Principles](./01-development-principles.md): constraints that guide future feature choices.
- [Roadmap](./02-roadmap.md): staged development order.
- [Stage 1: Stabilize MVP](./03-stage-1-stabilization.md): current maintenance stage.
- [Stage 2: Anchor Reliability](./04-stage-2-anchor-reliability.md): proposed `v0.2` direction.
- [Stage 2 Implementation Order](./05-stage-2-implementation-order.md): confirmed `v0.2` implementation sequence.
- [Stage 2 Confirmed Decisions](./06-stage-2-confirmed-decisions.md): agreed interaction and safety decisions for `v0.2`.
- [Stage 2 Anchor Data Schema](./07-stage-2-anchor-data-schema.md): proposed `v0.2` anchor metadata and migration rules.
- [Stage 3: Sidebar Workflow](./08-stage-3-sidebar-workflow.md): sidebar workflow overview after anchor reliability.
- [Stage 3: Order and Status Display](./09-stage-3-order-and-status.md): document-order sorting and status behavior.
- [Stage 3: Display Modes](./10-stage-3-display-modes.md): normal mode, compact mode, and display preference persistence.
- [Stage 3: Navigation](./11-stage-3-navigation.md): card-to-text and text-to-card navigation decisions.
- [Stage 3: Filtering](./12-stage-3-filtering.md): combined current-document filters.

## Writing Rules

- Keep each document focused on one stage or decision area.
- Mark undecided items as `Status: To discuss`.
- Mark confirmed items as `Status: Confirmed`.
- Add implementation notes only after the direction is agreed.
- Prefer concrete next steps over broad feature lists.
