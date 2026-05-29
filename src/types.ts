export const CURRENT_SCHEMA_VERSION = 1;
export const DATA_DIR = ".obsidian-side-comments";

export type MarkType = "highlight" | "underline" | "strikethrough" | "note";
export type MarkColor = "yellow" | "blue" | "red" | "green" | "purple";
export type SideCommentStatus = "active" | "resolved" | "orphaned";
export type MarkFilter = "all" | MarkType | "comment";
export type ColorFilter = "all" | MarkColor;
export type StatusFilter = "all" | SideCommentStatus;
export type NoteStateFilter = "all" | "has-note" | "no-note";
export type AnnotationState = "mark-only" | "note-only" | "mark-and-note";
export type SelectionAction = "highlight" | "underline" | "strikethrough";
export type AnchorSourceMode = "source" | "reading";
export type AnnotationType = "excerpt" | "question" | "thought" | "task";
export type InterfaceLanguage = "auto" | "zh" | "en";

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
  annotationType?: AnnotationType;
  tags?: string[];
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

export type CardDensity = "normal" | "compact";

export interface PluginSettings {
  autoOpenSidebarAfterCreate: boolean;
  showResolvedMarks: boolean;
  defaultDensity: CardDensity;
  language: InterfaceLanguage;
  maxCachedDocuments: number;
  relocateDebounceMs: number;
  dataDir: typeof DATA_DIR;
}

export interface CommentDraft {
  noteContent: string;
  markType: MarkType;
  color: MarkColor;
  status: SideCommentStatus;
  tags: string[];
}

export interface CommentCreateInput {
  filePath: string;
  sourceText: string;
  startOffset: number;
  endOffset: number;
  markType: MarkType;
  color: MarkColor;
  sourceMode: AnchorSourceMode;
  noteContent?: string;
}

export interface CommentUpdateInput {
  noteContent?: string;
  markType?: MarkType;
  color?: MarkColor;
  status?: SideCommentStatus;
  tags?: string[];
}

export interface CommentQuery {
  search: string;
  markFilter: MarkFilter;
  colorFilter: ColorFilter;
  statusFilter: StatusFilter;
  noteStateFilter: NoteStateFilter;
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
    annotationType?: AnnotationType;
    tags?: string[];
    updatedAt: string;
  }[];
}

export type MaintenanceExportScope = "current-note" | "selected-notes" | "all-sidecars";
export type MaintenanceExportFormat = "json" | "markdown";

export interface SideCommentExportStats {
  total: number;
  active: number;
  resolved: number;
  orphaned: number;
}

export interface SideCommentExportDocumentEntry {
  filePath: string;
  sidecarPath: string;
  schemaVersion: number;
  comments: SideComment[];
  stats: SideCommentExportStats;
}

export interface SideCommentsExportPackage {
  format: "side-comments-export";
  exportFormatVersion: 2;
  pluginVersion: string;
  exportedAt: string;
  scope: MaintenanceExportScope;
  vault?: {
    name?: string;
  };
  documents: SideCommentExportDocumentEntry[];
}

export interface SideCommentsImportPackage {
  format: "side-comments-export";
  exportFormatVersion: 1 | 2;
  pluginVersion: string;
  exportedAt: string;
  scope: MaintenanceExportScope;
  vault?: {
    name?: string;
  };
  documents: SideCommentExportDocumentEntry[];
  defaultedCommentIds: string[];
}

export type MaintenanceImportMode = "restore-original" | "into-current";

export type HealthCheckScope = "current-note" | "selected-notes" | "all-sidecars";
export type HealthSeverity = "error" | "warning" | "info";
export type HealthIssueType = "missing-source" | "orphaned-anchor" | "duplicate-anchor" | "structure";

export interface HealthIssue {
  id: string;
  type: HealthIssueType;
  severity: HealthSeverity;
  filePath: string;
  title: string;
  detail: string;
  commentIds: string[];
}

export interface HealthReport {
  generatedAt: string;
  scope: HealthCheckScope;
  scannedDocumentCount: number;
  scannedSidecarCount: number;
  totalAnnotationCount: number;
  issues: HealthIssue[];
}
