import type { AnchorSourceMode, TextAnchor } from "../types";

export const ANCHOR_CONTEXT_LENGTH = 40;
export const ANCHOR_EXTENDED_CONTEXT_LENGTH = 80;

export function createTextAnchor(
  source: string,
  startOffset: number,
  endOffset: number,
  sourceMode: AnchorSourceMode,
  existingSourceCreatedAt?: string
): TextAnchor {
  const normalizedStart = Math.min(startOffset, endOffset);
  const normalizedEnd = Math.max(startOffset, endOffset);
  const selectedText = source.slice(normalizedStart, normalizedEnd);
  const before = source.slice(Math.max(0, normalizedStart - ANCHOR_EXTENDED_CONTEXT_LENGTH), normalizedStart);
  const after = source.slice(normalizedEnd, normalizedEnd + ANCHOR_EXTENDED_CONTEXT_LENGTH);
  const now = new Date().toISOString();

  return {
    startOffset: normalizedStart,
    endOffset: normalizedEnd,
    selectedText,
    prefix: source.slice(Math.max(0, normalizedStart - ANCHOR_CONTEXT_LENGTH), normalizedStart),
    suffix: source.slice(normalizedEnd, normalizedEnd + ANCHOR_CONTEXT_LENGTH),
    version: 2,
    context: {
      before,
      after,
      normalizedBefore: normalizeAnchorText(before),
      normalizedSelectedText: normalizeAnchorText(selectedText),
      normalizedAfter: normalizeAnchorText(after)
    },
    position: getAnchorPosition(source, normalizedStart, normalizedEnd),
    source: {
      mode: sourceMode,
      createdAt: existingSourceCreatedAt ?? now,
      updatedAt: now
    }
  };
}

export function refreshAnchorMetadata(source: string, anchor: TextAnchor, mode: AnchorSourceMode = anchor.source?.mode ?? "source"): TextAnchor {
  return createTextAnchor(source, anchor.startOffset, anchor.endOffset, mode, anchor.source?.createdAt);
}

export function normalizeAnchorText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getAnchorPosition(source: string, startOffset: number, endOffset: number): TextAnchor["position"] {
  const start = offsetToLineColumn(source, startOffset);
  const end = offsetToLineColumn(source, endOffset);
  return {
    lineStart: start.line,
    lineEnd: end.line,
    columnStart: start.column,
    columnEnd: end.column
  };
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
