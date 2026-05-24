import { App, normalizePath } from "obsidian";
import { createTextAnchor } from "../anchor/textAnchor";
import { relocateComment } from "../anchor/relocate";
import {
  type AnchorSourceMode,
  CURRENT_SCHEMA_VERSION,
  type SideCommentExportDocumentEntry,
  type RecentPreviewItem,
  type CommentCreateInput,
  type CommentUpdateInput,
  type PluginSettings,
  type SideComment,
  type SideCommentDocument,
  type SideCommentsManifest
} from "../types";
import { normalizeTags } from "../organization/annotationMetadata";
import { createRecentPreview } from "./recentPreview";
import { LruCache } from "./lruCache";
import { migrateDocument, sortComments } from "./migration";
import { buildExportDocumentEntry } from "./export";
import {
  getBucketDir,
  getManifestPath,
  getRecentPreviewPath,
  getSidecarPath,
  hashVaultPath,
  normalizeVaultRelativePath
} from "./pathHash";

export interface UpsertCommentResult {
  document: SideCommentDocument;
  comment: SideComment;
  created: boolean;
}

export class SidecarStore {
  private cache: LruCache<string, SideCommentDocument>;
  private pluginVersion = "0.4.0";

  constructor(private readonly app: App, private settings: PluginSettings) {
    this.cache = new LruCache(settings.maxCachedDocuments);
  }

  updateSettings(settings: PluginSettings): void {
    this.settings = settings;
    this.cache.setMaxSize(settings.maxCachedDocuments);
  }

  async ensureManifest(pluginVersion: string): Promise<void> {
    this.pluginVersion = pluginVersion;
    await this.ensureFolder(this.settings.dataDir);
    await this.writeManifest();
  }

  async loadDocument(filePath: string): Promise<SideCommentDocument> {
    const normalizedPath = normalizeVaultRelativePath(filePath);
    const cached = this.cache.get(normalizedPath);
    if (cached) {
      return cached;
    }

    const sidecarPath = await getSidecarPath(normalizedPath, this.settings.dataDir);
    if (!(await this.app.vault.adapter.exists(sidecarPath))) {
      const empty = await this.createEmptyDocument(normalizedPath);
      this.cache.set(normalizedPath, empty);
      return empty;
    }

    const raw = await this.app.vault.adapter.read(sidecarPath);
    const parsed = JSON.parse(raw) as unknown;
    const migrated = await migrateDocument(parsed, {
      adapter: this.app.vault.adapter,
      filePath: normalizedPath,
      dataDir: this.settings.dataDir
    });

    const normalized: SideCommentDocument = {
      ...migrated,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      filePath: normalizedPath,
      fileHash: await hashVaultPath(normalizedPath),
      comments: sortComments(migrated.comments)
    };

    const parsedRecord = typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : {};
    const needsWrite =
      parsedRecord.schemaVersion !== CURRENT_SCHEMA_VERSION ||
      parsedRecord.filePath !== normalized.filePath ||
      parsedRecord.fileHash !== normalized.fileHash;

    if (needsWrite) {
      await this.saveDocument(normalized);
    } else {
      this.cache.set(normalizedPath, normalized);
    }

    return normalized;
  }

  async saveDocument(document: SideCommentDocument): Promise<SideCommentDocument> {
    const normalizedPath = normalizeVaultRelativePath(document.filePath);
    const hash = await hashVaultPath(normalizedPath);
    const sidecarPath = await getSidecarPath(normalizedPath, this.settings.dataDir);
    await this.ensureFolder(getBucketDir(hash, this.settings.dataDir));

    const updated: SideCommentDocument = {
      ...document,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      filePath: normalizedPath,
      fileHash: hash,
      updatedAt: new Date().toISOString(),
      comments: sortComments(document.comments)
    };

    await this.app.vault.adapter.write(sidecarPath, JSON.stringify(updated, null, 2));
    this.cache.set(normalizedPath, updated);
    await this.updateRecentPreviewCache(updated);
    await this.writeManifest();
    return updated;
  }

