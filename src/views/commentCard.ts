import { Menu, setIcon } from "obsidian";
import type { CommentDraft, MarkColor, MarkType, SideComment, SideCommentStatus, AnnotationState } from "../types";
import type { Translator } from "../i18n";
import {
  normalizeTagKey,
  normalizeTags
} from "../organization/annotationMetadata";
import { getAnnotationState, hasNoteContent, isVisualMark } from "../organization/annotationState";
import { showMenuAtEventTarget } from "./shared";

const MARK_ICONS: Record<MarkType, string> = {
  highlight: "highlighter",
  underline: "underline",
  strikethrough: "strikethrough",
  note: "sticky-note"
};

const VISIBLE_TAG_LIMIT = 2;
const VISIBLE_TAG_LIMIT_COMPACT = 1;

export type CardEditMode = "note" | "mark" | "tags" | null;

export type CardDensity = "normal" | "compact";

export interface CommentCardContext {
  t: Translator;
  expanded: boolean;
  editing: boolean;
  editMode: CardEditMode;
  flash: boolean;
  draft: CommentDraft;
  density: CardDensity;
  tagSuggestions: string[];
  filenamePrefix?: { name: string; fullPath: string };
  extraMenuItems?: (menu: Menu, comment: SideComment) => void;
  onJump: (commentId: string) => void;
  onToggleExpand: (commentId: string) => void;
  onBeginEdit?: (commentId: string, mode: CardEditMode) => void;
  onCancelEdit?: (commentId: string) => void;
  onSave?: (commentId: string, draft: CommentDraft) => void;
  onDelete?: (commentId: string) => void;
  onToggleStatus?: (commentId: string, status: SideCommentStatus) => void;
  onRebind?: (commentId: string) => void;
  onAdjustRange?: (commentId: string) => void;
  onDraftChange?: (commentId: string, draft: CommentDraft) => void;
  onTagsChange?: (commentId: string, tags: string[]) => void;
}

