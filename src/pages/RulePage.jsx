import React, { useState } from 'react'
import RuleList from '../components/RuleList.jsx'
import GlobalParamList from '../components/GlobalParamList.jsx'
import RuleForm from '../components/RuleForm.jsx'
import GlobalParamForm from '../components/GlobalParamForm.jsx'

function RulePage() {
  const [activeTab, setActiveTab] = useState('rules')

  return (
    <div className="rule-page">
      <div className="page-header">
        <h1>世界规则管理</h1>
      </div>
      <div className="page-content">
        <div className="left-panel">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              核心规则
            </button>
            <button 
              className={`tab-button ${activeTab === 'params' ? 'active' : ''}`}
              onClick={() => setActiveTab('params')}
            >
              全局参数
            </button>
          </div>
          {activeTab === 'rules' && <RuleList />}
          {activeTab === 'params' && <GlobalParamList />}
        </div>
        <div className="right-panel">
          {activeTab === 'rules' && <RuleForm />}
          {activeTab === 'params' && <GlobalParamForm />}
        </div>
      </div>
    </div>
  )
}

export default RulePage