import fs from 'fs'
import path from 'path'

// 备份数据库
export async function backupDatabase() {
  try {
    const backupDir = './backups'
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `worldbuilding-${timestamp}.db`)
    
    // 复制数据库文件
    fs.copyFileSync('./worldbuilding.db', backupPath)
    
    return {
      success: true,
      path: backupPath
    }
  } catch (error) {
    console.error('备份失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 恢复数据库
export async function restoreDatabase(backupPath) {
  try {
    if (!fs.existsSync(backupPath)) {
      return {
        success: false,
        error: '备份文件不存在'
      }
    }
    
    // 复制备份文件到数据库位置
    fs.copyFileSync(backupPath, './worldbuilding.db')
    
    return {
      success: true
    }
  } catch (error) {
    console.error('恢复失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 获取备份列表
export function getBackupList() {
  try {
    const backupDir = './backups'
    if (!fs.existsSync(backupDir)) {
      return []
    }
    
    const files = fs.readdirSync(backupDir)
    return files
      .filter(file => file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        date: new Date(file.match(/worldbuilding-(.*)\.db/)[1].replace(/-/g, ':'))
      }))
      .sort((a, b) => b.date - a.date)
  } catch (error) {
    console.error('获取备份列表失败:', error)
    return []
  }
}

// 删除备份
export function deleteBackup(backupPath) {
  try {
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath)
      return { success: true }
    }
    return { success: false, error: '备份文件不存在' }
  } catch (error) {
    console.error('删除备份失败:', error)
    return { success: false, error: error.message }
  }
}