const fs = require('fs');
const path = require('path');

/**
 * Extracts the title from an HTML file.
 * @param {string} filePath - Absolute path to the HTML file.
 * @returns {string|null} The content of the <title> tag, or the section directory name as a fallback.
 */
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/i); // Corrected regex
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
    // Fallback to the parent directory name of page.html (i.e., the section name)
    return path.basename(path.dirname(filePath));
  } catch (err) {
    console.error(`Error reading or parsing title from ${filePath}:`, err);
    return path.basename(path.dirname(filePath)); // Fallback to section directory name on error
  }
}

/**
 * Generates an HTML Table of Contents from the EXPRESS directory structure.
 * @param {string} expressDir - Absolute path to the EXPRESS directory.
 * @param {string} outputFilePath - Absolute path for the output HTML ToC file.
 * @param {string} baseOutputDirectory - Absolute path to the base directory from which links in ToC should be relative (e.g., TEMPLATE/).
 */
function generateHtmlToc(expressDir, outputFilePath, baseOutputDirectory) {
  let htmlToc = '<ul>\n';
  try {
    const sections = fs.readdirSync(expressDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    sections.sort(); // Sort sections alphabetically

    for (const section of sections) {
      const sectionPath = path.join(expressDir, section);
      let primaryPagePath = null;
      let primaryPageFileName = '';

      // Check for page.html first, then index.html as primary
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

      // Scan for all HTML files in the section
      const allHtmlFiles = fs.readdirSync(sectionPath)
        .filter(file => file.endsWith('.html'));

      if (!primaryPagePath && allHtmlFiles.length === 0) {
        // Skip section if no primary page and no other HTML files
        continue;
      }
      
      let sectionTitle = section; // Default to section name
      let primaryLinkPath = null;

      if (primaryPagePath) {
        sectionTitle = extractTitle(primaryPagePath);
        primaryLinkPath = path.relative(baseOutputDirectory, primaryPagePath).replace(/\\/g, '/');
      }

      // Identify secondary pages
      const secondaryPages = [];
      for (const htmlFile of allHtmlFiles) {
        if (htmlFile === primaryPageFileName) {
          continue; // Skip the primary page itself
        }
        const secondaryFilePath = path.join(sectionPath, htmlFile);
        const secondaryTitle = extractTitle(secondaryFilePath);
        const secondaryLinkPath = path.relative(baseOutputDirectory, secondaryFilePath).replace(/\\/g, '/');
        secondaryPages.push({ title: secondaryTitle, link: secondaryLinkPath });
      }
      secondaryPages.sort((a,b) => a.title.localeCompare(b.title)); // Sort secondary pages by title


      // Construct HTML for the section
      if (primaryLinkPath) {
        htmlToc += `  <li><a href="${primaryLinkPath}">${sectionTitle}</a>`;
      } else if (secondaryPages.length > 0) {
        // If no primary link but secondary pages exist, list section title as non-clickable
        htmlToc += `  <li><span>${sectionTitle}</span>`; // Use span for non-clickable title
      } else {
        // No primary page and no secondary pages (should have been caught by 'continue' earlier, but as a safeguard)
        continue;
      }

      if (secondaryPages.length > 0) {
        htmlToc += '\n    <ul>\n';
        for (const page of secondaryPages) {
          htmlToc += `      <li><a href="${page.link}">${page.title}</a></li>\n`;
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

if (require.main === module) {
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

module.exports = { generateHtmlToc, extractTitle };
