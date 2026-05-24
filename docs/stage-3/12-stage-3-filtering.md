# Stage 3: Filtering

Status: Confirmed

## Goal

Improve current-document filtering without expanding into cross-note search.

## Combined Filters

Stage 3 should improve current-document filtering into combined filters:

- status;
- color;
- annotation type;
- keyword.

This remains current-document filtering only. Cross-note search belongs to Stage 4.

## UI Placement

Place filtering controls at the top of the sidebar.

Recommended layout:

- keep the keyword search input visible at the top;
- place compact filter controls below or beside the keyword input;
- use a segmented control or menu for status;
- use color dots or swatches for color;
- use icon buttons or a menu for annotation type;
- provide a clear filters action.

Filtering should hide comments that do not match. Filtering should not change the underlying document-order sort.

## Empty States

Use clear empty states for current-document sidebar filtering:

- no comments in the current document: `当前文档还没有批注`;
- comments exist but active filters match nothing: `没有符合筛选条件的批注`;
- comments exist but only hidden resolved comments remain: `已解决批注已隐藏`;
- current file or view is unsupported: `当前视图暂不支持正文批注`.

When filters match nothing, show a `清除筛选` action.

When resolved comments are hidden and only resolved comments remain, show a `显示已解决` action.

## Persistence

Filter state should be treated as temporary sidebar session state.

Do not persist filters per document.

Do not let filter settings grow with the number of Markdown files in the vault.

## Acceptance Criteria

- Filters can be combined without switching to cross-note search.
- Filtering does not change the underlying document-order sort.
- Filter controls are available near the top of the sidebar.
- Users can clear active filters quickly.
- Empty states clearly distinguish no comments, no filter matches, hidden resolved comments, and unsupported views.
- Filter state does not create per-document settings data.
