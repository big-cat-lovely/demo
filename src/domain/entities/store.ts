import { create } from 'zustand';
import type { Entity } from './types';

export interface EntityState {
  entities: Entity[];
  selectedEntityId: string | null;
  setEntities(entities: Entity[]): void;
  selectEntity(id: string | null): void;
}

export const useEntityStore = create<EntityState>((set) => ({
  entities: [],
  selectedEntityId: null,
  setEntities: (entities) => set({ entities }),
  selectEntity: (selectedEntityId) => set({ selectedEntityId })
}));
