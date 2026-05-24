import { normalizePath } from "obsidian";
import type {
  SideComment,
  SideCommentExportDocumentEntry,
  SideCommentExportStats,
  SideCommentsExportPackage
} from "../types";

const EXPORT_FORMAT = "side-comments-export";
const EXPORT_FORMAT_VERSION = 1;

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
    formatVersion: EXPORT_FORMAT_VERSION,
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
    comments: params.comments,
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
  lines.push(`- Format version: ${exportPackage.formatVersion}`);
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
      lines.push(`- Type: ${comment.mark.type}`);
      lines.push(`- Color: ${comment.mark.color}`);
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
