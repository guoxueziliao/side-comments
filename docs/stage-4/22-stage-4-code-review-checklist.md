# Stage 4: Code Review Checklist

Status: Confirmed

Use this checklist when reviewing `0.4.0` implementation.

## Anchor Rendering Bugfix

- Rendering uses resolved anchor ranges, not broad selected-text matching.
- Repeated selected text does not produce multiple marks for one comment.
- Low-confidence relocation becomes orphaned instead of rendering in multiple locations.
- Source mode and reading mode both respect the same resolved comment location.
- The regression case from `2026-05-20_520现在的爱藏在过去之中.md` is covered.
- Sidebar still renders one card per sidecar comment.

## Data Safety

- One-click hiding does not modify sidecar files.
- Cross-note review does not edit, delete, resolve, restore, rebind, or adjust comments.
- `0.4.0` does not require a sidecar schema migration unless separately approved.
- Existing sidecar files remain readable.
- Missing, invalid, or stale `recent.json` data is handled without crashing.

## Loading And Performance

- Plugin startup does not scan `.obsidian-side-comments/files/`.
- Opening the cross-note page reads recent preview data only.
- Full sidecar files are loaded only for on-demand actions that need them.
- The cross-note page follows `maxCachedDocuments` instead of defining a second range.
- No background full-vault sidecar scan is introduced.
- Large vault behavior is considered before adding any file traversal.

## Cross-Note Review Page

- Result cards show only user-facing fields.
- Internal fields such as hash, sidecar path, offset, line, column, schema version, and cache keys are hidden.
- Search uses sidecar-derived fields only.
- Markdown body content is not searched in the first release.
- Filters match the confirmed first-release filter set.
- Jump actions open the source note and reveal the matching sidebar card.
- Direct mutation actions are not present on cross-note result cards.

## One-Click Hide Marks

- Hide/show state is global and temporary.
- Hidden state does not persist after Obsidian restart.
- Sidebar remains usable while marks are hidden.
- Create-annotation toolbar is suppressed while marks are hidden.
- Existing sidebar actions still follow normal status rules.

## Multi-Language Support

- New UI strings use translation keys where practical.
- Simplified Chinese and English dictionaries stay aligned.
- Unsupported locales fall back to English.
- Commands, settings, notices, empty states, tooltips, and visible labels are covered.
- Short labels such as `绑` and `调` are not hard-coded outside the translation layer.

## Zoom And Layout

- Toolbar, filter controls, and cards do not overlap at 100%, 125%, and 150% scale.
- Narrow sidebar behavior is usable.
- Primary actions remain reachable without horizontal scrolling.
- Floating toolbar stays within the visible pane.
- Compact mode remains a viable fallback.

## Release Boundary

- No import/export/data maintenance tools are added in this release.
- No AI summary or automatic analysis is added.
- No full Markdown search is added.
- No full-vault persistent index is added.
- Deferred features remain documented rather than partially implemented.
