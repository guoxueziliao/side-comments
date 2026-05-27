import { App, ItemView, Modal, Notice, Setting, WorkspaceLeaf } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { HealthIssue, HealthIssueType, HealthReport, HealthSeverity, SideComment } from "../types";
import { createToolbarButton } from "./shared";

export const SIDE_COMMENTS_HEALTH_VIEW_TYPE = "side-comments-health-view";

const SEVERITIES: HealthSeverity[] = ["error", "warning", "info"];

export class SideCommentsHealthView extends ItemView {
  private report: HealthReport | null = null;
  private issueTypeFilter: HealthIssueType | null = null;
  private readonly enabledSeverities = new Set<HealthSeverity>(SEVERITIES);
  private readonly expandedIssues = new Set<string>();

  constructor(leaf: WorkspaceLeaf, private readonly plugin: SideCommentsPlugin) {
    super(leaf);
  }

  getViewType(): string {
    return SIDE_COMMENTS_HEALTH_VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.plugin.t("maintenance.health.title");
  }

  getIcon(): string {
    return "stethoscope";
  }

  setReport(report: HealthReport, issueTypeFilter: HealthIssueType | null = null): void {
    this.report = report;
    this.issueTypeFilter = issueTypeFilter;
    this.expandedIssues.clear();
    void this.render();
  }

  async onOpen(): Promise<void> {
    await this.render();
  }

  async render(): Promise<void> {
    const content = this.getContentEl();
    content.empty();
    content.addClass("side-comments-health-view");

    content.createDiv({ cls: "side-comments-title", text: this.plugin.t("maintenance.health.title") });
    if (!this.report) {
      content.createDiv({ cls: "side-comments-empty", text: this.plugin.t("health.empty") });
      return;
    }

    const visible = this.report.issues.filter((issue) =>
      this.enabledSeverities.has(issue.severity) &&
      (!this.issueTypeFilter || issue.type === this.issueTypeFilter)
    );
    this.renderOverview(content, this.report.issues);
    this.renderSeverityChips(content, this.report.issues);

    const categories = [
      { type: "missing-source", label: this.plugin.t("health.category.missingSource") },
      { type: "orphaned-anchor", label: this.plugin.t("health.category.orphaned") },
      { type: "duplicate-anchor", label: this.plugin.t("health.category.duplicates") },
      { type: "structure", label: this.plugin.t("health.category.structure") }
    ] as const;

    for (const category of categories) {
      const section = content.createDiv({ cls: "side-comments-health-section" });
      const issues = visible.filter((issue) => issue.type === category.type);
      section.createDiv({
        cls: "side-comments-health-section-title",
        text: `${category.label} · ${issues.length}`
      });
      if (issues.length === 0) {
        section.createDiv({ cls: "side-comments-empty", text: this.plugin.t("health.noIssues") });
        continue;
      }
      for (const issue of issues) {
        await this.renderIssue(section, issue);
      }
    }
  }

  private renderOverview(container: HTMLElement, issues: HealthIssue[]): void {
    const row = container.createDiv({ cls: "side-comments-health-overview" });
    row.createSpan({ text: this.plugin.t("health.scope", { scope: this.scopeLabel(this.report?.scope ?? "all-sidecars") }) });
    row.createSpan({ text: this.plugin.t("health.checkedAt", { time: this.report ? new Date(this.report.generatedAt).toLocaleString() : "—" }) });
    row.createSpan({ text: this.plugin.t("health.scannedDocuments", { count: this.report?.scannedDocumentCount ?? 0 }) });
    row.createSpan({ text: this.plugin.t("health.scannedSidecars", { count: this.report?.scannedSidecarCount ?? 0 }) });
    row.createSpan({ text: this.plugin.t("health.totalAnnotations", { count: this.report?.totalAnnotationCount ?? 0 }) });
    row.createSpan({ text: this.plugin.t("health.summary", { count: issues.length }) });
  }

  private renderSeverityChips(container: HTMLElement, issues: HealthIssue[]): void {
    const row = container.createDiv({ cls: "side-comments-cross-note-chip-row" });
    for (const severity of SEVERITIES) {
      const count = issues.filter((issue) => issue.severity === severity).length;
      createToolbarButton(
        row,
        `${this.severityLabel(severity)} ${count}`,
        this.severityLabel(severity),
        () => {
          if (this.enabledSeverities.has(severity)) {
            this.enabledSeverities.delete(severity);
          } else {
            this.enabledSeverities.add(severity);
          }
          void this.render();
        },
        this.enabledSeverities.has(severity)
      );
    }
  }

