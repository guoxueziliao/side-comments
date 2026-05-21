# Side Comments

Side Comments is a desktop Obsidian plugin for non-invasive side comments and reading annotations in Markdown notes.

It lets you select text in a note, add a highlight, underline, strikethrough, or comment marker, and manage the annotations in a right-side panel. The plugin does not write annotation markup into your Markdown files. Annotation data is stored as local sidecar JSON files inside the vault.

## Features

- Create annotations from selected Markdown text.
- Supports highlight, underline, strikethrough, and comment entry points.
- Works in both source mode and reading mode.
- Stores annotations outside Markdown under `.obsidian-side-comments/`.
- Shows visual marks in the editor and reading view.
- Provides a current-document sidebar for editing, deleting, resolving, searching, and filtering comments.
- Supports jumping between sidebar cards and annotated source text.
- Relocates anchors after document edits when confidence is high.
- Loads only the current document sidecar, suitable for large vaults.

## Data Storage

Side Comments stores annotation data in the current vault:

```text
.obsidian-side-comments/
  manifest.json
  files/
  cache/
  backups/
```

Each Markdown file maps to one sidecar JSON file by hashing its normalized vault-relative path. The Markdown source file is not modified.

## Installation

For manual testing or local use, copy these release files into:

```text
<vault>/.obsidian/plugins/side-comments/
```

Required files:

- `main.js`
- `manifest.json`
- `styles.css`

Then enable `Side Comments` from Obsidian Settings -> Community plugins.

## Development

Install dependencies:

```bash
npm install
```

Run type checking:

```bash
npm run typecheck
```

Build the plugin:

```bash
npm run build
```

Watch during development:

```bash
npm run dev
```

The project currently targets Node.js 26 in the local WSL development environment.

## Release Checklist

- Update `manifest.json`, `package.json`, and `versions.json` to the same plugin version.
- Run `npm run typecheck`.
- Run `npm run build`.
- Confirm the release folder contains `main.js`, `manifest.json`, and `styles.css`.
- Test source mode annotation creation.
- Test reading mode annotation creation.
- Test sidebar edit, delete, resolve, search, filter, and jump actions.
- Test file rename behavior with existing annotations.

## Current Limitations

- Desktop only.
- Markdown notes only.
- No PDF or EPUB annotation.
- No cloud sync or multi-user collaboration.
- No full-vault annotation search.
- Reading mode selection is mapped back to Markdown source by text matching, so complex rendered Markdown may still need refinement.

## Privacy

Side Comments does not upload, sync, collect, or transmit notes or annotation data. All annotation data remains local in the vault.

## Compatibility

Annotation files include a `schemaVersion`. Newer plugin versions migrate older sidecar files lazily when they are opened. Downgrading to older plugin versions is not guaranteed to read newer schemas correctly.

## License

MIT
