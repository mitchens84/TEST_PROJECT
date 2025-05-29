/**
 * Comprehensive Diagnostic and Content Loading System
 * This module provides enhanced iframe content loading with diagnostic capabilities
 */

class ContentLoadingDiagnostics {
  constructor() {
    this.loadAttempts = [];
    this.iframeStates = new Map();
    this.debugMode = true;
  }

  // Enhanced iframe content loading with comprehensive diagnostics
  async loadContentWithDiagnostics(pageUrl, buttonElementToActivate) {
    const startTime = Date.now();
    const loadId = `load_${startTime}`;
    
    this.log(`🔄 Loading content: ${pageUrl}`, 'info');
    
    const homeContentDiv = document.getElementById('home-content');
    if (!homeContentDiv) {
      this.log('❌ Home content area not found', 'error');
      return false;
    }

    // Clear previous active states
    const navButtons = document.querySelectorAll('#navigation-area button');
    navButtons.forEach(btn => btn.classList.remove('active'));

    if (buttonElementToActivate) {
      buttonElementToActivate.classList.add('active');
    }

    // Get or create iframe
    let iframe = homeContentDiv.querySelector('iframe');
    if (!iframe) {
      iframe = this.createEnhancedIframe();
      homeContentDiv.innerHTML = '';
      homeContentDiv.appendChild(iframe);
    }

    // Validate URL before loading
    if (!this.validateUrl(pageUrl)) {
      this.log(`❌ Invalid URL: ${pageUrl}`, 'error');
      this.showErrorContent(iframe, `Invalid URL: ${pageUrl}`);
      return false;
    }

    // Pre-flight check - verify file exists
    try {
      const response = await fetch(pageUrl, { method: 'HEAD' });
      if (!response.ok) {
        this.log(`❌ File not found: ${pageUrl} (HTTP ${response.status})`, 'error');
        this.showErrorContent(iframe, `File not found: ${pageUrl} (HTTP ${response.status})`);
        return false;
      }
      this.log(`✅ File exists: ${pageUrl} (HTTP ${response.status})`, 'success');
    } catch (error) {
      this.log(`❌ Network error checking ${pageUrl}: ${error.message}`, 'error');
      this.showErrorContent(iframe, `Network error: ${error.message}`);
      return false;
    }

    // Load content with monitoring
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.log(`⏰ Loading timeout for ${pageUrl}`, 'warning');
        this.showErrorContent(iframe, `Loading timeout for: ${pageUrl}`);
        resolve(false);
      }, 10000); // 10 second timeout

      iframe.onload = () => {
        clearTimeout(timeout);
        const loadTime = Date.now() - startTime;
        this.log(`✅ Content loaded successfully: ${pageUrl} (${loadTime}ms)`, 'success');
        
        // Perform post-load diagnostics
        this.performPostLoadDiagnostics(iframe, pageUrl);
        resolve(true);
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        this.log(`❌ Iframe loading error: ${pageUrl}`, 'error');
        this.showErrorContent(iframe, `Failed to load: ${pageUrl}`);
        resolve(false);
      };

      // Set the source
      iframe.src = pageUrl;
      this.recordLoadAttempt(loadId, pageUrl, startTime);
    });
  }

  // Create enhanced iframe with better error handling
  createEnhancedIframe() {
    const iframe = document.createElement('iframe');
    iframe.id = 'content-iframe';
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: white;
      min-height: 500px;
    `;
    
    // Enhanced iframe attributes for better compatibility
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals');
    iframe.setAttribute('loading', 'lazy');
    
    return iframe;
  }

  // Perform diagnostics after content loads
  performPostLoadDiagnostics(iframe, pageUrl) {
    setTimeout(() => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const bodyText = iframeDoc.body?.innerText || '';
          const hasContent = bodyText.trim().length > 0;
          const elements = iframeDoc.querySelectorAll('*').length;
          
          this.log(`📊 Content analysis for ${pageUrl}:`, 'info');
          this.log(`   - Has content: ${hasContent}`, 'info');
          this.log(`   - Text length: ${bodyText.length}`, 'info');
          this.log(`   - DOM elements: ${elements}`, 'info');
          
          if (!hasContent) {
            this.log(`⚠️ Content appears empty for ${pageUrl}`, 'warning');
          }
          
          // Check for common issues
          const title = iframeDoc.title || 'No title';
          if (title.includes('404') || title.includes('Not Found')) {
            this.log(`⚠️ Page may be a 404 error page`, 'warning');
          }
          
        } else {
          this.log(`⚠️ Cannot access iframe content (cross-origin restriction)`, 'warning');
        }
      } catch (error) {
        this.log(`⚠️ Post-load diagnostic error: ${error.message}`, 'warning');
      }
    }, 500); // Wait 500ms for content to settle
  }

  // Show error content in iframe
  showErrorContent(iframe, message) {
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Content Loading Error</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f8f9fa; 
            color: #343a40;
          }
          .error-container {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            margin: 20px auto;
            text-align: center;
          }
          .error-icon { font-size: 48px; margin-bottom: 16px; }
          .error-title { color: #dc3545; margin-bottom: 16px; }
          .error-message { color: #6c757d; margin-bottom: 20px; }
          .retry-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          .retry-btn:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <h3 class="error-title">Content Loading Error</h3>
          <p class="error-message">${message}</p>
          <button class="retry-btn" onclick="window.location.reload()">Retry</button>
        </div>
      </body>
      </html>
    `;
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml);
  }

  // Validate URL
  validateUrl(url) {
    if (!url || typeof url !== 'string') return false;
    if (url.trim() === '') return false;
    if (url.includes('<') || url.includes('>')) return false;
    if (url.startsWith('javascript:') || url.startsWith('data:')) return false;
    return true;
  }

  // Record load attempt for analytics
  recordLoadAttempt(loadId, pageUrl, startTime) {
    this.loadAttempts.push({
      id: loadId,
      url: pageUrl,
      timestamp: startTime,
      userAgent: navigator.userAgent
    });
    
    // Keep only last 50 attempts
    if (this.loadAttempts.length > 50) {
      this.loadAttempts = this.loadAttempts.slice(-50);
    }
  }

  // Enhanced logging
  log(message, level = 'info') {
    if (!this.debugMode) return;
    
    const timestamp = new Date().toISOString().substr(11, 12);
    const prefix = `[${timestamp}] Content Loader:`;
    
    switch (level) {
      case 'error':
        console.error(prefix, message);
        break;
      case 'warning':
        console.warn(prefix, message);
        break;
      case 'success':
        console.log(`%c${prefix} ${message}`, 'color: green');
        break;
      default:
        console.log(prefix, message);
    }
  }

  // Get diagnostics report
  getDiagnosticsReport() {
    return {
      totalAttempts: this.loadAttempts.length,
      recentAttempts: this.loadAttempts.slice(-10),
      currentIframes: Array.from(document.querySelectorAll('iframe')).map(iframe => ({
        id: iframe.id,
        src: iframe.src,
        loaded: iframe.contentDocument ? true : false
      }))
    };
  }

  // Test all problematic pages
  async testAllPages() {
    const pages = [
      'EXPRESS/section/page.html',                    // Content demonstrations
      'EXPRESS/sitruna/index.html',                   // Sitruna knowledge map
      'EXPRESS/appliance-scaling-tutorial/page.html', // Appliance scaling tutorial
      'EXPRESS/markdown-example/page.html',           // Markdown rendering example
      'EXPRESS/career/index.html',                    // Career proposal
      'EXPRESS/complex-showcase/index.html',          // Complex showcase
      'EXPRESS/introduction/page.html',               // Introduction
      'EXPRESS/comprehensive-storage-test/index.html' // Storage test
    ];

    const results = [];
    this.log('🧪 Starting comprehensive page testing...', 'info');

    for (const page of pages) {
      this.log(`Testing: ${page}`, 'info');
      const success = await this.loadContentWithDiagnostics(page, null);
      results.push({ page, success });
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.log('🧪 Testing complete:', 'info');
    results.forEach(result => {
      this.log(`  ${result.success ? '✅' : '❌'} ${result.page}`, result.success ? 'success' : 'error');
    });

    return results;
  }
}

// Make available globally
window.ContentLoadingDiagnostics = ContentLoadingDiagnostics;
window.contentDiagnostics = new ContentLoadingDiagnostics();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentLoadingDiagnostics;
}
