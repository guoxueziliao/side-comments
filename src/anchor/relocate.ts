import type { SideComment, TextAnchor } from "../types";
import { findBestFuzzyMatch } from "./fuzzyMatch";
import { refreshAnchorMetadata } from "./textAnchor";

const CONTEXT_THRESHOLD = 0.75;
const FUZZY_THRESHOLD = 0.85;

export function relocateComment(source: string, comment: SideComment): SideComment {
  const anchor = relocateAnchor(source, comment.anchor);
  if (!anchor) {
    return {
      ...comment,
      status: "orphaned"
    };
  }

  return {
    ...comment,
    anchor,
    status: comment.status === "orphaned" ? "active" : comment.status
  };
}

export function relocateAnchor(source: string, anchor: TextAnchor): TextAnchor | null {
  if (anchor.selectedText.length === 0) {
    return null;
  }

  if (source.slice(anchor.startOffset, anchor.endOffset) === anchor.selectedText) {
    return anchor;
  }

  const contextual = findByContext(source, anchor);
  if (contextual) {
    return contextual;
  }

  const fuzzy = findBestFuzzyMatch(source, anchor.selectedText);
  if (fuzzy && fuzzy.confidence >= FUZZY_THRESHOLD) {
    return refreshAnchorMetadata(source, {
      ...anchor,
      startOffset: fuzzy.startOffset,
      endOffset: fuzzy.endOffset
    });
  }

  return null;
}

function findByContext(source: string, anchor: TextAnchor): TextAnchor | null {
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const index = source.indexOf(anchor.selectedText, searchFrom);
    if (index < 0) {
      return null;
    }

    const end = index + anchor.selectedText.length;
    const prefix = source.slice(Math.max(0, index - anchor.prefix.length), index);
    const suffix = source.slice(end, end + anchor.suffix.length);
    const score = (similarity(prefix, anchor.prefix) + similarity(suffix, anchor.suffix)) / 2;

    if (score >= CONTEXT_THRESHOLD) {
      return refreshAnchorMetadata(source, {
        ...anchor,
        startOffset: index,
        endOffset: end
      });
    }

    searchFrom = end;
  }

  return null;
}

function similarity(left: string, right: string): number {
  if (!left && !right) {
    return 1;
  }

  const maxLength = Math.max(left.length, right.length);
  if (maxLength === 0) {
    return 1;
  }

  let same = 0;
  const minLength = Math.min(left.length, right.length);
  for (let index = 0; index < minLength; index += 1) {
    if (left[index] === right[index]) {
      same += 1;
    }
  }

  return same / maxLength;
}
