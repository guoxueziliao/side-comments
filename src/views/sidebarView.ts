import { ItemView, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import { sortComments } from "../storage/migration";
import type {
  ColorFilter,
  CommentDraft,
  MarkFilter,
  SidebarDisplayMode,
  StatusFilter,
  SideComment
} from "../types";
import { renderCommentCard } from "./commentCard";

export const SIDE_COMMENTS_VIEW_TYPE = "side-comments-view";

export class SideCommentsSidebarView extends ItemView {
  private readonly collapsedCommentIds = new Set<string>();
  private readonly expandedCompactCommentIds = new Set<string>();
  private readonly expandedResolvedCommentIds = new Set<string>();
  private readonly drafts = new Map<string, CommentDraft>();
  private focusedCommentId: string | null = null;
  private editingCommentId: string | null = null;
  private flashTimer: number | null = null;
  private searchQuery = "";
  private markFilter: MarkFilter = "all";
  private colorFilter: ColorFilter = "all";
  private statusFilter: StatusFilter = "all";

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

  setMarkFilter(value: MarkFilter): void {
    this.markFilter = value;
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

  async setDisplayMode(value: SidebarDisplayMode): Promise<void> {
    this.plugin.settings.sidebarDisplayMode = value;
    await this.plugin.saveSettings();
  }

  async setShowResolvedComments(value: boolean): Promise<void> {
    this.plugin.settings.showResolvedComments = value;
    await this.plugin.saveSettings();
  }

  focusComment(commentId: string, edit = false): void {
    this.focusedCommentId = commentId;
    this.collapsedCommentIds.delete(commentId);
    this.expandedCompactCommentIds.add(commentId);
    const comment = this.findComment(commentId);
    if (comment?.status === "resolved") {
      this.expandedResolvedCommentIds.add(commentId);
    }
    if (edit) {
      this.editingCommentId = commentId;
      if (!this.drafts.has(commentId)) {
        if (comment) {
          this.drafts.set(commentId, draftFromComment(comment));
        }
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
    this.collapsedCommentIds.delete(commentId);
    this.expandedCompactCommentIds.add(commentId);
    if (comment.status === "resolved") {
      this.expandedResolvedCommentIds.add(commentId);
    }
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
      status: draft.status
    });

    this.drafts.delete(commentId);
    this.editingCommentId = null;
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();
  }

  async toggleStatus(commentId: string, nextStatus: SideComment["status"]): Promise<void> {
    const updated = await this.plugin.setCommentStatus(commentId, nextStatus);
    this.expandedResolvedCommentIds.delete(commentId);
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
    this.collapsedCommentIds.delete(commentId);
    this.expandedCompactCommentIds.delete(commentId);
    this.expandedResolvedCommentIds.delete(commentId);
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

  async render(): Promise<void> {
    const content = this.getContentEl();
    content.empty();
    content.addClass("side-comments-sidebar");

    const header = content.createDiv({ cls: "side-comments-header" });
    header.createDiv({ cls: "side-comments-title", text: this.plugin.t("sidebar.title") });

    const preferenceRow = header.createDiv({ cls: "side-comments-toolbar-row side-comments-toolbar-row--preferences" });
    const modeGroup = preferenceRow.createDiv({ cls: "side-comments-segmented-control" });
    for (const [value, label] of [
      ["normal", this.plugin.t("sidebar.mode.normal")],
      ["compact", this.plugin.t("sidebar.mode.compact")]
    ] as const) {
      createToolbarButton(modeGroup, label, this.plugin.t("sidebar.mode.switch", { label }), () => {
        void this.setDisplayMode(value);
      }, this.plugin.settings.sidebarDisplayMode === value);
    }
    createToolbarButton(
      preferenceRow,
      this.plugin.t("filter.status.resolved"),
      this.plugin.settings.showResolvedComments ? this.plugin.t("sidebar.hideResolved") : this.plugin.t("sidebar.showResolved"),
      () => {
        void this.setShowResolvedComments(!this.plugin.settings.showResolvedComments);
      },
      this.plugin.settings.showResolvedComments
    );
    createToolbarButton(
      preferenceRow,
      this.plugin.areAnnotationMarksHidden() ? this.plugin.t("marks.show") : this.plugin.t("marks.hide"),
      this.plugin.areAnnotationMarksHidden() ? this.plugin.t("marks.show") : this.plugin.t("marks.hide"),
      () => {
        this.plugin.toggleAnnotationMarksHidden();
      }
    );

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

    const markSelect = searchRow.createEl("select");
    for (const [value, label] of [
      ["all", this.plugin.t("filter.type.all")],
      ["highlight", this.plugin.t("filter.type.highlight")],
      ["underline", this.plugin.t("filter.type.underline")],
      ["strikethrough", this.plugin.t("filter.type.strikethrough")],
      ["comment", this.plugin.t("filter.type.comment")]
    ] as const) {
      const option = markSelect.createEl("option", { text: label });
      option.value = value;
    }
    markSelect.value = this.markFilter;
    markSelect.addEventListener("change", () => {
      this.setMarkFilter(markSelect.value as MarkFilter);
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

    if (this.hasActiveFilters()) {
      createToolbarButton(searchRow, this.plugin.t("filter.clear.short"), this.plugin.t("filter.clear"), () => {
        this.clearFilters();
      });
    }

    const { document, state } = this.getDocumentState();
    if (state === "failed") {
      header.createDiv({ cls: "side-comments-subtitle", text: this.plugin.t("empty.crossNote.readFailed") });
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.readFailed") });
      return;
    }

    if (!document) {
      header.createDiv({ cls: "side-comments-subtitle", text: this.plugin.t("sidebar.noCurrentDocument") });
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.noMarkdownFile") });
      return;
    }

    const filtered = this.getFilteredComments(document.comments);
    const hiddenResolvedOnly = this.hasOnlyHiddenResolvedMatches(document.comments);
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
      empty.createDiv({ text: hiddenResolvedOnly ? this.plugin.t("empty.resolvedHidden") : this.plugin.t("empty.noMatches") });
      if (hiddenResolvedOnly) {
        createToolbarButton(empty, this.plugin.t("sidebar.showResolved"), this.plugin.t("sidebar.showResolved"), () => {
          void this.setShowResolvedComments(true);
        });
      } else if (this.hasActiveFilters()) {
        createToolbarButton(empty, this.plugin.t("filter.clear"), this.plugin.t("filter.clear"), () => {
          this.clearFilters();
        });
      }
      return;
    }

    for (const comment of filtered) {
      const card = renderCommentCard(content, comment, {
        t: this.plugin.t,
        displayMode: this.plugin.settings.sidebarDisplayMode,
        expanded: this.isCommentExpanded(comment),
        editing: this.editingCommentId === comment.id,
        flash: this.focusedCommentId === comment.id,
        draft: this.drafts.get(comment.id) ?? draftFromComment(comment),
        onToggleExpand: (commentId) => {
          const target = this.findComment(commentId);
          if (target?.status === "resolved") {
            if (this.expandedResolvedCommentIds.has(commentId)) {
              this.expandedResolvedCommentIds.delete(commentId);
            } else {
              this.expandedResolvedCommentIds.add(commentId);
            }
          } else if (this.plugin.settings.sidebarDisplayMode === "compact") {
            if (this.expandedCompactCommentIds.has(commentId)) {
              this.expandedCompactCommentIds.delete(commentId);
            } else {
              this.expandedCompactCommentIds.add(commentId);
            }
          } else if (this.collapsedCommentIds.has(commentId)) {
            this.collapsedCommentIds.delete(commentId);
          } else {
            this.collapsedCommentIds.add(commentId);
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
    const matches = comments.filter((comment) => {
      if (!this.plugin.settings.showResolvedComments && comment.status === "resolved") {
        return false;
      }
      if (this.markFilter !== "all" && comment.mark.type !== this.markFilter) {
        if (!(this.markFilter === "comment" && isCommentLikeMark(comment))) {
          return false;
        }
      }
      if (this.colorFilter !== "all" && comment.mark.color !== this.colorFilter) {
        return false;
      }
      if (this.statusFilter !== "all" && comment.status !== this.statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        comment.anchor.selectedText.toLowerCase().includes(query) ||
        comment.note.content.toLowerCase().includes(query)
      );
    });

    return sortComments(matches);
  }

  private hasOnlyHiddenResolvedMatches(comments: SideComment[]): boolean {
    if (this.plugin.settings.showResolvedComments) {
      return false;
    }

    const matchesBeforeResolvedVisibility = comments.filter((comment) => {
      if (this.markFilter !== "all" && comment.mark.type !== this.markFilter) {
        if (!(this.markFilter === "comment" && isCommentLikeMark(comment))) {
          return false;
        }
      }
      if (this.colorFilter !== "all" && comment.mark.color !== this.colorFilter) {
        return false;
      }
      if (this.statusFilter !== "all" && comment.status !== this.statusFilter) {
        return false;
      }

      const query = this.searchQuery.trim().toLowerCase();
      if (!query) {
        return true;
      }
      return (
        comment.anchor.selectedText.toLowerCase().includes(query) ||
        comment.note.content.toLowerCase().includes(query)
      );
    });

    return matchesBeforeResolvedVisibility.length > 0 && matchesBeforeResolvedVisibility.every((comment) => comment.status === "resolved");
  }

  private isCommentExpanded(comment: SideComment): boolean {
    if (this.editingCommentId === comment.id) {
      return true;
    }
    if (comment.status === "resolved") {
      return this.expandedResolvedCommentIds.has(comment.id);
    }
    if (this.plugin.settings.sidebarDisplayMode === "compact") {
      return this.expandedCompactCommentIds.has(comment.id);
    }
    return !this.collapsedCommentIds.has(comment.id);
  }

  private buildSubtitle(total: number, visible: number): string {
    if (this.hasActiveFilters()) {
      return this.plugin.t("sidebar.subtitle.filtered", { total, visible });
    }
    return this.plugin.t("sidebar.subtitle.total", { total });
  }

  private hasActiveFilters(): boolean {
    return Boolean(this.searchQuery.trim()) || this.markFilter !== "all" || this.colorFilter !== "all" || this.statusFilter !== "all";
  }

  private clearFilters(): void {
    this.searchQuery = "";
    this.markFilter = "all";
    this.colorFilter = "all";
    this.statusFilter = "all";
    void this.render();
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

function createToolbarButton(
  container: HTMLElement,
  label: string,
  tooltip: string,
  onClick: () => void,
  active = false
): HTMLButtonElement {
  const button = container.createEl("button", {
    cls: ["side-comments-toolbar-button", active ? "is-active" : ""].filter(Boolean).join(" "),
    attr: {
      type: "button",
      title: tooltip,
      "aria-label": tooltip
    }
  });
  button.createSpan({ cls: "side-comments-toolbar-button-label", text: label });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}

function isCommentLikeMark(comment: SideComment): boolean {
  return comment.mark.type === "highlight" && comment.mark.color === "purple";
}

function draftFromComment(comment: SideComment): CommentDraft {
  return {
    noteContent: comment.note.content,
    markType: comment.mark.type,
    color: comment.mark.color,
    status: comment.status === "orphaned" ? "active" : comment.status
  };
}
