import type { DataAdapter } from "obsidian";
import { normalizePath } from "obsidian";
import { DATA_DIR } from "../types";
import { normalizeVaultRelativePath } from "./pathHash";

export type BackupOperation = "import" | "rebind" | "dedup" | "cleanup";

export interface BackupTarget {
  filePath: string;
  sidecarPath: string;
}

export interface CreateBackupBatchOptions {
  adapter: DataAdapter;
  operation: BackupOperation;
  targets: BackupTarget[];
  dataDir?: string;
  now?: Date;
}

export function getBackupRoot(dataDir = DATA_DIR): string {
  return normalizePath(`${dataDir}/.backups`);
}

export async function createBackupBatch(options: CreateBackupBatchOptions): Promise<string> {
  const dataDir = options.dataDir ?? DATA_DIR;
  const backupFolder = await createUniqueBackupFolder(options.adapter, dataDir, options.operation, options.now ?? new Date());

  for (const target of dedupeTargets(options.targets)) {
    const sidecarPath = normalizeVaultRelativePath(target.sidecarPath);
    if (!(await options.adapter.exists(sidecarPath))) {
      continue;
    }

    const backupPath = normalizePath(`${backupFolder}/${backupFilePathForSource(target.filePath)}`);
    await ensureFolder(options.adapter, backupPath.slice(0, backupPath.lastIndexOf("/")));
    await options.adapter.write(backupPath, await options.adapter.read(sidecarPath));
  }

  return backupFolder;
}

async function createUniqueBackupFolder(
  adapter: DataAdapter,
  dataDir: string,
  operation: BackupOperation,
  now: Date
): Promise<string> {
  const root = getBackupRoot(dataDir);
  await ensureFolder(adapter, root);

  const base = normalizePath(`${root}/${formatBackupTimestamp(now)}-${operation}`);
  let candidate = base;
  let suffix = 1;
  while (await adapter.exists(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  await ensureFolder(adapter, candidate);
  return candidate;
}

function backupFilePathForSource(filePath: string): string {
  return `${normalizeVaultRelativePath(filePath)}.json`;
}

function dedupeTargets(targets: BackupTarget[]): BackupTarget[] {
  const seen = new Set<string>();
  const deduped: BackupTarget[] = [];
  for (const target of targets) {
    const key = normalizeVaultRelativePath(target.sidecarPath);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(target);
  }
  return deduped;
}

function formatBackupTimestamp(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hour}${minute}${second}`;
}

async function ensureFolder(adapter: DataAdapter, folderPath: string): Promise<void> {
  const parts = normalizePath(folderPath).split("/").filter(Boolean);
  let current = "";

  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!(await adapter.exists(current))) {
      await adapter.mkdir(current);
    }
  }
}
