# Stage 5: Entry Points

Status: Confirmed

## Goal

Define where `0.5.0` import, export, and maintenance actions appear in the plugin UI.

## Confirmed Entry Points

`0.5.0` should use a layered entry-point design:

- settings page as the main entry point;
- sidebar as a lightweight current-note entry point only.

The settings page should contain full maintenance operations:

- export selected note annotations;
- export all sidecar metadata;
- import exported annotation data;
- run data health checks;
- access inspection or repair tools after those tools are confirmed.

The current-document sidebar may provide only single-note lightweight actions:

- export current note annotations.

The sidebar should not expose full-vault export, import, bulk repair, or other high-impact maintenance actions.

## Confirmed Settings Structure

The settings page should add a main section named `数据维护`.

Inside this section, `0.5.0` maintenance features should be organized in this order:

- Export;
- Import;
- Data Health Check;
- Repair Tools.

This order follows the expected workflow: back up data, restore data, inspect problems, then repair problems.

This structure should be used even if some sections start with a small first version. New maintenance features should extend the relevant section instead of adding unrelated buttons across the settings page.
