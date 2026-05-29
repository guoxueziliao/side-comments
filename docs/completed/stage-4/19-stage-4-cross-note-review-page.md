# Stage 4: Cross-Note Review Page

Status: Confirmed

## Goal

Provide the first cross-note annotation overview/search page for `0.4.0`.

## First Release Behavior

The first cross-note review page is read-only.

Allowed actions:

- search annotations;
- filter annotations;
- open the source note;
- jump to the source document and matching sidebar card.

Disallowed direct actions:

- edit comment content;
- delete comments;
- mark comments as resolved;
- restore resolved comments;
- rebind orphaned comments;
- adjust annotation ranges.

## Default Loaded Range

The first view should reuse the existing progressive loading range.

Confirmed behavior:

- use the same range as the existing recent sidecar/cache setting;
- default to `maxCachedDocuments`, currently 100;
- load recent sidecar previews from `.obsidian-side-comments/cache/recent.json` when available;
- do not create a second independent setting for the cross-note default range;
- do not scan all sidecar files when the plugin starts or when the page first opens.

If the user changes the existing cached/recent document range in settings, the cross-note review page should follow that same value.

## Searchable Fields

The first release searches lightweight sidecar-derived fields only.

Keyword search should match:

- selected text excerpt;
- comment note content;
- source file path;
- source file name;
- comment status text when entered as a search term.

Keyword search should not match:

- full Markdown document content;
- unrelated frontmatter;
- linked document content;
- attachment content.

The following fields are primarily filter dimensions, not main keyword-search targets:

- status;
- annotation type;
- annotation color.

## Filters

The first release should stay consistent with the `0.3.0` current-document sidebar filters, then add one cross-note-specific filter.

Confirmed filters:

- keyword;
- status: all, active, resolved, orphaned;
- annotation color;
- annotation type;
- source document by file name or path.

Deferred filters:

- date range;
- folder scope;
- tag/frontmatter scope;
- saved filter presets.

Date filtering is deferred because there are multiple possible meanings:

- annotation creation date;
- annotation update date;
- article or document date;
- file modified date.

These should not be mixed into the first version without a clearer user model.

## Result Card Layout

The first release should use compact, review-oriented result cards.

Visible fields:

- source file name;
- selected text excerpt;
- comment note preview;
- status;
- annotation type;
- annotation color.

Actions:

- open source document;
- jump to document text and matching sidebar card.

Hidden internal fields:

- file hash;
- sidecar path;
- anchor offset;
- line and column;
- schema version;
- internal cache/index keys.

Full internal metadata should remain available only for debugging or future maintenance tools, not normal review.

## Index And Loading Strategy

The first release uses lazy loading plus the existing recent preview cache.

Confirmed behavior:

- opening the cross-note review page reads `.obsidian-side-comments/cache/recent.json`;
- recent preview data is used to render the initial result list;
- full sidecar data is loaded only when needed for an action, such as jumping to the source document;
- plugin startup does not build a cross-note index;
- opening the cross-note page does not scan all sidecar files;
- no background full-vault sidecar scan runs in the first release.

Deferred:

- load-more behavior beyond the recent range;
- full-vault sidecar index;
- persistent search index;
- background index refresh;
- folder-scoped indexing.

## Rationale

Editing should remain in the source document sidebar for the first release.

This keeps `0.4.0` focused on cross-note retrieval and avoids state synchronization problems between the cross-note review page, the active document, and the current-document sidebar.

## Still To Decide

No first-release behavior is currently undecided. If implementation exposes new tradeoffs, split them into smaller Stage 4 documents.