  async upsertComment(input: CommentCreateInput): Promise<UpsertCommentResult> {
    const normalizedPath = normalizeVaultRelativePath(input.filePath);
    const startOffset = Math.max(0, Math.min(input.startOffset, input.endOffset));
    const endOffset = Math.max(startOffset, Math.max(input.startOffset, input.endOffset));
    const anchor = createTextAnchor(input.sourceText, startOffset, endOffset, input.sourceMode);

    if (anchor.selectedText.length === 0) {
      throw new Error("Cannot create a side comment from an empty selection.");
    }

    const document = await this.loadDocument(normalizedPath);
    const existing = document.comments.find(
      (comment) => comment.anchor.startOffset === anchor.startOffset && comment.anchor.endOffset === anchor.endOffset
    );

    if (existing) {
      return {
        document,
        comment: existing,
        created: false
      };
    }

    const now = new Date().toISOString();
    const comment: SideComment = {
      id: crypto.randomUUID(),
      anchor,
      mark: {
        type: input.markType,
        color: input.color
      },
      annotationType: input.annotationType ?? "excerpt",
      tags: [],
      note: {
        content: "",
        createdAt: now,
        updatedAt: now
      },
      status: "active"
    };

    const saved = await this.saveDocument({
      ...document,
      comments: [...document.comments, comment]
    });

    return {
      document: saved,
      comment,
      created: true
    };
  }

  async updateComment(filePath: string, commentId: string, input: CommentUpdateInput): Promise<SideCommentDocument> {
    const document = await this.loadDocument(filePath);
    let found = false;
    const now = new Date().toISOString();
    const comments = document.comments.map((comment) => {
      if (comment.id !== commentId) {
        return comment;
      }

      found = true;
      return {
        ...comment,
        mark: {
          type: input.markType ?? comment.mark.type,
          color: input.color ?? comment.mark.color
        },
        annotationType: input.annotationType ?? comment.annotationType,
        tags: input.tags !== undefined ? normalizeTags(input.tags) : comment.tags,
        note: {
          ...comment.note,
          content: input.noteContent ?? comment.note.content,
          updatedAt: input.noteContent !== undefined ? now : comment.note.updatedAt
        },
        status: input.status ?? comment.status
      };
    });

    if (!found) {
      throw new Error(`Side comment not found: ${commentId}`);
    }

    return this.saveDocument({
      ...document,
      comments
    });
  }

  async deleteComment(filePath: string, commentId: string): Promise<SideCommentDocument> {
    const document = await this.loadDocument(filePath);
    return this.saveDocument({
      ...document,
      comments: document.comments.filter((comment) => comment.id !== commentId)
    });
  }

  async setCommentStatus(filePath: string, commentId: string, status: SideComment["status"]): Promise<SideCommentDocument> {
    return this.updateComment(filePath, commentId, { status });
  }

  async updateCommentAnchor(
    filePath: string,
    commentId: string,
    sourceText: string,
    startOffset: number,
    endOffset: number,
    sourceMode: AnchorSourceMode,
    nextStatus?: SideComment["status"]
  ): Promise<SideCommentDocument> {
    const document = await this.loadDocument(filePath);
    const normalizedStart = Math.max(0, Math.min(startOffset, endOffset));
    const normalizedEnd = Math.max(normalizedStart, Math.max(startOffset, endOffset));
    const anchor = createTextAnchor(sourceText, normalizedStart, normalizedEnd, sourceMode);

    if (anchor.selectedText.length === 0) {
      throw new Error("Cannot update a side comment anchor from an empty selection.");
    }

    let found = false;
    const comments = document.comments.map((comment) => {
      if (comment.id !== commentId) {
        return comment;
      }

      found = true;
      return {
        ...comment,
        anchor,
        status: nextStatus ?? comment.status
      };
    });

    if (!found) {
      throw new Error(`Side comment not found: ${commentId}`);
    }

    return this.saveDocument({
      ...document,
      comments
    });
  }

  async relocateDocument(filePath: string, sourceText: string, existingDocument?: SideCommentDocument): Promise<SideCommentDocument> {
    const document = existingDocument ?? await this.loadDocument(filePath);
    if (document.comments.length === 0) {
      return document;
    }

    const relocatedComments = document.comments.map((comment) => relocateComment(sourceText, comment));
    const changed = relocatedComments.some((comment, index) => {
      const previous = document.comments[index];
      return (
        comment.status !== previous.status ||
        comment.anchor.startOffset !== previous.anchor.startOffset ||
        comment.anchor.endOffset !== previous.anchor.endOffset ||
        comment.anchor.source?.updatedAt !== previous.anchor.source?.updatedAt
      );
    });

    if (!changed) {
      return document;
    }

    return this.saveDocument({
      ...document,
      comments: relocatedComments
    });
  }

