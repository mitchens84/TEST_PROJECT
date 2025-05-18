import { useState, useEffect } from 'react'

interface TimelineItem {
  id: string;
  phase: string;
  tasks: {
    id: string;
    name: string;
    completed: boolean;
  }[];
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed';
}

// Initial timeline data
const initialTimelineItems: TimelineItem[] = [
  {
    id: 'phase1',
    phase: 'Phase 1: Requirements & Planning',
    tasks: [
      { id: 'task1_1', name: 'Stakeholder interviews', completed: true },
      { id: 'task1_2', name: 'Current workflow analysis', completed: true },
      { id: 'task1_3', name: 'Requirements documentation', completed: false },
      { id: 'task1_4', name: 'Technical architecture planning', completed: false },
    ],
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'in-progress'
  },
  {
    id: 'phase2',
    phase: 'Phase 2: Design & Development',
    tasks: [
      { id: 'task2_1', name: 'User interface design', completed: false },
      { id: 'task2_2', name: 'Backend API development', completed: false },
      { id: 'task2_3', name: 'AI model training', completed: false },
      { id: 'task2_4', name: 'Integration with existing systems', completed: false },
    ],
    startDate: '2025-07-01',
    endDate: '2025-08-31',
    status: 'planned'
  },
  {
    id: 'phase3',
    phase: 'Phase 3: Testing & Validation',
    tasks: [
      { id: 'task3_1', name: 'User acceptance testing', completed: false },
      { id: 'task3_2', name: 'Performance testing', completed: false },
      { id: 'task3_3', name: 'Security audit', completed: false },
      { id: 'task3_4', name: 'Bug fixes and refinements', completed: false },
    ],
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    status: 'planned'
  },
  {
    id: 'phase4',
    phase: 'Phase 4: Deployment & Training',
    tasks: [
      { id: 'task4_1', name: 'Production deployment', completed: false },
      { id: 'task4_2', name: 'User training sessions', completed: false },
      { id: 'task4_3', name: 'Documentation finalization', completed: false },
      { id: 'task4_4', name: 'Transition to support team', completed: false },
    ],
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: 'planned'
  }
];

// Unique key for storing data in localStorage
const STORAGE_KEY = 'careerProposal_timeline';

const ProposalTimeline = () => {
  // Initialize state from localStorage or fall back to initial data
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(() => {
    if (typeof window === 'undefined') return initialTimelineItems;
    
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      return savedItems ? JSON.parse(savedItems) : initialTimelineItems;
    } catch (error) {
      console.error('Error loading timeline data from localStorage:', error);
      return initialTimelineItems;
    }
  });
  
  // Save to localStorage whenever timelineItems changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timelineItems));
    } catch (error) {
      console.error('Error saving timeline data to localStorage:', error);
    }
  }, [timelineItems]);
  
  const toggleTask = (phaseId: string, taskId: string) => {
    setTimelineItems(timelineItems.map(item => {
      if (item.id === phaseId) {
        return {
          ...item,
          tasks: item.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed }
            }
            return task
          })
        }
      }
      return item
    }));
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'planned': return '#6b7280';
      default: return '#6b7280';
    }
  };
  
  const calculateProgress = (tasks: { completed: boolean }[]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Reset all task states to initial values
  const resetTasks = () => {
    if (confirm('Reset all tasks to their initial state?')) {
      setTimelineItems(initialTimelineItems);
    }
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Project Timeline</h2>
        <button 
          onClick={resetTasks} 
          style={{ 
            backgroundColor: '#6b7280', 
            fontSize: '0.8rem',
            padding: '0.4rem 0.8rem' 
          }}
        >
          Reset All Tasks
        </button>
      </div>
      
      <div className="section">
        {timelineItems.map(item => {
          const progress = calculateProgress(item.tasks);
          
          return (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{item.phase}</h3>
                <span 
                  className="status" 
                  style={{ 
                    backgroundColor: `${getStatusColor(item.status)}20`, 
                    color: getStatusColor(item.status)
                  }}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                <span>{progress}% Complete</span>
              </div>
              
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <ul className="task-list">
                {item.tasks.map(task => (
                  <li key={task.id} className="task-item">
                    <input 
                      type="checkbox" 
                      className="task-checkbox" 
                      checked={task.completed}
                      onChange={() => toggleTask(item.id, task.id)}
                    />
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#6b7280' }}>
        <p>Note: Your task progress is saved locally in your browser.</p>
      </div>
    </div>
  )
}

export default ProposalTimeline
