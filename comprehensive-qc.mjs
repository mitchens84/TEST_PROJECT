#!/usr/bin/env node

/**
 * Comprehensive Quality Control Test Runner
 * Tests all aspects of the front-end application
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import http from 'http';

class ComprehensiveQC {
  constructor() {
    this.tests = [];
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      pass: '\x1b[32m',    // Green
      fail: '\x1b[31m',    // Red
      warn: '\x1b[33m',    // Yellow
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async testServerRunning() {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 8000,
        path: '/',
        method: 'HEAD',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          this.tests.push({ name: 'Server Running', status: 'PASS', details: `HTTP ${res.statusCode}` });
          resolve(true);
        } else {
          this.errors.push({ name: 'Server Running', status: 'FAIL', details: `HTTP ${res.statusCode}` });
          resolve(false);
        }
      });

      req.on('error', (e) => {
        this.errors.push({ name: 'Server Running', status: 'FAIL', details: e.message });
        resolve(false);
      });

      req.on('timeout', () => {
        this.errors.push({ name: 'Server Running', status: 'FAIL', details: 'Request timeout' });
        resolve(false);
      });

      req.end();
    });
  }

  testFileStructure() {
    const requiredFiles = [
      'index.html',
      'toc.html',
      'src/env-config.js',
      'src/auto-storage.js',
      'src/router.js',
      'src/quality-control.js',
      'src/module-loader.js',
      'src/storage-manager.js',
      'EXPRESS/introduction/page.html',
      'EXPRESS/comprehensive-storage-test/index.html'
    ];

    for (const file of requiredFiles) {
      if (existsSync(file)) {
        this.tests.push({ name: `File Structure: ${file}`, status: 'PASS', details: 'File exists' });
      } else {
        this.errors.push({ name: `File Structure: ${file}`, status: 'FAIL', details: 'File missing' });
      }
    }
  }

  testJavaScriptSyntax() {
    const jsFiles = [
      'src/env-config.js',
      'src/auto-storage.js',
      'src/router.js',
      'src/quality-control.js',
      'src/module-loader.js',
      'src/storage-manager.js'
    ];

    for (const file of jsFiles) {
      try {
        if (existsSync(file)) {
          execSync(`node -c ${file}`, { stdio: 'pipe' });
          this.tests.push({ name: `Syntax Check: ${file}`, status: 'PASS', details: 'Valid JavaScript' });
        }
      } catch (error) {
        this.errors.push({ name: `Syntax Check: ${file}`, status: 'FAIL', details: error.message });
      }
    }
  }

  async testModuleExports() {
    const modules = [
      { path: './src/env-config.js', name: 'env-config' },
      { path: './src/router.js', name: 'router' },
      { path: './src/auto-storage.js', name: 'auto-storage' },
      { path: './src/quality-control.js', name: 'quality-control' },
      { path: './src/module-loader.js', name: 'module-loader' }
    ];

    for (const module of modules) {
      try {
        const imported = await import(module.path);
        if (imported.default || Object.keys(imported).length > 0) {
          this.tests.push({ name: `Module Export: ${module.name}`, status: 'PASS', details: 'Module exports available' });
        } else {
          this.errors.push({ name: `Module Export: ${module.name}`, status: 'FAIL', details: 'No exports found' });
        }
      } catch (error) {
        this.errors.push({ name: `Module Export: ${module.name}`, status: 'FAIL', details: error.message });
      }
    }
  }

  async testHTTPEndpoints() {
    const endpoints = [
      '/',
      '/toc.html',
      '/src/env-config.js',
      '/EXPRESS/introduction/page.html',
      '/EXPRESS/comprehensive-storage-test/index.html'
    ];

    for (const endpoint of endpoints) {
      await new Promise((resolve) => {
        const options = {
          hostname: 'localhost',
          port: 8000,
          path: endpoint,
          method: 'HEAD',
          timeout: 3000
        };

        const req = http.request(options, (res) => {
          if (res.statusCode === 200) {
            this.tests.push({ name: `HTTP: ${endpoint}`, status: 'PASS', details: `HTTP ${res.statusCode}` });
          } else {
            this.errors.push({ name: `HTTP: ${endpoint}`, status: 'FAIL', details: `HTTP ${res.statusCode}` });
          }
          resolve();
        });

        req.on('error', (e) => {
          this.errors.push({ name: `HTTP: ${endpoint}`, status: 'FAIL', details: e.message });
          resolve();
        });

        req.on('timeout', () => {
          this.errors.push({ name: `HTTP: ${endpoint}`, status: 'FAIL', details: 'Timeout' });
          resolve();
        });

        req.end();
      });
    }
  }

  async runAllTests() {
    this.log('🧪 Starting Comprehensive Quality Control Tests...', 'info');
    
    // Test server first
    const serverRunning = await this.testServerRunning();
    if (!serverRunning) {
      this.log('❌ Server not running. Please start the server first.', 'fail');
      return this.generateReport();
    }

    // Run all tests
    this.testFileStructure();
    this.testJavaScriptSyntax();
    await this.testModuleExports();
    await this.testHTTPEndpoints();

    return this.generateReport();
  }

  generateReport() {
    const total = this.tests.length + this.errors.length + this.warnings.length;
    const passed = this.tests.length;
    const failed = this.errors.length;
    const warned = this.warnings.length;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

    this.log('', 'info');
    this.log('📊 Comprehensive Quality Control Report', 'info');
    this.log('=========================================', 'info');
    this.log(`Total Tests: ${total}`, 'info');
    this.log(`✅ Passed: ${passed}`, passed > 0 ? 'pass' : 'info');
    this.log(`❌ Failed: ${failed}`, failed > 0 ? 'fail' : 'info');
    this.log(`⚠️  Warnings: ${warned}`, warned > 0 ? 'warn' : 'info');
    this.log(`Success Rate: ${successRate}%`, failed === 0 ? 'pass' : 'fail');

    if (this.tests.length > 0) {
      this.log('', 'info');
      this.log('✅ Passed Tests:', 'pass');
      this.tests.forEach(test => {
        this.log(`  • ${test.name}: ${test.details}`, 'pass');
      });
    }

    if (this.warnings.length > 0) {
      this.log('', 'info');
      this.log('⚠️  Warnings:', 'warn');
      this.warnings.forEach(warning => {
        this.log(`  • ${warning.name}: ${warning.details}`, 'warn');
      });
    }

    if (this.errors.length > 0) {
      this.log('', 'info');
      this.log('❌ Failed Tests:', 'fail');
      this.errors.forEach(error => {
        this.log(`  • ${error.name}: ${error.details}`, 'fail');
      });
    }

    this.log('', 'info');
    this.log(failed === 0 ? '🎉 All tests passed!' : '🔧 Some tests failed. Please review and fix the issues.', failed === 0 ? 'pass' : 'fail');
    
    return {
      total,
      passed,
      failed,
      warned,
      successRate: parseFloat(successRate),
      hasErrors: failed > 0,
      tests: this.tests,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const qc = new ComprehensiveQC();
  qc.runAllTests().then(report => {
    process.exit(report.hasErrors ? 1 : 0);
  }).catch(error => {
    console.error('❌ QC test runner failed:', error);
    process.exit(1);
  });
}

export default ComprehensiveQC;
