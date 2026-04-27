import React from 'react'
import EntityList from '../components/EntityList.jsx'
import EntityForm from '../components/EntityForm.jsx'

function EntityPage() {
  return (
    <div className="entity-page">
      <div className="page-header">
        <h1>实体管理</h1>
      </div>
      <div className="page-content">
        <div className="left-panel">
          <EntityList />
        </div>
        <div className="right-panel">
          <EntityForm />
        </div>
      </div>
    </div>
  )
}

export default EntityPage