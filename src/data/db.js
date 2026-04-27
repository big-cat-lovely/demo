// 数据库操作的接口定义
// 在浏览器环境中，这些操作将通过 Tauri IPC 调用后端实现
// 在开发环境中，使用内存存储模拟

let memoryStore = {
  entities: [],
  materials: [],
  relations: [],
  rules: [],
  global_params: []
};

// 检查是否在 Tauri 环境中
const isTauri = typeof window !== 'undefined' && window.__TAURI__;

// 初始化数据库
export async function initDB() {
  if (isTauri) {
    // 在 Tauri 环境中，通过 IPC 初始化数据库
    try {
      const { invoke } = await import('@tauri-apps/api');
      await invoke('init_db');
    } catch (error) {
      console.error('初始化数据库失败:', error);
    }
  }
  return true;
}

// 获取数据库实例
export async function getDB() {
  // 在浏览器环境中，返回一个模拟的数据库对象
  return {
    run: async (sql, params) => {
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api');
        return await invoke('run_sql', { sql, params });
      } else {
        // 模拟数据库操作
        console.log('Running SQL:', sql, params);
        return { changes: 1 };
      }
    },
    all: async (sql, params) => {
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api');
        return await invoke('query_sql', { sql, params });
      } else {
        // 模拟数据库查询
        console.log('Querying SQL:', sql, params);
        if (sql.includes('SELECT * FROM entities')) {
          return memoryStore.entities;
        } else if (sql.includes('SELECT * FROM materials')) {
          return memoryStore.materials;
        } else if (sql.includes('SELECT * FROM relations')) {
          return memoryStore.relations;
        } else if (sql.includes('SELECT * FROM rules')) {
          return memoryStore.rules;
        } else if (sql.includes('SELECT * FROM global_params')) {
          return memoryStore.global_params;
        }
        return [];
      }
    },
    get: async (sql, params) => {
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api');
        return await invoke('query_sql', { sql, params });
      } else {
        // 模拟数据库查询
        console.log('Querying SQL:', sql, params);
        if (sql.includes('SELECT * FROM entities WHERE id = ?')) {
          return memoryStore.entities.find(e => e.id === params[0]);
        }
        return null;
      }
    },
    exec: async (sql) => {
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api');
        return await invoke('exec_sql', { sql });
      } else {
        // 模拟数据库执行
        console.log('Executing SQL:', sql);
        return true;
      }
    }
  };
}

// 关闭数据库连接
export async function closeDB() {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api');
    await invoke('close_db');
  }
  return true;
}