  async migrateRenamedFile(oldPath: string, newPath: string): Promise<SideCommentDocument | null> {
    const normalizedOld = normalizeVaultRelativePath(oldPath);
    const normalizedNew = normalizeVaultRelativePath(newPath);
    const oldSidecarPath = await getSidecarPath(normalizedOld, this.settings.dataDir);
    const newSidecarPath = await getSidecarPath(normalizedNew, this.settings.dataDir);

    if (!(await this.app.vault.adapter.exists(oldSidecarPath))) {
      return null;
    }

    const document = await this.loadDocument(normalizedOld);
    const updated = await this.saveDocument({
      ...document,
      filePath: normalizedNew,
      fileHash: await hashVaultPath(normalizedNew)
    });

    if (oldSidecarPath !== newSidecarPath) {
      await this.app.vault.adapter.remove(oldSidecarPath);
    }
    this.cache.delete(normalizedOld);
    return updated;
  }

  getCachedDocument(filePath: string): SideCommentDocument | undefined {
    return this.cache.get(normalizeVaultRelativePath(filePath));
  }

  async loadRecentPreviews(): Promise<{ state: "ready" | "missing" | "failed"; items: RecentPreviewItem[] }> {
    const recentPath = getRecentPreviewPath(this.settings.dataDir);
    if (!(await this.app.vault.adapter.exists(recentPath))) {
      return { state: "missing", items: [] };
    }

    try {
      const raw = await this.app.vault.adapter.read(recentPath);
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return { state: "failed", items: [] };
      }

      return {
        state: "ready",
        items: parsed.flatMap((item) => normalizeRecentPreviewItem(item)).slice(0, this.settings.maxCachedDocuments)
      };
    } catch {
      return { state: "failed", items: [] };
    }
  }

  async loadExportEntryForFile(filePath: string): Promise<SideCommentExportDocumentEntry | null> {
    const normalizedPath = normalizeVaultRelativePath(filePath);
    const sidecarPath = await getSidecarPath(normalizedPath, this.settings.dataDir);
    if (!(await this.app.vault.adapter.exists(sidecarPath))) {
      return null;
    }

    const document = await this.loadDocument(normalizedPath);
    return buildExportDocumentEntry({
      filePath: document.filePath,
      sidecarPath,
      schemaVersion: document.schemaVersion,
      comments: document.comments
    });
  }

  async loadAllExportEntries(): Promise<SideCommentExportDocumentEntry[]> {
    const paths = await this.listSidecarPaths(normalizePath(`${this.settings.dataDir}/files`));
    const entries: SideCommentExportDocumentEntry[] = [];

    for (const sidecarPath of paths) {
      try {
        const raw = await this.app.vault.adapter.read(sidecarPath);
        const parsed = JSON.parse(raw) as unknown;
        const document = await migrateDocument(parsed, {
          adapter: this.app.vault.adapter,
          filePath: this.extractFilePath(parsed, sidecarPath),
          dataDir: this.settings.dataDir
        });

        entries.push(
          buildExportDocumentEntry({
            filePath: document.filePath,
            sidecarPath,
            schemaVersion: document.schemaVersion,
            comments: document.comments
          })
        );
      } catch (error) {
        console.error("Side Comments failed to read sidecar for export", error);
      }
    }

    return entries;
  }

  async listSelectedExportEntries(filePaths: string[]): Promise<SideCommentExportDocumentEntry[]> {
    const entries: SideCommentExportDocumentEntry[] = [];
    for (const filePath of filePaths) {
      const entry = await this.loadExportEntryForFile(filePath);
      if (entry) {
        entries.push(entry);
      }
    }
    return entries;
  }

  private async createEmptyDocument(filePath: string): Promise<SideCommentDocument> {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      filePath,
      fileHash: await hashVaultPath(filePath),
      updatedAt: new Date().toISOString(),
      comments: []
    };
  }

  private async writeManifest(): Promise<void> {
    const manifestPath = getManifestPath(this.settings.dataDir);
    const manifest: SideCommentsManifest = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      pluginVersion: this.pluginVersion,
      updatedAt: new Date().toISOString()
    };
    await this.ensureFolder(this.settings.dataDir);
    await this.app.vault.adapter.write(manifestPath, JSON.stringify(manifest, null, 2));
  }

  private async updateRecentPreviewCache(document: SideCommentDocument): Promise<void> {
    const recentPath = getRecentPreviewPath(this.settings.dataDir);
    const recentDir = recentPath.slice(0, recentPath.lastIndexOf("/"));
    await this.ensureFolder(recentDir);

    let items: unknown[] = [];
    if (await this.app.vault.adapter.exists(recentPath)) {
      try {
        const raw = await this.app.vault.adapter.read(recentPath);
        const parsed = JSON.parse(raw);
        items = Array.isArray(parsed) ? parsed : [];
      } catch {
        items = [];
      }
    }

    const preview = createRecentPreview(document);
    const next = [
      preview,
      ...items.filter((item) => typeof item === "object" && item !== null && (item as { filePath?: string }).filePath !== document.filePath)
    ].slice(0, this.settings.maxCachedDocuments);

    await this.app.vault.adapter.write(recentPath, JSON.stringify(next, null, 2));
  }

  private async ensureFolder(folderPath: string): Promise<void> {
    const parts = normalizePath(folderPath).split("/");
    let current = "";

    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!(await this.app.vault.adapter.exists(current))) {
        await this.app.vault.adapter.mkdir(current);
      }
    }
  }

  private async listSidecarPaths(folderPath: string): Promise<string[]> {
    if (!(await this.app.vault.adapter.exists(folderPath))) {
      return [];
    }

    const listed = await this.app.vault.adapter.list(folderPath);
    const nested = await Promise.all(listed.folders.map((folder) => this.listSidecarPaths(folder)));
    return [...listed.files, ...nested.flat()].filter((filePath) => filePath.endsWith(".json"));
  }

  private extractFilePath(parsed: unknown, sidecarPath: string): string {
    if (typeof parsed === "object" && parsed !== null) {
      const raw = parsed as Record<string, unknown>;
      if (typeof raw.filePath === "string" && raw.filePath.trim()) {
        return raw.filePath;
      }
    }

    const fallback = sidecarPath.split("/files/").pop()?.replace(/^[^/]+\//, "") ?? sidecarPath;
    return fallback.replace(/\.json$/, "");
  }
}

