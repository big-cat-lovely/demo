import type { RuleModule } from './types';

export interface RuleRepository {
  load(projectId: string): Promise<RuleModule>;
  save(projectId: string, rules: RuleModule): Promise<RuleModule>;
}
