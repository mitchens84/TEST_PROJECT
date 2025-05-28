// AutoStorage: Manages automatic saving of form data and UI state to localStorage.
import ModuleLoader from './module-loader.js';

/**
 * AutoStorage
 * Automatically saves and loads the state of form elements and collapsible sections.
 */
class AutoStorageClass {
  constructor() {
    this.initialized = false;
    this.storageManager = null;
    this.elements = new Map();
    this.observers = [];
  }

  async init() {
    if (this.initialized) {
      console.warn('AutoStorage already initialized');
      return;
    }

    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
      }

      // Load StorageManager
      await this.loadStorageManager();
      
      // Initialize functionality
      this.loadAllStates();
      this.attachEventListeners();
      this.observeDOMChanges();
      
      this.initialized = true;
      console.info("AutoStorage initialized.");
    } catch (error) {
      console.error('Failed to initialize AutoStorage:', error);
      // Create fallback functionality
      this.createFallbackStorage();
    }
  }

  async loadStorageManager() {
    try {
      const module = await ModuleLoader.loadModule('./storage-manager.js');
      this.storageManager = module.default;
    } catch (error) {
      console.error('Failed to load StorageManager:', error);
      this.createFallbackStorage();
    }
  }

  createFallbackStorage() {
    console.warn('Using fallback storage manager');
    this.storageManager = {
      save: (key, value) => {
        try {
          localStorage.setItem(`auto_${key}`, JSON.stringify(value));
          return true;
        } catch (e) {
          console.error('Storage failed:', e);
          return false;
        }
      },
      load: (key, defaultValue = null) => {
        try {
          const item = localStorage.getItem(`auto_${key}`);
          return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
          console.error('Load failed:', e);
          return defaultValue;
        }
      }
    };
  }

  getElementKey(element) {
    // Prioritize data-storage-key, then id, then name. Fallback to a path-based key if none are present.
    let key = element.dataset.storageKey || element.id || element.name;
    if (key) {
      // For radio buttons using only name for grouping, append value for uniqueness if no id/data-storage-key
      if (element.type === 'radio' && !element.id && !element.dataset.storageKey) {
          key = `${element.name}_${element.value}`;
      }
      return `auto_${element.tagName.toLowerCase()}_${key}`;
    }
    // Fallback to a simple path-based key (less stable if DOM structure changes significantly)
    let path = '';
    let current = element;
    while (current && current !== document.body) {
      const parent = current.parentElement;
      if (parent) {
        const index = Array.from(parent.children).indexOf(current);
        path = `${current.tagName.toLowerCase()}[${index}]/${path}`;
      }
      current = parent;
    }
    return `auto_path_${path.replace(/\/$/, '')}`; // Remove trailing slash
  }

  saveState(element) {
    if (!this.storageManager) return;
    
    const key = this.getElementKey(element);
    let value;

    if (element.tagName === 'INPUT') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        value = element.checked;
      } else {
        value = element.value;
      }
    } else if (element.tagName === 'SELECT') {
      value = element.value;
    } else if (element.tagName === 'TEXTAREA') {
      value = element.value;
    } else if (element.classList.contains('collapsible')) {
      value = !element.classList.contains('collapsed');
    } else {
      return; // Unsupported element type
    }

    this.storageManager.save(key, value);
  }

  loadState(element) {
    if (!this.storageManager) return;
    
    const key = this.getElementKey(element);
    const value = this.storageManager.load(key);

    if (value === null || value === undefined) {
      return; // No stored value
    }

    if (element.tagName === 'INPUT') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = value;
      } else {
        element.value = value;
      }
    } else if (element.tagName === 'SELECT') {
      element.value = value;
    } else if (element.tagName === 'TEXTAREA') {
      element.value = value;
    } else if (element.classList.contains('collapsible')) {
      if (value) {
        element.classList.remove('collapsed');
      } else {
        element.classList.add('collapsed');
      }
      // Update content visibility
      const content = element.querySelector('.collapsible-content');
      if (content) {
        content.style.display = value ? 'block' : 'none';
      }
    }
  }

  loadAllStates() {
    const elements = document.querySelectorAll('input, select, textarea, .collapsible');
    elements.forEach(element => this.loadState(element));
  }

  attachEventListeners() {
    // Use event delegation for better performance and dynamic content support
    document.addEventListener('input', (event) => {
      if (event.target.matches('input, select, textarea')) {
        this.saveState(event.target);
      }
    });

    document.addEventListener('change', (event) => {
      if (event.target.matches('input[type="checkbox"], input[type="radio"], select')) {
        this.saveState(event.target);
      }
    });

    // Handle collapsible elements
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('collapsible') || event.target.closest('.collapsible')) {
        const collapsible = event.target.classList.contains('collapsible') ? 
          event.target : event.target.closest('.collapsible');
        
        // Toggle collapsed state
        collapsible.classList.toggle('collapsed');
        
        // Update content visibility
        const content = collapsible.querySelector('.collapsible-content');
        if (content) {
          content.style.display = collapsible.classList.contains('collapsed') ? 'none' : 'block';
        }
        
        this.saveState(collapsible);
      }
    });
  }

  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Load state for newly added elements
              const elements = node.querySelectorAll ? 
                node.querySelectorAll('input, select, textarea, .collapsible') : [];
              elements.forEach(element => this.loadState(element));
              
              // Also check if the node itself is a target element
              if (node.matches && node.matches('input, select, textarea, .collapsible')) {
                this.loadState(node);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  // Method to manually trigger state loading for specific elements
  refreshElements(selector = 'input, select, textarea, .collapsible') {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => this.loadState(element));
  }

  // Method to clear all stored state
  clearAllState() {
    if (!this.storageManager) return;
    
    // This would need to be implemented in the StorageManager
    // For now, clear localStorage items with 'auto_' prefix
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('auto_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.initialized = false;
  }
}

// Create and export singleton instance
const AutoStorage = new AutoStorageClass();

// Auto-initialize when module is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AutoStorage.init());
} else {
  // DOM is already ready, initialize immediately
  AutoStorage.init();
}

export default AutoStorage;
