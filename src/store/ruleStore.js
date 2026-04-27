import { create } from 'zustand'
import { 
  createRule, 
  getAllRules, 
  getRuleById, 
  updateRule, 
  deleteRule, 
  createGlobalParam, 
  getAllGlobalParams, 
  getGlobalParamByKey, 
  updateGlobalParam, 
  deleteGlobalParam 
} from '../data/ruleModel.js'

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 规则类型定义
const ruleTypes = [
  { value: 'power_system', label: '力量系统' },
  { value: 'world_law', label: '世界法则' }
]

export const useRuleStore = create((set, get) => ({
  // 状态
  rules: [],
  globalParams: [],
  loading: false,
  error: null,
  selectedRule: null,
  selectedParam: null,
  
  // 动作
  // 加载所有规则
  loadRules: async () => {
    set({ loading: true, error: null })
    try {
      const rules = await getAllRules()
      set({ rules, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 加载所有全局参数
  loadGlobalParams: async () => {
    set({ loading: true, error: null })
    try {
      const params = await getAllGlobalParams()
      set({ globalParams: params, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // 选择规则
  selectRule: (id) => {
    const rule = get().rules.find(r => r.id === id)
    set({ selectedRule: rule })
  },
  
  // 选择全局参数
  selectParam: (key) => {
    const param = get().globalParams.find(p => p.key === key)
    set({ selectedParam: param })
  },
  
  // 创建规则
  createRule: async (ruleData) => {
    set({ loading: true, error: null })
    try {
      const newRule = {
        id: generateId(),
        exists: true,
        properties: {},
        limit: {
          has_limit: false,
          description: ''
        },
        ...ruleData
      }
      const createdRule = await createRule(newRule)
      set(state => ({
        rules: [...state.rules, createdRule],
        selectedRule: createdRule,
        loading: false
      }))
      return createdRule
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 更新规则
  updateRule: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedRule = await updateRule(id, updates)
      set(state => ({
        rules: state.rules.map(r => r.id === id ? updatedRule : r),
        selectedRule: state.selectedRule?.id === id ? updatedRule : state.selectedRule,
        loading: false
      }))
      return updatedRule
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 删除规则
  deleteRule: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteRule(id)
      set(state => ({
        rules: state.rules.filter(r => r.id !== id),
        selectedRule: state.selectedRule?.id === id ? null : state.selectedRule,
        loading: false
      }))
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 创建全局参数
  createGlobalParam: async (paramData) => {
    set({ loading: true, error: null })
    try {
      const newParam = {
        value: '',
        ...paramData
      }
      const createdParam = await createGlobalParam(newParam)
      set(state => ({
        globalParams: [...state.globalParams, createdParam],
        selectedParam: createdParam,
        loading: false
      }))
      return createdParam
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 更新全局参数
  updateGlobalParam: async (key, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedParam = await updateGlobalParam(key, updates)
      set(state => ({
        globalParams: state.globalParams.map(p => p.key === key ? updatedParam : p),
        selectedParam: state.selectedParam?.key === key ? updatedParam : state.selectedParam,
        loading: false
      }))
      return updatedParam
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 删除全局参数
  deleteGlobalParam: async (key) => {
    set({ loading: true, error: null })
    try {
      await deleteGlobalParam(key)
      set(state => ({
        globalParams: state.globalParams.filter(p => p.key !== key),
        selectedParam: state.selectedParam?.key === key ? null : state.selectedParam,
        loading: false
      }))
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  // 获取规则类型
  getRuleTypes: () => ruleTypes
}))