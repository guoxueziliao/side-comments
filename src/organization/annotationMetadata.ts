import type { AnnotationType, SideComment } from "../types";
import type { Translator } from "../i18n";

export const ANNOTATION_TYPES: AnnotationType[] = ["excerpt", "question", "thought", "task"];

export function getAnnotationType(comment: SideComment): AnnotationType {
  return isAnnotationType(comment.annotationType) ? comment.annotationType : "excerpt";
}

export function isAnnotationType(value: unknown): value is AnnotationType {
  return value === "excerpt" || value === "question" || value === "thought" || value === "task";
}

export function annotationTypeLabel(type: AnnotationType, t: Translator): string {
  if (type === "question") {
    return t("annotationType.question");
  }
  if (type === "thought") {
    return t("annotationType.thought");
  }
  if (type === "task") {
    return t("annotationType.task");
  }
  return t("annotationType.excerpt");
}

export function normalizeTagKey(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function normalizeTags(values: readonly string[] | undefined): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const value of values ?? []) {
    const display = value.trim().replace(/\s+/g, " ");
    const key = normalizeTagKey(display);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    tags.push(display);
  }

  return tags;
}

export function collectAnnotationTags(comments: readonly SideComment[]): string[] {
  return normalizeTags(comments.flatMap((comment) => comment.tags ?? [])).sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: "base" })
  );
}

export function hasAnyNormalizedTag(comment: SideComment, normalizedFilterTags: ReadonlySet<string>): boolean {
  if (normalizedFilterTags.size === 0) {
    return true;
  }

  const commentTags = new Set(normalizeTags(comment.tags).map((tag) => normalizeTagKey(tag)));
  for (const tag of normalizedFilterTags) {
    if (commentTags.has(tag)) {
      return true;
    }
  }
  return false;
}
