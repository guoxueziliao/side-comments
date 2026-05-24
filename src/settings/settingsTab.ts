import { App, PluginSettingTab, Setting } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { SidebarDisplayMode } from "../types";

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
  }
}
