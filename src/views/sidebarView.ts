import { ItemView, Menu, setIcon, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import { sortComments } from "../storage/migration";
import type {
  AnnotationType,
  ColorFilter,
  CommentDraft,
  StatusFilter,
  SideComment
} from "../types";
import { renderCommentCard } from "./commentCard";
import {
  ANNOTATION_TYPES,
  annotationTypeLabel,
  collectAnnotationTags,
  getAnnotationType,
  hasAnyNormalizedTag,
  normalizeTagKey,
  normalizeTags
} from "../organization/annotationMetadata";
import { createToolbarButton } from "./shared";

export const SIDE_COMMENTS_VIEW_TYPE = "side-comments-view";

export class SideCommentsSidebarView extends ItemView {
  private readonly expandedCommentIds = new Set<string>();
  private readonly drafts = new Map<string, CommentDraft>();
  private focusedCommentId: string | null = null;
  private editingCommentId: string | null = null;
  private flashTimer: number | null = null;
  private searchQuery = "";
  private colorFilter: ColorFilter = "all";
  private statusFilter: StatusFilter = "all";
  private readonly annotationTypeFilters = new Set<AnnotationType>();
  private readonly tagFilters = new Set<string>();

  constructor(leaf: WorkspaceLeaf, private readonly plugin: SideCommentsPlugin) {
    super(leaf);
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

  focusComment(commentId: string, edit = false): void {
    this.focusedCommentId = commentId;
    this.expandedCommentIds.add(commentId);
    const comment = this.findComment(commentId);
    if (edit) {
      this.editingCommentId = commentId;
      if (!this.drafts.has(commentId) && comment) {
        this.drafts.set(commentId, draftFromComment(comment));
      }
    }
    void this.render();
    this.scrollToComment(commentId);
    this.flashComment(commentId);
  }

  beginEdit(commentId: string): void {
    const comment = this.findComment(commentId);
    if (!comment) {
      return;
    }
    this.editingCommentId = commentId;
    this.expandedCommentIds.add(commentId);
    this.drafts.set(commentId, draftFromComment(comment));
    void this.render();
    this.scrollToComment(commentId);
  }

  cancelEdit(commentId: string): void {
    if (this.editingCommentId === commentId) {
      this.editingCommentId = null;
    }
    this.drafts.delete(commentId);
    void this.render();
  }

  updateDraft(commentId: string, draft: CommentDraft): void {
    this.drafts.set(commentId, draft);
  }

  async saveEdit(commentId: string, draft: CommentDraft): Promise<void> {
    const comment = this.findComment(commentId);
    if (!comment) {
      return;
    }

    const updated = await this.plugin.updateComment(commentId, {
      noteContent: draft.noteContent,
      markType: draft.markType,
      color: draft.color,
      status: draft.status,
      annotationType: draft.annotationType,
      tags: draft.tags
    });

    this.drafts.delete(commentId);
    this.editingCommentId = null;
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();
  }

  async toggleStatus(commentId: string, nextStatus: SideComment["status"]): Promise<void> {
    const updated = await this.plugin.setCommentStatus(commentId, nextStatus);
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();
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
    this.focusComment(commentId, false);
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
    titleRow.createDiv({ cls: "side-comments-title", text: this.plugin.t("sidebar.title") });

    const titleActions = titleRow.createDiv({ cls: "side-comments-header-actions" });
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

    const exportRow = header.createDiv({ cls: "side-comments-toolbar-row side-comments-toolbar-row--export" });
    createToolbarButton(exportRow, this.plugin.t("export.format.json"), this.plugin.t("export.currentNote"), () => {
      void this.plugin.exportCurrentNoteAnnotations("json");
    });
    createToolbarButton(exportRow, this.plugin.t("export.format.markdown"), this.plugin.t("export.currentNote"), () => {
      void this.plugin.exportCurrentNoteAnnotations("markdown");
    });
    createToolbarButton(exportRow, this.plugin.t("draft.copy"), this.plugin.t("draft.copyTooltip"), () => {
      void this.copyCurrentDraft();
    });

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

    const colorSelect = searchRow.createEl("select");
    for (const [value, label] of [
      ["all", this.plugin.t("filter.color.all")],
      ["yellow", this.plugin.t("filter.color.yellow")],
      ["blue", this.plugin.t("filter.color.blue")],
      ["red", this.plugin.t("filter.color.red")],
      ["green", this.plugin.t("filter.color.green")],
      ["purple", this.plugin.t("filter.color.purple")]
    ] as const) {
      const option = colorSelect.createEl("option", { text: label });
      option.value = value;
    }
    colorSelect.value = this.colorFilter;
    colorSelect.addEventListener("change", () => {
      this.setColorFilter(colorSelect.value as ColorFilter);
    });

    const statusSelect = searchRow.createEl("select");
    for (const [value, label] of [
      ["all", this.plugin.t("filter.status.all")],
      ["active", this.plugin.t("filter.status.active")],
      ["resolved", this.plugin.t("filter.status.resolved")],
      ["orphaned", this.plugin.t("filter.status.orphaned")]
    ] as const) {
      const option = statusSelect.createEl("option", { text: label });
      option.value = value;
    }
    statusSelect.value = this.statusFilter;
    statusSelect.addEventListener("change", () => {
      this.setStatusFilter(statusSelect.value as StatusFilter);
    });

    const typeFilterRow = header.createDiv({ cls: "side-comments-filter-chip-row" });
    typeFilterRow.createSpan({ cls: "side-comments-filter-chip-label", text: this.plugin.t("annotationType.placeholder") });
    for (const type of ANNOTATION_TYPES) {
      createToolbarButton(typeFilterRow, annotationTypeLabel(type, this.plugin.t), annotationTypeLabel(type, this.plugin.t), () => {
        this.toggleAnnotationTypeFilter(type);
      }, this.annotationTypeFilters.has(type));
    }

    if (this.hasActiveFilters()) {
      createToolbarButton(searchRow, this.plugin.t("filter.clear.short"), this.plugin.t("filter.clear"), () => {
        this.clearFilters();
      });
    }

    const { document, state } = this.getDocumentState();
    if (state === "failed") {
      header.createDiv({ cls: "side-comments-subtitle", text: this.plugin.t("empty.readFailed") });
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.readFailed") });
      return;
    }

    if (!document) {
      header.createDiv({ cls: "side-comments-subtitle", text: this.plugin.t("sidebar.noCurrentDocument") });
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.noMarkdownFile") });
      return;
    }

    const availableTags = collectAnnotationTags(document.comments);
    if (availableTags.length > 0) {
      const tagFilterRow = header.createDiv({ cls: "side-comments-filter-chip-row" });
      tagFilterRow.createSpan({ cls: "side-comments-filter-chip-label", text: this.plugin.t("tags.label") });
      for (const tag of availableTags) {
        createToolbarButton(tagFilterRow, tag, tag, () => {
          this.toggleTagFilter(tag);
        }, this.tagFilters.has(normalizeTagKey(tag)));
      }
    }

    const filtered = this.getFilteredComments(document.comments);
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
        flash: this.focusedCommentId === comment.id,
        draft: this.drafts.get(comment.id) ?? draftFromComment(comment),
        tagSuggestions: availableTags,
        onToggleExpand: (commentId) => {
          if (this.expandedCommentIds.has(commentId)) {
            this.expandedCommentIds.delete(commentId);
          } else {
            this.expandedCommentIds.add(commentId);
          }
          void this.render();
        },
        onBeginEdit: (commentId) => {
          this.beginEdit(commentId);
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
    menu.showAtMouseEvent(event);
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
      if (this.annotationTypeFilters.size > 0 && !this.annotationTypeFilters.has(getAnnotationType(comment))) {
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
        getAnnotationType(comment).toLowerCase().includes(query) ||
        normalizeTags(comment.tags).some((tag) => tag.toLowerCase().includes(query))
      );
    });

    return sortComments(matches);
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
      this.annotationTypeFilters.size > 0 ||
      this.tagFilters.size > 0;
  }

  private clearFilters(): void {
    this.searchQuery = "";
    this.colorFilter = "all";
    this.statusFilter = "all";
    this.annotationTypeFilters.clear();
    this.tagFilters.clear();
    void this.render();
  }

  private toggleAnnotationTypeFilter(type: AnnotationType): void {
    if (this.annotationTypeFilters.has(type)) {
      this.annotationTypeFilters.delete(type);
    } else {
      this.annotationTypeFilters.add(type);
    }
    void this.render();
  }

  private toggleTagFilter(tag: string): void {
    const key = normalizeTagKey(tag);
    if (this.tagFilters.has(key)) {
      this.tagFilters.delete(key);
    } else {
      this.tagFilters.add(key);
    }
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
    }, 1000);
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
    annotationType: getAnnotationType(comment),
    tags: normalizeTags(comment.tags)
  };
}
