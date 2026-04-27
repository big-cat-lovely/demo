import React, { useEffect } from 'react'
import { useEntityStore } from '../store/entityStore.js'

function EntityList() {
  const { entities, loading, error, loadEntities, selectEntity, deleteEntity, getEntityTypeName } = useEntityStore()

  useEffect(() => {
    loadEntities()
  }, [loadEntities])

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>错误: {error}</div>
  }

  return (
    <div className="entity-list">
      <h2>实体列表</h2>
      <div className="entity-list-content">
        {entities.map(entity => (
          <div key={entity.id} className="entity-item" onClick={() => selectEntity(entity.id)}>
            <div className="entity-header">
              <h3>{entity.name}</h3>
              <span className="entity-type">{getEntityTypeName(entity.type)}</span>
            </div>
            <p className="entity-description">{entity.description || '无描述'}</p>
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('确定要删除这个实体吗？')) {
                  deleteEntity(entity.id)
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

export default EntityList