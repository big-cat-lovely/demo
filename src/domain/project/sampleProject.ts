import type { WorldProject } from './types';

export const sampleProject: WorldProject = {
  id: 'project:demo',
  name: '示例世界',
  description: '用于验证架构骨架的最小世界观工程。',
  createdAt: '2026-05-08T00:00:00.000Z',
  materials: [
    {
      id: 'material:origin-note',
      title: '世界原点笔记',
      content: '一个资源被多个势力争夺的边境世界。',
      tags: ['origin'],
      type: 'idea',
      createdAt: '2026-05-08T00:00:00.000Z'
    }
  ],
  rules: {
    tone: ['structured', 'local-first'],
    coreRules: [
      {
        id: 'rule:power-system',
        name: '等级上限',
        type: 'power_system',
        exists: true,
        properties: { scale: '1-10' },
        limit: { hasLimit: true, description: '角色等级不应超过全局力量上限。' }
      }
    ],
    globalParams: [{ key: 'power_limit', type: 'number', min: 1, max: 10, value: 10 }]
  },
  entities: [
    {
      id: 'entity:faction-aurora',
      name: '曙光议会',
      type: 'faction',
      attributes: { power: 8, resourceControl: 6, structure: 'council', locations: ['entity:location-border'] },
      tags: ['faction'],
      description: '控制边境贸易的主要势力。',
      materialRefs: ['material:origin-note'],
      createdAt: '2026-05-08T00:00:00.000Z'
    },
    {
      id: 'entity:resource-ember',
      name: '余烬矿',
      type: 'resource',
      attributes: { scarcity: 9, usage: 'energy', controller: 'entity:faction-aurora' },
      tags: ['resource'],
      description: '驱动世界核心技术的稀缺资源。',
      materialRefs: ['material:origin-note'],
      createdAt: '2026-05-08T00:00:00.000Z'
    }
  ],
  relations: [
    {
      id: 'relation:aurora-controls-ember',
      sourceId: 'entity:faction-aurora',
      targetId: 'entity:resource-ember',
      type: 'control',
      strength: 7,
      createdAt: '2026-05-08T00:00:00.000Z'
    }
  ],
  references: [
    {
      id: 'reference:origin-to-faction',
      source: { type: 'entity', id: 'entity:faction-aurora' },
      target: { type: 'material', id: 'material:origin-note' },
      createdAt: '2026-05-08T00:00:00.000Z'
    }
  ]
};
