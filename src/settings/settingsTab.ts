import { App, PluginSettingTab, Setting } from "obsidian";
import type SideCommentsPlugin from "../../main";

export class SideCommentsSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: SideCommentsPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Side Comments" });

    new Setting(containerEl)
      .setName("Auto-open sidebar after creating a comment")
      .setDesc("Open the reading annotation panel after a new annotation is created.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoOpenSidebarAfterCreate)
          .onChange(async (value) => {
            this.plugin.settings.autoOpenSidebarAfterCreate = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Show resolved marks")
      .setDesc("Display resolved annotations in the document with reduced visual strength.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showResolvedMarks)
          .onChange(async (value) => {
            this.plugin.settings.showResolvedMarks = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Cached documents")
      .setDesc("Number of recently loaded sidecar documents kept in memory.")
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
      .setName("Anchor recovery delay")
      .setDesc("Debounce delay in milliseconds before trying to relocate annotations after document changes.")
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
      .setName("Data directory")
      .setDesc("Read-only in the MVP.")
      .addText((text) => {
        text.setValue(this.plugin.settings.dataDir);
        text.inputEl.disabled = true;
      });
  }
}