export function renderCommentCard(
  container: HTMLElement,
  comment: SideComment,
  context: CommentCardContext
): HTMLDivElement {
  const state = getAnnotationState(comment);
  const isCompact = context.density === "compact";

  const card = container.createDiv({
    cls: [
      "side-comments-card",
      `side-comments-card--${comment.status}`,
      `side-comments-card--${state}`,
      context.expanded ? "is-expanded" : "is-collapsed",
      context.editing ? "is-editing" : "",
      context.flash ? "side-comments-card--flash" : "",
      isCompact ? "side-comments-card--compact" : ""
    ].filter(Boolean)
  });
  card.dataset.commentId = comment.id;
  card.addEventListener("click", (event) => {
    if (context.editing || isInteractiveTarget(event.target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    context.onJump(comment.id);
  });

  renderColorBar(card, comment, context);
  const content = card.createDiv({ cls: "side-comments-card-content" });
  renderHeader(content, comment, context, state);

  if (context.editing) {
    renderEditPanel(content, comment, context);
  } else {
    renderBody(content, comment, context, state);
  }

  return card;
}

function renderColorBar(card: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  const state = getAnnotationState(comment);
  const barColorClass = state === "note-only"
    ? "side-comments-card-color-bar--neutral"
    : `side-comments-card-color-bar--${comment.mark.color}`;

  const bar = card.createDiv({
    cls: ["side-comments-card-color-bar", barColorClass]
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

function renderHeader(
  content: HTMLElement,
  comment: SideComment,
  context: CommentCardContext,
  state: AnnotationState
): void {
  const header = content.createDiv({ cls: "side-comments-card-header" });

  const titleArea = header.createDiv({ cls: "side-comments-card-title-area" });

  const markIcon = titleArea.createSpan({
    cls: "side-comments-card-meta-icon",
    attr: { title: markLabel(comment.mark.type, context.t), "aria-label": markLabel(comment.mark.type, context.t) }
  });
  setIcon(markIcon, MARK_ICONS[comment.mark.type] ?? "highlighter");

  if (context.filenamePrefix) {
    titleArea.createSpan({
      cls: "side-comments-card-meta-filename",
      text: context.filenamePrefix.name,
      attr: { title: context.filenamePrefix.fullPath }
    });
  }

  const excerptText = comment.anchor.selectedText || context.t("card.emptySelection");
  titleArea.createSpan({
    cls: "side-comments-card-excerpt-title",
    text: excerptText,
    attr: { title: excerptText }
  });

  const actionsArea = header.createDiv({ cls: "side-comments-card-header-actions" });

  if (comment.status === "orphaned" && context.onRebind) {
    const onRebind = context.onRebind;
    const rebindBtn = actionsArea.createEl("button", {
      cls: "side-comments-card-direct-action",
      attr: {
        type: "button",
        title: context.t("action.rebind.tooltip"),
        "aria-label": context.t("action.rebind.tooltip")
      }
    });
    setIcon(rebindBtn, "link-2");
    rebindBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onRebind(comment.id);
    });
  } else {
    const onBeginEdit = context.onBeginEdit;
    if (onBeginEdit) {
      if (state === "mark-only") {
        const addNoteBtn = actionsArea.createEl("button", {
          cls: "side-comments-card-direct-action",
          attr: {
            type: "button",
            title: context.t("action.addNote"),
            "aria-label": context.t("action.addNote")
          }
        });
        setIcon(addNoteBtn, "sticky-note");
        addNoteBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          onBeginEdit(comment.id, "note");
        });
      } else if (state === "note-only" || state === "mark-and-note") {
        const editNoteBtn = actionsArea.createEl("button", {
          cls: "side-comments-card-direct-action",
          attr: {
            type: "button",
            title: context.t("action.editNote"),
            "aria-label": context.t("action.editNote")
          }
        });
        setIcon(editNoteBtn, "pencil");
        editNoteBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          onBeginEdit(comment.id, "note");
        });
      }
    }
  }

  const overflowBtn = actionsArea.createEl("button", {
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
    openOverflowMenu(event, comment, context, state);
  });
}

