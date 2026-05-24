import type { RecentPreviewItem, SideCommentDocument } from "../types";

export function createRecentPreview(document: SideCommentDocument, maxItems = 5): RecentPreviewItem {
  return {
    filePath: document.filePath,
    commentCount: document.comments.length,
    updatedAt: document.updatedAt,
    preview: document.comments.slice(0, maxItems).map((comment) => ({
      id: comment.id,
      selectedTextPreview: comment.anchor.selectedText.slice(0, 120),
      notePreview: comment.note.content.slice(0, 120),
      markType: comment.mark.type,
      color: comment.mark.color,
      status: comment.status
    }))
  };
}
