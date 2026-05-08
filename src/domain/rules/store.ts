import { create } from 'zustand';
import type { RuleModule } from './types';

export interface RuleState {
  rules: RuleModule;
  setRules(rules: RuleModule): void;
}

export const emptyRuleModule: RuleModule = {
  tone: [],
  coreRules: [],
  globalParams: []
};

export const useRuleStore = create<RuleState>((set) => ({
  rules: emptyRuleModule,
  setRules: (rules) => set({ rules })
}));
