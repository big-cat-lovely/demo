import React, { useState, useEffect } from 'react'
import { useRuleStore } from '../store/ruleStore.js'

function RuleForm() {
  const { 
    selectedRule, 
    createRule, 
    updateRule, 
    getRuleTypes 
  } = useRuleStore()
  
  const ruleTypes = getRuleTypes()
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'power_system',
    exists: true,
    properties: {},
    limit: {
      has_limit: false,
      description: ''
    }
  })

  useEffect(() => {
    if (selectedRule) {
      setFormData({
        name: selectedRule.name,
        type: selectedRule.type,
        exists: selectedRule.exists,
        properties: { ...selectedRule.properties },
        limit: { ...selectedRule.limit }
      })
    } else {
      setFormData({
        name: '',
        type: 'power_system',
        exists: true,
        properties: {},
        limit: {
          has_limit: false,
          description: ''
        }
      })
    }
  }, [selectedRule])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'exists') {
      setFormData(prev => ({
        ...prev,
        exists: checked
      }))
    } else if (name === 'limit.has_limit') {
      setFormData(prev => ({
        ...prev,
        limit: {
          ...prev.limit,
          has_limit: checked
        }
      }))
    } else if (name === 'limit.description') {
      setFormData(prev => ({
        ...prev,
        limit: {
          ...prev.limit,
          description: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedRule) {
        await updateRule(selectedRule.id, formData)
      } else {
        await createRule(formData)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return (
    <div className="rule-form">
      <h2>{selectedRule ? '编辑规则' : '创建规则'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">名称</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">类型</label>
          <select 
            id="type" 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
          >
            {ruleTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              name="exists" 
              checked={formData.exists} 
              onChange={handleChange}
            />
            存在
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              name="limit.has_limit" 
              checked={formData.limit.has_limit} 
              onChange={handleChange}
            />
            有限制
          </label>
        </div>
        
        {formData.limit.has_limit && (
          <div className="form-group">
            <label htmlFor="limit.description">限制描述</label>
            <textarea 
              id="limit.description" 
              name="limit.description" 
              value={formData.limit.description} 
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit">{selectedRule ? '更新' : '创建'}</button>
        </div>
      </form>
    </div>
  )
}

export default RuleForm