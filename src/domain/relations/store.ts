import { create } from 'zustand';
import type { Relation } from './types';

export interface RelationState {
  relations: Relation[];
  selectedRelationId: string | null;
  setRelations(relations: Relation[]): void;
  selectRelation(id: string | null): void;
}

export const useRelationStore = create<RelationState>((set) => ({
  relations: [],
  selectedRelationId: null,
  setRelations: (relations) => set({ relations }),
  selectRelation: (selectedRelationId) => set({ selectedRelationId })
}));
