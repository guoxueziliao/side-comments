# Stage 6: Test Cases

Status: Confirmed

This document lists core functional test cases for `0.6.0`.

Manual verification and non-goal tests are tracked in `50-stage-6-manual-and-non-goal-test-cases.md`.

## Metadata Compatibility

### Missing Type

- Given an existing annotation without a type field.
- When the annotation is loaded.
- Then the UI displays Excerpt.
- And the annotation is not rewritten until the user edits or saves it.

### Missing Tags

- Given an existing annotation without a tags field.
- When the annotation is loaded.
- Then the UI displays no tags.
- And tag filters treat it as an empty tag list.

### New Annotation Defaults

- Given the user creates a new annotation without changing the type dropdown.
- When the annotation is saved.
- Then the annotation type is Excerpt.
- And tags are empty unless added later from the sidebar.

## Annotation Types

### Create With Type

- Given the user selects text and changes the type dropdown to Question.
- When the annotation is created.
- Then the saved annotation has type Question.

### Edit Type

- Given an existing annotation is displayed in the sidebar.
- When the user changes its type from Excerpt to Thought.
- Then the sidebar updates.
- And the saved annotation stores the stable type ID.

### Task Type Boundary

- Given an annotation type is Task.
- When the annotation is displayed.
- Then no task-management UI, due date, checkbox, or task list behavior appears.

## Tags

### Add Tag

- Given an annotation card has no tags.
- When the user enters `爱情观` and presses Enter.
- Then the card shows a tag chip for `爱情观`.
- And the annotation metadata stores the tag.

### Remove Tag

- Given an annotation card has tag `爱情观`.
- When the user clicks the tag remove control.
- Then the tag is removed from the card.
- And the annotation metadata is updated.

### Prevent Empty Tags

- Given the tag input is empty or whitespace.
- When the user presses Enter.
- Then no tag is added.

### Prevent Duplicate Tags

- Given an annotation already has tag `love`.
- When the user adds `Love`.
- Then the annotation should not contain duplicate English tags after normalization.

### Autocomplete Existing Tags

- Given `爱情观` has been used on another annotation.
- When the user types a matching prefix in the tag input.
- Then `爱情观` can appear as an autocomplete suggestion.
- And suggestions do not include AI-generated or invented tags.

## Filters

### Empty Filters

- Given no filters are selected.
- When the current-note sidebar or cross-note review page loads.
- Then all annotations available in that surface are shown.

### Dimension AND Logic

- Given filters Status = Active and Type = Question.
- When annotations are filtered.
- Then only annotations matching both status and type are shown.

### Same-Dimension OR Logic

- Given Type = Question or Thought.
- When annotations are filtered.
- Then annotations matching either selected type are shown.

### Tag Include-Any

- Given Tags = `爱情观` and `记忆`.
- When annotations are filtered.
- Then annotations with either tag are shown.

### Clear Filters

- Given filters are active in the current-note sidebar.
- When the user clicks Clear filters.
- Then only the current-note sidebar filters are cleared.
- And cross-note review filters are not changed.

### Session Memory

- Given filters are set in the current-note sidebar.
- When the user switches away and returns during the same Obsidian session.
- Then the current-note sidebar filter state is remembered.
- And after restart, the filters are not restored.

### Keyword Boundary

- Given a keyword appears only in the Markdown body but not in annotation-derived fields.
- When keyword filtering is used.
- Then that annotation is not matched solely by source body text.

## Markdown Draft Copy

### Copy Current Filtered Results

- Given filters show three annotations.
- When the user clicks Copy draft.
- Then the clipboard receives a Markdown draft containing those three annotations.

### Group By Source Document

- Given filtered results come from two source documents.
- When the draft is copied.
- Then output groups entries under each source document.

### Include Annotation Status

- Given filtered results include active, resolved, and orphaned annotations.
- When the draft is copied.
- Then each entry includes its status.

### Empty Draft

- Given filters match no annotations.
- When the user clicks Copy draft.
- Then no empty draft is copied.
- And the UI shows the confirmed no-annotations-to-copy message.

### Clipboard Failure

- Given clipboard write fails.
- When the user clicks Copy draft.
- Then the UI shows the confirmed copy-failed message.
- And no source documents are mutated.

## Undecided Items

No open decisions for the test cases.
