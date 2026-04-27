import { create } from 'zustand'
import { createRelation, getAllRelations, getRelationById, updateRelation, deleteRelation, getRelationsBySourceId, getRelationsByTargetId } from '../data/relationModel.js'

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 预设关系类型
const relationTypes = [
  { value: '敌对', label: '敌对' },
  { value: '联盟', label: '联盟' },
  { value: '竞争', label: '竞争' },
  { value: '控制', label: '控制' },
  { value: '依赖', label: '依赖' }
]

// 关系约束规则
const relationConstraints = {
  '控制': {
    allowedSources: ['faction'],
    allowedTargets: ['resource', 'location']
  }
}

export const useRelationStore = create((set, get) => ({
  // 状态
  relations: [],
  loading: false,
  error: null,
  selectedRelation: null,
  
  // 动作
  // 加载所有关系
  loadRelations: async () => {
    set({ loading: true, error: null })
    try {
      const relations = await getAllRelations()
      set({ relations, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 加载指定实体的关系
  loadRelationsByEntityId: async (entityId) => {
    set({ loading: true, error: null })
    try {
      const sourceRelations = await getRelationsBySourceId(entityId)
      const targetRelations = await getRelationsByTargetId(entityId)
      const relations = [...sourceRelations, ...targetRelations]
      set({ relations, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 选择关系
  selectRelation: (id) => {
    const relation = get().relations.find(r => r.id === id)
    set({ selectedRelation: relation })
  },
  
  // 创建关系
  createRelation: async (relationData) => {
    set({ loading: true, error: null })
    try {
      // 检查关系约束
      const constraints = relationConstraints[relationData.type]
      if (constraints) {
        // 这里应该检查源实体和目标实体的类型是否符合约束
        // 由于我们还没有获取实体类型的逻辑，暂时跳过约束检查
      }
      
      const newRelation = {
        id: generateId(),
        strength: 0,
        ...relationData
      }
      const createdRelation = await createRelation(newRelation)
      set(state => ({
        relations: [...state.relations, createdRelation],
        selectedRelation: createdRelation,
        loading: false
      }))
      return createdRelation
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 更新关系
  updateRelation: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedRelation = await updateRelation(id, updates)
      set(state => ({
        relations: state.relations.map(r => r.id === id ? updatedRelation : r),
        selectedRelation: state.selectedRelation?.id === id ? updatedRelation : state.selectedRelation,
        loading: false
      }))
      return updatedRelation
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 删除关系
  deleteRelation: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteRelation(id)
      set(state => ({
        relations: state.relations.filter(r => r.id !== id),
        selectedRelation: state.selectedRelation?.id === id ? null : state.selectedRelation,
        loading: false
      }))
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 获取预设关系类型
  getRelationTypes: () => relationTypes,
  
  // 检查关系约束
  checkRelationConstraint: (sourceType, targetType, relationType) => {
    const constraints = relationConstraints[relationType]
    if (!constraints) {
      return true // 没有约束，允许所有类型
    }
    return constraints.allowedSources.includes(sourceType) && 
           constraints.allowedTargets.includes(targetType)
  }
}))