# 世界观建模工具

这是一个单机优先的世界观建模工具。项目目标不是 AI 生成文本，也不是普通笔记软件，而是把素材、规则、实体、关系、引用和约束组织成可验证的结构化世界模型。

## 当前状态

当前版本是浏览器单机 Web MVP，提供完整的基础闭环：

- React + TypeScript + Vite 工程基础
- Zustand 统一项目状态
- 浏览器本地自动保存
- JSON 导入 / 导出
- 素材库 CRUD、标签筛选和搜索
- 规则编辑、核心规则管理和 `power_limit` 全局参数
- 实体 CRUD、类型切换、属性编辑和素材引用
- 关系 CRUD、关系类型、强度和备注
- 一致性面板：关系约束、角色等级上限、缺失引用提示
- GitHub Actions CI，用于类型检查和测试

暂未包含 Tauri、SQLite、桌面安装包、图谱可视化、推演系统或云同步。

## 系统结构

```text
src/
├── App.tsx                 # Web MVP 主工作台
├── main.tsx
├── styles.css
├── state/
│   └── projectStore.ts     # 统一项目状态和 CRUD 动作
├── domain/
│   ├── materials/          # 素材库模型
│   ├── rules/              # 世界规则模型
│   ├── entities/           # 实体模型
│   ├── relations/          # 关系模型和关系约束
│   ├── references/         # 引用模型
│   ├── constraints/        # 一致性校验
│   └── project/            # 项目聚合、示例数据、本地存储
└── tests/                  # 核心约束、存储和 UI 行为测试
```

## 开发命令

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```

## 现在可以体验什么

1. 在左侧切换素材、规则、实体、关系模块。
2. 创建、编辑、删除素材，并用搜索和标签筛选。
3. 编辑世界基调、核心规则和角色等级上限。
4. 创建实体、切换实体类型、编辑属性并勾选素材引用。
5. 创建和编辑实体关系。
6. 删除被引用的素材或创建非法控制关系后，在右侧一致性面板查看问题。
7. 使用导入 / 导出 JSON 迁移项目数据。

## MVP 边界

MVP 聚焦浏览器内可用的单机建模流程。后续如果继续扩展，建议优先做图谱视图、SQLite/Tauri 桌面持久化，以及更完整的规则引擎。
