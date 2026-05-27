import { normalizePath } from "obsidian";
import type {
  AnnotationType,
  AnchorSourceMode,
  MaintenanceExportScope,
  MarkColor,
  MarkType,
  SideComment,
  SideCommentExportDocumentEntry,
  SideCommentStatus,
  SideCommentsImportPackage,
  TextAnchor
} from "../types";
import { isAnnotationType, normalizeTags } from "../organization/annotationMetadata";
import { summarizeComments } from "./export";

const EXPORT_FORMAT = "side-comments-export";
const SUPPORTED_IMPORT_VERSIONS = [1, 2] as const;

export type ParseImportPackageResult = {
  ok: true;
  package: SideCommentsImportPackage;
} | {
  ok: false;
  reason: "invalid-json" | "invalid-format" | "unsupported-version" | "invalid-documents";
};

export function parseSideCommentsImportPackage(rawJson: string): ParseImportPackageResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, reason: "invalid-format" };
  }

  const raw = parsed as Record<string, unknown>;
  if (raw.format !== EXPORT_FORMAT) {
    return { ok: false, reason: "invalid-format" };
  }

  const version = readExportFormatVersion(raw);
  if (!isSupportedImportVersion(version)) {
    return { ok: false, reason: "unsupported-version" };
  }

  if (!Array.isArray(raw.documents)) {
    return { ok: false, reason: "invalid-documents" };
  }

  const defaultedCommentIds: string[] = [];
  const documents = raw.documents.flatMap((entry) => normalizeImportDocumentEntry(entry, version, defaultedCommentIds));
  if (documents.length !== raw.documents.length) {
    return { ok: false, reason: "invalid-documents" };
  }

  return {
    ok: true,
    package: {
      format: EXPORT_FORMAT,
      exportFormatVersion: version,
      pluginVersion: typeof raw.pluginVersion === "string" ? raw.pluginVersion : "",
      exportedAt: typeof raw.exportedAt === "string" ? raw.exportedAt : "",
      scope: normalizeScope(raw.scope),
      vault: normalizeVault(raw.vault),
      documents,
      defaultedCommentIds
    }
  };
}

function readExportFormatVersion(raw: Record<string, unknown>): number {
  if (raw.exportFormatVersion === 1 || raw.exportFormatVersion === 2) {
    return raw.exportFormatVersion;
  }
  if (raw.formatVersion === 1 || raw.formatVersion === 2) {
    return raw.formatVersion;
  }
  return -1;
}

function isSupportedImportVersion(value: number): value is 1 | 2 {
  return SUPPORTED_IMPORT_VERSIONS.includes(value as 1 | 2);
}

function normalizeImportDocumentEntry(
  value: unknown,
  version: 1 | 2,
  defaultedCommentIds: string[]
): SideCommentExportDocumentEntry[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const raw = value as Record<string, unknown>;
  if (typeof raw.filePath !== "string" || !Array.isArray(raw.comments)) {
    return [];
  }

  const comments = raw.comments.flatMap((comment) => normalizeImportComment(comment, version, defaultedCommentIds));
  if (comments.length !== raw.comments.length) {
    return [];
  }

  return [{
    filePath: normalizePath(raw.filePath),
    sidecarPath: typeof raw.sidecarPath === "string" ? normalizePath(raw.sidecarPath) : "",
    schemaVersion: typeof raw.schemaVersion === "number" ? raw.schemaVersion : 1,
    comments,
    stats: summarizeComments(comments)
  }];
}

function normalizeImportComment(
  value: unknown,
  version: 1 | 2,
  defaultedCommentIds: string[]
): SideComment[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== "string") {
    return [];
  }
  const anchor = normalizeAnchor(raw.anchor);
  const mark = normalizeMark(raw.mark);
  const note = normalizeNote(raw.note);
  if (!anchor || !mark || !note) {
    return [];
  }

  const annotationType = isAnnotationType(raw.annotationType) ? raw.annotationType : "excerpt";
  const tags = Array.isArray(raw.tags) ? normalizeTags(raw.tags.filter((tag): tag is string => typeof tag === "string")) : [];
  if (version === 1 && (!isAnnotationType(raw.annotationType) || !Array.isArray(raw.tags))) {
    defaultedCommentIds.push(raw.id);
  }

  return [{
    id: raw.id,
    anchor,
    mark,
    annotationType,
    tags,
    note,
    status: normalizeStatus(raw.status)
  }];
}

