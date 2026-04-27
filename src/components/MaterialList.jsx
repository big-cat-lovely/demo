import React, { useEffect } from 'react'
import { useMaterialStore } from '../store/materialStore.js'

function MaterialList() {
  const { 
    materials, 
    filteredMaterials, 
    loading, 
    error, 
    loadMaterials, 
    filterMaterialsByTag, 
    selectMaterial, 
    deleteMaterial, 
    getAllTags 
  } = useMaterialStore()

  useEffect(() => {
    loadMaterials()
  }, [loadMaterials])

  const tags = getAllTags()

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>错误: {error}</div>
  }

  return (
    <div className="material-list">
      <h2>素材库</h2>
      
      {/* 标签筛选 */}
      <div className="tag-filter">
        <button 
          className="filter-button"
          onClick={() => filterMaterialsByTag(null)}
        >
          全部
        </button>
        {tags.map(tag => (
          <button 
            key={tag} 
            className="filter-button"
            onClick={() => filterMaterialsByTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="material-list-content">
        {filteredMaterials.map(material => (
          <div key={material.id} className="material-item" onClick={() => selectMaterial(material.id)}>
            <div className="material-header">
              <h3>{material.title}</h3>
              <span className="material-type">{material.type === 'note' ? '笔记' : material.type === 'reference' ? '参考' : '灵感'}</span>
            </div>
            <p className="material-content">{material.content || '无内容'}</p>
            <div className="material-meta">
              <div className="material-tags">
                {material.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              {material.source && (
                <span className="material-source">来源: {material.source}</span>
              )}
            </div>
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('确定要删除这个素材吗？')) {
                  deleteMaterial(material.id)
                }
              }}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MaterialList