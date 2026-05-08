import { describe, expect, it } from 'vitest';
import { validateEntityAgainstRules, validateProject } from '../domain/constraints/validation';
import type { Entity } from '../domain/entities/types';
import { validateRelation } from '../domain/relations/validation';
import type { WorldProject } from '../domain/project/types';
import { sampleProject } from '../domain/project/sampleProject';

const faction: Entity = {
  id: 'faction:1',
  name: 'Faction',
  type: 'faction',
  attributes: { power: 5, resourceControl: 3, structure: 'council', locations: [] },
  tags: [],
  description: '',
  materialRefs: [],
  createdAt: '2026-05-08T00:00:00.000Z'
};

const character: Entity = {
  id: 'character:1',
  name: 'Character',
  type: 'character',
  attributes: { level: 12, motivation: 'survive' },
  tags: [],
  description: '',
  materialRefs: [],
  createdAt: '2026-05-08T00:00:00.000Z'
};

const resource: Entity = {
  id: 'resource:1',
  name: 'Resource',
  type: 'resource',
  attributes: { scarcity: 8, usage: 'energy' },
  tags: [],
  description: '',
  materialRefs: [],
  createdAt: '2026-05-08T00:00:00.000Z'
};

describe('worldbuilding constraints', () => {
  it('only allows control relations from faction to resource or location', () => {
    const valid = validateRelation(
      {
        id: 'relation:valid',
        sourceId: faction.id,
        targetId: resource.id,
        type: 'control',
        strength: 5,
        createdAt: '2026-05-08T00:00:00.000Z'
      },
      [faction, resource]
    );

    const invalid = validateRelation(
      {
        id: 'relation:invalid',
        sourceId: character.id,
        targetId: faction.id,
        type: 'control',
        strength: 5,
        createdAt: '2026-05-08T00:00:00.000Z'
      },
      [character, faction]
    );

    expect(valid).toHaveLength(0);
    expect(invalid).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'invalid_control_relation' })]));
  });

  it('flags character levels above the global power limit', () => {
    const violations = validateEntityAgainstRules(character, {
      tone: [],
      coreRules: [],
      globalParams: [{ key: 'power_limit', type: 'number', value: 10 }]
    });

    expect(violations).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'character_level_exceeds_power_limit' })])
    );
  });

  it('flags references that point to missing targets', () => {
    const project: WorldProject = {
      ...sampleProject,
      references: [
        {
          id: 'reference:missing',
          source: { type: 'entity', id: 'entity:faction-aurora' },
          target: { type: 'material', id: 'material:missing' },
          createdAt: '2026-05-08T00:00:00.000Z'
        }
      ]
    };

    expect(validateProject(project)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing_reference_target' })])
    );
  });
});
