import type { MarkColor, SideComment, SideCommentStatus } from "../types";
import type { Translator } from "../i18n";
import { normalizeTags } from "./annotationMetadata";
import { getAnnotationState } from "./annotationState";

export interface AnnotationDraftGroup {
  filePath: string;
  comments: SideComment[];
}

export function formatAnnotationMarkdownDraft(groups: AnnotationDraftGroup[], t: Translator): string {
  const lines: string[] = [`# ${t("draftOutput.title")}`, ""];

  for (const group of groups) {
    const noteComments = group.comments.filter((comment) => getAnnotationState(comment) !== "mark-only");
    if (noteComments.length === 0) {
      continue;
    }

    lines.push(`## ${t("draftOutput.source")}: [[${group.filePath}]]`);
    lines.push("");

    noteComments.forEach((comment, index) => {
      lines.push(`### ${index + 1}. ${inlineOrFallback(comment.anchor.selectedText)}`);
      lines.push("");
      lines.push(`- ${t("draftOutput.status")}: ${statusLabel(comment.status, t)}`);
      lines.push(`- ${t("draftOutput.tags")}: ${tagsLabel(comment)}`);
      lines.push(`- ${t("draftOutput.color")}: ${colorLabel(comment.mark.color, t)}`);
      lines.push(`- ${t("draftOutput.position")}: ${positionLabel(comment)}`);
      lines.push(`- ${t("draftOutput.source")}: [[${group.filePath}]]`);
      lines.push("");
      lines.push(`**${t("draftOutput.text")}**`);
      lines.push("");
      lines.push(blockquoteOrFallback(comment.anchor.selectedText));
      lines.push("");
      lines.push(`**${t("draftOutput.note")}**`);
      lines.push("");
      lines.push(blockquoteOrFallback(comment.note.content));
      lines.push("");
    });
  }

  return lines.join("\n").trimEnd() + "\n";
}

function statusLabel(status: SideCommentStatus, t: Translator): string {
  if (status === "resolved") {
    return t("filter.status.resolved");
  }
  if (status === "orphaned") {
    return t("filter.status.orphaned");
  }
  return t("filter.status.active");
}

function colorLabel(color: MarkColor, t: Translator): string {
  if (color === "blue") {
    return t("filter.color.blue");
  }
  if (color === "red") {
    return t("filter.color.red");
  }
  if (color === "green") {
    return t("filter.color.green");
  }
  if (color === "purple") {
    return t("filter.color.purple");
  }
  return t("filter.color.yellow");
}

function tagsLabel(comment: SideComment): string {
  const tags = normalizeTags(comment.tags);
  return tags.length > 0 ? tags.join(", ") : "-";
}

function positionLabel(comment: SideComment): string {
  const position = comment.anchor.position;
  if (position) {
    return `${position.lineStart}:${position.columnStart}-${position.lineEnd}:${position.columnEnd}`;
  }
  return `${comment.anchor.startOffset}-${comment.anchor.endOffset}`;
}

function inlineOrFallback(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed || "-";
}

function blockquoteOrFallback(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "> -";
  }
  return trimmed.split(/\r?\n/).map((line) => `> ${line}`).join("\n");
}
