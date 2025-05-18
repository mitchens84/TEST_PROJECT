import { useState } from 'react'

interface TechComponent {
  name: string;
  description: string;
  implementation: number;
}

const ProposalDetails = () => {
  const [techComponents, setTechComponents] = useState<TechComponent[]>([
    {
      name: 'Content Analysis Engine',
      description: 'Analyzes content for readability, SEO optimization, brand compliance, and overall quality.',
      implementation: 65
    },
    {
      name: 'Workflow Automation',
      description: 'Routes content to appropriate stakeholders based on content type, priority, and other factors.',
      implementation: 40
    },
    {
      name: 'Smart Content Suggestions',
      description: 'Uses existing content to suggest related materials, references, and reusable components.',
      implementation: 25
    },
    {
      name: 'Automated Tagging System',
      description: 'Automatically generates and applies tags to content for better organization and discoverability.',
      implementation: 80
    },
    {
      name: 'Quality Assurance Module',
      description: 'Performs automated checks for content quality, consistency, and compliance with guidelines.',
      implementation: 55
    }
  ])
  
  const [metrics] = useState({
    timeReduction: 35,
    qualityImprovement: 25,
    publishSpeed: 40,
    contentReuse: 50
  })
  
  const handleImplementationChange = (index: number, value: number) => {
    const newComponents = [...techComponents]
    newComponents[index].implementation = value
    setTechComponents(newComponents)
  }
  
  return (
    <div>
      <h2>Proposal Details</h2>
      
      <div className="section">
        <h3>Technical Components</h3>
        <p>
          The proposed AI workflow system consists of several key components that work together
          to streamline the content creation and management process.
        </p>
        
        {techComponents.map((component, index) => (
          <div key={index} className="card">
            <h3>{component.name}</h3>
            <p>{component.description}</p>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Implementation Progress:</span>
                <span>{component.implementation}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${component.implementation}%` }}
                ></div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={component.implementation}
                onChange={(e) => handleImplementationChange(index, Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="section">
        <h3>Key Performance Indicators</h3>
        <p>
          The success of this proposal will be measured against the following key metrics.
          Initial targets are shown below but can be adjusted as the project progresses.
        </p>
        
        <div className="card">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Reduction in Manual Tasks:</span>
              <span>{metrics.timeReduction}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${metrics.timeReduction}%` }}
              ></div>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Content Quality Improvement:</span>
              <span>{metrics.qualityImprovement}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${metrics.qualityImprovement}%` }}
              ></div>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Publishing Speed Increase:</span>
              <span>{metrics.publishSpeed}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${metrics.publishSpeed}%` }}
              ></div>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Content Reuse Improvement:</span>
              <span>{metrics.contentReuse}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${metrics.contentReuse}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalDetails
