# Stage 4: Release Boundary

Status: Confirmed

This document defines what `0.4.0` must not expand into.

## Included In `0.4.0`

- duplicate rendering bugfix for repeated selected text;
- Simplified Chinese and English translation layer;
- one-click annotation mark hiding;
- zoom and scale adaptation checks;
- read-only cross-note annotation overview/search page;
- recent-preview-based lazy loading;
- source note open and jump actions.

## Explicitly Deferred

### Cross-Note Mutation

Deferred:

- edit comment content from the cross-note page;
- delete comments from the cross-note page;
- resolve or restore comments from the cross-note page;
- rebind orphaned comments from the cross-note page;
- adjust annotation ranges from the cross-note page.

Reason:

- mutation should stay in the source document sidebar until cross-view synchronization is designed.

### Full-Vault Indexing

Deferred:

- startup full-vault sidecar scan;
- background full-vault sidecar scan;
- persistent full-vault search index;
- folder-scoped indexing;
- load-more across all sidecars.

Reason:

- the plugin must remain safe for very large vaults.

### Markdown Content Search

Deferred:

- full Markdown body search;
- frontmatter search beyond source file path/name;
- linked document search;
- attachment search.

Reason:

- `0.4.0` is an annotation search release, not a vault content search release.

### Date And Metadata Filters

Deferred:

- annotation creation date filter;
- annotation update date filter;
- article/document date filter;
- file modified date filter;
- tag or frontmatter filters;
- saved filter presets.

Reason:

- these filters need a clearer user model before implementation.

### Data Maintenance

Deferred:

- import;
- export;
- data health checks;
- manual bulk repair tools;
- sidecar schema migration for Stage 4-only features.

Reason:

- these belong to a later maintenance-focused stage.

### AI Features

Deferred:

- AI summary;
- automatic analysis;
- automatic tag or category generation;
- semantic search.

Reason:

- these require separate product and privacy decisions.

## Rule For New Ideas During Implementation

If a new idea does not directly support the confirmed `0.4.0` flow, record it as deferred instead of implementing it opportunistically.

Confirmed `0.4.0` flow:

1. keep current-document annotation rendering reliable;
2. make UI bilingual;
3. allow temporary mark hiding;
4. open a read-only cross-note review page;
5. search/filter recent sidecar-derived annotations;
6. jump back to source note/sidebar for edits.
