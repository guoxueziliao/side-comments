import { editorInfoField } from "obsidian";
import { RangeSetBuilder, type Extension } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import type SideCommentsPlugin from "../../main";
import type { SideComment } from "../types";
import { normalizeVaultRelativePath } from "../storage/pathHash";
import { getMarkClassNames } from "./markDecorations";

export function createSideCommentsEditorExtension(plugin: SideCommentsPlugin): Extension {
  return ViewPlugin.fromClass(
    class SideCommentsEditorPlugin {
      decorations: DecorationSet;
      private readonly clickHandler: (event: MouseEvent) => void;

      constructor(private readonly view: EditorView) {
        this.clickHandler = (event) => this.handleClick(event);
        view.dom.addEventListener("click", this.clickHandler);
        this.decorations = this.buildDecorations();
      }

      update(update: ViewUpdate): void {
        if (update.docChanged || update.viewportChanged || update.transactions.length > 0) {
          this.decorations = this.buildDecorations();
        }
      }

      destroy(): void {
        this.view.dom.removeEventListener("click", this.clickHandler);
      }

      private buildDecorations(): DecorationSet {
        const filePath = this.getFilePath();
        const document = plugin.currentDocument;
        if (plugin.areAnnotationMarksHidden() || !filePath || !document || normalizeVaultRelativePath(filePath) !== document.filePath) {
          return Decoration.none;
        }

        const builder = new RangeSetBuilder<Decoration>();
        const docLength = this.view.state.doc.length;
        const comments = document.comments
          .filter((comment) => shouldRenderComment(comment, plugin.settings.showResolvedMarks))
          .sort((left, right) => {
            if (left.anchor.startOffset === right.anchor.startOffset) {
              return visualPriority(left) - visualPriority(right);
            }
            return left.anchor.startOffset - right.anchor.startOffset;
          });

        for (const comment of comments) {
          const from = Math.max(0, Math.min(comment.anchor.startOffset, docLength));
          const to = Math.max(from, Math.min(comment.anchor.endOffset, docLength));
          if (from === to) {
            continue;
          }

          builder.add(from, to, Decoration.mark({
            class: getMarkClassNames(comment).join(" "),
            attributes: {
              "data-side-comments-id": comment.id,
              title: plugin.t("marks.viewComment")
            }
          }));
        }

        return builder.finish();
      }

      private getFilePath(): string | null {
        const info = this.view.state.field(editorInfoField, false);
        return info?.file?.path ?? plugin.getActiveMarkdownFile()?.path ?? null;
      }

      private handleClick(event: MouseEvent): void {
        const target = event.target instanceof HTMLElement ? event.target : null;
        const mark = target?.closest<HTMLElement>("[data-side-comments-id]");
        const commentId = mark?.dataset.sideCommentsId;
        if (!commentId) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        void plugin.focusCommentInSidebar(commentId, false);
      }
    },
    {
      decorations: (value) => value.decorations
    }
  );
}

function shouldRenderComment(comment: SideComment, showResolvedMarks: boolean): boolean {
  if (comment.status === "orphaned") {
    return false;
  }
  if (comment.status === "resolved" && !showResolvedMarks) {
    return false;
  }
  return true;
}

function visualPriority(comment: SideComment): number {
  if (comment.mark.type === "highlight") {
    return 0;
  }
  if (comment.mark.type === "underline") {
    return 1;
  }
  return 2;
}
