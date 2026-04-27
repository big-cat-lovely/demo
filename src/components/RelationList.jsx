import React, { useEffect } from 'react'
import { useRelationStore } from '../store/relationStore.js'
import { useEntityStore } from '../store/entityStore.js'

function RelationList() {
  const { relations, loading, error, loadRelations, selectRelation, deleteRelation } = useRelationStore()
  const { getEntityById } = useEntityStore()

  useEffect(() => {
    loadRelations()
  }, [loadRelations])

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>错误: {error}</div>
  }

  const getEntityName = (id) => {
    const entity = getEntityById(id)
    return entity?.name || '未知实体'
  }

  return (
    <div className="relation-list">
      <h2>关系列表</h2>
      <div className="relation-list-content">
        {relations.map(relation => (
          <div key={relation.id} className="relation-item" onClick={() => selectRelation(relation.id)}>
            <div className="relation-header">
              <h3>{relation.type}</h3>
              <span className="relation-strength">强度: {relation.strength}</span>
            </div>
            <div className="relation-entities">
              <span>{getEntityName(relation.source_id)}</span>
              <span className="relation-arrow">→</span>
              <span>{getEntityName(relation.target_id)}</span>
            </div>
            {relation.note && (
              <p className="relation-note">{relation.note}</p>
            )}
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('确定要删除这个关系吗？')) {
                  deleteRelation(relation.id)
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

export default RelationList