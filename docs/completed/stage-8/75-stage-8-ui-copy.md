# Stage 8: UI Copy

Status: Confirmed

## Scope

This document defines the core wording for `0.8.0`.

Stage 8 separates visual marks from written notes, so user-facing copy must keep these concepts distinct.

## Concept Names

| Concept | Chinese | English | Meaning |
| --- | --- | --- | --- |
| Visual mark | 标记 | Mark | Highlight, underline, or strikethrough. |
| Written note | 备注 | Note | User-written text attached to the selected source text. |
| Whole record | 批注 | Annotation | Anchor plus optional mark plus optional note. |
| No visible mark | 无标记 | No visible mark | A note-only annotation. |
| Has note | 有备注 | Has note | Annotation contains non-whitespace note content. |
| No note | 无备注 | No note | Annotation has no note content. |

## Action Labels

| Key | Chinese | English |
| --- | --- | --- |
| Add note | 添加备注 | Add note |
| Edit note | 编辑备注 | Edit note |
| Delete note | 删除备注 | Delete note |
| Add mark | 添加标记 | Add mark |
| Edit mark | 编辑标记 | Edit mark |
| Remove mark | 移除标记 | Remove mark |
| Delete annotation | 删除批注 | Delete annotation |

## Modal Labels

| Surface | Chinese | English |
| --- | --- | --- |
| Advanced create title | 新建批注 | Create annotation |
| Mark field | 标记 | Mark |
| Color field | 颜色 | Color |
| Initial note field | 初始备注（可选） | Initial note (optional) |
| Create button | 创建 | Create |
| Cancel button | 取消 | Cancel |
| Invalid create notice | 请添加备注或选择标记 | Add a note or choose a mark |

## Filter Labels

| Filter | Chinese | English |
| --- | --- | --- |
| Visual mark filter | 标记 | Mark |
| Note state filter | 备注状态 | Note state |
| Has note option | 有备注 | Has note |
| No note option | 无备注 | No note |
| No visible mark option | 无标记 | No visible mark |

## Removed Copy

Do not use the phrase `批注类型 / Annotation type` in `0.8.0` user-facing UI.

Do not show fixed type labels:

- `摘录 / Excerpt`
- `问题 / Question`
- `想法 / Thought`
- `任务 / Task`

These translations do not need to remain as user-facing copy. Raw `annotationType` values may still exist in compatibility data, but they should not be translated or shown in the UI.

## Wording Rule

Use:

- `标记 / Mark` for visual presentation.
- `备注 / Note` for written user content.
- `批注 / Annotation` for the whole stored item.

Avoid using `批注` when the UI means only note content.
