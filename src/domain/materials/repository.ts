import type { Material } from './types';

export interface MaterialRepository {
  list(): Promise<Material[]>;
  getById(id: string): Promise<Material | null>;
  save(material: Material): Promise<Material>;
  delete(id: string): Promise<void>;
}
