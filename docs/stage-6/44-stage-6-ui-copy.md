# Stage 6: UI Copy

Status: Confirmed

This document defines user-facing copy for `0.6.0`. All visible text should go through the translation layer where practical.

## Language Policy

- Supported languages: Simplified Chinese and English.
- Default behavior: follow Obsidian locale.
- Fallback: English.
- Chinese wording is the source intent.

## Copy Principles

- Keep creation actions short.
- Use tooltips for compact buttons or icon-only buttons.
- Do not expose internal implementation words such as sidecar, schema, anchor hash, offset, or cache key in normal UI.
- Do not use wording that implies automatic summary, automatic distillation, or AI generation.
- English copy should be direct and functional.

## Annotation Type Labels

Status: Confirmed

| Key | zh-CN | en |
| --- | --- | --- |
| `annotationType.excerpt` | 摘录 | Excerpt |
| `annotationType.question` | 问题 | Question |
| `annotationType.thought` | 想法 | Thought |
| `annotationType.task` | 任务 | Task |
| `annotationType.placeholder` | 类型 | Type |
| `annotationType.defaultTooltip` | 未选择时默认为摘录 | Defaults to Excerpt when unchanged |

## Tag Editor

Status: Confirmed

| Key | zh-CN | en |
| --- | --- | --- |
| `tags.label` | 标签 | Tags |
| `tags.placeholder` | 添加标签 | Add tag |
| `tags.empty` | 无标签 | No tags |
| `tags.remove` | 删除标签 | Remove tag |
| `tags.autocompleteEmpty` | 没有可补全的标签 | No tag suggestions |

## Filters

Status: Confirmed

| Key | zh-CN | en |
| --- | --- | --- |
| `filter.status.all` | 全部状态 | All statuses |
| `filter.type.all` | 全部类型 | All types |
| `filter.tags.all` | 全部标签 | All tags |
| `filter.color.all` | 全部颜色 | All colors |
| `filter.keyword.placeholder` | 搜索批注 | Search annotations |
| `filter.clear` | 清空筛选 | Clear filters |
| `filter.noMatches` | 没有符合筛选条件的批注 | No matching annotations |

## Markdown Draft Action

Status: Confirmed

| Key | zh-CN | en |
| --- | --- | --- |
| `draft.copy` | 复制草稿 | Copy draft |
| `draft.copyTooltip` | 复制当前筛选结果为 Markdown 草稿 | Copy current filtered results as a Markdown draft |
| `draft.copied` | 草稿已复制 | Draft copied |
| `draft.copyFailed` | 草稿复制失败 | Failed to copy draft |
| `draft.empty` | 没有可复制的批注 | No annotations to copy |

## Markdown Draft Output Labels

Status: Confirmed

| Key | zh-CN | en |
| --- | --- | --- |
| `draftOutput.title` | 批注草稿 | Annotation draft |
| `draftOutput.source` | 来源 | Source |
| `draftOutput.status` | 状态 | Status |
| `draftOutput.type` | 类型 | Type |
| `draftOutput.tags` | 标签 | Tags |
| `draftOutput.color` | 颜色 | Color |
| `draftOutput.text` | 原文 | Source text |
| `draftOutput.note` | 备注 | Note |
| `draftOutput.position` | 位置 | Position |

## Copy Rules

- `复制草稿 / Copy draft` means copying raw annotation material, not generating a summary.
- `标签 / Tags` means plugin annotation metadata, not Obsidian native tags.
- `任务 / Task` is only an annotation type label; it does not imply task management.
- `清空筛选 / Clear filters` resets the current surface only.

## Undecided Items

No open decisions for UI copy in the first version.
