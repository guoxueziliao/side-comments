# Stage 7 Issue 3: Health Check Report UI

Status: Confirmed

## Scope

Stage 5 confirmed the read-only health check semantics in `29-stage-5-health-check.md`:

- detect missing sidecars, duplicates, orphaned anchors, schema or export version mismatches, missing target documents, and obvious structure errors;
- three-level report: overview, issue categories, issue details;
- three severity levels: Error, Warning, Info;
- the same scope choices as export: current note, selected notes, all sidecars;
- no automatic background scan.

Stage 5 did not decide where the report lives, how rows behave when clicked, or how severity filtering works.

## Decision 1: Report Lives In A Dedicated View Tab

The health check report is a new Obsidian leaf view, peer to the existing cross-note review view.

Reason for view over modal: health check is a read-then-fix loop. The user reads an issue, jumps to the source document to inspect or fix, then comes back to the report. A modal would close on navigation. A view stays open.

Entry points:

- Settings `Data maintenance` group → `Run health check` button. Opens a small scope-picker modal (`Current note · Selected notes · All sidecars`), then opens the view with the results.
- Command palette command `Side Comments: run health check on current note` (single-shot, skips the scope picker).

Multiple reports do not stack. Re-running replaces the current report in the same view tab.

## Decision 2: Issue Rows Click Directly To The Source Document

Clicking an issue row opens the source document and scrolls to the affected annotation. The annotation flashes with a brief highlight pulse (about 1.5 seconds) before fading.

This matches the existing sidebar card-to-text navigation behavior from Stage 3.

The whole row is clickable. No separate `Open` button. Hovering the row shows a subtle background change.

When the affected annotation has no resolvable target (for example, the source document is missing), the row stays visible, shows a `Missing source` badge, and does not throw when the user tries to open it.

Its suggested action explains both valid outcomes:

- restore or rename the source document back to the stored path, then run the health check again;
- if the source document was intentionally deleted, confirm `Clean up annotation data` to back up and remove the orphaned sidecar for that missing document.

## Decision 3: Severity Filtering Uses A Top Chip Row

The view tab header has a chip row with three chips:

- `Error N`
- `Warning N`
- `Info N`

Each chip is independently toggleable. Default state is all three on. The counts in each chip update as the report data changes.

Chip visuals match the Stage 6.5 cross-note chip filter row.

Category filtering is not a chip dimension. Categories are the report's structural grouping (Stage 5 second level): the body of the view shows category sections with their own count headers and collapse controls.

## Report Body Structure

The view body follows Stage 5 three-level structure:

- Overview block at the top: check scope, check time, scanned document count, scanned sidecar count, total annotation count, total issue count.
- Issue category sections, each collapsible:
  - `Duplicate annotations`
  - `Orphaned anchors`
  - `Path problems`
  - `Version problems`
  - `Structure problems`
- Issue detail rows inside each category section: source document, issue summary, severity badge, and a one-line `Suggested action` row when the issue is repairable through Issue 4.

## Downstream Effects

- A new view registration similar to cross-note view, with its own type identifier.
- Reuses the chip row styles from Stage 6.5 cross-note view.
- Provides the entry into Issue 4 repair tools (the suggested action row is the visible bridge).
- i18n keys promoted out of orphan in this step: `health.runCurrentNote`, `health.runSelectedNotes`, `health.runAllSidecars`, `health.overview`, `health.categories`, `health.details`, `health.severity.error`, `health.severity.warning`, `health.severity.info`.

## Out Of Scope

- Automatic health check on startup or on file change.
- Saved health check reports or history.
- Export of the health check report.
- Multi-select bulk operations on issue rows.
