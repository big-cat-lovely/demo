import { useMemo, useState } from 'react';
import { sampleProject } from './domain/project/sampleProject';
import { validateProject } from './domain/constraints/validation';
import type { Entity, EntityType } from './domain/entities/types';
import type { RelationType } from './domain/relations/types';

const modules = ['素材库', '规则', '实体', '关系', '约束'];
const relationTypes: RelationType[] = ['hostile', 'alliance', 'competition', 'control', 'dependency'];

const entityTypeLabels: Record<EntityType, string> = {
  faction: '势力',
  character: '角色',
  location: '地点',
  resource: '资源',
  item: '物品',
  system: '系统'
};

const relationTypeLabels: Record<RelationType, string> = {
  hostile: '敌对',
  alliance: '联盟',
  competition: '竞争',
  control: '控制',
  dependency: '依赖'
};

export function App() {
  const [project, setProject] = useState(sampleProject);
  const [selectedEntityId, setSelectedEntityId] = useState(sampleProject.entities[0]?.id ?? null);
  const [relationDraft, setRelationDraft] = useState({
    sourceId: sampleProject.entities[0]?.id ?? '',
    targetId: sampleProject.entities[1]?.id ?? sampleProject.entities[0]?.id ?? '',
    type: 'control' as RelationType,
    strength: 5,
    note: ''
  });

  const selectedEntity = project.entities.find((entity) => entity.id === selectedEntityId) ?? null;
  const violations = useMemo(() => validateProject(project), [project]);
  const selectedEntityViolations = selectedEntity
    ? violations.filter((violation) => violation.target.id === selectedEntity.id)
    : [];

  function updateEntity(id: string, patch: Partial<Entity>) {
    setProject((current) => ({
      ...current,
      entities: current.entities.map((entity) =>
        entity.id === id ? { ...entity, ...patch, updatedAt: new Date().toISOString() } : entity
      )
    }));
  }

  function updateEntityAttribute(id: string, key: string, value: string | number) {
    setProject((current) => ({
      ...current,
      entities: current.entities.map((entity) =>
        entity.id === id
          ? {
              ...entity,
              attributes: { ...(entity.attributes as Record<string, unknown>), [key]: value },
              updatedAt: new Date().toISOString()
            }
          : entity
      )
    }));
  }

  function createRelation() {
    if (!relationDraft.sourceId || !relationDraft.targetId) {
      return;
    }

    setProject((current) => ({
      ...current,
      relations: [
        ...current.relations,
        {
          id: `relation:${Date.now()}`,
          sourceId: relationDraft.sourceId,
          targetId: relationDraft.targetId,
          type: relationDraft.type,
          strength: relationDraft.strength,
          note: relationDraft.note || undefined,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="模块导航">
        <h1>世界观建模</h1>
        <nav>
          {modules.map((module) => (
            <button key={module} type="button" className={module === '实体' ? 'active' : undefined}>
              {module}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace" aria-label="编辑区">
        <header className="workspace-header">
          <div>
            <p>World Project</p>
            <h2>{project.name}</h2>
          </div>
          <div className="metrics" aria-label="项目统计">
            <span>{project.materials.length} 素材</span>
            <span>{project.rules.coreRules.length} 规则</span>
            <span>{project.entities.length} 实体</span>
            <span>{project.relations.length} 关系</span>
          </div>
        </header>

        <div className="entity-workbench">
          <section className="entity-list" aria-label="实体列表">
            <div className="section-title">
              <span>实体</span>
              <strong>{project.entities.length}</strong>
            </div>
            {project.entities.map((entity) => (
              <button
                key={entity.id}
                type="button"
                className={entity.id === selectedEntityId ? 'entity-row selected' : 'entity-row'}
                onClick={() => setSelectedEntityId(entity.id)}
              >
                <span>{entity.name}</span>
                <small>{entityTypeLabels[entity.type]}</small>
              </button>
            ))}
          </section>

          <section className="editor-panel" aria-label="实体详情编辑">
            {selectedEntity ? (
              <EntityEditor
                entity={selectedEntity}
                violationsCount={selectedEntityViolations.length}
                onChangeEntity={updateEntity}
                onChangeAttribute={updateEntityAttribute}
              />
            ) : (
              <p>选择一个实体开始编辑。</p>
            )}
          </section>
        </div>
      </section>

      <aside className="inspector" aria-label="属性面板">
        <section className="inspector-section">
          <h2>新建关系</h2>
          <label>
            来源
            <select
              value={relationDraft.sourceId}
              onChange={(event) => setRelationDraft((draft) => ({ ...draft, sourceId: event.target.value }))}
            >
              {project.entities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            目标
            <select
              value={relationDraft.targetId}
              onChange={(event) => setRelationDraft((draft) => ({ ...draft, targetId: event.target.value }))}
            >
              {project.entities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            类型
            <select
              value={relationDraft.type}
              onChange={(event) =>
                setRelationDraft((draft) => ({ ...draft, type: event.target.value as RelationType }))
              }
            >
              {relationTypes.map((type) => (
                <option key={type} value={type}>
                  {relationTypeLabels[type]}
                </option>
              ))}
            </select>
          </label>
          <label>
            强度
            <input
              type="number"
              min="1"
              max="10"
              value={relationDraft.strength}
              onChange={(event) =>
                setRelationDraft((draft) => ({ ...draft, strength: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            备注
            <textarea
              value={relationDraft.note}
              onChange={(event) => setRelationDraft((draft) => ({ ...draft, note: event.target.value }))}
            />
          </label>
          <button type="button" className="primary-action" onClick={createRelation}>
            创建关系
          </button>
        </section>

        <section className="inspector-section">
          <h2>一致性</h2>
          <p>{violations.length === 0 ? '当前项目没有结构性冲突。' : `发现 ${violations.length} 个问题。`}</p>
          <div className="violation-list">
            {violations.map((violation) => (
              <div key={violation.id} className="violation-item">
                <strong>{violation.code}</strong>
                <span>{violation.message}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </main>
  );
}

interface EntityEditorProps {
  entity: Entity;
  violationsCount: number;
  onChangeEntity(id: string, patch: Partial<Entity>): void;
  onChangeAttribute(id: string, key: string, value: string | number): void;
}

function EntityEditor({ entity, violationsCount, onChangeEntity, onChangeAttribute }: EntityEditorProps) {
  const attributes = entity.attributes as Record<string, unknown>;
  const numericFields = getEditableNumericFields(entity);
  const textFields = getEditableTextFields(entity);

  return (
    <div className="editor-content">
      <div className="editor-heading">
        <div>
          <span>{entityTypeLabels[entity.type]}</span>
          <h3>{entity.name}</h3>
        </div>
        <strong>{violationsCount === 0 ? '一致' : `${violationsCount} 问题`}</strong>
      </div>

      <label>
        名称
        <input value={entity.name} onChange={(event) => onChangeEntity(entity.id, { name: event.target.value })} />
      </label>

      <label>
        描述
        <textarea
          value={entity.description}
          onChange={(event) => onChangeEntity(entity.id, { description: event.target.value })}
        />
      </label>

      <label>
        标签
        <input
          value={entity.tags.join(', ')}
          onChange={(event) =>
            onChangeEntity(entity.id, {
              tags: event.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
            })
          }
        />
      </label>

      <div className="attribute-grid">
        {numericFields.map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              type="number"
              min="0"
              max="10"
              value={getNumberAttribute(attributes, field.key)}
              onChange={(event) => onChangeAttribute(entity.id, field.key, Number(event.target.value))}
            />
          </label>
        ))}
        {textFields.map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              value={getStringAttribute(attributes, field.key)}
              onChange={(event) => onChangeAttribute(entity.id, field.key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function getEditableNumericFields(entity: Entity) {
  if (entity.type === 'faction') {
    return [
      { key: 'power', label: '势力强度' },
      { key: 'resourceControl', label: '资源控制' }
    ];
  }

  if (entity.type === 'character' || entity.type === 'item') {
    return [{ key: 'level', label: '等级' }];
  }

  if (entity.type === 'resource') {
    return [{ key: 'scarcity', label: '稀缺度' }];
  }

  if (entity.type === 'location') {
    return [{ key: 'dangerLevel', label: '危险等级' }];
  }

  return [];
}

function getEditableTextFields(entity: Entity) {
  if (entity.type === 'faction') {
    return [{ key: 'structure', label: '组织结构' }];
  }

  if (entity.type === 'character') {
    return [{ key: 'motivation', label: '动机' }];
  }

  if (entity.type === 'resource') {
    return [{ key: 'usage', label: '用途' }];
  }

  if (entity.type === 'location') {
    return [
      { key: 'locationType', label: '地点类型' },
      { key: 'resourceOutput', label: '资源产出' }
    ];
  }

  if (entity.type === 'item') {
    return [
      { key: 'origin', label: '来源' },
      { key: 'owner', label: '拥有者' }
    ];
  }

  return [];
}

function getNumberAttribute(attributes: Record<string, unknown>, key: string) {
  return typeof attributes[key] === 'number' ? attributes[key] : 0;
}

function getStringAttribute(attributes: Record<string, unknown>, key: string) {
  return typeof attributes[key] === 'string' ? attributes[key] : '';
}
