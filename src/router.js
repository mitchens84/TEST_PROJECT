/**
 * Router - Client-side routing for the front-end application
 * Handles URL changes and content loading
 */

export class Router {
  constructor(options = {}) {
    this.routes = new Map();
    this.currentRoute = null;
    this.defaultRoute = options.defaultRoute || 'home';
    this.contentContainer = options.contentContainer || 'content-iframe';
    this.urlPrefix = options.urlPrefix || '#/';
    this.onRouteChange = options.onRouteChange || (() => {});
    
    this.init();
  }
  
  init() {
    // Listen for URL changes
    window.addEventListener('popstate', (event) => this.handlePopState(event));
    window.addEventListener('hashchange', (event) => this.handleHashChange(event));
    
    // Load initial route
    this.loadCurrentRoute();
  }
  
  /**
   * Add a route handler
   */
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }
  
  /**
   * Navigate to a new route
   */
  navigate(path, title = '', pushToHistory = true) {
    // Normalize path
    const normalizedPath = this.normalizePath(path);
    
    // Update URL
    const newUrl = this.buildUrl(normalizedPath);
    
    if (pushToHistory) {
      window.history.pushState({ path: normalizedPath }, title, newUrl);
    }
    
    // Update page title if provided
    if (title) {
      document.title = title;
    }
    
    // Load the route
    this.loadRoute(normalizedPath);
  }
  
  /**
   * Replace the current route (doesn't add to history)
   */
  replace(path, title = '') {
    this.navigate(path, title, false);
    
    const normalizedPath = this.normalizePath(path);
    const newUrl = this.buildUrl(normalizedPath);
    window.history.replaceState({ path: normalizedPath }, title, newUrl);
  }
  
  /**
   * Load a specific route
   */
  async loadRoute(path) {
    const normalizedPath = this.normalizePath(path);
    const handler = this.routes.get(normalizedPath);
    
    if (handler) {
      try {
        await handler(normalizedPath);
        this.currentRoute = normalizedPath;
        this.onRouteChange(normalizedPath);
      } catch (error) {
        console.error(`Error loading route ${normalizedPath}:`, error);
        this.handleRouteError(normalizedPath, error);
      }
    } else {
      console.warn(`No handler found for route: ${normalizedPath}`);
      this.handleNotFound(normalizedPath);
    }
  }
  
  /**
   * Load the current route from the URL
   */
  loadCurrentRoute() {
    const path = this.getCurrentPath();
    this.loadRoute(path || this.defaultRoute);
  }
  
  /**
   * Get the current path from the URL
   */
  getCurrentPath() {
    const hash = window.location.hash;
    
    if (hash.startsWith(this.urlPrefix)) {
      return hash.slice(this.urlPrefix.length);
    }
    
    // Legacy support for simple hash routing
    if (hash.startsWith('#')) {
      return hash.slice(1);
    }
    
    return '';
  }
  
  /**
   * Normalize path (remove leading/trailing slashes, etc.)
   */
  normalizePath(path) {
    if (!path) return '';
    
    // Remove leading and trailing slashes
    return path.replace(/^\/+|\/+$/g, '');
  }
  
  /**
   * Build full URL from path
   */
  buildUrl(path) {
    const currentUrl = new URL(window.location);
    currentUrl.hash = this.urlPrefix + path;
    return currentUrl.toString();
  }
  
  /**
   * Handle popstate events (back/forward buttons)
   */
  handlePopState(event) {
    const path = event.state?.path || this.getCurrentPath() || this.defaultRoute;
    this.loadRoute(path);
  }
  
  /**
   * Handle hashchange events
   */
  handleHashChange(event) {
    this.loadCurrentRoute();
  }
  
  /**
   * Handle route not found
   */
  handleNotFound(path) {
    console.warn(`Route not found: ${path}`);
    
    // Try to load default route
    if (path !== this.defaultRoute) {
      this.navigate(this.defaultRoute, 'Home');
    } else {
      // Even default route failed
      this.handleRouteError(path, new Error('No routes configured'));
    }
  }
  
  /**
   * Handle route loading errors
   */
  handleRouteError(path, error) {
    console.error(`Route error for ${path}:`, error);
    
    const container = document.getElementById(this.contentContainer);
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; text-align: center; color: red;">
          <h3>Error Loading Content</h3>
          <p>Failed to load route: ${path}</p>
          <p>${error.message}</p>
          <button onclick="window.location.reload()">Reload Page</button>
        </div>
      `;
    }
  }
  
  /**
   * Get all registered routes
   */
  getRoutes() {
    return Array.from(this.routes.keys());
  }
  
  /**
   * Check if a route exists
   */
  hasRoute(path) {
    return this.routes.has(this.normalizePath(path));
  }
}

/**
 * Content Router - Specialized router for loading content in iframes
 */
export class ContentRouter extends Router {
  constructor(options = {}) {
    super(options);
    this.contentBasePath = options.contentBasePath || 'EXPRESS/';
    this.contentSuffix = options.contentSuffix || '.html';
  }
  
  /**
   * Load content in iframe
   */
  async loadContentInIframe(contentPath) {
    const iframe = document.getElementById(this.contentContainer);
    if (!iframe) {
      throw new Error(`Content container ${this.contentContainer} not found`);
    }
    
    // Build content URL
    let contentUrl = contentPath;
    
    // If it's a relative path, prefix with content base path
    if (!contentUrl.startsWith('http') && !contentUrl.startsWith('/')) {
      contentUrl = this.contentBasePath + contentUrl;
    }
    
    // Add .html suffix if not present and not already a complete URL
    if (!contentUrl.includes('.') && !contentUrl.startsWith('http')) {
      contentUrl += '/index.html';
    }
    
    console.log(`Loading content: ${contentPath} -> ${contentUrl}`);
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout loading content: ${contentUrl}`));
      }, 10000); // 10 second timeout
      
      iframe.onload = () => {
        clearTimeout(timeoutId);
        console.log(`Content loaded successfully: ${contentUrl}`);
        resolve();
      };
      
      iframe.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load content: ${contentUrl}`));
      };
      
      iframe.src = contentUrl;
    });
  }
  
  /**
   * Register a content route
   */
  addContentRoute(routePath, contentPath, title = '') {
    this.addRoute(routePath, async () => {
      await this.loadContentInIframe(contentPath);
      if (title) {
        document.title = title;
      }
    });
  }
  
  /**
   * Auto-register routes from table of contents data
   */
  autoRegisterFromTOC(tocData) {
    if (!tocData || !tocData.sections) {
      console.warn('Invalid TOC data for auto-registration');
      return;
    }
    
    tocData.sections.forEach(section => {
      if (section.items) {
        section.items.forEach(item => {
          if (item.href) {
            // Extract route path from href
            const routePath = this.extractRouteFromHref(item.href);
            const title = `${item.title} - ${section.title}`;
            
            this.addContentRoute(routePath, item.href, title);
          }
        });
      }
    });
    
    console.log(`Auto-registered ${this.getRoutes().length} routes from TOC`);
  }
  
  /**
   * Extract route path from href
   */
  extractRouteFromHref(href) {
    // Remove EXPRESS/ prefix and /index.html suffix to create clean route
    let route = href.replace(/^EXPRESS\//, '').replace(/\/index\.html$/, '');
    
    // If the route is empty, use the last part of the path
    if (!route) {
      const parts = href.split('/').filter(part => part && part !== 'EXPRESS');
      route = parts[parts.length - 1] || 'home';
    }
    
    return route;
  }
}

export default Router;
