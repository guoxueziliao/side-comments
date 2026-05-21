export function debounce<T extends (...args: never[]) => void>(fn: T, delayMs: number): T {
  let timeout: number | undefined;

  return ((...args: Parameters<T>) => {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => fn(...args), delayMs);
  }) as T;
}

