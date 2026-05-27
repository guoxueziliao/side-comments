# Current Status

Status: Confirmed

## Version

- Last published release: `0.4.0`
- Current `manifest.json` version: `0.7.0`
- Current development release: `0.7.0` (Data Maintenance Build-out; implementation complete, pending review and test)
- Next planned release: TBD
- Repository: `guoxueziliao/side-comments`
- Local development path: `/home/fan/obsidian插件`
- Local test install path: `C:\Users\FAN\Desktop\全域智库\.obsidian\plugins\side-comments`

## Implemented And Merged

- Create annotations from selected Markdown text.
- Support source mode and reading mode.
- Support highlight, underline, strikethrough, and comment entry points.
- Store annotation data outside Markdown files under `.obsidian-side-comments/`.
- Render marks in editor and reading view.
- Show current-document comments in the right sidebar.
- Support sidebar edit, delete, resolve, search, filter, and jump actions.
- Load current-document sidecar data lazily.
- Relocate anchors conservatively after document edits.
- Support lazy sidecar schema migration.
- Read-only cross-note annotation overview page (Stage 4).
- Bilingual UI infrastructure (Stage 4).
- Stage 5 export entry points (current note, selected note, all sidecars; export side only).
- Annotation type and user-defined tags data model, combined filters, and Markdown draft copy (Stage 6).

## Planned But Not Yet Implemented

- None for the current release.

## In Progress

- `0.7.0` review and test pass.

## Release State

- GitHub repository is connected.
- Release assets are published through GitHub Releases.
- Latest published release is `0.4.0`.
- Code on `main` is ahead of the latest published release and currently targets `0.7.0`.
- Local development copy should be kept for testing and iteration.

## Known Limits

- Desktop only.
- Markdown notes only.
- No PDF or EPUB annotation.
- No cloud sync or multi-user collaboration.
- No full-vault annotation search.
- Reading mode source mapping can still be refined for complex Markdown.
