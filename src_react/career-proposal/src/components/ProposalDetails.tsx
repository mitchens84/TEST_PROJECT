import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getStoredValue, setStoredValue } from '../utils/localStorageUtils';
import './ProposalDetails.css'; // Assuming you will create this CSS file

// Types
interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
  isExpanded: boolean;
}

interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0-100 scale
  description: string;
}

interface ProjectHighlight {
  id: string;
  title: string;
  description: string;
  technologies: string;
  outcome: string;
  isExpanded: boolean;
}

interface ProposalDetailsProps {
  triggerNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
}

// Initial Data
const initialSkillCategories: SkillCategory[] = [
  {
    id: 'technicalSkills',
    name: 'Technical Skills',
    isExpanded: true,
    skills: [
      { id: 'ts1', name: 'React & TypeScript', proficiency: 90, description: 'Building complex UIs, state management, component architecture.' },
      { id: 'ts2', name: 'Node.js & Express', proficiency: 80, description: 'Developing RESTful APIs, server-side logic.' },
      { id: 'ts3', name: 'Python (Data Analysis & AI)', proficiency: 75, description: 'Pandas, NumPy, Scikit-learn, basic model implementation.' },
      { id: 'ts4', name: 'Cloud Platforms (AWS/Azure)', proficiency: 65, description: 'Basic deployment, serverless functions, storage solutions.' },
    ],
  },
  {
    id: 'softSkills',
    name: 'Soft Skills & Competencies',
    isExpanded: true,
    skills: [
      { id: 'ss1', name: 'Problem Solving', proficiency: 95, description: 'Analytical thinking, identifying root causes, developing solutions.' },
      { id: 'ss2', name: 'Communication', proficiency: 85, description: 'Clear articulation, active listening, technical and non-technical audiences.' },
      { id: 'ss3', name: 'Team Collaboration', proficiency: 90, description: 'Working effectively in agile teams, knowledge sharing.' },
    ],
  },
];

const initialProjectHighlights: ProjectHighlight[] = [
  {
    id: 'proj1',
    title: 'AI-Powered Content Recommendation Engine',
    description: 'Led the development of a system that increased user engagement by 25%.',
    technologies: 'Python, Scikit-learn, React, AWS Lambda',
    outcome: 'Successfully launched, exceeded engagement targets.',
    isExpanded: true,
  },
  {
    id: 'proj2',
    title: 'Enterprise CRM Platform UI Overhaul',
    description: 'Redesigned and implemented a new user interface, improving usability scores by 40%.',
    technologies: 'TypeScript, React, Figma, Storybook',
    outcome: 'Positive user feedback, reduced support tickets.',
    isExpanded: false,
  },
];

function ProposalDetails({ triggerNotification }: ProposalDetailsProps) {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() =>
    getStoredValue(LOCAL_STORAGE_KEYS.detailsData + '_skills', initialSkillCategories)
  );
  const [projectHighlights, setProjectHighlights] = useState<ProjectHighlight[]>(() =>
    getStoredValue(LOCAL_STORAGE_KEYS.detailsData + '_projects', initialProjectHighlights)
  );

  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.detailsData + '_skills', skillCategories);
  }, [skillCategories]);

  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.detailsData + '_projects', projectHighlights);
  }, [projectHighlights]);

  const handleSkillChange = (categoryId: string, skillId: string, field: keyof Skill, value: string | number) => {
    setSkillCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          skills: category.skills.map(skill =>
            skill.id === skillId ? { ...skill, [field]: value } : skill
          ),
        };
      }
      return category;
    }));
  };

  const handleProjectChange = (projectId: string, field: keyof ProjectHighlight, value: string) => {
    setProjectHighlights(prev => prev.map(project =>
      project.id === projectId ? { ...project, [field]: value } : project
    ));
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setSkillCategories(prev => prev.map(category =>
      category.id === categoryId ? { ...category, isExpanded: !category.isExpanded } : category
    ));
  };

  const toggleProjectExpand = (projectId: string) => {
    setProjectHighlights(prev => prev.map(project =>
      project.id === projectId ? { ...project, isExpanded: !project.isExpanded } : project
    ));
  };

  const resetDetailsData = () => {
    setSkillCategories(initialSkillCategories);
    setProjectHighlights(initialProjectHighlights);
    triggerNotification('Proposal details (skills and projects) have been reset.', 'info');
  };

  return (
    <div className="proposal-details proposal-section">
      <div className="section-header">
        <h2>Detailed Profile</h2>
        <button onClick={resetDetailsData} className="button-reset-section">
          Reset Details Data
        </button>
      </div>

      {/* Skills Section */}
      <h3 className="subsection-title">Skills & Proficiencies</h3>
      {skillCategories.map(category => (
        <div key={category.id} className="details-card category-card">
          <div className="card-header" onClick={() => toggleCategoryExpand(category.id)}>
            <h4>{category.name}</h4>
            <span className="expand-toggle">{category.isExpanded ? '▼' : '►'}</span>
          </div>
          {category.isExpanded && (
            <div className="card-content">
              {category.skills.map(skill => (
                <div key={skill.id} className="skill-item">
                  <label htmlFor={`${skill.id}-name`}>{skill.name}</label>
                  <input 
                    type="text" 
                    id={`${skill.id}-name`} 
                    value={skill.name} 
                    onChange={(e) => handleSkillChange(category.id, skill.id, 'name', e.target.value)} 
                    className="skill-name-input"
                  />
                  <div className="proficiency-slider">
                    <input
                      type="range"
                      id={`${skill.id}-proficiency`}
                      min="0"
                      max="100"
                      value={skill.proficiency}
                      onChange={(e) => handleSkillChange(category.id, skill.id, 'proficiency', parseInt(e.target.value))}
                    />
                    <span>{skill.proficiency}%</span>
                  </div>
                  <textarea
                    id={`${skill.id}-description`}
                    value={skill.description}
                    onChange={(e) => handleSkillChange(category.id, skill.id, 'description', e.target.value)}
                    rows={2}
                    placeholder="Brief description of skill/experience..."
                    className="skill-description-input"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Project Highlights Section */}
      <h3 className="subsection-title">Project Highlights</h3>
      {projectHighlights.map(project => (
        <div key={project.id} className="details-card project-card">
          <div className="card-header" onClick={() => toggleProjectExpand(project.id)}>
            <h4>{project.title}</h4>
            <span className="expand-toggle">{project.isExpanded ? '▼' : '►'}</span>
          </div>
          {project.isExpanded && (
            <div className="card-content">
              <label htmlFor={`${project.id}-title`}>Project Title:</label>
              <input type="text" id={`${project.id}-title`} value={project.title} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} />
              
              <label htmlFor={`${project.id}-description`}>Description:</label>
              <textarea id={`${project.id}-description`} value={project.description} onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} rows={3} />
              
              <label htmlFor={`${project.id}-technologies`}>Technologies Used:</label>
              <input type="text" id={`${project.id}-technologies`} value={project.technologies} onChange={(e) => handleProjectChange(project.id, 'technologies', e.target.value)} />
              
              <label htmlFor={`${project.id}-outcome`}>Outcome/Impact:</label>
              <textarea id={`${project.id}-outcome`} value={project.outcome} onChange={(e) => handleProjectChange(project.id, 'outcome', e.target.value)} rows={2} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProposalDetails;