function openOverflowMenu(
  event: MouseEvent,
  comment: SideComment,
  context: CommentCardContext,
  state: AnnotationState
): void {
  const menu = new Menu();
  const onBeginEdit = context.onBeginEdit;

  if (comment.status !== "orphaned") {
    if (state === "mark-only" && onBeginEdit && context.density === "compact") {
      menu.addItem((item) => {
        item.setTitle(context.t("action.addNote"))
          .setIcon("sticky-note")
          .onClick(() => onBeginEdit(comment.id, "note"));
      });
    }

    if ((state === "note-only" || state === "mark-and-note") && onBeginEdit && context.density === "compact") {
      menu.addItem((item) => {
        item.setTitle(context.t("action.editNote"))
          .setIcon("pencil")
          .onClick(() => onBeginEdit(comment.id, "note"));
      });
    }

    if (onBeginEdit) {
      menu.addSeparator();
      menu.addItem((item) => {
        item.setTitle(context.t("action.editMark"))
          .setIcon("palette")
          .onClick(() => onBeginEdit(comment.id, "mark"));
      });
      menu.addItem((item) => {
        item.setTitle(context.t("action.editTags"))
          .setIcon("tag")
          .onClick(() => onBeginEdit(comment.id, "tags"));
      });
    }

    if (context.onAdjustRange) {
      const onAdjustRange = context.onAdjustRange;
      menu.addItem((item) => {
        item.setTitle(context.t("action.adjust.tooltip"))
          .setIcon("move")
          .onClick(() => onAdjustRange(comment.id));
      });
    }

    menu.addSeparator();
    if (context.onToggleStatus) {
      const toggle = context.onToggleStatus;
      if (comment.status === "active") {
        menu.addItem((item) => {
          item.setTitle(context.t("action.markResolved"))
            .setIcon("check-circle")
            .onClick(() => toggle(comment.id, "resolved"));
        });
      } else if (comment.status === "resolved") {
        menu.addItem((item) => {
          item.setTitle(context.t("action.restoreActive"))
            .setIcon("rotate-ccw")
            .onClick(() => toggle(comment.id, "active"));
        });
      }
    }
  }

  if (comment.status === "orphaned") {
    if (context.onRebind) {
      const onRebind = context.onRebind;
      menu.addItem((item) => {
        item.setTitle(context.t("action.rebind.tooltip"))
          .setIcon("link-2")
          .onClick(() => onRebind(comment.id));
      });
    }
    if (onBeginEdit) {
      menu.addItem((item) => {
        item.setTitle(context.t("action.editTags"))
          .setIcon("tag")
          .onClick(() => onBeginEdit(comment.id, "tags"));
      });
    }
  }

  menu.addItem((item) => {
    item.setTitle(context.expanded ? context.t("action.collapse") : context.t("action.expand"))
      .setIcon(context.expanded ? "chevron-up" : "chevron-down")
      .onClick(() => context.onToggleExpand(comment.id));
  });

  if (context.onDelete) {
    const onDelete = context.onDelete;
    menu.addSeparator();

    if (hasNoteContent(comment)) {
      menu.addItem((item) => {
        item.setTitle(context.t("action.deleteNote"))
          .setIcon("file-x")
          .onClick(() => {
            if (state === "note-only") {
              onDelete(comment.id);
            } else {
              context.onSave?.(comment.id, { ...context.draft, noteContent: "" });
            }
          });
      });
    }

    if (state === "mark-and-note") {
      menu.addItem((item) => {
        item.setTitle(context.t("action.removeMark"))
          .setIcon("eraser")
          .onClick(() => context.onSave?.(comment.id, { ...context.draft, markType: "note" }));
      });
    }

    menu.addItem((item) => {
      item.setTitle(context.t("action.deleteAnnotation"))
        .setIcon("trash-2")
        .onClick(() => onDelete(comment.id));
    });
  }

  if (context.extraMenuItems) {
    menu.addSeparator();
    context.extraMenuItems(menu, comment);
  }

  showMenuAtEventTarget(menu, event);
}

function renderBody(
  content: HTMLElement,
  comment: SideComment,
  context: CommentCardContext,
  state: AnnotationState
): void {
  const collapsedResolved = comment.status === "resolved" && !context.expanded;
  const body = content.createDiv({
    cls: [
      "side-comments-card-body",
      collapsedResolved ? "is-resolved-summary" : ""
    ].filter(Boolean).join(" ")
  });
  if (collapsedResolved) {
    const noteText = comment.note.content.trim();
    const summaryText = noteText || comment.anchor.selectedText || context.t("card.emptySelection");
    body.createDiv({ cls: "side-comments-card-excerpt-summary", text: summaryText });
    return;
  }

  const noteText = comment.note.content.trim();
  const showNote = (!isCompactDensity(context) || context.expanded) && (noteText || (context.expanded && state !== "mark-only"));

  if (showNote) {
    body.createDiv({
      cls: "side-comments-card-note",
      text: noteText || context.t("card.emptyNote")
    });
  }

  if (!context.expanded && !isCompactDensity(context)) {
    renderMetadataRow(body, comment, context);
  }

  if (context.expanded) {
    if (comment.status === "orphaned") {
      body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.source") });
      body.createDiv({ cls: "side-comments-card-excerpt", text: comment.anchor.selectedText || context.t("card.emptySelection") });
      body.createDiv({ cls: "side-comments-card-section-title", text: context.t("card.context") });
      body.createDiv({ cls: "side-comments-card-context", text: buildAnchorContextPreview(comment) });
    }

    renderMetadataRow(body, comment, context);

    if (context.onTagsChange) {
      renderTagEditor(body, comment, context);
    }
  }
}

function isCompactDensity(context: CommentCardContext): boolean {
  return context.density === "compact";
}

