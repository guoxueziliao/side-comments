# Stage 5: Data Health Check

Status: Confirmed

## Goal

Define the read-only data health check behavior for `0.5.0`.

## Confirmed Direction

`0.5.0` health checks should start as read-only reports and should not auto-repair data.

The first release should at least detect:

- missing sidecars or path mismatches;
- duplicate annotations;
- orphaned anchors;
- schema version or export version mismatches;
- missing target documents;
- obvious export package structure errors.

Health checks should focus on finding problems and explaining them clearly. Repair actions should be handled by separate tools after they are confirmed.

## Confirmed Report Structure

Health check reports should have three levels:

- overview;
- issue categories;
- issue details.

The overview should show:

- check scope;
- check time;
- scanned document count;
- scanned sidecar count;
- total annotation count;
- total issue count.

Issue categories should group findings by type, such as:

- duplicate annotations;
- orphaned anchors;
- path problems;
- version problems;
- structure problems.

Issue details should show:

- source document;
- issue type;
- affected annotation summary;
- severity;
- suggested action.

Severity should use three levels:

- Error: may cause import failure, unreadable data, or invalid sidecar structure.
- Warning: data is readable, but positioning, duplicate rendering, or restore behavior may be affected.
- Info: does not block normal use, but may be useful for cleanup.

## Confirmed Scope

Health checks should use the same scope choices as export:

- current note;
- user-selected notes;
- all sidecar metadata.

Health checks should not add a recent-cache scope. They should not run as an automatic background scan on startup.
