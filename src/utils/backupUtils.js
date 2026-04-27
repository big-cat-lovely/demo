// 备份工具
// 在浏览器环境中，这些操作将通过 Tauri IPC 调用后端实现
// 在开发环境中，使用模拟数据

// 检查是否在 Tauri 环境中
const isTauri = typeof window !== 'undefined' && window.__TAURI__;

// 模拟备份列表
let mockBackups = [
  {
    name: 'worldbuilding-2026-04-27T10-00-00.db',
    path: './backups/worldbuilding-2026-04-27T10-00-00.db',
    date: new Date('2026-04-27T10:00:00')
  },
  {
    name: 'worldbuilding-2026-04-26T15-30-00.db',
    path: './backups/worldbuilding-2026-04-26T15:30:00.db',
    date: new Date('2026-04-26T15:30:00')
  }
];

// 备份数据库
export async function backupDatabase() {
  try {
    if (isTauri) {
      const { invoke } = await import('@tauri-apps/api');
      return await invoke('backup_database');
    } else {
      // 模拟备份操作
      console.log('备份数据库');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `./backups/worldbuilding-${timestamp}.db`;
      mockBackups.unshift({
        name: `worldbuilding-${timestamp}.db`,
        path: backupPath,
        date: new Date()
      });
      return {
        success: true,
        path: backupPath
      };
    }
  } catch (error) {
    console.error('备份失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 恢复数据库
export async function restoreDatabase(backupPath) {
  try {
    if (isTauri) {
      const { invoke } = await import('@tauri-apps/api');
      return await invoke('restore_database', { backupPath });
    } else {
      // 模拟恢复操作
      console.log('恢复数据库:', backupPath);
      return {
        success: true
      };
    }
  } catch (error) {
    console.error('恢复失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 获取备份列表
export async function getBackupList() {
  try {
    if (isTauri) {
      // 在 Tauri 环境中，通过 IPC 获取备份列表
      const { invoke } = await import('@tauri-apps/api');
      return await invoke('get_backup_list');
    } else {
      // 模拟备份列表
      console.log('获取备份列表');
      return mockBackups;
    }
  } catch (error) {
    console.error('获取备份列表失败:', error);
    return [];
  }
}

// 删除备份
export async function deleteBackup(backupPath) {
  try {
    if (isTauri) {
      const { invoke } = await import('@tauri-apps/api');
      return await invoke('delete_backup', { backupPath });
    } else {
      // 模拟删除备份
      console.log('删除备份:', backupPath);
      mockBackups = mockBackups.filter(backup => backup.path !== backupPath);
      return { success: true };
    }
  } catch (error) {
    console.error('删除备份失败:', error);
    return { success: false, error: error.message };
  }
}