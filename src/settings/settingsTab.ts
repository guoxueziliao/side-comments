import { App, Modal, PluginSettingTab, Setting, TFile } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { HealthCheckScope, InterfaceLanguage, MaintenanceExportFormat } from "../types";
import { ImportAnnotationsModal } from "./importModal";

export class SideCommentsSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: SideCommentsPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: this.plugin.t("app.name") });

    this.renderAppearanceGroup(containerEl);
    this.renderBehaviorGroup(containerEl);
    this.renderAdvancedGroup(containerEl);
    this.renderMaintenanceGroup(containerEl);
  }

  private renderAppearanceGroup(containerEl: HTMLElement): void {
    containerEl.createEl("h3", { text: this.plugin.t("settings.group.appearance") });

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
  }

  private renderBehaviorGroup(containerEl: HTMLElement): void {
    containerEl.createEl("h3", { text: this.plugin.t("settings.group.behavior") });

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
      .setName(this.plugin.t("settings.language.name"))
      .setDesc(this.plugin.t("settings.language.desc"))
      .addDropdown((dropdown) => {
        dropdown
          .addOption("auto", this.plugin.t("settings.language.auto"))
          .addOption("zh", this.plugin.t("settings.language.zh"))
          .addOption("en", this.plugin.t("settings.language.en"))
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            this.plugin.settings.language = value as InterfaceLanguage;
            this.plugin.refreshTranslator();
            await this.plugin.saveSettings();
            this.display();
          });
      });
  }

  private renderAdvancedGroup(containerEl: HTMLElement): void {
    containerEl.createEl("h3", { text: this.plugin.t("settings.group.advanced") });

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
  }

  private renderMaintenanceGroup(containerEl: HTMLElement): void {
    containerEl.createEl("h3", { text: this.plugin.t("settings.group.maintenance") });

    this.renderExportSetting(containerEl, this.plugin.t("export.currentNote"), (format) => {
      void this.plugin.exportCurrentNoteAnnotations(format);
    });
    this.renderExportSetting(containerEl, this.plugin.t("export.selectedNotes"), (format) => {
      new SelectedNotesExportModal(this.app, this.plugin, format).open();
    });
    this.renderExportSetting(containerEl, this.plugin.t("export.allSidecars"), (format) => {
      void this.plugin.exportAllSidecarMetadata(format);
    });

    new Setting(containerEl)
      .setName(this.plugin.t("maintenance.import.title"))
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("import.chooseFile"))
          .onClick(() => new ImportAnnotationsModal(this.app, this.plugin).open());
      });

    new Setting(containerEl)
      .setName(this.plugin.t("maintenance.health.title"))
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("maintenance.health.title"))
          .onClick(() => new HealthScopeModal(this.app, this.plugin).open());
      });

    new Setting(containerEl)
      .setName(this.plugin.t("repair.orphaned"))
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("health.openOrphaned"))
          .onClick(() => {
            void this.plugin.runAndOpenHealthCheck("all-sidecars", undefined, "orphaned-anchor");
          });
      });
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

class HealthScopeModal extends Modal {
  constructor(app: App, private readonly plugin: SideCommentsPlugin) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(this.plugin.t("maintenance.health.title"));

    this.addScopeButton(contentEl, "current-note", this.plugin.t("health.runCurrentNote"));
    this.addScopeButton(contentEl, "selected-notes", this.plugin.t("health.runSelectedNotes"));
    this.addScopeButton(contentEl, "all-sidecars", this.plugin.t("health.runAllSidecars"));
  }

  private addScopeButton(container: HTMLElement, scope: HealthCheckScope, label: string): void {
    new Setting(container)
      .setName(label)
      .addButton((button) => {
        button.setButtonText(label).onClick(() => {
          if (scope === "selected-notes") {
            new SelectedNotesHealthModal(this.app, this.plugin).open();
          } else {
            void this.plugin.runAndOpenHealthCheck(scope);
          }
          this.close();
        });
      });
  }
}

class SelectedNotesHealthModal extends Modal {
  private selectedPaths = new Set<string>();

  constructor(app: App, private readonly plugin: SideCommentsPlugin) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(this.plugin.t("health.runSelectedNotes"));

    const files = this.app.vault.getMarkdownFiles().sort((left, right) => left.path.localeCompare(right.path));
    for (const file of files) {
      const label = contentEl.createEl("label", { cls: "side-comments-selected-notes-export-item" });
      const checkbox = label.createEl("input", { attr: { type: "checkbox" } });
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
      .addButton((button) => button.setButtonText(this.plugin.t("action.cancel")).onClick(() => this.close()))
      .addButton((button) => {
        button.setCta().setButtonText(this.plugin.t("maintenance.health.title")).onClick(() => {
          void this.plugin.runAndOpenHealthCheck("selected-notes", [...this.selectedPaths]);
          this.close();
        });
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
