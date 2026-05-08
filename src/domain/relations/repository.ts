import type { Relation } from './types';

export interface RelationRepository {
  list(projectId: string): Promise<Relation[]>;
  getById(projectId: string, id: string): Promise<Relation | null>;
  save(projectId: string, relation: Relation): Promise<Relation>;
  delete(projectId: string, id: string): Promise<void>;
}
