import { create } from 'zustand';
import type { Entity, EntityType } from '../domain/entities/types';
import type { Material, MaterialType } from '../domain/materials/types';
import { clearSavedProject, cloneProject, exportProject, importProject, loadProject, saveProject } from '../domain/project/storage';
import { sampleProject } from '../domain/project/sampleProject';
import type { WorldProject } from '../domain/project/types';
import type { Reference } from '../domain/references/types';
import type { Relation, RelationType } from '../domain/relations/types';
import type { CoreRule, GlobalParam, RuleModule } from '../domain/rules/types';

export type ModuleId = 'materials' | 'rules' | 'entities' | 'relations';

interface ProjectFilters {
  search: string;
  tag: string;
  entityType: 'all' | EntityType;
}

interface ProjectState {
  project: WorldProject;
  activeModule: ModuleId;
  selectedMaterialId: string | null;
  selectedEntityId: string | null;
  selectedRelationId: string | null;
  filters: ProjectFilters;
  notice: string | null;
  setActiveModule(module: ModuleId): void;
  setFilter<K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]): void;
  selectMaterial(id: string | null): void;
  selectEntity(id: string | null): void;
  selectRelation(id: string | null): void;
  updateProjectMeta(patch: Pick<Partial<WorldProject>, 'name' | 'description'>): void;
  createMaterial(): void;
  updateMaterial(id: string, patch: Partial<Material>): void;
  deleteMaterial(id: string): void;
  setTone(value: string): void;
  createCoreRule(): void;
  updateCoreRule(id: string, patch: Partial<CoreRule>): void;
  deleteCoreRule(id: string): void;
  updateGlobalParam(key: string, patch: Partial<GlobalParam>): void;
  createEntity(type?: EntityType): void;
  updateEntity(id: string, patch: Partial<Entity>): void;
  updateEntityAttribute(id: string, key: string, value: string | number): void;
  toggleEntityMaterialRef(entityId: string, materialId: string): void;
  deleteEntity(id: string): void;
  createRelation(): void;
  updateRelation(id: string, patch: Partial<Relation>): void;
  deleteRelation(id: string): void;
  resetProject(): void;
  exportCurrentProject(): string;
  importProjectText(json: string): void;
  dismissNotice(): void;
}

