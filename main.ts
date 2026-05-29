import {
  editorInfoField,
  Editor,
  MarkdownPostProcessorContext,
  MarkdownView,
  Notice,
  Plugin,
  TFile,
  WorkspaceLeaf,
  getLanguage
} from "obsidian";
import type { EditorView } from "@codemirror/view";
import { registerSideCommentCommands } from "./src/commands/commands";
import { createSideCommentsEditorExtension } from "./src/editor/editorExtension";
import { SelectionToolbar, type SelectionToolbarAction } from "./src/editor/selectionToolbar";
import { AdvancedCreationModal } from "./src/editor/advancedCreationModal";
import { renderReadingViewMarks } from "./src/editor/readingViewRenderer";
import { DEFAULT_SETTINGS, loadSideCommentsSettings, saveSideCommentsSettings } from "./src/settings/settings";
import { SideCommentsSettingTab } from "./src/settings/settingsTab";
import { SidecarStore } from "./src/storage/sidecarStore";
import { normalizeVaultRelativePath } from "./src/storage/pathHash";
import { createExportPackage, exportPackageToMarkdown, serializeExportPackage } from "./src/storage/export";
import { createBackupBatch } from "./src/storage/backup";
import { formatAnnotationMarkdownDraft, type AnnotationDraftGroup } from "./src/organization/markdownDraft";
import { SideCommentsSidebarView, SIDE_COMMENTS_VIEW_TYPE } from "./src/views/sidebarView";
import { SideCommentsCrossNoteView, SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE } from "./src/views/crossNoteView";
import { SideCommentsHealthView, SIDE_COMMENTS_HEALTH_VIEW_TYPE } from "./src/views/healthView";
import { createTranslator, type Translator } from "./src/i18n";
import type {
  AnchorSourceMode,
  HealthCheckScope,
  HealthIssue,
  HealthIssueType,
  HealthReport,
  MaintenanceImportMode,
  CommentUpdateInput,
  MaintenanceExportFormat,
  MaintenanceExportScope,
  PluginSettings,
  SideComment,
  SideCommentDocument,
  SideCommentExportDocumentEntry,
  SideCommentsImportPackage
} from "./src/types";

type CurrentDocumentLoadState = "none" | "ready" | "failed";

