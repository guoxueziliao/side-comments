import type { MarkColor, MarkType, SelectionAction } from "../types";
import type { Translator } from "../i18n";

export interface SelectionToolbarAction {
  id: SelectionAction;
  type: MarkType;
  color: MarkColor;
  titleKey: "toolbar.highlight" | "toolbar.underline" | "toolbar.strikethrough" | "toolbar.comment";
  shortLabelKey: "toolbar.highlight.short" | "toolbar.underline.short" | "toolbar.strikethrough.short" | "toolbar.comment.short";
}

export const TOOLBAR_ACTIONS: SelectionToolbarAction[] = [
  { id: "highlight", type: "highlight", color: "yellow", titleKey: "toolbar.highlight", shortLabelKey: "toolbar.highlight.short" },
  { id: "underline", type: "underline", color: "blue", titleKey: "toolbar.underline", shortLabelKey: "toolbar.underline.short" },
  { id: "strikethrough", type: "strikethrough", color: "red", titleKey: "toolbar.strikethrough", shortLabelKey: "toolbar.strikethrough.short" },
  { id: "comment", type: "highlight", color: "purple", titleKey: "toolbar.comment", shortLabelKey: "toolbar.comment.short" }
];

export class SelectionToolbar {
  private readonly root: HTMLDivElement;

  constructor(
    private readonly host: HTMLElement,
    private readonly onAction: (action: SelectionToolbarAction) => void,
    private readonly t: Translator
  ) {
    const position = getComputedStyle(host).position;
    if (position === "static") {
      host.style.position = "relative";
    }

    this.root = host.createDiv({ cls: "side-comments-toolbar" });
    this.root.style.position = "fixed";
    this.root.style.display = "none";

    for (const action of TOOLBAR_ACTIONS) {
      const title = this.t(action.titleKey);
      const shortLabel = this.t(action.shortLabelKey);
      const button = this.root.createEl("button", {
        cls: "side-comments-toolbar-button",
        attr: {
          type: "button",
          title,
          "aria-label": title
        }
      });
      button.createSpan({ cls: "side-comments-toolbar-button-label", text: shortLabel });
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.onAction(action);
        this.hide();
      });
    }
  }

  show(anchor: { left: number; top: number }): void {
    this.root.style.display = "flex";
    const width = this.root.offsetWidth;
    const height = this.root.offsetHeight;
    const left = clamp(anchor.left - width / 2, 8, window.innerWidth - width - 8);
    const top = clamp(anchor.top - height - 8, 8, window.innerHeight - height - 8);

    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;
  }

  hide(): void {
    this.root.style.display = "none";
  }

  destroy(): void {
    this.root.remove();
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, Math.max(min, max)));
}
