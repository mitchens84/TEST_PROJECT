/**
 * Quality Control and Testing Script
 * This script performs automated checks on the front-end application
 */

class QualityController {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.tests = [];
  }

  // Test module loading
  async testModuleLoading() {
    const modules = [
      'env-config.js',
      'auto-storage.js',
      'simple-storage.js',
      'storage-manager.js',
      'module-loader.js',
      'router.js'
    ];

    for (const modulePath of modules) {
      try {
        const module = await import(`./${modulePath}`);
        this.tests.push({ 
          name: `Module Load: src/${modulePath}`, 
          status: 'PASS', 
          details: 'Module loaded successfully' 
        });
      } catch (error) {
        this.errors.push({
          name: `Module Load: src/${modulePath}`,
          status: 'FAIL',
          details: error.message
        });
      }
    }
  }

  // Test file existence
  async testFileExistence() {
    const files = [
      'toc.html',
      'index.html',
      'EXPRESS/introduction/page.html',
      'EXPRESS/comprehensive-storage-test/index.html',
      'EXPRESS/section/page.html',                    // Content demonstrations
      'EXPRESS/sitruna/index.html',                   // Sitruna knowledge map
      'EXPRESS/appliance-scaling-tutorial/page.html', // Appliance scaling tutorial
      'EXPRESS/markdown-example/page.html',           // Markdown rendering example
      'EXPRESS/career/index.html',                    // Career proposal
      'EXPRESS/complex-showcase/index.html'           // Complex showcase
    ];

    for (const filePath of files) {
      try {
        const response = await fetch(filePath, { method: 'HEAD' });
        if (response.ok) {
          this.tests.push({
            name: `File Exists: ${filePath}`,
            status: 'PASS',
            details: `HTTP ${response.status}`
          });
        } else {
          this.errors.push({
            name: `File Exists: ${filePath}`,
            status: 'FAIL',
            details: `HTTP ${response.status} - ${response.statusText}`
          });
        }
      } catch (error) {
        this.errors.push({
          name: `File Exists: ${filePath}`,
          status: 'FAIL',
          details: error.message
        });
      }
    }
  }

  // Test localStorage functionality
  testLocalStorage() {
    try {
      const testKey = 'qc_test_' + Date.now();
      const testValue = { test: true, timestamp: Date.now() };
      
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      localStorage.removeItem(testKey);
      
      if (retrieved && retrieved.test === true) {
        this.tests.push({
          name: 'LocalStorage Test',
          status: 'PASS',
          details: 'localStorage read/write/delete works'
        });
      } else {
        this.errors.push({
          name: 'LocalStorage Test',
          status: 'FAIL',
          details: 'Retrieved data does not match stored data'
        });
      }
    } catch (error) {
      this.errors.push({
        name: 'LocalStorage Test',
        status: 'FAIL',
        details: error.message
      });
    }
  }

  // Test DOM elements
  testDOMElements() {
    const requiredElements = [
      'dynamic-toc-content',
      'home-content',
      'sidebar',
      'content-area',
      'theme-toggle-btn'
    ];

    for (const elementId of requiredElements) {
      const element = document.getElementById(elementId);
      if (element) {
        this.tests.push({
          name: `DOM Element: ${elementId}`,
          status: 'PASS',
          details: `Element found: ${element.tagName}`
        });
      } else {
        this.errors.push({
          name: `DOM Element: ${elementId}`,
          status: 'FAIL',
          details: 'Element not found in DOM'
        });
      }
    }
  }

  // Test console for errors
  testConsoleErrors() {
    // This would need to be implemented differently in a real browser environment
    // For now, we'll just check if console methods exist
    if (window.console && typeof console.error === 'function') {
      this.tests.push({
        name: 'Console Error Function',
        status: 'PASS',
        details: 'Console error logging available'
      });
    } else {
      this.warnings.push({
        name: 'Console Error Function',
        status: 'WARN',
        details: 'Console error logging not available'
      });
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Starting Quality Control Tests...');
    
    this.testDOMElements();
    this.testLocalStorage();
    this.testConsoleErrors();
    await this.testFileExistence();
    await this.testModuleLoading();
    
    this.generateReport();
  }

  // Generate test report
  generateReport() {
    const total = this.tests.length + this.errors.length + this.warnings.length;
    const passed = this.tests.length;
    const failed = this.errors.length;
    const warned = this.warnings.length;

    console.log('\n📊 Quality Control Report');
    console.log('========================');
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warned}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (this.tests.length > 0) {
      console.log('\n✅ Passed Tests:');
      this.tests.forEach(test => {
        console.log(`  • ${test.name}: ${test.details}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => {
        console.log(`  • ${warning.name}: ${warning.details}`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.errors.forEach(error => {
        console.log(`  • ${error.name}: ${error.details}`);
      });
    }

    // Update collapsible UI report
    this.updateCollapsibleReport({
      total,
      passed,
      failed,
      warned,
      successRate: (passed / total) * 100,
      hasErrors: failed > 0,
      tests: this.tests,
      errors: this.errors,
      warnings: this.warnings
    });

    // Return summary for external use
    return {
      total,
      passed,
      failed,
      warned,
      successRate: (passed / total) * 100,
      hasErrors: failed > 0,
      tests: this.tests,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  // Update the collapsible report UI
  updateCollapsibleReport(report) {
    const container = document.getElementById('qc-report-container');
    const summary = document.getElementById('qc-report-summary');
    const details = document.getElementById('qc-report-details');
    const header = document.getElementById('qc-report-header');
    const content = document.getElementById('qc-report-content');
    const toggleIcon = document.getElementById('qc-toggle-icon');

    if (!container || !summary || !details) {
      console.warn('QC Report: UI elements not found in DOM');
      return;
    }

    // If no report provided, generate a summary from current state
    if (!report) {
      const total = this.tests.length + this.errors.length + this.warnings.length;
      const passed = this.tests.length;
      const failed = this.errors.length;
      const warned = this.warnings.length;
      
      report = {
        total,
        passed,
        failed,
        warned,
        successRate: total > 0 ? (passed / total) * 100 : 0,
        hasErrors: failed > 0,
        tests: this.tests || [],
        errors: this.errors || [],
        warnings: this.warnings || []
      };
    }

    // Show the container
    container.style.display = 'block';

    // Update summary
    const successRate = report.successRate ? report.successRate.toFixed(1) : '0.0';
    const statusColor = report.hasErrors ? '#ff4444' : (report.warned || 0) > 0 ? '#ff8800' : '#44aa44';
    
    summary.innerHTML = `
      <div style="color: ${statusColor}; font-size: 14px;">
        Success Rate: ${successRate}% | ✅ ${report.passed || 0} ❌ ${report.failed || 0} ⚠️ ${report.warned || 0}
      </div>
    `;

    // Update detailed results
    let detailsHTML = '';
    
    if (report.tests && report.tests.length > 0) {
      detailsHTML += '<div style="margin-bottom: 8px;"><strong style="color: #44aa44;">✅ Passed Tests:</strong></div>';
      report.tests.forEach(test => {
        detailsHTML += `<div style="margin-left: 10px; color: #666; font-size: 11px;">• ${test.name}: ${test.details}</div>`;
      });
    }
    
    if (report.warnings && report.warnings.length > 0) {
      detailsHTML += '<div style="margin: 8px 0 4px 0;"><strong style="color: #ff8800;">⚠️ Warnings:</strong></div>';
      report.warnings.forEach(warning => {
        detailsHTML += `<div style="margin-left: 10px; color: #ff8800; font-size: 11px;">• ${warning.name}: ${warning.details}</div>`;
      });
    }
    
    if (report.errors && report.errors.length > 0) {
      detailsHTML += '<div style="margin: 8px 0 4px 0;"><strong style="color: #ff4444;">❌ Failed Tests:</strong></div>';
      report.errors.forEach(error => {
        detailsHTML += `<div style="margin-left: 10px; color: #ff4444; font-size: 11px;">• ${error.name}: ${error.details}</div>`;
      });
    }

    if (!detailsHTML) {
      detailsHTML = '<div style="color: #666; font-size: 11px;">No test results available yet.</div>';
    }

    details.innerHTML = detailsHTML;

    // Setup toggle functionality
    if (header && !header.hasAttribute('data-toggle-setup')) {
      header.setAttribute('data-toggle-setup', 'true');
      header.addEventListener('click', () => {
        const isCollapsed = content.style.display === 'none';
        content.style.display = isCollapsed ? 'block' : 'none';
        if (toggleIcon) {
          toggleIcon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }
  }

  // Create visual report in DOM
  createVisualReport() {
    const reportContainer = document.createElement('div');
    reportContainer.id = 'quality-control-report';
    reportContainer.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 400px;
      max-height: 500px;
      overflow-y: auto;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      font-family: monospace;
      font-size: 12px;
    `;

    const report = this.generateReport();
    
    reportContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #333;">QC Report</h3>
        <button onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div>
        <strong>Success Rate: ${report.successRate.toFixed(1)}%</strong><br>
        ✅ ${report.passed} | ❌ ${report.failed} | ⚠️ ${report.warned}
      </div>
      ${report.errors.length > 0 ? `
        <details style="margin-top: 10px;">
          <summary style="color: red; cursor: pointer;">❌ Errors (${report.errors.length})</summary>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${report.errors.map(error => `<li>${error.name}: ${error.details}</li>`).join('')}
          </ul>
        </details>
      ` : ''}
      ${report.warnings.length > 0 ? `
        <details style="margin-top: 10px;">
          <summary style="color: orange; cursor: pointer;">⚠️ Warnings (${report.warnings.length})</summary>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${report.warnings.map(warning => `<li>${warning.name}: ${warning.details}</li>`).join('')}
          </ul>
        </details>
      ` : ''}
      <details style="margin-top: 10px;">
        <summary style="color: green; cursor: pointer;">✅ Passed (${report.passed})</summary>
        <ul style="margin: 5px 0; padding-left: 20px;">
          ${report.tests.map(test => `<li>${test.name}</li>`).join('')}
        </ul>
      </details>
    `;

    // Remove existing report if present
    const existingReport = document.getElementById('quality-control-report');
    if (existingReport) {
      existingReport.remove();
    }

    document.body.appendChild(reportContainer);
    return report;
  }
}

// Make QualityController available globally
window.QualityController = QualityController;

// Auto-run QC when this script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const qc = new QualityController();
      qc.runAllTests().then(() => {
        qc.updateCollapsibleReport();
      });
    }, 2000); // Wait 2 seconds for everything to load
  });
} else {
  setTimeout(() => {
    const qc = new QualityController();
    qc.runAllTests().then(() => {
      qc.updateCollapsibleReport();
    });
  }, 2000);
}

export default QualityController;
