import { useState, useEffect } from 'react'

interface Section {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Initial sections data
const initialSections: Section[] = [
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
];

// Storage keys
const SECTIONS_STORAGE_KEY = 'careerProposal_sections';
const EXPANDED_SECTIONS_STORAGE_KEY = 'careerProposal_expandedSections';

const ProposalOverview = () => {
  // Initialize sections from localStorage or fall back to initial data
  const [sections, setSections] = useState<Section[]>(() => {
    if (typeof window === 'undefined') return initialSections;
    
    try {
      const savedSections = localStorage.getItem(SECTIONS_STORAGE_KEY);
      return savedSections ? JSON.parse(savedSections) : initialSections;
    } catch (error) {
      console.error('Error loading sections from localStorage:', error);
      return initialSections;
    }
  });
  
  // Initialize expanded sections from localStorage or default to only first section
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['intro'];
    
    try {
      const savedExpandedSections = localStorage.getItem(EXPANDED_SECTIONS_STORAGE_KEY);
      return savedExpandedSections ? JSON.parse(savedExpandedSections) : ['intro'];
    } catch (error) {
      console.error('Error loading expanded sections from localStorage:', error);
      return ['intro'];
    }
  });
  
  // Save sections to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
    } catch (error) {
      console.error('Error saving sections to localStorage:', error);
    }
  }, [sections]);
  
  // Save expanded sections to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_SECTIONS_STORAGE_KEY, JSON.stringify(expandedSections));
    } catch (error) {
      console.error('Error saving expanded sections to localStorage:', error);
    }
  }, [expandedSections]);
  
  const toggleSection = (id: string) => {
    if (expandedSections.includes(id)) {
      setExpandedSections(expandedSections.filter(sectionId => sectionId !== id));
    } else {
      setExpandedSections([...expandedSections, id]);
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Needs Revision';
      default: return 'Pending Review';
    }
  };
  
  // Update section status
  const updateSectionStatus = (sectionId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, status: newStatus };
      }
      return section;
    }));
  };
  
  // Reset all data to initial values
  const resetData = () => {
    if (confirm('Reset all section data to initial values?')) {
      setSections(initialSections);
      setExpandedSections(['intro']);
    }
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Proposal Overview</h2>
        <button 
          onClick={resetData} 
          style={{ 
            backgroundColor: '#6b7280', 
            fontSize: '0.8rem',
            padding: '0.4rem 0.8rem' 
          }}
        >
          Reset Data
        </button>
      </div>
      
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
            
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  updateSectionStatus(section.id, 'approved');
                }}
                style={{ 
                  backgroundColor: section.status === 'approved' ? '#10b981' : undefined,
                  marginRight: '0.5rem'
                }}
              >
                Approve
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  updateSectionStatus(section.id, 'rejected');
                }}
                style={{ 
                  backgroundColor: section.status === 'rejected' ? '#ef4444' : undefined,
                  marginRight: '0.5rem'
                }}
              >
                Needs Revision
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  updateSectionStatus(section.id, 'pending');
                }}
                style={{ 
                  backgroundColor: section.status === 'pending' ? '#f59e0b' : undefined 
                }}
              >
                Mark Pending
              </button>
            </div>
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
      
      <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#6b7280' }}>
        <p>Note: Your section status changes and expanded sections are saved locally in your browser.</p>
      </div>
    </div>
  )
}

export default ProposalOverview
