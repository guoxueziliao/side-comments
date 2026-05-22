import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import { sortComments } from "../storage/migration";
import type { CommentDraft, CommentQuery, MarkFilter, StatusFilter, SideComment } from "../types";
import { EMPTY_STATES } from "./emptyStates";
import { renderCommentCard } from "./commentCard";

export const SIDE_COMMENTS_VIEW_TYPE = "side-comments-view";

export class SideCommentsSidebarView extends ItemView {
  private readonly collapsedCommentIds = new Set<string>();
  private readonly drafts = new Map<string, CommentDraft>();
  private focusedCommentId: string | null = null;
  private editingCommentId: string | null = null;
  private flashTimer: number | null = null;
  private searchQuery = "";
  private markFilter: MarkFilter = "all";
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

  setStatusFilter(value: StatusFilter): void {
    this.statusFilter = value;
    void this.render();
  }

  focusComment(commentId: string, edit = false): void {
    this.focusedCommentId = commentId;
    this.collapsedCommentIds.delete(commentId);
    if (edit) {
      this.editingCommentId = commentId;
      if (!this.drafts.has(commentId)) {
        const comment = this.findComment(commentId);
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
    this.plugin.setCurrentDocument(updated);
    this.plugin.refreshAllViews();
  }

  async deleteComment(commentId: string): Promise<void> {
    const confirmed = window.confirm("删除这条批注？此操作不会修改正文，但会移除对应批注数据。");
    if (!confirmed) {
      return;
    }

    const updated = await this.plugin.deleteComment(commentId);
    this.drafts.delete(commentId);
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
    header.createDiv({ cls: "side-comments-title", text: "正文批注" });

    const searchRow = header.createDiv({ cls: "side-comments-toolbar-row" });
    const searchInput = searchRow.createEl("input", {
      attr: {
        type: "search",
        placeholder: "搜索当前文档批注..."
      }
    });
    searchInput.value = this.searchQuery;
    searchInput.addEventListener("input", () => {
      this.setSearchQuery(searchInput.value);
    });

    const markSelect = searchRow.createEl("select");
    for (const [value, label] of [
      ["all", "类型：全部"],
      ["highlight", "高亮"],
      ["underline", "下划线"],
      ["strikethrough", "删除线"]
    ] as const) {
      const option = markSelect.createEl("option", { text: label });
      option.value = value;
    }
    markSelect.value = this.markFilter;
    markSelect.addEventListener("change", () => {
      this.setMarkFilter(markSelect.value as MarkFilter);
    });

    const statusSelect = searchRow.createEl("select");
    for (const [value, label] of [
      ["all", "状态：全部"],
      ["active", "未处理"],
      ["resolved", "已处理"],
      ["orphaned", "已失联"]
    ] as const) {
      const option = statusSelect.createEl("option", { text: label });
      option.value = value;
    }
    statusSelect.value = this.statusFilter;
    statusSelect.addEventListener("change", () => {
      this.setStatusFilter(statusSelect.value as StatusFilter);
    });

    const { document, state } = this.getDocumentState();
    if (state === "failed") {
      header.createDiv({ cls: "side-comments-subtitle", text: "批注数据读取失败" });
      content.createDiv({ cls: "side-comments-empty", text: EMPTY_STATES.readFailed });
      return;
    }

    if (!document) {
      header.createDiv({ cls: "side-comments-subtitle", text: "无当前文档" });
      content.createDiv({ cls: "side-comments-empty", text: EMPTY_STATES.noMarkdownFile });
      return;
    }

    const filtered = this.getFilteredComments(document.comments);
    header.createDiv({
      cls: "side-comments-subtitle",
      text: this.buildSubtitle(document.comments.length, filtered.length)
    });

    if (document.comments.length === 0) {
      content.createDiv({ cls: "side-comments-empty", text: EMPTY_STATES.noComments });
      return;
    }

    if (filtered.length === 0) {
      content.createDiv({ cls: "side-comments-empty", text: EMPTY_STATES.noMatches });
      return;
    }

    for (const comment of filtered) {
      const card = renderCommentCard(content, comment, {
        expanded: !this.collapsedCommentIds.has(comment.id) || this.editingCommentId === comment.id,
        editing: this.editingCommentId === comment.id,
        flash: this.focusedCommentId === comment.id,
        draft: this.drafts.get(comment.id) ?? draftFromComment(comment),
        onToggleExpand: (commentId) => {
          if (this.collapsedCommentIds.has(commentId)) {
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
      if (this.markFilter !== "all" && comment.mark.type !== this.markFilter) {
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

  private buildSubtitle(total: number, visible: number): string {
    const activeFilters = this.searchQuery.trim() || this.markFilter !== "all" || this.statusFilter !== "all";
    if (activeFilters) {
      return `当前文档 · 共 ${total} 条 · 当前显示 ${visible} 条`;
    }
    return `当前文档 · 共 ${total} 条批注`;
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
    status: comment.status === "orphaned" ? "active" : comment.status
  };
}
