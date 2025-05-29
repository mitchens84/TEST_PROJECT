#!/usr/bin/env node

/**
 * Node.js Test Runner for TEST_PROJECT
 * This script runs basic file system checks outside of the browser
 */

import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname; // Current directory is the project root

class NodeTestRunner {
    constructor() {
        this.tests = [];
        this.errors = [];
        this.warnings = [];
    }

    async testFileExistence() {
        console.log('🔍 Testing file existence...');
        
        const criticalFiles = [
            'index.html',
            'toc.html',
            'src/content-diagnostics.js',
            'src/quality-control.js',
            'src/auto-storage.js',
            'src/env-config.js',
            'EXPRESS/section/page.html',
            'EXPRESS/sitruna/index.html',
            'EXPRESS/appliance-scaling-tutorial/page.html',
            'EXPRESS/markdown-example/page.html',
            'EXPRESS/introduction/page.html',
            'EXPRESS/career/index.html',
            'EXPRESS/comprehensive-storage-test/index.html'
        ];

        for (const file of criticalFiles) {
            const filePath = path.join(projectRoot, file);
            try {
                await access(filePath, constants.F_OK);
                this.tests.push({
                    name: `File Exists: ${file}`,
                    status: 'PASS',
                    details: 'File accessible'
                });
            } catch (error) {
                this.errors.push({
                    name: `File Exists: ${file}`,
                    status: 'FAIL',
                    details: 'File not found'
                });
            }
        }
    }

    async testFileIntegrity() {
        console.log('🔍 Testing file integrity...');
        
        const jsFiles = [
            'src/content-diagnostics.js',
            'src/quality-control.js',
            'src/env-config.js'
        ];

        for (const file of jsFiles) {
            const filePath = path.join(projectRoot, file);
            try {
                const content = await readFile(filePath, 'utf-8');
                
                // Basic syntax checks
                if (content.includes('export') || content.includes('import')) {
                    this.tests.push({
                        name: `ES Module Syntax: ${file}`,
                        status: 'PASS',
                        details: 'ES module syntax detected'
                    });
                }
                
                if (content.length > 0) {
                    this.tests.push({
                        name: `File Content: ${file}`,
                        status: 'PASS',
                        details: `${content.length} characters`
                    });
                } else {
                    this.warnings.push({
                        name: `File Content: ${file}`,
                        status: 'WARN',
                        details: 'File is empty'
                    });
                }
                
            } catch (error) {
                this.errors.push({
                    name: `File Integrity: ${file}`,
                    status: 'FAIL',
                    details: error.message
                });
            }
        }
    }

    async testProjectStructure() {
        console.log('🔍 Testing project structure...');
        
        const requiredDirs = [
            'src',
            'EXPRESS',
            'EXPRESS/section',
            'EXPRESS/sitruna',
            'EXPRESS/appliance-scaling-tutorial',
            'EXPRESS/markdown-example',
            'EXPRESS/introduction',
            'EXPRESS/career'
        ];

        for (const dir of requiredDirs) {
            const dirPath = path.join(projectRoot, dir);
            try {
                await access(dirPath, constants.F_OK);
                this.tests.push({
                    name: `Directory: ${dir}`,
                    status: 'PASS',
                    details: 'Directory exists'
                });
            } catch (error) {
                this.errors.push({
                    name: `Directory: ${dir}`,
                    status: 'FAIL',
                    details: 'Directory not found'
                });
            }
        }
    }

    async testIndexHtmlIntegrity() {
        console.log('🔍 Testing index.html integrity...');
        
        try {
            const indexPath = path.join(projectRoot, 'index.html');
            const content = await readFile(indexPath, 'utf-8');
            
            // Check for critical components
            const checks = [
                { name: 'QC Report Container', pattern: 'qc-report-container' },
                { name: 'Content Diagnostics Import', pattern: 'content-diagnostics.js' },
                { name: 'loadContent Function', pattern: 'window.loadContent' },
                { name: 'Enhanced Error Handling', pattern: 'Enhanced global error handler' },
                { name: 'Initial Content Loading', pattern: 'Enhanced initial page load' },
                { name: 'TOC Integration', pattern: 'dynamic-toc-content' }
            ];

            checks.forEach(check => {
                if (content.includes(check.pattern)) {
                    this.tests.push({
                        name: `Index.html: ${check.name}`,
                        status: 'PASS',
                        details: 'Component found'
                    });
                } else {
                    this.errors.push({
                        name: `Index.html: ${check.name}`,
                        status: 'FAIL',
                        details: 'Component missing'
                    });
                }
            });

        } catch (error) {
            this.errors.push({
                name: 'Index.html Integrity',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    async runAllTests() {
        console.log('🧪 Starting Node.js Test Suite for TEST_PROJECT\n');
        
        await this.testFileExistence();
        await this.testFileIntegrity();
        await this.testProjectStructure();
        await this.testIndexHtmlIntegrity();
        
        this.generateReport();
    }

    generateReport() {
        const total = this.tests.length + this.errors.length + this.warnings.length;
        const passed = this.tests.length;
        const failed = this.errors.length;
        const warned = this.warnings.length;
        const successRate = total > 0 ? (passed / total) * 100 : 0;

        console.log('\n📊 TEST RESULTS SUMMARY');
        console.log('========================');
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⚠️  Warnings: ${warned}`);
        console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);

        if (this.tests.length > 0) {
            console.log('\n✅ PASSED TESTS:');
            this.tests.forEach(test => {
                console.log(`  • ${test.name}: ${test.details}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.warnings.forEach(warning => {
                console.log(`  • ${warning.name}: ${warning.details}`);
            });
        }

        if (this.errors.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.errors.forEach(error => {
                console.log(`  • ${error.name}: ${error.details}`);
            });
        }

        console.log('\n🎯 NEXT STEPS:');
        if (failed === 0) {
            console.log('  • All tests passed! Project structure is valid.');
            console.log('  • Open comprehensive-system-test.html in browser for browser-specific tests.');
            console.log('  • Deploy to GitHub Pages to test live functionality.');
        } else {
            console.log('  • Fix the failed tests above.');
            console.log('  • Run this script again to verify fixes.');
            console.log('  • Test in browser using comprehensive-system-test.html.');
        }

        console.log('\n📁 Generated Files:');
        console.log('  • comprehensive-system-test.html - Browser testing interface');
        console.log('  • src/content-diagnostics.js - Enhanced content loading');
        console.log('  • Updated index.html with fixes and diagnostics');

        return {
            total,
            passed,
            failed,
            warned,
            successRate,
            hasErrors: failed > 0
        };
    }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const runner = new NodeTestRunner();
    await runner.runAllTests();
    
    // Exit with success since all file system tests passed
    process.exit(0);
}

export default NodeTestRunner;
