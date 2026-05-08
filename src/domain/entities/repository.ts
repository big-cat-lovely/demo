import type { Entity } from './types';

export interface EntityRepository {
  list(projectId: string): Promise<Entity[]>;
  getById(projectId: string, id: string): Promise<Entity | null>;
  save(projectId: string, entity: Entity): Promise<Entity>;
  delete(projectId: string, id: string): Promise<void>;
}
