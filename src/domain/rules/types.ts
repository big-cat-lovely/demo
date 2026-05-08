export type CoreRuleType = 'power_system' | 'world_law';
export type GlobalParamType = 'number' | 'string';

export interface CoreRuleLimit {
  hasLimit: boolean;
  description: string;
}

export interface CoreRule {
  id: string;
  name: string;
  type: CoreRuleType;
  exists: boolean;
  properties: Record<string, unknown>;
  limit: CoreRuleLimit;
}

export interface GlobalParam<T = unknown> {
  key: string;
  type: GlobalParamType;
  min?: number;
  max?: number;
  value: T;
}

export interface RuleModule {
  tone: string[];
  coreRules: CoreRule[];
  globalParams: GlobalParam[];
}
