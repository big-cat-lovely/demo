import { getDB } from './db.js'

// 创建规则
export async function createRule(rule) {
  const db = await getDB()
  await db.run(
    `INSERT INTO rules (id, name, type, exists, properties, limit_description, has_limit) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [rule.id, rule.name, rule.type, rule.exists ? 1 : 0, JSON.stringify(rule.properties), rule.limit?.description, rule.limit?.has_limit ? 1 : 0]
  )
  return rule
}

// 获取所有规则
export async function getAllRules() {
  const db = await getDB()
  const rules = await db.all(`SELECT * FROM rules`)
  return rules.map(r => ({
    ...r,
    exists: r.exists === 1,
    properties: JSON.parse(r.properties || '{}'),
    limit: {
      has_limit: r.has_limit === 1,
      description: r.limit_description
    }
  }))
}

// 根据ID获取规则
export async function getRuleById(id) {
  const db = await getDB()
  const rule = await db.get(`SELECT * FROM rules WHERE id = ?`, [id])
  if (rule) {
    rule.exists = rule.exists === 1
    rule.properties = JSON.parse(rule.properties || '{}')
    rule.limit = {
      has_limit: rule.has_limit === 1,
      description: rule.limit_description
    }
  }
  return rule
}

// 更新规则
export async function updateRule(id, updates) {
  const db = await getDB()
  const keys = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  await db.run(
    `UPDATE rules SET ${setClause} WHERE id = ?`,
    [...values, id]
  )
  return getRuleById(id)
}

// 删除规则
export async function deleteRule(id) {
  const db = await getDB()
  await db.run(`DELETE FROM rules WHERE id = ?`, [id])
  return true
}

// 创建全局参数
export async function createGlobalParam(param) {
  const db = await getDB()
  await db.run(
    `INSERT INTO global_params (key, type, min, max, value) 
     VALUES (?, ?, ?, ?, ?)`,
    [param.key, param.type, param.min, param.max, JSON.stringify(param.value)]
  )
  return param
}

// 获取所有全局参数
export async function getAllGlobalParams() {
  const db = await getDB()
  const params = await db.all(`SELECT * FROM global_params`)
  return params.map(p => ({
    ...p,
    value: JSON.parse(p.value)
  }))
}

// 根据键获取全局参数
export async function getGlobalParamByKey(key) {
  const db = await getDB()
  const param = await db.get(`SELECT * FROM global_params WHERE key = ?`, [key])
  if (param) {
    param.value = JSON.parse(param.value)
  }
  return param
}

// 更新全局参数
export async function updateGlobalParam(key, updates) {
  const db = await getDB()
  const keys = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = keys.map(key => `${key} = ?`).join(', ')
  await db.run(
    `UPDATE global_params SET ${setClause} WHERE key = ?`,
    [...values, key]
  )
  return getGlobalParamByKey(key)
}

// 删除全局参数
export async function deleteGlobalParam(key) {
  const db = await getDB()
  await db.run(`DELETE FROM global_params WHERE key = ?`, [key])
  return true
}