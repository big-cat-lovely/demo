import React, { useState } from 'react'
import EntityPage from './pages/EntityPage.jsx'
import RelationPage from './pages/RelationPage.jsx'
import MaterialPage from './pages/MaterialPage.jsx'
import RulePage from './pages/RulePage.jsx'
import BackupPage from './pages/BackupPage.jsx'

function App() {
  const [activePage, setActivePage] = useState('entity')

  return (
    <div className="app">
      <div className="nav-bar">
        <div 
          className={`nav-item ${activePage === 'entity' ? 'active' : ''}`}
          onClick={() => setActivePage('entity')}
        >
          实体管理
        </div>
        <div 
          className={`nav-item ${activePage === 'relation' ? 'active' : ''}`}
          onClick={() => setActivePage('relation')}
        >
          关系管理
        </div>
        <div 
          className={`nav-item ${activePage === 'material' ? 'active' : ''}`}
          onClick={() => setActivePage('material')}
        >
          素材库
        </div>
        <div 
          className={`nav-item ${activePage === 'rule' ? 'active' : ''}`}
          onClick={() => setActivePage('rule')}
        >
          世界规则
        </div>
        <div 
          className={`nav-item ${activePage === 'backup' ? 'active' : ''}`}
          onClick={() => setActivePage('backup')}
        >
          数据备份
        </div>
      </div>
      {activePage === 'entity' && <EntityPage />}
      {activePage === 'relation' && <RelationPage />}
      {activePage === 'material' && <MaterialPage />}
      {activePage === 'rule' && <RulePage />}
      {activePage === 'backup' && <BackupPage />}
    </div>
  )
}

export default App