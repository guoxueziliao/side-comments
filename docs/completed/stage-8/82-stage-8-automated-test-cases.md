# Stage 8 Automated Test Cases

Status: Confirmed

These cases cover unit and integration checks for `0.8.0`.

## Unit Tests: Data Interpretation

### T-DI-1: Legacy Annotation Type Is Inert

1. Build an annotation object with `annotationType: "question"`.
2. Interpret it through the Stage 8 product-state helper.
3. Confirm the result does not expose annotation type as a display field or filter field.
4. Confirm the raw value can still remain on the stored object for JSON compatibility.

### T-DI-2: Note Mark With Content

1. Build an annotation object with `mark.type = "note"` and non-empty note content.
2. Interpret it through the product-state helper.
3. Confirm the result is note-only.
4. Confirm the result has no visible mark.

### T-DI-3: Note Mark Without Content

1. Build an annotation object with `mark.type = "note"` and empty note content.
2. Interpret it through the product-state helper.
3. Confirm the result is invalid empty annotation data.
4. Confirm health-check input can report it.

### T-DI-4: Visual Mark Without Note

1. Build highlight, underline, and strikethrough annotations with empty note content.
2. Interpret each object.
3. Confirm each result is mark-only.

### T-DI-5: Visual Mark With Note

1. Build highlight, underline, and strikethrough annotations with non-empty note content.
2. Interpret each object.
3. Confirm each result is mark-and-note.

## Unit Tests: State Transitions

### T-ST-1: Mark-Only Add Note

1. Start with a mark-only annotation.
2. Add note content.
3. Confirm the same annotation becomes mark-and-note.

### T-ST-2: Note-Only Add Mark

1. Start with a note-only annotation.
2. Add a visible mark.
3. Confirm the same annotation becomes mark-and-note.

### T-ST-3: Mark-And-Note Remove Mark

1. Start with a mark-and-note annotation.
2. Remove the visible mark.
3. Confirm the annotation becomes note-only.

### T-ST-4: Mark-And-Note Delete Note

1. Start with a mark-and-note annotation.
2. Delete note content.
3. Confirm the annotation becomes mark-only.

### T-ST-5: Last Remaining Content Is Removed

1. Remove mark from a mark-only annotation.
2. Delete note from a note-only annotation.
3. Confirm both operations delete the whole annotation after confirmation where needed.
4. Confirm neither operation persists an annotation with no visible mark and no note.

## Unit Tests: Filters

### T-FLT-1: Visual Mark Filter

1. Build a mixed list with highlight, underline, strikethrough, and note-only annotations.
2. Filter by each visual mark option.
3. Confirm `No visible mark` returns note-only annotations.

### T-FLT-2: Note State Filter

1. Build mark-only, note-only, and mark-and-note annotations.
2. Filter by `Has note`.
3. Confirm note-only and mark-and-note are returned.
4. Filter by `No note`.
5. Confirm mark-only is returned.

### T-FLT-3: Keyword Filter

1. Build annotations with selected text, note content, tags, and source path values.
2. Search matching keywords in annotation-derived fields.
3. Confirm matches are returned.
4. Search text that exists only in the Markdown body outside annotations.
5. Confirm it is not returned.

### T-FLT-4: No Annotation Type Filter

1. Load filter defaults.
2. Confirm annotation type is not a filter dimension.
3. Confirm stale saved annotation type settings do not break filter initialization.

## Integration Tests: Import, Export, And Draft Copy

### T-IO-1: JSON Export Preserves Legacy Field

1. Use a sidecar containing legacy `annotationType`.
2. Export JSON.
3. Confirm the exported JSON preserves `annotationType` where it existed.

### T-IO-2: JSON Import Accepts Legacy Field

1. Import a JSON package containing `annotationType`.
2. Confirm import succeeds.
3. Confirm the UI does not show annotation type after import.

### T-IO-3: Markdown Export Omits Annotation Type

1. Export a note as Markdown.
2. Confirm output contains selected text, note content, tags, source, and mark information where applicable.
3. Confirm output does not contain fixed annotation type labels or values.

### T-IO-4: Draft Copy Excludes Mark-Only

1. Build a filtered result containing mark-only, note-only, and mark-and-note annotations.
2. Copy Markdown draft.
3. Confirm note-only and mark-and-note entries are included.
4. Confirm mark-only entries are excluded.
