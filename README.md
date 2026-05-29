# Side Comments

Side comments and visual marks for Markdown notes, stored outside the note body.

A desktop Obsidian plugin that lets you select text, add a highlight, underline, strikethrough, or side comment, and manage annotations in a right-side panel — without modifying your Markdown source.

## Features

- Create annotations from selected text in source mode or reading mode.
- Visual marks: highlight, underline, strikethrough.
- Side comments with note content, tags, and status tracking.
- Current-document sidebar for editing, filtering, resolving, and jumping to annotations.
- Cross-note overview for reviewing annotations across the vault.
- Import, export, and health-check tools for annotation data.
- Anchor relocation after document edits.
- English and Simplified Chinese interface.

## Installation

Install from the Obsidian Community Plugins directory, or copy these files into `<vault>/.obsidian/plugins/side-comments/`:

- `main.js`
- `manifest.json`
- `styles.css`

Then enable **Side Comments** from Settings → Community plugins.

## Usage

1. Open a Markdown note.
2. Select text in the editor.
3. Use the floating toolbar to apply a visual mark or open the advanced creation panel.
4. Manage annotations in the right-side sidebar.

## Data Storage

Annotation data is stored as local JSON files under:

```text
.obsidian-side-comments/
  files/
  cache/
  backups/
```

Each Markdown file maps to one sidecar JSON file. Your Markdown source files are not modified.

All data stays local in your vault. The plugin does not upload, sync, collect, or transmit any notes or annotations.

## Limitations

- Desktop only.
- Markdown notes only.
- No PDF or EPUB annotation.
- No mobile support.
- No cloud sync or multi-user collaboration.
- Reading-mode source mapping can still have edge cases for complex Markdown.

## Development Status

Side Comments is in active `0.x` development. Core annotation workflows are usable. Behavior may continue to improve across `0.x` releases. Users should keep backups before relying on plugin data heavily.

## Development

```bash
npm install
npm run typecheck
npm run build
npm run dev        # watch mode
```

## License

MIT
