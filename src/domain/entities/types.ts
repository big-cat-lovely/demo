export type EntityType = 'faction' | 'character' | 'location' | 'resource' | 'item' | 'system';

export interface FactionAttributes {
  power: number;
  resourceControl: number;
  structure: string;
  locations: string[];
}

export interface CharacterAttributes {
  factionId?: string;
  level: number;
  motivation: string;
}

export interface LocationAttributes {
  locationType: string;
  resourceOutput: string;
  dangerLevel: number;
}

export interface ResourceAttributes {
  scarcity: number;
  usage: string;
  controller?: string;
}

export interface ItemAttributes {
  level: number;
  origin: string;
  owner?: string;
}

export type EntityAttributes =
  | FactionAttributes
  | CharacterAttributes
  | LocationAttributes
  | ResourceAttributes
  | ItemAttributes
  | Record<string, unknown>;

export interface Entity<TAttributes extends EntityAttributes = EntityAttributes> {
  id: string;
  name: string;
  type: EntityType;
  attributes: TAttributes;
  tags: string[];
  description: string;
  materialRefs: string[];
  createdAt: string;
  updatedAt?: string;
}

export function isCharacterEntity(entity: Entity): entity is Entity<CharacterAttributes> {
  return entity.type === 'character';
}
