import { sampleProject } from './sampleProject';
import type { WorldProject } from './types';

const STORAGE_KEY = 'worldbuilding-tool:project:v1';

export interface ProjectStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function cloneProject(project: WorldProject): WorldProject {
  return JSON.parse(JSON.stringify(project)) as WorldProject;
}

export function loadProject(storage: ProjectStorage | null = getBrowserStorage()): WorldProject {
  if (!storage) {
    return cloneProject(sampleProject);
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return cloneProject(sampleProject);
  }

  try {
    return importProject(raw);
  } catch {
    storage.removeItem(STORAGE_KEY);
    return cloneProject(sampleProject);
  }
}

export function saveProject(project: WorldProject, storage: ProjectStorage | null = getBrowserStorage()): void {
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, exportProject(project));
}

export function clearSavedProject(storage: ProjectStorage | null = getBrowserStorage()): void {
  storage?.removeItem(STORAGE_KEY);
}

export function exportProject(project: WorldProject): string {
  return JSON.stringify(project, null, 2);
}

export function importProject(json: string): WorldProject {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('导入失败：JSON 格式不正确。');
  }

  if (!isWorldProject(parsed)) {
    throw new Error('导入失败：项目文件缺少必要字段。');
  }

  return cloneProject(parsed);
}

function isWorldProject(value: unknown): value is WorldProject {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.materials) &&
    isRecord(value.rules) &&
    Array.isArray(value.rules.tone) &&
    Array.isArray(value.rules.coreRules) &&
    Array.isArray(value.rules.globalParams) &&
    Array.isArray(value.entities) &&
    Array.isArray(value.relations) &&
    Array.isArray(value.references) &&
    typeof value.createdAt === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getBrowserStorage(): ProjectStorage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}
