export const LOCAL_STORAGE_KEYS = {
  activeTab: 'careerProposal_activeTab',
  showNotification: 'careerProposal_showNotification',
  // Add keys for each component's data
  overviewData: 'careerProposal_overviewData',
  overviewExpandedSections: 'careerProposal_overviewExpandedSections', // Added this line
  detailsData: 'careerProposal_detailsData',
  timelineData: 'careerProposal_timelineData',
  resourcesData: 'careerProposal_resourcesData',
} as const; // Use 'as const' for better type inference for Object.values

export const getStoredValue = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }
    // Attempt to parse, but return defaultValue if it's clearly not JSON or parsing fails
    if (storedValue.trim().startsWith('{') || storedValue.trim().startsWith('[')) {
      return JSON.parse(storedValue) as T;
    }
    // If it's a primitive string that wasn't stringified JSON, return as is if T is string
    // This part needs to be careful with types. If defaultValue is string, we can assume T is string.
    if (typeof defaultValue === 'string' && !storedValue.trim().startsWith('"')) {
        return storedValue as unknown as T; 
    }
    return JSON.parse(storedValue) as T; // Fallback for other stringified primitives
  } catch (error) {
    console.warn(`Error parsing localStorage key "${key}", using default. Error:`, error);
    return defaultValue;
  }
};

export const setStoredValue = <T>(key: string, value: T): void => {
  try {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};
