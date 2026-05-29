# Stage 5: UI Copy

Status: Confirmed

This document defines user-facing copy for `0.5.0`. All visible text should go through the translation layer where practical.

## Settings Section

| Key | zh-CN | en |
| --- | --- | --- |
| `maintenance.title` | 数据维护 | Data maintenance |
| `maintenance.export.title` | 导出 | Export |
| `maintenance.import.title` | 导入 | Import |
| `maintenance.health.title` | 健康检查 | Health check |
| `maintenance.repair.title` | 修复工具 | Repair tools |

## Export

| Key | zh-CN | en |
| --- | --- | --- |
| `export.currentNote` | 导出当前文档批注 | Export current note annotations |
| `export.selectedNotes` | 导出所选文档批注 | Export selected note annotations |
| `export.allSidecars` | 导出全部批注数据 | Export all annotation data |
| `export.format.json` | JSON | JSON |
| `export.format.markdown` | Markdown | Markdown |
| `export.success` | 批注已导出 | Annotations exported |
| `export.failed` | 批注导出失败 | Failed to export annotations |

## Import

| Key | zh-CN | en |
| --- | --- | --- |
| `import.chooseFile` | 选择导入文件 | Choose import file |
| `import.preview` | 预览导入 | Preview import |
| `import.confirm` | 确认导入 | Confirm import |
| `import.restoreOriginalPath` | 按原路径恢复 | Restore to original path |
| `import.intoCurrentNote` | 导入到当前文档 | Import into current note |
| `import.invalidFile` | 只能导入 JSON 导出文件 | Only JSON export files can be imported |
| `import.success` | 批注已导入 | Annotations imported |
| `import.failed` | 批注导入失败 | Failed to import annotations |

## Health Check

| Key | zh-CN | en |
| --- | --- | --- |
| `health.runCurrentNote` | 检查当前文档 | Check current note |
| `health.runSelectedNotes` | 检查所选文档 | Check selected notes |
| `health.runAllSidecars` | 检查全部批注数据 | Check all annotation data |
| `health.overview` | 总览 | Overview |
| `health.categories` | 问题分类 | Issue categories |
| `health.details` | 问题明细 | Issue details |
| `health.severity.error` | 错误 | Error |
| `health.severity.warning` | 警告 | Warning |
| `health.severity.info` | 提示 | Info |

## Repair

| Key | zh-CN | en |
| --- | --- | --- |
| `repair.orphaned` | 修复失联批注 | Repair orphaned annotation |
| `repair.duplicates` | 处理重复批注 | Handle duplicate annotations |
| `repair.rebindToSelection` | 重新绑定到当前选区 | Rebind to current selection |
| `repair.previewChange` | 预览更改 | Preview change |
| `repair.confirmChange` | 确认更改 | Confirm change |
| `repair.keepAll` | 保留全部 | Keep all |
| `repair.mergeComments` | 合并备注 | Merge comments |
| `repair.deleteSelected` | 删除所选重复项 | Delete selected duplicates |

## Copy Rules

- Use short labels for buttons and clear descriptions for dangerous actions.
- Do not expose internal fields such as hash, offset, schema version, or cache key in normal UI.
- Mention backup, preview, and confirmation where the user is about to mutate data.
- English copy should be direct and functional.
