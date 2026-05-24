import type { AnnotationType, CommentDraft, MarkColor, SidebarDisplayMode, SideComment, SideCommentStatus } from "../types";
import type { Translator } from "../i18n";
import {
  ANNOTATION_TYPES,
  annotationTypeLabel,
  getAnnotationType,
  normalizeTagKey,
  normalizeTags
} from "../organization/annotationMetadata";

export interface CommentCardContext {
  t: Translator;
  displayMode: SidebarDisplayMode;
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
  onRebind: (commentId: string) => void;
  onAdjustRange: (commentId: string) => void;
  onDraftChange: (commentId: string, draft: CommentDraft) => void;
  onSetAnnotationType: (commentId: string, annotationType: AnnotationType) => void;
  onSetTags: (commentId: string, tags: string[]) => void;
  tagSuggestions: string[];
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
  meta.createSpan({ cls: `side-comments-color-dot side-comments-color-dot--${comment.mark.color}` });
  meta.createSpan({ text: `${annotationTypeLabel(getAnnotationType(comment), context.t)} · ${markLabel(comment, context.t)} · ${colorLabel(comment.mark.color, context.t)}` });
  meta.createSpan({ text: ` · ${statusLabel(comment.status, context.t)}` });
  meta.createSpan({ text: ` · ${formatTime(comment.note.updatedAt)}` });

  const headerActions = header.createDiv({ cls: "side-comments-card-header-actions" });
  createActionButton(headerActions, context.expanded ? context.t("action.collapse.short") : context.t("action.expand.short"), context.expanded ? context.t("action.collapse") : context.t("action.expand"), () => {
    context.onToggleExpand(comment.id);
  });
  createActionButton(headerActions, context.t("action.jump.short"), context.t("action.jumpToText"), () => {
    context.onJump(comment.id);
  });
  if (comment.status === "orphaned") {
    createActionButton(headerActions, context.t("action.rebind.short"), context.t("action.rebind.tooltip"), () => {
      context.onRebind(comment.id);
    });
  } else {
    createActionButton(headerActions, context.t("action.adjust.short"), context.t("action.adjust.tooltip"), () => {
      context.onAdjustRange(comment.id);
    });
  }
  createActionButton(headerActions, context.editing ? context.t("action.save.short") : context.t("action.edit.short"), context.editing ? context.t("action.save") : context.t("action.edit"), () => {
    if (context.editing) {
      context.onSave(comment.id, context.draft);
    } else {
      context.onBeginEdit(comment.id);
    }
  });
  createActionButton(headerActions, comment.status === "active" ? context.t("action.resolve.short") : context.t("action.restore.short"), comment.status === "active" ? context.t("action.resolve") : context.t("action.restore"), () => {
    if (comment.status === "orphaned") {
      return;
    }
    context.onToggleStatus(comment.id, comment.status === "active" ? "resolved" : "active");
  }, comment.status === "orphaned");
  createActionButton(headerActions, context.t("action.delete.short"), context.t("action.delete"), () => {
    context.onDelete(comment.id);
  });

  if (!context.expanded && comment.status === "resolved" && !context.editing) {
    card.createDiv({
      cls: "side-comments-card-resolved-summary",
      text: comment.anchor.selectedText || context.t("card.emptySelection")
    });
    card.addClass("is-resolved");
    return card;
  }

