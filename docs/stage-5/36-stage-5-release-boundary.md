# Stage 5: Release Boundary

Status: Confirmed

This document defines what `0.5.0` must not expand into.

## Included In `0.5.0`

- data maintenance settings section;
- current-note annotation export;
- selected-note annotation export;
- all-sidecar metadata export;
- JSON export package;
- human-readable Markdown export;
- JSON import preview;
- merge import with automatic sidecar backup;
- read-only data health check reports;
- manual orphaned annotation repair;
- manual duplicate annotation handling.

## Explicitly Deferred

### Cloud Sync And Remote Storage

Deferred:

- cloud sync;
- remote backup storage;
- account-based synchronization;
- cross-device conflict resolution.

Reason:

- `0.5.0` is a local data maintenance release. Remote storage requires separate privacy, conflict, and reliability decisions.

### AI And Automatic Analysis

Deferred:

- AI summary;
- automatic annotation analysis;
- automatic tag or category generation;
- semantic duplicate detection;
- semantic repair suggestions.

Reason:

- AI behavior requires separate product, privacy, and cost decisions.

### Automatic Cleanup

Deferred:

- automatic bulk deletion;
- automatic abnormal-data cleanup;
- one-click cleanup of all issues;
- silent sidecar rewriting across the full vault.

Reason:

- maintenance features must not hide data loss behind convenience actions.

### Automatic Anchor Repair

Deferred:

- automatic similarity-based rebinding;
- automatic bulk anchor rewriting;
- background anchor repair;
- repair without user-selected target text.

Reason:

- anchor repair can change the meaning of an annotation. `0.5.0` keeps repair manual and confirmation-based.

### Cross-Vault Migration

Deferred:

- batch path remapping across unrelated vaults;
- automatic old-vault to new-vault migration;
- folder-level path rewrite rules;
- import rules that rewrite many source paths at once.

Reason:

- path remapping is easy to misapply and should be designed as a separate migration workflow.

### Background Full-Vault Scanning

Deferred:

- startup full-vault sidecar scan;
- background full-vault health check;
- background full-vault export preparation;
- persistent maintenance index.

Reason:

- large vaults must not be penalized unless the user explicitly starts an operation.

### Additional Formats

Deferred:

- CSV export;
- Markdown import;
- third-party annotation import formats;
- compressed export packages.

Reason:

- `0.5.0` uses JSON as the restore format and Markdown as a read-only human-readable format.

## Rule For New Ideas During Implementation

If a new idea does not directly support the confirmed `0.5.0` maintenance flow, record it as deferred instead of implementing it opportunistically.

Confirmed `0.5.0` flow:

1. expose maintenance actions from settings and lightweight current-note export from the sidebar;
2. export annotation data in JSON or Markdown;
3. preview and merge JSON imports with backup;
4. run read-only health checks;
5. repair orphaned and duplicate annotations only after user confirmation.
