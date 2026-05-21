import type { SideComment } from "../types";
import { getMarkClassNames } from "./markDecorations";

export interface ReadingViewRenderOptions {
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
    .filter((comment) => comment.status !== "orphaned")
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

  const preferredIndex = Math.max(0, Math.min(comment.anchor.startOffset, fullText.length));
  const index = locateText(fullText, comment.anchor.selectedText, preferredIndex);
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
  wrapper.title = "View comment";

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

function locateText(source: string, target: string, preferredIndex: number): number {
  const preferred = source.indexOf(target, preferredIndex);
  if (preferred >= 0) {
    return preferred;
  }
  return source.indexOf(target);
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
