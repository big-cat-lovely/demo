import type { ReferenceTargetType } from '../references/types';

export type ConstraintSeverity = 'info' | 'warning' | 'error';

export interface ConstraintTarget {
  type: ReferenceTargetType | 'relation' | 'project';
  id: string;
}

export interface ConstraintViolation {
  id: string;
  severity: ConstraintSeverity;
  code: string;
  message: string;
  target: ConstraintTarget;
}
