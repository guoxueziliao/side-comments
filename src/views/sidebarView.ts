import { ItemView, Menu, Notice, setIcon, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import { sortComments } from "../storage/migration";
import type {
  ColorFilter,
  CommentDraft,
  CommentUpdateInput,
  MarkFilter,
  NoteStateFilter,
  StatusFilter,
  SideComment
} from "../types";
import type { CardEditMode, CardDensity } from "./commentCard";
import { renderCommentCard } from "./commentCard";
import {
  collectAnnotationTags,
  hasAnyNormalizedTag,
  normalizeTagKey,
  normalizeTags
} from "../organization/annotationMetadata";
import { getAnnotationState, hasNoteContent, matchesNoteStateFilter } from "../organization/annotationState";
import { createToolbarButton, createFilterChip, createIconButton, openMultiSelectPopup, showMenuAtEventTarget } from "./shared";
import type { TranslationKey } from "../i18n";

export const SIDE_COMMENTS_VIEW_TYPE = "side-comments-view";

export class SideCommentsSidebarView extends ItemView {
  private readonly expandedCommentIds = new Set<string>();
  private readonly drafts = new Map<string, CommentDraft>();
  private focusedCommentId: string | null = null;
  private editingCommentId: string | null = null;
  private editMode: CardEditMode = null;
  private flashTimer: number | null = null;
  private searchQuery = "";
  private colorFilter: ColorFilter = "all";
  private statusFilter: StatusFilter = "all";
  private markFilter: MarkFilter = "all";
  private noteStateFilter: NoteStateFilter = "all";
  private readonly tagFilters = new Set<string>();
  private densityMode: CardDensity;

  constructor(leaf: WorkspaceLeaf, private readonly plugin: SideCommentsPlugin) {
    super(leaf);
    this.densityMode = plugin.settings.defaultDensity ?? "normal";
  }

  getViewType(): string {
    return SIDE_COMMENTS_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Side Comments";
  }

  getIcon(): string {
    return "message-square-text";
  }

  async onOpen(): Promise<void> {
    await this.render();
  }

  onunload(): void {
    if (this.flashTimer !== null) {
      window.clearTimeout(this.flashTimer);
      this.flashTimer = null;
    }
  }

  setSearchQuery(value: string): void {
    this.searchQuery = value;
    void this.render();
  }

  setColorFilter(value: ColorFilter): void {
    this.colorFilter = value;
    void this.render();
  }

  setStatusFilter(value: StatusFilter): void {
    this.statusFilter = value;
    void this.render();
  }

  setMarkFilter(value: MarkFilter): void {
    this.markFilter = value;
    void this.render();
  }

  setNoteStateFilter(value: NoteStateFilter): void {
    this.noteStateFilter = value;
    void this.render();
  }

  focusComment(commentId: string, edit = false, mode: CardEditMode = null): void {
    const comment = this.findComment(commentId);
    if (comment && !this.isCommentVisible(comment)) {
      new Notice(this.plugin.t("notice.commentHiddenByFilter"));
      return;
    }
    this.focusedCommentId = commentId;
    this.expandedCommentIds.add(commentId);
    if (edit) {
      this.editingCommentId = commentId;
      this.editMode = mode;
      if (!this.drafts.has(commentId) && comment) {
        this.drafts.set(commentId, draftFromComment(comment));
      }
    }
    void this.render();
    this.scrollToComment(commentId);
    this.flashComment(commentId);
  }

  beginEdit(commentId: string, mode: CardEditMode = null): void {
    const comment = this.findComment(commentId);
    if (!comment) {
      return;
    }
    this.editingCommentId = commentId;
    this.editMode = mode;
    this.expandedCommentIds.add(commentId);
    this.drafts.set(commentId, draftFromComment(comment));
    void this.render();
    this.scrollToComment(commentId);
  }

  cancelEdit(commentId: string): void {
    if (this.editingCommentId === commentId) {
      this.editingCommentId = null;
      this.editMode = null;
    }
    this.drafts.delete(commentId);
    void this.render();
  }

  updateDraft(commentId: string, draft: CommentDraft): void {
    this.drafts.set(commentId, draft);
  }

  async updateTags(commentId: string, tags: string[]): Promise<void> {
    const updated = await this.plugin.updateComment(commentId, { tags });
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();
  }

  async saveEdit(commentId: string, draft: CommentDraft): Promise<void> {
    const comment = this.findComment(commentId);
    if (!comment) {
      return;
    }

    const noteContent = draft.noteContent.trim();
    const state = getAnnotationState(comment);

    if (this.editMode === "note" && !noteContent) {
      if (state === "note-only") {
        void this.deleteComment(commentId);
        return;
      }
      if (state === "mark-and-note") {
        const updated = await this.plugin.updateComment(commentId, { noteContent: "" });
        this.drafts.delete(commentId);
        this.editingCommentId = null;
        this.editMode = null;
        this.plugin.setCurrentDocument(updated);
        this.plugin.refreshAllViews();
        if (!this.isCommentIdVisible(commentId)) {
          new Notice(this.plugin.t("notice.commentHiddenByFilter"));
        }
        return;
      }
    }

    const input: CommentUpdateInput = {};
    if (this.editMode === "note") {
      input.noteContent = draft.noteContent;
    } else if (this.editMode === "mark") {
      if (draft.markType === "note") {
        if (state === "mark-only") {
          void this.deleteComment(commentId);
          return;
        }
        input.markType = "note";
      } else {
        input.markType = draft.markType;
        input.color = draft.color;
      }
    } else {
      input.noteContent = draft.noteContent;
      input.markType = draft.markType;
      input.color = draft.color;
      input.status = draft.status;
      input.tags = draft.tags;
    }

    const updated = await this.plugin.updateComment(commentId, input);
    this.drafts.delete(commentId);
    if (this.editingCommentId === commentId) {
      this.editingCommentId = null;
      this.editMode = null;
    }
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();

    if (!this.isCommentIdVisible(commentId)) {
      new Notice(this.plugin.t("notice.commentHiddenByFilter"));
    }
  }

  async toggleStatus(commentId: string, nextStatus: SideComment["status"]): Promise<void> {
    const updated = await this.plugin.setCommentStatus(commentId, nextStatus);
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();

    if (!this.isCommentIdVisible(commentId)) {
      new Notice(this.plugin.t("notice.commentHiddenByFilter"));
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    const confirmed = window.confirm(this.plugin.t("card.deleteConfirm"));
    if (!confirmed) {
      return;
    }

    const updated = await this.plugin.deleteComment(commentId);
    this.drafts.delete(commentId);
    this.expandedCommentIds.delete(commentId);
    if (this.editingCommentId === commentId) {
      this.editingCommentId = null;
    }
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();
  }

  async jumpToComment(commentId: string): Promise<void> {
    const comment = this.findComment(commentId);
    if (comment?.status === "orphaned") {
      new Notice(this.plugin.t("notice.orphanJumpFailed"));
      return;
    }
    await this.plugin.jumpToCommentInEditor(commentId);
    this.focusComment(commentId, false);
  }

  async rebindComment(commentId: string): Promise<void> {
    const preview = await this.plugin.previewRebindOrphanedComment(commentId);
    if (!preview) {
      return;
    }
    const confirmed = window.confirm(`${this.plugin.t("repair.previewChange")}\n\n${preview.comment.anchor.selectedText}\n→\n${preview.selectedText}`);
    if (!confirmed) {
      return;
    }
    const updated = await this.plugin.rebindOrphanedCommentToSelection(commentId);
    if (!updated) {
      return;
    }

    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();

    if (!this.isCommentIdVisible(commentId)) {
      new Notice(this.plugin.t("notice.commentHiddenByFilter"));
    } else {
      this.focusComment(commentId, false);
    }
  }

  async adjustCommentRange(commentId: string): Promise<void> {
    const updated = await this.plugin.adjustCommentRangeToSelection(commentId);
    if (!updated) {
      return;
    }

    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();
    this.focusComment(commentId, false);
  }

  expandAll(): void {
    const document = this.plugin.currentDocument;
    if (!document) {
      return;
    }
    for (const comment of document.comments) {
      this.expandedCommentIds.add(comment.id);
    }
    void this.render();
  }

  collapseAll(): void {
    this.expandedCommentIds.clear();
    void this.render();
  }

  async render(): Promise<void> {
    const content = this.getContentEl();
    content.empty();
    content.addClass("side-comments-sidebar");

    const header = content.createDiv({ cls: "side-comments-header" });
    const titleRow = header.createDiv({ cls: "side-comments-header-title-row" });
    const titleGroup = titleRow.createDiv({ cls: "side-comments-title-group" });
    titleGroup.createDiv({ cls: "side-comments-title", text: this.plugin.t("sidebar.title") });

    const { document: doc, state: docState } = this.getDocumentState();
    const countSpan = titleGroup.createSpan({ cls: "side-comments-count" });

    const titleActions = titleRow.createDiv({ cls: "side-comments-header-actions" });

    const densityBtn = titleActions.createEl("button", {
      cls: "side-comments-header-icon-btn",
      attr: {
        type: "button",
        title: this.densityMode === "normal"
          ? this.plugin.t("sidebar.toolbar.densityCompact")
          : this.plugin.t("sidebar.toolbar.densityNormal"),
        "aria-label": this.densityMode === "normal"
          ? this.plugin.t("sidebar.toolbar.densityCompact")
          : this.plugin.t("sidebar.toolbar.densityNormal")
      }
    });
    setIcon(densityBtn, this.densityMode === "normal" ? "minimize-2" : "maximize-2");
    densityBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.densityMode = this.densityMode === "normal" ? "compact" : "normal";
      void this.render();
    });

    const marksToggle = titleActions.createEl("button", {
      cls: "side-comments-header-icon-btn",
      attr: {
        type: "button",
        title: this.plugin.areAnnotationMarksHidden() ? this.plugin.t("marks.show") : this.plugin.t("marks.hide"),
        "aria-label": this.plugin.areAnnotationMarksHidden() ? this.plugin.t("marks.show") : this.plugin.t("marks.hide")
      }
    });
    setIcon(marksToggle, this.plugin.areAnnotationMarksHidden() ? "eye-off" : "eye");
    marksToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.plugin.toggleAnnotationMarksHidden();
    });

    const headerOverflow = titleActions.createEl("button", {
      cls: "side-comments-header-icon-btn",
      attr: {
        type: "button",
        title: this.plugin.t("toolbar.more"),
        "aria-label": this.plugin.t("toolbar.more")
      }
    });
    setIcon(headerOverflow, "more-horizontal");
    headerOverflow.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.openHeaderMenu(event);
    });

    const filterRow = header.createDiv({ cls: "side-comments-filter-chip-row" });

    createFilterChip(filterRow, {
      label: this.plugin.t("filter.status.label"),
      valueLabel: this.statusFilter === "all" ? undefined : this.plugin.t(`filter.status.${this.statusFilter}` as TranslationKey),
      active: this.statusFilter !== "all",
      onClick: (event) => {
        const menu = new Menu();
        for (const [value, labelKey] of [
          ["all", "filter.status.all"],
          ["active", "filter.status.active"],
          ["resolved", "filter.status.resolved"],
          ["orphaned", "filter.status.orphaned"]
        ] as const) {
          menu.addItem((item) => {
            item.setTitle(this.plugin.t(labelKey))
              .setChecked(this.statusFilter === value)
              .onClick(() => this.setStatusFilter(value));
          });
        }
        showMenuAtEventTarget(menu, event);
      }
    });

    createFilterChip(filterRow, {
      label: this.plugin.t("filter.type.label"),
      valueLabel: this.markFilter === "all" ? undefined : this.plugin.t(`filter.type.${this.markFilter}` as TranslationKey),
      active: this.markFilter !== "all",
      onClick: (event) => {
        const menu = new Menu();
        for (const [value, labelKey] of [
          ["all", "filter.type.all"],
          ["highlight", "filter.type.highlight"],
          ["underline", "filter.type.underline"],
          ["strikethrough", "filter.type.strikethrough"]
        ] as const) {
          menu.addItem((item) => {
            item.setTitle(this.plugin.t(labelKey))
              .setChecked(this.markFilter === value)
              .onClick(() => this.setMarkFilter(value));
          });
        }
        showMenuAtEventTarget(menu, event);
      }
    });

    createFilterChip(filterRow, {
      label: this.plugin.t("filter.noteState.label"),
      valueLabel: this.noteStateFilter === "all" ? undefined : this.plugin.t(`filter.noteState.${this.noteStateFilter.replace("-", "")}` as TranslationKey),
      active: this.noteStateFilter !== "all",
      onClick: (event) => {
        const menu = new Menu();
        for (const [value, labelKey] of [
          ["all", "filter.noteState.all"],
          ["has-note", "filter.noteState.hasNote"],
          ["no-note", "filter.noteState.noNote"]
        ] as const) {
          menu.addItem((item) => {
            item.setTitle(this.plugin.t(labelKey))
              .setChecked(this.noteStateFilter === value)
              .onClick(() => this.setNoteStateFilter(value));
          });
        }
        showMenuAtEventTarget(menu, event);
      }
    });

    createFilterChip(filterRow, {
      label: this.plugin.t("filter.color.label"),
      valueLabel: this.colorFilter === "all" ? undefined : this.plugin.t(`filter.color.${this.colorFilter}` as TranslationKey),
      active: this.colorFilter !== "all",
      onClick: (event) => {
        const menu = new Menu();
        for (const [value, labelKey] of [
          ["all", "filter.color.all"],
          ["yellow", "filter.color.yellow"],
          ["blue", "filter.color.blue"],
          ["red", "filter.color.red"],
          ["green", "filter.color.green"],
          ["purple", "filter.color.purple"]
        ] as const) {
          menu.addItem((item) => {
            item.setTitle(this.plugin.t(labelKey))
              .setChecked(this.colorFilter === value)
              .onClick(() => this.setColorFilter(value));
          });
        }
        showMenuAtEventTarget(menu, event);
      }
    });

    if (doc) {
      const availableTags = collectAnnotationTags(doc.comments);
      if (availableTags.length > 0) {
        const tagFilterActive = this.tagFilters.size > 0;
        createFilterChip(filterRow, {
          label: this.plugin.t("filter.tag.label"),
          valueLabel: tagFilterActive ? `${this.tagFilters.size}` : undefined,
          active: tagFilterActive,
          onClick: (event) => {
            const anchor = event.currentTarget instanceof HTMLElement
              ? event.currentTarget
              : (event.target as HTMLElement).closest("button") ?? (event.target as HTMLElement);
            const close = openMultiSelectPopup({
              anchor,
              items: availableTags.map((tag) => ({ key: normalizeTagKey(tag), label: tag })),
              selected: this.tagFilters,
              searchPlaceholder: this.plugin.t("filter.tag.search"),
              onChange: (next) => {
                this.tagFilters.clear();
                for (const key of next) {
                  this.tagFilters.add(key);
                }
                void this.render();
              }
            });
            void close;
          }
        });
      }
    }

    if (this.hasActiveFilters()) {
      createIconButton(filterRow, "x", this.plugin.t("filter.clear"), () => {
        this.clearFilters();
      });
    }

    const searchRow = header.createDiv({ cls: "side-comments-toolbar-row" });
    const searchInput = searchRow.createEl("input", {
      attr: {
        type: "search",
        placeholder: this.plugin.t("filter.search.placeholder")
      }
    });
    searchInput.value = this.searchQuery;
    searchInput.addEventListener("input", () => {
      this.setSearchQuery(searchInput.value);
    });

    if (docState === "failed") {
      header.createDiv({ cls: "side-comments-subtitle", text: this.plugin.t("empty.readFailed") });
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.readFailed") });
      return;
    }

    if (!doc) {
      header.createDiv({ cls: "side-comments-subtitle", text: this.plugin.t("sidebar.noCurrentDocument") });
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.noMarkdownFile") });
      return;
    }

    const document = doc;
    const availableTags = collectAnnotationTags(document.comments);

    const filtered = this.getFilteredComments(document.comments);
    const countText = this.hasActiveFilters()
      ? `${filtered.length} / ${document.comments.length}`
      : String(document.comments.length);
    countSpan.setText(countText);
    header.createDiv({
      cls: "side-comments-subtitle",
      text: this.buildSubtitle(document.comments.length, filtered.length)
    });

    if (document.comments.length === 0) {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.noComments") });
      return;
    }

    if (filtered.length === 0) {
      const empty = content.createDiv({ cls: "side-comments-empty" });
      empty.createDiv({ text: this.plugin.t("empty.noMatches") });
      if (this.hasActiveFilters()) {
        createToolbarButton(empty, this.plugin.t("filter.clear"), this.plugin.t("filter.clear"), () => {
          this.clearFilters();
        });
      }
      return;
    }

    for (const comment of filtered) {
      const card = renderCommentCard(content, comment, {
        t: this.plugin.t,
        expanded: this.isCommentExpanded(comment),
        editing: this.editingCommentId === comment.id,
        editMode: this.editingCommentId === comment.id ? this.editMode : null,
        flash: this.focusedCommentId === comment.id,
        draft: this.drafts.get(comment.id) ?? draftFromComment(comment),
        density: this.densityMode,
        tagSuggestions: availableTags,
        onToggleExpand: (commentId) => {
          if (this.expandedCommentIds.has(commentId)) {
            this.expandedCommentIds.delete(commentId);
          } else {
            this.expandedCommentIds.add(commentId);
          }
          void this.render();
        },
        onBeginEdit: (commentId, mode) => {
          this.beginEdit(commentId, mode);
        },
        onCancelEdit: (commentId) => {
          this.cancelEdit(commentId);
        },
        onSave: (commentId, draft) => {
          this.drafts.set(commentId, draft);
          void this.saveEdit(commentId, draft);
        },
        onDelete: (commentId) => {
          void this.deleteComment(commentId);
        },
        onToggleStatus: (commentId, status) => {
          void this.toggleStatus(commentId, status);
        },
        onJump: (commentId) => {
          void this.jumpToComment(commentId);
        },
        onRebind: (commentId) => {
          void this.rebindComment(commentId);
        },
        onAdjustRange: (commentId) => {
          void this.adjustCommentRange(commentId);
        },
        onDraftChange: (commentId, draft) => {
          this.updateDraft(commentId, draft);
        },
        onTagsChange: (commentId, tags) => {
          void this.updateTags(commentId, tags);
        }
      });

      if (this.focusedCommentId === comment.id) {
        requestAnimationFrame(() => {
          card.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      }
    }
  }

  private openHeaderMenu(event: MouseEvent): void {
    const menu = new Menu();
    menu.addItem((item) => {
      item
        .setTitle(this.plugin.t("action.expand"))
        .setIcon("chevrons-up-down")
        .onClick(() => this.expandAll());
    });
    menu.addItem((item) => {
      item
        .setTitle(this.plugin.t("action.collapse"))
        .setIcon("chevrons-down-up")
        .onClick(() => this.collapseAll());
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(this.plugin.t("export.format.json"))
        .setIcon("file-json")
        .onClick(() => void this.plugin.exportCurrentNoteAnnotations("json"));
    });
    menu.addItem((item) => {
      item
        .setTitle(this.plugin.t("export.format.markdown"))
        .setIcon("file-text")
        .onClick(() => void this.plugin.exportCurrentNoteAnnotations("markdown"));
    });
    menu.addItem((item) => {
      item
        .setTitle(this.plugin.t("draft.copy"))
        .setIcon("clipboard-copy")
        .onClick(() => void this.copyCurrentDraft());
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle(this.plugin.t("sidebar.toolbar.refresh"))
        .setIcon("refresh-cw")
        .onClick(() => void this.render());
    });
    menu.addItem((item) => {
      item
        .setTitle(this.plugin.t("sidebar.toolbar.openSettings"))
        .setIcon("settings")
        .onClick(() => {
          (this.plugin as any).app.setting.open();
          (this.plugin as any).app.setting.openTabById(this.plugin.manifest.id);
        });
    });
    showMenuAtEventTarget(menu, event);
  }

  private getContentEl(): HTMLElement {
    return this.containerEl.children[1] as HTMLElement;
  }

  private getDocumentState(): { document: SideCommentsPlugin["currentDocument"]; state: "ready" | "none" | "failed" } {
    if (this.plugin.currentDocumentLoadState === "failed") {
      return { document: null, state: "failed" };
    }
    if (!this.plugin.currentDocument) {
      return { document: null, state: "none" };
    }
    return { document: this.plugin.currentDocument, state: "ready" };
  }

  private getFilteredComments(comments: SideComment[]): SideComment[] {
    const query = this.searchQuery.trim().toLowerCase();
    const normalizedTagFilters = new Set(this.tagFilters);
    const matches = comments.filter((comment) => {
      if (this.colorFilter !== "all" && comment.mark.color !== this.colorFilter) {
        return false;
      }
      if (this.statusFilter !== "all" && comment.status !== this.statusFilter) {
        return false;
      }
      if (this.markFilter !== "all") {
        if (this.markFilter === "comment") {
          if (!hasNoteContent(comment)) return false;
        } else if (comment.mark.type !== this.markFilter) {
          return false;
        }
      }
      if (!matchesNoteStateFilter(comment, this.noteStateFilter)) {
        return false;
      }
      if (!hasAnyNormalizedTag(comment, normalizedTagFilters)) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        comment.anchor.selectedText.toLowerCase().includes(query) ||
        comment.note.content.toLowerCase().includes(query) ||
        normalizeTags(comment.tags).some((tag) => tag.toLowerCase().includes(query))
      );
    });

    return sortComments(matches);
  }

  private isCommentVisible(comment: SideComment): boolean {
    return this.getFilteredComments([comment]).length > 0;
  }

  isCommentIdVisible(commentId: string): boolean {
    const comment = this.findComment(commentId);
    return comment ? this.isCommentVisible(comment) : true;
  }

  private isCommentExpanded(comment: SideComment): boolean {
    if (this.editingCommentId === comment.id) {
      return true;
    }
    return this.expandedCommentIds.has(comment.id);
  }

  private buildSubtitle(total: number, visible: number): string {
    if (this.hasActiveFilters()) {
      return this.plugin.t("sidebar.subtitle.filtered", { total, visible });
    }
    return this.plugin.t("sidebar.subtitle.total", { total });
  }

  private hasActiveFilters(): boolean {
    return Boolean(this.searchQuery.trim()) ||
      this.colorFilter !== "all" ||
      this.statusFilter !== "all" ||
      this.markFilter !== "all" ||
      this.noteStateFilter !== "all" ||
      this.tagFilters.size > 0;
  }

  private clearFilters(): void {
    this.searchQuery = "";
    this.colorFilter = "all";
    this.statusFilter = "all";
    this.markFilter = "all";
    this.noteStateFilter = "all";
    this.tagFilters.clear();
    void this.render();
  }

  private async copyCurrentDraft(): Promise<void> {
    const { document } = this.getDocumentState();
    const comments = document ? this.getFilteredComments(document.comments) : [];
    await this.plugin.copyAnnotationDraft(document ? [{ filePath: document.filePath, comments }] : []);
  }

  private findComment(commentId: string): SideComment | null {
    return this.plugin.currentDocument?.comments.find((comment) => comment.id === commentId) ?? null;
  }

  private flashComment(commentId: string): void {
    this.focusedCommentId = commentId;
    void this.render();
    if (this.flashTimer !== null) {
      window.clearTimeout(this.flashTimer);
    }
    this.flashTimer = window.setTimeout(() => {
      if (this.focusedCommentId === commentId) {
        this.focusedCommentId = null;
        void this.render();
      }
    }, 1500);
  }

  private scrollToComment(commentId: string): void {
    requestAnimationFrame(() => {
      const content = this.getContentEl();
      const card = content.querySelector<HTMLElement>(`[data-comment-id="${CSS.escape(commentId)}"]`);
      card?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
}

function draftFromComment(comment: SideComment): CommentDraft {
  return {
    noteContent: comment.note.content,
    markType: comment.mark.type,
    color: comment.mark.color,
    status: comment.status === "orphaned" ? "active" : comment.status,
    tags: normalizeTags(comment.tags)
  };
}
