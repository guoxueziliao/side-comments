export interface FuzzyMatchResult {
  startOffset: number;
  endOffset: number;
  confidence: number;
}

export function findBestFuzzyMatch(source: string, selectedText: string): FuzzyMatchResult | null {
  if (!selectedText) {
    return null;
  }

  const exactIndex = source.indexOf(selectedText);
  if (exactIndex >= 0) {
    return {
      startOffset: exactIndex,
      endOffset: exactIndex + selectedText.length,
      confidence: 1
    };
  }

  const windowSize = Math.max(4, selectedText.length);
  let best: FuzzyMatchResult | null = null;

  for (let index = 0; index < source.length; index += 1) {
    const candidate = source.slice(index, index + windowSize);
    if (!candidate) {
      continue;
    }

    const confidence = similarity(candidate, selectedText);
    if (!best || confidence > best.confidence) {
      best = {
        startOffset: index,
        endOffset: Math.min(source.length, index + candidate.length),
        confidence
      };
    }
  }

  return best && best.confidence >= 0.65 ? best : null;
}

function similarity(left: string, right: string): number {
  if (left === right) {
    return 1;
  }

  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length, 1);
}

function levenshtein(left: string, right: string): number {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }
  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }

  return matrix[left.length][right.length];
}
