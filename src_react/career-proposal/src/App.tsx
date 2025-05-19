import { useState, useEffect, useCallback } from 'react';
import './App.css';
import ProposalOverview from './components/ProposalOverview';
import ProposalDetails from './components/ProposalDetails';
import ProposalTimeline from './components/ProposalTimeline';
import ProposalResources from './components/ProposalResources';
import { LOCAL_STORAGE_KEYS, getStoredValue, setStoredValue } from './utils/localStorageUtils';

// Define notification types
type NotificationType = 'info' | 'success' | 'error';
interface NotificationState {
  message: string;
  type: NotificationType;
}

// Initial state for notifications
const initialNotificationState: NotificationState = { message: '', type: 'info' };

function App() {
  // Tab state with localStorage persistence
  const [activeTab, setActiveTab] = useState<string>(() => 
    getStoredValue(LOCAL_STORAGE_KEYS.activeTab, 'overview')
  );
  
  // Notification system
  const [notification, setNotification] = useState<NotificationState>(initialNotificationState);
  const [showNotification, setShowNotification] = useState<boolean>(() => 
    getStoredValue(LOCAL_STORAGE_KEYS.showNotification, false)
  );

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.activeTab, activeTab);
  }, [activeTab]);

  // Handle notifications - auto-dismiss after 3 seconds
  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEYS.showNotification, showNotification);
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Notification trigger function to pass to child components
  const triggerNotification = useCallback((message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
    setShowNotification(true);
  }, []);
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    triggerNotification(`Switched to ${tab.charAt(0).toUpperCase() + tab.slice(1)} tab`, 'info');
  };
  
  // Reset all data
  const resetAllData = () => {
    // Clear all localStorage keys
    (Object.values(LOCAL_STORAGE_KEYS) as string[]).forEach(key => localStorage.removeItem(key));
    // Reset to overview tab
    setActiveTab('overview');
    triggerNotification('All proposal data has been reset!', 'success');
    window.location.reload(); // Force reload to ensure all components re-initialize
  };

  // Render notification banner if active
  const renderNotifications = () => {
    if (!showNotification) return null;
    return (
      <div className={`notification notification-${notification.type}`}>
        {notification.message}
        <button onClick={() => setShowNotification(false)} className="close-notification">&times;</button>
      </div>
    );
  };

  return (
    <div className="proposal-app">
      {renderNotifications()}
      
      <div className="app-header">
        <h1>Interactive Career Proposal</h1>
        <button onClick={resetAllData} className="button-reset-all">Reset All Data</button>
      </div>
      
      <div className="tabs">
        <button 
          onClick={() => handleTabChange('overview')} 
          className={activeTab === 'overview' ? 'active' : ''}
        >
          Overview
        </button>
        <button 
          onClick={() => handleTabChange('details')} 
          className={activeTab === 'details' ? 'active' : ''}
        >
          Details
        </button>
        <button 
          onClick={() => handleTabChange('timeline')} 
          className={activeTab === 'timeline' ? 'active' : ''}
        >
          Timeline
        </button>
        <button 
          onClick={() => handleTabChange('resources')} 
          className={activeTab === 'resources' ? 'active' : ''}
        >
          Resources
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && <ProposalOverview triggerNotification={triggerNotification} />}
        {activeTab === 'details' && <ProposalDetails triggerNotification={triggerNotification} />}
        {activeTab === 'timeline' && <ProposalTimeline triggerNotification={triggerNotification} />}
        {activeTab === 'resources' && <ProposalResources triggerNotification={triggerNotification} />}
      </div>
    </div>
  );
}

export default App;
