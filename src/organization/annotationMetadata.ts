import type { AnnotationType, SideComment } from "../types";

export function getAnnotationType(comment: SideComment): AnnotationType {
  return isAnnotationType(comment.annotationType) ? comment.annotationType : "excerpt";
}

export function isAnnotationType(value: unknown): value is AnnotationType {
  return value === "excerpt" || value === "question" || value === "thought" || value === "task";
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
