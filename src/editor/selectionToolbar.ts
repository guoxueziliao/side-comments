import { setIcon } from "obsidian";
import type { MarkColor, MarkType, SelectionAction } from "../types";
import type { Translator } from "../i18n";

export interface SelectionToolbarAction {
  id: SelectionAction;
  type: MarkType;
  color: MarkColor;
  titleKey: "toolbar.highlight" | "toolbar.underline" | "toolbar.strikethrough" | "toolbar.more";
  initialNote?: string;
  tags?: string[];
}

interface MarkTypeSpec {
  id: SelectionAction;
  type: MarkType;
  defaultColor: MarkColor;
  titleKey: SelectionToolbarAction["titleKey"];
  icon: string;
}

const MARK_TYPE_SPECS: MarkTypeSpec[] = [
  { id: "highlight",     type: "highlight",     defaultColor: "yellow", titleKey: "toolbar.highlight",     icon: "highlighter" },
  { id: "underline",     type: "underline",     defaultColor: "blue",   titleKey: "toolbar.underline",     icon: "underline" },
  { id: "strikethrough", type: "strikethrough", defaultColor: "red",    titleKey: "toolbar.strikethrough", icon: "strikethrough" }
];

export const TOOLBAR_ACTIONS: SelectionToolbarAction[] = MARK_TYPE_SPECS.map((spec) => ({
  id: spec.id,
  type: spec.type,
  color: spec.defaultColor,
  titleKey: spec.titleKey
}));

export class SelectionToolbar {
  private readonly root: HTMLDivElement;
  private readonly lastUsedColor = new Map<MarkType, MarkColor>();

  constructor(
    private readonly host: HTMLElement,
    private readonly onAction: (action: SelectionToolbarAction) => void,
    private readonly onOpenAdvancedCreate: () => void,
    private readonly t: Translator
  ) {
    const position = getComputedStyle(host).position;
    if (position === "static") {
      host.style.position = "relative";
    }

    this.root = host.createDiv({ cls: "side-comments-toolbar" });
    this.root.style.position = "fixed";
    this.root.style.display = "none";
    this.root.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    for (const spec of MARK_TYPE_SPECS) {
      this.renderMarkButton(spec);
    }

    this.root.createDiv({ cls: "side-comments-toolbar-divider" });

    this.renderOverflowButton();
  }

  private renderMarkButton(spec: MarkTypeSpec): void {
    const title = this.t(spec.titleKey);

    const main = this.root.createEl("button", {
      cls: "side-comments-toolbar-button side-comments-toolbar-button--mark",
      attr: {
        type: "button",
        title,
        "aria-label": title,
        "data-mark-type": spec.type
      }
    });
    setIcon(main, spec.icon);
    main.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.applyMark(spec, this.resolveColor(spec));
    });
  }

  private renderOverflowButton(): void {
    const button = this.root.createEl("button", {
      cls: "side-comments-toolbar-button side-comments-toolbar-button--overflow",
      attr: {
        type: "button",
        title: this.t("toolbar.more"),
        "aria-label": this.t("toolbar.more")
      }
    });
    setIcon(button, "more-horizontal");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
      this.onOpenAdvancedCreate();
    });
  }

  private resolveColor(spec: MarkTypeSpec): MarkColor {
    return this.lastUsedColor.get(spec.type) ?? spec.defaultColor;
  }

  private applyMark(spec: MarkTypeSpec, color: MarkColor): void {
    this.lastUsedColor.set(spec.type, color);
    this.onAction({
      id: spec.id,
      type: spec.type,
      color,
      titleKey: spec.titleKey
    });
    this.hide();
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
