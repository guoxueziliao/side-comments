import type { TextAnchor } from "../types";

export const ANCHOR_CONTEXT_LENGTH = 40;

export function createTextAnchor(source: string, startOffset: number, endOffset: number): TextAnchor {
  const normalizedStart = Math.min(startOffset, endOffset);
  const normalizedEnd = Math.max(startOffset, endOffset);
  return {
    startOffset: normalizedStart,
    endOffset: normalizedEnd,
    selectedText: source.slice(normalizedStart, normalizedEnd),
    prefix: source.slice(Math.max(0, normalizedStart - ANCHOR_CONTEXT_LENGTH), normalizedStart),
    suffix: source.slice(normalizedEnd, normalizedEnd + ANCHOR_CONTEXT_LENGTH)
  };
}
