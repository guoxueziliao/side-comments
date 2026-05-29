import type { AnnotationState, NoteStateFilter, SideComment } from "../types";

export function getAnnotationState(comment: SideComment): AnnotationState {
  const hasNote = hasNoteContent(comment);
  const hasVisibleMark = isVisualMark(comment.mark.type);

  if (hasVisibleMark && hasNote) {
    return "mark-and-note";
  }
  if (hasVisibleMark) {
    return "mark-only";
  }
  if (hasNote) {
    return "note-only";
  }
  if (isNoteOnlyMark(comment.mark.type)) {
    return "note-only";
  }
  return "mark-only";
}

export function hasNoteContent(comment: SideComment): boolean {
  return comment.note.content.trim().length > 0;
}

export function isVisualMark(markType: string): boolean {
  return markType === "highlight" || markType === "underline" || markType === "strikethrough";
}

export function isNoteOnlyMark(markType: string): boolean {
  return markType === "note";
}

export function matchesNoteStateFilter(comment: SideComment, filter: NoteStateFilter): boolean {
  if (filter === "all") {
    return true;
  }
  const hasNote = hasNoteContent(comment);
  return filter === "has-note" ? hasNote : !hasNote;
}
