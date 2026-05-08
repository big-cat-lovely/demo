import { describe, expect, it } from 'vitest';
import { cloneProject, exportProject, importProject, loadProject, saveProject, type ProjectStorage } from '../domain/project/storage';
import { sampleProject } from '../domain/project/sampleProject';

function createMemoryStorage(): ProjectStorage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key)
  };
}

describe('project storage', () => {
  it('exports and imports a valid project', () => {
    const exported = exportProject(sampleProject);
    const imported = importProject(exported);

    expect(imported.name).toBe(sampleProject.name);
    expect(imported.entities).toHaveLength(sampleProject.entities.length);
  });

  it('rejects invalid JSON and incomplete project files', () => {
    expect(() => importProject('{bad json')).toThrow('JSON');
    expect(() => importProject(JSON.stringify({ id: 'missing-fields' }))).toThrow('必要字段');
  });

  it('saves and loads from local project storage', () => {
    const storage = createMemoryStorage();
    const project = { ...cloneProject(sampleProject), name: '已保存项目' };

    saveProject(project, storage);

    expect(loadProject(storage).name).toBe('已保存项目');
  });
});
