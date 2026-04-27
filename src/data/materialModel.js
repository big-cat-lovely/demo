import { getDB } from './db.js'

// 创建素材
export async function createMaterial(material) {
  const db = await getDB()
  await db.run(
    `INSERT INTO materials (id, title, content, tags, type, source) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [material.id, material.title, material.content, JSON.stringify(material.tags), material.type, material.source]
  )
  return material
}

// 获取所有素材
export async function getAllMaterials() {
  const db = await getDB()
  const materials = await db.all(`SELECT * FROM materials`)
  return materials.map(m => ({
    ...m,
    tags: JSON.parse(m.tags || '[]')
  }))
}

// 根据ID获取素材
export async function getMaterialById(id) {
  const db = await getDB()
  const material = await db.get(`SELECT * FROM materials WHERE id = ?`, [id])
  if (material) {
    material.tags = JSON.parse(material.tags || '[]')
  }
  return material
}

// 更新素材
export async function updateMaterial(id, updates) {
  const db = await getDB()
  const keys = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  await db.run(
    `UPDATE materials SET ${setClause} WHERE id = ?`,
    [...values, id]
  )
  return getMaterialById(id)
}

// 删除素材
export async function deleteMaterial(id) {
  const db = await getDB()
  await db.run(`DELETE FROM materials WHERE id = ?`, [id])
  return true
}

// 根据标签筛选素材
export async function getMaterialsByTag(tag) {
  const db = await getDB()
  const materials = await db.all(`SELECT * FROM materials WHERE tags LIKE ?`, [`%${tag}%`])
  return materials.map(m => ({
    ...m,
    tags: JSON.parse(m.tags || '[]')
  })).filter(m => m.tags.includes(tag))
}