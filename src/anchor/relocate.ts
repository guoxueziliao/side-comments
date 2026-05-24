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
    if (anchor.version !== 2 || !anchor.context || !anchor.position || !anchor.source) {
      return refreshAnchorMetadata(source, anchor);
    }
    return anchor;
  }

  const contextual = findByContext(source, anchor);
  if (contextual) {
    return contextual;
  }

  const exactMatches = findExactMatches(source, anchor.selectedText);
  const positional = findByPosition(source, anchor, exactMatches);
  if (positional) {
    return positional;
  }
  if (exactMatches.length === 1) {
    const startOffset = exactMatches[0];
    return refreshAnchorMetadata(source, {
      ...anchor,
      startOffset,
      endOffset: startOffset + anchor.selectedText.length
    });
  }
  if (exactMatches.length > 1) {
    return null;
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
  let bestMatch: { startOffset: number; endOffset: number; score: number } | null = null;
  let ambiguous = false;

  while (searchFrom < source.length) {
    const index = source.indexOf(anchor.selectedText, searchFrom);
    if (index < 0) {
      break;
    }

    const end = index + anchor.selectedText.length;
    const prefix = source.slice(Math.max(0, index - anchor.prefix.length), index);
    const suffix = source.slice(end, end + anchor.suffix.length);
    const score = (similarity(prefix, anchor.prefix) + similarity(suffix, anchor.suffix)) / 2;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = {
        startOffset: index,
        endOffset: end,
        score
      };
      ambiguous = false;
    } else if (score === bestMatch.score) {
      ambiguous = true;
    }

    searchFrom = end;
  }

  if (!bestMatch || bestMatch.score < CONTEXT_THRESHOLD || ambiguous) {
    return null;
  }

  return refreshAnchorMetadata(source, {
    ...anchor,
    startOffset: bestMatch.startOffset,
    endOffset: bestMatch.endOffset
  });
}

function findByPosition(source: string, anchor: TextAnchor, matches: number[]): TextAnchor | null {
  if (!anchor.position || matches.length === 0) {
    return null;
  }

  let bestMatch: { startOffset: number; score: number } | null = null;
  let ambiguous = false;
  for (const startOffset of matches) {
    const position = offsetToLineColumn(source, startOffset);
    const score =
      Math.abs(position.line - anchor.position.lineStart) * 1000 +
      Math.abs(position.column - anchor.position.columnStart);

    if (!bestMatch || score < bestMatch.score) {
      bestMatch = {
        startOffset,
        score
      };
      ambiguous = false;
    } else if (score === bestMatch.score) {
      ambiguous = true;
    }
  }

  if (!bestMatch || ambiguous) {
    return null;
  }

  return refreshAnchorMetadata(source, {
    ...anchor,
    startOffset: bestMatch.startOffset,
    endOffset: bestMatch.startOffset + anchor.selectedText.length
  });
}

function findExactMatches(source: string, target: string): number[] {
  const matches: number[] = [];
  let searchFrom = 0;

  while (searchFrom <= source.length) {
    const index = source.indexOf(target, searchFrom);
    if (index < 0) {
      break;
    }
    matches.push(index);
    searchFrom = index + Math.max(1, target.length);
  }

  return matches;
}

function offsetToLineColumn(source: string, offset: number): { line: number; column: number } {
  const safeOffset = Math.max(0, Math.min(offset, source.length));
  let line = 1;
  let column = 1;

  for (let index = 0; index < safeOffset; index += 1) {
    if (source[index] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
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