  private async renderIssue(container: HTMLElement, issue: HealthIssue): Promise<void> {
    const row = container.createDiv({ cls: `side-comments-health-issue side-comments-health-issue--${issue.severity}` });
    row.addEventListener("click", (event) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }
      void this.openIssueSource(issue);
    });
    row.createDiv({ cls: "side-comments-health-issue-title", text: issue.title });
    row.createDiv({ cls: "side-comments-health-severity", text: this.severityLabel(issue.severity) });
    row.createDiv({ cls: "side-comments-health-issue-detail", text: `${issue.filePath} · ${issue.detail}` });
    row.createDiv({
      cls: "side-comments-health-suggested-action",
      text: this.suggestedActionText(issue)
    });

    const actions = row.createDiv({ cls: "side-comments-card-edit-actions" });
    createToolbarButton(actions, this.plugin.t("action.openSource"), this.plugin.t("action.openSource"), () => {
      void this.openIssueSource(issue);
    });

    if (issue.type === "orphaned-anchor" && issue.commentIds[0]) {
      createToolbarButton(actions, this.plugin.t("repair.rebindToSelection"), this.plugin.t("repair.rebindToSelection"), () => {
        void this.startHealthRebind(issue);
      });
    }

    if (issue.type === "missing-source") {
      createToolbarButton(actions, this.plugin.t("repair.cleanupMissingSource"), this.plugin.t("repair.cleanupMissingSource"), () => {
        void this.confirmCleanupMissingSource(issue);
      });
    }

    if (issue.type === "duplicate-anchor") {
      createToolbarButton(
        actions,
        this.expandedIssues.has(issue.id) ? this.plugin.t("action.collapse") : this.plugin.t("action.expand"),
        this.plugin.t("repair.duplicates"),
        () => {
          if (this.expandedIssues.has(issue.id)) {
            this.expandedIssues.delete(issue.id);
          } else {
            this.expandedIssues.add(issue.id);
          }
          void this.render();
        }
      );
      if (this.expandedIssues.has(issue.id)) {
        await this.renderDuplicateActions(row, issue);
      }
    }
  }

  private async renderDuplicateActions(container: HTMLElement, issue: HealthIssue): Promise<void> {
    const comments = (await this.plugin.getCommentsForFile(issue.filePath)).filter((comment) => issue.commentIds.includes(comment.id));
    const body = container.createDiv({ cls: "side-comments-health-duplicates" });
    for (const comment of comments) {
      body.createDiv({ text: `${comment.id} · ${comment.anchor.selectedText} · ${comment.note.content}` });
    }
    const actions = body.createDiv({ cls: "side-comments-card-edit-actions" });
    createToolbarButton(actions, this.plugin.t("repair.keepAll"), this.plugin.t("repair.keepAll"), () => {
      this.expandedIssues.delete(issue.id);
      void this.render();
    });
    createToolbarButton(actions, this.plugin.t("repair.mergeComments"), this.plugin.t("repair.mergeComments"), () => {
      new MergeDuplicateModal(this.app, this.plugin, issue.filePath, comments).open();
    });
    createToolbarButton(actions, this.plugin.t("repair.deleteSelected"), this.plugin.t("repair.deleteSelected"), () => {
      new DeleteDuplicateModal(this.app, this.plugin, issue.filePath, comments).open();
    });
  }

  private async openIssueSource(issue: HealthIssue): Promise<void> {
    if (!await this.plugin.openSourceDocument(issue.filePath)) {
      return;
    }
    const commentId = issue.commentIds[0];
    if (commentId) {
      await this.plugin.focusCommentInSidebar(commentId, false);
      await this.plugin.jumpToCommentInEditor(commentId);
    }
  }

  private async startHealthRebind(issue: HealthIssue): Promise<void> {
    await this.openIssueSource(issue);
    const commentId = issue.commentIds[0];
    if (commentId) {
      await this.plugin.focusCommentInSidebar(commentId, false);
      new Notice(this.plugin.t("notice.rebindSelect"));
    }
  }

  private async confirmCleanupMissingSource(issue: HealthIssue): Promise<void> {
    const confirmed = window.confirm(this.plugin.t("repair.cleanupMissingSourceConfirm", { filePath: issue.filePath }));
    if (!confirmed) {
      return;
    }

    await this.plugin.cleanupMissingSourceAnnotations(issue.filePath);
    if (this.report) {
      const issues = this.report.issues.filter((item) => item.filePath !== issue.filePath);
      this.setReport({
        ...this.report,
        generatedAt: new Date().toISOString(),
        scannedDocumentCount: new Set(issues.map((item) => item.filePath)).size,
        scannedSidecarCount: Math.max(0, this.report.scannedSidecarCount - 1),
        issues
      }, this.issueTypeFilter);
    }
  }

  private severityLabel(severity: HealthSeverity): string {
    if (severity === "error") return this.plugin.t("health.severity.error");
    if (severity === "warning") return this.plugin.t("health.severity.warning");
    return this.plugin.t("health.severity.info");
  }

  private scopeLabel(scope: HealthReport["scope"]): string {
    if (scope === "current-note") return this.plugin.t("health.scope.current-note");
    if (scope === "selected-notes") return this.plugin.t("health.scope.selected-notes");
    return this.plugin.t("health.scope.all-sidecars");
  }

  private suggestedActionText(issue: HealthIssue): string {
    if (issue.type === "orphaned-anchor") {
      return this.plugin.t("health.suggestedAction", { action: this.plugin.t("health.action.rebindToSelection") });
    }
    if (issue.type === "duplicate-anchor") {
      return this.plugin.t("health.suggestedAction", { action: this.plugin.t("health.action.expandDuplicate") });
    }
    if (issue.type === "missing-source") {
      return this.plugin.t("health.suggestedAction", { action: this.plugin.t("health.action.restoreOrCleanupSource") });
    }
    return this.plugin.t("health.suggestedAction", { action: this.plugin.t("health.action.inspectData") });
  }

  private getContentEl(): HTMLElement {
    return this.containerEl.children[1] as HTMLElement;
  }
}