function normalizeRecentPreviewItem(value: unknown): RecentPreviewItem[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const raw = value as Record<string, unknown>;
  if (typeof raw.filePath !== "string" || typeof raw.commentCount !== "number" || typeof raw.updatedAt !== "string") {
    return [];
  }

  const preview = Array.isArray(raw.preview)
    ? raw.preview.flatMap((entry) => normalizeRecentPreviewComment(entry))
    : [];

  return [
    {
      filePath: raw.filePath,
      commentCount: raw.commentCount,
      updatedAt: raw.updatedAt,
      preview
    }
  ];
}

function normalizeRecentPreviewComment(value: unknown): RecentPreviewItem["preview"][number][] {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const raw = value as Record<string, unknown>;
  if (
    typeof raw.id !== "string" ||
    typeof raw.selectedTextPreview !== "string" ||
    typeof raw.notePreview !== "string" ||
    typeof raw.markType !== "string" ||
    typeof raw.color !== "string"
  ) {
    return [];
  }

  const status = raw.status === "resolved" || raw.status === "orphaned" ? raw.status : "active";
  if (raw.markType !== "highlight" && raw.markType !== "underline" && raw.markType !== "strikethrough") {
    return [];
  }
  if (
    raw.color !== "yellow" &&
    raw.color !== "blue" &&
    raw.color !== "red" &&
    raw.color !== "green" &&
    raw.color !== "purple"
  ) {
    return [];
  }

  return [
    {
      id: raw.id,
      selectedTextPreview: raw.selectedTextPreview,
      notePreview: raw.notePreview,
      markType: raw.markType,
      color: raw.color,
      status,
      annotationType: raw.annotationType === "question" || raw.annotationType === "thought" || raw.annotationType === "task" || raw.annotationType === "excerpt"
        ? raw.annotationType
        : undefined,
      tags: Array.isArray(raw.tags) ? normalizeTags(raw.tags.filter((tag): tag is string => typeof tag === "string")) : undefined
    }
  ];
}
