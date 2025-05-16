/**
 * StorageManager
 * Core engine for saving and loading data to localStorage with namespacing and error handling.
 */
const STORAGE_PREFIX = 'pageAppStorage_'; // Namespace to avoid collisions

const StorageManager = {
  save: function(key, value) {
    if (typeof key !== 'string' || key.trim() === '') {
      console.error('StorageManager: Key must be a non-empty string.');
      return false;
    }
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      localStorage.setItem(prefixedKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`StorageManager: Error saving data for key "${key}". localStorage might be full or unavailable.`, error);
      return false;
    }
  },
  load: function(key, defaultValue = null) {
    if (typeof key !== 'string' || key.trim() === '') {
      console.error('StorageManager: Key must be a non-empty string.');
      return defaultValue;
    }
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      const storedValue = localStorage.getItem(prefixedKey);
      if (storedValue === null) {
        return defaultValue;
      }
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`StorageManager: Error loading or parsing data for key "${key}". Returning default value.`, error);
      return defaultValue;
    }
  },
  remove: function(key) {
    if (typeof key !== 'string' || key.trim() === '') {
      console.error('StorageManager: Key must be a non-empty string.');
      return false;
    }
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(`StorageManager: Error removing data for key "${key}".`, error);
      return false;
    }
  },
  // Renamed from clearAll to clearAllPrefixed for clarity and consistency
  clearAllPrefixed: function() { 
    try {
      let itemsRemoved = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
          itemsRemoved++;
          i--; 
        }
      }
      console.info(`StorageManager: Cleared ${itemsRemoved} item(s) with prefix "${STORAGE_PREFIX}".`);
      return true;
    } catch (error) {
      console.error('StorageManager: Error clearing all prefixed data.', error);
      return false;
    }
  },

  getAllPrefixedItems: function() {
    const items = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const unprefixedKey = key.substring(STORAGE_PREFIX.length);
          // We need to load/parse the item to show its actual value
          items[unprefixedKey] = this.load(unprefixedKey); 
        }
      }
    } catch (error) {
      console.error('StorageManager: Error retrieving all prefixed items.', error);
    }
    return items;
  },

  getPrefix: function() {
    return STORAGE_PREFIX;
  }
};

export default StorageManager;
