import { useState, useEffect } from 'react'

interface Resource {
  id: string;
  name: string;
  role: string;
  allocationPercent: number;
  availability: {
    q3_2025: boolean;
    q4_2025: boolean;
    q1_2026: boolean;
    q2_2026: boolean;
  };
}

interface Budget {
  category: string;
  amount: number;
  spent: number;
}

// Initial resources data
const initialResources: Resource[] = [
  {
    id: 'res1',
    name: 'Alex Johnson',
    role: 'Project Manager',
    allocationPercent: 50,
    availability: {
      q3_2025: true,
      q4_2025: true,
      q1_2026: true,
      q2_2026: false
    }
  },
  {
    id: 'res2',
    name: 'Jamie Smith',
    role: 'AI Engineer',
    allocationPercent: 100,
    availability: {
      q3_2025: true,
      q4_2025: true,
      q1_2026: true,
      q2_2026: true
    }
  },
  {
    id: 'res3',
    name: 'Taylor Wilson',
    role: 'Frontend Developer',
    allocationPercent: 80,
    availability: {
      q3_2025: false,
      q4_2025: true,
      q1_2026: true,
      q2_2026: true
    }
  },
  {
    id: 'res4',
    name: 'Morgan Lee',
    role: 'Content Strategist',
    allocationPercent: 60,
    availability: {
      q3_2025: true,
      q4_2025: true,
      q1_2026: false,
      q2_2026: true
    }
  },
  {
    id: 'res5',
    name: 'Casey Brown',
    role: 'UX Designer',
    allocationPercent: 70,
    availability: {
      q3_2025: true,
      q4_2025: false,
      q1_2026: true,
      q2_2026: true
    }
  }
];

// Initial budget data
const initialBudget: Budget[] = [
  {
    category: 'Development',
    amount: 250000,
    spent: 62500
  },
  {
    category: 'Infrastructure',
    amount: 100000,
    spent: 15000
  },
  {
    category: 'Training',
    amount: 50000,
    spent: 5000
  },
  {
    category: 'Licenses & Tools',
    amount: 75000,
    spent: 30000
  },
  {
    category: 'Contingency',
    amount: 50000,
    spent: 0
  }
];

// Storage keys
const RESOURCES_STORAGE_KEY = 'careerProposal_resources';
const BUDGET_STORAGE_KEY = 'careerProposal_budget';

const ProposalResources = () => {
  // Initialize resources from localStorage or fall back to initial data
  const [resources, setResources] = useState<Resource[]>(() => {
    if (typeof window === 'undefined') return initialResources;
    
    try {
      const savedResources = localStorage.getItem(RESOURCES_STORAGE_KEY);
      return savedResources ? JSON.parse(savedResources) : initialResources;
    } catch (error) {
      console.error('Error loading resources from localStorage:', error);
      return initialResources;
    }
  });
  
  // Initialize budget from localStorage or fall back to initial data
  const [budget, setBudget] = useState<Budget[]>(() => {
    if (typeof window === 'undefined') return initialBudget;
    
    try {
      const savedBudget = localStorage.getItem(BUDGET_STORAGE_KEY);
      return savedBudget ? JSON.parse(savedBudget) : initialBudget;
    } catch (error) {
      console.error('Error loading budget from localStorage:', error);
      return initialBudget;
    }
  });
  
  // Save resources to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(resources));
    } catch (error) {
      console.error('Error saving resources to localStorage:', error);
    }
  }, [resources]);
  
  // Save budget to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budget));
    } catch (error) {
      console.error('Error saving budget to localStorage:', error);
    }
  }, [budget]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getTotalBudget = () => {
    return budget.reduce((total, item) => total + item.amount, 0);
  };
  
  const getTotalSpent = () => {
    return budget.reduce((total, item) => total + item.spent, 0);
  };
  
  const getBudgetProgress = () => {
    const totalBudget = getTotalBudget();
    const totalSpent = getTotalSpent();
    return Math.round((totalSpent / totalBudget) * 100);
  };
  
  const handleAllocationChange = (id: string, value: number) => {
    setResources(resources.map(resource => {
      if (resource.id === id) {
        return { ...resource, allocationPercent: value };
      }
      return resource;
    }));
  };
  
  const toggleAvailability = (resourceId: string, quarter: 'q3_2025' | 'q4_2025' | 'q1_2026' | 'q2_2026') => {
    setResources(resources.map(resource => {
      if (resource.id === resourceId) {
        return {
          ...resource,
          availability: {
            ...resource.availability,
            [quarter]: !resource.availability[quarter]
          }
        };
      }
      return resource;
    }));
  };
  
  const updateBudgetSpent = (index: number, newSpent: number) => {
    const newBudget = [...budget];
    newBudget[index].spent = Math.min(newSpent, newBudget[index].amount);
    setBudget(newBudget);
  };
  
  // Reset all data to initial values
  const resetData = () => {
    if (confirm('Reset all resource allocation and budget data to initial values?')) {
      setResources(initialResources);
      setBudget(initialBudget);
    }
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Resources & Budget</h2>
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
      
      <div className="section">
        <h3>Team Allocation</h3>
        <p>
          The following team members have been identified for this project.
          Their allocation and availability are outlined below.
        </p>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--gray-light)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray)' }}>Name</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray)' }}>Role</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray)' }}>Allocation</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray)' }}>Q3 2025</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray)' }}>Q4 2025</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray)' }}>Q1 2026</th>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray)' }}>Q2 2026</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                <td style={{ padding: '0.75rem' }}>{resource.name}</td>
                <td style={{ padding: '0.75rem' }}>{resource.role}</td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={resource.allocationPercent}
                      onChange={(e) => handleAllocationChange(resource.id, Number(e.target.value))}
                      style={{ marginRight: '10px' }}
                    />
                    <span>{resource.allocationPercent}%</span>
                  </div>
                </td>
                <td 
                  style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => toggleAvailability(resource.id, 'q3_2025')}
                >
                  {resource.availability.q3_2025 ? '✅' : '❌'}
                </td>
                <td 
                  style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => toggleAvailability(resource.id, 'q4_2025')}
                >
                  {resource.availability.q4_2025 ? '✅' : '❌'}
                </td>
                <td 
                  style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => toggleAvailability(resource.id, 'q1_2026')}
                >
                  {resource.availability.q1_2026 ? '✅' : '❌'}
                </td>
                <td 
                  style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => toggleAvailability(resource.id, 'q2_2026')}
                >
                  {resource.availability.q2_2026 ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="section">
        <h3>Budget Allocation</h3>
        <p>
          The total budget for this project is {formatCurrency(getTotalBudget())}.
          Current spending is at {formatCurrency(getTotalSpent())} ({getBudgetProgress()}% of total).
        </p>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${getBudgetProgress()}%` }}
          ></div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          {budget.map((item, index) => (
            <div key={index} className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: '0' }}>{item.category}</h4>
                <div>
                  <span>{formatCurrency(item.spent)} / {formatCurrency(item.amount)}</span>
                  <span style={{ marginLeft: '10px' }}>
                    ({Math.round((item.spent / item.amount) * 100)}%)
                  </span>
                </div>
              </div>
              
              <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                <div 
                  className="progress-bar"
                  style={{ width: `${(item.spent / item.amount) * 100}%` }}
                ></div>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max={item.amount} 
                step={item.amount / 100}
                value={item.spent}
                onChange={(e) => updateBudgetSpent(index, Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#6b7280' }}>
        <p>Note: Your resource allocation and budget changes are saved locally in your browser.</p>
      </div>
    </div>
  )
}

export default ProposalResources
