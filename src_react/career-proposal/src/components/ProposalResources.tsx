import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getStoredValue, setStoredValue } from '../utils/localStorageUtils';
import './ProposalResources.css'; // Assuming you will create this CSS file

// Types
interface ResourceCategory {
  id: string;
  name: string;
  resources: ResourceItem[];
  isExpanded: boolean;
}

interface ResourceItem {
  id: string;
  name: string;
  type: 'Course' | 'Book' | 'Mentor' | 'Tool' | 'Community' | 'Other';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Ongoing';
  notes: string;
  cost?: number; // Optional
  link?: string; // Optional
}

interface Budget {
  allocated: number;
  spent: number;
}

interface ProposalResourcesProps {
  triggerNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
}

// Initial Data
const initialResourceCategories: ResourceCategory[] = [
  {
    id: 'learning',
    name: 'Learning & Development',
    isExpanded: true,
    resources: [
      { id: 'lr1', name: 'Advanced TypeScript Course', type: 'Course', status: 'Not Started', notes: 'Focus on advanced patterns and performance.', cost: 199, link: '' },
      { id: 'lr2', name: 'Python for AI/ML Specialization', type: 'Course', status: 'In Progress', notes: 'Completing module 3 of 5.', cost: 499, link: '' },
      { id: 'lr3', name: '"Designing Data-Intensive Applications" by Martin Kleppmann', type: 'Book', status: 'Not Started', notes: 'Recommended for system design.', cost: 50, link: '' },
    ],
  },
  {
    id: 'networking',
    name: 'Networking & Mentorship',
    isExpanded: true,
    resources: [
      { id: 'nm1', name: 'Industry Mentor (TBD)', type: 'Mentor', status: 'Not Started', notes: 'Seek mentor in target AI/ML field.' },
      { id: 'nm2', name: 'Local Tech Meetup Group', type: 'Community', status: 'Ongoing', notes: 'Attend monthly meetings.', link: '' },
    ],
  },
  {
    id: 'tools',
    name: 'Tools & Software',
    isExpanded: true,
    resources: [
      { id: 'tl1', name: 'VS Code Pro Subscription', type: 'Tool', status: 'Ongoing', notes: 'For advanced features.', cost: 100, link: '' }, // Assuming annual
      { id: 'tl2', name: 'Cloud Computing Credits (AWS/Azure)', type: 'Tool', status: 'Ongoing', notes: 'For portfolio projects.', cost: 50, link: '' }, // Assuming monthly
    ],
  },
];

const initialBudget: Budget = {
  allocated: 1000, // Example initial budget
  spent: 0, // Calculated from resource costs
};

