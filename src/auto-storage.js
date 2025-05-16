// Placeholder for auto-storage.js: Manages automatic saving of form data and UI state to localStorage.
import StorageManager from './storage-manager.js';

/**
 * AutoStorage
 * Automatically saves and loads the state of form elements and collapsible sections.
 */
const AutoStorage = {
  init: function() {
    this.loadAllStates();
    this.attachEventListeners();
    this.observeDOMChanges();
    console.info("AutoStorage initialized.");
  },

  getElementKey: function(element) {
    // Prioritize data-storage-key, then id, then name. Fallback to a path-based key if none are present.
    // let key = element.dataset.id || element.id || element.name; // Bug: was data-id
    let key = element.dataset.storageKey || element.id || element.name; // Corrected to data-storageKey
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
  },

  saveState: function(element) {
    const key = this.getElementKey(element);
    let value;

    if (element.tagName === 'INPUT') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        value = element.checked;
      } else {
        value = element.value;
      }
    } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
      value = element.value;
    } else if (element.tagName === 'BUTTON' && element.classList.contains('collapsible')) {
      value = element.classList.contains('active'); // Assuming 'active' class indicates expanded
    } else {
      return; // Not a supported element
    }
    StorageManager.save(key, value);
  },

  loadState: function(element) {
    const key = this.getElementKey(element);
    const savedValue = StorageManager.load(key);

    if (savedValue === null) {
      return; // No saved state
    }

    if (element.tagName === 'INPUT') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = savedValue;
      } else {
        element.value = savedValue;
      }
    } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
      element.value = savedValue;
    } else if (element.tagName === 'BUTTON' && element.classList.contains('collapsible')) {
      if (savedValue) {
        element.classList.add('active');
        // Assuming the next sibling is the content to show/hide
        const content = element.nextElementSibling;
        if (content) content.style.display = 'block';
      } else {
        element.classList.remove('active');
        const content = element.nextElementSibling;
        if (content) content.style.display = 'none';
      }
    }
     // Dispatch a change event for elements like selects that might need it
    if (element.tagName === 'SELECT' || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
    }
  },

  loadAllStates: function() {
    document.querySelectorAll('input, select, textarea, button.collapsible').forEach(element => {
      this.loadState(element);
    });
  },

  attachEventListeners: function() {
    // Use event delegation on the document body for efficiency
    document.body.addEventListener('change', (event) => {
      if (event.target.matches('input, select, textarea')) {
        this.saveState(event.target);
      }
    });
    document.body.addEventListener('input', (event) => { // For textareas and text inputs that don't fire 'change' on every keystroke
        if (event.target.matches('input[type="text"], input[type="search"], input[type="url"], input[type="tel"], input[type="email"], input[type="password"], input[type="number"], textarea')) {
            this.saveState(event.target);
        }
    });

    document.body.addEventListener('click', (event) => {
      if (event.target.matches('button.collapsible')) {
        // Toggle active class for collapsible button (assuming this is handled by other scripts)
        // Then save its state
        // A slight delay to allow other click handlers to update class/attributes if necessary
        setTimeout(() => this.saveState(event.target), 0);
      }
    });
  },

  observeDOMChanges: function() {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node itself is a target element
              if (node.matches('input, select, textarea, button.collapsible')) {
                this.loadState(node);
                // Note: Event listeners are already delegated, so no need to re-attach for the node itself.
              }
              // Check for target elements within the added node (subtree)
              node.querySelectorAll('input, select, textarea, button.collapsible').forEach(element => {
                this.loadState(element);
              });
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
};

// Initialize AutoStorage when the script is loaded and DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AutoStorage.init());
} else {
    AutoStorage.init(); // DOMContentLoaded has already fired
}

export default AutoStorage;
