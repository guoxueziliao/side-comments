import {
  editorInfoField,
  Editor,
  MarkdownPostProcessorContext,
  MarkdownView,
  Notice,
  Plugin,
  TFile,
  WorkspaceLeaf
} from "obsidian";
import type { EditorView } from "@codemirror/view";
import { registerSideCommentCommands } from "./src/commands/commands";
import { createSideCommentsEditorExtension } from "./src/editor/editorExtension";
import { SelectionToolbar, type SelectionToolbarAction } from "./src/editor/selectionToolbar";
import { renderReadingViewMarks } from "./src/editor/readingViewRenderer";
import { DEFAULT_SETTINGS, loadSideCommentsSettings, saveSideCommentsSettings } from "./src/settings/settings";
import { SideCommentsSettingTab } from "./src/settings/settingsTab";
import { SidecarStore } from "./src/storage/sidecarStore";
import { normalizeVaultRelativePath } from "./src/storage/pathHash";
import { SideCommentsSidebarView, SIDE_COMMENTS_VIEW_TYPE } from "./src/views/sidebarView";
import type { CommentUpdateInput, PluginSettings, SideComment, SideCommentDocument } from "./src/types";

type CurrentDocumentLoadState = "none" | "ready" | "failed";

export default class SideCommentsPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;
  store!: SidecarStore;
  currentDocument: SideCommentDocument | null = null;
  currentDocumentLoadState: CurrentDocumentLoadState = "none";
  private readonly modifyTimers = new Map<string, number>();
  private selectionToolbar: SelectionToolbar | null = null;
  private readonly selectionHandler = () => this.syncSelectionToolbar();

  async onload(): Promise<void> {
    this.settings = await loadSideCommentsSettings(this);
    this.store = new SidecarStore(this.app, this.settings);
    await this.store.ensureManifest(this.manifest.version);

    this.selectionToolbar = new SelectionToolbar(document.body, (action) => {
      void this.handleSelectionAction(action);
    });

    this.registerEditorExtension(createSideCommentsEditorExtension(this));
    this.registerMarkdownPostProcessor((el, ctx) => {
      void this.renderReadingView(el, ctx);
    });

    this.registerView(
      SIDE_COMMENTS_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new SideCommentsSidebarView(leaf, this)
    );

    registerSideCommentCommands(this);
    this.addSettingTab(new SideCommentsSettingTab(this.app, this));
    this.addRibbonIcon("message-square-text", "Open side comments", () => {
      void this.activateSidebar();
    });

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        void this.loadForFile(file);
      })
    );

    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (file instanceof TFile && file.extension === "md") {
          this.scheduleRelocation(file);
        }
      })
    );

    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (file instanceof TFile && file.extension === "md") {
          void this.handleRename(file, oldPath);
        }
      })
    );

    this.registerDomEvent(document, "mouseup", this.selectionHandler);
    this.registerDomEvent(document, "keyup", this.selectionHandler);

    await this.loadForFile(this.getActiveMarkdownFile());
  }

  onunload(): void {
    for (const timer of this.modifyTimers.values()) {
      window.clearTimeout(timer);
    }
    this.modifyTimers.clear();
    this.selectionToolbar?.destroy();
    this.selectionToolbar = null;
    this.app.workspace.detachLeavesOfType(SIDE_COMMENTS_VIEW_TYPE);
  }

  async saveSettings(): Promise<void> {
    await saveSideCommentsSettings(this, this.settings);
    this.store.updateSettings(this.settings);
    this.refreshAllViews();
  }

  getActiveMarkdownFile(): TFile | null {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    return view?.file ?? null;
  }

  setCurrentDocument(document: SideCommentDocument | null): void {
    this.currentDocument = document;
    this.currentDocumentLoadState = document ? "ready" : "none";
  }

  refreshAllViews(): void {
    this.app.workspace.updateOptions();
    void this.refreshSidebar();
  }

  async activateSidebar(): Promise<void> {
    const leaves = this.app.workspace.getLeavesOfType(SIDE_COMMENTS_VIEW_TYPE);
    let leaf: WorkspaceLeaf | null = leaves[0] ?? null;

    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new Notice("Could not open Side Comments view.");
        return;
      }
      await leaf.setViewState({ type: SIDE_COMMENTS_VIEW_TYPE, active: true });
    }

    this.app.workspace.revealLeaf(leaf);
    await this.refreshSidebar();
  }

  async loadForFile(file: TFile | null): Promise<void> {
    if (!file || file.extension !== "md") {
      this.currentDocument = null;
      this.currentDocumentLoadState = "none";
      this.refreshAllViews();
      return;
    }

    try {
      const loaded = await this.store.loadDocument(file.path);
      const sourceText = await this.app.vault.cachedRead(file);
      this.currentDocument = await this.store.relocateDocument(file.path, sourceText, loaded);
      this.currentDocumentLoadState = "ready";
    } catch (error) {
      console.error("Side Comments failed to load sidecar", error);
      this.currentDocument = null;
      this.currentDocumentLoadState = "failed";
      new Notice("Side Comments: failed to load annotation data.");
    }

    this.refreshAllViews();
  }

  async createAnnotationFromEditorView(view: EditorView, action: SelectionToolbarAction): Promise<void> {
    const info = view.state.field(editorInfoField, false);
    const file = info?.file;
    if (!file) {
      new Notice("Open a Markdown file first.");
      return;
    }

    const selection = view.state.selection.main;
    if (selection.empty) {
      return;
    }

    await this.createAnnotationFromOffsets(
      file.path,
      view.state.doc.toString(),
      selection.from,
      selection.to,
      action
    );
  }

  async createAnnotationFromObsidianEditor(editor: Editor, file: TFile | null, action: SelectionToolbarAction): Promise<void> {
    if (!file) {
      new Notice("Open a Markdown file first.");
      return;
    }

    if (!editor.somethingSelected()) {
      new Notice("Select text first.");
      return;
    }

    const startOffset = editor.posToOffset(editor.getCursor("from"));
    const endOffset = editor.posToOffset(editor.getCursor("to"));
    await this.createAnnotationFromOffsets(file.path, editor.getValue(), startOffset, endOffset, action);
  }

  private async handleSelectionAction(action: SelectionToolbarAction): Promise<void> {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view?.file) {
      return;
    }

    if (view.getMode() === "source") {
      await this.createAnnotationFromObsidianEditor(view.editor, view.file, action);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const previewRoot = view.previewMode.containerEl;
    if (!previewRoot.contains(range.commonAncestorContainer)) {
      return;
    }

    const sourceText = view.getViewData();
    const selectedText = selection.toString();
    const match = findSelectedTextInSource(sourceText, selectedText);
    if (!match) {
      new Notice("Side Comments: could not map the selected preview text to Markdown source.");
      return;
    }

    await this.createAnnotationFromOffsets(view.file.path, sourceText, match.startOffset, match.endOffset, action);
  }

  private syncSelectionToolbar(): void {
    if (!this.selectionToolbar) {
      return;
    }

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view?.file) {
      this.selectionToolbar.hide();
      return;
    }

    if (view.getMode() === "source") {
      const editorSelection = view.editor.getSelection();
      if (!editorSelection.trim()) {
        this.selectionToolbar.hide();
        return;
      }

      const rect = this.getBrowserSelectionRect(view.containerEl);
      const fallbackRect = view.containerEl.getBoundingClientRect();
      this.selectionToolbar.show({
        left: rect ? rect.left + rect.width / 2 : fallbackRect.left + 80,
        top: rect ? rect.top : fallbackRect.top + 48
      });
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      this.selectionToolbar.hide();
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      this.selectionToolbar.hide();
      return;
    }

    const range = selection.getRangeAt(0);
    if (!view.previewMode.containerEl.contains(range.commonAncestorContainer)) {
      this.selectionToolbar.hide();
      return;
    }

    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      this.selectionToolbar.hide();
      return;
    }

    this.selectionToolbar.show({ left: rect.left + rect.width / 2, top: rect.top });
  }

  private getBrowserSelectionRect(container: HTMLElement): DOMRect | null {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) {
      return null;
    }

    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      return null;
    }

    return rect;
  }

  async createAnnotationFromOffsets(
    filePath: string,
    sourceText: string,
    startOffset: number,
    endOffset: number,
    action: SelectionToolbarAction
  ): Promise<void> {
    try {
      const result = await this.store.upsertComment({
        filePath,
        sourceText,
        startOffset,
        endOffset,
        markType: action.type,
        color: action.color
      });

      this.currentDocument = result.document;
      this.currentDocumentLoadState = "ready";
      this.refreshAllViews();

      if (this.settings.autoOpenSidebarAfterCreate || !result.created) {
        await this.focusCommentInSidebar(result.comment.id, true);
      }
    } catch (error) {
      console.error("Side Comments failed to create annotation", error);
      new Notice("Side Comments: failed to create annotation.");
    }
  }

  async updateComment(commentId: string, input: CommentUpdateInput): Promise<SideCommentDocument> {
    const document = this.requireCurrentDocument();
    return this.store.updateComment(document.filePath, commentId, input);
  }

  async setCommentStatus(commentId: string, status: SideComment["status"]): Promise<SideCommentDocument> {
    const document = this.requireCurrentDocument();
    return this.store.setCommentStatus(document.filePath, commentId, status);
  }

  async deleteComment(commentId: string): Promise<SideCommentDocument> {
    const document = this.requireCurrentDocument();
    return this.store.deleteComment(document.filePath, commentId);
  }

  async focusCommentInSidebar(commentId: string, edit = false): Promise<void> {
    await this.activateSidebar();
    for (const view of this.getSidebarViews()) {
      view.focusComment(commentId, edit);
    }
  }

  async jumpToCommentInEditor(commentId: string): Promise<void> {
    const document = this.requireCurrentDocument();
    const comment = document.comments.find((item) => item.id === commentId);
    if (!comment) {
      return;
    }
    if (comment.status === "orphaned") {
      new Notice("原文失联，无法跳转。");
      return;
    }

    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || normalizeVaultRelativePath(view.file?.path ?? "") !== document.filePath) {
      const file = this.app.vault.getAbstractFileByPath(document.filePath);
      if (file instanceof TFile) {
        await this.app.workspace.getLeaf(false).openFile(file);
        view = this.app.workspace.getActiveViewOfType(MarkdownView);
      }
    }

    if (!view) {
      new Notice("Could not open source note.");
      return;
    }

    const from = view.editor.offsetToPos(comment.anchor.startOffset);
    const to = view.editor.offsetToPos(comment.anchor.endOffset);
    view.editor.setSelection(from, to);
    view.editor.scrollIntoView({ from, to }, true);
    view.editor.focus();
  }

  async refreshSidebar(): Promise<void> {
    for (const view of this.getSidebarViews()) {
      await view.render();
    }
  }

  private getSidebarViews(): SideCommentsSidebarView[] {
    return this.app.workspace
      .getLeavesOfType(SIDE_COMMENTS_VIEW_TYPE)
      .map((leaf) => leaf.view)
      .filter((view): view is SideCommentsSidebarView => view instanceof SideCommentsSidebarView);
  }

  private requireCurrentDocument(): SideCommentDocument {
    if (!this.currentDocument) {
      throw new Error("No current Side Comments document is loaded.");
    }
    return this.currentDocument;
  }

  private scheduleRelocation(file: TFile): void {
    const normalizedPath = normalizeVaultRelativePath(file.path);
    if (this.currentDocument?.filePath !== normalizedPath) {
      return;
    }

    const existingTimer = this.modifyTimers.get(normalizedPath);
    if (existingTimer !== undefined) {
      window.clearTimeout(existingTimer);
    }

    const timer = window.setTimeout(() => {
      this.modifyTimers.delete(normalizedPath);
      void this.relocateCurrentFile(file);
    }, this.settings.relocateDebounceMs);
    this.modifyTimers.set(normalizedPath, timer);
  }

  private async relocateCurrentFile(file: TFile): Promise<void> {
    try {
      const sourceText = await this.app.vault.cachedRead(file);
      const updated = await this.store.relocateDocument(file.path, sourceText, this.currentDocument ?? undefined);
      this.currentDocument = updated;
      this.currentDocumentLoadState = "ready";
      this.refreshAllViews();
    } catch (error) {
      console.error("Side Comments failed to relocate anchors", error);
      this.currentDocumentLoadState = "failed";
      this.refreshAllViews();
    }
  }

  private async handleRename(file: TFile, oldPath: string): Promise<void> {
    const oldNormalized = normalizeVaultRelativePath(oldPath);
    const updated = await this.store.migrateRenamedFile(oldPath, file.path);
    if (this.currentDocument?.filePath === oldNormalized) {
      this.currentDocument = updated ?? await this.store.loadDocument(file.path);
      this.currentDocumentLoadState = "ready";
      this.refreshAllViews();
    }
  }

  private async renderReadingView(el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
    try {
      const normalizedPath = normalizeVaultRelativePath(ctx.sourcePath);
      const document =
        this.currentDocument?.filePath === normalizedPath
          ? this.currentDocument
          : await this.store.loadDocument(normalizedPath);

      const comments = document.comments.filter((comment) => {
        if (comment.status === "resolved" && !this.settings.showResolvedMarks) {
          return false;
        }
        return true;
      });

      renderReadingViewMarks(el, comments, {
        onCommentClick: (commentId) => {
          void this.focusCommentInSidebar(commentId, false);
        }
      });
    } catch (error) {
      console.error("Side Comments failed to render reading view marks", error);
    }
  }
}