function normalizeAnchor(value: unknown): TextAnchor | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const raw = value as Record<string, unknown>;
  if (
    typeof raw.startOffset !== "number" ||
    typeof raw.endOffset !== "number" ||
    typeof raw.selectedText !== "string" ||
    typeof raw.prefix !== "string" ||
    typeof raw.suffix !== "string"
  ) {
    return null;
  }

  return {
    startOffset: raw.startOffset,
    endOffset: raw.endOffset,
    selectedText: raw.selectedText,
    prefix: raw.prefix,
    suffix: raw.suffix,
    version: raw.version === 2 ? 2 : undefined,
    context: normalizeAnchorContext(raw.context),
    position: normalizeAnchorPosition(raw.position),
    source: normalizeAnchorSource(raw.source)
  };
}

function normalizeAnchorContext(value: unknown): TextAnchor["context"] | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.before !== "string" ||
    typeof raw.after !== "string" ||
    typeof raw.normalizedBefore !== "string" ||
    typeof raw.normalizedSelectedText !== "string" ||
    typeof raw.normalizedAfter !== "string"
  ) {
    return undefined;
  }
  return {
    before: raw.before,
    after: raw.after,
    normalizedBefore: raw.normalizedBefore,
    normalizedSelectedText: raw.normalizedSelectedText,
    normalizedAfter: raw.normalizedAfter
  };
}

function normalizeAnchorPosition(value: unknown): TextAnchor["position"] | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.lineStart !== "number" ||
    typeof raw.lineEnd !== "number" ||
    typeof raw.columnStart !== "number" ||
    typeof raw.columnEnd !== "number"
  ) {
    return undefined;
  }
  return {
    lineStart: raw.lineStart,
    lineEnd: raw.lineEnd,
    columnStart: raw.columnStart,
    columnEnd: raw.columnEnd
  };
}

function normalizeAnchorSource(value: unknown): TextAnchor["source"] | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const raw = value as Record<string, unknown>;
  const mode = raw.mode === "reading" ? "reading" : raw.mode === "source" ? "source" : null;
  if (!mode || typeof raw.createdAt !== "string" || typeof raw.updatedAt !== "string") {
    return undefined;
  }
  return {
    mode: mode as AnchorSourceMode,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt
  };
}

function normalizeMark(value: unknown): SideComment["mark"] | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  if (!isMarkType(raw.type) || !isMarkColor(raw.color)) {
    return null;
  }
  return {
    type: raw.type,
    color: raw.color
  };
}

function normalizeNote(value: unknown): SideComment["note"] | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  if (typeof raw.content !== "string" || typeof raw.createdAt !== "string" || typeof raw.updatedAt !== "string") {
    return null;
  }
  return {
    content: raw.content,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt
  };
}

function normalizeStatus(value: unknown): SideCommentStatus {
  if (value === "resolved" || value === "orphaned") {
    return value;
  }
  return "active";
}

function normalizeScope(value: unknown): MaintenanceExportScope {
  if (value === "selected-notes" || value === "all-sidecars") {
    return value;
  }
  return "current-note";
}

function normalizeVault(value: unknown): SideCommentsImportPackage["vault"] {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const raw = value as Record<string, unknown>;
  return typeof raw.name === "string" ? { name: raw.name } : undefined;
}

function isMarkType(value: unknown): value is MarkType {
  return value === "highlight" || value === "underline" || value === "strikethrough" || value === "note";
}

function isMarkColor(value: unknown): value is MarkColor {
  return value === "yellow" || value === "blue" || value === "red" || value === "green" || value === "purple";
}
