# Stage 9: UI Copy And Labels

Status: Confirmed

## Scope

This document defines the final UI copy and button naming direction for `0.9.0`.

The goal is to keep sidebar, cards, toolbar, More panel, filters, settings, and notices consistent in Simplified Chinese and English.

## Core Direction

Stage 9 should use one shared vocabulary across the plugin.

Rules:

- Use the Stage 8 mark/note model consistently.
- Do not reintroduce fixed user-facing annotation types.
- Keep compact surfaces short.
- Use tooltips for icon-only buttons.
- Keep Chinese and English labels aligned by meaning, not literal word order.

The copy should help users act quickly without reading a manual.

## Core Terms

Use these terms consistently.

| Concept | Simplified Chinese | English |
| --- | --- | --- |
| Whole item | 标注 | Annotation |
| Visual mark | 标记 | Mark |
| Written text | 备注 | Note |
| User label | 标签 | Tag |
| Highlight | 高亮 | Highlight |
| Underline | 下划线 | Underline |
| Strikethrough | 删除线 | Strikethrough |
| Resolved state | 已解决 | Resolved |
| Orphaned state | 失联 | Orphaned |
| Rebind action | 重新绑定 | Rebind |
| Adjust range action | 调整范围 | Adjust range |

Rules:

- `标注 / Annotation` means the whole anchor plus optional mark plus optional note.
- `标记 / Mark` means the visual treatment applied to source text.
- `备注 / Note` means the user's written note.
- Do not use `批注类型` as a visible category label.

## Removed User-Facing Terms

These terms should not appear as user-selectable classification options:

- `批注类型 / Annotation type`;
- `摘录 / Excerpt`;
- `问题 / Question`;
- `想法 / Idea`;
- `任务 / Task`.

They may still appear only in compatibility code, legacy JSON fields, internal comments, or migration notes when necessary.

If old data contains these values, UI should not present them as the current model.

## Sidebar Labels

Recommended sidebar labels:

- `暂无标注 / No annotations`;
- `没有匹配的标注 / No matching annotations`;
- `正在加载标注 / Loading annotations`;
- `当前文档暂不支持标注 / Annotations are not supported here`;
- `正文标记已隐藏 / Source marks are hidden`.

Rules:

- Keep count display numeric where possible, such as `5 / 12`.
- Avoid long sidebar headings.
- Avoid repeating the plugin name inside the sidebar.

## Card Action Labels

Use short labels for card actions.

Recommended direct or menu labels:

- `编辑备注 / Edit note`;
- `添加备注 / Add note`;
- `编辑标记 / Edit mark`;
- `编辑标签 / Edit tags`;
- `标为已解决 / Mark resolved`;
- `恢复 / Restore`;
- `重新绑定 / Rebind`;
- `调整范围 / Adjust range`;
- `删除 / Delete`;
- `更多 / More`.

Rules:

- Keep dangerous actions in menus when possible.
- Use confirmation copy for destructive actions.
- Do not add a separate jump button; card click handles navigation.
- Tooltips may be more descriptive than visible labels.

## Selection Toolbar Labels

The selection toolbar should be icon-led.

Recommended tooltips: `高亮 / Highlight`, `下划线 / Underline`, `删除线 / Strikethrough`, and `更多 / More`.

Rules:

- Visible labels can be omitted when icons are clear.
- Icon-only buttons must have localized tooltips.
- Do not show `摘录 / 问题 / 想法 / 任务` in the toolbar.
- More opens optional note, mark, color, and tag fields.

## More Panel Labels

Recommended More panel labels:

- `备注 / Note`;
- `标记 / Mark`;
- `颜色 / Color`;
- `标签 / Tags`;
- `保存 / Save`;
- `取消 / Cancel`;
- `删除 / Delete`.

Rules:

- Note can be empty.
- Mark can be optional if the model allows note-only annotations.
- Field labels should stay short.
- Longer explanations should be helper text, not field names.

## Filter Labels

Recommended filter labels:

- `状态 / Status`;
- `标记 / Mark`;
- `备注状态 / Note state`;
- `关键词 / Keyword`;
- `颜色 / Color`;
- `标签 / Tags`;
- `清除筛选 / Clear filters`.

Rules:

- Use `标记` for visual mark filtering.
- Use `备注状态` for with-note or without-note filtering.
- Do not add `批注类型` as a filter.

## Settings Labels

Settings should reuse the same terms as daily UI.

Recommended group labels: `显示 / Display`, `创建 / Creation`, `侧边栏 / Sidebar`, `数据维护 / Data maintenance`, and `语言 / Language`.

Rules:

- Setting names should be short.
- Descriptions can explain behavior in one sentence.
- Data maintenance labels should remain distinct from normal preferences.

## Notice Copy

Notices should be short and action-oriented.

Recommended patterns: `已保存 / Saved`, `已删除 / Deleted`, `已复制 / Copied`, `当前选区暂不支持标注 / The current selection cannot be annotated`, `请先选择要标注的文字 / Select text to annotate first`, and `重新绑定失败 / Rebind failed`.

Rules:

- Avoid long technical explanations in notices.
- Put detailed error information in logs or expanded views if needed.
- Notices should not mention storage internals.

## Review Requirement

Before `0.9.0` release, review all i18n keys touched by Stage 9.

Checks:

- no visible fixed annotation type labels;
- consistent `标注 / Annotation`;
- consistent `标记 / Mark`;
- consistent `备注 / Note`;
- icon-only buttons have tooltips;
- destructive labels have confirmation copy;
- English labels fit compact surfaces.

## Out Of Scope

- Full copywriting rewrite of older docs.
- User-customizable terminology.
- Reintroducing annotation type classification.
- Adding new languages beyond the current language support scope.
- Adding AI-generated text suggestions.
