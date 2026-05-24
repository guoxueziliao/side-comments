# Development Principles

Status: Confirmed

## Data Safety

- Do not write annotation syntax into Markdown files.
- Store plugin data in sidecar files.
- Keep migration conservative and reversible where possible.
- Avoid automatic destructive cleanup.

## Editing Compatibility

- Treat Obsidian source mode and reading mode as first-class workflows.
- Avoid replacing the editor or building a separate rich text editor.
- Prefer small, local behavior changes over broad rendering rewrites.

## Performance

- Optimize for large vaults.
- Load data for the current document first.
- Avoid full-vault scans unless a future feature explicitly requires them.
- Cache only where it gives clear user-facing benefit.

## User Experience

- Keep annotation creation fast after text selection.
- Keep sidebar actions visible and understandable.
- Prefer stable, predictable behavior over aggressive automation.
- Make failures recoverable and visible when recovery confidence is low.

## Release Discipline

- Keep `manifest.json`, `package.json`, and `versions.json` in sync.
- Run typecheck and build before release.
- Publish updates through GitHub Releases, not only git pushes.
- Keep release notes short and specific.