export default class SideCommentsPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;
  t: Translator = createTranslator();
  store!: SidecarStore;
  currentDocument: SideCommentDocument | null = null;
  currentDocumentLoadState: CurrentDocumentLoadState = "none";
  private readonly modifyTimers = new Map<string, number>();
  private selectionToolbar: SelectionToolbar | null = null;
  private readonly selectionHandler = () => this.syncSelectionToolbar();
  private documentFlashTimer: number | null = null;
  private readonly documentFlashElements = new Set<HTMLElement>();
  private annotationMarksHidden = false;

  async onload(): Promise<void> {
    this.settings = await loadSideCommentsSettings(this);
    this.refreshTranslator();
    this.store = new SidecarStore(this.app, this.settings);
    await this.store.ensureManifest(this.manifest.version);

    this.selectionToolbar = new SelectionToolbar(
      document.body,
      (action) => {
        void this.handleSelectionAction(action);
      },
      () => {
        this.openAdvancedCreate();
      },
      this.t
    );

    this.registerEditorExtension(createSideCommentsEditorExtension(this));
    this.registerMarkdownPostProcessor((el, ctx) => {
      void this.renderReadingView(el, ctx);
    });

    this.registerView(
      SIDE_COMMENTS_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new SideCommentsSidebarView(leaf, this)
    );
    this.registerView(
      SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new SideCommentsCrossNoteView(leaf, this)
    );
    this.registerView(
      SIDE_COMMENTS_HEALTH_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new SideCommentsHealthView(leaf, this)
    );

    registerSideCommentCommands(this);
    this.addSettingTab(new SideCommentsSettingTab(this.app, this));
    this.addRibbonIcon("message-square-text", this.t("command.openSidebar"), () => {
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
    this.clearDocumentFlash();
    this.selectionToolbar?.destroy();
    this.selectionToolbar = null;
    this.app.workspace.detachLeavesOfType(SIDE_COMMENTS_VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(SIDE_COMMENTS_HEALTH_VIEW_TYPE);
  }

  async saveSettings(): Promise<void> {
    await saveSideCommentsSettings(this, this.settings);
    this.store.updateSettings(this.settings);
    this.refreshAllViews();
  }

  refreshTranslator(): void {
    const locale = this.settings.language === "auto" ? getLanguage() : this.settings.language;
    this.t = createTranslator(locale);
  }

  getActiveMarkdownFile(): TFile | null {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    return view?.file ?? null;
  }

  getCurrentDocumentFilePath(): string | null {
    return this.getActiveMarkdownFile()?.path ?? this.currentDocument?.filePath ?? null;
  }

  setCurrentDocument(document: SideCommentDocument | null): void {
    this.currentDocument = document;
    this.currentDocumentLoadState = document ? "ready" : "none";
  }

  refreshAllViews(): void {
    this.app.workspace.updateOptions();
    void this.refreshSidebar();
    void this.refreshCrossNoteReview();
  }

  areAnnotationMarksHidden(): boolean {
    return this.annotationMarksHidden;
  }

  toggleAnnotationMarksHidden(): void {
    this.annotationMarksHidden = !this.annotationMarksHidden;
    this.selectionToolbar?.hide();
    this.refreshAllViews();
    new Notice(this.annotationMarksHidden ? this.t("marks.hiddenNotice") : this.t("marks.visibleNotice"));
  }

  async activateSidebar(): Promise<void> {
    const leaves = this.app.workspace.getLeavesOfType(SIDE_COMMENTS_VIEW_TYPE);
    let leaf: WorkspaceLeaf | null = leaves[0] ?? null;

    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new Notice(this.t("notice.openSidebarFailed"));
        return;
      }
      await leaf.setViewState({ type: SIDE_COMMENTS_VIEW_TYPE, active: true });
    }

    this.app.workspace.revealLeaf(leaf);
    await this.refreshSidebar();
  }

  async activateCrossNoteReview(): Promise<void> {
    const leaves = this.app.workspace.getLeavesOfType(SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE);
    let leaf: WorkspaceLeaf | null = leaves[0] ?? null;

    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({ type: SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE, active: true });
    }

    this.app.workspace.revealLeaf(leaf);
    const view = leaf.view;
    if (view instanceof SideCommentsCrossNoteView) {
      await view.refresh();
    }
  }

  async activateHealthReport(report: HealthReport, issueTypeFilter: HealthIssueType | null = null): Promise<void> {
    const leaves = this.app.workspace.getLeavesOfType(SIDE_COMMENTS_HEALTH_VIEW_TYPE);
    let leaf: WorkspaceLeaf | null = leaves[0] ?? null;

    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({ type: SIDE_COMMENTS_HEALTH_VIEW_TYPE, active: true });
    }

    this.app.workspace.revealLeaf(leaf);
    const view = leaf.view;
    if (view instanceof SideCommentsHealthView) {
      view.setReport(report, issueTypeFilter);
    }
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
      new Notice(this.t("notice.loadFailed"));
    }

    this.refreshAllViews();
  }

  async createAnnotationFromEditorView(view: EditorView, action: SelectionToolbarAction): Promise<void> {
    const info = view.state.field(editorInfoField, false);
    const file = info?.file;
    if (this.annotationMarksHidden) {
      new Notice(this.t("marks.createDisabled"));
      return;
    }
    if (!file) {
      new Notice(this.t("notice.openMarkdownFirst"));
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
      action,
      "source"
    );
  }

  async createAnnotationFromObsidianEditor(editor: Editor, file: TFile | null, action: SelectionToolbarAction): Promise<void> {
    if (this.annotationMarksHidden) {
      new Notice(this.t("marks.createDisabled"));
      return;
    }

    if (!file) {
      new Notice(this.t("notice.openMarkdownFirst"));
      return;
    }

    if (!editor.somethingSelected()) {
      new Notice(this.t("notice.selectTextFirst"));
      return;
    }

    const startOffset = editor.posToOffset(editor.getCursor("from"));
    const endOffset = editor.posToOffset(editor.getCursor("to"));
    await this.createAnnotationFromOffsets(file.path, editor.getValue(), startOffset, endOffset, action, "source");
  }

  private async handleSelectionAction(action: SelectionToolbarAction): Promise<void> {
    const ctx = this.captureCurrentSelectionContext();
    if (!ctx) {
      return;
    }
    await this.createAnnotationFromOffsets(
      ctx.filePath,
      ctx.sourceText,
      ctx.startOffset,
      ctx.endOffset,
      action,
      ctx.sourceMode
    );
  }

  private openAdvancedCreate(): void {
    const ctx = this.captureCurrentSelectionContext();
    if (!ctx) {
      return;
    }

    const existing = this.currentDocument?.comments.find(
      (comment) => comment.anchor.startOffset === ctx.startOffset && comment.anchor.endOffset === ctx.endOffset
    );

    new AdvancedCreationModal(this.app, this, (action) => {
      void this.createAnnotationFromOffsets(
        ctx.filePath,
        ctx.sourceText,
        ctx.startOffset,
        ctx.endOffset,
        action,
        ctx.sourceMode
      );
    }, existing ? {
      markType: existing.mark.type,
      color: existing.mark.color,
      noteContent: existing.note.content,
      tags: existing.tags
    } : undefined).open();
  }

  private captureCurrentSelectionContext(): {
    filePath: string;
    sourceText: string;
    startOffset: number;
    endOffset: number;
    sourceMode: "source" | "reading";
  } | null {
    if (this.annotationMarksHidden) {
      new Notice(this.t("marks.createDisabled"));
      return null;
    }

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view?.file) {
      new Notice(this.t("notice.openMarkdownFirst"));
      return null;
    }

    if (view.getMode() === "source") {
      if (!view.editor.somethingSelected()) {
        new Notice(this.t("notice.selectTextFirst"));
        return null;
      }
      return {
        filePath: view.file.path,
        sourceText: view.editor.getValue(),
        startOffset: view.editor.posToOffset(view.editor.getCursor("from")),
        endOffset: view.editor.posToOffset(view.editor.getCursor("to")),
        sourceMode: "source"
      };
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      new Notice(this.t("notice.selectTextFirst"));
      return null;
    }

    const range = selection.getRangeAt(0);
    if (!view.previewMode.containerEl.contains(range.commonAncestorContainer)) {
      new Notice(this.t("notice.selectTextFirst"));
      return null;
    }

    const sourceText = view.getViewData();
    const selectedText = selection.toString();
    const match = findSelectedTextInSource(sourceText, selectedText);
    if (!match) {
      new Notice(this.t("notice.mapSelectionFailed"));
      return null;
    }

    return {
      filePath: view.file.path,
      sourceText,
      startOffset: match.startOffset,
      endOffset: match.endOffset,
      sourceMode: "reading"
    };
  }

  private syncSelectionToolbar(): void {
    if (!this.selectionToolbar) {
      return;
    }

    if (this.annotationMarksHidden) {
      this.selectionToolbar.hide();
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

  private getCurrentMarkdownSelection(action: "bind" | "adjust"): {
    sourceText: string;
    startOffset: number;
    endOffset: number;
    sourceMode: AnchorSourceMode;
  } | null {
    const document = this.requireCurrentDocument();
    const view = this.findMarkdownViewForPath(document.filePath);
    const noSelectionMessage = action === "bind" ? this.t("notice.rebindSelect") : this.t("notice.adjustSelect");
    const unsupportedMessage = action === "bind" ? this.t("notice.rebindUnsupported") : this.t("notice.adjustUnsupported");

    if (!view?.file || normalizeVaultRelativePath(view.file.path) !== document.filePath) {
      new Notice(noSelectionMessage);
      return null;
    }

    if (view.getMode() === "source") {
      view.editor.focus();
      if (!view.editor.somethingSelected()) {
        new Notice(noSelectionMessage);
        return null;
      }

      const startOffset = view.editor.posToOffset(view.editor.getCursor("from"));
      const endOffset = view.editor.posToOffset(view.editor.getCursor("to"));
      if (startOffset === endOffset) {
        new Notice(noSelectionMessage);
        return null;
      }

      return {
        sourceText: view.editor.getValue(),
        startOffset,
        endOffset,
        sourceMode: "source"
      };
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0 || !selection.toString().trim()) {
      new Notice(noSelectionMessage);
      return null;
    }

    const range = selection.getRangeAt(0);
    const previewRoot = view.previewMode.containerEl;
    if (!previewRoot.contains(range.commonAncestorContainer)) {
      new Notice(unsupportedMessage);
      return null;
    }

    const sourceText = view.getViewData();
    const preferredIndex = getTextOffsetInContainer(previewRoot, range);
    const match = findSelectedTextInSource(sourceText, selection.toString(), {
      preferredStartOffset: preferredIndex ?? undefined,
      preferNormalized: true
    });
    if (!match) {
      new Notice(unsupportedMessage);
      return null;
    }

    return {
      sourceText,
      startOffset: match.startOffset,
      endOffset: match.endOffset,
      sourceMode: "reading"
    };
  }

  private findMarkdownViewForPath(filePath: string): MarkdownView | null {
    const active = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (active?.file && normalizeVaultRelativePath(active.file.path) === filePath) {
      return active;
    }

    let match: MarkdownView | null = null;
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (match || !(leaf.view instanceof MarkdownView) || !leaf.view.file) {
        return;
      }

      if (normalizeVaultRelativePath(leaf.view.file.path) === filePath) {
        match = leaf.view;
      }
    });

    return match;
  }

  async createAnnotationFromOffsets(
    filePath: string,
    sourceText: string,
    startOffset: number,
    endOffset: number,
    action: SelectionToolbarAction,
    sourceMode: "source" | "reading"
  ): Promise<void> {
    try {
      const result = await this.store.upsertComment({
        filePath,
        sourceText,
        startOffset,
        endOffset,
        markType: action.type,
        color: action.color,
        sourceMode,
        noteContent: action.initialNote
      }, {
        markType: action.type,
        color: action.color,
        noteContent: action.initialNote,
        tags: action.tags
      });

      this.currentDocument = result.document;
      this.currentDocumentLoadState = "ready";
      this.refreshAllViews();

      const forceEdit = Boolean(action.initialNote);
      if (this.settings.autoOpenSidebarAfterCreate || !result.created || forceEdit) {
        await this.focusCommentInSidebar(result.comment.id, true);
      }

      if (!this.isCommentVisibleInSidebar(result.comment.id)) {
        new Notice(this.t("notice.commentHiddenByFilter"));
      }
    } catch (error) {
      console.error("Side Comments failed to create annotation", error);
      new Notice(this.t("notice.createFailed"));
    }
  }

  private isCommentVisibleInSidebar(commentId: string): boolean {
    for (const view of this.getSidebarViews()) {
      if (view.isCommentIdVisible(commentId)) {
        return true;
      }
    }
    return true;
  }

  async updateComment(commentId: string, input: CommentUpdateInput): Promise<SideCommentDocument> {
    const document = this.requireCurrentDocument();
    return this.store.updateComment(document.filePath, commentId, input);
  }

  async setCommentStatus(commentId: string, status: SideComment["status"]): Promise<SideCommentDocument> {
    const document = this.requireCurrentDocument();
    return this.store.setCommentStatus(document.filePath, commentId, status);
  }

  async previewRebindOrphanedComment(commentId: string): Promise<{ comment: SideComment; selectedText: string } | null> {
    const document = this.requireCurrentDocument();
    const comment = document.comments.find((item) => item.id === commentId);
    if (!comment || comment.status !== "orphaned") {
      return null;
    }

    const selection = this.getCurrentMarkdownSelection("bind");
    if (!selection) {
      return null;
    }

    return {
      comment,
      selectedText: selection.sourceText.slice(selection.startOffset, selection.endOffset)
    };
  }

  async deleteComment(commentId: string): Promise<SideCommentDocument> {
    const document = this.requireCurrentDocument();
    return this.store.deleteComment(document.filePath, commentId);
  }

  async rebindOrphanedCommentToSelection(commentId: string): Promise<SideCommentDocument | null> {
    const document = this.requireCurrentDocument();
    const comment = document.comments.find((item) => item.id === commentId);
    if (!comment || comment.status !== "orphaned") {
      return null;
    }

    const selection = this.getCurrentMarkdownSelection("bind");
    if (!selection) {
      return null;
    }

    try {
      await this.backupFileSidecar(document.filePath, "rebind");
      return await this.store.updateCommentAnchor(
        document.filePath,
        commentId,
        selection.sourceText,
        selection.startOffset,
        selection.endOffset,
        selection.sourceMode,
        "active"
      );
    } catch (error) {
      console.error("Side Comments failed to rebind comment", error);
      new Notice(this.t("notice.rebindUnsupported"));
      return null;
    }
  }

  async adjustCommentRangeToSelection(commentId: string): Promise<SideCommentDocument | null> {
    const document = this.requireCurrentDocument();
    const comment = document.comments.find((item) => item.id === commentId);
    if (!comment || comment.status === "orphaned") {
      return null;
    }

    const selection = this.getCurrentMarkdownSelection("adjust");
    if (!selection) {
      return null;
    }

    try {
      return await this.store.updateCommentAnchor(
        document.filePath,
        commentId,
        selection.sourceText,
        selection.startOffset,
        selection.endOffset,
        selection.sourceMode
      );
    } catch (error) {
      console.error("Side Comments failed to adjust comment range", error);
      new Notice(this.t("notice.adjustUnsupported"));
      return null;
    }
  }

  async importAnnotationPackage(importPackage: SideCommentsImportPackage, mode: MaintenanceImportMode): Promise<void> {
    const currentFilePath = this.getCurrentDocumentFilePath();
    if (mode === "into-current" && !currentFilePath) {
      new Notice(this.t("notice.openMarkdownFirst"));
      return;
    }

    const grouped = new Map<string, SideComment[]>();
    for (const document of importPackage.documents) {
      const targetPath = mode === "into-current" ? currentFilePath! : document.filePath;
      grouped.set(targetPath, [...(grouped.get(targetPath) ?? []), ...document.comments]);
    }

    const targets = await Promise.all([...grouped.keys()].map(async (filePath) => ({
      filePath,
      sidecarPath: await this.store.getSidecarPathForFile(filePath)
    })));
    await createBackupBatch({
      adapter: this.app.vault.adapter,
      operation: "import",
      targets,
      dataDir: this.store.getDataDir()
    });

    for (const [filePath, incoming] of grouped) {
      const existing = await this.store.loadDocument(filePath);
      const existingIds = new Set(existing.comments.map((comment) => comment.id));
      const existingAnchors = new Set(existing.comments.map((comment) => anchorKey(comment)));
      const toAdd = incoming.filter((comment) => !existingIds.has(comment.id) && !existingAnchors.has(anchorKey(comment)));
      if (toAdd.length === 0) {
        continue;
      }
      await this.store.saveDocument({
        ...existing,
        comments: [...existing.comments, ...toAdd]
      });
    }

    const currentFile = this.getActiveMarkdownFile();
    if (currentFile) {
      await this.loadForFile(currentFile);
    } else {
      this.refreshAllViews();
    }
    new Notice(this.t("import.success"));
  }

  async runHealthCheck(scope: HealthCheckScope, filePaths?: string[]): Promise<HealthReport> {
    const entries = await this.resolveHealthEntries(scope, filePaths);
    const issues: HealthIssue[] = [];

    for (const entry of entries) {
      const source = this.app.vault.getAbstractFileByPath(entry.filePath);
      if (!(source instanceof TFile)) {
        issues.push({
          id: `missing-source:${entry.filePath}`,
          type: "missing-source",
          severity: "error",
          filePath: entry.filePath,
          title: this.t("health.issue.missingSource"),
          detail: entry.filePath,
          commentIds: []
        });
      }

      for (const comment of entry.comments) {
        if (comment.status === "orphaned") {
          issues.push({
            id: `orphaned:${entry.filePath}:${comment.id}`,
            type: "orphaned-anchor",
            severity: "warning",
            filePath: entry.filePath,
            title: this.t("health.issue.orphaned"),
            detail: comment.anchor.selectedText || comment.note.content,
            commentIds: [comment.id]
          });
        }

        if (comment.mark.type === "note" && !comment.note.content.trim()) {
          issues.push({
            id: `empty:${entry.filePath}:${comment.id}`,
            type: "structure",
            severity: "warning",
            filePath: entry.filePath,
            title: this.t("health.issue.emptyAnnotation"),
            detail: comment.anchor.selectedText || "(empty)",
            commentIds: [comment.id]
          });
        }
      }

      const duplicates = new Map<string, SideComment[]>();
      for (const comment of entry.comments) {
        const key = anchorKey(comment);
        duplicates.set(key, [...(duplicates.get(key) ?? []), comment]);
      }
      for (const group of duplicates.values()) {
        if (group.length < 2) {
          continue;
        }
        issues.push({
          id: `duplicate:${entry.filePath}:${group.map((comment) => comment.id).join(",")}`,
          type: "duplicate-anchor",
          severity: "warning",
          filePath: entry.filePath,
          title: this.t("health.issue.duplicate"),
          detail: group[0]?.anchor.selectedText ?? "",
          commentIds: group.map((comment) => comment.id)
        });
      }
    }

    return {
      generatedAt: new Date().toISOString(),
      scope,
      scannedDocumentCount: new Set(entries.map((entry) => entry.filePath)).size,
      scannedSidecarCount: entries.length,
      totalAnnotationCount: entries.reduce((total, entry) => total + entry.comments.length, 0),
      issues
    };
  }

  async runAndOpenHealthCheck(scope: HealthCheckScope, filePaths?: string[], issueTypeFilter: HealthIssueType | null = null): Promise<void> {
    const report = await this.runHealthCheck(scope, filePaths);
    await this.activateHealthReport(report, issueTypeFilter);
  }

  async mergeDuplicateComments(filePath: string, primaryCommentId: string, commentIdsToRemove: string[], mergedNoteContent: string): Promise<void> {
    await this.backupFileSidecar(filePath, "dedup");
    const updated = await this.store.mergeComments(filePath, primaryCommentId, commentIdsToRemove, mergedNoteContent);
    if (this.currentDocument?.filePath === updated.filePath) {
      this.setCurrentDocument(updated);
    }
    this.refreshAllViews();
  }

  async deleteDuplicateComments(filePath: string, commentIds: string[]): Promise<void> {
    await this.backupFileSidecar(filePath, "dedup");
    const updated = await this.store.deleteComments(filePath, commentIds);
    if (this.currentDocument?.filePath === updated.filePath) {
      this.setCurrentDocument(updated);
    }
    this.refreshAllViews();
  }

  async cleanupMissingSourceAnnotations(filePath: string): Promise<void> {
    await createBackupBatch({
      adapter: this.app.vault.adapter,
      operation: "cleanup",
      dataDir: this.store.getDataDir(),
      targets: [{
        filePath,
        sidecarPath: await this.store.getSidecarPathForFile(filePath)
      }]
    });
    await this.store.deleteDocumentSidecar(filePath);
    if (this.currentDocument?.filePath === normalizeVaultRelativePath(filePath)) {
      this.setCurrentDocument(null);
    }
    this.refreshAllViews();
    new Notice(this.t("repair.cleanupMissingSourceSuccess"));
  }

  async getCommentsForFile(filePath: string): Promise<SideComment[]> {
    return (await this.store.loadDocument(filePath)).comments;
  }

  async focusCommentInSidebar(commentId: string, edit = false): Promise<void> {
    await this.activateSidebar();
    for (const view of this.getSidebarViews()) {
      view.focusComment(commentId, edit);
    }
  }

  async openSourceDocument(filePath: string): Promise<TFile | null> {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      new Notice(this.t("notice.sourceOpenFailed"));
      return null;
    }

    await this.app.workspace.getLeaf(false).openFile(file);
    await this.loadForFile(file);
    return file;
  }

  async openSourceComment(filePath: string, commentId: string): Promise<void> {
    const file = await this.openSourceDocument(filePath);
    if (!file) {
      return;
    }

    await this.focusCommentInSidebar(commentId, false);
    await this.jumpToCommentInEditor(commentId);
  }

  async exportCurrentNoteAnnotations(format: MaintenanceExportFormat): Promise<void> {
    const filePath = this.getCurrentDocumentFilePath();
    if (!filePath) {
      new Notice(this.t("notice.openMarkdownFirst"));
      return;
    }

    try {
      const entry = await this.store.loadExportEntryForFile(filePath);
      await this.writeMaintenanceExport("current-note", format, entry ? [entry] : []);
    } catch (error) {
      console.error("Side Comments failed to export current note", error);
      new Notice(this.t("export.failed"));
    }
  }

  async exportSelectedNoteAnnotations(files: TFile[], format: MaintenanceExportFormat): Promise<void> {
    const markdownFiles = files.filter((file) => file.extension === "md");
    if (markdownFiles.length === 0) {
      new Notice(this.t("notice.openMarkdownFirst"));
      return;
    }

    try {
      const entries = await this.store.listSelectedExportEntries(markdownFiles.map((file) => file.path));
      await this.writeMaintenanceExport("selected-notes", format, entries);
    } catch (error) {
      console.error("Side Comments failed to export selected notes", error);
      new Notice(this.t("export.failed"));
    }
  }

  async exportAllSidecarMetadata(format: MaintenanceExportFormat): Promise<void> {
    try {
      const entries = await this.store.loadAllExportEntries();
      await this.writeMaintenanceExport("all-sidecars", format, entries);
    } catch (error) {
      console.error("Side Comments failed to export all sidecars", error);
      new Notice(this.t("export.failed"));
    }
  }

  async copyAnnotationDraft(groups: AnnotationDraftGroup[]): Promise<void> {
    const nonEmptyGroups = groups
      .map((group) => ({ ...group, comments: group.comments.filter(Boolean) }))
      .filter((group) => group.comments.length > 0);

    if (nonEmptyGroups.length === 0) {
      new Notice(this.t("draft.empty"));
      return;
    }

    try {
      await navigator.clipboard.writeText(formatAnnotationMarkdownDraft(nonEmptyGroups, this.t));
      new Notice(this.t("draft.copied"));
    } catch (error) {
      console.error("Side Comments failed to copy annotation draft", error);
      new Notice(this.t("draft.copyFailed"));
    }
  }

  async jumpToCommentInEditor(commentId: string): Promise<void> {
    const document = this.requireCurrentDocument();
    const comment = document.comments.find((item) => item.id === commentId);
    if (!comment) {
      return;
    }
    if (comment.status === "orphaned") {
      new Notice(this.t("notice.orphanJumpFailed"));
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
      new Notice(this.t("notice.sourceOpenFailed"));
      return;
    }

    const from = view.editor.offsetToPos(comment.anchor.startOffset);
    const to = view.editor.offsetToPos(comment.anchor.endOffset);
    view.editor.setSelection(from, to);
    view.editor.scrollIntoView({ from, to }, true);
    view.editor.focus();
    this.flashDocumentTarget(commentId);
  }

  async refreshSidebar(): Promise<void> {
    for (const view of this.getSidebarViews()) {
      await view.render();
    }
  }

  async refreshCrossNoteReview(): Promise<void> {
    for (const view of this.getCrossNoteViews()) {
      await view.refresh();
    }
  }

  private async writeMaintenanceExport(
    scope: MaintenanceExportScope,
    format: MaintenanceExportFormat,
    documents: SideCommentExportDocumentEntry[]
  ): Promise<void> {
    const exportPackage = createExportPackage({
      pluginVersion: this.manifest.version,
      scope,
      vaultName: this.app.vault.getName(),
      documents
    });
    const content = format === "json"
      ? serializeExportPackage(exportPackage)
      : exportPackageToMarkdown(exportPackage);
    const extension = format === "json" ? "json" : "md";
    const path = normalizeVaultRelativePath(
      `${this.settings.dataDir}/exports/${scope}-${formatTimestamp(new Date())}.${extension}`
    );
    await this.ensureAdapterFolder(path.slice(0, path.lastIndexOf("/")));
    await this.app.vault.adapter.write(path, content);
    new Notice(this.t("export.success"));
  }

  private async backupFileSidecar(filePath: string, operation: "rebind" | "dedup"): Promise<void> {
    await createBackupBatch({
      adapter: this.app.vault.adapter,
      operation,
      dataDir: this.store.getDataDir(),
      targets: [{
        filePath,
        sidecarPath: await this.store.getSidecarPathForFile(filePath)
      }]
    });
  }

  private async resolveHealthEntries(scope: HealthCheckScope, filePaths?: string[]): Promise<SideCommentExportDocumentEntry[]> {
    if (scope === "all-sidecars") {
      return this.store.loadAllExportEntries();
    }

    const currentFilePath = this.getCurrentDocumentFilePath();
    const paths = filePaths?.length ? filePaths : currentFilePath ? [currentFilePath] : [];
    return this.store.listSelectedExportEntries(paths);
  }

  private async ensureAdapterFolder(folderPath: string): Promise<void> {
    const parts = folderPath.split("/");
    let current = "";

    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!(await this.app.vault.adapter.exists(current))) {
        await this.app.vault.adapter.mkdir(current);
      }
    }
  }

  private getSidebarViews(): SideCommentsSidebarView[] {
    return this.app.workspace
      .getLeavesOfType(SIDE_COMMENTS_VIEW_TYPE)
      .map((leaf) => leaf.view)
      .filter((view): view is SideCommentsSidebarView => view instanceof SideCommentsSidebarView);
  }

  private getCrossNoteViews(): SideCommentsCrossNoteView[] {
    return this.app.workspace
      .getLeavesOfType(SIDE_COMMENTS_CROSS_NOTE_VIEW_TYPE)
      .map((leaf) => leaf.view)
      .filter((view): view is SideCommentsCrossNoteView => view instanceof SideCommentsCrossNoteView);
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

  private flashDocumentTarget(commentId: string): void {
    this.clearDocumentFlash();
    requestAnimationFrame(() => {
      const selector = `[data-side-comments-id="${CSS.escape(commentId)}"]`;
      const marks = Array.from(document.querySelectorAll<HTMLElement>(selector));
      for (const mark of marks) {
        mark.addClass("side-comments-temporary-target");
        this.documentFlashElements.add(mark);
      }

      this.documentFlashTimer = window.setTimeout(() => {
        this.clearDocumentFlash();
      }, 2000);
    });
  }

  private clearDocumentFlash(): void {
    if (this.documentFlashTimer !== null) {
      window.clearTimeout(this.documentFlashTimer);
      this.documentFlashTimer = null;
    }

    for (const element of this.documentFlashElements) {
      element.removeClass("side-comments-temporary-target");
    }
    this.documentFlashElements.clear();
  }

  private async renderReadingView(el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
    try {
      const normalizedPath = normalizeVaultRelativePath(ctx.sourcePath);
      const document =
        this.currentDocument?.filePath === normalizedPath
          ? this.currentDocument
          : await this.store.loadDocument(normalizedPath);
      const sectionInfo = ctx.getSectionInfo(el);

      const comments = this.annotationMarksHidden ? [] : document.comments.filter((comment) => {
        if (comment.status === "resolved" && !this.settings.showResolvedMarks) {
          return false;
        }
        return true;
      });

      renderReadingViewMarks(el, comments, {
        sectionInfo: sectionInfo
          ? {
              text: sectionInfo.text,
              lineStart: sectionInfo.lineStart,
              lineEnd: sectionInfo.lineEnd
            }
          : undefined,
        commentTitle: this.t("marks.viewComment"),
        onCommentClick: (commentId) => {
          void this.focusCommentInSidebar(commentId, false);
        }
      });
    } catch (error) {
      console.error("Side Comments failed to render reading view marks", error);
    }
  }
}