const now = () => new Date().toISOString();

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: loadProject(),
  activeModule: 'materials',
  selectedMaterialId: null,
  selectedEntityId: null,
  selectedRelationId: null,
  filters: { search: '', tag: '', entityType: 'all' },
  notice: null,

  setActiveModule: (activeModule) => set({ activeModule }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  selectMaterial: (selectedMaterialId) => set({ selectedMaterialId }),
  selectEntity: (selectedEntityId) => set({ selectedEntityId }),
  selectRelation: (selectedRelationId) => set({ selectedRelationId }),

  updateProjectMeta: (patch) => commit(set, get, (project) => ({ ...project, ...patch })),

  createMaterial: () => {
    const material: Material = {
      id: createId('material'),
      title: '新素材',
      content: '',
      tags: [],
      type: 'idea',
      createdAt: now()
    };
    commit(set, get, (project) => ({ ...project, materials: [...project.materials, material] }));
    set({ selectedMaterialId: material.id, activeModule: 'materials' });
  },

  updateMaterial: (id, patch) =>
    commit(set, get, (project) => ({
      ...project,
      materials: project.materials.map((material) =>
        material.id === id ? { ...material, ...patch, updatedAt: now() } : material
      )
    })),

  deleteMaterial: (id) =>
    commit(set, get, (project) => ({ ...project, materials: project.materials.filter((material) => material.id !== id) })),

  setTone: (value) =>
    commit(set, get, (project) => ({
      ...project,
      rules: { ...project.rules, tone: splitList(value) }
    })),

  createCoreRule: () => {
    const rule: CoreRule = {
      id: createId('rule'),
      name: '新规则',
      type: 'world_law',
      exists: true,
      properties: {},
      limit: { hasLimit: false, description: '' }
    };
    commit(set, get, (project) => ({
      ...project,
      rules: { ...project.rules, coreRules: [...project.rules.coreRules, rule] }
    }));
  },

  updateCoreRule: (id, patch) =>
    commit(set, get, (project) => ({
      ...project,
      rules: {
        ...project.rules,
        coreRules: project.rules.coreRules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule))
      }
    })),

  deleteCoreRule: (id) =>
    commit(set, get, (project) => ({
      ...project,
      rules: { ...project.rules, coreRules: project.rules.coreRules.filter((rule) => rule.id !== id) }
    })),

  updateGlobalParam: (key, patch) =>
    commit(set, get, (project) => ({
      ...project,
      rules: updateGlobalParam(project.rules, key, patch)
    })),

  createEntity: (type = 'character') => {
    const entity: Entity = {
      id: createId('entity'),
      name: '新实体',
      type,
      attributes: defaultAttributes(type),
      tags: [],
      description: '',
      materialRefs: [],
      createdAt: now()
    };
    commit(set, get, (project) => ({ ...project, entities: [...project.entities, entity] }));
    set({ selectedEntityId: entity.id, activeModule: 'entities' });
  },

  updateEntity: (id, patch) =>
    commit(set, get, (project) => ({
      ...project,
      entities: project.entities.map((entity) =>
        entity.id === id
          ? { ...entity, ...patch, attributes: patch.type ? defaultAttributes(patch.type) : entity.attributes, updatedAt: now() }
          : entity
      )
    })),

  updateEntityAttribute: (id, key, value) =>
    commit(set, get, (project) => ({
      ...project,
      entities: project.entities.map((entity) =>
        entity.id === id
          ? { ...entity, attributes: { ...(entity.attributes as Record<string, unknown>), [key]: value }, updatedAt: now() }
          : entity
      )
    })),

  toggleEntityMaterialRef: (entityId, materialId) =>
    commit(set, get, (project) => ({
      ...project,
      entities: project.entities.map((entity) => {
        if (entity.id !== entityId) return entity;
        const materialRefs = entity.materialRefs.includes(materialId)
          ? entity.materialRefs.filter((id) => id !== materialId)
          : [...entity.materialRefs, materialId];
        return { ...entity, materialRefs, updatedAt: now() };
      })
    })),

  deleteEntity: (id) =>
    commit(set, get, (project) => ({ ...project, entities: project.entities.filter((entity) => entity.id !== id) })),

  createRelation: () => {
    const { project } = get();
    const source = project.entities[0]?.id ?? '';
    const target = project.entities[1]?.id ?? source;
    const relation: Relation = {
      id: createId('relation'),
      sourceId: source,
      targetId: target,
      type: 'dependency',
      strength: 5,
      createdAt: now()
    };
    commit(set, get, (current) => ({ ...current, relations: [...current.relations, relation] }));
    set({ selectedRelationId: relation.id, activeModule: 'relations' });
  },

  updateRelation: (id, patch) =>
    commit(set, get, (project) => ({
      ...project,
      relations: project.relations.map((relation) =>
        relation.id === id ? { ...relation, ...patch, updatedAt: now() } : relation
      )
    })),

  deleteRelation: (id) =>
    commit(set, get, (project) => ({ ...project, relations: project.relations.filter((relation) => relation.id !== id) })),

  resetProject: () => {
    clearSavedProject();
    const project = cloneProject(sampleProject);
    saveProject(project);
    set({ project, selectedMaterialId: null, selectedEntityId: null, selectedRelationId: null, notice: '已重置为示例项目。' });
  },

  exportCurrentProject: () => exportProject(get().project),

  importProjectText: (json) => {
    const project = importProject(json);
    saveProject(project);
    set({ project, selectedMaterialId: null, selectedEntityId: null, selectedRelationId: null, notice: '项目已导入。' });
  },

  dismissNotice: () => set({ notice: null })
}));

function commit(
  set: (partial: ProjectState | Partial<ProjectState> | ((state: ProjectState) => ProjectState | Partial<ProjectState>)) => void,
  get: () => ProjectState,
  updater: (project: WorldProject) => WorldProject
) {
  const project = { ...updater(get().project), updatedAt: now() };
  saveProject(project);
  set({ project });
}

function createId(prefix: 'material' | 'entity' | 'relation' | 'rule' | 'reference') {
  return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
}

function updateGlobalParam(rules: RuleModule, key: string, patch: Partial<GlobalParam>): RuleModule {
  const existing = rules.globalParams.some((param) => param.key === key);
  const nextParam: GlobalParam = { key, type: 'number', value: 10, ...patch };

  return {
    ...rules,
    globalParams: existing
      ? rules.globalParams.map((param) => (param.key === key ? { ...param, ...patch } : param))
      : [...rules.globalParams, nextParam]
  };
}

export function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createReference(source: Reference['source'], target: Reference['target']): Reference {
  return { id: createId('reference'), source, target, createdAt: now() };
}

export const materialTypes: MaterialType[] = ['idea', 'note', 'reference'];
export const entityTypes: EntityType[] = ['faction', 'character', 'location', 'resource', 'item', 'system'];
export const relationTypes: RelationType[] = ['hostile', 'alliance', 'competition', 'control', 'dependency'];

export function defaultAttributes(type: EntityType): Record<string, unknown> {
  if (type === 'faction') return { power: 5, resourceControl: 5, structure: '', locations: [] };
  if (type === 'character') return { factionId: '', level: 1, motivation: '' };
  if (type === 'location') return { locationType: '', resourceOutput: '', dangerLevel: 1 };
  if (type === 'resource') return { scarcity: 5, usage: '', controller: '' };
  if (type === 'item') return { level: 1, origin: '', owner: '' };
  return { summary: '' };
}
