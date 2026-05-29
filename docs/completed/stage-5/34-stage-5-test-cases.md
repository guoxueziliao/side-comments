# Stage 5: Test Cases

Status: Confirmed

These are concrete test cases for `0.5.0`.

## Entry Points

### Settings page structure

Setup:

- Open plugin settings.

Expected:

- `数据维护` section is visible;
- the order is Export, Import, Data Health Check, Repair Tools.

### Sidebar scope

Setup:

- Open a note with annotations.

Expected:

- sidebar provides only lightweight current-note export actions;
- sidebar does not expose full-vault export or import actions.

## Export

### Current note export

Setup:

- Open a note with annotations.
- Export the current note as JSON.

Expected:

- export file is created;
- JSON contains export format identifier and version;
- current note annotations are included.

### Selected note export

Setup:

- Select multiple notes.
- Export selected notes.

Expected:

- only selected notes are included;
- non-selected notes are not included.

### Markdown export readability

Setup:

- Export a note as Markdown.

Expected:

- the output is readable by a person;
- internal fields such as hash, offset, line, column, and cache keys are not shown.

## Import

### JSON import preview

Setup:

- Open a valid JSON export file.
- Start import.

Expected:

- preview appears before writing;
- no sidecar is modified before confirmation.

### Import backup

Setup:

- Import into a note with an existing sidecar.

Expected:

- target sidecar is backed up before changes are written.

### Markdown import rejection

Setup:

- Try to import a Markdown export file.

Expected:

- import is rejected;
- no data is written.

## Health Check

### Read-only report

Setup:

- Run health check on a note with known issues.

Expected:

- report is produced;
- no data is changed.

### Scope checks

Setup:

- Run health check for current note, selected notes, and all sidecar metadata.

Expected:

- each scope runs successfully;
- no recent-cache scope is offered.

## Repair Tools

### Orphaned repair

Setup:

- Open an orphaned annotation repair entry.

Expected:

- source document opens;
- user can choose a new target selection;
- preview appears;
- repair only happens after confirmation.

### Duplicate handling

Setup:

- Open a duplicate annotation group.

Expected:

- group members are listed clearly;
- user can keep all, merge, or delete selected items;
- change is previewed before writing.

## Safety

### No silent destructive change

Setup:

- Trigger any mutation flow.

Expected:

- preview and confirmation are required;
- automatic destructive cleanup does not occur.
