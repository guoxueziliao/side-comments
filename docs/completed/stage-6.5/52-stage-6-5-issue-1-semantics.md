# Stage 6.5 Issue 1: Semantics Consolidation

Status: Confirmed

## Scope

This issue resolves three overlapping concepts that currently propagate confusion through the rest of the UI:

- The relationship between "comment" and the implicit `highlight + purple` combination.
- The coupling between mark type and color in the selection toolbar.
- The three different scopes of "resolved" visibility (editor appearance, sidebar list visibility, session filter).

These decisions are made first because they constrain the design space of issues 2 through 5.

## Decision 1: Comment Becomes An Independent Mark Type

A new mark type `note` is added alongside `highlight`, `underline`, and `strikethrough`. The `note` mark does not alter the text style in the editor or the reading view. It is represented by a margin marker or row-level indicator only.

The implicit "comment is highlight + purple" mapping in the current selection toolbar is removed for new annotations. The `isCommentLikeMark` helper in `src/views/commentCard.ts` is retained only as a back-compatibility branch for legacy data, and its label output applies to legacy data alone.

Reason:

- The roadmap (`docs/core/02-roadmap.md`) explicitly excludes color as a semantic dimension. Encoding "comment" as `highlight + purple` violates that constraint.
- Users may want a purely textual comment without altering the document appearance.
- Promoting `note` to a first-class mark type is a non-destructive extension to the existing data model.

## Decision 2: Mark Type And Color Are Fully Decoupled

Any of the four mark types may pair with any of the five colors. The selection toolbar provides default colors per mark type for fast single-click creation, but those defaults are local conventions, not data constraints.

First-use defaults:

- Highlight: yellow.
- Underline: blue.
- Strikethrough: red.
- Note: purple.

After first use, each mark type remembers its last-used color and applies that color on the next single click.

## Decision 3: "Resolved" Compresses From Three Controls To Two

The current implementation exposes three independent controls for handled annotations:

- `showResolvedMarks` in settings, controlling editor visual treatment.
- `showResolvedComments` in settings, controlling sidebar list visibility.
- Status filter dropdown in the sidebar header, providing a session-level filter.

This is compressed to two:

- The editor visual treatment setting (`showResolvedMarks`) stays. It is a document-level appearance preference and belongs on the settings page.
- Sidebar list visibility is removed as a separate control. The status filter dropdown is the sole control for list visibility.
- The "Show resolved" and "Hide resolved" button in the sidebar header is removed.
- The `settings.showResolvedComments` setting in the settings page is removed.

Downstream cleanup is tracked in issue 5: the i18n keys `sidebar.showResolved`, `sidebar.hideResolved`, `sidebar.showResolved.short`, `sidebar.hideResolved.short`, `settings.showResolvedComments.name`, and `settings.showResolvedComments.desc` are removed or repurposed.

## Decision 4: Annotation Type Positioning

The annotation type dimension (`excerpt`, `question`, `thought`, `task`) is semantic classification. It is orthogonal to mark type, which is visual presentation. They are not merged.

Annotation type is not chosen at creation time for highlight, underline, or strikethrough marks. Those default to `excerpt` and can be reclassified later in the comment card edit panel.

Two exceptions allow creation-time type selection without polluting the dominant path:

- Creating a `note` mark auto-opens the sidebar in edit mode with the annotation type dropdown visible. The intent of `note` is "I am writing something deliberate", which is precisely when annotation type matters.
- The command palette gains three new commands: `Add as question`, `Add as thought`, and `Add as task`. These commands can be bound to hotkeys for power users.

## Migration Policy

Legacy annotations created as `highlight + purple` ("comment" under the old toolbar) are not migrated. They are kept as legacy purple highlights so existing notes are not visually disturbed by the upgrade. New annotations use the `note` mark type.

The `isCommentLikeMark` helper continues to label legacy `highlight + purple` annotations as "Comment" in the meta row, so existing users do not lose recognition.

Whether to offer a manual migration tool is deferred to issue 5.

## Downstream Effects

- Issue 2 must render four mark type buttons with decoupled color sub-pickers and add the three command palette commands.
- Issue 3 must surface the annotation type and tag editor in the comment card edit panel.
- Issue 5 must remove the deprecated settings and the related i18n keys, and decide on the manual migration tool.
