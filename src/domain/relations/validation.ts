import type { ConstraintViolation } from '../constraints/types';
import type { Entity } from '../entities/types';
import type { Relation } from './types';

export function validateRelation(relation: Relation, entities: Entity[]): ConstraintViolation[] {
  const source = entities.find((entity) => entity.id === relation.sourceId);
  const target = entities.find((entity) => entity.id === relation.targetId);
  const violations: ConstraintViolation[] = [];

  if (!source) {
    violations.push({
      id: `relation:${relation.id}:missing-source`,
      severity: 'error',
      code: 'missing_relation_source',
      message: 'Relation source entity does not exist.',
      target: { type: 'relation', id: relation.id }
    });
  }

  if (!target) {
    violations.push({
      id: `relation:${relation.id}:missing-target`,
      severity: 'error',
      code: 'missing_relation_target',
      message: 'Relation target entity does not exist.',
      target: { type: 'relation', id: relation.id }
    });
  }

  if (relation.type === 'control' && source && target) {
    const targetAllowed = target.type === 'resource' || target.type === 'location';

    if (source.type !== 'faction' || !targetAllowed) {
      violations.push({
        id: `relation:${relation.id}:invalid-control`,
        severity: 'error',
        code: 'invalid_control_relation',
        message: 'Control relations must point from a faction to a resource or location.',
        target: { type: 'relation', id: relation.id }
      });
    }
  }

  return violations;
}
