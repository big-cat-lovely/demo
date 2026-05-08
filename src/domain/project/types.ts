import type { Entity } from '../entities/types';
import type { Material } from '../materials/types';
import type { Reference } from '../references/types';
import type { Relation } from '../relations/types';
import type { RuleModule } from '../rules/types';

export interface WorldProject {
  id: string;
  name: string;
  description?: string;
  materials: Material[];
  rules: RuleModule;
  entities: Entity[];
  relations: Relation[];
  references: Reference[];
  createdAt: string;
  updatedAt?: string;
}
