import type { CommentDraft, SideComment, SideCommentStatus } from "../types";

export interface CommentCardContext {
  expanded: boolean;
  editing: boolean;
  flash: boolean;
  draft: CommentDraft;
  onToggleExpand: (commentId: string) => void;
  onBeginEdit: (commentId: string) => void;
  onCancelEdit: (commentId: string) => void;
  onSave: (commentId: string, draft: CommentDraft) => void;
  onDelete: (commentId: string) => void;
  onToggleStatus: (commentId: string, status: SideCommentStatus) => void;
  onJump: (commentId: string) => void;
  onDraftChange: (commentId: string, draft: CommentDraft) => void;
}

export function renderCommentCard(
  container: HTMLElement,
  comment: SideComment,
  context: CommentCardContext
): HTMLDivElement {
  const card = container.createDiv({
    cls: [
      "side-comments-card",
      `side-comments-card--${comment.status}`,
      context.expanded ? "is-expanded" : "",
      context.flash ? "side-comments-card--flash" : ""
    ].filter(Boolean)
  });
  card.dataset.commentId = comment.id;

  const header = card.createDiv({ cls: "side-comments-card-header" });
  const meta = header.createDiv({ cls: "side-comments-card-meta" });
  meta.createSpan({ text: `${markLabel(comment.mark.type)} · ${comment.mark.color}` });
  meta.createSpan({ text: ` · ${statusLabel(comment.status)}` });
  meta.createSpan({ text: ` · ${formatTime(comment.note.updatedAt)}` });

  const headerActions = header.createDiv({ cls: "side-comments-card-header-actions" });
  createActionButton(headerActions, context.expanded ? "收" : "展", context.expanded ? "收起" : "展开", () => {
    context.onToggleExpand(comment.id);
  });
  createActionButton(headerActions, "跳", "跳回原文", () => {
    context.onJump(comment.id);
  });
  createActionButton(headerActions, context.editing ? "存" : "编", context.editing ? "保存" : "编辑", () => {
    if (context.editing) {
      context.onSave(comment.id, context.draft);
    } else {
      context.onBeginEdit(comment.id);
    }
  });
  createActionButton(headerActions, comment.status === "active" ? "完" : "开", comment.status === "active" ? "已处理" : "重新打开", () => {
    if (comment.status === "orphaned") {
      return;
    }
    context.onToggleStatus(comment.id, comment.status === "active" ? "resolved" : "active");
  }, comment.status === "orphaned");
  createActionButton(headerActions, "删", "删除", () => {
    context.onDelete(comment.id);
  });

  const body = card.createDiv({ cls: "side-comments-card-body" });
  if (!context.expanded) {
    body.addClass("is-collapsed");
  }

  body.createDiv({ cls: "side-comments-card-section-title", text: "原文" });
  body.createDiv({
    cls: "side-comments-card-excerpt",
    text: comment.anchor.selectedText || "(empty selection)"
  });

  body.createDiv({ cls: "side-comments-card-section-title", text: "批注" });
  if (context.editing) {
    renderEditFields(body, comment, context);
  } else {
    body.createDiv({
      cls: "side-comments-card-note",
      text: comment.note.content || "未填写批注"
    });
  }

  if (comment.status === "orphaned") {
    card.addClass("is-orphaned");
  }
  if (comment.status === "resolved") {
    card.addClass("is-resolved");
  }

  return card;
}

function renderEditFields(container: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  let draft = { ...context.draft };

  const typeRow = container.createDiv({ cls: "side-comments-card-edit-row" });
  const typeSelect = typeRow.createEl("select");
  for (const value of ["highlight", "underline", "strikethrough"] as const) {
    const option = typeSelect.createEl("option", { text: markLabel(value) });
    option.value = value;
  }
  typeSelect.value = draft.markType;
  typeSelect.addEventListener("change", () => {
    draft = {
      ...draft,
      markType: typeSelect.value as CommentDraft["markType"]
    };
    context.onDraftChange(comment.id, draft);
  });

  const colorSelect = typeRow.createEl("select");
  for (const value of ["yellow", "blue", "red", "green", "purple"] as const) {
    const option = colorSelect.createEl("option", { text: value });
    option.value = value;
  }
  colorSelect.value = draft.color;
  colorSelect.addEventListener("change", () => {
    draft = {
      ...draft,
      color: colorSelect.value as CommentDraft["color"]
    };
    context.onDraftChange(comment.id, draft);
  });

  const statusSelect = typeRow.createEl("select");
  for (const value of ["active", "resolved"] as const) {
    const option = statusSelect.createEl("option", { text: statusLabel(value) });
    option.value = value;
  }
  statusSelect.value = draft.status === "orphaned" ? "active" : draft.status;
  statusSelect.addEventListener("change", () => {
    draft = {
      ...draft,
      status: statusSelect.value as CommentDraft["status"]
    };
    context.onDraftChange(comment.id, draft);
  });

  const textarea = container.createEl("textarea", {
    cls: "side-comments-card-textarea",
    attr: {
      rows: "4",
      placeholder: "写下批注... Enter 保存，Shift+Enter 换行"
    }
  });
  textarea.value = draft.noteContent;
  textarea.focus();
  textarea.addEventListener("input", () => {
    draft = {
      ...draft,
      noteContent: textarea.value
    };
    context.onDraftChange(comment.id, draft);
  });
  textarea.addEventListener("keydown", (event) => {
    if (event.isComposing) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      context.onCancelEdit(comment.id);
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      draft = {
        ...draft,
        noteContent: textarea.value,
        markType: typeSelect.value as CommentDraft["markType"],
        color: colorSelect.value as CommentDraft["color"],
        status: statusSelect.value as CommentDraft["status"]
      };
      context.onSave(comment.id, draft);
    }
  });

  const actionRow = container.createDiv({ cls: "side-comments-card-edit-actions" });
  createActionButton(actionRow, "存", "保存", () => {
    draft = {
      ...draft,
      noteContent: textarea.value,
      markType: typeSelect.value as CommentDraft["markType"],
      color: colorSelect.value as CommentDraft["color"],
      status: statusSelect.value as CommentDraft["status"]
    };
    context.onSave(comment.id, draft);
  });
  createActionButton(actionRow, "取", "取消", () => {
    context.onCancelEdit(comment.id);
  });
}

function createActionButton(
  container: HTMLElement,
  shortLabel: string,
  label: string,
  onClick: () => void,
  disabled = false
): HTMLButtonElement {
  const button = container.createEl("button", {
    cls: "side-comments-card-button",
    attr: {
      type: "button",
      title: label,
      "aria-label": label
    }
  });
  button.createSpan({ cls: "side-comments-card-button-label", text: shortLabel });
  button.disabled = disabled;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!button.disabled) {
      onClick();
    }
  });
  return button;
}

function markLabel(markType: SideComment["mark"]["type"]): string {
  if (markType === "highlight") {
    return "高亮";
  }
  if (markType === "underline") {
    return "下划线";
  }
  return "删除线";
}

function statusLabel(status: SideCommentStatus): string {
  if (status === "active") {
    return "未处理";
  }
  if (status === "resolved") {
    return "已处理";
  }
  return "已失联";
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
