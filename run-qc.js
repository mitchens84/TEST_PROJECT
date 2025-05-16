const fs = require('fs');
const path = require('path');

// Configuration
// const baseDir = path.join(__dirname, 'TEMPLATE'); // Old path
const baseDir = __dirname; // New path: script is in project root
const expressDir = path.join(baseDir, 'EXPRESS'); // EXPRESS is directly under project root
const autoStorageInitMarker = '<!-- AUTO-STORAGE-INIT -->';
const autoStorageScriptImportPattern = /<script[^>]+src=[\'"]([.\/]*src\/auto-storage\.js)[\'"][^>]*><\/script>/i;

let issuesFound = 0;

function logIssue(filePath, message) {
    console.warn(`QC Issue: [${filePath}] ${message}`);
    issuesFound++;
}

function getRelativePathToSrc(htmlFilePath) {
    const htmlFileDir = path.dirname(htmlFilePath);
    // const srcDir = path.join(baseDir, 'src'); // Old path
    const srcDir = path.join(__dirname, 'src'); // 'src' is directly under project root (__dirname)
    const relativePath = path.relative(htmlFileDir, srcDir);
    return path.join(relativePath, 'auto-storage.js').replace(/\\/g, '/'); // Ensure forward slashes
}

function checkHtmlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // 1. Basic HTML Validation (very rudimentary)
    if (!content.includes('<html') || !content.includes('</html>')) {
        logIssue(filePath, 'Missing <html> tags.');
    }
    if (!content.includes('<head') || !content.includes('</head>')) {
        logIssue(filePath, 'Missing <head> tags.');
    }
    if (!content.includes('<body') || !content.includes('</body>')) {
        logIssue(filePath, 'Missing <body> tags.');
    }
    if ((content.match(/<title>/g) || []).length !== 1 || (content.match(/<\/title>/g) || []).length !== 1) {
        logIssue(filePath, 'Should have exactly one <title> tag.');
    }

    // 2. Check for broken internal links (within TEMPLATE/EXPRESS/)
    const linkRegex = /<a[^>]+href=[\'"]([^\'"#]+)[\'"][^>]*>/gi;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        const href = match[1];
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            let targetPath = path.resolve(path.dirname(filePath), href);
            // Ensure the target path is within the expressDir for internal links we manage
            if (targetPath.startsWith(expressDir) && !fs.existsSync(targetPath)) {
                logIssue(filePath, `Broken internal link: ${href} (resolved to ${targetPath})`);
            }
        }
    }

    // 3. Verify elements intended for auto-storage have id, name, or data-id
    const interactiveElementRegex = /<(input|select|textarea|button)([^>]*)>/gi;
    while ((match = interactiveElementRegex.exec(content)) !== null) {
        const tagName = match[1].toLowerCase();
        const attributes = match[2];
        const fullTag = `<${tagName}${attributes}>`;

        // Check buttons only if they have class 'collapsible' for auto-storage purposes
        if (tagName === 'button') {
            if (!attributes.includes('class=') || !attributes.includes('collapsible')) {
                continue;
            }
        }
        if (!attributes.includes('id=') && !attributes.includes('name=') && !attributes.includes('data-id=')) {
            logIssue(filePath, `Interactive element <${tagName}> found without id, name, or data-id: ${fullTag.substring(0, 60)}...`);
        }
    }

    // 4. Check if auto-storage.js is imported correctly if the marker is present
    const hasMarker = content.includes(autoStorageInitMarker);
    const scriptMatch = content.match(autoStorageScriptImportPattern);

    if (hasMarker) {
        if (!scriptMatch) {
            logIssue(filePath, `Contains "${autoStorageInitMarker}" but no import for auto-storage.js was found.`);
        } else {
            const actualScriptPath = scriptMatch[1];
            const expectedScriptPath = getRelativePathToSrc(filePath);
            if (actualScriptPath !== expectedScriptPath) {
                logIssue(filePath, `Contains "${autoStorageInitMarker}" but auto-storage.js is imported with wrong path. Expected: "${expectedScriptPath}", Found: "${actualScriptPath}". Run setup-storage.js.`);
            }
        }
    } else {
        if (scriptMatch) {
            logIssue(filePath, `Imports auto-storage.js but the marker "${autoStorageInitMarker}" is missing.`);
        }
    }
}

function walkDir(dir, fileCallback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, fileCallback) : fileCallback(path.join(dir, f));
    });
}

console.log("Starting Quality Control script...");
console.log(`Scanning HTML files in: ${expressDir}\n`);

walkDir(expressDir, (filePath) => {
    if (path.extname(filePath).toLowerCase() === '.html') {
        try {
            checkHtmlFile(filePath);
        } catch (error) {
            console.error(`Error processing ${filePath} for QC: ${error.message}`);
            issuesFound++;
        }
    }
});

console.log('\n----------------------------------------');
if (issuesFound === 0) {
    console.log("QC Check Passed: No issues found.");
} else {
    console.error(`QC Check Failed: ${issuesFound} issue(s) found. Please review the warnings above.`);
    process.exitCode = 1; // Indicate failure for CI/build scripts
}
console.log('----------------------------------------');
