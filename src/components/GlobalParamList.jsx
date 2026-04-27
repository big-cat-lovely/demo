import React, { useEffect } from 'react'
import { useRuleStore } from '../store/ruleStore.js'

function GlobalParamList() {
  const { globalParams, loading, error, loadGlobalParams, selectParam, deleteGlobalParam } = useRuleStore()

  useEffect(() => {
    loadGlobalParams()
  }, [loadGlobalParams])

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>错误: {error}</div>
  }

  return (
    <div className="global-param-list">
      <h2>全局参数</h2>
      <div className="global-param-list-content">
        {globalParams.map(param => (
          <div key={param.key} className="global-param-item" onClick={() => selectParam(param.key)}>
            <div className="global-param-header">
              <h3>{param.key}</h3>
              <span className="global-param-type">{param.type}</span>
            </div>
            <div className="global-param-value">
              <span>值: {param.value}</span>
            </div>
            {param.min !== undefined && param.max !== undefined && (
              <div className="global-param-range">
                <span>范围: {param.min} - {param.max}</span>
              </div>
            )}
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('确定要删除这个全局参数吗？')) {
                  deleteGlobalParam(param.key)
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

export default GlobalParamList