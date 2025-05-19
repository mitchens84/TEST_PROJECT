import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getStoredValue, setStoredValue } from '../utils/localStorageUtils';
import './ProposalOverview.css'; // Assuming you will create this CSS file

// Types
interface OverviewSection {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
  isCompleted: boolean; // For checkbox
}

interface ProposalOverviewProps {
  triggerNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
}

// Initial Data
const initialOverviewSections: OverviewSection[] = [
  {
    id: 'currentRole',
    title: 'Current Role & Responsibilities',
    content: 'Describe your current role, key responsibilities, and typical projects.',
    isExpanded: true,
    isCompleted: false,
  },
  {
    id: 'aspirations',
    title: 'Career Aspirations & Goals',
    content: 'Outline your short-term and long-term career goals. What kind of role are you seeking?',
    isExpanded: true,
    isCompleted: false,
  },
  {
    id: 'skillAlignment',
    title: 'Skill Alignment & Value Proposition',
    content: 'How do your current skills and experience align with your desired role? What unique value can you bring?',
    isExpanded: true,
    isCompleted: false,
  },
  {
    id: 'learningObjectives',
    title: 'Learning & Development Objectives',
    content: 'What new skills or knowledge do you aim to acquire in your next role?',
    isExpanded: false,
    isCompleted: false,
  },
];

function ProposalOverview({ triggerNotification }: ProposalOverviewProps) {
  const [sections, setSections] = useState<OverviewSection[]>(() =>
    getStoredValue(LOCAL_STORAGE_KEYS.overviewData, initialOverviewSections)
  );

  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.overviewData, sections);
  }, [sections]);

  const handleContentChange = (id: string, newContent: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, content: newContent } : section
      )
    );
  };

  const toggleSectionExpand = (id: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, isExpanded: !section.isExpanded } : section
      )
    );
  };

  const toggleSectionComplete = (id: string) => {
    setSections(prevSections =>
      prevSections.map(section => {
        if (section.id === id) {
          const newCompletedStatus = !section.isCompleted;
          triggerNotification(
            `Section "${section.title}" marked as ${newCompletedStatus ? 'complete' : 'incomplete'}.`,
            newCompletedStatus ? 'success' : 'info'
          );
          return { ...section, isCompleted: newCompletedStatus };
        }
        return section;
      })
    );
  };

  const resetOverviewData = () => {
    setSections(initialOverviewSections);
    triggerNotification('Overview data has been reset to initial values.', 'info');
  };

  return (
    <div className="proposal-overview proposal-section">
      <div className="section-header">
        <h2>Proposal Overview</h2>
        <button onClick={resetOverviewData} className="button-reset-section">
          Reset Overview Data
        </button>
      </div>

      {sections.map(section => (
        <div key={section.id} className={`overview-card ${section.isCompleted ? 'completed' : ''}`}>
          <div className="card-header" onClick={() => toggleSectionExpand(section.id)}>
            <h3>{section.title}</h3>
            <div className="card-actions">
              <input 
                type="checkbox" 
                checked={section.isCompleted}
                onChange={(e) => {
                  e.stopPropagation(); // Prevent card from expanding/collapsing
                  toggleSectionComplete(section.id);
                }}
                title={section.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                className="section-checkbox"
              />
              <span className="expand-toggle">{section.isExpanded ? '▼' : '►'}</span>
            </div>
          </div>
          {section.isExpanded && (
            <div className="card-content">
              <textarea
                value={section.content}
                onChange={e => handleContentChange(section.id, e.target.value)}
                rows={5}
                placeholder={`Enter details for ${section.title}...`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProposalOverview;
