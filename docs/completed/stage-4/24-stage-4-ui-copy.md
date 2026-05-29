# Stage 4: UI Copy

Status: Confirmed

This document defines user-facing copy for `0.4.0`. All visible text should go through the translation layer where practical.

## Language Policy

- Supported languages: Simplified Chinese and English.
- Default behavior: follow Obsidian locale.
- Fallback: English.
- Chinese wording is the source intent.

## Cross-Note Review Page

### View Title

| Key | zh-CN | en |
| --- | --- | --- |
| `crossNote.title` | 批注总览 | Annotation Overview |
| `crossNote.subtitle` | 最近批注 | Recent annotations |

### Search And Filters

| Key | zh-CN | en |
| --- | --- | --- |
| `crossNote.search.placeholder` | 搜索批注 | Search annotations |
| `filter.status.all` | 全部状态 | All statuses |
| `filter.status.active` | 活动 | Active |
| `filter.status.resolved` | 已解决 | Resolved |
| `filter.status.orphaned` | 失联 | Orphaned |
| `filter.color.all` | 全部颜色 | All colors |
| `filter.type.all` | 全部类型 | All types |
| `filter.source.placeholder` | 来源文档 | Source document |
| `filter.clear` | 清除筛选 | Clear filters |

### Annotation Types

| Key | zh-CN | en |
| --- | --- | --- |
| `type.highlight` | 高亮 | Highlight |
| `type.underline` | 下划线 | Underline |
| `type.strike` | 删除线 | Strikethrough |
| `type.comment` | 评论 | Comment |

### Result Actions

| Key | zh-CN | en |
| --- | --- | --- |
| `action.openSource` | 打开文档 | Open source |
| `action.jumpToText` | 跳转到正文 | Jump to text |
| `action.revealCard` | 定位卡片 | Reveal card |

Direct mutation actions such as edit, delete, resolve, restore, rebind, and adjust range should not appear in the cross-note review page in the first release.

## One-Click Hide Marks

| Key | zh-CN | en |
| --- | --- | --- |
| `marks.hide` | 隐藏标注 | Hide marks |
| `marks.show` | 显示标注 | Show marks |
| `marks.toggleCommand` | 切换正文批注标记显示 | Toggle annotation marks |
| `marks.hiddenNotice` | 正文标注已隐藏 | Annotation marks hidden |
| `marks.visibleNotice` | 正文标注已显示 | Annotation marks visible |
| `marks.createDisabled` | 请先显示标注，再新建批注 | Show marks before creating an annotation |

## Empty States

| Key | zh-CN | en |
| --- | --- | --- |
| `empty.crossNote.noRecent` | 还没有最近批注 | No recent annotations |
| `empty.crossNote.noMatches` | 没有符合筛选条件的批注 | No matching annotations |
| `empty.crossNote.recentUnavailable` | 最近批注暂不可用 | Recent annotations unavailable |
| `empty.crossNote.readFailed` | 批注数据读取失败 | Failed to read annotation data |

## Settings

| Key | zh-CN | en |
| --- | --- | --- |
| `settings.language.name` | 界面语言 | Interface language |
| `settings.language.desc` | 默认跟随 Obsidian 语言，不支持时使用英文。 | Follows the Obsidian language by default and falls back to English when unsupported. |
| `settings.language.auto` | 跟随 Obsidian | Follow Obsidian |
| `settings.language.zh` | 简体中文 | Simplified Chinese |
| `settings.language.en` | English | English |

Manual language override is not yet confirmed. These strings are reserved in case the setting is added during implementation.

## Existing Short Labels

These labels must also move through the translation layer.

| Key | zh-CN | en |
| --- | --- | --- |
| `action.rebind.short` | 绑 | Bind |
| `action.adjust.short` | 调 | Adjust |
| `action.rebind.tooltip` | 重新绑定到当前选区 | Rebind to current selection |
| `action.adjust.tooltip` | 调整到当前选区 | Adjust to current selection |

## Copy Rules

- Prefer short labels in buttons.
- Use tooltips for action meaning when the visible label is short.
- Do not expose internal implementation words such as sidecar, hash, offset, schema, or cache key in normal UI.
- Error text should describe what the user can do next when possible.
- English copy should be functional and direct, not marketing-oriented.
