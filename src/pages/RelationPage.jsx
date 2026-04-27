import React from 'react'
import RelationList from '../components/RelationList.jsx'
import RelationForm from '../components/RelationForm.jsx'

function RelationPage() {
  return (
    <div className="relation-page">
      <div className="page-header">
        <h1>关系管理</h1>
      </div>
      <div className="page-content">
        <div className="left-panel">
          <RelationList />
        </div>
        <div className="right-panel">
          <RelationForm />
        </div>
      </div>
    </div>
  )
}

export default RelationPage