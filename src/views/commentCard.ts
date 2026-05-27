import { Menu, setIcon } from "obsidian";
import type { AnnotationType, CommentDraft, MarkColor, MarkType, SideComment, SideCommentStatus } from "../types";
import type { Translator } from "../i18n";
import {
  ANNOTATION_TYPES,
  annotationTypeLabel,
  getAnnotationType,
  normalizeTagKey,
  normalizeTags
} from "../organization/annotationMetadata";

const MARK_ICONS: Record<MarkType, string> = {
  highlight: "highlighter",
  underline: "underline",
  strikethrough: "strikethrough",
  note: "sticky-note"
};

const VISIBLE_TAG_LIMIT = 2;

export interface CommentCardContext {
  t: Translator;
  expanded: boolean;
  editing: boolean;
  flash: boolean;
  draft: CommentDraft;
  tagSuggestions: string[];
  filenamePrefix?: { name: string; fullPath: string };
  extraMenuItems?: (menu: Menu, comment: SideComment) => void;
  onJump: (commentId: string) => void;
  onToggleExpand: (commentId: string) => void;
  onBeginEdit?: (commentId: string) => void;
  onCancelEdit?: (commentId: string) => void;
  onSave?: (commentId: string, draft: CommentDraft) => void;
  onDelete?: (commentId: string) => void;
  onToggleStatus?: (commentId: string, status: SideCommentStatus) => void;
  onRebind?: (commentId: string) => void;
  onAdjustRange?: (commentId: string) => void;
  onDraftChange?: (commentId: string, draft: CommentDraft) => void;
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
      context.expanded ? "is-expanded" : "is-collapsed",
      context.editing ? "is-editing" : "",
      context.flash ? "side-comments-card--flash" : ""
    ].filter(Boolean)
  });
  card.dataset.commentId = comment.id;

  renderColorBar(card, comment, context);
  const content = card.createDiv({ cls: "side-comments-card-content" });
  renderHeader(content, comment, context);

  if (context.editing) {
    renderEditPanel(content, comment, context);
  } else {
    renderBody(content, comment, context);
  }

  return card;
}

function renderColorBar(card: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  const bar = card.createDiv({
    cls: `side-comments-card-color-bar side-comments-card-color-bar--${comment.mark.color}`
  });

  const indicator = bar.createEl("button", {
    cls: [
      "side-comments-card-status-indicator",
      `side-comments-card-status-indicator--${comment.status}`
    ].join(" "),
    attr: {
      type: "button",
      title: statusLabel(comment.status, context.t),
      "aria-label": statusLabel(comment.status, context.t)
    }
  });
  if (comment.status === "orphaned") {
    setIcon(indicator, "unlink-2");
    indicator.disabled = true;
  } else if (comment.status === "resolved") {
    setIcon(indicator, "check");
  }
  if (comment.status !== "orphaned" && context.onToggleStatus) {
    const toggle = context.onToggleStatus;
    const next = comment.status === "active" ? "resolved" : "active";
    indicator.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggle(comment.id, next);
    });
  } else if (comment.status !== "orphaned") {
    indicator.disabled = true;
  }
}

function renderHeader(content: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  const header = content.createDiv({ cls: "side-comments-card-header" });
  const meta = header.createDiv({ cls: "side-comments-card-meta" });

  if (context.filenamePrefix) {
    meta.createSpan({
      cls: "side-comments-card-meta-filename",
      text: context.filenamePrefix.name,
      attr: { title: context.filenamePrefix.fullPath }
    });
  }

  const markIcon = meta.createSpan({
    cls: "side-comments-card-meta-icon",
    attr: { title: markLabel(comment, context.t), "aria-label": markLabel(comment, context.t) }
  });
  setIcon(markIcon, MARK_ICONS[comment.mark.type] ?? "highlighter");

  meta.createSpan({
    cls: "side-comments-card-meta-type",
    text: annotationTypeLabel(getAnnotationType(comment), context.t)
  });

  const tags = normalizeTags(comment.tags);
  for (const tag of tags.slice(0, VISIBLE_TAG_LIMIT)) {
    meta.createSpan({ cls: "side-comments-card-meta-tag", text: tag });
  }
  if (tags.length > VISIBLE_TAG_LIMIT) {
    meta.createSpan({
      cls: "side-comments-card-meta-tag side-comments-card-meta-tag--overflow",
      text: `+${tags.length - VISIBLE_TAG_LIMIT}`
    });
  }

  meta.createSpan({
    cls: "side-comments-card-meta-time",
    text: formatTime(comment.note.updatedAt)
  });

  const overflowBtn = header.createEl("button", {
    cls: "side-comments-card-overflow-btn",
    attr: {
      type: "button",
      title: context.t("toolbar.more"),
      "aria-label": context.t("toolbar.more")
    }
  });
  setIcon(overflowBtn, "more-horizontal");
  overflowBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openOverflowMenu(event, comment, context);
  });
}

