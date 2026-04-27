import { create } from 'zustand'
import { createEntity, getAllEntities, getEntityById, updateEntity, deleteEntity, getEntitiesByType } from '../data/entityModel.js'

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 实体类型定义
const entityTypes = {
  faction: {
    name: '势力',
    attributes: [
      { key: 'power', label: '力量' },
      { key: 'resource_control', label: '资源控制' },
      { key: 'structure', label: '结构' },
      { key: 'locations', label: '地点' }
    ]
  },
  character: {
    name: '角色',
    attributes: [
      { key: 'faction_id', label: '势力ID' },
      { key: 'level', label: '等级' },
      { key: 'motivation', label: '动机' }
    ]
  },
  location: {
    name: '地点',
    attributes: [
      { key: 'type', label: '类型' },
      { key: 'resource_output', label: '资源产出' },
      { key: 'danger_level', label: '危险等级' }
    ]
  },
  resource: {
    name: '资源',
    attributes: [
      { key: 'scarcity', label: '稀缺度' },
      { key: 'usage', label: '用途' },
      { key: 'controller', label: '控制者' }
    ]
  },
  item: {
    name: '物品',
    attributes: [
      { key: 'level', label: '等级' },
      { key: 'origin', label: '来源' },
      { key: 'owner', label: '所有者' }
    ]
  },
  system: {
    name: '系统',
    attributes: []
  }
}

export const useEntityStore = create((set, get) => ({
  // 状态
  entities: [],
  loading: false,
  error: null,
  selectedEntity: null,
  
  // 动作
  // 加载所有实体
  loadEntities: async () => {
    set({ loading: true, error: null })
    try {
      const entities = await getAllEntities()
      set({ entities, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 加载指定类型的实体
  loadEntitiesByType: async (type) => {
    set({ loading: true, error: null })
    try {
      const entities = await getEntitiesByType(type)
      set({ entities, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 选择实体
  selectEntity: (id) => {
    const entity = get().entities.find(e => e.id === id)
    set({ selectedEntity: entity })
  },
  
  // 创建实体
  createEntity: async (entityData) => {
    set({ loading: true, error: null })
    try {
      const newEntity = {
        id: generateId(),
        tags: [],
        material_refs: [],
        attributes: {},
        ...entityData
      }
      const createdEntity = await createEntity(newEntity)
      set(state => ({
        entities: [...state.entities, createdEntity],
        selectedEntity: createdEntity,
        loading: false
      }))
      return createdEntity
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 更新实体
  updateEntity: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedEntity = await updateEntity(id, updates)
      set(state => ({
        entities: state.entities.map(e => e.id === id ? updatedEntity : e),
        selectedEntity: state.selectedEntity?.id === id ? updatedEntity : state.selectedEntity,
        loading: false
      }))
      return updatedEntity
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 删除实体
  deleteEntity: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteEntity(id)
      set(state => ({
        entities: state.entities.filter(e => e.id !== id),
        selectedEntity: state.selectedEntity?.id === id ? null : state.selectedEntity,
        loading: false
      }))
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 获取实体类型信息
  getEntityTypes: () => entityTypes,
  
  // 获取实体类型名称
  getEntityTypeName: (type) => entityTypes[type]?.name || type
}))