function ProposalResources({ triggerNotification }: ProposalResourcesProps) {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>(() =>
    getStoredValue(LOCAL_STORAGE_KEYS.resourcesData + '_categories', initialResourceCategories)
  );
  const [budget, setBudget] = useState<Budget>(() =>
    getStoredValue(LOCAL_STORAGE_KEYS.resourcesData + '_budget', initialBudget)
  );

  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.resourcesData + '_categories', resourceCategories);
    // Recalculate spent budget whenever resources change
    const totalSpent = resourceCategories.reduce((acc, category) =>
      acc + category.resources.reduce((catAcc, resource) => catAcc + (resource.cost || 0), 0)
    , 0);
    setBudget(prevBudget => ({ ...prevBudget, spent: totalSpent }));
  }, [resourceCategories]);

  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.resourcesData + '_budget', budget);
  }, [budget]);

  const handleResourceChange = (categoryId: string, resourceId: string, field: keyof ResourceItem, value: string | number) => {
    setResourceCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          resources: category.resources.map(resource => {
            if (resource.id === resourceId) {
              const updatedResource = { ...resource, [field]: value };
              if (field === 'status') {
                triggerNotification(
                  `Status of "${resource.name}" updated to ${value}.`,
                  value === 'Completed' ? 'success' : 'info'
                );
              }
              return updatedResource;
            }
            return resource;
          }),
        };
      }
      return category;
    }));
  };

  const handleBudgetChange = (field: keyof Budget, value: number) => {
    setBudget(prev => ({ ...prev, [field]: value }));
    triggerNotification(`Budget ${field} updated to ${value}.`, 'info');
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setResourceCategories(prev => prev.map(category =>
      category.id === categoryId ? { ...category, isExpanded: !category.isExpanded } : category
    ));
  };

  const resetResourcesData = () => {
    setResourceCategories(initialResourceCategories);
    setBudget(initialBudget);
    triggerNotification('Resources and budget data have been reset.', 'info');
  };

  const addResourceItem = (categoryId: string) => {
    const newId = `new_${Date.now()}`;
    const newItem: ResourceItem = { 
        id: newId, 
        name: 'New Resource', 
        type: 'Other', 
        status: 'Not Started', 
        notes: '',
    };
    setResourceCategories(prev => prev.map(category => 
        category.id === categoryId ? { ...category, resources: [...category.resources, newItem] } : category
    ));
    triggerNotification('New resource item added.', 'success');
  };

  const removeResourceItem = (categoryId: string, resourceId: string) => {
    setResourceCategories(prev => prev.map(category => 
        category.id === categoryId ? 
        { ...category, resources: category.resources.filter(r => r.id !== resourceId) } 
        : category
    ));
    triggerNotification('Resource item removed.', 'info');
  };

  return (
    <div className="proposal-resources proposal-section">
      <div className="section-header">
        <h2>Resources & Budget</h2>
        <button onClick={resetResourcesData} className="button-reset-section">
          Reset Resources Data
        </button>
      </div>

      {/* Budget Section */}
      <div className="budget-section details-card">
        <div className="card-header"><h4>Budget Overview</h4></div>
        <div className="card-content">
          <div className="budget-item">
            <label htmlFor="allocatedBudget">Allocated Budget:</label>
            <input 
              type="number" 
              id="allocatedBudget" 
              value={budget.allocated} 
              onChange={(e) => handleBudgetChange('allocated', parseInt(e.target.value))}
            />
          </div>
          <div className="budget-item">
            <label>Spent Budget:</label>
            <span>£{budget.spent.toFixed(2)}</span>
          </div>
          <div className="budget-item">
            <label>Remaining Budget:</label>
            <span>£{(budget.allocated - budget.spent).toFixed(2)}</span>
          </div>
          <div className="budget-progress-bar-container">
            <div 
              className="budget-progress-bar" 
              style={{ width: `${budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Resource Categories Section */}
      {resourceCategories.map(category => (
        <div key={category.id} className="details-card resource-category-card">
          <div className="card-header" onClick={() => toggleCategoryExpand(category.id)}>
            <h4>{category.name}</h4>
            <span className="expand-toggle">{category.isExpanded ? '▼' : '►'}</span>
          </div>
          {category.isExpanded && (
            <div className="card-content">
              {category.resources.map(resource => (
                <div key={resource.id} className="resource-item">
                  <div className="resource-item-header">
                    <input 
                        type="text" 
                        value={resource.name} 
                        onChange={(e) => handleResourceChange(category.id, resource.id, 'name', e.target.value)} 
                        className="resource-name-input"
                        placeholder="Resource Name"
                    />
                    <button onClick={() => removeResourceItem(category.id, resource.id)} className="button-remove-item">×</button>
                  </div>
                  
                  <div className="resource-item-row">
                    <label htmlFor={`${resource.id}-type`}>Type:</label>
                    <select 
                        id={`${resource.id}-type`} 
                        value={resource.type} 
                        onChange={(e) => handleResourceChange(category.id, resource.id, 'type', e.target.value as ResourceItem['type'])}
                    >
                        {['Course', 'Book', 'Mentor', 'Tool', 'Community', 'Other'].map(type => 
                            <option key={type} value={type}>{type}</option>
                        )}
                    </select>

                    <label htmlFor={`${resource.id}-status`}>Status:</label>
                    <select 
                        id={`${resource.id}-status`} 
                        value={resource.status} 
                        onChange={(e) => handleResourceChange(category.id, resource.id, 'status', e.target.value as ResourceItem['status'])}
                    >
                        {['Not Started', 'In Progress', 'Completed', 'Ongoing'].map(status => 
                            <option key={status} value={status}>{status}</option>
                        )}
                    </select>
                  </div>

                  <div className="resource-item-row">
                    <label htmlFor={`${resource.id}-cost`}>Cost (£):</label>
                    <input 
                        type="number" 
                        id={`${resource.id}-cost`} 
                        value={resource.cost || ''} 
                        onChange={(e) => handleResourceChange(category.id, resource.id, 'cost', parseInt(e.target.value) || 0)}
                        placeholder="0.00"
                    />
                    <label htmlFor={`${resource.id}-link`}>Link:</label>
                    <input 
                        type="text" 
                        id={`${resource.id}-link`} 
                        value={resource.link || ''} 
                        onChange={(e) => handleResourceChange(category.id, resource.id, 'link', e.target.value)}
                        placeholder="http://example.com"
                    />
                  </div>
                  
                  <label htmlFor={`${resource.id}-notes`}>Notes:</label>
                  <textarea 
                    id={`${resource.id}-notes`} 
                    value={resource.notes} 
                    onChange={(e) => handleResourceChange(category.id, resource.id, 'notes', e.target.value)} 
                    rows={2} 
                    placeholder="Additional notes..."
                  />
                </div>
              ))}
              <button onClick={() => addResourceItem(category.id)} className="button-add-item">+ Add Resource</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProposalResources;
