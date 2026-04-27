import { create } from 'zustand'
import { createMaterial, getAllMaterials, getMaterialById, updateMaterial, deleteMaterial, getMaterialsByTag } from '../data/materialModel.js'

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 素材类型定义
const materialTypes = [
  { value: 'note', label: '笔记' },
  { value: 'reference', label: '参考' },
  { value: 'idea', label: '灵感' }
]

export const useMaterialStore = create((set, get) => ({
  // 状态
  materials: [],
  loading: false,
  error: null,
  selectedMaterial: null,
  filteredMaterials: [],
  currentTag: null,
  
  // 动作
  // 加载所有素材
  loadMaterials: async () => {
    set({ loading: true, error: null })
    try {
      const materials = await getAllMaterials()
      set({ materials, filteredMaterials: materials, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 根据标签筛选素材
  filterMaterialsByTag: async (tag) => {
    set({ loading: true, error: null, currentTag: tag })
    try {
      if (!tag) {
        const materials = await getAllMaterials()
        set({ filteredMaterials: materials, loading: false })
      } else {
        const materials = await getMaterialsByTag(tag)
        set({ filteredMaterials: materials, loading: false })
      }
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 选择素材
  selectMaterial: (id) => {
    const material = get().materials.find(m => m.id === id)
    set({ selectedMaterial: material })
  },
  
  // 创建素材
  createMaterial: async (materialData) => {
    set({ loading: true, error: null })
    try {
      const newMaterial = {
        id: generateId(),
        tags: [],
        ...materialData
      }
      const createdMaterial = await createMaterial(newMaterial)
      set(state => {
        const updatedMaterials = [...state.materials, createdMaterial]
        const updatedFilteredMaterials = state.currentTag 
          ? updatedMaterials.filter(m => m.tags.includes(state.currentTag))
          : updatedMaterials
        return {
          materials: updatedMaterials,
          filteredMaterials: updatedFilteredMaterials,
          selectedMaterial: createdMaterial,
          loading: false
        }
      })
      return createdMaterial
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 更新素材
  updateMaterial: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedMaterial = await updateMaterial(id, updates)
      set(state => {
        const updatedMaterials = state.materials.map(m => m.id === id ? updatedMaterial : m)
        const updatedFilteredMaterials = state.currentTag 
          ? updatedMaterials.filter(m => m.tags.includes(state.currentTag))
          : updatedMaterials
        return {
          materials: updatedMaterials,
          filteredMaterials: updatedFilteredMaterials,
          selectedMaterial: state.selectedMaterial?.id === id ? updatedMaterial : state.selectedMaterial,
          loading: false
        }
      })
      return updatedMaterial
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 删除素材
  deleteMaterial: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteMaterial(id)
      set(state => {
        const updatedMaterials = state.materials.filter(m => m.id !== id)
        const updatedFilteredMaterials = state.currentTag 
          ? updatedMaterials.filter(m => m.tags.includes(state.currentTag))
          : updatedMaterials
        return {
          materials: updatedMaterials,
          filteredMaterials: updatedFilteredMaterials,
          selectedMaterial: state.selectedMaterial?.id === id ? null : state.selectedMaterial,
          loading: false
        }
      })
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 获取所有标签
  getAllTags: () => {
    const materials = get().materials
    const tags = new Set()
    materials.forEach(material => {
      material.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  },
  
  // 获取素材类型
  getMaterialTypes: () => materialTypes
}))