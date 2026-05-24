import { ItemView, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { MarkColor, MarkFilter, MarkType, RecentPreviewItem, SideCommentStatus } from "../types";
import { colorLabel, markLabel, statusLabel } from "./commentCard";

export const SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE = "side-comments-cross-note-view";

type CrossNoteLoadState = "loading" | "ready" | "missing" | "failed";

interface CrossNoteResult {
  filePath: string;
  fileName: string;
  commentId: string;
  selectedTextPreview: string;
  notePreview: string;
  markType: MarkType;
  color: MarkColor;
  status: SideCommentStatus;
  updatedAt: string;
}

export class SideCommentsCrossNoteView extends ItemView {
  private loadState: CrossNoteLoadState = "loading";
  private results: CrossNoteResult[] = [];
  private searchQuery = "";
  private sourceFilter = "";
  private statusFilter: SideCommentStatus | "all" = "all";
  private colorFilter: MarkColor | "all" = "all";
  private typeFilter: MarkFilter = "all";

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

  setSearchQuery(value: string): void {
    this.searchQuery = value;
    void this.render();
  }

  setSourceFilter(value: string): void {
    this.sourceFilter = value;
    void this.render();
  }

  setStatusFilter(value: CrossNoteResult["status"] | "all"): void {
    this.statusFilter = value;
    void this.render();
  }

  setColorFilter(value: CrossNoteResult["color"] | "all"): void {
    this.colorFilter = value;
    void this.render();
  }

  setTypeFilter(value: MarkFilter): void {
    this.typeFilter = value;
    void this.render();
  }

  clearFilters(): void {
    this.searchQuery = "";
    this.sourceFilter = "";
    this.statusFilter = "all";
    this.colorFilter = "all";
    this.typeFilter = "all";
    void this.render();
  }

  async openSource(result: CrossNoteResult): Promise<void> {
    await this.plugin.openSourceDocument(result.filePath);
  }

  async jumpToResult(result: CrossNoteResult): Promise<void> {
    await this.plugin.openSourceComment(result.filePath, result.commentId);
  }

  async render(): Promise<void> {
    const content = this.getContentEl();
    content.empty();
    content.addClass("side-comments-cross-note");

    const header = content.createDiv({ cls: "side-comments-cross-note-header" });
    header.createDiv({ cls: "side-comments-title", text: this.plugin.t("crossNote.title") });
    header.createDiv({ cls: "side-comments-subtitle", text: this.plugin.t("crossNote.subtitle") });

    const searchRow = header.createDiv({ cls: "side-comments-toolbar-row side-comments-toolbar-row--cross-note" });
    const searchInput = searchRow.createEl("input", {
      attr: {
        type: "search",
        placeholder: this.plugin.t("filter.search.placeholder")
      }
    });
    searchInput.value = this.searchQuery;
    searchInput.addEventListener("input", () => this.setSearchQuery(searchInput.value));

    const sourceInput = searchRow.createEl("input", {
      attr: {
        type: "search",
        placeholder: this.plugin.t("filter.source.placeholder")
      }
    });
    sourceInput.value = this.sourceFilter;
    sourceInput.addEventListener("input", () => this.setSourceFilter(sourceInput.value));

    const typeSelect = searchRow.createEl("select");
    for (const [value, label] of [
      ["all", this.plugin.t("filter.type.all")],
      ["highlight", this.plugin.t("filter.type.highlight")],
      ["underline", this.plugin.t("filter.type.underline")],
      ["strikethrough", this.plugin.t("filter.type.strikethrough")],
      ["comment", this.plugin.t("filter.type.comment")]
    ] as const) {
      const option = typeSelect.createEl("option", { text: label });
      option.value = value;
    }
    typeSelect.value = this.typeFilter;
    typeSelect.addEventListener("change", () => this.setTypeFilter(typeSelect.value as MarkFilter));

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
    colorSelect.addEventListener("change", () => this.setColorFilter(colorSelect.value as CrossNoteResult["color"] | "all"));

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
    statusSelect.addEventListener("change", () => this.setStatusFilter(statusSelect.value as CrossNoteResult["status"] | "all"));

    if (this.hasActiveFilters()) {
      createToolbarButton(searchRow, this.plugin.t("filter.clear.short"), this.plugin.t("filter.clear"), () => this.clearFilters());
    }

    const filtered = this.getFilteredResults();
    header.createDiv({
      cls: "side-comments-subtitle",
      text: this.plugin.t("crossNote.resultCount", { visible: filtered.length, total: this.results.length })
    });

    if (this.loadState === "loading") {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.recentUnavailable") });
      return;
    }

    if (this.loadState === "missing") {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.recentUnavailable") });
      return;
    }

    if (this.loadState === "failed") {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.readFailed") });
      return;
    }

    if (this.results.length === 0) {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.noRecent") });
      return;
    }

    if (filtered.length === 0) {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("empty.crossNote.noMatches") });
      return;
    }

    for (const result of filtered) {
      const card = content.createDiv({
        cls: [
          "side-comments-card",
          "side-comments-cross-note-card",
          `side-comments-card--${result.status}`
        ].join(" ")
      });

      const headerRow = card.createDiv({ cls: "side-comments-card-header" });
      const meta = headerRow.createDiv({ cls: "side-comments-card-meta" });
      meta.createSpan({ cls: `side-comments-color-dot side-comments-color-dot--${result.color}` });
      meta.createSpan({ text: `${result.fileName} · ${statusLabel(result.status, this.plugin.t)}` });

      const actions = headerRow.createDiv({ cls: "side-comments-card-header-actions" });
      createToolbarButton(actions, this.plugin.t("action.openSource"), this.plugin.t("action.openSource"), () => {
        void this.openSource(result);
      });
      createToolbarButton(actions, this.plugin.t("action.jump.short"), this.plugin.t("action.jumpToText"), () => {
        void this.jumpToResult(result);
      });

      card.createDiv({ cls: "side-comments-card-section-title", text: this.plugin.t("card.source") });
      card.createDiv({ cls: "side-comments-card-excerpt", text: result.selectedTextPreview || this.plugin.t("card.emptySelection") });
      card.createDiv({ cls: "side-comments-card-section-title", text: this.plugin.t("card.comment") });
      card.createDiv({ cls: "side-comments-card-note", text: result.notePreview || this.plugin.t("card.emptyNote") });
      card.createDiv({
        cls: "side-comments-card-context",
        text: `${getResultTypeLabel(result, this.plugin)} · ${colorLabel(result.color, this.plugin.t)}`
      });
    }
  }

  private getContentEl(): HTMLElement {
    return this.containerEl.children[1] as HTMLElement;
  }

  private hasActiveFilters(): boolean {
    return Boolean(this.searchQuery.trim() || this.sourceFilter.trim() || this.statusFilter !== "all" || this.colorFilter !== "all" || this.typeFilter !== "all");
  }

  private getFilteredResults(): CrossNoteResult[] {
    const query = this.searchQuery.trim().toLowerCase();
    const sourceQuery = this.sourceFilter.trim().toLowerCase();
    return this.results.filter((result) => {
      if (this.statusFilter !== "all" && result.status !== this.statusFilter) {
        return false;
      }
      if (this.colorFilter !== "all" && result.color !== this.colorFilter) {
        return false;
      }
      if (this.typeFilter !== "all" && !matchesMarkType(result.markType, result.color, this.typeFilter)) {
        return false;
      }
      if (sourceQuery) {
        const sourceName = result.fileName.toLowerCase();
        const sourcePath = result.filePath.toLowerCase();
        if (!sourceName.includes(sourceQuery) && !sourcePath.includes(sourceQuery)) {
          return false;
        }
      }
      if (!query) {
        return true;
      }
      return (
        result.selectedTextPreview.toLowerCase().includes(query) ||
        result.notePreview.toLowerCase().includes(query) ||
        result.filePath.toLowerCase().includes(query) ||
        result.fileName.toLowerCase().includes(query) ||
        result.status.toLowerCase().includes(query)
      );
    });
  }
}

function matchesMarkType(markType: MarkType, color: MarkColor, filter: MarkFilter): boolean {
  if (filter === "comment") {
    return markType === "highlight" && color === "purple";
  }
  return markType === filter;
}

function getResultTypeLabel(result: CrossNoteResult, plugin: SideCommentsPlugin): string {
  if (result.markType === "highlight" && result.color === "purple") {
    return plugin.t("filter.type.comment");
  }
  return markLabel(result.markType, plugin.t);
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
        updatedAt: item.updatedAt
      });
    }
  }
  return results;
}

function createToolbarButton(
  container: HTMLElement,
  label: string,
  tooltip: string,
  onClick: () => void
): HTMLButtonElement {
  const button = container.createEl("button", {
    cls: "side-comments-toolbar-button",
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
