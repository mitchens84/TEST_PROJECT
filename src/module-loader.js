/**
 * Module Loader - Robust ES module loading with path resolution
 * Handles iframe contexts and provides fallbacks for failed loads
 */

export class ModuleLoader {
  static cache = new Map();
  
  /**
   * Get the base path for modules, accounting for iframe context
   */
  static getBasePath() {
    try {
      // Check if we're in an iframe
      const isInIframe = window !== window.top;
      
      if (isInIframe) {
        // Get the top window's origin and path
        const topOrigin = window.top.location.origin;
        const topPathname = window.top.location.pathname;
        const topDir = topPathname.substring(0, topPathname.lastIndexOf('/') + 1);
        return `${topOrigin}${topDir}`;
      } else {
        // We're in the main window
        const currentPath = window.location.pathname;
        const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        return window.location.origin + currentDir;
      }
    } catch (error) {
      // Fallback to relative path
      console.warn('Could not determine base path, using relative path:', error);
      return './';
    }
  }
  
  /**
   * Resolve module path with proper base path
   */
  static resolvePath(modulePath) {
    if (modulePath.startsWith('http') || modulePath.startsWith('//')) {
      return modulePath; // Already absolute
    }
    
    const basePath = this.getBasePath();
    
    // Remove leading ./ if present
    if (modulePath.startsWith('./')) {
      modulePath = modulePath.substring(2);
    }
    
    // Handle relative paths like ../../src/
    if (modulePath.startsWith('../')) {
      // For iframe context, we need to resolve relative to the top window
      try {
        const isInIframe = window !== window.top;
        if (isInIframe) {
          const topOrigin = window.top.location.origin;
          const topPathname = window.top.location.pathname;
          const topDir = topPathname.substring(0, topPathname.lastIndexOf('/') + 1);
          
          // Create URL and resolve the relative path
          const baseUrl = new URL(topDir, topOrigin);
          const resolvedUrl = new URL(modulePath, baseUrl);
          return resolvedUrl.href;
        }
      } catch (error) {
        console.warn('Error resolving relative path in iframe:', error);
      }
    }
    
    return basePath + modulePath;
  }
  
  /**
   * Load a module with robust error handling and caching
   */
  static async loadModule(modulePath, options = {}) {
    const { useCache = true, fallback = null } = options;
    
    const resolvedPath = this.resolvePath(modulePath);
    
    // Check cache first
    if (useCache && this.cache.has(resolvedPath)) {
      return this.cache.get(resolvedPath);
    }
    
    try {
      console.log(`Loading module: ${modulePath} -> ${resolvedPath}`);
      const module = await import(resolvedPath);
      
      // Cache successful loads
      if (useCache) {
        this.cache.set(resolvedPath, module);
      }
      
      return module;
    } catch (error) {
      console.error(`Failed to load module: ${resolvedPath}`, error);
      
      // Check if it's the "Unexpected token '<'" error (HTML returned instead of JS)
      if (error instanceof SyntaxError && error.message.includes("Unexpected token '<'")) {
        console.error('This error typically means the server returned HTML (like a 404 page) instead of JavaScript.');
        console.error('Check if the file exists and the server is configured correctly.');
      }
      
      // Try fallback if provided
      if (fallback && typeof fallback === 'function') {
        console.warn(`Using fallback for ${modulePath}`);
        return fallback();
      }
      
      // Return a mock module to prevent cascade failures
      return this.createMockModule(modulePath);
    }
  }
  
  /**
   * Create a mock module to prevent cascade failures
   */
  static createMockModule(modulePath) {
    console.warn(`Creating mock module for ${modulePath}`);
    
    return {
      default: null,
      __isMock: true,
      __originalPath: modulePath
    };
  }
  
  /**
   * Preload modules to catch errors early
   */
  static async preloadModules(modulePaths) {
    const results = {};
    
    for (const path of modulePaths) {
      try {
        results[path] = await this.loadModule(path);
      } catch (error) {
        results[path] = { error, success: false };
      }
    }
    
    return results;
  }
  
  /**
   * Clear the module cache
   */
  static clearCache() {
    this.cache.clear();
  }
}

// Global error handler for unhandled module loading errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('import')) {
    console.error('Unhandled module loading error:', event.reason);
    // You could notify the user here or take other actions
  }
});

export default ModuleLoader;
