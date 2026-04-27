import { getDB } from './db.js'

// 创建实体
export async function createEntity(entity) {
  const db = await getDB()
  await db.run(
    `INSERT INTO entities (id, name, type, attributes, tags, description, material_refs) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [entity.id, entity.name, entity.type, JSON.stringify(entity.attributes), JSON.stringify(entity.tags), entity.description, JSON.stringify(entity.material_refs)]
  )
  return entity
}

// 获取所有实体
export async function getAllEntities() {
  const db = await getDB()
  const entities = await db.all(`SELECT * FROM entities`)
  return entities.map(e => ({
    ...e,
    attributes: JSON.parse(e.attributes || '{}'),
    tags: JSON.parse(e.tags || '[]'),
    material_refs: JSON.parse(e.material_refs || '[]')
  }))
}

// 根据ID获取实体
export async function getEntityById(id) {
  const db = await getDB()
  const entity = await db.get(`SELECT * FROM entities WHERE id = ?`, [id])
  if (entity) {
    entity.attributes = JSON.parse(entity.attributes || '{}')
    entity.tags = JSON.parse(entity.tags || '[]')
    entity.material_refs = JSON.parse(entity.material_refs || '[]')
  }
  return entity
}

// 根据类型获取实体
export async function getEntitiesByType(type) {
  const db = await getDB()
  const entities = await db.all(`SELECT * FROM entities WHERE type = ?`, [type])
  return entities.map(e => ({
    ...e,
    attributes: JSON.parse(e.attributes || '{}'),
    tags: JSON.parse(e.tags || '[]'),
    material_refs: JSON.parse(e.material_refs || '[]')
  }))
}

// 更新实体
export async function updateEntity(id, updates) {
  const db = await getDB()
  const keys = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  await db.run(
    `UPDATE entities SET ${setClause} WHERE id = ?`,
    [...values, id]
  )
  return getEntityById(id)
}

// 删除实体
export async function deleteEntity(id) {
  const db = await getDB()
  // 先删除相关的关系
  await db.run(`DELETE FROM relations WHERE source_id = ? OR target_id = ?`, [id, id])
  // 再删除实体
  await db.run(`DELETE FROM entities WHERE id = ?`, [id])
  return true
}