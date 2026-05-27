import { Notice, type Editor, type MarkdownFileInfo } from "obsidian";
import type SideCommentsPlugin from "../../main";
import { TOOLBAR_ACTIONS, type SelectionToolbarAction } from "../editor/selectionToolbar";
import type { AnnotationType } from "../types";

const TYPED_CREATE_COMMANDS: { id: string; annotationType: AnnotationType; nameKey: "command.addAsQuestion" | "command.addAsThought" | "command.addAsTask" }[] = [
  { id: "add-as-question", annotationType: "question", nameKey: "command.addAsQuestion" },
  { id: "add-as-thought",  annotationType: "thought",  nameKey: "command.addAsThought" },
  { id: "add-as-task",     annotationType: "task",     nameKey: "command.addAsTask" }
];

export function registerSideCommentCommands(plugin: SideCommentsPlugin): void {
  plugin.addCommand({
    id: "open-side-comments",
    name: plugin.t("command.openSidebar"),
    callback: () => {
      void plugin.activateSidebar();
    }
  });

  for (const action of TOOLBAR_ACTIONS) {
    plugin.addCommand({
      id: `add-${action.id}`,
      name: plugin.t("command.addSelection", { label: plugin.t(action.titleKey).toLowerCase() }),
      editorCallback: (editor: Editor, ctx: MarkdownFileInfo) => {
        void createFromEditor(plugin, editor, ctx, action);
      }
    });
  }

  const highlightDefault = TOOLBAR_ACTIONS.find((entry) => entry.id === "highlight") ?? TOOLBAR_ACTIONS[0];
  for (const command of TYPED_CREATE_COMMANDS) {
    plugin.addCommand({
      id: command.id,
      name: plugin.t(command.nameKey),
      editorCallback: (editor: Editor, ctx: MarkdownFileInfo) => {
        const action: SelectionToolbarAction = {
          ...highlightDefault,
          annotationType: command.annotationType
        };
        void createFromEditor(plugin, editor, ctx, action);
      }
    });
  }

  plugin.addCommand({
    id: "load-current-sidecar",
    name: plugin.t("command.loadCurrentSidecar"),
    callback: async () => {
      const file = plugin.getActiveMarkdownFile();
      if (!file) {
        new Notice(plugin.t("notice.openMarkdownFirst"));
        return;
      }

      await plugin.loadForFile(file);
      new Notice(plugin.t("notice.sidecarLoaded"));
    }
  });

  plugin.addCommand({
    id: "toggle-annotation-marks",
    name: plugin.t("command.toggleMarks"),
    callback: () => {
      plugin.toggleAnnotationMarksHidden();
    }
  });

  plugin.addCommand({
    id: "open-annotation-overview",
    name: plugin.t("crossNote.open"),
    callback: () => {
      void plugin.activateCrossNoteReview();
    }
  });

  plugin.addCommand({
    id: "run-health-check-current-note",
    name: plugin.t("health.runCurrentNote"),
    callback: () => {
      void plugin.runAndOpenHealthCheck("current-note");
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
