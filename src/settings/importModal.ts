import { App, Modal, Notice, Setting, setIcon } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { MaintenanceImportMode, MarkType, SideComment, SideCommentsImportPackage } from "../types";
import { parseSideCommentsImportPackage } from "../storage/import";

type ImportStatus = "new" | "skipped" | "conflict" | "defaulted";

const MARK_ICONS: Record<MarkType, string> = {
  highlight: "highlighter",
  underline: "underline",
  strikethrough: "strikethrough",
  note: "sticky-note"
};

interface ImportPreviewRow {
  filePath: string;
  comment: SideComment;
  status: ImportStatus;
}

export class ImportAnnotationsModal extends Modal {
  private importPackage: SideCommentsImportPackage | null = null;
  private mode: MaintenanceImportMode = "restore-original";
  private rows: ImportPreviewRow[] = [];
  private error = "";

  constructor(app: App, private readonly plugin: SideCommentsPlugin) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText(this.plugin.t("maintenance.import.title"));
    void this.render();
  }

  private async render(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();

    this.renderFilePicker(contentEl);
    this.renderScopeSelector(contentEl);

    if (this.error) {
      contentEl.createDiv({ cls: "side-comments-empty", text: this.error });
    }

    if (this.importPackage) {
      await this.buildPreview();
      this.renderPreview(contentEl);
    }

    new Setting(contentEl)
      .addButton((button) => {
        button.setButtonText(this.plugin.t("action.cancel")).onClick(() => this.close());
      })
      .addButton((button) => {
        button
          .setCta()
          .setDisabled(!this.importPackage)
          .setButtonText(this.plugin.t("import.confirm"))
          .onClick(() => {
            if (!this.importPackage) {
              return;
            }
            void this.plugin.importAnnotationPackage(this.importPackage, this.mode);
            this.close();
          });
      });
  }

  private renderFilePicker(container: HTMLElement): void {
    new Setting(container)
      .setName(this.plugin.t("import.chooseFile"))
      .addText((text) => {
        text.setPlaceholder(".obsidian-side-comments/exports/export.json");
        text.onChange(async (value) => {
          if (!value.trim()) {
            return;
          }
          await this.loadFromAdapterPath(value.trim());
        });
      });

    const input = container.createEl("input", { attr: { type: "file", accept: ".json,application/json" } });
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      if (!file.name.endsWith(".json")) {
        this.setError(this.plugin.t("import.invalidFile"));
        await this.render();
        return;
      }
      this.loadRaw(await file.text());
      await this.render();
    });
  }

  private renderScopeSelector(container: HTMLElement): void {
    new Setting(container)
      .setName(this.plugin.t("import.preview"))
      .addDropdown((dropdown) => {
        dropdown
          .addOption("restore-original", this.plugin.t("import.restoreOriginalPath"))
          .addOption("into-current", this.plugin.t("import.intoCurrentNote"))
          .setValue(this.mode)
          .onChange((value) => {
            this.mode = value as MaintenanceImportMode;
            void this.render();
          });
      });
  }

  private async loadFromAdapterPath(path: string): Promise<void> {
    if (!path.endsWith(".json")) {
      this.setError(this.plugin.t("import.invalidFile"));
      return;
    }
    try {
      this.loadRaw(await this.app.vault.adapter.read(path));
    } catch {
      this.setError(this.plugin.t("import.failed"));
    }
    await this.render();
  }

  private loadRaw(raw: string): void {
    const parsed = parseSideCommentsImportPackage(raw);
    if (!parsed.ok) {
      this.setError(this.plugin.t("import.failed"));
      return;
    }
    this.error = "";
    this.importPackage = parsed.package;
    this.mode = parsed.package.scope === "current-note" && parsed.package.documents.length === 1 ? "into-current" : "restore-original";
  }

  private setError(message: string): void {
    this.importPackage = null;
    this.rows = [];
    this.error = message;
  }

  private async buildPreview(): Promise<void> {
    if (!this.importPackage) {
      this.rows = [];
      return;
    }

    const defaulted = new Set(this.importPackage.defaultedCommentIds);
    const currentFilePath = this.plugin.getCurrentDocumentFilePath();
    const rows: ImportPreviewRow[] = [];
    for (const document of this.importPackage.documents) {
      const targetPath = this.mode === "into-current" ? currentFilePath : document.filePath;
      if (!targetPath) {
        continue;
      }
      const existing = await this.plugin.store.loadDocument(targetPath);
      const existingIds = new Set(existing.comments.map((comment) => comment.id));
      const existingAnchors = new Set(existing.comments.map((comment) => anchorKey(comment)));
      for (const comment of document.comments) {
        const status: ImportStatus = existingIds.has(comment.id)
          ? "skipped"
          : existingAnchors.has(anchorKey(comment))
            ? "conflict"
            : defaulted.has(comment.id)
              ? "defaulted"
              : "new";
        rows.push({ filePath: targetPath, comment, status });
      }
    }
    this.rows = rows;
  }

  private renderPreview(container: HTMLElement): void {
    const counts = {
      new: this.rows.filter((row) => row.status === "new").length,
      skipped: this.rows.filter((row) => row.status === "skipped").length,
      conflict: this.rows.filter((row) => row.status === "conflict").length,
      defaulted: this.rows.filter((row) => row.status === "defaulted").length,
      sources: new Set(this.rows.map((row) => row.filePath)).size
    };

    container.createDiv({
      cls: "side-comments-health-overview",
      text: this.plugin.t("import.summary", counts)
    });

    const groups = new Map<string, ImportPreviewRow[]>();
    for (const row of this.rows) {
      groups.set(row.filePath, [...(groups.get(row.filePath) ?? []), row]);
    }

    for (const [filePath, rows] of groups) {
      const details = container.createEl("details", { cls: "side-comments-import-group" });
      details.createEl("summary", { text: `${filePath} · ${rows.length}` });
      for (const row of rows) {
        const item = details.createDiv({ cls: `side-comments-import-row side-comments-import-row--${row.status}` });
        item.createSpan({ cls: "side-comments-health-severity", text: this.statusLabel(row.status) });
        const mark = item.createSpan({
          cls: "side-comments-import-mark-icon",
          attr: { title: row.comment.mark.type, "aria-label": row.comment.mark.type }
        });
        setIcon(mark, MARK_ICONS[row.comment.mark.type]);
        item.createSpan({
          cls: `side-comments-import-color-dot side-comments-import-color-dot--${row.comment.mark.color}`,
          attr: { title: row.comment.mark.color, "aria-label": row.comment.mark.color }
        });
        item.createSpan({ cls: "side-comments-import-text", text: row.comment.anchor.selectedText.slice(0, 80) || "—" });
        item.createSpan({ cls: "side-comments-import-note", text: row.comment.note.content.slice(0, 80) || "—" });
      }
    }
  }

  private statusLabel(status: ImportStatus): string {
    if (status === "new") return this.plugin.t("import.status.new");
    if (status === "skipped") return this.plugin.t("import.status.skipped");
    if (status === "conflict") return this.plugin.t("import.status.conflict");
    return this.plugin.t("import.status.defaulted");
  }
}

function anchorKey(comment: SideComment): string {
  return `${comment.anchor.startOffset}:${comment.anchor.endOffset}:${comment.anchor.selectedText}`;
}
