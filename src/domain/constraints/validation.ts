import type { Entity } from '../entities/types';
import { isCharacterEntity } from '../entities/types';
import type { WorldProject } from '../project/types';
import type { Reference, ReferenceAnchor } from '../references/types';
import type { RuleModule } from '../rules/types';
import { validateRelation } from '../relations/validation';
import type { ConstraintViolation } from './types';

export function validateEntityAgainstRules(entity: Entity, rules: RuleModule): ConstraintViolation[] {
  const powerLimit = rules.globalParams.find(
    (param) => param.key === 'power_limit' && param.type === 'number' && typeof param.value === 'number'
  );

  if (!isCharacterEntity(entity) || !powerLimit) {
    return [];
  }

  if (entity.attributes.level > powerLimit.value) {
    return [
      {
        id: `entity:${entity.id}:power-limit`,
        severity: 'error',
        code: 'character_level_exceeds_power_limit',
        message: 'Character level cannot exceed the global power_limit.',
        target: { type: 'entity', id: entity.id }
      }
    ];
  }

  return [];
}

export function validateProject(project: WorldProject): ConstraintViolation[] {
  return [
    ...project.entities.flatMap((entity) => validateEntityAgainstRules(entity, project.rules)),
    ...project.relations.flatMap((relation) => validateRelation(relation, project.entities)),
    ...project.references.flatMap((reference) => validateReference(reference, project))
  ];
}

function validateReference(reference: Reference, project: WorldProject): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];

  if (!anchorExists(reference.source, project)) {
    violations.push(missingReferenceViolation(reference.id, 'source'));
  }

  if (!anchorExists(reference.target, project)) {
    violations.push(missingReferenceViolation(reference.id, 'target'));
  }

  return violations;
}

function anchorExists(anchor: ReferenceAnchor, project: WorldProject): boolean {
  if (anchor.type === 'entity') {
    return project.entities.some((entity) => entity.id === anchor.id);
  }

  if (anchor.type === 'material') {
    return project.materials.some((material) => material.id === anchor.id);
  }

  return project.rules.coreRules.some((rule) => rule.id === anchor.id);
}

function missingReferenceViolation(referenceId: string, side: 'source' | 'target'): ConstraintViolation {
  return {
    id: `reference:${referenceId}:missing-${side}`,
    severity: 'error',
    code: `missing_reference_${side}`,
    message: `Reference ${side} target does not exist.`,
    target: { type: 'project', id: referenceId }
  };
}
