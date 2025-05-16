import StorageManager from './storage-manager.js';

/**
 * SimpleStorage
 * A basic key-value store for manual state management, using StorageManager internally.
 * This is intended for scenarios where AutoStorage is too complex or not applicable,
 * and direct, explicit control over saving and loading specific pieces of data is needed.
 */
const SimpleStorage = {
  /**
   * Saves a value associated with a key.
   * @param {string} key - The key to save the data under.
   * @param {*} value - The value to save. Will be JSON-stringified.
   * @returns {boolean} - True if saving was successful, false otherwise.
   */
  save: function(key, value) {
    if (typeof key !== 'string' || key.trim() === '') {
      console.error('SimpleStorage: Key must be a non-empty string.');
      return false;
    }
    // No specific prefix for SimpleStorage itself, relies on StorageManager's prefix
    return StorageManager.save(key, value);
  },

  /**
   * Loads a value associated with a key.
   * @param {string} key - The key to load data from.
   * @param {*} [defaultValue=null] - The value to return if the key is not found or an error occurs.
   * @returns {*} - The loaded value, or the defaultValue.
   */
  load: function(key, defaultValue = null) {
    if (typeof key !== 'string' || key.trim() === '') {
      console.error('SimpleStorage: Key must be a non-empty string.');
      return defaultValue;
    }
    return StorageManager.load(key, defaultValue);
  },

  /**
   * Deletes a key and its associated value.
   * @param {string} key - The key to delete.
   * @returns {boolean} - True if deletion was successful or key didn't exist, false on error.
   */
  delete: function(key) {
    if (typeof key !== 'string' || key.trim() === '') {
      console.error('SimpleStorage: Key must be a non-empty string.');
      return false;
    }
    return StorageManager.remove(key);
  }
};

export default SimpleStorage;
