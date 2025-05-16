const fs = require('fs');
const path = require('path');

const expressDir = path.join(__dirname, 'EXPRESS');
const autoStorageScriptTag = '<script type="module" src="../src/auto-storage.js"></script>';
const autoStorageInitMarker = '<!-- AUTO-STORAGE-INIT -->';

function getRelativePathToSrc(htmlFilePath) {
    const htmlFileDir = path.dirname(htmlFilePath);
    const srcDir = path.join(__dirname, 'src'); // src is directly under project root (__dirname)
    let relativePath = path.relative(htmlFileDir, srcDir);
    if (!relativePath.startsWith('..') && !relativePath.startsWith('.')) {
        // Handles cases where htmlFileDir might be the same as srcDir or a child, though unlikely for EXPRESS pages
        relativePath = './' + relativePath;
    }
    return path.join(relativePath, 'auto-storage.js').replace(/\\/g, '/'); // Ensure forward slashes and normalize
}

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const scriptPath = getRelativePathToSrc(filePath);
    const dynamicScriptTag = `<script type="module" src="${scriptPath}"></script>`;

    // Check if the specific dynamic script tag or the marker is present
    if (content.includes(dynamicScriptTag)) {
        console.log(`Skipped: ${filePath} (already has correct script tag)`);
        return;
    }
    if (!content.includes(autoStorageInitMarker)) {
        console.log(`Skipped: ${filePath} (marker "${autoStorageInitMarker}" not found)`);
        return;
    }

    // Remove any old/generic auto-storage script tag if present
    content = content.replace(/<script type="module" src="([.\/]*src\/auto-storage\.js)"><\/script>\s*\n?/gi, '');

    // Add the new script tag immediately before or after the marker
    // Preferring to place it after the marker for clarity
    content = content.replace(autoStorageInitMarker, `${autoStorageInitMarker}\n  ${dynamicScriptTag}`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

console.log(`Starting setup-storage.js script...`);
console.log(`Scanning HTML files in: ${expressDir}`);

walkDir(expressDir, (filePath) => {
    if (path.extname(filePath).toLowerCase() === '.html') {
        try {
            processHtmlFile(filePath);
        } catch (error) {
            console.error(`Error processing ${filePath}: ${error.message}`);
        }
    }
});

console.log("Finished setup-storage.js script.");
