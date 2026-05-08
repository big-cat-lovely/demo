export type ReferenceTargetType = 'entity' | 'material' | 'rule';

export interface ReferenceAnchor {
  type: ReferenceTargetType;
  id: string;
}

export interface Reference {
  id: string;
  source: ReferenceAnchor;
  target: ReferenceAnchor;
  note?: string;
  createdAt: string;
}