class MergeDuplicateModal extends Modal {
  private primaryId = "";
  private mergedText = "";

  constructor(
    app: App,
    private readonly plugin: SideCommentsPlugin,
    private readonly filePath: string,
    private readonly comments: SideComment[]
  ) {
    super(app);
    this.primaryId = comments[0]?.id ?? "";
    this.mergedText = comments.map((comment) => comment.note.content.trim()).filter(Boolean).join("\n\n");
  }

  onOpen(): void {
    this.titleEl.setText(this.plugin.t("repair.previewChange"));
    const { contentEl } = this;
    contentEl.empty();

    new Setting(contentEl)
      .setName(this.plugin.t("repair.mergeComments"))
      .addDropdown((dropdown) => {
        for (const comment of this.comments) {
          dropdown.addOption(comment.id, comment.anchor.selectedText.slice(0, 40) || comment.id);
        }
        dropdown.setValue(this.primaryId);
        dropdown.onChange((value) => {
          this.primaryId = value;
        });
      });

    new Setting(contentEl)
      .addTextArea((textarea) => {
        textarea.setValue(this.mergedText);
        textarea.inputEl.rows = 6;
        textarea.onChange((value) => {
          this.mergedText = value;
        });
      });

    new Setting(contentEl)
      .addButton((button) => button.setButtonText(this.plugin.t("action.cancel")).onClick(() => this.close()))
      .addButton((button) => {
        button.setCta().setButtonText(this.plugin.t("repair.confirmChange")).onClick(() => {
          const remove = this.comments.map((comment) => comment.id).filter((id) => id !== this.primaryId);
          void this.plugin.mergeDuplicateComments(this.filePath, this.primaryId, remove, this.mergedText);
          this.close();
        });
      });
  }
}

class DeleteDuplicateModal extends Modal {
  private readonly selected = new Set<string>();

  constructor(
    app: App,
    private readonly plugin: SideCommentsPlugin,
    private readonly filePath: string,
    private readonly comments: SideComment[]
  ) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText(this.plugin.t("repair.deleteSelected"));
    const { contentEl } = this;
    contentEl.empty();

    for (const comment of this.comments) {
      const label = contentEl.createEl("label", { cls: "side-comments-selected-notes-export-item" });
      const checkbox = label.createEl("input", { attr: { type: "checkbox" } });
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          this.selected.add(comment.id);
        } else {
          this.selected.delete(comment.id);
        }
      });
      label.createSpan({ text: `${comment.anchor.selectedText} · ${comment.note.content}` });
    }

    new Setting(contentEl)
      .addButton((button) => button.setButtonText(this.plugin.t("action.cancel")).onClick(() => this.close()))
      .addButton((button) => {
        button.setCta().setButtonText(this.plugin.t("repair.confirmChange")).onClick(() => {
          if (this.selected.size === 0) {
            new Notice(this.plugin.t("repair.deleteSelectedEmpty"));
            return;
          }
          const selectedComments = this.comments.filter((comment) => this.selected.has(comment.id));
          const items = selectedComments.map((comment) => `${comment.anchor.selectedText || comment.id} · ${comment.note.content}`).join("\n");
          const confirmed = window.confirm(this.plugin.t("repair.deleteSelectedConfirm", { count: selectedComments.length, items }));
          if (!confirmed) {
            return;
          }
          void this.plugin.deleteDuplicateComments(this.filePath, [...this.selected]);
          this.close();
        });
      });
  }
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("button, input, textarea, select, a, summary, details"));
}
