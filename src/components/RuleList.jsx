import React, { useEffect } from 'react'
import { useRuleStore } from '../store/ruleStore.js'

function RuleList() {
  const { rules, loading, error, loadRules, selectRule, deleteRule } = useRuleStore()

  useEffect(() => {
    loadRules()
  }, [loadRules])

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>错误: {error}</div>
  }

  return (
    <div className="rule-list">
      <h2>核心规则</h2>
      <div className="rule-list-content">
        {rules.map(rule => (
          <div key={rule.id} className="rule-item" onClick={() => selectRule(rule.id)}>
            <div className="rule-header">
              <h3>{rule.name}</h3>
              <span className="rule-type">{rule.type === 'power_system' ? '力量系统' : '世界法则'}</span>
            </div>
            <div className="rule-status">
              <span>状态: {rule.exists ? '存在' : '不存在'}</span>
            </div>
            {rule.limit.has_limit && (
              <div className="rule-limit">
                <span>限制: {rule.limit.description}</span>
              </div>
            )}
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('确定要删除这个规则吗？')) {
                  deleteRule(rule.id)
                }
              }}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RuleList