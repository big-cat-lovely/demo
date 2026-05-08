export type RelationType = 'hostile' | 'alliance' | 'competition' | 'control' | 'dependency';

export interface Relation {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  strength: number;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}
