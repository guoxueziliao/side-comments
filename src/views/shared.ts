import { setIcon } from "obsidian";

export function createToolbarButton(
  container: HTMLElement,
  label: string,
  tooltip: string,
  onClick: () => void,
  active = false
): HTMLButtonElement {
  const button = container.createEl("button", {
    cls: ["side-comments-toolbar-button", active ? "is-active" : ""].filter(Boolean).join(" "),
    attr: {
      type: "button",
      title: tooltip,
      "aria-label": tooltip
    }
  });
  button.createSpan({ cls: "side-comments-toolbar-button-label", text: label });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}

export function createIconButton(
  container: HTMLElement,
  icon: string,
  tooltip: string,
  onClick: (event: MouseEvent) => void,
  variant: "ghost" | "primary" = "ghost"
): HTMLButtonElement {
  const button = container.createEl("button", {
    cls: ["side-comments-icon-button", `side-comments-icon-button--${variant}`].join(" "),
    attr: {
      type: "button",
      title: tooltip,
      "aria-label": tooltip
    }
  });
  setIcon(button, icon);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  });
  return button;
}

export interface FilterChipOptions {
  label: string;
  valueLabel?: string;
  active: boolean;
  onClick: (event: MouseEvent) => void;
}

export function createFilterChip(container: HTMLElement, options: FilterChipOptions): HTMLButtonElement {
  const button = container.createEl("button", {
    cls: ["side-comments-filter-chip", options.active ? "is-active" : ""].filter(Boolean).join(" "),
    attr: {
      type: "button",
      title: options.label,
      "aria-label": options.label
    }
  });
  button.createSpan({ cls: "side-comments-filter-chip-label", text: options.label });
  if (options.valueLabel) {
    button.createSpan({ cls: "side-comments-filter-chip-value", text: options.valueLabel });
  }
  setIcon(button.createSpan({ cls: "side-comments-filter-chip-caret" }), "chevron-down");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    options.onClick(event);
  });
  return button;
}

export interface MultiSelectItem {
  key: string;
  label: string;
}

export interface MultiSelectPopupOptions {
  anchor: HTMLElement;
  items: MultiSelectItem[];
  selected: Set<string>;
  searchPlaceholder: string;
  onChange: (next: Set<string>) => void;
}

export function openMultiSelectPopup(options: MultiSelectPopupOptions): () => void {
  const popup = document.body.createDiv({ cls: "side-comments-multi-select-popup" });
  popup.style.position = "fixed";
  popup.style.zIndex = "1100";

  const anchorRect = options.anchor.getBoundingClientRect();
  popup.style.left = `${anchorRect.left}px`;
  popup.style.top = `${anchorRect.bottom + 4}px`;

  const search = popup.createEl("input", {
    cls: "side-comments-multi-select-search",
    attr: {
      type: "search",
      placeholder: options.searchPlaceholder
    }
  });

  const list = popup.createDiv({ cls: "side-comments-multi-select-list" });

  const selected = new Set(options.selected);
  let query = "";

  const renderList = (): void => {
    list.empty();
    const lower = query.trim().toLowerCase();
    const filtered = lower
      ? options.items.filter((item) => item.label.toLowerCase().includes(lower) || item.key.toLowerCase().includes(lower))
      : options.items;
    if (filtered.length === 0) {
      list.createDiv({ cls: "side-comments-multi-select-empty", text: "—" });
      return;
    }
    for (const item of filtered) {
      const row = list.createEl("label", { cls: "side-comments-multi-select-row" });
      const checkbox = row.createEl("input", { attr: { type: "checkbox" } });
      checkbox.checked = selected.has(item.key);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selected.add(item.key);
        } else {
          selected.delete(item.key);
        }
        options.onChange(new Set(selected));
      });
      row.createSpan({ text: item.label });
    }
  };

  search.addEventListener("input", () => {
    query = search.value;
    renderList();
  });

  renderList();
  requestAnimationFrame(() => search.focus());

  const close = (): void => {
    document.removeEventListener("mousedown", outsideClickHandler, true);
    document.removeEventListener("keydown", escapeHandler, true);
    popup.remove();
  };

  const outsideClickHandler = (event: MouseEvent): void => {
    const target = event.target as Node | null;
    if (target && (popup.contains(target) || options.anchor.contains(target))) {
      return;
    }
    close();
  };

  const escapeHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      close();
    }
  };

  document.addEventListener("mousedown", outsideClickHandler, true);
  document.addEventListener("keydown", escapeHandler, true);

  return close;
}
