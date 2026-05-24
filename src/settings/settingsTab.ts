import { App, Modal, PluginSettingTab, Setting, TFile } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { MaintenanceExportFormat, SidebarDisplayMode } from "../types";

export class SideCommentsSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: SideCommentsPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: this.plugin.t("app.name") });

    new Setting(containerEl)
      .setName(this.plugin.t("settings.autoOpen.name"))
      .setDesc(this.plugin.t("settings.autoOpen.desc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoOpenSidebarAfterCreate)
          .onChange(async (value) => {
            this.plugin.settings.autoOpenSidebarAfterCreate = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settings.showResolvedMarks.name"))
      .setDesc(this.plugin.t("settings.showResolvedMarks.desc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showResolvedMarks)
          .onChange(async (value) => {
            this.plugin.settings.showResolvedMarks = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settings.sidebarDisplayMode.name"))
      .setDesc(this.plugin.t("settings.sidebarDisplayMode.desc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("normal", this.plugin.t("sidebar.mode.normal"))
          .addOption("compact", this.plugin.t("sidebar.mode.compact"))
          .setValue(this.plugin.settings.sidebarDisplayMode)
          .onChange(async (value) => {
            this.plugin.settings.sidebarDisplayMode = value as SidebarDisplayMode;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settings.showResolvedComments.name"))
      .setDesc(this.plugin.t("settings.showResolvedComments.desc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showResolvedComments)
          .onChange(async (value) => {
            this.plugin.settings.showResolvedComments = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settings.cachedDocuments.name"))
      .setDesc(this.plugin.t("settings.cachedDocuments.desc"))
      .addText((text) =>
        text
          .setPlaceholder("100")
          .setValue(String(this.plugin.settings.maxCachedDocuments))
          .onChange(async (value) => {
            const parsed = Number.parseInt(value, 10);
            if (!Number.isNaN(parsed) && parsed > 0) {
              this.plugin.settings.maxCachedDocuments = parsed;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settings.anchorDelay.name"))
      .setDesc(this.plugin.t("settings.anchorDelay.desc"))
      .addText((text) =>
        text
          .setPlaceholder("800")
          .setValue(String(this.plugin.settings.relocateDebounceMs))
          .onChange(async (value) => {
            const parsed = Number.parseInt(value, 10);
            if (!Number.isNaN(parsed) && parsed >= 0) {
              this.plugin.settings.relocateDebounceMs = parsed;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settings.dataDir.name"))
      .setDesc(this.plugin.t("settings.dataDir.desc"))
      .addText((text) => {
        text.setValue(this.plugin.settings.dataDir);
        text.inputEl.disabled = true;
      });

    this.renderMaintenanceSection(containerEl);
  }

  private renderMaintenanceSection(containerEl: HTMLElement): void {
    containerEl.createEl("h3", { text: this.plugin.t("maintenance.title") });

    containerEl.createEl("h4", { text: this.plugin.t("maintenance.export.title") });
    this.renderExportSetting(containerEl, this.plugin.t("export.currentNote"), (format) => {
      void this.plugin.exportCurrentNoteAnnotations(format);
    });
    this.renderExportSetting(containerEl, this.plugin.t("export.selectedNotes"), (format) => {
      new SelectedNotesExportModal(this.app, this.plugin, format).open();
    });
    this.renderExportSetting(containerEl, this.plugin.t("export.allSidecars"), (format) => {
      void this.plugin.exportAllSidecarMetadata(format);
    });

    containerEl.createEl("h4", { text: this.plugin.t("maintenance.import.title") });
    containerEl.createEl("h4", { text: this.plugin.t("maintenance.health.title") });
    containerEl.createEl("h4", { text: this.plugin.t("maintenance.repair.title") });
  }

  private renderExportSetting(
    containerEl: HTMLElement,
    name: string,
    onExport: (format: MaintenanceExportFormat) => void
  ): void {
    new Setting(containerEl)
      .setName(name)
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("export.format.json"))
          .onClick(() => onExport("json"));
      })
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("export.format.markdown"))
          .onClick(() => onExport("markdown"));
      });
  }
}

class SelectedNotesExportModal extends Modal {
  private selectedPaths = new Set<string>();

  constructor(
    app: App,
    private readonly plugin: SideCommentsPlugin,
    private readonly format: MaintenanceExportFormat
  ) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.plugin.t("export.selectedNotes") });

    const files = this.app.vault
      .getMarkdownFiles()
      .sort((left, right) => left.path.localeCompare(right.path));

    const list = contentEl.createDiv({ cls: "side-comments-selected-notes-export-list" });
    for (const file of files) {
      const label = list.createEl("label", { cls: "side-comments-selected-notes-export-item" });
      const checkbox = label.createEl("input", {
        attr: {
          type: "checkbox"
        }
      });
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          this.selectedPaths.add(file.path);
        } else {
          this.selectedPaths.delete(file.path);
        }
      });
      label.createSpan({ text: file.path });
    }

    new Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("action.cancel"))
          .onClick(() => this.close());
      })
      .addButton((button) => {
        button
          .setCta()
          .setButtonText(this.plugin.t("maintenance.export.title"))
          .onClick(() => {
            const selectedFiles = files.filter((file) => this.selectedPaths.has(file.path));
            void this.plugin.exportSelectedNoteAnnotations(selectedFiles as TFile[], this.format);
            this.close();
          });
      });
  }

  onClose(): void {
    this.contentEl.empty();
    this.selectedPaths.clear();
  }
}
