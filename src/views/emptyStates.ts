export const EMPTY_STATES = {
  noMarkdownFile: "打开一篇 Markdown 笔记后，可以在这里管理正文批注",
  noComments: "选中正文后添加高亮、下划线、删除线或评论",
  noMatches: "没有匹配的批注",
  readFailed: "批注数据读取失败，请检查 `.obsidian-side-comments/`",
  orphaned: "有批注找不到原文位置，仍保留在列表底部"
} as const;
