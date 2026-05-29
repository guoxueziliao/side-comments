# Stage 6: Annotation Tags

Status: Confirmed

## Goal

Add optional user-defined tags so annotations can be grouped across notes by user meaning, not only by fixed type, status, color, or document position.

## Version Boundary

Annotation tags are planned as part of `0.6.0`.

Tags are the second confirmed organization dimension after annotation type.

## Confirmed Direction

Tags should be a lightweight supplement to annotation type.

Each annotation can have multiple tags. Tags should help users filter and review related annotations across the current note and cross-note review views.

## Relationship To Type

Type is fixed and single-choice:

- Excerpt.
- Question.
- Thought.
- Task.

Tags are user-defined and multi-choice:

- `爱情观`
- `记忆`
- `亲密关系`
- `写作素材`
- `需追问`

## Initial Behavior

- Tags are saved in annotation metadata.
- Tags are not automatically written into the Markdown body.
- Tags are not automatically synchronized with Obsidian native `#tag` metadata.
- The user can add, remove, and filter by tags.
- Tags can be used together with status, type, color, and keyword filters.
- Tags are edited from the sidebar card in the first version.
- The creation floating toolbar should not include tag input in `0.6.0`.

The sidebar tag editor should be lightweight:

```text
Tags: [爱情观 x] [记忆 x] [亲密关系 x]  Add tag...
```

- Enter adds a tag.
- `x` removes a tag.
- No separate tag management page in `0.6.0`.

Tag filtering should use include-any logic in the first version.

- If the user selects multiple tags, an annotation matches when it has any one of those tags.
- `0.6.0` should not require an annotation to contain every selected tag.
- Exclude logic is not part of the first version.
- Combined filter behavior is tracked in `42-stage-6-annotation-filters.md`.

Tag input should support autocomplete from already-used tags.

- Suggestions should only come from existing annotation tags.
- Autocomplete is not semantic recommendation.
- The plugin should not invent or AI-generate new tag suggestions.

Tag matching should be case-insensitive for English text in the first version.

- `Love` and `love` should be treated as the same tag.
- Display can preserve the original written form, but matching should normalize case.

## Initial Boundary

`0.6.0` should keep tags simple.

The first version should not include:

- a global tag management center;
- automatic tag recommendation;
- AI-generated tags;
- batch tag editing;
- forced normalization of similar tags;
- automatic conversion to Obsidian native tags.

## Product Role

Tags should support:

- collecting related annotations across different notes;
- preparing cleaner review sets;
- finding annotations that share a user-defined theme;
- grouping questions or thoughts before later distillation work.

## Creation Boundary

Tagging belongs to the organization and review phase in the first version.

The creation floating toolbar should stay focused on fast annotation creation. It can include type selection, but it should not include tag entry in `0.6.0`.

## Undecided Items

No open decisions for tag behavior in the first version.
