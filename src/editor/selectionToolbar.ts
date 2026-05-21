import type { MarkColor, MarkType, SelectionAction } from "../types";

export interface SelectionToolbarAction {
  id: SelectionAction;
  type: MarkType;
  color: MarkColor;
  title: string;
  shortLabel: string;
}

export const TOOLBAR_ACTIONS: SelectionToolbarAction[] = [
  { id: "highlight", type: "highlight", color: "yellow", title: "高亮", shortLabel: "高" },
  { id: "underline", type: "underline", color: "blue", title: "下划线", shortLabel: "下" },
  { id: "strikethrough", type: "strikethrough", color: "red", title: "删除线", shortLabel: "删" },
  { id: "comment", type: "highlight", color: "purple", title: "评论", shortLabel: "注" }
];

export class SelectionToolbar {
  private readonly root: HTMLDivElement;

  constructor(
    private readonly host: HTMLElement,
    private readonly onAction: (action: SelectionToolbarAction) => void
  ) {
    const position = getComputedStyle(host).position;
    if (position === "static") {
      host.style.position = "relative";
    }

    this.root = host.createDiv({ cls: "side-comments-toolbar" });
    this.root.style.position = "fixed";
    this.root.style.display = "none";

    for (const action of TOOLBAR_ACTIONS) {
      const button = this.root.createEl("button", {
        cls: "side-comments-toolbar-button",
        attr: {
          type: "button",
          title: action.title,
          "aria-label": action.title
        }
      });
      button.createSpan({ cls: "side-comments-toolbar-button-label", text: action.shortLabel });
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
    const left = Math.max(8, anchor.left);
    const top = Math.max(8, anchor.top - 42);

    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;
    this.root.style.display = "flex";
  }

  hide(): void {
    this.root.style.display = "none";
  }

  destroy(): void {
    this.root.remove();
  }
}
