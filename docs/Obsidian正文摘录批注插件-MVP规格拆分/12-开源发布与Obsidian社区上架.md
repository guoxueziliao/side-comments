# 12-开源发布与 Obsidian 社区上架

## 目标

插件未来需要：

- GitHub 开源
- 发布 GitHub Release
- 上架 Obsidian 社区插件市场

因此从 MVP 开始就要按可发布插件标准组织工程和文档。

## 插件 ID

插件 ID 必须稳定，后续不能随意修改。

建议：

```json
{
  "id": "side-comments"
}
```

说明：

- ID 应该简短、稳定、可读。
- ID 会影响插件安装目录。
- 上架后改 ID 等同于另一个插件，应避免。

## 插件名称

建议暂定：

```json
{
  "name": "Side Comments"
}
```

中文语义：

```text
正文批注 / 侧边批注 / 阅读摘录批注
```

README 中可以解释：

> Side Comments is a non-invasive side annotation and reading excerpt plugin for Obsidian Markdown notes.

## manifest.json

MVP manifest 示例：

```json
{
  "id": "side-comments",
  "name": "Side Comments",
  "version": "0.1.0",
  "minAppVersion": "1.5.0",
  "description": "Non-invasive side comments and reading annotations for Obsidian Markdown notes.",
  "author": "TBD",
  "authorUrl": "TBD",
  "isDesktopOnly": false
}
```

说明：

- `id` 发布后不随意修改。
- `version` 遵循语义化版本。
- `description` 明确是 Markdown notes，不写 PDF。
- `isDesktopOnly` 是否为 false 需要开发验证移动端表现；如果移动端未验证，第一版可以设为 true 或在 README 明确限制。

## GitHub 仓库结构

建议标准结构：

```text
side-comments/
  manifest.json
  versions.json
  package.json
  package-lock.json
  tsconfig.json
  esbuild.config.mjs
  main.ts
  styles.css
  README.md
  LICENSE
  CHANGELOG.md
  CONTRIBUTING.md
  src/
```

发布产物：

```text
main.js
manifest.json
styles.css
```

Obsidian 用户安装时只需要发布产物。

## 许可证

建议使用 MIT License。

原因：

- Obsidian 社区常见。
- 对用户和贡献者友好。
- 方便二次开发和审查。

需要仓库根目录包含：

```text
LICENSE
```

## README 必须说明

README 至少包含：

- 插件定位
- 功能截图，后续补
- 安装方式
- 使用方式
- 数据存储位置
- 隐私说明
- 已知限制
- 大库性能原则
- 版本迁移策略

必须明确：

```text
This plugin does not modify your Markdown content.
```

必须说明数据位置：

```text
.obsidian-side-comments/
```

必须说明 MVP 限制：

- 只支持 Markdown 正文批注。
- 不支持 PDF。
- 不支持 AI。
- 不支持多人协作。
- 不支持全库筛选。
- 不启动扫描全库。

## 隐私声明

插件处理用户正文和批注，因此必须有清晰隐私声明。

建议 README 中写：

```text
Side Comments does not upload, sync, collect, or transmit your notes or annotation data.
All annotation data is stored locally in your vault under `.obsidian-side-comments/`.
```

中文说明：

```text
插件不上传、不同步、不收集任何笔记内容或批注数据。
所有批注数据只保存在本地 vault 的 `.obsidian-side-comments/` 目录中。
```

MVP 不联网。

如果未来加入任何联网能力，必须：

- 单独说明。
- 默认关闭。
- 明确用户授权。
- 更新 README 和隐私说明。

## 数据兼容承诺

开源后要明确：

- sidecar 数据是用户资产。
- sidecar 带 `schemaVersion`。
- 插件使用 lazy migration。
- 读到哪个 sidecar，迁移哪个 sidecar。
- 不启动全库迁移。
- 支持向前迁移。
- 不支持降级兼容。

建议 README 文案：

```text
Annotation files include a `schemaVersion`. Newer plugin versions migrate older sidecar files lazily when they are opened. Downgrading to older plugin versions is not guaranteed to read newer schemas correctly.
```

## Obsidian 社区插件上架准备

需要准备：

- GitHub 公共仓库。
- `manifest.json`。
- `versions.json`。
- `main.js`。
- `styles.css`。
- GitHub Release。
- README。
- LICENSE。
- 明确插件描述。
- 无混淆恶意代码。
- 无未说明的数据上传。

发布 release 时至少附带：

```text
main.js
manifest.json
styles.css
```

## versions.json

示例：

```json
{
  "0.1.0": "1.5.0"
}
```

含义：

- 插件版本 `0.1.0`
- 最低 Obsidian 版本 `1.5.0`

## 语义化版本

版本建议：

| 版本类型 | 场景 |
|---|---|
| patch | bug fix，不改数据结构 |
| minor | 新功能，兼容旧数据 |
| major | 破坏性变更或重大数据 schema 变化 |

MVP 初始版本：

```text
0.1.0
```

## CHANGELOG

建议维护：

```text
CHANGELOG.md
```

每个版本记录：

- 新增
- 修改
- 修复
- 数据迁移
- 已知问题

如果版本包含 schema migration，必须在 changelog 中说明。

## CONTRIBUTING 贡献边界

建议建立：

```text
CONTRIBUTING.md
```

第一阶段明确不接受或暂缓：

- AI 功能
- PDF 功能
- 云同步
- 多人协作
- 全库扫描式功能
- 大型富文本编辑器
- 会污染 Markdown 正文的方案

贡献优先级：

1. 数据安全
2. 不污染 Markdown
3. 当前文档体验
4. 大库性能
5. 锚点恢复可靠性
6. UI 打磨

## GitHub Issue 模板建议

建议后续添加：

```text
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
```

Bug report 应要求提供：

- Obsidian 版本
- 插件版本
- 操作系统
- 是否启用 Live Preview / Reading View
- 是否发生 sidecar 迁移
- 是否能提供脱敏 Markdown 片段

## GitHub Release 检查清单

发布前检查：

- `npm run build` 成功。
- `main.js` 生成。
- `manifest.json` 版本号正确。
- `versions.json` 已更新。
- `styles.css` 包含必要样式。
- README 已更新。
- CHANGELOG 已更新。
- release 附件包含 `main.js`、`manifest.json`、`styles.css`。
- 手动安装到测试 vault 可启用。
- 创建批注不会修改 Markdown 正文。
- `.obsidian-side-comments/` 数据正常写入。

## 社区上架前验收

上架前必须验证：

- 空 vault 可正常启用。
- 普通 Markdown 文档可创建批注。
- 关闭插件后 Markdown 正文保持干净。
- 删除插件后 `.obsidian-side-comments/` 数据仍保留。
- 不联网。
- 不收集遥测。
- 不扫描全库。
- 没有明显性能问题。