function renderMetadataRow(
  body: HTMLElement,
  comment: SideComment,
  context: CommentCardContext
): void {
  const meta = body.createDiv({ cls: "side-comments-card-metadata" });

  const tagLimit = context.density === "compact" ? VISIBLE_TAG_LIMIT_COMPACT : VISIBLE_TAG_LIMIT;
  const tags = normalizeTags(comment.tags);
  for (const tag of tags.slice(0, tagLimit)) {
    meta.createSpan({ cls: "side-comments-card-meta-chip", text: tag });
  }
  if (tags.length > tagLimit) {
    meta.createSpan({
      cls: "side-comments-card-meta-chip side-comments-card-meta-chip--tag-overflow",
      text: `+${tags.length - tagLimit}`
    });
  }

  meta.createSpan({
    cls: "side-comments-card-meta-time",
    text: formatTime(comment.note.updatedAt)
  });

  if (comment.status !== "active") {
    meta.createSpan({
      cls: `side-comments-card-meta-status side-comments-card-meta-status--${comment.status}`,
      text: statusLabel(comment.status, context.t)
    });
  }
}

function renderTagEditor(body: HTMLElement, comment: SideComment, context: CommentCardContext): void {
  const onTagsChange = context.onTagsChange!;
  const section = body.createDiv({ cls: "side-comments-card-tag-section" });
  section.createDiv({ cls: "side-comments-card-section-title", text: context.t("tags.label") });

  const chips = section.createDiv({ cls: "side-comments-tag-chips" });
  const currentTags = normalizeTags(comment.tags);

  const renderChips = (tags: string[]): void => {
    chips.empty();
    if (tags.length === 0) {
      chips.createSpan({ cls: "side-comments-tag-empty", text: context.t("tags.empty") });
    }
    for (const tag of tags) {
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
        const next = tags.filter((item) => normalizeTagKey(item) !== normalizeTagKey(tag));
        onTagsChange(comment.id, next);
      });
    }
  };
  renderChips(currentTags);

  const listId = `side-comments-tag-suggestions-${comment.id}`;
  if (context.tagSuggestions.length > 0) {
    const datalist = section.createEl("datalist", { attr: { id: listId } });
    for (const tag of context.tagSuggestions) {
      datalist.createEl("option", { attr: { value: tag } });
    }
  }

  const input = section.createEl("input", {
    cls: "side-comments-tag-input",
    attr: {
      type: "text",
      placeholder: context.t("tags.placeholder"),
      "aria-label": context.t("tags.placeholder"),
      ...(context.tagSuggestions.length > 0 ? { list: listId } : {})
    }
  });
  input.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    const currentTags = normalizeTags(comment.tags);
    const merged = normalizeTags([...currentTags, input.value]);
    if (merged.length !== currentTags.length) {
      onTagsChange(comment.id, merged);
    }
    input.value = "";
  });
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
  const editMode = context.editMode ?? "note";

  if (editMode === "mark") {
    renderMarkEditPanel(panel, comment, context, draft, onDraftChange, onSave, onCancelEdit);
  } else if (editMode === "tags") {
    renderTagEditPanel(panel, comment, context, onSave, onCancelEdit);
  } else {
    renderNoteEditPanel(panel, comment, context, draft, onDraftChange, onSave, onCancelEdit);
  }
}

