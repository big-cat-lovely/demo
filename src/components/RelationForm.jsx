import React, { useState, useEffect } from 'react'
import { useRelationStore } from '../store/relationStore.js'
import { useEntityStore } from '../store/entityStore.js'

function RelationForm() {
  const { 
    selectedRelation, 
    createRelation, 
    updateRelation, 
    getRelationTypes 
  } = useRelationStore()
  
  const { entities, loadEntities } = useEntityStore()
  
  const relationTypes = getRelationTypes()
  
  const [formData, setFormData] = useState({
    source_id: '',
    target_id: '',
    type: '敌对',
    strength: 0,
    note: ''
  })

  useEffect(() => {
    loadEntities()
  }, [loadEntities])

  useEffect(() => {
    if (selectedRelation) {
      setFormData({
        source_id: selectedRelation.source_id,
        target_id: selectedRelation.target_id,
        type: selectedRelation.type,
        strength: selectedRelation.strength,
        note: selectedRelation.note || ''
      })
    } else {
      setFormData({
        source_id: '',
        target_id: '',
        type: '敌对',
        strength: 0,
        note: ''
      })
    }
  }, [selectedRelation])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'strength' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedRelation) {
        await updateRelation(selectedRelation.id, formData)
      } else {
        await createRelation(formData)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return (
    <div className="relation-form">
      <h2>{selectedRelation ? '编辑关系' : '创建关系'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="source_id">源实体</label>
          <select 
            id="source_id" 
            name="source_id" 
            value={formData.source_id} 
            onChange={handleChange} 
            required
          >
            <option value="">选择实体</option>
            {entities.map(entity => (
              <option key={entity.id} value={entity.id}>{entity.name} ({entity.type})</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="target_id">目标实体</label>
          <select 
            id="target_id" 
            name="target_id" 
            value={formData.target_id} 
            onChange={handleChange} 
            required
          >
            <option value="">选择实体</option>
            {entities.map(entity => (
              <option key={entity.id} value={entity.id}>{entity.name} ({entity.type})</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="type">关系类型</label>
          <select 
            id="type" 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
          >
            {relationTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="strength">强度</label>
          <input 
            type="number" 
            id="strength" 
            name="strength" 
            min="0" 
            max="10" 
            value={formData.strength} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="note">备注</label>
          <textarea 
            id="note" 
            name="note" 
            value={formData.note} 
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="submit">{selectedRelation ? '更新' : '创建'}</button>
        </div>
      </form>
    </div>
  )
}

export default RelationForm