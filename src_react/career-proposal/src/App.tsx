import { useState } from 'react'
import ProposalOverview from './components/ProposalOverview'
import ProposalDetails from './components/ProposalDetails'
import ProposalTimeline from './components/ProposalTimeline'
import ProposalResources from './components/ProposalResources'

function App() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  
  return (
    <div className="proposal-container">
      <div className="proposal-header">
        <h1>AI Workflow Proposal</h1>
        <p>
          An interactive proposal for implementing AI-powered workflows to streamline content creation, 
          management, and delivery processes across the organization.
        </p>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
        <button 
          className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
      </div>
      
      <div className={`tab-content ${activeTab === 'overview' ? 'active' : ''}`}>
        <ProposalOverview />
      </div>
      
      <div className={`tab-content ${activeTab === 'details' ? 'active' : ''}`}>
        <ProposalDetails />
      </div>
      
      <div className={`tab-content ${activeTab === 'timeline' ? 'active' : ''}`}>
        <ProposalTimeline />
      </div>
      
      <div className={`tab-content ${activeTab === 'resources' ? 'active' : ''}`}>
        <ProposalResources />
      </div>
    </div>
  )
}

export default App
