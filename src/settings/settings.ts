import type { Plugin } from "obsidian";
import { DATA_DIR, type PluginSettings } from "../types";

export const DEFAULT_SETTINGS: PluginSettings = {
  autoOpenSidebarAfterCreate: true,
  showResolvedMarks: true,
  defaultDensity: "normal",
  language: "auto",
  maxCachedDocuments: 100,
  relocateDebounceMs: 800,
  dataDir: DATA_DIR
};

export async function loadSideCommentsSettings(plugin: Plugin): Promise<PluginSettings> {
  const saved = (await plugin.loadData()) as Partial<PluginSettings> | null;
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    dataDir: DATA_DIR
  };
}

export async function saveSideCommentsSettings(plugin: Plugin, settings: PluginSettings): Promise<void> {
  await plugin.saveData({
    ...settings,
    dataDir: DATA_DIR
  });
}
