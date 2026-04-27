import { getDB } from './db.js'

// 创建关系
export async function createRelation(relation) {
  const db = await getDB()
  await db.run(
    `INSERT INTO relations (id, source_id, target_id, type, strength, note) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [relation.id, relation.source_id, relation.target_id, relation.type, relation.strength, relation.note]
  )
  return relation
}

// 获取所有关系
export async function getAllRelations() {
  const db = await getDB()
  return await db.all(`SELECT * FROM relations`)
}

// 根据ID获取关系
export async function getRelationById(id) {
  const db = await getDB()
  return await db.get(`SELECT * FROM relations WHERE id = ?`, [id])
}

// 根据源实体ID获取关系
export async function getRelationsBySourceId(sourceId) {
  const db = await getDB()
  return await db.all(`SELECT * FROM relations WHERE source_id = ?`, [sourceId])
}

// 根据目标实体ID获取关系
export async function getRelationsByTargetId(targetId) {
  const db = await getDB()
  return await db.all(`SELECT * FROM relations WHERE target_id = ?`, [targetId])
}

// 更新关系
export async function updateRelation(id, updates) {
  const db = await getDB()
  const keys = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  await db.run(
    `UPDATE relations SET ${setClause} WHERE id = ?`,
    [...values, id]
  )
  return getRelationById(id)
}

// 删除关系
export async function deleteRelation(id) {
  const db = await getDB()
  await db.run(`DELETE FROM relations WHERE id = ?`, [id])
  return true
}