import type { WorldProject } from './types';

export const sampleProject: WorldProject = {
  id: 'project:demo',
  name: '边境余烬纪事',
  description: '一个围绕稀缺能源、边境城市和多方势力展开的示例世界观工程。',
  createdAt: '2026-05-08T00:00:00.000Z',
  materials: [
    {
      id: 'material:origin-note',
      title: '世界原点笔记',
      content: '一个资源被多个势力争夺的边境世界。余烬矿既是能源，也是政治秩序的核心。',
      tags: ['origin', 'resource'],
      type: 'idea',
      createdAt: '2026-05-08T00:00:00.000Z'
    },
    {
      id: 'material:border-map',
      title: '边境地图草案',
      content: '北方矿带、曙光议会城邦、灰港中转站构成主要冲突区域。',
      tags: ['location', 'map'],
      type: 'reference',
      source: '个人设定草图',
      createdAt: '2026-05-08T00:00:00.000Z'
    }
  ],
  rules: {
    tone: ['structured', 'frontier', 'political'],
    coreRules: [
      {
        id: 'rule:power-system',
        name: '余烬共鸣等级',
        type: 'power_system',
        exists: true,
        properties: { scale: '1-10' },
        limit: { hasLimit: true, description: '角色等级不应超过全局力量上限。' }
      },
      {
        id: 'rule:trade-law',
        name: '边境贸易法',
        type: 'world_law',
        exists: true,
        properties: { enforcement: 'faction-led' },
        limit: { hasLimit: false, description: '资源运输必须经过登记港口。' }
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
      tags: ['faction', 'politics'],
      description: '控制边境贸易的主要势力。',
      materialRefs: ['material:origin-note'],
      createdAt: '2026-05-08T00:00:00.000Z'
    },
    {
      id: 'entity:character-lina',
      name: '琳娜·灰港',
      type: 'character',
      attributes: { factionId: 'entity:faction-aurora', level: 6, motivation: '保护灰港自治权' },
      tags: ['character', 'harbor'],
      description: '灰港出身的谈判者，熟悉矿带走私路线。',
      materialRefs: ['material:border-map'],
      createdAt: '2026-05-08T00:00:00.000Z'
    },
    {
      id: 'entity:location-border',
      name: '灰港中转站',
      type: 'location',
      attributes: { locationType: 'harbor', resourceOutput: 'trade access', dangerLevel: 4 },
      tags: ['location', 'harbor'],
      description: '连接矿带与内陆城邦的关键中转站。',
      materialRefs: ['material:border-map'],
      createdAt: '2026-05-08T00:00:00.000Z'
    },
    {
      id: 'entity:resource-ember',
      name: '余烬矿',
      type: 'resource',
      attributes: { scarcity: 9, usage: 'energy', controller: 'entity:faction-aurora' },
      tags: ['resource', 'energy'],
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
    },
    {
      id: 'relation:lina-depends-harbor',
      sourceId: 'entity:character-lina',
      targetId: 'entity:location-border',
      type: 'dependency',
      strength: 6,
      note: '琳娜的政治筹码来自灰港。',
      createdAt: '2026-05-08T00:00:00.000Z'
    }
  ],
  references: [
    {
      id: 'reference:origin-to-faction',
      source: { type: 'entity', id: 'entity:faction-aurora' },
      target: { type: 'material', id: 'material:origin-note' },
      createdAt: '2026-05-08T00:00:00.000Z'
    },
    {
      id: 'reference:map-to-location',
      source: { type: 'entity', id: 'entity:location-border' },
      target: { type: 'material', id: 'material:border-map' },
      createdAt: '2026-05-08T00:00:00.000Z'
    }
  ]
};
