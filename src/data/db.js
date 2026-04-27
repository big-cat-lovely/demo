import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db = null

// 初始化数据库
export async function initDB() {
  if (!db) {
    db = await open({
      filename: './worldbuilding.db',
      driver: sqlite3.Database
    })

    // 创建素材库表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS materials (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        tags TEXT,
        type TEXT NOT NULL,
        source TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建规则表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS rules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        exists INTEGER DEFAULT 1,
        properties TEXT,
        limit_description TEXT,
        has_limit INTEGER DEFAULT 0
      )
    `)

    // 创建全局参数表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS global_params (
        key TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        min INTEGER,
        max INTEGER,
        value TEXT
      )
    `)

    // 创建实体表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        attributes TEXT,
        tags TEXT,
        description TEXT,
        material_refs TEXT
      )
    `)

    // 创建关系表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS relations (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        type TEXT NOT NULL,
        strength INTEGER DEFAULT 0,
        note TEXT,
        FOREIGN KEY (source_id) REFERENCES entities (id),
        FOREIGN KEY (target_id) REFERENCES entities (id)
      )
    `)
  }
  return db
}

// 获取数据库实例
export async function getDB() {
  if (!db) {
    await initDB()
  }
  return db
}

// 关闭数据库连接
export async function closeDB() {
  if (db) {
    await db.close()
    db = null
  }
}