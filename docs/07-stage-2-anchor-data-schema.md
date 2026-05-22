# Stage 2 Anchor Data Schema

Status: Confirmed

This document discusses anchor data changes for `v0.2`.

## Current Schema

Current comments store this anchor shape:

```ts
interface TextAnchor {
  startOffset: number;
  endOffset: number;
  selectedText: string;
  prefix: string;
  suffix: string;
}
```

This is enough for MVP creation and conservative relocation, but it is weak when:

- the same selected text appears many times;
- the selected text is edited shorter or longer;
- reading mode text differs from Markdown source text;
- an orphaned card needs to show useful recovery context.

## Compatibility Rule

Status: Confirmed

- Existing `0.1.x` sidecar files must keep loading.
- Existing anchors must not be discarded.
- New fields should be optional at first.
- The plugin should tolerate missing `v0.2` anchor fields.
- Markdown source must not receive hidden anchor IDs or marker syntax.

## Proposed Anchor Shape

Status: Confirmed

Keep the current fields and add optional metadata:

```ts
interface TextAnchor {
  startOffset: number;
  endOffset: number;
  selectedText: string;
  prefix: string;
  suffix: string;
  version?: 2;
  context?: {
    before: string;
    after: string;
    normalizedBefore: string;
    normalizedSelectedText: string;
    normalizedAfter: string;
  };
  position?: {
    lineStart: number;
    lineEnd: number;
    columnStart: number;
    columnEnd: number;
  };
  source?: {
    mode: "source" | "reading";
    createdAt: string;
    updatedAt: string;
  };
}
```

## Field Purpose

### `version`

Status: To discuss

Purpose:

- Identify anchors created or refreshed by `v0.2`.
- Avoid guessing whether optional metadata exists because of old data or partial corruption.

### `context`

Status: Confirmed

Purpose:

- Store longer context for relocation.
- Store normalized context for reading mode mapping and whitespace differences.
- Help orphaned cards show original surrounding text.

Notes:

- `prefix` and `suffix` remain for backward compatibility.
- `context.before` and `context.after` use 80 characters in `v0.2`.
- Normalized fields should be used for scoring, not for display.

### `position`

Status: Confirmed

Purpose:

- Help relocation prefer candidates near the old line.
- Help users understand roughly where an orphaned annotation used to be.
- Line and column values use 1-based numbers for easier JSON inspection.

Risk:

- Line numbers become stale after edits.
- Therefore line information should be a weak signal, not a strict locator.

### `source`

Status: Confirmed

Purpose:

- Record whether the anchor came from source mode or reading mode.
- Help diagnose mapping issues later.
- Track when a manual rebind or range adjustment refreshed the anchor.
- Refresh `source.updatedAt` after automatic relocation moves the anchor.
- Do not refresh `source.updatedAt` when the original offsets still match exactly.

## Migration Strategy

Status: Confirmed

Confirmed strategy:

- Keep document `schemaVersion` at `1` unless a required breaking structure change appears.
- Treat new anchor fields as optional.
- Generate `v0.2` metadata for new comments.
- Regenerate `v0.2` metadata when a comment is manually rebound or range-adjusted.
- Do not rewrite all old comments on load.
- Do not bump sidecar `schemaVersion` for `v0.2`.

Rejected for `v0.2`:

- Bump sidecar `schemaVersion` to `2` and migrate anchors lazily.

Concern:

- A schema bump is heavier and requires more migration testing.
- Optional fields may be enough for `v0.2`.

## Display Rule for Orphaned Cards

Status: Confirmed

Use this priority when showing orphaned context:

1. Prefer `context.before`, `selectedText`, and `context.after` if available.
2. Fall back to `prefix`, `selectedText`, and `suffix`.
3. If context is missing, still show `selectedText`.

## Relocation Use

Status: To discuss

Relocation should score candidates using:

- exact offset match;
- selected text match quality;
- prefix and suffix similarity;
- longer `context.before` and `context.after` similarity when available;
- normalized context similarity;
- distance from previous offset;
- line distance as a weak signal when available;
- ambiguity penalty when multiple candidates score similarly.

## Open Questions

- None for the current `v0.2` anchor data schema baseline.
