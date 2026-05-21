import type { DataAdapter } from "obsidian";
import {
  CURRENT_SCHEMA_VERSION,
  type MarkColor,
  type MarkType,
  type SideComment,
  type SideCommentDocument
} from "../types";
import { getBackupPath } from "./pathHash";

export interface MigrationContext {
  adapter: DataAdapter;
  filePath: string;
  dataDir: string;
}

type MigratableDocument = Omit<SideCommentDocument, "schemaVersion"> & { schemaVersion: number };
type Migration = (document: MigratableDocument) => MigratableDocument;

const migrations: Record<number, Migration> = {
  0: (document) => ({
    ...document,
    schemaVersion: 1
  })
};

export async function migrateDocument(document: unknown, context: MigrationContext): Promise<SideCommentDocument> {
  let next = coerceDocument(document, context.filePath);

  while (next.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const migration = migrations[next.schemaVersion];
    if (!migration) {
      throw new Error(`Missing migration from schema v${next.schemaVersion}`);
    }

    await backupBeforeMigration(next, context, `schema-v${next.schemaVersion}-to-v${next.schemaVersion + 1}`);
    next = migration(next);
  }

  if (next.schemaVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(`Unsupported sidecar schema v${next.schemaVersion}`);
  }

  return {
    ...next,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    filePath: context.filePath,
    comments: sortComments(next.comments)
  };
}

async function backupBeforeMigration(
  document: MigratableDocument,
  context: MigrationContext,
  migrationName: string
): Promise<void> {
  const backupPath = await getBackupPath(context.filePath, migrationName, context.dataDir);
  if (await context.adapter.exists(backupPath)) {
    return;
  }

  const bucketDir = backupPath.slice(0, backupPath.lastIndexOf("/"));
  await ensureFolder(context.adapter, bucketDir);
  await context.adapter.write(backupPath, JSON.stringify(document, null, 2));
}

function coerceDocument(document: unknown, filePath: string): MigratableDocument {
  const raw = isRecord(document) ? document : {};
  const comments = Array.isArray(raw.comments) ? raw.comments.map((comment) => normalizeComment(comment)) : [];

  return {
    schemaVersion: typeof raw.schemaVersion === "number" ? raw.schemaVersion : 0,
    filePath: typeof raw.filePath === "string" ? raw.filePath : filePath,
    fileHash: typeof raw.fileHash === "string" ? raw.fileHash : "",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
    comments: sortComments(comments)
  };
}

function normalizeComment(comment: unknown): SideComment {
  const raw = isRecord(comment) ? comment : {};
  const anchor = isRecord(raw.anchor) ? raw.anchor : {};
  const mark = isRecord(raw.mark) ? raw.mark : {};
  const note = isRecord(raw.note) ? raw.note : {};

  return {
    id: typeof raw.id === "string" ? raw.id : crypto.randomUUID(),
    anchor: {
      startOffset: typeof anchor.startOffset === "number" ? anchor.startOffset : 0,
      endOffset: typeof anchor.endOffset === "number" ? anchor.endOffset : 0,
      selectedText: typeof anchor.selectedText === "string" ? anchor.selectedText : "",
      prefix: typeof anchor.prefix === "string" ? anchor.prefix : "",
      suffix: typeof anchor.suffix === "string" ? anchor.suffix : ""
    },
    mark: {
      type: isMarkType(mark.type) ? mark.type : "highlight",
      color: isMarkColor(mark.color) ? mark.color : "yellow"
    },
    note: {
      content: typeof note.content === "string" ? note.content : "",
      createdAt: typeof note.createdAt === "string" ? note.createdAt : new Date().toISOString(),
      updatedAt: typeof note.updatedAt === "string" ? note.updatedAt : new Date().toISOString()
    },
    status: isStatus(raw.status) ? raw.status : "active"
  };
}

export function sortComments(comments: SideComment[]): SideComment[] {
  return [...comments].sort((left, right) => {
    if (left.status === "orphaned" && right.status !== "orphaned") {
      return 1;
    }
    if (right.status === "orphaned" && left.status !== "orphaned") {
      return -1;
    }
    return left.anchor.startOffset - right.anchor.startOffset;
  });
}

async function ensureFolder(adapter: DataAdapter, folderPath: string): Promise<void> {
  const parts = folderPath.split("/");
  let current = "";

  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!(await adapter.exists(current))) {
      await adapter.mkdir(current);
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMarkType(value: unknown): value is MarkType {
  return value === "highlight" || value === "underline" || value === "strikethrough";
}

function isMarkColor(value: unknown): value is MarkColor {
  return value === "yellow" || value === "blue" || value === "red" || value === "green" || value === "purple";
}

function isStatus(value: unknown): value is SideComment["status"] {
  return value === "active" || value === "resolved" || value === "orphaned";
}