function openOverflowMenu(event: MouseEvent, comment: SideComment, context: CommentCardContext): void {
  const menu = new Menu();
  let hasStandardItems = false;

  if (context.onBeginEdit) {
    const onBeginEdit = context.onBeginEdit;
    hasStandardItems = true;
    menu.addItem((item) => {
      item.setTitle(context.t("action.edit"))
        .setIcon("pencil")
        .onClick(() => onBeginEdit(comment.id));
    });
  }

  hasStandardItems = true;
  menu.addItem((item) => {
    item.setTitle(context.expanded ? context.t("action.collapse") : context.t("action.expand"))
      .setIcon(context.expanded ? "chevron-up" : "chevron-down")
      .onClick(() => context.onToggleExpand(comment.id));
  });

  if (comment.status === "orphaned" && context.onRebind) {
    const onRebind = context.onRebind;
    menu.addItem((item) => {
      item.setTitle(context.t("action.rebind.tooltip"))
        .setIcon("link-2")
        .onClick(() => onRebind(comment.id));
    });
  } else if (comment.status !== "orphaned" && context.onAdjustRange) {
    const onAdjustRange = context.onAdjustRange;
    menu.addItem((item) => {
      item.setTitle(context.t("action.adjust.tooltip"))
        .setIcon("move")
        .onClick(() => onAdjustRange(comment.id));
    });
  }

  if (context.onDelete) {
    const onDelete = context.onDelete;
    menu.addSeparator();
    menu.addItem((item) => {
      item.setTitle(context.t("action.delete"))
        .setIcon("trash-2")
        .onClick(() => onDelete(comment.id));
    });
  }

  if (context.extraMenuItems) {
    if (hasStandardItems) {
      menu.addSeparator();
    }
    context.extraMenuItems(menu, comment);
  }

  menu.showAtMouseEvent(event);
}

