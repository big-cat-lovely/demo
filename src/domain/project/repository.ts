import type { WorldProject } from './types';

export interface ProjectRepository {
  list(): Promise<WorldProject[]>;
  getById(id: string): Promise<WorldProject | null>;
  save(project: WorldProject): Promise<WorldProject>;
  delete(id: string): Promise<void>;
}
