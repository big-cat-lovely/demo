import React, { useState, useEffect } from 'react'
import { backupDatabase, restoreDatabase, getBackupList, deleteBackup } from '../utils/backupUtils.js'

function BackupManager() {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = () => {
    const backupList = getBackupList()
    setBackups(backupList)
  }

  const handleBackup = async () => {
    setLoading(true)
    setMessage('')
    const result = await backupDatabase()
    if (result.success) {
      setMessage('备份成功！')
      loadBackups()
    } else {
      setMessage(`备份失败: ${result.error}`)
    }
    setLoading(false)
  }

  const handleRestore = async (backupPath) => {
    if (window.confirm('确定要恢复这个备份吗？这将覆盖当前数据。')) {
      setLoading(true)
      setMessage('')
      const result = await restoreDatabase(backupPath)
      if (result.success) {
        setMessage('恢复成功！请刷新页面以查看更新后的数据。')
      } else {
        setMessage(`恢复失败: ${result.error}`)
      }
      setLoading(false)
    }
  }

  const handleDelete = (backupPath) => {
    if (window.confirm('确定要删除这个备份吗？')) {
      const result = deleteBackup(backupPath)
      if (result.success) {
        setMessage('删除成功！')
        loadBackups()
      } else {
        setMessage(`删除失败: ${result.error}`)
      }
    }
  }

  return (
    <div className="backup-manager">
      <h2>数据备份与恢复</h2>
      
      <div className="backup-actions">
        <button 
          className="backup-button"
          onClick={handleBackup}
          disabled={loading}
        >
          {loading ? '备份中...' : '创建备份'}
        </button>
      </div>
      
      {message && (
        <div className="message">
          {message}
        </div>
      )}
      
      <div className="backup-list">
        <h3>备份列表</h3>
        {backups.length === 0 ? (
          <p>暂无备份</p>
        ) : (
          <ul>
            {backups.map(backup => (
              <li key={backup.path} className="backup-item">
                <div className="backup-info">
                  <span className="backup-name">{backup.name}</span>
                  <span className="backup-date">{backup.date.toLocaleString()}</span>
                </div>
                <div className="backup-actions">
                  <button 
                    className="restore-button"
                    onClick={() => handleRestore(backup.path)}
                  >
                    恢复
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(backup.path)}
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default BackupManager