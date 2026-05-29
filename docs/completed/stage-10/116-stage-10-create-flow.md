# Stage 10: Create Flow

Status: Confirmed

## Scope

This document defines the creation flow for current-document annotations in `0.10.0`.

Creation is the first step of the high-frequency workflow. It determines the initial annotation state, sidebar entry, source feedback, duplicate behavior, and later update path.

## User Goal

The user selects text and quickly turns it into an annotation without thinking about the internal data model.

The flow should answer three questions immediately:

- What did I create?
- Where did it appear?
- Can I keep working without cleaning up duplicate or broken state?

## Entry Points

Supported entry points:

- source mode text selection;
- reading mode text selection.

Unsupported entry points:

- empty selection;
- selection that cannot be mapped to Markdown source;
- non-Markdown files;
- PDF, EPUB, canvas, or other non-Markdown surfaces.

Unsupported entry points should show a clear notice and leave data unchanged.

## Primary Toolbar

The primary selection toolbar is optimized for speed.

Direct buttons:

- highlight;
- underline;
- strikethrough;
- More.

Direct mark buttons create mark-only annotations unless the selected range already has an annotation.

The More button opens the full creation panel.

## More Panel

The More panel supports complete annotation creation.

Fields:

- note;
- mark type;
- color;
- tags.

Allowed outputs:

- mark-only annotation;
- note-only annotation;
- mark-and-note annotation.

Rules:

- The user may create an annotation without a note.
- The user may create a note-only annotation without a visible mark.
- The panel should not expose fixed annotation types such as question, thought, task, or excerpt.
- The panel should not require tags.

## Creation Result

After successful creation:

- store the annotation in the sidecar;
- render the source mark when the annotation has a visible mark;
- add or update the sidebar card;
- keep card order by source position;
- focus the new or updated sidebar card;
- apply temporary feedback to the source target and card.

If the sidebar is closed, creation should still succeed. Opening the sidebar later should show the annotation in the correct position.

## Duplicate Range Behavior

Creating on an existing annotated range should not create accidental duplicates.

Rules:

- Same range plus same source document updates or merges with the existing annotation.
- Direct mark action updates the existing mark type/color when appropriate.
- More panel can add a note, replace a note, update mark, update color, or update tags on the existing annotation.
- If the new selected range overlaps but is not the same range, defer to the duplicate/overlap handling rules in a later Stage 10 decision.

## Filter Interaction

Creation should not appear to fail because filters hide the result.

Rules:

- If active sidebar filters would hide the new or updated annotation, show a clear notice.
- Prefer revealing the new card or offering to clear filters over silently hiding it.
- Do not automatically clear filters unless that behavior is explicitly confirmed later.

## Failure Behavior

Creation must be conservative.

Failure cases:

- no usable selection;
- reading mode selection cannot map back to source;
- sidecar write fails;
- current file is not supported;
- anchor cannot be created with enough confidence.

Expected behavior:

- show a concise notice;
- do not create partial sidecar data;
- do not show a temporary card that is not persisted;
- leave the user's selection and document content unchanged.

## Feedback

Creation feedback should be visible but not noisy.

Expected feedback:

- source mark appears immediately when applicable;
- card appears or updates immediately;
- temporary focus highlight on the source target;
- temporary focus highlight on the sidebar card;
- short notice only for failure or special cases such as hidden-by-filter.

Avoid success toasts for every normal creation because high-frequency use would make them distracting.

## Test Targets

Creation regression should cover:

- source mode highlight;
- source mode underline;
- source mode strikethrough;
- source mode More with note only;
- source mode More with mark and note;
- reading mode highlight;
- reading mode More with note;
- duplicate same-range direct mark update;
- duplicate same-range More update;
- active filters that hide the created annotation;
- unsupported or unmappable selection.

## Next Discussion

The next workflow topic is update flow.

Update flow should define how users edit note, mark, color, tags, range, and status after creation.
