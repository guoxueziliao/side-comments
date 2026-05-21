import type { SideComment } from "../types";

export function getMarkClassNames(comment: SideComment): string[] {
  const classes = [
    "side-comments-mark",
    `side-comments-mark--${comment.mark.type}`,
    `side-comments-mark--${comment.mark.color}`
  ];

  if (comment.status === "resolved") {
    classes.push("side-comments-mark--resolved");
  }

  return classes;
}

