# 世界观建模工具（单机版）设计文档（适用于 AI 编程工具开发）

## 0. 项目概述

本项目是一个**单机世界观建模工具（Worldbuilding Modeling Tool）**，用于帮助作者将零散设定转化为结构化世界模型。

### 核心定位
- 非AI生成工具
- 非文本记录工具
- 是：结构化设定系统 + 约束系统 + 引用系统

### MVP目标
用户可以在30分钟内完成：
- 导入素材
- 构建基础世界规则
- 创建核心实体
- 建立实体关系

---

## 1. 系统架构

```
App
├── 素材库模块（Material Library）
├── 世界观工程（World Project）
│   ├── 规则模块（Rule Layer）
│   ├── 实体模块（Entity Layer）
│   ├── 关系模块（Relation Layer）
│   └── 约束与引用系统（Constraint Layer）
```

---

## 2. 数据存储设计

### 2.1 存储方式
- 本地 SQLite（推荐）
- 或 JSON 文件（初期）

---

## 3. 素材库模块

### 3.1 数据结构

```json
Material {
  id: string,
  title: string,
  content: string,
  tags: string[],
  type: "note" | "reference" | "idea",
  source?: string,
  created_at: timestamp
}
```

### 3.2 功能
- 创建 / 编辑 / 删除
- 标签筛选
- 引用到其他模块

---

## 4. 规则模块（Rule Layer）

### 4.1 数据结构

```json
RuleModule {
  tone: string[],
  core_rules: CoreRule[],
  global_params: GlobalParam[]
}
```

### 4.2 CoreRule

```json
CoreRule {
  id: string,
  name: string,
  type: "power_system" | "world_law",
  exists: boolean,
  properties: Record<string, any>,
  limit: {
    has_limit: boolean,
    description: string
  }
}
```

### 4.3 GlobalParam

```json
GlobalParam {
  key: string,
  type: "number" | "string",
  min?: number,
  max?: number,
  value: any
}
```

---

## 5. 实体模块（Entity Layer）

### 5.1 通用结构

```json
Entity {
  id: string,
  name: string,
  type: "faction" | "character" | "location" | "resource" | "item" | "system",
  attributes: Record<string, any>,
  tags: string[],
  description: string,
  material_refs: string[]
}
```

---

### 5.2 各类型字段约束

#### Faction
```json
{
  power: number,
  resource_control: number,
  structure: string,
  locations: string[]
}
```

#### Character
```json
{
  faction_id: string,
  level: number,
  motivation: string
}
```

#### Location
```json
{
  type: string,
  resource_output: string,
  danger_level: number
}
```

#### Resource
```json
{
  scarcity: number,
  usage: string,
  controller: string
}
```

#### Item
```json
{
  level: number,
  origin: string,
  owner: string
}
```

---

## 6. 关系模块（Relation Layer）

### 6.1 数据结构

```json
Relation {
  id: string,
  source_id: string,
  target_id: string,
  type: string,
  strength: number,
  note?: string
}
```

---

### 6.2 预设关系类型

```
敌对
联盟
竞争
控制
依赖
```

---

### 6.3 关系约束规则

示例：
- 控制关系：仅允许 Faction → Resource / Location

---

## 7. 约束与引用系统

### 7.1 引用系统

```json
Reference {
  ref_type: "entity" | "material" | "rule",
  ref_id: string
}
```

---

### 7.2 约束规则示例

```text
if global.power_limit = 10
then character.level <= 10
```

---

## 8. UI结构

### 8.1 主界面

```
左侧：模块导航
中间：编辑区
右侧：属性面板
```

---

### 8.2 页面划分

- 素材库页
- 世界规则页
- 实体管理页
- 关系管理页

---

## 9. 核心交互流程

1. 创建项目
2. 导入素材
3. 设置规则
4. 创建实体
5. 建立关系

---

## 10. MVP范围（必须实现）

- 素材库 CRUD
- 实体 CRUD
- 关系 CRUD
- 基础规则模块
- 引用功能

---

## 11. 非MVP（后续）

- 推演系统
- 图谱可视化
- 规则引擎

---

## 12. 技术建议

- 前端：React + Zustand
- 桌面：Tauri
- 数据：SQLite

---

## 13. 开发优先级

1. 数据模型
2. 实体系统
3. 关系系统
4. 素材系统
5. 规则模块

---

## 14. 成功标准

- 用户可在30分钟内完成一个世界结构
- 所有数据可互相关联
- 无结构性混乱

---

（文档结束）

