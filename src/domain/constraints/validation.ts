import type { Entity } from '../entities/types';
import { isCharacterEntity } from '../entities/types';
import type { WorldProject } from '../project/types';
import type { Reference, ReferenceAnchor } from '../references/types';
import type { RuleModule } from '../rules/types';
import { validateRelation } from '../relations/validation';
import type { ConstraintViolation } from './types';

export function validateEntityAgainstRules(entity: Entity, rules: RuleModule): ConstraintViolation[] {
  const powerLimit = getNumberGlobalParam(rules, 'power_limit');

  if (!isCharacterEntity(entity) || powerLimit === null) {
    return [];
  }

  if (entity.attributes.level > powerLimit) {
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
    ...project.entities.flatMap((entity) => validateEntityMaterialRefs(entity, project)),
    ...project.relations.flatMap((relation) => validateRelation(relation, project.entities)),
    ...project.references.flatMap((reference) => validateReference(reference, project))
  ];
}

function getNumberGlobalParam(rules: RuleModule, key: string): number | null {
  const param = rules.globalParams.find((candidate) => candidate.key === key && candidate.type === 'number');
  return typeof param?.value === 'number' ? param.value : null;
}

function validateEntityMaterialRefs(entity: Entity, project: WorldProject): ConstraintViolation[] {
  return entity.materialRefs
    .filter((materialId) => !project.materials.some((material) => material.id === materialId))
    .map((materialId) => ({
      id: `entity:${entity.id}:missing-material:${materialId}`,
      severity: 'error' as const,
      code: 'missing_entity_material_ref',
      message: 'Entity references a material that does not exist.',
      target: { type: 'entity' as const, id: entity.id }
    }));
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
