import { normalizePath } from "obsidian";
import { DATA_DIR } from "../types";

export function normalizeVaultRelativePath(filePath: string): string {
  return normalizePath(filePath).replace(/^\/+/, "");
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashVaultPath(filePath: string): Promise<string> {
  return sha256Hex(normalizeVaultRelativePath(filePath).toLowerCase());
}

export async function getSidecarPath(filePath: string, dataDir = DATA_DIR): Promise<string> {
  const hash = await hashVaultPath(filePath);
  return normalizePath(`${dataDir}/files/${hash.slice(0, 2)}/${hash}.json`);
}

export function getSidecarPathFromHash(hash: string, dataDir = DATA_DIR): string {
  return normalizePath(`${dataDir}/files/${hash.slice(0, 2)}/${hash}.json`);
}

export async function getBackupPath(filePath: string, migrationName: string, dataDir = DATA_DIR): Promise<string> {
  const hash = await hashVaultPath(filePath);
  return normalizePath(`${dataDir}/backups/${migrationName}/${hash.slice(0, 2)}/${hash}.json`);
}

export function getRecentPreviewPath(dataDir = DATA_DIR): string {
  return normalizePath(`${dataDir}/cache/recent.json`);
}

export function getManifestPath(dataDir = DATA_DIR): string {
  return normalizePath(`${dataDir}/manifest.json`);
}

export function getBucketDir(hash: string, dataDir = DATA_DIR): string {
  return normalizePath(`${dataDir}/files/${hash.slice(0, 2)}`);
}
