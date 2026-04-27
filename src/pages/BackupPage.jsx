import React from 'react'
import BackupManager from '../components/BackupManager.jsx'

function BackupPage() {
  return (
    <div className="backup-page">
      <div className="page-header">
        <h1>数据备份与恢复</h1>
      </div>
      <div className="page-content">
        <div className="backup-container">
          <BackupManager />
        </div>
      </div>
    </div>
  )
}

export default BackupPage