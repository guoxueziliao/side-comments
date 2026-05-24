export const CURRENT_SCHEMA_VERSION = 1;
export const DATA_DIR = ".obsidian-side-comments";

export type MarkType = "highlight" | "underline" | "strikethrough";
export type MarkColor = "yellow" | "blue" | "red" | "green" | "purple";
export type SideCommentStatus = "active" | "resolved" | "orphaned";
export type SidebarDisplayMode = "normal" | "compact";
export type MarkFilter = "all" | MarkType | "comment";
export type ColorFilter = "all" | MarkColor;
export type StatusFilter = "all" | SideCommentStatus;
export type SelectionAction = "highlight" | "underline" | "strikethrough" | "comment";
export type AnchorSourceMode = "source" | "reading";

export interface TextAnchor {
  startOffset: number;
  endOffset: number;
  selectedText: string;
  prefix: string;
  suffix: string;
  version?: 2;
  context?: {
    before: string;
    after: string;
    normalizedBefore: string;
    normalizedSelectedText: string;
    normalizedAfter: string;
  };
  position?: {
    lineStart: number;
    lineEnd: number;
    columnStart: number;
    columnEnd: number;
  };
  source?: {
    mode: AnchorSourceMode;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SideComment {
  id: string;
  anchor: TextAnchor;
  mark: {
    type: MarkType;
    color: MarkColor;
  };
  note: {
    content: string;
    createdAt: string;
    updatedAt: string;
  };
  status: SideCommentStatus;
}

export interface SideCommentDocument {
  schemaVersion: 1;
  filePath: string;
  fileHash: string;
  updatedAt: string;
  comments: SideComment[];
}

export interface SideCommentsManifest {
  schemaVersion: 1;
  pluginVersion: string;
  updatedAt: string;
}

export interface PluginSettings {
  autoOpenSidebarAfterCreate: boolean;
  showResolvedMarks: boolean;
  showResolvedComments: boolean;
  sidebarDisplayMode: SidebarDisplayMode;
  maxCachedDocuments: number;
  relocateDebounceMs: number;
  dataDir: typeof DATA_DIR;
}

export interface CommentDraft {
  noteContent: string;
  markType: MarkType;
  color: MarkColor;
  status: SideCommentStatus;
}

export interface CommentCreateInput {
  filePath: string;
  sourceText: string;
  startOffset: number;
  endOffset: number;
  markType: MarkType;
  color: MarkColor;
  sourceMode: AnchorSourceMode;
}

export interface CommentUpdateInput {
  noteContent?: string;
  markType?: MarkType;
  color?: MarkColor;
  status?: SideCommentStatus;
}

export interface CommentQuery {
  search: string;
  markFilter: MarkFilter;
  colorFilter: ColorFilter;
  statusFilter: StatusFilter;
}

export interface RecentPreviewItem {
  filePath: string;
  commentCount: number;
  updatedAt: string;
  preview: {
    id: string;
    selectedTextPreview: string;
    notePreview: string;
    markType: MarkType;
    color: MarkColor;
    status: SideCommentStatus;
  }[];
}
