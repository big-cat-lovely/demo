import React, { useState, useEffect } from 'react'
import { useEntityStore } from '../store/entityStore.js'
import { useMaterialStore } from '../store/materialStore.js'
import { useRuleStore } from '../store/ruleStore.js'

function EntityForm() {
  const { 
    selectedEntity, 
    createEntity, 
    updateEntity, 
    getEntityTypes 
  } = useEntityStore()
  
  const { materials, loadMaterials } = useMaterialStore()
  const { rules, loadRules } = useRuleStore()
  
  const entityTypes = getEntityTypes()
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'faction',
    description: '',
    attributes: {},
    tags: [],
    material_refs: []
  })
  
  const [tagInput, setTagInput] = useState('')
  const [showReferenceSelector, setShowReferenceSelector] = useState(false)
  const [referenceType, setReferenceType] = useState('material')

  useEffect(() => {
    loadMaterials()
    loadRules()
  }, [loadMaterials, loadRules])

  useEffect(() => {
    if (selectedEntity) {
      setFormData({
        name: selectedEntity.name,
        type: selectedEntity.type,
        description: selectedEntity.description,
        attributes: { ...selectedEntity.attributes },
        tags: [...selectedEntity.tags],
        material_refs: [...(selectedEntity.material_refs || [])]
      })
    } else {
      setFormData({
        name: '',
        type: 'faction',
        description: '',
        attributes: {},
        tags: [],
        material_refs: []
      })
    }
  }, [selectedEntity])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttributeChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value
      }
    }))
  }

  const handleTagAdd = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleReferenceAdd = (refId) => {
    if (!formData.material_refs.includes(refId)) {
      setFormData(prev => ({
        ...prev,
        material_refs: [...prev.material_refs, refId]
      }))
    }
    setShowReferenceSelector(false)
  }

  const handleReferenceRemove = (refId) => {
    setFormData(prev => ({
      ...prev,
      material_refs: prev.material_refs.filter(id => id !== refId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedEntity) {
        await updateEntity(selectedEntity.id, formData)
      } else {
        await createEntity(formData)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return (
    <div className="entity-form">
      <h2>{selectedEntity ? '编辑实体' : '创建实体'}</h2>
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
            {Object.entries(entityTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">描述</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>属性</label>
          <div className="attributes-container">
            {entityTypes[formData.type]?.attributes.map(attr => (
              <div key={attr} className="attribute-item">
                <label>{attr}</label>
                <input 
                  type="text" 
                  value={formData.attributes[attr] || ''} 
                  onChange={(e) => handleAttributeChange(attr, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>标签</label>
          <div className="tags-container">
            <div className="tag-input">
              <input 
                type="text" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="输入标签"
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
              />
              <button type="button" onClick={handleTagAdd}>添加</button>
            </div>
            <div className="tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => handleTagRemove(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>引用</label>
          <div className="references-container">
            <button 
              type="button" 
              className="add-reference-button"
              onClick={() => setShowReferenceSelector(true)}
            >
              添加引用
            </button>
            <div className="references-list">
              {formData.material_refs.map(refId => {
                const material = materials.find(m => m.id === refId)
                return material ? (
                  <span key={refId} className="reference-tag">
                    {material.title}
                    <button type="button" onClick={() => handleReferenceRemove(refId)}>×</button>
                  </span>
                ) : null
              })}
            </div>
          </div>
        </div>
        
        {showReferenceSelector && (
          <div className="reference-selector">
            <h3>选择引用</h3>
            <div className="reference-type-tabs">
              <button 
                className={`tab-button ${referenceType === 'material' ? 'active' : ''}`}
                onClick={() => setReferenceType('material')}
              >
                素材
              </button>
              <button 
                className={`tab-button ${referenceType === 'rule' ? 'active' : ''}`}
                onClick={() => setReferenceType('rule')}
              >
                规则
              </button>
            </div>
            <div className="reference-items">
              {referenceType === 'material' ? (
                materials.map(material => (
                  <div 
                    key={material.id} 
                    className="reference-item"
                    onClick={() => handleReferenceAdd(material.id)}
                  >
                    {material.title}
                  </div>
                ))
              ) : (
                rules.map(rule => (
                  <div 
                    key={rule.id} 
                    className="reference-item"
                    onClick={() => handleReferenceAdd(rule.id)}
                  >
                    {rule.name}
                  </div>
                ))
              )}
            </div>
            <button type="button" onClick={() => setShowReferenceSelector(false)}>取消</button>
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit">{selectedEntity ? '更新' : '创建'}</button>
        </div>
      </form>
    </div>
  )
}

export default EntityForm