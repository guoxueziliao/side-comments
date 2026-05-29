import { editorInfoField } from "obsidian";
import { RangeSet, type Extension, type Range } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, gutter, GutterMarker, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import type SideCommentsPlugin from "../../main";
import type { MarkColor, SideComment } from "../types";
import { normalizeVaultRelativePath } from "../storage/pathHash";
import { getMarkClassNames } from "./markDecorations";

export function createSideCommentsEditorExtension(plugin: SideCommentsPlugin): Extension {
  return [
    createInlineMarkPlugin(plugin),
    createNoteGutter(plugin)
  ];
}

function createInlineMarkPlugin(plugin: SideCommentsPlugin): Extension {
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

        const docLength = this.view.state.doc.length;
        const comments = document.comments
          .filter((comment) => comment.mark.type !== "note" && shouldRenderComment(comment, plugin.settings.showResolvedMarks))
          .sort((left, right) => {
            if (left.anchor.startOffset === right.anchor.startOffset) {
              return visualPriority(left) - visualPriority(right);
            }
            return left.anchor.startOffset - right.anchor.startOffset;
          });

        const ranges: Range<Decoration>[] = [];
        for (const comment of comments) {
          const from = Math.max(0, Math.min(comment.anchor.startOffset, docLength));
          const to = Math.max(from, Math.min(comment.anchor.endOffset, docLength));
          if (from === to) {
            continue;
          }

          ranges.push(
            Decoration.mark({
              class: getMarkClassNames(comment).join(" "),
              attributes: {
                "data-side-comments-id": comment.id,
                title: plugin.t("marks.viewComment")
              }
            }).range(from, to)
          );
        }

        return RangeSet.of(ranges, true);
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

class NoteGutterMarker extends GutterMarker {
  constructor(public readonly color: MarkColor, public readonly commentId: string) {
    super();
  }

  eq(other: NoteGutterMarker): boolean {
    return other.color === this.color && other.commentId === this.commentId;
  }

  toDOM(): HTMLElement {
    const el = document.createElement("div");
    el.className = `side-comments-gutter-note side-comments-gutter-note--${this.color}`;
    el.dataset.sideCommentsLineNoteId = this.commentId;
    return el;
  }
}

function createNoteGutter(plugin: SideCommentsPlugin): Extension {
  return gutter({
    class: "side-comments-note-gutter",
    markers(view) {
      const document = plugin.currentDocument;
      if (plugin.areAnnotationMarksHidden() || !document) {
        return RangeSet.empty;
      }

      const info = view.state.field(editorInfoField, false);
      const filePath = info?.file?.path ?? plugin.getActiveMarkdownFile()?.path ?? null;
      if (!filePath || normalizeVaultRelativePath(filePath) !== document.filePath) {
        return RangeSet.empty;
      }

      const docLength = view.state.doc.length;
      const ranges: Range<GutterMarker>[] = [];
      for (const comment of document.comments) {
        if (comment.mark.type !== "note") continue;
        if (!shouldRenderComment(comment, plugin.settings.showResolvedMarks)) continue;

        const from = Math.max(0, Math.min(comment.anchor.startOffset, docLength));
        const to = Math.max(from, Math.min(comment.anchor.endOffset, docLength));
        if (from === to) continue;

        const startLine = view.state.doc.lineAt(from);
        const endLine = view.state.doc.lineAt(to);
        const marker = new NoteGutterMarker(comment.mark.color, comment.id);
        for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo += 1) {
          const line = view.state.doc.line(lineNo);
          ranges.push(marker.range(line.from));
        }
      }

      return RangeSet.of(ranges, true);
    },
    domEventHandlers: {
      click(_view, _line, event) {
        const target = event.target as HTMLElement | null;
        const el = target?.closest<HTMLElement>("[data-side-comments-line-note-id]");
        const commentId = el?.dataset.sideCommentsLineNoteId;
        if (!commentId) {
          return false;
        }
        event.preventDefault();
        event.stopPropagation();
        void plugin.focusCommentInSidebar(commentId, false);
        return true;
      }
    }
  });
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
  if (comment.mark.type === "note") {
    return 3;
  }
  return 2;
}