function renderBody(content: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  const collapsedResolved = comment.status === "resolved" && !context.expanded;
  const body = content.createDiv({
    cls: [
      "side-comments-card-body",
      collapsedResolved ? "side-comments-card-body--resolved-collapsed" : ""
    ].filter(Boolean).join(" ")
  });
  body.addEventListener("click", (event) => {
    if (isInteractiveTarget(event.target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    context.onJump(comment.id);
  });

  const excerptText = comment.anchor.selectedText || context.t("card.emptySelection");

  if (collapsedResolved) {
    body.createDiv({ cls: "side-comments-card-excerpt-summary", text: excerptText });
    return;
  }

  if (context.expanded) {
    body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.source") });
  }
  body.createDiv({ cls: "side-comments-card-excerpt", text: excerptText });

  if (comment.status === "orphaned" && context.expanded) {
    body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.context") });
    body.createDiv({ cls: "side-comments-card-context", text: buildAnchorContextPreview(comment) });
  }

  const noteText = comment.note.content.trim();
  if (noteText || context.expanded) {
    if (context.expanded) {
      body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.comment") });
    }
    body.createDiv({
      cls: "side-comments-card-note",
      text: noteText || context.t("card.emptyNote")
    });
  }
}

function renderEditPanel(content: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  const onDraftChange = context.onDraftChange;
  const onSave = context.onSave;
  const onCancelEdit = context.onCancelEdit;
  if (!onDraftChange || !onSave || !onCancelEdit) {
    return;
  }

  let draft = { ...context.draft };
  const panel = content.createDiv({ cls: "side-comments-card-edit" });

  const appearanceRow = panel.createDiv({ cls: "side-comments-card-edit-row side-comments-card-edit-row--appearance" });

  const markTypeSelect = appearanceRow.createEl("select", { cls: "side-comments-card-edit-select" });
  for (const value of ["highlight", "underline", "strikethrough", "note"] as MarkType[]) {
    const option = markTypeSelect.createEl("option", { text: markLabel(value, context.t) });
    option.value = value;
  }
  markTypeSelect.value = draft.markType;
  markTypeSelect.addEventListener("change", () => {
    draft = { ...draft, markType: markTypeSelect.value as MarkType };
    onDraftChange(comment.id, draft);
  });

  const colorSelect = appearanceRow.createEl("select", { cls: "side-comments-card-edit-select" });
  for (const value of ["yellow", "blue", "red", "green", "purple"] as MarkColor[]) {
    const option = colorSelect.createEl("option", { text: colorLabel(value, context.t) });
    option.value = value;
  }
  colorSelect.value = draft.color;
  colorSelect.addEventListener("change", () => {
    draft = { ...draft, color: colorSelect.value as MarkColor };
    onDraftChange(comment.id, draft);
  });

  const statusSelect = appearanceRow.createEl("select", { cls: "side-comments-card-edit-select" });
  for (const value of ["active", "resolved"] as const) {
    const option = statusSelect.createEl("option", { text: statusLabel(value, context.t) });
    option.value = value;
  }
  statusSelect.value = draft.status === "orphaned" ? "active" : draft.status;
  statusSelect.addEventListener("change", () => {
    draft = { ...draft, status: statusSelect.value as CommentDraft["status"] };
    onDraftChange(comment.id, draft);
  });

  const classificationRow = panel.createDiv({ cls: "side-comments-card-edit-row side-comments-card-edit-row--classification" });

  const typeSelect = classificationRow.createEl("select", { cls: "side-comments-card-edit-select side-comments-annotation-type-select" });
  for (const type of ANNOTATION_TYPES) {
    const option = typeSelect.createEl("option", { text: annotationTypeLabel(type, context.t) });
    option.value = type;
  }
  typeSelect.value = draft.annotationType;
  typeSelect.addEventListener("change", () => {
    draft = { ...draft, annotationType: typeSelect.value as AnnotationType };
    onDraftChange(comment.id, draft);
  });

  const tagEditor = classificationRow.createDiv({ cls: "side-comments-tag-editor" });
  const chips = tagEditor.createDiv({ cls: "side-comments-tag-chips" });
  const renderTagChips = () => {
    chips.empty();
    const currentTags = draft.tags;
    if (currentTags.length === 0) {
      chips.createSpan({ cls: "side-comments-tag-empty", text: context.t("tags.empty") });
    }
    for (const tag of currentTags) {
      const chip = chips.createSpan({ cls: "side-comments-tag-chip" });
      chip.createSpan({ text: tag });
      const remove = chip.createEl("button", {
        cls: "side-comments-tag-remove",
        attr: { type: "button", title: context.t("tags.remove"), "aria-label": context.t("tags.remove") }
      });
      remove.setText("×");
      remove.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        draft = {
          ...draft,
          tags: currentTags.filter((item) => normalizeTagKey(item) !== normalizeTagKey(tag))
        };
        onDraftChange(comment.id, draft);
        renderTagChips();
      });
    }
  };
  renderTagChips();

  const listId = `side-comments-tag-options-${comment.id}`;
  const dataList = tagEditor.createEl("datalist");
  dataList.id = listId;
  const existingKeys = new Set(draft.tags.map((tag) => normalizeTagKey(tag)));
  for (const suggestion of context.tagSuggestions) {
    if (existingKeys.has(normalizeTagKey(suggestion))) {
      continue;
    }
    const option = dataList.createEl("option");
    option.value = suggestion;
  }

  const tagInput = tagEditor.createEl("input", {
    cls: "side-comments-tag-input",
    attr: {
      type: "text",
      list: listId,
      placeholder: context.t("tags.placeholder"),
      "aria-label": context.t("tags.placeholder")
    }
  });
  tagInput.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    const merged = normalizeTags([...draft.tags, tagInput.value]);
    if (merged.length !== draft.tags.length) {
      draft = { ...draft, tags: merged };
      onDraftChange(comment.id, draft);
      tagInput.value = "";
      renderTagChips();
    }
  });

  const textarea = panel.createEl("textarea", {
    cls: "side-comments-card-textarea",
    attr: { rows: "4", placeholder: context.t("card.notePlaceholder") }
  });
  textarea.value = draft.noteContent;
  textarea.focus();
  textarea.addEventListener("input", () => {
    draft = { ...draft, noteContent: textarea.value };
    onDraftChange(comment.id, draft);
  });
  textarea.addEventListener("keydown", (event) => {
    if (event.isComposing) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onCancelEdit(comment.id);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSave(comment.id, { ...draft, noteContent: textarea.value });
    }
  });

  const actionRow = panel.createDiv({ cls: "side-comments-card-edit-actions" });
  const cancelBtn = actionRow.createEl("button", {
    cls: "side-comments-card-edit-cancel",
    attr: { type: "button" },
    text: context.t("action.cancel")
  });
  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onCancelEdit(comment.id);
  });

  const saveBtn = actionRow.createEl("button", {
    cls: "side-comments-card-edit-save mod-cta",
    attr: { type: "button" },
    text: context.t("action.save")
  });
  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSave(comment.id, { ...draft, noteContent: textarea.value });
  });
}

function buildAnchorContextPreview(comment: SideComment): string {
  const before = comment.anchor.context?.before ?? comment.anchor.prefix;
  const after = comment.anchor.context?.after ?? comment.anchor.suffix;
  return `${before}[${comment.anchor.selectedText}]${after}`.trim() || comment.anchor.selectedText;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("button, input, select, textarea, a"));
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
  if (markType === "note") {
    return t("toolbar.note");
  }
  return t("filter.type.strikethrough");
}

export function colorLabel(color: MarkColor, t: Translator): string {
  if (color === "yellow") return t("filter.color.yellow");
  if (color === "blue")   return t("filter.color.blue");
  if (color === "red")    return t("filter.color.red");
  if (color === "green")  return t("filter.color.green");
  return t("filter.color.purple");
}

function isCommentLikeMark(comment: SideComment): boolean {
  return comment.mark.type === "highlight" && comment.mark.color === "purple";
}

export function statusLabel(status: SideCommentStatus, t: Translator): string {
  if (status === "active")   return t("filter.status.active");
  if (status === "resolved") return t("filter.status.resolved");
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
