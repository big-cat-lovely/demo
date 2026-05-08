import { sampleProject } from './domain/project/sampleProject';
import { validateProject } from './domain/constraints/validation';

const modules = ['素材库', '规则', '实体', '关系', '约束'];

export function App() {
  const violations = validateProject(sampleProject);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="模块导航">
        <h1>世界观建模</h1>
        <nav>
          {modules.map((module) => (
            <button key={module} type="button">
              {module}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace" aria-label="编辑区">
        <header>
          <p>World Project</p>
          <h2>{sampleProject.name}</h2>
        </header>
        <div className="grid">
          <article>
            <span>素材</span>
            <strong>{sampleProject.materials.length}</strong>
          </article>
          <article>
            <span>规则</span>
            <strong>{sampleProject.rules.coreRules.length}</strong>
          </article>
          <article>
            <span>实体</span>
            <strong>{sampleProject.entities.length}</strong>
          </article>
          <article>
            <span>关系</span>
            <strong>{sampleProject.relations.length}</strong>
          </article>
        </div>
      </section>

      <aside className="inspector" aria-label="属性面板">
        <h2>一致性</h2>
        <p>{violations.length === 0 ? '当前示例项目没有结构性冲突。' : `发现 ${violations.length} 个问题。`}</p>
      </aside>
    </main>
  );
}
