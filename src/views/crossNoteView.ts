import { ItemView, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { AnnotationType, MarkColor, MarkType, RecentPreviewItem, SideComment, SideCommentStatus } from "../types";
import { colorLabel, markLabel, statusLabel } from "./commentCard";
import {
  ANNOTATION_TYPES,
  annotationTypeLabel,
  normalizeTagKey,
  normalizeTags
} from "../organization/annotationMetadata";

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
  annotationType: AnnotationType;
  tags: string[];
  updatedAt: string;
}

export class SideCommentsCrossNoteView extends ItemView {
  private loadState: CrossNoteLoadState = "loading";
  private results: CrossNoteResult[] = [];
  private searchQuery = "";
  private sourceFilter = "";
  private statusFilter: SideCommentStatus | "all" = "all";
  private colorFilter: MarkColor | "all" = "all";
  private readonly annotationTypeFilters = new Set<AnnotationType>();
  private readonly tagFilters = new Set<string>();

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

  clearFilters(): void {
    this.searchQuery = "";
    this.sourceFilter = "";
    this.statusFilter = "all";
    this.colorFilter = "all";
    this.annotationTypeFilters.clear();
    this.tagFilters.clear();
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

    createToolbarButton(searchRow, this.plugin.t("draft.copy"), this.plugin.t("draft.copyTooltip"), () => {
      void this.copyDraft(this.getFilteredResults());
    });

    const typeFilterRow = header.createDiv({ cls: "side-comments-filter-chip-row" });
    typeFilterRow.createSpan({ cls: "side-comments-filter-chip-label", text: this.plugin.t("annotationType.placeholder") });
    for (const type of ANNOTATION_TYPES) {
      createToolbarButton(typeFilterRow, annotationTypeLabel(type, this.plugin.t), annotationTypeLabel(type, this.plugin.t), () => {
        this.toggleAnnotationTypeFilter(type);
      }, this.annotationTypeFilters.has(type));
    }

    const availableTags = this.getAvailableTags();
    if (availableTags.length > 0) {
      const tagFilterRow = header.createDiv({ cls: "side-comments-filter-chip-row" });
      tagFilterRow.createSpan({ cls: "side-comments-filter-chip-label", text: this.plugin.t("tags.label") });
      for (const tag of availableTags) {
        createToolbarButton(tagFilterRow, tag, tag, () => {
          this.toggleTagFilter(tag);
        }, this.tagFilters.has(normalizeTagKey(tag)));
      }
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
      meta.createSpan({ text: `${result.fileName} · ${annotationTypeLabel(result.annotationType, this.plugin.t)} · ${statusLabel(result.status, this.plugin.t)}` });

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
        text: `${markLabel(result.markType, this.plugin.t)} · ${colorLabel(result.color, this.plugin.t)}`
      });
      const tags = normalizeTags(result.tags);
      if (tags.length > 0) {
        card.createDiv({ cls: "side-comments-card-context", text: `${this.plugin.t("tags.label")}: ${tags.join(", ")}` });
      }
    }
  }

  private getContentEl(): HTMLElement {
    return this.containerEl.children[1] as HTMLElement;
  }

  private hasActiveFilters(): boolean {
    return Boolean(this.searchQuery.trim() || this.sourceFilter.trim() || this.statusFilter !== "all" || this.colorFilter !== "all" || this.annotationTypeFilters.size > 0 || this.tagFilters.size > 0);
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
      if (this.annotationTypeFilters.size > 0 && !this.annotationTypeFilters.has(result.annotationType)) {
        return false;
      }
      if (this.tagFilters.size > 0 && !result.tags.some((tag) => this.tagFilters.has(normalizeTagKey(tag)))) {
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
        result.status.toLowerCase().includes(query) ||
        result.annotationType.toLowerCase().includes(query) ||
        result.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
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

  private getAvailableTags(): string[] {
    return normalizeTags(this.results.flatMap((result) => result.tags)).sort((left, right) =>
      left.localeCompare(right, undefined, { sensitivity: "base" })
    );
  }

  private async copyDraft(results: CrossNoteResult[]): Promise<void> {
    const grouped = new Map<string, SideComment[]>();
    for (const result of results) {
      const document = await this.plugin.store.loadDocument(result.filePath);
      const comment = document.comments.find((item) => item.id === result.commentId);
      if (!comment) {
        continue;
      }
      grouped.set(result.filePath, [...(grouped.get(result.filePath) ?? []), comment]);
    }

    await this.plugin.copyAnnotationDraft([...grouped.entries()].map(([filePath, comments]) => ({ filePath, comments })));
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
        annotationType: preview.annotationType ?? "excerpt",
        tags: normalizeTags(preview.tags),
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
