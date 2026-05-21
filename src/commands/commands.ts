import { Notice, type Editor, type MarkdownFileInfo } from "obsidian";
import type SideCommentsPlugin from "../../main";
import { TOOLBAR_ACTIONS, type SelectionToolbarAction } from "../editor/selectionToolbar";

export function registerSideCommentCommands(plugin: SideCommentsPlugin): void {
  plugin.addCommand({
    id: "open-side-comments",
    name: "Open side comments panel",
    callback: () => {
      void plugin.activateSidebar();
    }
  });

  for (const action of TOOLBAR_ACTIONS) {
    plugin.addCommand({
      id: `add-${action.id}`,
      name: `Add ${action.title.toLowerCase()} to current selection`,
      editorCallback: (editor: Editor, ctx: MarkdownFileInfo) => {
        void createFromEditor(plugin, editor, ctx, action);
      }
    });
  }

  plugin.addCommand({
    id: "load-current-sidecar",
    name: "Load current document sidecar",
    callback: async () => {
      const file = plugin.getActiveMarkdownFile();
      if (!file) {
        new Notice("Open a Markdown file first.");
        return;
      }

      await plugin.loadForFile(file);
      new Notice("Side Comments sidecar loaded.");
    }
  });
}

async function createFromEditor(
  plugin: SideCommentsPlugin,
  editor: Editor,
  ctx: MarkdownFileInfo,
  action: SelectionToolbarAction
): Promise<void> {
  await plugin.createAnnotationFromObsidianEditor(editor, ctx.file, action);
}
