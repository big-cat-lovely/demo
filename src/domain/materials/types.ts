export type MaterialType = 'note' | 'reference' | 'idea';

export interface Material {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: MaterialType;
  source?: string;
  createdAt: string;
  updatedAt?: string;
}
