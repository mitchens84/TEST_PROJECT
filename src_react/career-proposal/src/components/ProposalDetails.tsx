import { useState, useEffect } from 'react'

interface TechComponent {
  name: string;
  description: string;
  implementation: number;
}

// Initial components data
const initialTechComponents: TechComponent[] = [
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
];

// Initial metrics data
const initialMetrics = {
  timeReduction: 35,
  qualityImprovement: 25,
  publishSpeed: 40,
  contentReuse: 50
};

// Storage keys
const COMPONENTS_STORAGE_KEY = 'careerProposal_components';
const METRICS_STORAGE_KEY = 'careerProposal_metrics';

const ProposalDetails = () => {
  // Initialize tech components from localStorage or fall back to initial data
  const [techComponents, setTechComponents] = useState<TechComponent[]>(() => {
    if (typeof window === 'undefined') return initialTechComponents;
    
    try {
      const savedComponents = localStorage.getItem(COMPONENTS_STORAGE_KEY);
      return savedComponents ? JSON.parse(savedComponents) : initialTechComponents;
    } catch (error) {
      console.error('Error loading component data from localStorage:', error);
      return initialTechComponents;
    }
  });
  
  // Initialize metrics from localStorage or fall back to initial data
  const [metrics, setMetrics] = useState(() => {
    if (typeof window === 'undefined') return initialMetrics;
    
    try {
      const savedMetrics = localStorage.getItem(METRICS_STORAGE_KEY);
      return savedMetrics ? JSON.parse(savedMetrics) : initialMetrics;
    } catch (error) {
      console.error('Error loading metrics data from localStorage:', error);
      return initialMetrics;
    }
  });
  
  // Save to localStorage whenever techComponents changes
  useEffect(() => {
    try {
      localStorage.setItem(COMPONENTS_STORAGE_KEY, JSON.stringify(techComponents));
    } catch (error) {
      console.error('Error saving component data to localStorage:', error);
    }
  }, [techComponents]);
  
  // Save to localStorage whenever metrics changes
  useEffect(() => {
    try {
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
    } catch (error) {
      console.error('Error saving metrics data to localStorage:', error);
    }
  }, [metrics]);
  
  const handleImplementationChange = (index: number, value: number) => {
    const newComponents = [...techComponents];
    newComponents[index].implementation = value;
    setTechComponents(newComponents);
  };
  
  // Reset all data to initial values
  const resetData = () => {
    if (confirm('Reset all implementation progress and metrics to their initial values?')) {
      setTechComponents(initialTechComponents);
      setMetrics(initialMetrics);
    }
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Proposal Details</h2>
        <button 
          onClick={resetData} 
          style={{ 
            backgroundColor: '#6b7280', 
            fontSize: '0.8rem',
            padding: '0.4rem 0.8rem' 
          }}
        >
          Reset Progress
        </button>
      </div>
      
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
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={metrics.timeReduction}
              onChange={(e) => setMetrics({...metrics, timeReduction: Number(e.target.value)})}
              style={{ width: '100%' }}
            />
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
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={metrics.qualityImprovement}
              onChange={(e) => setMetrics({...metrics, qualityImprovement: Number(e.target.value)})}
              style={{ width: '100%' }}
            />
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
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={metrics.publishSpeed}
              onChange={(e) => setMetrics({...metrics, publishSpeed: Number(e.target.value)})}
              style={{ width: '100%' }}
            />
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
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={metrics.contentReuse}
              onChange={(e) => setMetrics({...metrics, contentReuse: Number(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#6b7280' }}>
        <p>Note: Your implementation progress and metrics are saved locally in your browser.</p>
      </div>
    </div>
  )
}

export default ProposalDetails