  if (context.displayMode === "compact" && !context.expanded && !context.editing) {
    card.addClass("side-comments-card--compact");
    const compactBody = card.createDiv({ cls: "side-comments-card-compact-body" });
    compactBody.addEventListener("click", () => {
      context.onToggleExpand(comment.id);
    });

    compactBody.createDiv({
      cls: "side-comments-card-compact-text",
      text: comment.anchor.selectedText || context.t("card.emptySelection")
    });

    const note = comment.note.content.trim();
    if (note) {
      compactBody.createDiv({
        cls: "side-comments-card-compact-note",
        text: note
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

  const body = card.createDiv({ cls: "side-comments-card-body" });
  if (!context.expanded) {
    body.addClass("is-collapsed");
  }

  renderOrganizationFields(body, comment, context);

  body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.source") });
  body.createDiv({
    cls: "side-comments-card-excerpt",
    text: comment.anchor.selectedText || context.t("card.emptySelection")
  });

  if (comment.status === "orphaned") {
    body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.context") });
    body.createDiv({
      cls: "side-comments-card-context",
      text: buildAnchorContextPreview(comment)
    });
  }

  body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.comment") });
  if (context.editing) {
    renderEditFields(body, comment, context);
  } else {
    body.createDiv({
      cls: "side-comments-card-note",
      text: comment.note.content || context.t("card.emptyNote")
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

function buildAnchorContextPreview(comment: SideComment): string {
  const before = comment.anchor.context?.before ?? comment.anchor.prefix;
  const after = comment.anchor.context?.after ?? comment.anchor.suffix;
  return `${before}[${comment.anchor.selectedText}]${after}`.trim() || comment.anchor.selectedText;
}

function renderEditFields(container: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  let draft = { ...context.draft };

  const typeRow = container.createDiv({ cls: "side-comments-card-edit-row" });
  const typeSelect = typeRow.createEl("select");
  for (const value of ["highlight", "underline", "strikethrough"] as const) {
    const option = typeSelect.createEl("option", { text: markLabel(value, context.t) });
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
    const option = colorSelect.createEl("option", { text: colorLabel(value, context.t) });
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
    const option = statusSelect.createEl("option", { text: statusLabel(value, context.t) });
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
      placeholder: context.t("card.notePlaceholder")
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
  createActionButton(actionRow, context.t("action.save.short"), context.t("action.save"), () => {
    draft = {
      ...draft,
      noteContent: textarea.value,
      markType: typeSelect.value as CommentDraft["markType"],
      color: colorSelect.value as CommentDraft["color"],
      status: statusSelect.value as CommentDraft["status"]
    };
    context.onSave(comment.id, draft);
  });
  createActionButton(actionRow, context.t("action.cancel.short"), context.t("action.cancel"), () => {
    context.onCancelEdit(comment.id);
  });
}

function renderOrganizationFields(container: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  const currentType = getAnnotationType(comment);
  const currentTags = normalizeTags(comment.tags);

  const row = container.createDiv({ cls: "side-comments-card-organization" });
  const typeSelect = row.createEl("select", {
    cls: "side-comments-annotation-type-select",
    attr: {
      title: context.t("annotationType.defaultTooltip"),
      "aria-label": context.t("annotationType.placeholder")
    }
  });
  for (const type of ANNOTATION_TYPES) {
    const option = typeSelect.createEl("option", { text: annotationTypeLabel(type, context.t) });
    option.value = type;
  }
  typeSelect.value = currentType;
  typeSelect.addEventListener("change", () => {
    context.onSetAnnotationType(comment.id, typeSelect.value as AnnotationType);
  });

  const tagEditor = row.createDiv({ cls: "side-comments-tag-editor" });
  tagEditor.createSpan({ cls: "side-comments-tag-label", text: context.t("tags.label") });
  const chips = tagEditor.createDiv({ cls: "side-comments-tag-chips" });

  const updateTags = (tags: string[]) => {
    context.onSetTags(comment.id, tags);
  };

  for (const tag of currentTags) {
    const chip = chips.createSpan({ cls: "side-comments-tag-chip" });
    chip.createSpan({ text: tag });
    const remove = chip.createEl("button", {
      cls: "side-comments-tag-remove",
      attr: {
        type: "button",
        title: context.t("tags.remove"),
        "aria-label": context.t("tags.remove")
      }
    });
    remove.setText("x");
    remove.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      updateTags(currentTags.filter((item) => normalizeTagKey(item) !== normalizeTagKey(tag)));
    });
  }

  if (currentTags.length === 0) {
    chips.createSpan({ cls: "side-comments-tag-empty", text: context.t("tags.empty") });
  }

  const listId = `side-comments-tag-options-${comment.id}`;
  const dataList = tagEditor.createEl("datalist");
  dataList.id = listId;
  const existingKeys = new Set(currentTags.map((tag) => normalizeTagKey(tag)));
  for (const suggestion of context.tagSuggestions) {
    if (existingKeys.has(normalizeTagKey(suggestion))) {
      continue;
    }
    const option = dataList.createEl("option");
    option.value = suggestion;
  }

  const input = tagEditor.createEl("input", {
    cls: "side-comments-tag-input",
    attr: {
      type: "text",
      list: listId,
      placeholder: context.t("tags.placeholder"),
      "aria-label": context.t("tags.placeholder")
    }
  });
  input.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    const tags = normalizeTags([...currentTags, input.value]);
    if (tags.length !== currentTags.length) {
      updateTags(tags);
      input.value = "";
    }
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
  button.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!button.disabled) {
      onClick();
    }
  });
  return button;
}

export function markLabel(commentOrMarkType: SideComment | SideComment["mark"]["type"], t: Translator): string {
  if (typeof commentOrMarkType !== "string" && isCommentLikeMark(commentOrMarkType)) {
    return t("filter.type.comment");
  }

  const markType = typeof commentOrMarkType === "string" ? commentOrMarkType : commentOrMarkType.mark.type;
  if (markType === "highlight") {
    return t("filter.type.highlight");
  }
  if (markType === "underline") {
    return t("filter.type.underline");
  }
  return t("filter.type.strikethrough");
}

export function colorLabel(color: MarkColor, t: Translator): string {
  if (color === "yellow") {
    return t("filter.color.yellow");
  }
  if (color === "blue") {
    return t("filter.color.blue");
  }
  if (color === "red") {
    return t("filter.color.red");
  }
  if (color === "green") {
    return t("filter.color.green");
  }
  return t("filter.color.purple");
}

function isCommentLikeMark(comment: SideComment): boolean {
  return comment.mark.type === "highlight" && comment.mark.color === "purple";
}

export function statusLabel(status: SideCommentStatus, t: Translator): string {
  if (status === "active") {
    return t("filter.status.active");
  }
  if (status === "resolved") {
    return t("filter.status.resolved");
  }
  return t("filter.status.orphaned");
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
