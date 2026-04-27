import React from 'react'
import MaterialList from '../components/MaterialList.jsx'
import MaterialForm from '../components/MaterialForm.jsx'

function MaterialPage() {
  return (
    <div className="material-page">
      <div className="page-header">
        <h1>素材库管理</h1>
      </div>
      <div className="page-content">
        <div className="left-panel">
          <MaterialList />
        </div>
        <div className="right-panel">
          <MaterialForm />
        </div>
      </div>
    </div>
  )
}

export default MaterialPage