function anchorKey(comment: SideComment): string {
  return `${comment.anchor.startOffset}:${comment.anchor.endOffset}:${comment.anchor.selectedText}`;
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/[:.]/g, "-");
}

interface SourceMatchOptions {
  preferredStartOffset?: number;
  preferNormalized?: boolean;
}

function findSelectedTextInSource(
  sourceText: string,
  selectedText: string,
  options: SourceMatchOptions = {}
): { startOffset: number; endOffset: number } | null {
  if (!options.preferNormalized) {
    const exactStart = findClosestTextMatch(sourceText, selectedText, options.preferredStartOffset);
    if (exactStart >= 0) {
      return {
        startOffset: exactStart,
        endOffset: exactStart + selectedText.length
      };
    }
  }

  const normalized = findNormalizedSelectedTextInSource(sourceText, selectedText, options.preferredStartOffset);
  if (normalized) {
    return normalized;
  }

  const exactStart = findClosestTextMatch(sourceText, selectedText, options.preferredStartOffset);
  if (exactStart >= 0) {
    return {
      startOffset: exactStart,
      endOffset: exactStart + selectedText.length
    };
  }

  return null;
}

function findNormalizedSelectedTextInSource(
  sourceText: string,
  selectedText: string,
  preferredStartOffset?: number
): { startOffset: number; endOffset: number } | null {
  const sourceNormalized = normalizeTextForPreviewMatch(sourceText);
  const selectedNormalized = normalizeTextForPreviewMatch(selectedText);
  if (!selectedNormalized.text) {
    return null;
  }

  const normalizedPreferredStart = getNormalizedPreferredOffset(sourceNormalized.offsets, preferredStartOffset);
  const normalizedStart = findClosestTextMatch(sourceNormalized.text, selectedNormalized.text, normalizedPreferredStart);
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

function findClosestTextMatch(source: string, target: string, preferredStartOffset?: number): number {
  if (!target) {
    return -1;
  }

  if (preferredStartOffset === undefined) {
    return source.indexOf(target);
  }

  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  let searchFrom = 0;

  while (searchFrom <= source.length) {
    const index = source.indexOf(target, searchFrom);
    if (index < 0) {
      break;
    }

    const distance = Math.abs(index - preferredStartOffset);
    if (distance < bestDistance) {
      bestIndex = index;
      bestDistance = distance;
    }

    searchFrom = index + Math.max(1, target.length);
  }

  return bestIndex;
}

function getNormalizedPreferredOffset(offsets: number[], preferredStartOffset?: number): number | undefined {
  if (preferredStartOffset === undefined) {
    return undefined;
  }

  let closestIndex: number | undefined;
  let closestDistance = Number.POSITIVE_INFINITY;
  for (let index = 0; index < offsets.length; index += 1) {
    const distance = Math.abs(offsets[index] - preferredStartOffset);
    if (distance < closestDistance) {
      closestIndex = index;
      closestDistance = distance;
    }
  }

  return closestIndex;
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

function getTextOffsetInContainer(container: HTMLElement, range: Range): number | null {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let offset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node === range.startContainer) {
      return offset + range.startOffset;
    }

    if (node.contains(range.startContainer)) {
      return offset;
    }

    offset += node.nodeValue?.length ?? 0;
  }

  return null;
}
