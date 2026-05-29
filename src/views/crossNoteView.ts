import { ItemView, Menu, Notice, setIcon, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type {
  CommentDraft,
  MarkColor,
  MarkType,
  NoteStateFilter,
  RecentPreviewItem,
  SideComment,
  SideCommentStatus
} from "../types";
import { renderCommentCard } from "./commentCard";
import {
  normalizeTagKey,
  normalizeTags
} from "../organization/annotationMetadata";
import { matchesNoteStateFilter } from "../organization/annotationState";
import { createFilterChip, createToolbarButton, openMultiSelectPopup, showMenuAtEventTarget } from "./shared";

export const SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE = "side-comments-cross-note-view";

type CrossNoteLoadState = "loading" | "ready" | "missing" | "failed";
type GroupBy = "file" | "time";

interface CrossNoteResult {
  filePath: string;
  fileName: string;
  commentId: string;
  selectedTextPreview: string;
  notePreview: string;
  markType: MarkType;
  color: MarkColor;
  status: SideCommentStatus;
  tags: string[];
  commentUpdatedAt: string;
  fileUpdatedAt: string;
}

export class SideCommentsCrossNoteView extends ItemView {
  private loadState: CrossNoteLoadState = "loading";
  private results: CrossNoteResult[] = [];
  private searchQuery = "";
  private statusFilter: SideCommentStatus | "all" = "all";
  private colorFilter: MarkColor | "all" = "all";
  private noteStateFilter: NoteStateFilter = "all";
  private readonly tagFilters = new Set<string>();
  private readonly sourceFilters = new Set<string>();
  private groupBy: GroupBy = "file";
  private readonly collapsedGroups = new Set<string>();
  private readonly expandedCards = new Set<string>();

  constructor(leaf: WorkspaceLeaf, private readonly plugin: SideCommentsPlugin) {
    super(leaf);
  }

  getViewType(): string {
    return SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.plugin.t("crossNote.title");
  }

  getIcon(): string {
    return "search";
  }

  async onOpen(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.loadState = "loading";
    void this.render();

    const recent = await this.plugin.store.loadRecentPreviews();
    this.loadState = recent.state;
    this.results = flattenRecentPreviews(recent.items);
    void this.render();
  }

  async render(): Promise<void> {
    const content = this.getContentEl();
    content.empty();
    content.addClass("side-comments-cross-note");

    const header = content.createDiv({ cls: "side-comments-cross-note-header" });
    this.renderTitleRow(header);
    this.renderSearchRow(header);
    this.renderFilterChips(header);
    this.renderGroupToggle(header);

    const filtered = this.getFilteredResults();
    header.createDiv({
      cls: "side-comments-subtitle",
      text: this.plugin.t("crossNote.resultCount", { visible: filtered.length, total: this.results.length })
    });

    if (this.loadState === "loading") {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.loading") });
      return;
    }
    if (this.loadState === "failed") {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.failed") });
      return;
    }
    if (this.loadState === "missing" || this.results.length === 0) {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.missing") });
      return;
    }
    if (filtered.length === 0) {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.noMatches") });
      return;
    }

    if (this.groupBy === "file") {
      this.renderGroupedByFile(content, filtered);
    } else {
      this.renderFlat(content, filtered);
    }
  }

  private renderTitleRow(header: HTMLElement): void {
    const titleRow = header.createDiv({ cls: "side-comments-cross-note-title-row" });
    titleRow.createDiv({ cls: "side-comments-title", text: this.plugin.t("crossNote.title") });

    const actions = titleRow.createDiv({ cls: "side-comments-header-actions" });
    const copyBtn = actions.createEl("button", {
      cls: "side-comments-cross-note-copy-btn mod-cta",
      attr: { type: "button", title: this.plugin.t("draft.copyTooltip") }
    });
    setIcon(copyBtn.createSpan({ cls: "side-comments-cross-note-copy-btn-icon" }), "copy");
    copyBtn.createSpan({ text: this.plugin.t("crossNote.copyDraft") });
    copyBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void this.copyDraft(this.getFilteredResults());
    });
  }

  private renderSearchRow(header: HTMLElement): void {
    const row = header.createDiv({ cls: "side-comments-toolbar-row" });
    const searchInput = row.createEl("input", {
      cls: "side-comments-cross-note-search",
      attr: {
        type: "search",
        placeholder: this.plugin.t("filter.search.placeholder")
      }
    });
    searchInput.value = this.searchQuery;
    searchInput.addEventListener("input", () => {
      this.searchQuery = searchInput.value;
      void this.render();
    });
  }

  private renderFilterChips(header: HTMLElement): void {
    const row = header.createDiv({ cls: "side-comments-cross-note-chip-row" });

    createFilterChip(row, {
      label: this.plugin.t("filter.status.label"),
      valueLabel: this.statusFilter === "all" ? this.plugin.t("filter.status.all") : statusLabelLocal(this.statusFilter, this.plugin),
      active: this.statusFilter !== "all",
      onClick: (event) => this.openStatusMenu(event)
    });

    createFilterChip(row, {
      label: this.plugin.t("filter.color.label"),
      valueLabel: this.colorFilter === "all" ? this.plugin.t("filter.color.all") : colorLabelLocal(this.colorFilter, this.plugin),
      active: this.colorFilter !== "all",
      onClick: (event) => this.openColorMenu(event)
    });

    createFilterChip(row, {
      label: this.plugin.t("filter.noteState.label"),
      valueLabel: this.noteStateFilter === "all" ? this.plugin.t("filter.noteState.all") : this.plugin.t(`filter.noteState.${this.noteStateFilter === "has-note" ? "hasNote" : "noNote"}`),
      active: this.noteStateFilter !== "all",
      onClick: (event) => this.openNoteStateMenu(event)
    });

    const tagSummary = this.tagFilters.size === 0
      ? this.plugin.t("filter.tags.all")
      : `${this.tagFilters.size}`;
    const tagChip = createFilterChip(row, {
      label: this.plugin.t("filter.tag.label"),
      valueLabel: tagSummary,
      active: this.tagFilters.size > 0,
      onClick: () => this.openTagPopup(tagChip)
    });

    const sourceSummary = this.sourceFilters.size === 0
      ? this.plugin.t("filter.source.all")
      : `${this.sourceFilters.size}`;
    const sourceChip = createFilterChip(row, {
      label: this.plugin.t("filter.source.label"),
      valueLabel: sourceSummary,
      active: this.sourceFilters.size > 0,
      onClick: () => this.openSourcePopup(sourceChip)
    });

    if (this.hasActiveFilters()) {
      createToolbarButton(row, this.plugin.t("filter.clear.short"), this.plugin.t("filter.clear"), () => this.clearFilters());
    }
  }

  private renderGroupToggle(header: HTMLElement): void {
    const row = header.createDiv({ cls: "side-comments-cross-note-group-toggle" });
    createToolbarButton(
      row,
      this.plugin.t("crossNote.groupBy.file"),
      this.plugin.t("crossNote.groupBy.file"),
      () => {
        this.groupBy = "file";
        void this.render();
      },
      this.groupBy === "file"
    );
    createToolbarButton(
      row,
      this.plugin.t("crossNote.groupBy.time"),
      this.plugin.t("crossNote.groupBy.time"),
      () => {
        this.groupBy = "time";
        void this.render();
      },
      this.groupBy === "time"
    );
  }

  private renderGroupedByFile(content: HTMLElement, results: CrossNoteResult[]): void {
    const groups = new Map<string, CrossNoteResult[]>();
    for (const result of results) {
      if (!groups.has(result.filePath)) {
        groups.set(result.filePath, []);
      }
      groups.get(result.filePath)!.push(result);
    }

    for (const [filePath, groupResults] of groups) {
      const fileName = groupResults[0].fileName;
      const groupEl = content.createDiv({ cls: "side-comments-cross-note-group" });
      const groupHeader = groupEl.createDiv({ cls: "side-comments-cross-note-group-header" });
      groupHeader.addEventListener("click", (event) => {
        if (event.target instanceof HTMLElement && event.target.closest(".side-comments-cross-note-group-open")) {
          return;
        }
        this.toggleGroupCollapsed(filePath);
      });

      const caret = groupHeader.createSpan({ cls: "side-comments-cross-note-group-caret" });
      setIcon(caret, this.collapsedGroups.has(filePath) ? "chevron-right" : "chevron-down");

      const title = groupHeader.createSpan({ cls: "side-comments-cross-note-group-title" });
      title.setText(fileName);
      title.setAttr("title", filePath);

      groupHeader.createSpan({
        cls: "side-comments-cross-note-group-count",
        text: this.plugin.t("crossNote.group.count", { count: groupResults.length })
      });

      this.renderStatusDistribution(groupHeader, groupResults);

      const openBtn = groupHeader.createEl("button", {
        cls: "side-comments-cross-note-group-open",
        attr: { type: "button", title: this.plugin.t("crossNote.group.open") }
      });
      openBtn.setText(this.plugin.t("crossNote.group.open"));
      openBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        void this.plugin.openSourceDocument(filePath);
      });

      if (this.collapsedGroups.has(filePath)) {
        continue;
      }

      const body = groupEl.createDiv({ cls: "side-comments-cross-note-group-body" });
      for (const result of groupResults) {
        this.renderResultCard(body, result);
      }
    }
  }

  private renderFlat(content: HTMLElement, results: CrossNoteResult[]): void {
    const sorted = [...results].sort((a, b) => (b.commentUpdatedAt || b.fileUpdatedAt).localeCompare(a.commentUpdatedAt || a.fileUpdatedAt));
    for (const result of sorted) {
      this.renderResultCard(content, result);
    }
  }

  private renderResultCard(container: HTMLElement, result: CrossNoteResult): void {
    const comment = previewAsSideComment(result);
    const draft = draftFromComment(comment);
    renderCommentCard(container, comment, {
      t: this.plugin.t,
      expanded: this.expandedCards.has(result.commentId),
      editing: false,
      editMode: null,
      flash: false,
      draft,
      density: "normal",
      tagSuggestions: [],
      filenamePrefix: { name: result.fileName, fullPath: result.filePath },
      onJump: (commentId) => {
        void this.plugin.openSourceComment(result.filePath, commentId);
      },
      onToggleExpand: (commentId) => {
        if (this.expandedCards.has(commentId)) {
          this.expandedCards.delete(commentId);
        } else {
          this.expandedCards.add(commentId);
        }
        void this.render();
      },
      extraMenuItems: (menu) => {
        menu.addItem((item) => {
          item.setTitle(this.plugin.t("crossNote.openSourceMenuItem"))
            .setIcon("file-text")
            .onClick(() => {
              void this.plugin.openSourceDocument(result.filePath);
            });
        });
        menu.addItem((item) => {
          item.setTitle(this.plugin.t("crossNote.revealCardMenuItem"))
            .setIcon("crosshair")
            .onClick(() => {
              void this.plugin.openSourceComment(result.filePath, result.commentId);
            });
        });
      }
    });
  }

  private renderStatusDistribution(container: HTMLElement, results: CrossNoteResult[]): void {
    const counts = { active: 0, resolved: 0, orphaned: 0 };
    for (const r of results) {
      counts[r.status] += 1;
    }
    const wrapper = container.createSpan({ cls: "side-comments-cross-note-group-status" });
    for (const [status, count] of [
      ["active", counts.active],
      ["resolved", counts.resolved],
      ["orphaned", counts.orphaned]
    ] as const) {
      if (count === 0) continue;
      const span = wrapper.createSpan({ cls: `side-comments-cross-note-status-pill side-comments-cross-note-status-pill--${status}` });
      span.createSpan({ cls: "side-comments-cross-note-status-dot" });
      span.createSpan({ text: String(count) });
    }
  }

  private openStatusMenu(event: MouseEvent): void {
    const menu = new Menu();
    const options: { value: SideCommentStatus | "all"; label: string }[] = [
      { value: "all", label: this.plugin.t("filter.status.all") },
      { value: "active", label: this.plugin.t("filter.status.active") },
      { value: "resolved", label: this.plugin.t("filter.status.resolved") },
      { value: "orphaned", label: this.plugin.t("filter.status.orphaned") }
    ];
    for (const opt of options) {
      menu.addItem((item) => {
        item.setTitle(opt.label)
          .setChecked(this.statusFilter === opt.value)
          .onClick(() => {
            this.statusFilter = opt.value;
            void this.render();
          });
      });
    }
    showMenuAtEventTarget(menu, event);
  }

  private openColorMenu(event: MouseEvent): void {
    const menu = new Menu();
    const options: { value: MarkColor | "all"; label: string }[] = [
      { value: "all", label: this.plugin.t("filter.color.all") },
      { value: "yellow", label: this.plugin.t("filter.color.yellow") },
      { value: "blue", label: this.plugin.t("filter.color.blue") },
      { value: "red", label: this.plugin.t("filter.color.red") },
      { value: "green", label: this.plugin.t("filter.color.green") },
      { value: "purple", label: this.plugin.t("filter.color.purple") }
    ];
    for (const opt of options) {
      menu.addItem((item) => {
        item.setTitle(opt.label)
          .setChecked(this.colorFilter === opt.value)
          .onClick(() => {
            this.colorFilter = opt.value;
            void this.render();
          });
      });
    }
    showMenuAtEventTarget(menu, event);
  }

  private openNoteStateMenu(event: MouseEvent): void {
    const menu = new Menu();
    const options: { value: NoteStateFilter; labelKey: "filter.noteState.all" | "filter.noteState.hasNote" | "filter.noteState.noNote" }[] = [
      { value: "all", labelKey: "filter.noteState.all" },
      { value: "has-note", labelKey: "filter.noteState.hasNote" },
      { value: "no-note", labelKey: "filter.noteState.noNote" }
    ];
    for (const opt of options) {
      menu.addItem((item) => {
        item.setTitle(this.plugin.t(opt.labelKey))
          .setChecked(this.noteStateFilter === opt.value)
          .onClick(() => {
            this.noteStateFilter = opt.value;
            void this.render();
          });
      });
    }
    showMenuAtEventTarget(menu, event);
  }

  private openTagPopup(anchor: HTMLElement): void {
    const tags = this.getAvailableTags();
    if (tags.length === 0) {
      const menu = new Menu();
      menu.addItem((item) => item.setTitle(this.plugin.t("tags.autocompleteEmpty")).setDisabled(true));
      const rect = anchor.getBoundingClientRect();
      menu.showAtPosition({ x: rect.left, y: rect.bottom + 4 });
      return;
    }
    openMultiSelectPopup({
      anchor,
      items: tags.map((tag) => ({ key: normalizeTagKey(tag), label: tag })),
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
  }

  private openSourcePopup(anchor: HTMLElement): void {
    const files = Array.from(new Set(this.results.map((r) => r.filePath)))
      .sort()
      .map((filePath) => ({
        key: filePath,
        label: filePath.split("/").pop() ?? filePath
      }));
    openMultiSelectPopup({
      anchor,
      items: files,
      selected: this.sourceFilters,
      searchPlaceholder: this.plugin.t("filter.source.search"),
      onChange: (next) => {
        this.sourceFilters.clear();
        for (const key of next) {
          this.sourceFilters.add(key);
        }
        void this.render();
      }
    });
  }

  private toggleGroupCollapsed(filePath: string): void {
    if (this.collapsedGroups.has(filePath)) {
      this.collapsedGroups.delete(filePath);
    } else {
      this.collapsedGroups.add(filePath);
    }
    void this.render();
  }

  private clearFilters(): void {
    this.searchQuery = "";
    this.statusFilter = "all";
    this.colorFilter = "all";
    this.noteStateFilter = "all";
    this.tagFilters.clear();
    this.sourceFilters.clear();
    void this.render();
  }

  private hasActiveFilters(): boolean {
    return Boolean(
      this.searchQuery.trim() ||
      this.statusFilter !== "all" ||
      this.colorFilter !== "all" ||
      this.noteStateFilter !== "all" ||
      this.tagFilters.size > 0 ||
      this.sourceFilters.size > 0
    );
  }

  private getFilteredResults(): CrossNoteResult[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.results.filter((result) => {
      if (this.statusFilter !== "all" && result.status !== this.statusFilter) return false;
      if (this.colorFilter !== "all" && result.color !== this.colorFilter) return false;
      if (this.noteStateFilter !== "all") {
        const hasNote = result.notePreview.trim().length > 0;
        if (this.noteStateFilter === "has-note" ? !hasNote : hasNote) return false;
      }
      if (this.tagFilters.size > 0 && !result.tags.some((tag) => this.tagFilters.has(normalizeTagKey(tag)))) {
        return false;
      }
      if (this.sourceFilters.size > 0 && !this.sourceFilters.has(result.filePath)) return false;
      if (!query) return true;
      return (
        result.selectedTextPreview.toLowerCase().includes(query) ||
        result.notePreview.toLowerCase().includes(query) ||
        result.filePath.toLowerCase().includes(query) ||
        result.fileName.toLowerCase().includes(query) ||
        result.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }

  private getAvailableTags(): string[] {
    return normalizeTags(this.results.flatMap((r) => r.tags)).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }

  private async copyDraft(results: CrossNoteResult[]): Promise<void> {
    if (results.length === 0) {
      new Notice(this.plugin.t("draft.empty"));
      return;
    }
    const grouped = new Map<string, SideComment[]>();
    for (const result of results) {
      const document = await this.plugin.store.loadDocument(result.filePath);
      const comment = document.comments.find((item) => item.id === result.commentId);
      if (!comment) continue;
      grouped.set(result.filePath, [...(grouped.get(result.filePath) ?? []), comment]);
    }
    await this.plugin.copyAnnotationDraft([...grouped.entries()].map(([filePath, comments]) => ({ filePath, comments })));
  }

  private getContentEl(): HTMLElement {
    return this.containerEl.children[1] as HTMLElement;
  }
}

function flattenRecentPreviews(items: RecentPreviewItem[]): CrossNoteResult[] {
  const results: CrossNoteResult[] = [];
  for (const item of items) {
    const fileName = item.filePath.split("/").pop() ?? item.filePath;
    for (const preview of item.preview) {
      results.push({
        filePath: item.filePath,
        fileName,
        commentId: preview.id,
        selectedTextPreview: preview.selectedTextPreview,
        notePreview: preview.notePreview,
        markType: preview.markType,
        color: preview.color,
        status: preview.status,
        tags: normalizeTags(preview.tags),
        commentUpdatedAt: preview.updatedAt || item.updatedAt,
        fileUpdatedAt: item.updatedAt
      });
    }
  }
  return results;
}

function previewAsSideComment(result: CrossNoteResult): SideComment {
  return {
    id: result.commentId,
    anchor: {
      startOffset: 0,
      endOffset: 0,
      selectedText: result.selectedTextPreview,
      prefix: "",
      suffix: ""
    },
    mark: { type: result.markType, color: result.color },
    tags: result.tags,
    note: {
      content: result.notePreview,
      createdAt: result.commentUpdatedAt,
      updatedAt: result.commentUpdatedAt
    },
    status: result.status
  };
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

function statusLabelLocal(status: SideCommentStatus, plugin: SideCommentsPlugin): string {
  if (status === "active") return plugin.t("filter.status.active");
  if (status === "resolved") return plugin.t("filter.status.resolved");
  return plugin.t("filter.status.orphaned");
}

function colorLabelLocal(color: MarkColor, plugin: SideCommentsPlugin): string {
  if (color === "yellow") return plugin.t("filter.color.yellow");
  if (color === "blue") return plugin.t("filter.color.blue");
  if (color === "red") return plugin.t("filter.color.red");
  if (color === "green") return plugin.t("filter.color.green");
  return plugin.t("filter.color.purple");
}
