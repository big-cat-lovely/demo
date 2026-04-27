import React, { useState, useEffect } from 'react'
import { useMaterialStore } from '../store/materialStore.js'

function MaterialForm() {
  const { 
    selectedMaterial, 
    createMaterial, 
    updateMaterial, 
    getMaterialTypes 
  } = useMaterialStore()
  
  const materialTypes = getMaterialTypes()
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'note',
    content: '',
    tags: [],
    source: ''
  })
  
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (selectedMaterial) {
      setFormData({
        title: selectedMaterial.title,
        type: selectedMaterial.type,
        content: selectedMaterial.content,
        tags: [...selectedMaterial.tags],
        source: selectedMaterial.source || ''
      })
    } else {
      setFormData({
        title: '',
        type: 'note',
        content: '',
        tags: [],
        source: ''
      })
    }
  }, [selectedMaterial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedMaterial) {
        await updateMaterial(selectedMaterial.id, formData)
      } else {
        await createMaterial(formData)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return (
    <div className="material-form">
      <h2>{selectedMaterial ? '编辑素材' : '创建素材'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">标题</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
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
            {materialTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">内容</label>
          <textarea 
            id="content" 
            name="content" 
            value={formData.content} 
            onChange={handleChange}
            rows={6}
          ></textarea>
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
          <label htmlFor="source">来源</label>
          <input 
            type="text" 
            id="source" 
            name="source" 
            value={formData.source} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit">{selectedMaterial ? '更新' : '创建'}</button>
        </div>
      </form>
    </div>
  )
}

export default MaterialForm