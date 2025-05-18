import { useState } from 'react'

interface Section {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ProposalOverview = () => {
  const [sections] = useState<Section[]>([
    {
      id: 'intro',
      title: 'Introduction',
      content: `This proposal outlines the implementation of AI-powered workflows across our content management systems. 
      The primary goal is to enhance efficiency, reduce manual workload, and improve the quality of our outputs through smart automation.
      
      Our team has identified several opportunities where AI can significantly improve our processes.`,
      status: 'approved'
    },
    {
      id: 'problem',
      title: 'Problem Statement',
      content: `Current content creation and management workflows are heavily manual, leading to:
      - Inconsistent content quality
      - Bottlenecks in review and approval processes
      - Difficulty maintaining content across multiple platforms
      - Challenges in content discoverability and reuse
      - Limited ability to scale content production`,
      status: 'approved'
    },
    {
      id: 'solution',
      title: 'Proposed Solution',
      content: `We propose implementing an AI-enhanced content workflow that includes:
      1. AI-powered content analysis for quality, readability, and SEO
      2. Automated tagging and categorization of content
      3. Smart content suggestions based on existing materials
      4. Intelligent workflow routing based on content type and priority
      5. Automated quality checks at each stage of content development`,
      status: 'pending'
    },
    {
      id: 'benefits',
      title: 'Expected Benefits',
      content: `The implementation of this system is expected to yield:
      - 35% reduction in time spent on manual content tasks
      - 25% improvement in content quality metrics
      - 40% faster time-to-publish for standard content
      - 50% increase in content reuse through better discoverability
      - Improved consistency across all content channels`,
      status: 'pending'
    }
  ])
  
  const [expandedSections, setExpandedSections] = useState<string[]>(['intro'])
  
  const toggleSection = (id: string) => {
    if (expandedSections.includes(id)) {
      setExpandedSections(expandedSections.filter(sectionId => sectionId !== id))
    } else {
      setExpandedSections([...expandedSections, id])
    }
  }
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Needs Revision';
      default: return 'Pending Review';
    }
  }
  
  return (
    <div>
      <h2>Proposal Overview</h2>
      
      {sections.map(section => (
        <div 
          key={section.id}
          className={`card ${!expandedSections.includes(section.id) ? 'collapsed' : ''}`}
        >
          <div className="card-header" onClick={() => toggleSection(section.id)}>
            <h3>{section.title}</h3>
            <div>
              <span className={`status ${section.status}`}>{getStatusLabel(section.status)}</span>
              <span style={{ marginLeft: '10px' }}>
                {expandedSections.includes(section.id) ? '▼' : '►'}
              </span>
            </div>
          </div>
          <div className="card-content" style={{ 
            maxHeight: expandedSections.includes(section.id) ? '500px' : '0'
          }}>
            <p style={{ whiteSpace: 'pre-line' }}>{section.content}</p>
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => setExpandedSections(sections.map(s => s.id))}>
          Expand All
        </button>
        <button 
          onClick={() => setExpandedSections([])} 
          style={{ marginLeft: '10px', backgroundColor: '#6b7280' }}
        >
          Collapse All
        </button>
      </div>
    </div>
  )
}

export default ProposalOverview
