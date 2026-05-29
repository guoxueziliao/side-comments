# Stage 3: Display Modes

Status: Confirmed

## Goal

Support both detailed review and dense scanning in the current-document sidebar.

## Modes

Add a normal mode and a compact mode.

Normal mode keeps the richer card layout.

Compact mode should show only the information needed for quick review:

- status;
- annotation type or color;
- selected text;
- short note preview;
- key action buttons.

Compact mode is intended for notes with many annotations.

## Compact Item Content

Compact item content:

- status: active, resolved, or orphaned;
- annotation type or color marker;
- selected text summary;
- note preview when a note exists;
- jump action;
- edit action;
- resolve or restore action;
- delete action;
- rebind action `绑` for orphaned comments;
- range adjustment action `调` for active or resolved comments.

Compact mode should not show full context, full note body, created time, or internal technical metadata by default.

Clicking the compact item body should expand it to the full card.

Orphaned comments in compact mode should still show at least the original selected text. Original surrounding context can be shown after expanding the card.

## Preference Persistence

Display mode persistence:

- remember the sidebar display mode as a global plugin setting;
- default to normal mode;
- do not remember display mode per document;
- do not persist per-document expanded cards;
- do not persist per-document sidebar scroll position;
- do not persist per-document filter state.

Suggested settings fields:

- `sidebarDisplayMode: "normal" | "compact"`;
- `showResolvedComments: boolean`.

For large vaults, sidebar preference data must not grow linearly with the number of Markdown files.

These settings are plugin-level UI preferences. They should not require a sidecar schema change or historical comment migration.

## Settings Entry Points

Provide two entry points for these preferences:

- sidebar top controls;
- plugin settings tab.

Sidebar controls should allow quick switching while reviewing comments:

- normal or compact mode;
- show or hide resolved comments.

The plugin settings tab should expose the same preferences as default sidebar behavior.

Both entry points should write to the same global plugin settings. There should not be separate sidebar-only state and settings-page state for these preferences.

## Acceptance Criteria

- Compact mode makes dense notes easier to scan.
- Compact mode keeps essential actions available without showing full card details.
- Sidebar display preferences are stored globally and do not grow with vault size.
- Display mode settings do not require sidecar schema changes.
- Sidebar controls and the settings tab control the same global preferences.
