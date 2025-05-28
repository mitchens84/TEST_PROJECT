const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const projectRoot = path.resolve(__dirname);
// const templateExpressDir = path.join(projectRoot, 'TEMPLATE', 'EXPRESS'); // Old path
const expressDir = path.join(projectRoot, 'EXPRESS'); // New path for EXPRESS directly under project root

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Creates a default page.html in the given section directory.
 * @param {string} sectionDirPath Absolute path to the section directory.
 * @param {string} sectionName Name of the section.
 */
function createDefaultPageHtml(sectionDirPath, sectionName) {
  const pageHtmlPath = path.join(sectionDirPath, 'page.html');
  const sectionTitle = sectionName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

  // Adjust relative paths for assets and index.html
  const assetsPath = path.join(projectRoot, 'assets', 'styles', 'main.css');
  const indexPath = path.join(projectRoot, 'index.html');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sectionTitle}</title>
    <!-- Adjust path to main.css based on depth from project root -->
    <link rel="stylesheet" href="${path.relative(sectionDirPath, assetsPath).replace(/\\\\/g, '/')}">
    <script>
        // Apply theme on initial load and listen for changes from parent
        function applyTheme(theme) {
            // Ensure body exists before manipulating it
            if (document.body) { 
                if (theme === 'dark') {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            } else {
                console.error('Content page theme: document.body is not available for theme application.');
            }
        }
        // Initial theme application from localStorage
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                // Apply theme before body is fully rendered to avoid flash
                if (document.documentElement && savedTheme === 'dark') document.documentElement.classList.add('dark-theme-preload'); 
            } else {
                 // Optional: could check prefers-color-scheme
            }
        } catch (e) {
            console.warn('Could not access localStorage for initial theme in iframe');
        }

        window.addEventListener('DOMContentLoaded', () => {
            // Remove preload class after styles are applied
            if (document.documentElement && document.documentElement.classList.contains('dark-theme-preload')) {
                 document.documentElement.classList.remove('dark-theme-preload');
                 if (document.body) document.body.classList.add('dark-theme'); // Ensure body class is set
            } else {
                 // If not preloaded (e.g. no theme in localstorage or it was light)
                 // still try to apply from localstorage in case it was set to light explicitly
                 try {
                    const currentTheme = localStorage.getItem('theme');
                     if (currentTheme) applyTheme(currentTheme);
                 } catch(e) { /* ignore */ }
            }


            window.addEventListener('message', function(event) {
                // Optional: Check event.origin for security if the origin is known and static
                // if (event.origin !== 'http://your-main-app-origin.com') return; 
                if (event.data && event.data.type === 'themeChange') {
                    applyTheme(event.data.theme);
                    // Also update localStorage in the iframe to keep it synced
                    try {
                        localStorage.setItem('theme', event.data.theme);
                    } catch (e) {
                        console.warn('Could not set localStorage theme in iframe');
                    }
                }
            });
        });
    <\/script>
    <style>
        /* Prevent FOUC (Flash Of Unstyled Content) for dark theme */
        .dark-theme-preload { background-color: #121212; color: #e0e0e0; }
    </style>
</head>
<body style="padding: 20px;">
    <header>
        <nav>
            <!-- Adjust path to index.html based on depth from project root -->
            <a href="${path.relative(sectionDirPath, indexPath).replace(/\\\\/g, '/')}">Home</a>
        </nav>
        <h1>${sectionTitle}</h1>
    </header>
    <main>
        <p>This page was automatically created for the "${sectionName}" section.</p>
        <p>Edit this file to add your main content for this section, or to link to other files you've added in this directory.</p>
        
        <h2>Files in this section:</h2>
        <ul>
            ${fs.readdirSync(sectionDirPath).map(file => `<li><a href="./${file}">${file}</a></li>`).join('\n            ')}
        </ul>
    </main>
    <footer>
        <p>&copy; <span id="currentYear">${new Date().getFullYear()}</span> Your Project</p>
        <!-- AUTO-STORAGE-INIT -->
        <script>
            // Optional: if you need dynamic year update on client side, keep this.
            // document.getElementById('currentYear').textContent = new Date().getFullYear();

            // Request theme from parent on load, in case message was missed or for initial sync
            // This is an additional measure. The DOMContentLoaded listener above handles initial localStorage.
            // And the parent is supposed to send the theme on iframe load.
            if (window.parent && window.parent !== window) {
                try {
                    const currentThemeInParent = parent.localStorage.getItem('theme');
                     if (currentThemeInParent) {
                        applyTheme(currentThemeInParent);
                        localStorage.setItem('theme', currentThemeInParent); // Sync iframe's local storage
                     }
                } catch(e) {
                    console.warn("iframe could not access parent's localStorage for theme sync on load.")
                }
            }
        </script>
    </footer>
</body>
</html>`;

  try {
    fs.writeFileSync(pageHtmlPath, htmlContent, 'utf8');
    console.log(`Created default page.html for section "${sectionName}" at ${pageHtmlPath}`);
  } catch (err) {
    console.error(`Error creating page.html for section "${sectionName}":`, err);
  }
}

/**
 * Runs the generate-toc.js script.
 */
function runGenerateToc() {
  return new Promise((resolve, reject) => {
    console.log('\nRunning generate-toc.js...');
    const generateTocScript = path.join(projectRoot, 'generate-toc.js');
    
    const child = spawn('node', [generateTocScript, '--all'], { stdio: 'inherit', shell: process.platform === 'win32' });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('generate-toc.js completed successfully.');
        resolve();
      } else {
        console.error(`generate-toc.js exited with code ${code}`);
        reject(new Error(`generate-toc.js failed with code ${code}`));
      }
    });

    child.on('error', (err) => {
      console.error('Failed to start generate-toc.js:', err);
      reject(err);
    });
  });
}

/**
 * Main function to process added content.
 * @param {string} newContentPath Relative path from project root to the new content file or directory.
 */
async function processNewContent(newContentPath) {
  const absoluteContentPath = path.resolve(projectRoot, newContentPath);
  let targetSectionDirPath;
  // let isNewSection = false; // Flag to know if we are creating a new section directory - not strictly needed with current logic flow

  // Validate path is within EXPRESS
  if (!absoluteContentPath.startsWith(expressDir + path.sep)) {
    console.error(`Error: Content must be added within the EXPRESS directory (e.g., EXPRESS/section-name/your-file.html or EXPRESS/new-section-name).`);
    console.error(`Provided path: ${newContentPath} (resolved to: ${absoluteContentPath})`);
    console.error(`EXPRESS directory: ${expressDir}`);
    return;
  }

  // Determine targetSectionDirPath
  // If the path looks like a file (e.g., ends with .html, .md)
  if (/\.[a-zA-Z0-9]+$/.test(newContentPath)) { 
    targetSectionDirPath = path.dirname(absoluteContentPath);
    // This script focuses on the section's page.html. The actual file (absoluteContentPath)
    // would be created/managed by the user or another process.
  } else {
    // Assumed to be a directory path for a section (new or existing)
    targetSectionDirPath = absoluteContentPath;
  }

  // Further validation for targetSectionDirPath
  if (targetSectionDirPath === expressDir) {
    console.error('Error: Cannot target EXPRESS/ directly. Please specify a section subdirectory.');
    return;
  }
  // A check for projectRoot might be redundant if expressDir is correctly nested, but good for safety.
  if (targetSectionDirPath === projectRoot) { 
    console.error('Error: Target directory cannot be the project root.');
    return;
  }

  // Ensure section directory (targetSectionDirPath) exists
  if (!fs.existsSync(targetSectionDirPath)) {
    try {
        console.log(`Section directory ${targetSectionDirPath} does not exist. Creating it.`);
        fs.mkdirSync(targetSectionDirPath, { recursive: true });
        console.log(`Created section directory: ${targetSectionDirPath}`);
    } catch (err) {
        console.error(`Error creating section directory ${targetSectionDirPath}:`, err);
        return;
    }
  } else {
    // If it exists, ensure it's a directory
    const sectionDirStats = fs.statSync(targetSectionDirPath);
    if (!sectionDirStats.isDirectory()) {
        console.error(`Error: The path ${targetSectionDirPath} exists but is not a directory. Cannot create/update section's page.html here.`);
        return;
    }
    console.log(`Section directory ${targetSectionDirPath} already exists.`);
  }
  
  const sectionName = path.basename(targetSectionDirPath);
  const pageHtmlPath = path.join(targetSectionDirPath, 'page.html');

  // Create or update page.html
  // Create page.html if it doesn't exist
  if (!fs.existsSync(pageHtmlPath)) {
    console.log(`page.html not found in section \"${sectionName}\". Creating a default one.`);
    createDefaultPageHtml(targetSectionDirPath, sectionName);
  } else {
    console.log(`page.html already exists in section \"${sectionName}\". Skipping creation/update of page.html itself. The TOC will still be updated.`);
    // The existing page.html will NOT be overwritten.
  }

  try {
    await runGenerateToc();
    console.log('\\nProcess complete. ToCs have been updated.');
  } catch (error) {
    console.error('\\nFailed to update ToCs:', error);
    // Decide if this should be a fatal error for the script
  }
}

/**
 * Main execution block
 */
// --- Main Execution ---
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0 && (args[0] === '-h' || args[0] === '--help')) {
    console.log('Usage: node add-content.js [relativePathToNewContentFileOrDirectory]');
    console.log('Example (new file in existing/new section): node add-content.js EXPRESS/my-new-section/my-image.png');
    console.log('Example (new section directory): node add-content.js EXPRESS/brand-new-section');
    process.exit(0);
  }

  if (args.length > 0) {
    const newContentPathArg = args[0];
    console.log(`Processing content path: ${newContentPathArg}`);
    processNewContent(newContentPathArg).finally(() => rl.close());
  } else {
    rl.question('Enter the relative path (from project root) to the newly added content file or section directory: ', (newContentPath) => {
      if (!newContentPath) {
        console.error('No path provided. Exiting.');
        rl.close();
        return;
      }
      processNewContent(newContentPath.trim()).finally(() => rl.close());
    });
  }
}

module.exports = { processNewContent, createDefaultPageHtml };
