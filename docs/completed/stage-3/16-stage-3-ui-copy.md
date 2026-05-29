# Stage 3: UI Copy

Status: Confirmed

## Goal

Define final `0.3.0` sidebar UI labels, button text, tooltips, and empty states.

Use short visible labels in the sidebar. Put explanations in tooltips where needed.

## Status Labels

- `活动`
- `已解决`
- `失联`

## Display Mode Labels

- `普通`
- `紧凑`

Settings labels:

- `侧边栏显示模式`
- `显示已解决批注`

## Filter Labels

Search placeholder:

- `搜索批注`

Filter controls:

- `全部状态`
- `全部颜色`
- `全部类型`
- `清除筛选`

Status filter options:

- `全部`
- `活动`
- `已解决`
- `失联`

Annotation type filter options:

- `全部`
- `高亮`
- `下划线`
- `删除线`
- `评论`

## Card Action Labels

Short visible labels:

- `绑`
- `调`

Tooltips:

- `重新绑定到当前选区`
- `调整到当前选区`
- `跳转到正文`
- `编辑批注`
- `保存批注`
- `取消编辑`
- `标记为已解决`
- `恢复为活动批注`
- `删除批注`

## Empty States

- `当前文档还没有批注`
- `没有符合筛选条件的批注`
- `已解决批注已隐藏`
- `当前视图暂不支持正文批注`

Empty state actions:

- `清除筛选`
- `显示已解决`

## Copy Rules

- Prefer short visible labels.
- Use icon buttons or short labels in dense sidebar controls.
- Put longer explanations in tooltips.
- Do not expose internal offset, line, column, schema, or sidecar terminology in normal UI.
- Keep status and action wording consistent between normal mode and compact mode.
- Keep sidebar controls and plugin settings labels consistent when they control the same preference.
