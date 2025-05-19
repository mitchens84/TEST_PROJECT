import './ProposalResources.css'; // Keep CSS for basic styling if any applies

// Types (can be commented out if not used by props, but triggerNotification might still be typed)
// interface ResourceCategory {
//   id: string;
//   name: string;
//   resources: ResourceItem[];
//   isExpanded: boolean;
// }

// interface ResourceItem {
//   id: string;
//   name: string;
//   type: 'Course' | 'Book' | 'Mentor' | 'Tool' | 'Community' | 'Other';
//   status: 'Not Started' | 'In Progress' | 'Completed' | 'Ongoing';
//   notes: string;
//   cost?: number; // Optional
//   link?: string; // Optional
// }

// interface Budget {
//   allocated: number;
//   spent: number;
// }

interface ProposalResourcesProps {
  triggerNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
}

// Initial Data (commented out as it's not used in the simplified version)
// const initialResourceCategories: ResourceCategory[] = [ ... ];
// const initialBudget: Budget = { ... };

function ProposalResources({ triggerNotification }: ProposalResourcesProps) {
  // All original state, useEffects, and handlers are commented out for this test

  // Test notification - uncomment to see if notifications work from here
  // useEffect(() => {
  //   triggerNotification("ProposalResources (simplified) loaded!", "info");
  // }, [triggerNotification]);

  return (
    <div 
      className="proposal-resources proposal-section" 
      style={{ 
        border: '3px solid red', 
        padding: '20px', 
        margin: '10px', 
        color: 'black', 
        backgroundColor: '#f0f0f0' 
      }}
    >
      <h1>Hello from Simplified ProposalResources!</h1>
      <p>If you can see this, the basic component rendering is working.</p>
      <p>The original content of this component has been temporarily replaced for debugging.</p>
      <button onClick={() => triggerNotification('Test notification from simplified component', 'success')}>
        Test Notification
      </button>
    </div>
  );
}

export default ProposalResources;