function findSelectedTextInSource(sourceText: string, selectedText: string): { startOffset: number; endOffset: number } | null {
  const exactStart = sourceText.indexOf(selectedText);
  if (exactStart >= 0) {
    return {
      startOffset: exactStart,
      endOffset: exactStart + selectedText.length
    };
  }

  const sourceNormalized = normalizeTextForPreviewMatch(sourceText);
  const selectedNormalized = normalizeTextForPreviewMatch(selectedText);
  if (!selectedNormalized.text) {
    return null;
  }

  const normalizedStart = sourceNormalized.text.indexOf(selectedNormalized.text);
  if (normalizedStart < 0) {
    return null;
  }

  const normalizedEnd = normalizedStart + selectedNormalized.text.length - 1;
  const startOffset = sourceNormalized.offsets[normalizedStart];
  const endOffset = sourceNormalized.offsets[normalizedEnd] + 1;
  if (startOffset === undefined || endOffset === undefined || startOffset >= endOffset) {
    return null;
  }

  return {
    startOffset,
    endOffset
  };
}

function normalizeTextForPreviewMatch(value: string): { text: string; offsets: number[] } {
  let text = "";
  const offsets: number[] = [];
  let previousWasWhitespace = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (isMarkdownFormattingChar(char)) {
      continue;
    }

    if (/\s/.test(char)) {
      if (!previousWasWhitespace && text.length > 0) {
        text += " ";
        offsets.push(index);
        previousWasWhitespace = true;
      }
      continue;
    }

    text += char;
    offsets.push(index);
    previousWasWhitespace = false;
  }

  return {
    text: text.trim(),
    offsets
  };
}

function isMarkdownFormattingChar(char: string): boolean {
  return char === "*" || char === "_" || char === "~" || char === "`" || char === "#" || char === ">" || char === "[" || char === "]" || char === "(" || char === ")" || char === "!";
}
