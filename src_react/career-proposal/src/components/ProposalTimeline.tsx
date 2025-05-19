import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getStoredValue, setStoredValue } from '../utils/localStorageUtils';
import './ProposalTimeline.css'; // Assuming you will create this CSS file

// Types
interface TimelinePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  isExpanded: boolean;
}

interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
  notes: string;
}

interface ProposalTimelineProps {
  triggerNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
}

// Initial Data
const initialTimelinePhases: TimelinePhase[] = [
  {
    id: 'phase1',
    name: 'Phase 1: Research & Skill Inventory (Q3 2025)',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    isExpanded: true,
    tasks: [
      { id: 't1_1', name: 'Identify 3-5 target roles/companies', isCompleted: false, notes: '' },
      { id: 't1_2', name: 'Analyze job descriptions for required skills', isCompleted: false, notes: '' },
      { id: 't1_3', name: 'Complete current skills self-assessment', isCompleted: false, notes: '' },
      { id: 't1_4', name: 'Identify skill gaps for target roles', isCompleted: false, notes: '' },
    ],
  },
  {
    id: 'phase2',
    name: 'Phase 2: Learning & Portfolio Development (Q4 2025)',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    isExpanded: true,
    tasks: [
      { id: 't2_1', name: 'Enroll in 1-2 courses for key skills', isCompleted: false, notes: '' },
      { id: 't2_2', name: 'Develop 2 new portfolio projects', isCompleted: false, notes: '' },
      { id: 't2_3', name: 'Update resume and LinkedIn profile', isCompleted: false, notes: '' },
      { id: 't2_4', name: 'Network with professionals in target field', isCompleted: false, notes: '' },
    ],
  },
  {
    id: 'phase3',
    name: 'Phase 3: Application & Interviewing (Q1 2026)',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    isExpanded: false,
    tasks: [
      { id: 't3_1', name: 'Apply to 10-15 targeted positions', isCompleted: false, notes: '' },
      { id: 't3_2', name: 'Prepare for common interview questions', isCompleted: false, notes: '' },
      { id: 't3_3', name: 'Conduct mock interviews', isCompleted: false, notes: '' },
    ],
  },
];

function ProposalTimeline({ triggerNotification }: ProposalTimelineProps) {
  const [phases, setPhases] = useState<TimelinePhase[]>(() =>
    getStoredValue(LOCAL_STORAGE_KEYS.timelineData, initialTimelinePhases)
  );

  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.timelineData, phases);
  }, [phases]);

  const handleTaskChange = (phaseId: string, taskId: string, field: keyof Task, value: string | boolean) => {
    setPhases(prevPhases =>
      prevPhases.map(phase => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            tasks: phase.tasks.map(task => {
              if (task.id === taskId) {
                if (field === 'isCompleted') {
                  triggerNotification(
                    `Task "${task.name}" marked as ${value ? 'complete' : 'incomplete'}.`,
                    value ? 'success' : 'info'
                  );
                }
                return { ...task, [field]: value };
              }
              return task;
            }),
          };
        }
        return phase;
      })
    );
  };

  const handlePhaseChange = (phaseId: string, field: keyof Omit<TimelinePhase, 'tasks' | 'isExpanded'>, value: string) => {
    setPhases(prevPhases =>
      prevPhases.map(phase =>
        phase.id === phaseId ? { ...phase, [field]: value } : phase
      )
    );
  };

  const togglePhaseExpand = (phaseId: string) => {
    setPhases(prevPhases =>
      prevPhases.map(phase =>
        phase.id === phaseId ? { ...phase, isExpanded: !phase.isExpanded } : phase
      )
    );
  };

  const resetTimelineData = () => {
    setPhases(initialTimelinePhases);
    triggerNotification('Timeline data has been reset to defaults.', 'info');
  };
  
  const calculatePhaseProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  return (
    <div className="proposal-timeline proposal-section">
      <div className="section-header">
        <h2>Project Timeline & Milestones</h2>
        <button onClick={resetTimelineData} className="button-reset-section">
          Reset Timeline Data
        </button>
      </div>

      {phases.map(phase => {
        const progress = calculatePhaseProgress(phase.tasks);
        return (
          <div key={phase.id} className={`timeline-card phase-card ${progress === 100 ? 'phase-completed' : ''}`}>
            <div className="card-header" onClick={() => togglePhaseExpand(phase.id)}>
              <div className="phase-header-info">
                <h4>{phase.name}</h4>
                <div className="phase-dates">
                  <input type="date" value={phase.startDate} onChange={(e) => handlePhaseChange(phase.id, 'startDate', e.target.value)} onClick={(e) => e.stopPropagation()} />
                  <span> - </span>
                  <input type="date" value={phase.endDate} onChange={(e) => handlePhaseChange(phase.id, 'endDate', e.target.value)} onClick={(e) => e.stopPropagation()} />
                </div>
              </div>
              <div className="phase-header-actions">
                <span className="phase-progress">{progress}%</span>
                <span className="expand-toggle">{phase.isExpanded ? '▼' : '►'}</span>
              </div>
            </div>
            {phase.isExpanded && (
              <div className="card-content">
                <div className="progress-bar-container" style={{ marginBottom: '1rem' }}>
                  <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: 'var(--primary-color)' }}></div>
                </div>
                {phase.tasks.map(task => (
                  <div key={task.id} className={`task-item ${task.isCompleted ? 'task-completed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={(e) => handleTaskChange(phase.id, task.id, 'isCompleted', e.target.checked)}
                      className="task-checkbox"
                    />
                    <input 
                        type="text" 
                        value={task.name} 
                        onChange={(e) => handleTaskChange(phase.id, task.id, 'name', e.target.value)} 
                        className="task-name-input"
                    />
                    <textarea
                      value={task.notes}
                      onChange={(e) => handleTaskChange(phase.id, task.id, 'notes', e.target.value)}
                      rows={1}
                      placeholder="Notes..."
                      className="task-notes-input"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProposalTimeline;
