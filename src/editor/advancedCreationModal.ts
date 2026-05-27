import { App, Modal, Setting } from "obsidian";
import type SideCommentsPlugin from "../../main";
import type { AnnotationType, MarkColor, MarkType } from "../types";
import { ANNOTATION_TYPES, annotationTypeLabel } from "../organization/annotationMetadata";
import type { SelectionToolbarAction } from "./selectionToolbar";

const MARK_TYPE_OPTIONS: { value: MarkType; titleKey: SelectionToolbarAction["titleKey"]; defaultColor: MarkColor }[] = [
  { value: "highlight",     titleKey: "toolbar.highlight",     defaultColor: "yellow" },
  { value: "underline",     titleKey: "toolbar.underline",     defaultColor: "blue" },
  { value: "strikethrough", titleKey: "toolbar.strikethrough", defaultColor: "red" },
  { value: "note",          titleKey: "toolbar.note",          defaultColor: "purple" }
];

const COLOR_OPTIONS: MarkColor[] = ["yellow", "blue", "red", "green", "purple"];

export class AdvancedCreationModal extends Modal {
  private markType: MarkType = "highlight";
  private color: MarkColor = "yellow";
  private annotationType: AnnotationType = "excerpt";
  private noteContent = "";

  constructor(
    app: App,
    private readonly plugin: SideCommentsPlugin,
    private readonly onSubmit: (action: SelectionToolbarAction) => void
  ) {
    super(app);
  }

  onOpen(): void {
    const { contentEl, titleEl } = this;
    contentEl.empty();
    titleEl.setText(this.plugin.t("advancedCreate.title"));

    new Setting(contentEl)
      .setName(this.plugin.t("advancedCreate.markType"))
      .addDropdown((dropdown) => {
        for (const option of MARK_TYPE_OPTIONS) {
          dropdown.addOption(option.value, this.plugin.t(option.titleKey));
        }
        dropdown.setValue(this.markType);
        dropdown.onChange((value) => {
          this.markType = value as MarkType;
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

    new Setting(contentEl)
      .setName(this.plugin.t("advancedCreate.annotationType"))
      .addDropdown((dropdown) => {
        for (const type of ANNOTATION_TYPES) {
          dropdown.addOption(type, annotationTypeLabel(type, this.plugin.t));
        }
        dropdown.setValue(this.annotationType);
        dropdown.onChange((value) => {
          this.annotationType = value as AnnotationType;
        });
      });

    new Setting(contentEl)
      .setName(this.plugin.t("advancedCreate.note"))
      .addTextArea((textarea) => {
        textarea
          .setPlaceholder(this.plugin.t("advancedCreate.notePlaceholder"))
          .setValue(this.noteContent)
          .onChange((value) => {
            this.noteContent = value;
          });
        textarea.inputEl.rows = 3;
        textarea.inputEl.addClass("side-comments-advanced-create-note");
      });

    new Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText(this.plugin.t("action.cancel"))
          .onClick(() => this.close());
      })
      .addButton((button) => {
        button
          .setCta()
          .setButtonText(this.plugin.t("advancedCreate.submit"))
          .onClick(() => {
            const action: SelectionToolbarAction = {
              id: this.markType,
              type: this.markType,
              color: this.color,
              titleKey: titleKeyForMarkType(this.markType),
              annotationType: this.annotationType,
              initialNote: this.noteContent.trim() || undefined
            };
            this.close();
            this.onSubmit(action);
          });
      });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

function titleKeyForMarkType(markType: MarkType): SelectionToolbarAction["titleKey"] {
  const option = MARK_TYPE_OPTIONS.find((entry) => entry.value === markType);
  return option ? option.titleKey : "toolbar.highlight";
}
