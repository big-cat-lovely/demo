import React, { useState, useEffect } from 'react'
import { useRuleStore } from '../store/ruleStore.js'

function GlobalParamForm() {
  const { 
    selectedParam, 
    createGlobalParam, 
    updateGlobalParam 
  } = useRuleStore()
  
  const [formData, setFormData] = useState({
    key: '',
    type: 'string',
    min: undefined,
    max: undefined,
    value: ''
  })

  useEffect(() => {
    if (selectedParam) {
      setFormData({
        key: selectedParam.key,
        type: selectedParam.type,
        min: selectedParam.min,
        max: selectedParam.max,
        value: selectedParam.value
      })
    } else {
      setFormData({
        key: '',
        type: 'string',
        min: undefined,
        max: undefined,
        value: ''
      })
    }
  }, [selectedParam])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : parseFloat(value)
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
      if (selectedParam) {
        await updateGlobalParam(selectedParam.key, formData)
      } else {
        await createGlobalParam(formData)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return (
    <div className="global-param-form">
      <h2>{selectedParam ? '编辑全局参数' : '创建全局参数'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="key">键</label>
          <input 
            type="text" 
            id="key" 
            name="key" 
            value={formData.key} 
            onChange={handleChange} 
            required
            disabled={!!selectedParam}
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
            <option value="string">字符串</option>
            <option value="number">数字</option>
          </select>
        </div>
        
        {formData.type === 'number' && (
          <>
            <div className="form-group">
              <label htmlFor="min">最小值</label>
              <input 
                type="number" 
                id="min" 
                name="min" 
                value={formData.min || ''} 
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="max">最大值</label>
              <input 
                type="number" 
                id="max" 
                name="max" 
                value={formData.max || ''} 
                onChange={handleChange}
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="value">值</label>
          {formData.type === 'number' ? (
            <input 
              type="number" 
              id="value" 
              name="value" 
              value={formData.value || ''} 
              onChange={handleChange}
            />
          ) : (
            <input 
              type="text" 
              id="value" 
              name="value" 
              value={formData.value} 
              onChange={handleChange}
            />
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit">{selectedParam ? '更新' : '创建'}</button>
        </div>
      </form>
    </div>
  )
}

export default GlobalParamForm