function renderMarkEditPanel(
  panel: HTMLDivElement,
  comment: SideComment,
  context: CommentCardContext,
  draft: CommentDraft,
  onDraftChange: (commentId: string, draft: CommentDraft) => void,
  onSave: (commentId: string, draft: CommentDraft) => void,
  onCancelEdit: (commentId: string) => void
): void {
  const state = getAnnotationState(comment);
  const appearanceRow = panel.createDiv({ cls: "side-comments-card-edit-row side-comments-card-edit-row--appearance" });

  const markTypeSelect = appearanceRow.createEl("select", { cls: "side-comments-card-edit-select" });
  const markOptions: { value: MarkType; labelKey: "filter.type.highlight" | "filter.type.underline" | "filter.type.strikethrough" }[] = [
    { value: "highlight", labelKey: "filter.type.highlight" },
    { value: "underline", labelKey: "filter.type.underline" },
    { value: "strikethrough", labelKey: "filter.type.strikethrough" }
  ];
  for (const option of markOptions) {
    const opt = markTypeSelect.createEl("option", { text: context.t(option.labelKey) });
    opt.value = option.value;
  }
  markTypeSelect.value = isVisualMark(draft.markType) ? draft.markType : "highlight";
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

  if (state === "mark-and-note") {
    const removeMarkBtn = actionRow.createEl("button", {
      cls: "side-comments-card-edit-remove",
      attr: { type: "button" },
      text: context.t("action.removeMark")
    });
    removeMarkBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onSave(comment.id, { ...draft, markType: "note" });
    });
  }

  const saveBtn = actionRow.createEl("button", {
    cls: "side-comments-card-edit-save mod-cta",
    attr: { type: "button" },
    text: context.t("action.save")
  });
  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSave(comment.id, { ...draft, markType: markTypeSelect.value as MarkType, color: colorSelect.value as MarkColor });
  });
}

function renderNoteEditPanel(
  panel: HTMLDivElement,
  comment: SideComment,
  context: CommentCardContext,
  draft: CommentDraft,
  onDraftChange: (commentId: string, draft: CommentDraft) => void,
  onSave: (commentId: string, draft: CommentDraft) => void,
  onCancelEdit: (commentId: string) => void
): void {
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

function renderTagEditPanel(
  panel: HTMLDivElement,
  comment: SideComment,
  context: CommentCardContext,
  onSave: (commentId: string, draft: CommentDraft) => void,
  onCancelEdit: (commentId: string) => void
): void {
  const currentTags = normalizeTags(comment.tags);
  let pendingTags = [...currentTags];

  const chips = panel.createDiv({ cls: "side-comments-tag-chips" });

  const renderChips = (): void => {
    chips.empty();
    if (pendingTags.length === 0) {
      chips.createSpan({ cls: "side-comments-tag-empty", text: context.t("tags.empty") });
    }
    for (const tag of pendingTags) {
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
        pendingTags = pendingTags.filter((item) => normalizeTagKey(item) !== normalizeTagKey(tag));
        renderChips();
      });
    }
  };
  renderChips();

  const editListId = `side-comments-tag-edit-suggestions-${comment.id}`;
  if (context.tagSuggestions.length > 0) {
    const datalist = panel.createEl("datalist", { attr: { id: editListId } });
    for (const tag of context.tagSuggestions) {
      datalist.createEl("option", { attr: { value: tag } });
    }
  }

  const input = panel.createEl("input", {
    cls: "side-comments-tag-input",
    attr: {
      type: "text",
      placeholder: context.t("tags.placeholder"),
      "aria-label": context.t("tags.placeholder"),
      ...(context.tagSuggestions.length > 0 ? { list: editListId } : {})
    }
  });
  input.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    const merged = normalizeTags([...pendingTags, input.value]);
    if (merged.length !== pendingTags.length) {
      pendingTags = merged;
      renderChips();
    }
    input.value = "";
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
    onSave(comment.id, { ...context.draft, tags: pendingTags });
  });
}

function buildAnchorContextPreview(comment: SideComment): string {
  const before = comment.anchor.context?.before ?? comment.anchor.prefix;
  const after = comment.anchor.context?.after ?? comment.anchor.suffix;
  return `${before}[${comment.anchor.selectedText}]${after}`.trim() || comment.anchor.selectedText;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("button, input, select, textarea, a, label, [contenteditable='true']"));
}

export function markLabel(markType: SideComment["mark"]["type"], t: Translator): string {
  if (markType === "highlight") {
    return t("filter.type.highlight");
  }
  if (markType === "underline") {
    return t("filter.type.underline");
  }
  if (markType === "note") {
    return t("advancedCreate.mark.noVisibleMark");
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
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
