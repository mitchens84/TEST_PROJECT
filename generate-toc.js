import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Extracts the title from an HTML file and applies specified casing.
 * @param {string} filePath - Absolute path to the HTML file.
 * @param {boolean} isPrimaryPage - True if the page is a primary section page, false otherwise.
 * @returns {string|null} The cased content of the <title> tag, or the cased section directory name as a fallback.
 */
function extractTitle(filePath, isPrimaryPage) {
  let title = '';
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    } else {
      // Fallback to the parent directory name of the file (i.e., the section name)
      title = path.basename(path.dirname(filePath));
    }
  } catch (err) {
    console.error(`Error reading or parsing title from ${filePath}:`, err);
    title = path.basename(path.dirname(filePath)); // Fallback on error
  }

  // Ensure all titles are uppercase for TOC display
  return title.toUpperCase();
}

/**
 * Generates an HTML Table of Contents from the EXPRESS directory structure.
 * @param {string} expressDir - Absolute path to the EXPRESS directory.
 * @param {string} outputFilePath - Absolute path for the output HTML ToC file.
 * @param {string} baseOutputDirectory - Absolute path to the base directory from which links in ToC should be relative.
 */
function generateHtmlToc(expressDir, outputFilePath, baseOutputDirectory) {
  const preferredOrder = [
    "INTRODUCTION",
    "FEATURES",
    "CONTENT DEMONSTRATIONS", // was "section"
    "ADVANCED SHOWCASES",   // was "new-test-section"
    "SITRUNA KNOWLEDGE MAP", // was "sitruna"
    "APPLIANCE SCALING TUTORIAL",
    "MARKDOWN RENDERING EXAMPLE",
    "COMPREHENSIVE STORAGE TEST", // for test.html (assuming test.html is moved into EXPRESS/comprehensive-storage-test/index.html)
    "CAREER PROPOSAL - INTERACTIVE", // was "career"
    "COMPLEX CONTENT SHOWCASE" // was "complex-showcase"
  ];
  let htmlToc = '<input type="text" id="toc-search" placeholder="Search ToC..." onkeyup="filterToc()" style="width: 90%; margin-bottom: 10px; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background-color: var(--background-color); color: var(--text-color);">\n<ul>\n';
  try {
    const sectionNames = fs.readdirSync(expressDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const sectionDetails = [];

    // Remove 'Home' link from ToC generation by not adding it initially
    // The existing logic correctly builds the ToC from directories

    for (const sectionName of sectionNames) {
      const sectionPath = path.join(expressDir, sectionName);
      let primaryPagePath = null;
      let primaryPageFileName = '';

      const potentialPrimaryPageHtml = path.join(sectionPath, 'page.html');
      if (fs.existsSync(potentialPrimaryPageHtml)) {
        primaryPagePath = potentialPrimaryPageHtml;
        primaryPageFileName = 'page.html';
      } else {
        const potentialPrimaryIndexHtml = path.join(sectionPath, 'index.html');
        if (fs.existsSync(potentialPrimaryIndexHtml)) {
          primaryPagePath = potentialPrimaryIndexHtml;
          primaryPageFileName = 'index.html';
        }
      }
      
      let displayTitle = sectionName.toUpperCase(); // Default if no primary page or title
      if (primaryPagePath) {
        displayTitle = extractTitle(primaryPagePath, true);
      } else {
         // If no primary page, use section name, uppercased for sorting, but might be displayed differently if only sub-pages
         const allHtmlFilesCheck = fs.readdirSync(sectionPath).filter(file => file.endsWith('.html'));
         if (allHtmlFilesCheck.length === 0) continue; // Skip if no HTML files at all
      }
      sectionDetails.push({ name: sectionName, path: sectionPath, displayTitle, primaryPagePath, primaryPageFileName });
    }

    // Sort sections:
    const preferredSections = [];
    const otherSections = [];

    for (const section of sectionDetails) {
      const orderIndex = preferredOrder.indexOf(section.displayTitle);
      if (orderIndex !== -1) {
        preferredSections[orderIndex] = section; // Place in correct order
      } else {
        otherSections.push(section);
      }
    }
    
    const finalSortedSections = preferredSections.filter(s => s) // Remove empty slots if any preferred item wasn't found
                                .concat(otherSections.sort((a, b) => a.displayTitle.localeCompare(b.displayTitle)));


    for (const section of finalSortedSections) {
      const sectionPath = section.path; // Already absolute
      let primaryPagePath = section.primaryPagePath;
      let primaryPageFileName = section.primaryPageFileName;

      // Scan for all HTML files in the section
      const allHtmlFiles = fs.readdirSync(sectionPath)
        .filter(file => file.endsWith('.html'));

      // Section title for display (already uppercased from sorting prep)
      let sectionDisplayTitle = section.displayTitle;
      let primaryLinkPath = null;

      if (primaryPagePath) {
        primaryLinkPath = path.relative(baseOutputDirectory, primaryPagePath).replace(/\\/g, '/');
      } else if (allHtmlFiles.length === 0) {
        continue;
      }

      // Override link for CONTENT DEMONSTRATIONS to point to example-subpage.html
      if (sectionDisplayTitle === "CONTENT DEMONSTRATIONS") {
        const targetPage = 'example-subpage.html';
        const specificPagePath = path.join(sectionPath, targetPage);
        if (fs.existsSync(specificPagePath)) {
          primaryLinkPath = path.relative(baseOutputDirectory, specificPagePath).replace(/\\/g, '/');
        } else {
          console.warn(`[ToC] CONTENT DEMONSTRATIONS: ${targetPage} not found in ${sectionPath}. Defaulting to ${primaryLinkPath || 'no primary page'}.`);
        }
      }

      // Identify secondary pages
      const secondaryPages = [];
      // For "CONTENT DEMONSTRATIONS", we don't want to list sub-pages in the TOC
      if (sectionDisplayTitle !== "CONTENT DEMONSTRATIONS") {
        for (const htmlFile of allHtmlFiles) {
          if (htmlFile === primaryPageFileName) {
            continue; // Skip the primary page itself
          }
          // If CONTENT DEMONSTRATIONS is linking to example-subpage.html, ensure example-subpage.html isn't also listed as secondary
          if (sectionDisplayTitle === "CONTENT DEMONSTRATIONS" && htmlFile === 'example-subpage.html') {
            continue;
          }
          const secondaryFilePath = path.join(sectionPath, htmlFile);
          const secondaryTitle = extractTitle(secondaryFilePath, false); 
          const secondaryLinkPath = path.relative(baseOutputDirectory, secondaryFilePath).replace(/\\/g, '/');
          secondaryPages.push({ title: secondaryTitle, link: secondaryLinkPath });
        }
        secondaryPages.sort((a,b) => a.title.localeCompare(b.title)); 
      }

      // Construct HTML for the section
      if (primaryLinkPath) {
        htmlToc += `  <li><a href="${primaryLinkPath}">${sectionDisplayTitle}</a>`;
      } else if (secondaryPages.length > 0) {
        // If no primary link but secondary pages exist, list section title as non-clickable
        // Use the section name (original casing, or uppercased based on directory name)
        // For consistency with sorting logic, section.displayTitle (which is an uppercased title or section name) is used.
        htmlToc += `  <li><span>${section.displayTitle}</span>`; 
      } else {
        // No primary page and no secondary pages (should have been caught by 'continue' earlier)
        continue;
      }

      if (secondaryPages.length > 0) {
        htmlToc += '\n    <ul>\n';
        for (const page of secondaryPages) {
          htmlToc += `      <li><a href="${page.link}">${page.title}</a></li>\n`; // page.title is already lowercased
        }
        htmlToc += '    </ul>\n  </li>\n';
      } else {
        htmlToc += '</li>\n';
      }
    }
    htmlToc += '</ul>\n';

    fs.writeFileSync(outputFilePath, htmlToc, 'utf8');
    console.log(`HTML ToC generated successfully at ${outputFilePath}`);

  } catch (err) {
    console.error('Error generating HTML ToC:', err);
    htmlToc = '<ul>\n  <li>Error generating HTML ToC. Please check console.</li>\n</ul>\n';
    try {
      fs.writeFileSync(outputFilePath, htmlToc, 'utf8');
      console.warn(`Empty HTML ToC written to ${outputFilePath} due to error.`);
    } catch (writeErr) {
      console.error(`Failed to write empty HTML ToC to ${outputFilePath}:`, writeErr);
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectRoot = path.resolve(__dirname); // Assumes script is in project root

  // Default paths
  // const defaultExpressDir = path.join(projectRoot, 'TEMPLATE', 'EXPRESS'); // Old path
  const defaultExpressDir = path.join(projectRoot, 'EXPRESS'); // New path for EXPRESS directly under project root
  // const defaultHtmlOutputFile = path.join(projectRoot, 'TEMPLATE', 'toc.html'); // Old path
  const defaultHtmlOutputFile = path.join(projectRoot, 'toc.html'); // New path for toc.html in project root
  // const defaultHtmlBaseDir = path.join(projectRoot, 'TEMPLATE'); // Old path
  const defaultHtmlBaseDir = projectRoot; // New path, links relative to project root

  const args = process.argv.slice(2);

  const argMap = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      if (i + 1 < args.length && !args[i+1].startsWith('--')) {
        argMap[key] = args[i+1];
        i++; // Consume value
      } else {
        argMap[key] = true; // Flag without value
      }
    }
  }

  const expressDir = argMap.expressDir ? path.resolve(argMap.expressDir) : defaultExpressDir;
  const htmlOutputFile = argMap.htmlOutputFile ? path.resolve(argMap.htmlOutputFile) : defaultHtmlOutputFile;
  const htmlBaseDir = argMap.htmlBaseDir ? path.resolve(argMap.htmlBaseDir) : defaultHtmlBaseDir;

  if (!fs.existsSync(expressDir)) {
    console.error(`EXPRESS directory not found: ${expressDir}`);
    console.log('Please ensure the EXPRESS directory exists or specify the correct path via --expressDir.');
    process.exit(1);
  }

  // Directly generate HTML ToC
  const outputDirHtml = path.dirname(htmlOutputFile);
  if (!fs.existsSync(outputDirHtml)) {
    fs.mkdirSync(outputDirHtml, { recursive: true });
  }
  console.log('\nGenerating HTML ToC...');
  console.log(`  Express Dir: ${expressDir}`);
  console.log(`  Output File: ${htmlOutputFile}`);
  console.log(`  Base Dir for links: ${htmlBaseDir}`);
  generateHtmlToc(expressDir, htmlOutputFile, htmlBaseDir);
}

export { generateHtmlToc, extractTitle };
