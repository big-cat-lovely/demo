import { useMemo, useRef, useState } from 'react';
import { validateProject } from './domain/constraints/validation';
import type { Entity, EntityType } from './domain/entities/types';
import type { MaterialType } from './domain/materials/types';
import type { RelationType } from './domain/relations/types';
import { entityTypes, materialTypes, relationTypes, splitList, useProjectStore } from './state/projectStore';

const moduleLabels = {
  materials: '素材库',
  rules: '规则',
  entities: '实体',
  relations: '关系'
} as const;

const entityTypeLabels: Record<EntityType, string> = {
  faction: '势力',
  character: '角色',
  location: '地点',
  resource: '资源',
  item: '物品',
  system: '系统'
};

const materialTypeLabels: Record<MaterialType, string> = {
  idea: '灵感',
  note: '笔记',
  reference: '参考'
};

const relationTypeLabels: Record<RelationType, string> = {
  hostile: '敌对',
  alliance: '联盟',
  competition: '竞争',
  control: '控制',
  dependency: '依赖'
};

export function App() {
  const store = useProjectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const violations = useMemo(() => validateProject(store.project), [store.project]);
  const tags = useMemo(() => collectTags(store.project), [store.project]);
  const filteredMaterials = filterBySearchAndTag(store.project.materials, store.filters.search, store.filters.tag);
  const filteredEntities = filterEntities(store.project.entities, store.filters.search, store.filters.tag, store.filters.entityType);
  const filteredRelations = filterRelations(store.project.entities, store.project.relations, store.filters.search);

  function exportJson() {
    const blob = new Blob([store.exportCurrentProject()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${store.project.name || 'world-project'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file: File | undefined) {
    if (!file) return;
    try {
      store.importProjectText(await file.text());
      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '导入失败。');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="模块导航">
        <div className="brand-block">
          <span>World Model</span>
          <h1>世界观建模</h1>
        </div>
        <nav>
          {Object.entries(moduleLabels).map(([module, label]) => (
            <button
              key={module}
              type="button"
              className={store.activeModule === module ? 'active' : undefined}
              onClick={() => store.setActiveModule(module as keyof typeof moduleLabels)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace" aria-label="编辑区">
        <header className="project-header">
          <div>
            <label className="project-name-label">
              项目名称
              <input value={store.project.name} onChange={(event) => store.updateProjectMeta({ name: event.target.value })} />
            </label>
            <p>{store.project.description || '一个可本地保存、可导入导出的世界观结构化工程。'}</p>
          </div>
          <div className="project-actions">
            <button type="button" onClick={store.resetProject}>重置示例</button>
            <button type="button" onClick={exportJson}>导出 JSON</button>
            <button type="button" onClick={() => fileInputRef.current?.click()}>导入 JSON</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden-input"
              onChange={(event) => void importJson(event.target.files?.[0])}
            />
          </div>
        </header>

        {(store.notice || importError) && (
          <div className={importError ? 'notice error' : 'notice'}>
            <span>{importError ?? store.notice}</span>
            <button type="button" onClick={() => (importError ? setImportError(null) : store.dismissNotice())}>
              关闭
            </button>
          </div>
        )}

        <div className="overview-strip">
          <Metric label="素材" value={store.project.materials.length} />
          <Metric label="规则" value={store.project.rules.coreRules.length} />
          <Metric label="实体" value={store.project.entities.length} />
          <Metric label="关系" value={store.project.relations.length} />
          <Metric label="问题" value={violations.length} tone={violations.length > 0 ? 'warning' : 'ok'} />
        </div>

        <FilterBar tags={tags} />

        {store.activeModule === 'materials' && <MaterialsWorkspace materials={filteredMaterials} />}
        {store.activeModule === 'rules' && <RulesWorkspace />}
        {store.activeModule === 'entities' && <EntitiesWorkspace entities={filteredEntities} />}
        {store.activeModule === 'relations' && <RelationsWorkspace relations={filteredRelations} />}
      </section>

      <aside className="inspector" aria-label="一致性面板">
        <section className="inspector-section hero-panel">
          <span>Local-first MVP</span>
          <h2>自动保存中</h2>
          <p>所有修改会保存在当前浏览器。本地数据可通过 JSON 导入导出迁移。</p>
        </section>

        <section className="inspector-section">
          <h2>一致性</h2>
          <p>{violations.length === 0 ? '当前项目没有结构性冲突。' : `发现 ${violations.length} 个结构问题。`}</p>
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

function Metric({ label, value, tone }: { label: string; value: number; tone?: 'ok' | 'warning' }) {
  return (
    <article className={tone ? `metric ${tone}` : 'metric'}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function FilterBar({ tags }: { tags: string[] }) {
  const { filters, activeModule, setFilter } = useProjectStore();

  return (
    <section className="filter-bar" aria-label="筛选器">
      <input
        placeholder="搜索名称、内容或备注"
        value={filters.search}
        onChange={(event) => setFilter('search', event.target.value)}
      />
      <select value={filters.tag} onChange={(event) => setFilter('tag', event.target.value)}>
        <option value="">全部标签</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      {activeModule === 'entities' && (
        <select
          value={filters.entityType}
          onChange={(event) => setFilter('entityType', event.target.value as 'all' | EntityType)}
        >
          <option value="all">全部实体</option>
          {entityTypes.map((type) => (
            <option key={type} value={type}>
              {entityTypeLabels[type]}
            </option>
          ))}
        </select>
      )}
    </section>
  );
}

function MaterialsWorkspace({ materials }: { materials: ReturnType<typeof useProjectStore.getState>['project']['materials'] }) {
  const store = useProjectStore();
  const selected = store.project.materials.find((material) => material.id === store.selectedMaterialId) ?? materials[0];

  return (
    <div className="module-grid">
      <ListPanel title="素材库" count={materials.length} actionLabel="新建素材" onAction={store.createMaterial}>
        {materials.map((material) => (
          <button
            key={material.id}
            type="button"
            className={selected?.id === material.id ? 'list-row selected' : 'list-row'}
            onClick={() => store.selectMaterial(material.id)}
          >
            <span>{material.title}</span>
            <small>{materialTypeLabels[material.type]}</small>
          </button>
        ))}
      </ListPanel>

      <section className="editor-panel">
        {selected ? (
          <div className="editor-content">
            <EditorHeading eyebrow={materialTypeLabels[selected.type]} title={selected.title} onDelete={() => store.deleteMaterial(selected.id)} />
            <label>标题<input value={selected.title} onChange={(event) => store.updateMaterial(selected.id, { title: event.target.value })} /></label>
            <label>类型<select value={selected.type} onChange={(event) => store.updateMaterial(selected.id, { type: event.target.value as MaterialType })}>{materialTypes.map((type) => <option key={type} value={type}>{materialTypeLabels[type]}</option>)}</select></label>
            <label>标签<input value={selected.tags.join(', ')} onChange={(event) => store.updateMaterial(selected.id, { tags: splitList(event.target.value) })} /></label>
            <label>来源<input value={selected.source ?? ''} onChange={(event) => store.updateMaterial(selected.id, { source: event.target.value })} /></label>
            <label>内容<textarea value={selected.content} onChange={(event) => store.updateMaterial(selected.id, { content: event.target.value })} /></label>
          </div>
        ) : <EmptyState title="还没有素材" body="创建第一条素材，用来承载灵感、参考资料或设定片段。" />}
      </section>
    </div>
  );
}

function RulesWorkspace() {
  const store = useProjectStore();
  const powerLimit = store.project.rules.globalParams.find((param) => param.key === 'power_limit');

  return (
    <div className="module-grid wide-editor">
      <ListPanel title="核心规则" count={store.project.rules.coreRules.length} actionLabel="新建规则" onAction={store.createCoreRule}>
        {store.project.rules.coreRules.map((rule) => (
          <div key={rule.id} className="rule-card">
            <input value={rule.name} onChange={(event) => store.updateCoreRule(rule.id, { name: event.target.value })} />
            <select value={rule.type} onChange={(event) => store.updateCoreRule(rule.id, { type: event.target.value as 'power_system' | 'world_law' })}>
              <option value="power_system">力量体系</option>
              <option value="world_law">世界法则</option>
            </select>
            <label className="inline-check"><input type="checkbox" checked={rule.exists} onChange={(event) => store.updateCoreRule(rule.id, { exists: event.target.checked })} /> 启用</label>
            <textarea value={rule.limit.description} onChange={(event) => store.updateCoreRule(rule.id, { limit: { ...rule.limit, description: event.target.value } })} />
            <button type="button" onClick={() => store.deleteCoreRule(rule.id)}>删除规则</button>
          </div>
        ))}
      </ListPanel>
      <section className="editor-panel">
        <div className="editor-content">
          <EditorHeading eyebrow="Rule Layer" title="世界规则" />
          <label>世界基调<input value={store.project.rules.tone.join(', ')} onChange={(event) => store.setTone(event.target.value)} /></label>
          <label>角色等级上限<input type="number" min="1" max="99" value={typeof powerLimit?.value === 'number' ? powerLimit.value : 10} onChange={(event) => store.updateGlobalParam('power_limit', { type: 'number', value: Number(event.target.value), min: 1 })} /></label>
          <label>项目描述<textarea value={store.project.description ?? ''} onChange={(event) => store.updateProjectMeta({ description: event.target.value })} /></label>
        </div>
      </section>
    </div>
  );
}

function EntitiesWorkspace({ entities }: { entities: Entity[] }) {
  const store = useProjectStore();
  const selected = store.project.entities.find((entity) => entity.id === store.selectedEntityId) ?? entities[0];

  return (
    <div className="module-grid">
      <ListPanel title="实体" count={entities.length} actionLabel="新建实体" onAction={() => store.createEntity('character')}>
        {entities.map((entity) => (
          <button key={entity.id} type="button" className={selected?.id === entity.id ? 'list-row selected' : 'list-row'} onClick={() => store.selectEntity(entity.id)}>
            <span>{entity.name}</span>
            <small>{entityTypeLabels[entity.type]}</small>
          </button>
        ))}
      </ListPanel>
      <section className="editor-panel">
        {selected ? <EntityEditor entity={selected} /> : <EmptyState title="还没有实体" body="创建角色、地点、资源或势力，世界结构会从这里生长出来。" />}
      </section>
    </div>
  );
}

function EntityEditor({ entity }: { entity: Entity }) {
  const store = useProjectStore();
  const attributes = entity.attributes as Record<string, unknown>;

  return (
    <div className="editor-content">
      <EditorHeading eyebrow={entityTypeLabels[entity.type]} title={entity.name} onDelete={() => store.deleteEntity(entity.id)} />
      <label>名称<input value={entity.name} onChange={(event) => store.updateEntity(entity.id, { name: event.target.value })} /></label>
      <label>类型<select value={entity.type} onChange={(event) => store.updateEntity(entity.id, { type: event.target.value as EntityType })}>{entityTypes.map((type) => <option key={type} value={type}>{entityTypeLabels[type]}</option>)}</select></label>
      <label>描述<textarea value={entity.description} onChange={(event) => store.updateEntity(entity.id, { description: event.target.value })} /></label>
      <label>标签<input value={entity.tags.join(', ')} onChange={(event) => store.updateEntity(entity.id, { tags: splitList(event.target.value) })} /></label>
      <div className="attribute-grid">
        {getEditableFields(entity).map((field) => (
          <label key={field.key}>{field.label}<input type={field.kind === 'number' ? 'number' : 'text'} value={String(attributes[field.key] ?? '')} onChange={(event) => store.updateEntityAttribute(entity.id, field.key, field.kind === 'number' ? Number(event.target.value) : event.target.value)} /></label>
        ))}
      </div>
      <section className="reference-picker">
        <h3>素材引用</h3>
        {store.project.materials.map((material) => (
          <label key={material.id} className="inline-check"><input type="checkbox" checked={entity.materialRefs.includes(material.id)} onChange={() => store.toggleEntityMaterialRef(entity.id, material.id)} /> {material.title}</label>
        ))}
      </section>
    </div>
  );
}

function RelationsWorkspace({ relations }: { relations: ReturnType<typeof useProjectStore.getState>['project']['relations'] }) {
  const store = useProjectStore();
  const selected = store.project.relations.find((relation) => relation.id === store.selectedRelationId) ?? relations[0];

  return (
    <div className="module-grid">
      <ListPanel title="关系" count={relations.length} actionLabel="新建关系" onAction={store.createRelation}>
        {relations.map((relation) => (
          <button key={relation.id} type="button" className={selected?.id === relation.id ? 'list-row selected' : 'list-row'} onClick={() => store.selectRelation(relation.id)}>
            <span>{entityName(store.project.entities, relation.sourceId)} → {entityName(store.project.entities, relation.targetId)}</span>
            <small>{relationTypeLabels[relation.type]} / {relation.strength}</small>
          </button>
        ))}
      </ListPanel>
      <section className="editor-panel">
        {selected ? <RelationEditor relation={selected} /> : <EmptyState title="还没有关系" body="创建实体之间的控制、依赖、竞争或联盟关系。" />}
      </section>
    </div>
  );
}

function RelationEditor({ relation }: { relation: ReturnType<typeof useProjectStore.getState>['project']['relations'][number] }) {
  const store = useProjectStore();

  return (
    <div className="editor-content">
      <EditorHeading eyebrow={relationTypeLabels[relation.type]} title="关系详情" onDelete={() => store.deleteRelation(relation.id)} />
      <label>来源<select value={relation.sourceId} onChange={(event) => store.updateRelation(relation.id, { sourceId: event.target.value })}>{store.project.entities.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)}</select></label>
      <label>目标<select value={relation.targetId} onChange={(event) => store.updateRelation(relation.id, { targetId: event.target.value })}>{store.project.entities.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)}</select></label>
      <label>类型<select value={relation.type} onChange={(event) => store.updateRelation(relation.id, { type: event.target.value as RelationType })}>{relationTypes.map((type) => <option key={type} value={type}>{relationTypeLabels[type]}</option>)}</select></label>
      <label>强度<input type="number" min="1" max="10" value={relation.strength} onChange={(event) => store.updateRelation(relation.id, { strength: Number(event.target.value) })} /></label>
      <label>备注<textarea value={relation.note ?? ''} onChange={(event) => store.updateRelation(relation.id, { note: event.target.value })} /></label>
    </div>
  );
}

function ListPanel({ title, count, actionLabel, onAction, children }: { title: string; count: number; actionLabel: string; onAction(): void; children: React.ReactNode }) {
  return (
    <section className="list-panel">
      <div className="section-title"><div><span>{title}</span><strong>{count}</strong></div><button type="button" onClick={onAction}>{actionLabel}</button></div>
      <div className="list-body">{count === 0 ? <EmptyState title="暂无内容" body="点击上方按钮开始创建。" /> : children}</div>
    </section>
  );
}

function EditorHeading({ eyebrow, title, onDelete }: { eyebrow: string; title: string; onDelete?: () => void }) {
  return (
    <div className="editor-heading"><div><span>{eyebrow}</span><h2>{title}</h2></div>{onDelete && <button type="button" className="danger-action" onClick={onDelete}>删除</button>}</div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><strong>{title}</strong><p>{body}</p></div>;
}

function getEditableFields(entity: Entity) {
  if (entity.type === 'faction') return [{ key: 'power', label: '势力强度', kind: 'number' }, { key: 'resourceControl', label: '资源控制', kind: 'number' }, { key: 'structure', label: '组织结构', kind: 'text' }] as const;
  if (entity.type === 'character') return [{ key: 'level', label: '等级', kind: 'number' }, { key: 'motivation', label: '动机', kind: 'text' }] as const;
  if (entity.type === 'location') return [{ key: 'locationType', label: '地点类型', kind: 'text' }, { key: 'resourceOutput', label: '资源产出', kind: 'text' }, { key: 'dangerLevel', label: '危险等级', kind: 'number' }] as const;
  if (entity.type === 'resource') return [{ key: 'scarcity', label: '稀缺度', kind: 'number' }, { key: 'usage', label: '用途', kind: 'text' }, { key: 'controller', label: '控制者', kind: 'text' }] as const;
  if (entity.type === 'item') return [{ key: 'level', label: '等级', kind: 'number' }, { key: 'origin', label: '来源', kind: 'text' }, { key: 'owner', label: '拥有者', kind: 'text' }] as const;
  return [{ key: 'summary', label: '摘要', kind: 'text' }] as const;
}

function collectTags(project: ReturnType<typeof useProjectStore.getState>['project']) {
  return [...new Set([...project.materials.flatMap((item) => item.tags), ...project.entities.flatMap((item) => item.tags)])].sort();
}

function filterBySearchAndTag<T extends { title?: string; name?: string; content?: string; tags: string[] }>(items: T[], search: string, tag: string) {
  const needle = search.trim().toLowerCase();
  return items.filter((item) => {
    const haystack = `${item.title ?? ''} ${item.name ?? ''} ${item.content ?? ''}`.toLowerCase();
    return (!needle || haystack.includes(needle)) && (!tag || item.tags.includes(tag));
  });
}

function filterEntities(entities: Entity[], search: string, tag: string, type: 'all' | EntityType) {
  return filterBySearchAndTag(entities, search, tag).filter((entity) => type === 'all' || entity.type === type);
}

function filterRelations(entities: Entity[], relations: ReturnType<typeof useProjectStore.getState>['project']['relations'], search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return relations;
  return relations.filter((relation) => `${entityName(entities, relation.sourceId)} ${entityName(entities, relation.targetId)} ${relation.note ?? ''}`.toLowerCase().includes(needle));
}

function entityName(entities: Entity[], id: string) {
  return entities.find((entity) => entity.id === id)?.name ?? '缺失实体';
}
