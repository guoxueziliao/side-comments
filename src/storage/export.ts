import { normalizePath } from "obsidian";
import type {
  SideComment,
  SideCommentExportDocumentEntry,
  SideCommentExportStats,
  SideCommentsExportPackage
} from "../types";
import { getAnnotationType, normalizeTags } from "../organization/annotationMetadata";

const EXPORT_FORMAT = "side-comments-export";
export const EXPORT_FORMAT_VERSION = 2;

export function createExportPackage(params: {
  pluginVersion: string;
  scope: SideCommentsExportPackage["scope"];
  vaultName?: string;
  documents: SideCommentExportDocumentEntry[];
  exportedAt?: string;
}): SideCommentsExportPackage {
  const exportedAt = params.exportedAt ?? new Date().toISOString();
  return {
    format: EXPORT_FORMAT,
    exportFormatVersion: EXPORT_FORMAT_VERSION,
    pluginVersion: params.pluginVersion,
    exportedAt,
    scope: params.scope,
    vault: params.vaultName ? { name: params.vaultName } : undefined,
    documents: params.documents.map((document) => ({
      ...document,
      filePath: normalizePath(document.filePath)
    }))
  };
}

export function buildExportDocumentEntry(params: {
  filePath: string;
  sidecarPath: string;
  schemaVersion: number;
  comments: SideComment[];
}): SideCommentExportDocumentEntry {
  return {
    filePath: normalizePath(params.filePath),
    sidecarPath: normalizePath(params.sidecarPath),
    schemaVersion: params.schemaVersion,
    comments: params.comments.map(normalizeExportComment),
    stats: summarizeComments(params.comments)
  };
}

export function serializeExportPackage(exportPackage: SideCommentsExportPackage): string {
  return JSON.stringify(exportPackage, null, 2);
}

export function exportPackageToMarkdown(exportPackage: SideCommentsExportPackage): string {
  const lines: string[] = [];
  lines.push("# Side Comments export");
  lines.push("");
  lines.push(`- Format: ${exportPackage.format}`);
  lines.push(`- Format version: ${exportPackage.exportFormatVersion}`);
  lines.push(`- Plugin version: ${exportPackage.pluginVersion}`);
  lines.push(`- Exported at: ${exportPackage.exportedAt}`);
  lines.push(`- Scope: ${exportPackage.scope}`);
  if (exportPackage.vault?.name) {
    lines.push(`- Vault: ${exportPackage.vault.name}`);
  }
  lines.push("");

  for (const document of exportPackage.documents) {
    lines.push(`## ${document.filePath}`);
    lines.push("");
    lines.push(`- Total: ${document.stats.total}`);
    lines.push(`- Active: ${document.stats.active}`);
    lines.push(`- Resolved: ${document.stats.resolved}`);
    lines.push(`- Orphaned: ${document.stats.orphaned}`);
    lines.push("");

    document.comments.forEach((comment, index) => {
      lines.push(`### ${index + 1}. ${describeComment(comment)}`);
      lines.push("");
      lines.push(`- Status: ${comment.status}`);
      lines.push(`- Mark: ${comment.mark.type}`);
      lines.push(`- Annotation type: ${getAnnotationType(comment)}`);
      lines.push(`- Color: ${comment.mark.color}`);
      const tags = normalizeTags(comment.tags);
      if (tags.length > 0) {
        lines.push(`- Tags: ${tags.join(", ")}`);
      }
      lines.push(`- Selected text: ${inlineOrFallback(comment.anchor.selectedText)}`);
      lines.push(`- Comment: ${inlineOrFallback(comment.note.content)}`);
      if (comment.anchor.context) {
        lines.push(`- Context before: ${inlineOrFallback(comment.anchor.context.before)}`);
        lines.push(`- Context after: ${inlineOrFallback(comment.anchor.context.after)}`);
      }
      if (comment.anchor.source) {
        lines.push(`- Created: ${comment.anchor.source.createdAt}`);
        lines.push(`- Updated: ${comment.anchor.source.updatedAt}`);
      }
      if (comment.status === "orphaned") {
        lines.push("- Orphaned: yes");
      }
      lines.push("");
    });
  }

  return lines.join("\n").trimEnd() + "\n";
}

function normalizeExportComment(comment: SideComment): SideComment {
  return {
    ...comment,
    annotationType: getAnnotationType(comment),
    tags: normalizeTags(comment.tags)
  };
}

export function summarizeComments(comments: SideComment[]): SideCommentExportStats {
  return comments.reduce<SideCommentExportStats>(
    (stats, comment) => {
      stats.total += 1;
      if (comment.status === "active") {
        stats.active += 1;
      } else if (comment.status === "resolved") {
        stats.resolved += 1;
      } else {
        stats.orphaned += 1;
      }
      return stats;
    },
    {
      total: 0,
      active: 0,
      resolved: 0,
      orphaned: 0
    }
  );
}

function describeComment(comment: SideComment): string {
  const selected = inlineOrFallback(comment.anchor.selectedText);
  return selected === "—" && inlineOrFallback(comment.note.content) === "—" ? "Comment" : selected;
}

function inlineOrFallback(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.replace(/\s+/g, " ") : "—";
}
