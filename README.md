# 世界观建模工具

这是一个单机优先的世界观建模工具骨架。项目目标不是 AI 生成文本，也不是普通笔记软件，而是把素材、规则、实体、关系、引用和约束组织成可验证的结构化世界模型。

## 当前状态

当前版本是架构骨架，不包含完整 CRUD UI、SQLite 接入或 Tauri 后端。它提供：

- React + TypeScript + Vite 工程基础
- Zustand 预备状态层
- 领域模型类型定义
- 仓储接口，不绑定具体存储
- 关系、规则和引用的基础校验入口
- 最小单元测试，保护核心约束

## 系统结构

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── domain/
│   ├── materials/      # 素材库模块
│   ├── rules/          # 世界规则模块
│   ├── entities/       # 实体模块
│   ├── relations/      # 关系模块
│   ├── references/     # 引用模型
│   ├── constraints/    # 一致性校验
│   └── project/        # 世界观工程聚合
└── tests/              # 核心约束测试
```

## 开发命令

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```

## 开发顺序建议

1. 完成领域模型和仓储实现。
2. 实现实体列表、详情和编辑流程。
3. 实现关系创建和关系约束提示。
4. 实现素材库和引用选择器。
5. 接入规则模块，并把约束结果展示到 UI。
6. 后续再接 SQLite 和 Tauri，不在当前骨架中提前绑定。

## MVP 边界

MVP 应聚焦素材、实体、关系、规则和引用的基础管理。图谱可视化、推演系统、复杂规则引擎、多人协作和云同步都属于后续阶段。
