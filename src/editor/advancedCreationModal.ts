import { App, Modal, Setting } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { MarkColor, MarkType } from "../types";
import type { SelectionToolbarAction } from "./selectionToolbar";
import type { TranslationKey } from "../i18n";
import { normalizeTagKey, normalizeTags } from "../organization/annotationMetadata";

const MARK_TYPE_OPTIONS: { value: MarkType; label: string; defaultColor: MarkColor }[] = [
  { value: "highlight",     label: "highlight",     defaultColor: "yellow" },
  { value: "underline",     label: "underline",     defaultColor: "blue" },
  { value: "strikethrough", label: "strikethrough", defaultColor: "red" },
  { value: "note",          label: "noVisibleMark", defaultColor: "purple" }
];

const COLOR_OPTIONS: MarkColor[] = ["yellow", "blue", "red", "green", "purple"];

export interface AdvancedCreateInitialValues {
  markType?: MarkType;
  color?: MarkColor;
  noteContent?: string;
  tags?: string[];
}

export class AdvancedCreationModal extends Modal {
  private markType: MarkType = "highlight";
  private color: MarkColor = "yellow";
  private noteContent = "";
  private tags: string[] = [];
  private submitButton: HTMLButtonElement | null = null;

  constructor(
    app: App,
    private readonly plugin: SideCommentsPlugin,
    private readonly onSubmit: (action: SelectionToolbarAction) => void,
    initialValues?: AdvancedCreateInitialValues
  ) {
    super(app);
    if (initialValues) {
      this.markType = initialValues.markType ?? this.markType;
      this.color = initialValues.color ?? this.color;
      this.noteContent = initialValues.noteContent ?? this.noteContent;
      this.tags = initialValues.tags ? normalizeTags(initialValues.tags) : this.tags;
    }
  }

  onOpen(): void {
    const { contentEl, titleEl } = this;
    contentEl.empty();
    titleEl.setText(this.plugin.t("advancedCreate.title"));

    new Setting(contentEl)
      .setName(this.plugin.t("advancedCreate.note"))
      .addTextArea((textarea) => {
        textarea
          .setPlaceholder(this.plugin.t("advancedCreate.notePlaceholder"))
          .setValue(this.noteContent)
          .onChange((value) => {
            this.noteContent = value;
            this.updateSubmitState();
          });
        textarea.inputEl.rows = 3;
        textarea.inputEl.addClass("side-comments-advanced-create-note");
      });

    new Setting(contentEl)
      .setName(this.plugin.t("advancedCreate.markType"))
      .addDropdown((dropdown) => {
        for (const option of MARK_TYPE_OPTIONS) {
          const labelKey = `advancedCreate.mark.${option.label}` as TranslationKey;
          dropdown.addOption(option.value, this.plugin.t(labelKey));
        }
        dropdown.setValue(this.markType);
        dropdown.onChange((value) => {
          this.markType = value as MarkType;
          this.updateSubmitState();
        });
      });

    new Setting(contentEl)
      .setName(this.plugin.t("advancedCreate.color"))
      .addDropdown((dropdown) => {
        for (const color of COLOR_OPTIONS) {
          dropdown.addOption(color, this.plugin.t(`filter.color.${color}`));
        }
        dropdown.setValue(this.color);
        dropdown.onChange((value) => {
          this.color = value as MarkColor;
        });
      });

    const tagSetting = new Setting(contentEl)
      .setName(this.plugin.t("advancedCreate.tags"));
    const tagContainer = tagSetting.settingEl.createDiv({ cls: "side-comments-advanced-create-tags" });
    this.renderTagInput(tagContainer);

    new Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("action.cancel"))
          .onClick(() => this.close());
      })
      .addButton((button) => {
        button.setCta();
        this.submitButton = button.buttonEl;
        button
          .setButtonText(this.plugin.t("advancedCreate.submit"))
          .onClick(() => {
            const action: SelectionToolbarAction = {
              id: this.markType === "note" ? "highlight" : this.markType,
              type: this.markType,
              color: this.color,
              titleKey: titleKeyForMarkType(this.markType),
              initialNote: this.noteContent.trim() || undefined,
              tags: this.tags.length > 0 ? this.tags : undefined
            };
            this.close();
            this.onSubmit(action);
          });
      });

    this.updateSubmitState();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private renderTagInput(container: HTMLElement): void {
    container.empty();
    const chips = container.createDiv({ cls: "side-comments-tag-chips" });
    for (const tag of this.tags) {
      const chip = chips.createSpan({ cls: "side-comments-tag-chip" });
      chip.createSpan({ text: tag });
      const remove = chip.createEl("button", {
        cls: "side-comments-tag-remove",
        attr: { type: "button", title: this.plugin.t("tags.remove") }
      });
      remove.setText("×");
      remove.addEventListener("click", (event) => {
        event.preventDefault();
        this.tags = this.tags.filter((t) => normalizeTagKey(t) !== normalizeTagKey(tag));
        this.renderTagInput(container);
      });
    }

    const input = container.createEl("input", {
      cls: "side-comments-tag-input",
      attr: {
        type: "text",
        placeholder: this.plugin.t("tags.placeholder"),
        "aria-label": this.plugin.t("tags.placeholder")
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.isComposing || event.key !== "Enter") {
        return;
      }
      event.preventDefault();
      const merged = normalizeTags([...this.tags, input.value]);
      if (merged.length !== this.tags.length) {
        this.tags = merged;
        this.renderTagInput(container);
      }
      input.value = "";
    });
  }

  private updateSubmitState(): void {
    if (!this.submitButton) {
      return;
    }
    const hasNote = this.noteContent.trim().length > 0;
    const hasVisibleMark = this.markType !== "note";
    this.submitButton.disabled = !hasNote && !hasVisibleMark;
  }
}

function titleKeyForMarkType(markType: MarkType): SelectionToolbarAction["titleKey"] {
  if (markType === "underline") return "toolbar.underline";
  if (markType === "strikethrough") return "toolbar.strikethrough";
  if (markType === "note") return "toolbar.more";
  return "toolbar.highlight";
}
