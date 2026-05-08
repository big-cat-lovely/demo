import { create } from 'zustand';
import type { Material } from './types';

export interface MaterialState {
  materials: Material[];
  selectedMaterialId: string | null;
  setMaterials(materials: Material[]): void;
  selectMaterial(id: string | null): void;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: [],
  selectedMaterialId: null,
  setMaterials: (materials) => set({ materials }),
  selectMaterial: (selectedMaterialId) => set({ selectedMaterialId })
}));
