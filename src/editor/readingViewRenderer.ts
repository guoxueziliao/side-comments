import type { SideComment } from "../types";
import { getMarkClassNames } from "./markDecorations";

export interface ReadingViewRenderOptions {
  sectionInfo?: {
    text: string;
    lineStart: number;
    lineEnd: number;
  };
  commentTitle?: string;
  onCommentClick?: (commentId: string) => void;
}

export function clearReadingViewMarks(container: HTMLElement): void {
  container.querySelectorAll("[data-side-comments-reading-view='true']").forEach((element) => {
    const parent = element.parentNode;
    if (!parent) {
      return;
    }
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  });
}

export function renderReadingViewMarks(
  container: HTMLElement,
  comments: SideComment[],
  options: ReadingViewRenderOptions = {}
): void {
  clearReadingViewMarks(container);

  const renderedComments = comments
    .filter((comment) => comment.status !== "orphaned" && isCommentInSection(comment, options.sectionInfo))
    .sort((left, right) => right.anchor.startOffset - left.anchor.startOffset);

  for (const comment of renderedComments) {
    wrapComment(container, comment, options);
  }
}

function wrapComment(container: HTMLElement, comment: SideComment, options: ReadingViewRenderOptions): void {
  const fullText = container.textContent ?? "";
  if (!fullText || comment.anchor.selectedText.length === 0) {
    return;
  }

  const preferredIndex = getSectionRelativePreferredIndex(comment, options.sectionInfo);
  const index = locateText(fullText, comment.anchor.selectedText, preferredIndex, options.sectionInfo?.text);
  if (index < 0) {
    return;
  }

  const range = buildRange(container, index, index + comment.anchor.selectedText.length);
  if (!range) {
    return;
  }

  const wrapper = document.createElement("span");
  wrapper.className = [...getMarkClassNames(comment), "side-comments-reading-view-mark"].join(" ");
  wrapper.dataset.sideCommentsId = comment.id;
  wrapper.dataset.sideCommentsReadingView = "true";
  wrapper.title = options.commentTitle ?? "";

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    options.onCommentClick?.(comment.id);
  };
  wrapper.addEventListener("click", handleClick);

  const fragment = range.extractContents();
  wrapper.appendChild(fragment);
  range.insertNode(wrapper);
}

function isCommentInSection(
  comment: SideComment,
  sectionInfo: ReadingViewRenderOptions["sectionInfo"]
): boolean {
  if (!sectionInfo) {
    return true;
  }

  const position = comment.anchor.position;
  if (!position) {
    return sectionInfo.text.includes(comment.anchor.selectedText);
  }

  const anchorStartLine = position.lineStart - 1;
  const anchorEndLine = position.lineEnd - 1;
  return anchorStartLine <= sectionInfo.lineEnd && anchorEndLine >= sectionInfo.lineStart;
}

function getSectionRelativePreferredIndex(
  comment: SideComment,
  sectionInfo: ReadingViewRenderOptions["sectionInfo"]
): number | undefined {
  const position = comment.anchor.position;
  if (!position || !sectionInfo) {
    return undefined;
  }

  const relativeLine = position.lineStart - 1 - sectionInfo.lineStart;
  if (relativeLine < 0) {
    return undefined;
  }

  const lines = sectionInfo.text.split("\n");
  if (relativeLine >= lines.length) {
    return undefined;
  }

  let offset = 0;
  for (let index = 0; index < relativeLine; index += 1) {
    offset += lines[index].length + 1;
  }

  return Math.max(0, offset + position.columnStart - 1);
}

function locateText(source: string, target: string, preferredIndex?: number, sourceSection?: string): number {
  if (!target) {
    return -1;
  }

  if (sourceSection && preferredIndex !== undefined) {
    const sourceIndex = findClosestTextMatch(sourceSection, target, preferredIndex);
    const occurrence = sourceIndex >= 0 ? getOccurrenceIndex(sourceSection, target, sourceIndex) : -1;
    const renderedIndex = occurrence >= 0 ? findOccurrence(source, target, occurrence) : -1;
    if (renderedIndex >= 0) {
      return renderedIndex;
    }
  }

  if (preferredIndex !== undefined) {
    const preferred = source.indexOf(target, preferredIndex);
    if (preferred >= 0) {
      return preferred;
    }
  }

  return source.indexOf(target);
}

function findClosestTextMatch(source: string, target: string, preferredIndex: number): number {
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  let searchFrom = 0;

  while (searchFrom <= source.length) {
    const index = source.indexOf(target, searchFrom);
    if (index < 0) {
      break;
    }

    const distance = Math.abs(index - preferredIndex);
    if (distance < bestDistance) {
      bestIndex = index;
      bestDistance = distance;
    }

    searchFrom = index + Math.max(1, target.length);
  }

  return bestIndex;
}

function getOccurrenceIndex(source: string, target: string, targetIndex: number): number {
  let occurrence = 0;
  let searchFrom = 0;

  while (searchFrom <= source.length) {
    const index = source.indexOf(target, searchFrom);
    if (index < 0) {
      return -1;
    }
    if (index === targetIndex) {
      return occurrence;
    }
    occurrence += 1;
    searchFrom = index + Math.max(1, target.length);
  }

  return -1;
}

function findOccurrence(source: string, target: string, occurrence: number): number {
  let current = 0;
  let searchFrom = 0;

  while (searchFrom <= source.length) {
    const index = source.indexOf(target, searchFrom);
    if (index < 0) {
      return -1;
    }
    if (current === occurrence) {
      return index;
    }
    current += 1;
    searchFrom = index + Math.max(1, target.length);
  }

  return -1;
}

function buildRange(root: HTMLElement, startOffset: number, endOffset: number): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;
  let startNode: Text | null = null;
  let startNodeOffset = 0;
  let endNode: Text | null = null;
  let endNodeOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const textLength = node.nodeValue?.length ?? 0;
    const nextOffset = currentOffset + textLength;

    if (!startNode && startOffset >= currentOffset && startOffset <= nextOffset) {
      startNode = node;
      startNodeOffset = Math.max(0, startOffset - currentOffset);
    }

    if (!endNode && endOffset >= currentOffset && endOffset <= nextOffset) {
      endNode = node;
      endNodeOffset = Math.max(0, endOffset - currentOffset);
      break;
    }

    currentOffset = nextOffset;
  }

  if (!startNode || !endNode) {
    return null;
  }

  const range = document.createRange();
  try {
    range.setStart(startNode, startNodeOffset);
    range.setEnd(endNode, endNodeOffset);
  } catch {
    return null;
  }

  return range;
}
