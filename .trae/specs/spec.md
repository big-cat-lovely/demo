# 世界观建模工具 - 产品需求文档

## Overview
- **Summary**: 一个单机版的世界观建模工具，用于帮助作者将零散设定转化为结构化世界模型，包含素材库、规则模块、实体模块、关系模块和约束与引用系统。
- **Purpose**: 解决作者在构建世界观时的结构化管理问题，提供一个系统来组织和关联各种设定元素。
- **Target Users**: 作家、游戏设计师、创意工作者等需要构建复杂世界观的用户。

## Goals
- 提供结构化的设定系统，帮助用户组织世界观元素
- 实现约束系统，确保设定的一致性
- 建立引用系统，方便元素间的关联
- 支持用户在30分钟内完成基础世界结构的搭建

## Non-Goals (Out of Scope)
- 不提供AI生成功能
- 不单纯作为文本记录工具
- 不包含推演系统
- 不包含图谱可视化
- 不包含复杂的规则引擎

## Background & Context
- 传统的世界观构建通常使用文本编辑器或笔记软件，缺乏结构化管理
- 复杂的世界观需要一个系统来管理各种元素之间的关系和约束
- 本工具旨在提供一个轻量级但功能完整的解决方案，帮助用户快速构建和管理世界观

## Functional Requirements
- **FR-1**: 素材库模块 - 支持素材的创建、编辑、删除和标签筛选
- **FR-2**: 规则模块 - 支持核心规则和全局参数的管理
- **FR-3**: 实体模块 - 支持不同类型实体的创建、编辑和管理
- **FR-4**: 关系模块 - 支持实体间关系的创建、编辑和管理
- **FR-5**: 约束与引用系统 - 支持元素间的引用和基本约束规则

## Non-Functional Requirements
- **NFR-1**: 性能 - 操作响应时间不超过1秒
- **NFR-2**: 可用性 - 界面直观，操作简单，新用户可在10分钟内上手
- **NFR-3**: 数据持久化 - 支持本地数据存储（SQLite或JSON）
- **NFR-4**: 可扩展性 - 架构设计应支持后续功能的扩展

## Constraints
- **Technical**: 前端使用React + Zustand，桌面端使用Tauri，数据存储使用SQLite
- **Business**: 作为MVP版本，优先实现核心功能
- **Dependencies**: 依赖React、Zustand、Tauri和SQLite

## Assumptions
- 用户具有基本的计算机操作能力
- 用户了解世界观构建的基本概念
- 本地存储足够安全，不需要复杂的加密措施

## Acceptance Criteria

### AC-1: 素材库功能
- **Given**: 用户打开素材库页面
- **When**: 用户创建新素材并添加标签
- **Then**: 素材被成功保存，并且可以通过标签筛选
- **Verification**: `programmatic`
- **Notes**: 素材类型包括note、reference和idea

### AC-2: 规则模块功能
- **Given**: 用户打开世界规则页面
- **When**: 用户添加核心规则和全局参数
- **Then**: 规则和参数被成功保存，并且可以在其他模块中引用
- **Verification**: `programmatic`

### AC-3: 实体管理功能
- **Given**: 用户打开实体管理页面
- **When**: 用户创建不同类型的实体并设置属性
- **Then**: 实体被成功保存，并且属性符合类型约束
- **Verification**: `programmatic`
- **Notes**: 支持的实体类型包括faction、character、location、resource、item和system

### AC-4: 关系管理功能
- **Given**: 用户打开关系管理页面
- **When**: 用户在实体间创建关系并设置强度
- **Then**: 关系被成功保存，并且符合关系约束规则
- **Verification**: `programmatic`
- **Notes**: 预设关系类型包括敌对、联盟、竞争、控制和依赖

### AC-5: 引用功能
- **Given**: 用户在编辑实体或规则时
- **When**: 用户引用其他素材、实体或规则
- **Then**: 引用被成功保存，并且可以通过引用导航到相关元素
- **Verification**: `programmatic`

### AC-6: 整体使用体验
- **Given**: 用户从创建项目开始
- **When**: 用户按照核心交互流程操作
- **Then**: 用户可以在30分钟内完成一个基础世界结构的搭建
- **Verification**: `human-judgment`

## Open Questions
- [ ] 具体的SQLite数据库 schema 设计
- [ ] 约束规则的具体实现方式
- [ ] 桌面应用的打包和分发方案
- [ ] 数据备份和恢复机制