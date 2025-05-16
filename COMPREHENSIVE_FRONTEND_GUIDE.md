# COMPREHENSIVE FRONT-END PAGE DEVELOPMENT GUIDE

*Last Updated: May 16, 2025*

This guide provides comprehensive instructions for configuring and deploying front-end pages on GitHub Pages or Netlify with a standardized structure, client-side authentication, and interactive features.

## Table of Contents

1. [Introduction](#introduction)
   - [Purpose of This Guide](#purpose-of-this-guide)
   - [Target Audience](#target-audience)
   - [Overview of the Standardized Repository Structure](#overview-of-the-standardized-repository-structure)
   - [Core Technologies & Principles](#core-technologies--principles)

2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Development Environment Setup](#development-environment-setup)
   - [Using the Base Template Repository](#using-the-base-template-repository)
   - [Project-Specific Configuration: The Project Brief](#project-specific-configuration-the-project-brief)

3. [Repository Structure](#repository-structure)
   - [Standard Directory Layout](#standard-directory-layout)
   - [Key Configuration Files](#key-configuration-files)
   - [Understanding the Core Components](#understanding-the-core-components)

4. [Core Features Implementation](#core-features-implementation)
   - [Standardized Table of Contents (ToC)](#standardized-table-of-contents-toc)
   - [Basic Client-Side Login](#basic-client-side-login)
   - [Persistent User State (Storage System)](#persistent-user-state-storage-system)

5. [Content Development Workflow](#content-development-workflow)
   - [Adding New Content](#adding-new-content)
   - [Automation Scripts](#automation-scripts)
   - [Working with Interactive Elements](#working-with-interactive-elements)
   - [Testing Implementation](#testing-implementation)

6. [Data Pipeline: Airtable to Front-End](#data-pipeline-airtable-to-front-end)
   - [Overview of the Data Preparation Script](#overview-of-the-data-preparation-script)
   - [Configuration & Authentication](#configuration--authentication)
   - [Data Output Format](#data-output-format)
   - [Front-End Integration](#front-end-integration)

7. [Front-End Development Techniques](#front-end-development-techniques)
   - [Standalone HTML & CSS Pages](#standalone-html--css-pages)
   - [JavaScript Enhancement](#javascript-enhancement)
   - [React Applications with Vite](#react-applications-with-vite)
   - [Data Visualizations with D3.js](#data-visualizations-with-d3js)
   - [3D Visualizations](#3d-visualizations)

8. [Data Visualization Best Practices](#data-visualization-best-practices)
   - [Key Principles](#key-principles)
   - [Choosing the Right Visualization](#choosing-the-right-visualization)
   - [Accessibility Considerations](#accessibility-considerations)

9. [Build and Deployment](#build-and-deployment)
   - [Local Development](#local-development)
   - [Build Process](#build-process)
   - [Deployment to GitHub Pages](#deployment-to-github-pages)
   - [Deployment to Netlify](#deployment-to-netlify)
   - [Pre-Deployment Checklist](#pre-deployment-checklist)

10. [Troubleshooting Guide](#troubleshooting-guide)
    - [Storage System Issues](#storage-system-issues)
    - [GitHub Pages Deployment Issues](#github-pages-deployment-issues)
    - [Netlify Deployment Issues](#netlify-deployment-issues)
    - [Embedded Visualizations Issues](#embedded-visualizations-issues)
    - [Common Build Issues](#common-build-issues)
    - [Runtime Errors](#runtime-errors)
    - [Debugging Techniques](#debugging-techniques)

11. [Instructions for AI LLM](#instructions-for-ai-llm)
    - [General Principles](#general-principles)
    - [Autonomous Repository Setup Protocol](#autonomous-repository-setup-protocol)

12. [References](#references)
    - [Data Visualization Guide](#data-visualization-guide)
    - [General AI Interaction Guidelines](#general-ai-interaction-guidelines)
    - [Essential File Paths](#essential-file-paths)
    - [External Resources](#external-resources)

## Introduction

### Purpose of This Guide

This guide serves as a comprehensive resource for developers and AI assistants to create consistent, interactive front-end pages that can be deployed on GitHub Pages or Netlify. It standardizes repository structure, content organization, and authentication while supporting a wide range of visualization technologies and interactive features.

### Target Audience

- **Front-End Developers**: Engineers responsible for creating and maintaining web pages
- **Content Creators**: Team members who contribute content to the pages
- **DevOps Engineers**: Personnel responsible for deployment and maintenance
- **AI LLMs**: AI systems that will use this guide to autonomously set up and manage repositories

### Overview of the Standardized Repository Structure

The repository follows a consistent structure that separates content from code, enables automated tools, and provides clear organization:

```
repository-root/
├── EXPRESS/              # Main content folder (uppercase)
│   ├── section-1/        # Content sections
│   │   ├── page1.html
│   │   └── page2.html
│   └── section-2/
│       └── ...
├── scripts/              # Automation scripts
├── src/                  # Shared code
│   ├── auto-storage.js
│   ├── storage-manager.js
│   └── ...
├── data/                 # Output from Data Preparation Script
├── assets/               # Images, fonts, etc.
├── components/           # Shared React components
└── dist/                 # Build output (generated)
```

### Core Technologies & Principles

- **HTML, CSS, JavaScript**: Core web technologies
- **React (with Vite)**: For complex interactive components
- **D3.js**: For data visualizations
- **GitHub Pages/Netlify**: Deployment platforms
- **Airtable**: Data source, processed via Python
- **Node.js**: For automation scripts
- **Automated content generation**: Script-generated table of contents
- **Persistent storage**: User preferences saved with localStorage

## Getting Started

### Prerequisites

Before beginning, ensure you have:

1. **Git**: For version control
2. **Node.js**: v18+ for running automation scripts
3. **Python 3.9+**: For the Airtable data preparation script
4. **GitHub Account**: For repository hosting and GitHub Pages deployment
5. **Netlify Account** (optional): For alternative deployment
6. **Airtable Account**: With API key for data integration

### Development Environment Setup

1. **Install VS Code** (recommended) with extensions:
   - ESLint
   - Prettier
   - Live Server

2. **Configure Node.js environment**:
   ```bash
   # Verify installation
   node --version
   npm --version
   
   # Install global dependencies
   npm install -g live-server
   ```

3. **Set up Python environment**:
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   
   # Install dependencies
   pip install -r scripts/requirements.txt
   ```

### Using the Base Template Repository

1. **Create a new repository from the template**:
   ```bash
   # Clone the base template
   git clone https://github.com/your-org/frontend-base-template.git your-project-name
   cd your-project-name
   
   # Remove the original remote and set up your own
   git remote remove origin
   git remote add origin https://github.com/your-username/your-project-name.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the project**:
   ```bash
   # Copy and configure environment variables
   cp .env.example .env
   
   # Edit .env with your specific values
   # - SHARED_PASSWORD: The client-side login password
   # - AIRTABLE_API_KEY: Your Airtable API key
   ```

### Project-Specific Configuration: The Project Brief

For each new project created from this template system, it is crucial to establish a clear scope, define specific configurations, and track project-specific details. To facilitate this, a `PROJECT_BRIEF.md` file should be created and maintained at the root of each new project.

**Purpose:**

*   Serves as the single source of truth for the project's objectives, target audience, and key features.
*   Documents project-specific configurations for data sources (like Airtable), deployment (GitHub Pages URLs, Netlify settings), and any deviations from the standard template.
*   Helps ensure consistency and provides context for developers (including AI assistants) working on the project.

**Setup:**

1.  When starting a new project, copy the `PROJECT_BRIEF_TEMPLATE.md` (located in the root of the template system or your main `PAGES` directory) into the root of your new project.
2.  Rename the copied file to `PROJECT_BRIEF.md`.
3.  Thoroughly fill out all sections of the `PROJECT_BRIEF.md` with details relevant to the new project. This document should be treated as a living document and updated as the project evolves.

**Key Information to Include (refer to `PROJECT_BRIEF_TEMPLATE.md` for full structure):**

*   Project Title, Overview, Goals, and Target Audience.
*   Content Structure and Key Features.
*   Data Source configurations (e.g., specific Airtable Base/Table IDs, environment variable names).
*   Design and Branding notes.
*   Deployment target URLs and configuration values (e.g., `homepage` for `package.json`, Vite `base` URL).
*   Any custom configurations or deviations from the standard template.

Regularly referring to and updating the `PROJECT_BRIEF.md` will streamline development and ensure all stakeholders are aligned.

## Repository Structure

### Standard Directory Layout

- **/EXPRESS/**: Main content folder. Each subfolder becomes a section in the ToC.
  - Naming convention: Use kebab-case (e.g., `data-visualizations/`)
  - HTML files in these folders become individual pages
  - Folder structure dictates the automatically generated ToC

- **/scripts/**: Automation scripts (Node.js, Shell)
  - `generate-toc.js`: Creates table of contents from `/EXPRESS/` structure
  - `add-content.js`: Scaffolds new content pages with templates
  - `setup-storage.js`: Adds storage system to HTML files
  - `run-qc.js`: Quality control checks
  - `build.sh`: Build script for production

- **/src/**: Shared JavaScript modules and CSS
  - `auto-storage.js`: Automatic persistence system
  - `storage-manager.js`: Core storage engine
  - `simple-storage.js`: Legacy compatibility layer
  - CSS files for global styling

- **/assets/**: Static resources
  - Images, fonts, documents

- **/data/**: Output from Data Preparation Script
  - JSON files with prepared data from Airtable

- **/components/**: (If using React) Shared components
  - Visualization components
  - UI elements
  - Utilities

- **/dist/**: Build output directory (generated, not versioned)

- **test.html**: Page for testing storage system functionality

### Key Configuration Files

- **package.json**: Project metadata, dependencies, and script commands
  - Contains build, dev, and deploy scripts
  - Lists all dependencies

- **vite.config.js** or **vite.config.ts**: Vite configuration for React apps
  - Handles base URL for GitHub Pages deployment

- **netlify.toml**: Netlify deployment configuration
  - Build commands
  - Environment variable placeholders
  - Redirect rules

- **.github/workflows/deploy-gh-pages.yml**: GitHub Actions workflow
  - Automated deployment to GitHub Pages

- **.env.example**: Template for environment variables
  - `SHARED_PASSWORD`: For client-side authentication
  - `AIRTABLE_API_KEY`: For data preparation script

### Understanding the Core Components

The core components that make this system work are:

1. **Storage System**: Automatic persistence of user inputs
2. **ToC Generator**: Script that reads the `/EXPRESS/` structure
3. **Data Pipeline**: Python script that pulls from Airtable
4. **Basic Authentication**: Simple password protection
5. **Build System**: Scripts that prepare for deployment

## Core Features Implementation

### Standardized Table of Contents (ToC)

The Table of Contents is automatically generated from the `/EXPRESS/` directory structure using a Node.js script.

#### How the ToC Generator Works

1. The script (`scripts/generate-toc.js`) scans the `/EXPRESS/` directory
2. It identifies folders (sections) and files (pages)
3. It creates a hierarchical structure based on the directory layout
4. The ToC is then injected into an HTML template or exported as JSON

#### Running the ToC Generator

```bash
# Generate the table of contents
node scripts/generate-toc.js
```

The script is automatically run:
- When adding new content through `add-content.js`
- During the build process
- When running the `update-content.sh` script

### Basic Client-Side Login

A simple login protection mechanism is implemented for all pages.

#### Implementation

1. Add the following JavaScript code to your main layout or individual pages:

```javascript
// Client-side login protection (minimal security)
(function() {
  // Skip if already authenticated in this session
  if (sessionStorage.getItem('authenticated') === 'true') {
    return;
  }
  
  const password = 'YOUR_SHARED_PASSWORD'; // Replace with env variable in production
  let userInput = prompt('Please enter the password to access this page:');
  
  if (userInput !== password) {
    alert('Incorrect password. Access denied.');
    // Either redirect or hide content
    document.body.innerHTML = '<h1>Access Denied</h1>';
    return;
  }
  
  // Store authentication status for this session
  sessionStorage.setItem('authenticated', 'true');
})();
```

2. For production, replace the hardcoded password with an environment variable:

```javascript
const password = process.env.SHARED_PASSWORD || 'default-password';
```

> **Note**: This is a simple protection mechanism and not suitable for sensitive information. It's designed as a light layer of security and a placeholder for future real authentication.

### Persistent User State (Storage System)

The persistent storage system automatically saves user preferences and form inputs between sessions.

#### Storage System Components

1. **auto-storage.js**: Primary system that automatically detects and manages form elements
2. **storage-manager.js**: Core storage engine for saving/loading data
3. **simple-storage.js**: Legacy compatibility layer

#### Key Features

1. **Automatic element identification** - Works with elements that have:
   - `id` attribute
   - `name` attribute
   - `data-id` attribute
   - Or elements without any identifier using path-based identification

2. **Storage for all interactive elements:**
   - Checkboxes
   - Text inputs
   - Select dropdowns
   - Radio buttons
   - Collapsible sections

3. **Mutation Observer** - Automatically detects and binds to new elements added dynamically

#### Adding Storage to Content Pages

The easiest way is to use the setup script:

```bash
node scripts/setup-storage.js
```

Or manually import the auto-storage system in your HTML:

```html
<script type="module">
  // Import auto-storage system
  import autoStorage from '../src/auto-storage.js';
</script>
```

#### Using the Storage API Directly

```javascript
// Using auto-storage (recommended)
import autoStorage from '../src/auto-storage.js';

// Using dashboard storage directly
import dashboardStorage from '../src/storage-manager.js';
dashboardStorage.saveDashboard('page-id', yourData);
const savedData = dashboardStorage.loadDashboard('page-id', defaultValue);

// Legacy SimpleStorage API (still supported)
SimpleStorage.save('your-key', yourData);
const savedData = SimpleStorage.load('your-key', defaultValue);
SimpleStorage.delete('your-key');
```

### 6.4. Storage System

The project includes a persistent storage system to maintain user state across sessions. This is particularly useful for remembering form inputs, UI preferences (like expanded sections), or other client-side data.

**Core Components:**

*   **`TEMPLATE/src/storage-manager.js`**: This is the low-level engine for interacting with `localStorage`. It provides namespacing to avoid collisions with other browser storage, and includes methods for saving, loading, removing, and clearing data. All keys are prefixed with `pageAppStorage_`.
    *   `StorageManager.save(key, value)`: Saves a JSON-stringified value to localStorage under `pageAppStorage_key`.
    *   `StorageManager.load(key, defaultValue = null)`: Loads and parses a value from localStorage. Returns `defaultValue` if the key is not found or if there's a parsing error.
    *   `StorageManager.remove(key)`: Removes a specific key.
    *   `StorageManager.clearAll()`: Removes all keys managed by this StorageManager (i.e., those with the `pageAppStorage_` prefix).
    *   `StorageManager.getPrefix()`: Returns the current storage prefix.

*   **`TEMPLATE/src/auto-storage.js`**: This module leverages `StorageManager` to automatically save and restore the state of specific HTML elements. It's designed to be imported into pages where automatic state persistence is desired.
    *   **Initialization**: `AutoStorage.init()` is called when the script loads. It loads all previously saved states, attaches event listeners, and sets up a `MutationObserver`.
    *   **Supported Elements**: 
        *   `input` (text, checkbox, radio, etc.)
        *   `select`
        *   `textarea`
        *   `button.collapsible` (buttons with the class `collapsible`)
    *   **Key Generation**: `getElementKey(element)` generates a unique storage key for an element. It prioritizes `data-id`, then `id`, then `name`. If none of these are present, it falls back to a DOM path-based key (which is less resilient to structural changes).
    *   **State Saving**: `saveState(element)` saves the relevant value of the element (e.g., `value`, `checked`, or an 'active' class for collapsibles).
        *   For `input`, `select`, `textarea`, state is saved on `change` and `input` events.
        *   For `button.collapsible`, state (expanded/collapsed, indicated by an `active` class) is saved on `click`.
    *   **State Loading**: `loadState(element)` restores the saved state of an element when the page loads or when new elements are dynamically added to the DOM.
    *   **Dynamic Content**: A `MutationObserver` watches for changes in the DOM. When new elements matching the supported types are added, `auto-storage.js` automatically loads their saved state.
    *   **Usage**: To enable auto-storage on a page, include it as a module: `<script type="module" src="../src/auto-storage.js"></script>`. The path might need adjustment based on the HTML file's location relative to the `src` directory.

*   **`TEMPLATE/src/simple-storage.js`**: This module provides a straightforward key-value storage interface, acting as a wrapper around `StorageManager`. It's intended for manual, explicit state management where `auto-storage.js` is not suitable. It uses the same `pageAppStorage_` prefix as `StorageManager`.
    *   `SimpleStorage.save(key, value)`: Saves a value. Internally calls `StorageManager.save`.
    *   `SimpleStorage.load(key, defaultValue = null)`: Loads a value. Internally calls `StorageManager.load`.
    *   `SimpleStorage.delete(key)`: Deletes a key-value pair. Internally calls `StorageManager.remove`.
    *   **Usage**: Import and use directly: `import SimpleStorage from '../src/simple-storage.js'; SimpleStorage.save('myKey', { data: 'example' });`

**Opt-in Mechanism (using `setup-storage.js`):**

The `auto-storage.js` functionality is designed to be opt-in per page. The `setup-storage.js` script (located in the project root) facilitates this:

1.  **Marker**: Add a comment `<!-- AUTO-STORAGE-INIT -->` in your HTML files within `TEMPLATE/EXPRESS/` where you want to enable automatic state persistence.
2.  **Execution**: Run `node setup-storage.js` from the project root.
3.  **Action**: The script will scan the HTML files for the marker. If found, it will inject (or ensure the presence of) the script tag: `<script type="module" src="../src/auto-storage.js"></script>` (path adjusted based on file depth) near the marker.

This approach keeps pages clean by default and allows developers to explicitly enable the feature where needed.

#### `setup-storage.js` Script Details

This Node.js script, located in the project root (`/Users/mitchens/Local/PAGES/setup-storage.js`), automates the inclusion of the `auto-storage.js` module in your HTML content pages.

**Functionality:**

1.  **Scans HTML Files:** Recursively searches for all `.html` files within the `TEMPLATE/EXPRESS/` directory.
2.  **Checks for Marker:** For each HTML file, it looks for the comment `<!-- AUTO-STORAGE-INIT -->`.
3.  **Path Calculation:** If the marker is found, it calculates the correct relative path from the HTML file to `TEMPLATE/src/auto-storage.js`. For example, a file at `TEMPLATE/EXPRESS/section1/page.html` would get `../src/auto-storage.js`, while `TEMPLATE/EXPRESS/section1/subsection/page.html` would get `../../src/auto-storage.js`.
4.  **Script Injection:**
    *   It checks if the correctly pathed script tag (`<script type="module" src="[calculated-path]"></script>`) is already present. If so, it skips the file.
    *   It removes any older, potentially incorrect, script tags that import `auto-storage.js` (e.g., `<script type="module" src="../src/auto-storage.js"></script>` if the path was generic or hardcoded previously).
    *   It then inserts the new, correctly pathed script tag immediately after the `<!-- AUTO-STORAGE-INIT -->` marker.
5.  **Feedback:** Logs which files were updated, skipped (if already correct or marker not found), or if an error occurred.

**Usage:**

Run the script from the project root directory:

```bash
node setup-storage.js
```

This ensures that `auto-storage.js` is correctly linked and functional on all pages where it's explicitly enabled via the marker, regardless of their depth within the `TEMPLATE/EXPRESS/` directory structure.

## Build and Quality Control

This section details the scripts responsible for building the project and ensuring content quality.

### Quality Control Script (`run-qc.js`)

The `run-qc.js` script, located in the project root (`/Users/mitchens/Local/PAGES/run-qc.js`), performs several checks to ensure the quality and integrity of the HTML content within the `TEMPLATE/EXPRESS/` directory.

**Functionality:**

1.  **Basic HTML Validation:**
    *   Checks for the presence of `<html>`, `<head>`, and `<body>` tags.
    *   Ensures each page has a unique `<title>` element.
2.  **Broken Internal Link Checker:**
    *   Scans all `<a>` tags with `href` attributes.
    *   Verifies that internal links (those not starting with `http://`, `https://`, or `mailto:`) point to existing files within the `TEMPLATE/EXPRESS/` directory.
    *   Checks fragment identifiers (`#elementId`) to ensure the target ID exists on the linked page.
3.  **Interactive Element ID Check:**
    *   Ensures that interactive elements like `<input>`, `<select>`, `<textarea>`, and `<button class="collapsible">` have an `id`, `name`, or `data-id` attribute. This is crucial for the `auto-storage.js` system and general accessibility/testability.
4.  **`auto-storage.js` Import Verification:**
    *   If the `<!-- AUTO-STORAGE-INIT -->` marker is present in an HTML file:
        *   It verifies that the `auto-storage.js` script is imported using the correct relative path.
        *   It warns if the script tag is missing or uses an incorrect path.
    *   If the `auto-storage.js` script is imported but the `<!-- AUTO-STORAGE-INIT -->` marker is *missing*, it issues a warning, as this might indicate an unintentional import or a forgotten marker.
5.  **Error Reporting:**
    *   Logs all issues found to the console.
    *   Exits with a status code of `1` if any issues are detected, and `0` otherwise. This allows it to be used in automated build pipelines.

**Usage:**

Run the script from the project root directory:

```bash
node run-qc.js
```

It's recommended to run this script before committing changes or deploying the project.

### Build Script (`build.sh`)

The `build.sh` script, located in the project root (`/Users/mitchens/Local/PAGES/build.sh`), orchestrates the necessary steps to prepare the project for deployment or local testing.

**Functionality:**

1.  **Dependency Check & Installation (TEMPLATE):**
    *   Checks if `npm install` is needed for the `TEMPLATE` directory. This is determined by:
        *   The absence of the `TEMPLATE/node_modules` directory.
        *   `TEMPLATE/package.json` being newer than `TEMPLATE/node_modules`.
    *   If needed, it runs `npm install` within the `TEMPLATE` directory.
2.  **Table of Contents Generation:**
    *   Runs `node generate-toc.js --htmlOutputFile TEMPLATE/toc.html --htmlBaseDir TEMPLATE/EXPRESS` to generate/update the HTML table of contents.
3.  **Quality Control Checks:**
    *   Runs `node run-qc.js` to perform all quality checks on the content.
4.  **Vite/React App Build (Placeholder):**
    *   Includes a placeholder comment indicating where build commands for a Vite/React application (e.g., `npm run build` within a specific app directory like `TEMPLATE/my-react-app/`) would go. This needs to be customized if such an app is part of the project.
5.  **Error Handling:**
    *   The script is configured to exit immediately if any command fails (`set -e`), ensuring that the build process stops if a step encounters an error.
    *   Prints success or failure messages for each major step.

**Usage:**

Run the script from the project root directory:

```bash
bash build.sh
```

This script is essential for ensuring that all necessary pre-processing, generation, and validation steps are executed consistently.

## Content Development Workflow

### Adding New Content

#### Creating New HTML Pages Manually

1. Create a new folder in `/EXPRESS/` if needed for a new section
2. Create an HTML file (or React entry point) inside the section folder
3. Use this HTML template for standard pages:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>
  <link rel="stylesheet" href="../../assets/styles/main.css">
</head>
<body>
  <!-- Your content here -->

  <!-- Include storage system for persistence -->
  <script type="module">
    // Import auto-storage system
    import autoStorage from '../../src/auto-storage.js';
  </script>
  
  <!-- Page-specific code -->
  <script src="./page-name.js" type="module"></script>
</body>
</html>
```

4. Create a JavaScript file with the same name for page-specific functionality
5. Run the ToC generator to update the navigation

#### Using the Content Addition Script

For faster content creation, use the automated script:

```bash
node scripts/add-content.js
```

This script will:
1. Prompt for a section name (create if it doesn't exist)
2. Prompt for a page name
3. Create necessary files with templates
4. Add storage system automatically
5. Update the Table of Contents

### Automation Scripts

#### Content Addition Script (`add-content.js`)

Creates boilerplate HTML, JS, and CSS files for new content:

```bash
node scripts/add-content.js
```

**Functionality:**

1.  **Input:** Takes a relative path (from the project root) to a newly added file or a new section directory within `TEMPLATE/EXPRESS/`.
    *   Example file path: `TEMPLATE/EXPRESS/my-section/new-image.jpg`
    *   Example new section directory path: `TEMPLATE/EXPRESS/brand-new-section`
2.  **Section Directory Handling:**
    *   Identifies the section directory based on the provided path.
    *   If the section directory doesn't exist (e.g., when providing a path like `TEMPLATE/EXPRESS/new-section/some-file.txt` and `new-section` is new, or just `TEMPLATE/EXPRESS/new-section`), it creates the directory.
3.  **`page.html` Management:**
    *   Checks for `TEMPLATE/EXPRESS/<section-name>/page.html`.
    *   **If `page.html` does not exist:** Creates a default `page.html` with a basic structure. This HTML file will include:
        *   A title derived from the section name.
        *   A link back to the main `TEMPLATE/index.html`.
        *   A link to `TEMPLATE/assets/styles/main.css` (path adjusted based on depth).
        *   A placeholder heading and paragraph.
        *   A list of all files currently in that section directory, with each file name being a link to that file (e.g., `<li><a href="./new-image.jpg">new-image.jpg</a></li>`).
    *   **If `page.html` already exists:** It updates the list of files within that `page.html` to reflect the current contents of the section directory. Each file name in the list will be a link to that file.
4.  **Table of Contents Update:** After processing the content and `page.html`, it automatically runs `node generate-toc.js --all` to regenerate both the HTML and Markdown ToCs.

**Usage:**

Run the script from the project root (`/Users/mitchens/Local/PAGES/`) using Node.js:

```bash
node add-content.js [relativePathToFileOrDirectory]
```

*   If `[relativePathToFileOrDirectory]` is provided, the script uses it directly.
*   If no path is provided, the script will prompt you to enter it.

**Examples:**

*   Adding a new file to an existing or new section:
    ```bash
    node add-content.js TEMPLATE/EXPRESS/data-reports/report-q1.pdf
    ```
    (If `TEMPLATE/EXPRESS/data-reports/page.html` doesn't exist, it will be created. If it does, its file list will be updated.)

*   Creating a new section (and its default `page.html`):
    ```bash
    node add-content.js TEMPLATE/EXPRESS/new-interactive-demo
    ```

*   Running interactively:
    ```bash
    node add-content.js
    ```
    Then enter the path when prompted.

**Important Notes:**

*   The script expects content to be placed within a subdirectory of `TEMPLATE/EXPRESS/`. You cannot add files directly into `TEMPLATE/EXPRESS/` itself using this script; they must belong to a conceptual section.
*   The default `page.html` is minimal. You will likely want to edit it to provide more specific content or a better presentation for the files in that section.

#### ToC Update Script (`generate-toc.js`)

Generates the HTML table of contents for the application from the `TEMPLATE/EXPRESS/` directory structure. This HTML ToC is intended to be embedded in your application's main page (e.g., `TEMPLATE/index.html`) to provide navigation to the content pages.

**Command:**
```bash
node generate-toc.js [--expressDir <path>] [--htmlOutputFile <path>] [--htmlBaseDir <path>]
```
- `--expressDir`: Path to the `TEMPLATE/EXPRESS/` content directory. (Defaults to `./TEMPLATE/EXPRESS/`)
- `--htmlOutputFile`: Path for the generated HTML ToC file. (Defaults to `./TEMPLATE/toc.html`)
- `--htmlBaseDir`: Base directory for relative links in the HTML ToC. (Defaults to `./TEMPLATE/`)

The script is automatically run by `add-content.js` and should be part of your build process.

**Functionality:**
1.  Scans the specified `expressDir` (default: `TEMPLATE/EXPRESS/`).
2.  Identifies section directories and their `page.html` files.
3.  Extracts titles from each `page.html`.
4.  Generates an HTML `<ul>` list linking to each `page.html`, with links relative to `htmlBaseDir`.
5.  Saves the generated HTML to `htmlOutputFile` (default: `TEMPLATE/toc.html`).

This HTML ToC can then be loaded or embedded into your main application page (e.g., `TEMPLATE/index.html`) to provide navigation.

#### Storage Setup Script (`setup-storage.js`)

Adds storage import to HTML files that don't already have it:

```bash
node scripts/setup-storage.js
```

#### Quality Control Script (`run-qc.js`)

Checks content for issues:

```bash
npm run qc
# or
node scripts/run-qc.js
```

This script:
- Validates HTML files
- Checks for broken internal links
- Ensures all interactive elements have IDs
- Verifies storage system is properly included
- Reports any issues found

### Working with Interactive Elements

For the best compatibility with the automatic storage system:

#### Form Elements

Always provide `id`, `name`, or `data-id` attributes for form elements:

```html
<input type="checkbox" id="task1" name="task1">
<select id="country-select" name="country">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>
```

#### JavaScript-based Collapsible Sections

For collapsible sections that work reliably across all deployment environments:

1. **HTML Structure**:

```html
<button class="collapsible">Section Title</button>
<div class="content">
  <p>This is the content that will be hidden or shown.</p>
  <p>More content...</p>
</div>
```

2. **CSS Styling**:

```css
.collapsible { 
    background-color: var(--neutral, #f2f2f2); /* Fallback color */
    color: var(--dark, #333);
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    margin-bottom: 10px;
    position: relative;
}

.collapsible:after { 
    content: '\\002B'; /* Plus sign */
    color: var(--primary, #3a6ea5);
    font-weight: bold;
    float: right;
    transition: transform 0.2s ease-out;
}

.active:after { 
    content: "\\2212"; /* Minus sign */
}

.content { 
    padding: 0 18px; /* Initially no padding when collapsed */
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    background-color: var(--light, #ffffff);
    border-radius: 0 0 5px 5px;
    margin-top: -10px; 
    margin-bottom: 10px;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

/* Add padding back when content is shown */
.active + .content { 
    padding: 10px 18px 18px 18px; 
}
```

3. **JavaScript Logic**:

```javascript
// Ensure this runs after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            
            // Find the next sibling element that is a div with class 'content'
            var content = this.nextElementSibling;
            while(content && (content.nodeName !== "DIV" || !content.classList.contains('content'))) {
                content = content.nextElementSibling;
            }
            
            if (content) { // Check if content panel was found
                if (content.style.maxHeight) {
                    // If already open, close it
                    content.style.maxHeight = null;
                } else {
                    // If closed, open it to its full scroll height
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            } else {
                console.error("Could not find content panel for collapsible button:", this);
            }
        });
    }
});
```

#### Custom Interactive Elements

For custom components that aren't standard form elements:

```html
<div class="custom-component" data-id="unique-identifier">
  <!-- Component content -->
</div>
```

### Testing Implementation

To verify that all components are working properly:

1. **Storage System Test**:
   - Open the test page: `test.html`
   - Toggle checkboxes and interact with form elements
   - Reload the page - all selections should persist
   - Click "Run Storage Tests" to run automated tests
   - Click "Inspect Current Storage" to see stored data

2. **Content Rendering Test**:
   - Use the local development server to view pages
   - Verify that collapsible sections work
   - Check that all interactive elements function correctly

3. **Navigation Test**:
   - Confirm that the table of contents reflects the correct structure
   - Test all links to ensure they navigate to the right pages

## Data Pipeline: Airtable to Front-End

This section details how to use the Python script `airtable_workflow_extractor.py` to fetch data from Airtable and prepare it for use in the front-end.

### Overview of the Data Preparation Script (`airtable_workflow_extractor.py`)

The `airtable_workflow_extractor.py` script (located in the project root) connects to a specified Airtable base and table, extracts records, processes them into a nodes/links structure suitable for visualizations (or other uses), and saves the output as a JSON file.

**Key functionalities:**
- Fetches all records from a specified Airtable table (optionally filtered by a view).
- Processes records to identify nodes and relationships (e.g., "Next Steps", "Dependencies" fields linking records).
- Outputs a JSON file (`workflow_data.json` by default) containing nodes and links.

### Configuration & Authentication

1.  **Environment Variables**: The script uses environment variables for Airtable credentials. These should be defined in a `.env` file in the project root (copied from `.env.example`).
    *   `AIRTABLE_API_KEY`: Your Airtable API key.
    *   `AIRTABLE_BASE_ID`: The ID of your Airtable base. (Passed as command-line argument)
    *   `AIRTABLE_TABLE_ID`: The ID or name of your Airtable table. (Passed as command-line argument)

2.  **Python Environment**:
    *   Ensure Python 3.9+ is installed.
    *   Create and activate a virtual environment:
        ```bash
        python -m venv venv
        source venv/bin/activate  # macOS/Linux
        # venv\\Scripts\\activate  # Windows
        ```
    *   Install required dependencies:
        ```bash
        pip install -r requirements.txt
        ```

### Running the Script

Execute the script from the project root:

```bash
python airtable_workflow_extractor.py --base-id "YOUR_BASE_ID" --table-id "YOUR_TABLE_ID" [--view-id "YOUR_VIEW_ID"] [--output "data/desired_output_name.json"]
```

- Replace `"YOUR_BASE_ID"`, `"YOUR_TABLE_ID"`, and optionally `"YOUR_VIEW_ID"` with your actual Airtable identifiers.
- The `--output` argument specifies the path and filename for the JSON output. It's recommended to save this to the `data/` directory (e.g., `data/workflow_data.json`).

**Example:**
```bash
python airtable_workflow_extractor.py --base-id "appXXXXXXXXXXXXXX" --table-id "tblXXXXXXXXXXXXXX" --output "data/workflow_data.json"
```

### Data Output Format

The script outputs a JSON file (e.g., `data/workflow_data.json`) with the following structure:

```json
{
  "nodes": [
    {
      "id": "recXXXXXXXXXXXXXX", // Airtable record ID
      "recordId": "recXXXXXXXXXXXXXX",
      // ... other fields from your Airtable record
      "FieldName1": "Value1",
      "FieldName2": "Value2"
    }
    // ... more nodes
  ],
  "links": [
    {
      "source": "recSourceRecordID", // ID of the source node
      "target": "recTargetRecordID", // ID of the target node
      "type": "relationship_type"   // e.g., "next_step", "dependency"
    }
    // ... more links
  ]
}
```
This structure is a common format for graph visualizations.

### Front-End Integration

To use the data in your front-end:

#### 1. Load the data using fetch:

```javascript
async function loadData() {
  try {
    const response = await fetch('../data/your-data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error('Could not load data:', error);
    return [];
  }
}
```

#### 2. Process and display the data:

```javascript
async function initPage() {
  const projects = await loadData();
  
  // Example: Creating HTML elements from data
  const container = document.getElementById('projects-container');
  
  projects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.className = 'project-card';
    projectElement.innerHTML = `
      <h3>${project.fields.Name}</h3>
      <p class="status">${project.fields.Status}</p>
      <p>${project.fields.Description}</p>
    `;
    container.appendChild(projectElement);
  });
}

document.addEventListener('DOMContentLoaded', initPage);
```

## Front-End Development Techniques

### Standalone HTML & CSS Pages

For simple content pages, standard HTML and CSS is sufficient.

1.  **HTML Structure Best Practices**:
    *   Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<aside>`) to give meaning to your content.
    *   Keep the DOM structure clean, logical, and readable.
    *   Include proper metadata in the `<head>` section:
        *   `<meta charset="UTF-8">`
        *   `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (Essential for responsiveness)
        *   Descriptive `<title>`
        *   Relevant `<meta name="description">`
    *   **Integration Tip**: When designing standalone HTML, consider how it will be embedded. If it's meant to be a full page, ensure it has a complete HTML structure. If it's a fragment, design it to be easily injected into a parent layout. Avoid `<html>`, `<head>`, `<body>` tags if it's a partial to be injected.

2.  **CSS Organization**:
    *   Use CSS variables for consistent theming and easier maintenance:
    ```css
    :root {
      --primary-color: #3a6ea5;
      --secondary-color: #4a90e2;
      --text-color: #333;
      --background-color: #fff;
      --neutral-light: #f2f2f2;
      --spacing-unit: 8px;
    }
    ```
    *   Organize CSS with a methodology like BEM (Block, Element, Modifier) or a similar namespacing strategy to prevent style collisions, especially when integrating multiple standalone pieces.
        *   Example (BEM): `.card__image--large {}`
    *   Adopt a mobile-first approach for responsive design. Design for small screens first, then add complexity for larger screens using media queries.
    *   **Integration Tip**: Prefix class names for standalone HTML sections to avoid conflicts with global styles (e.g., `.my-feature-card {}` instead of just `.card {}`).

3.  **Embedding Standalone HTML**:
    *   **Direct Injection**: For simple, trusted content, you can fetch the HTML and inject it into a container DIV using JavaScript. This is simpler but offers less isolation.
    *   **Iframes**: For more complex or less trusted content, `<iframe>` provides strong isolation for CSS and JavaScript.
        *   **Pros**: Styles and scripts within the iframe won't affect the parent page, and vice-versa. Good for embedding third-party content or complex, self-contained applications.
        *   **Cons**: Can be harder to make responsive, communication between iframe and parent page is more complex (requires `postMessage`), can have SEO implications if not handled carefully, and may create a "double scrollbar" user experience if not sized correctly.
        *   **Usage**: `<iframe src="path/to/your/standalone.html" width="100%" height="500px" frameborder="0" sandbox="allow-scripts allow-same-origin"></iframe>` (adjust `sandbox` attributes as needed for security).

### JavaScript Enhancement

For interactive features using vanilla JavaScript:

1. **Module Pattern**:
   - Use ES modules for organization
   - Keep related functionality together

2. **Event Handling**:
   - Delegate events where possible
   - Use `DOMContentLoaded` for initialization
   - Implement proper cleanup in SPA contexts

3. **Performance Best Practices**:
   - Debounce scroll/resize events
   - Avoid layout thrashing by batching DOM operations
   - Use `requestAnimationFrame` for animations

### React Applications with Vite

For more complex interactive pages:

1. **Setting up a React App**:

```bash
# Inside a content section folder
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
```

2. **Configure Vite** for proper base URL handling:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Handle GitHub Pages base path in production
  base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
  build: {
    outDir: '../../dist/EXPRESS/your-section/my-react-app',
  }
});
```

3. **Integrating with the Storage System**:

```jsx
// In your React component
import { useEffect, useState } from 'react';
import { saveData, loadData } from '../../../src/storage-adapter.js';

function MyComponent() {
  const [userData, setUserData] = useState(
    loadData('my-component-id', { defaultValue: 'initial state' })
  );
  
  useEffect(() => {
    // Save data whenever it changes
    saveData('my-component-id', userData);
  }, [userData]);
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Data Visualizations with D3.js

For creating interactive data visualizations:

1. **Basic D3.js Setup**:

```javascript
// Import D3
import * as d3 from 'd3';

// Set up the SVG container
const svg = d3.select('#visualization')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Load and process data
d3.json('../data/your-data.json').then(data => {
  // Create visualization
  // ...
});
```

2. **Responsive D3.js Visualizations**:

```javascript
// Make visualization responsive
function updateDimensions() {
  const container = document.getElementById('visualization');
  const width = container.clientWidth || 800;
  const height = Math.min(width * 0.6, 600);
  
  svg.attr('width', width)
     .attr('height', height);
     
  // Update scales and positions
  xScale.range([0, width - margin.left - margin.right]);
  yScale.range([height - margin.top - margin.bottom, 0]);
  
  // Update visualization elements
  // ...
}

// Listen for window resize
window.addEventListener('resize', debounce(updateDimensions, 250));

// Initial setup
updateDimensions();
```

3. **Integrating D3.js with React** (for React pages):

```jsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function D3Visualization({ data }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    // Clear any existing visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create new visualization
    const svg = d3.select(svgRef.current);
    
    // D3 code here...
    
  }, [data]);
  
  return <svg ref={svgRef} width="100%" height="400"></svg>;
}
```

### 3D Visualizations

For advanced 3D visualizations using Three.js:

1. **Basic Three.js Setup**:

```javascript
import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('visualization-3d').appendChild(renderer.domElement);

// Add objects to the scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update objects
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Render
  renderer.render(scene, camera);
}

animate();
```

## Data Visualization Best Practices

### Key Principles

1. **Choose the Right Visualization** for your data type:
   - Categorical comparisons: Bar charts, pie charts
   - Time series: Line charts
   - Distributions: Histograms, box plots
   - Relationships: Scatter plots, heatmaps
   - Hierarchical: Tree maps, sunburst diagrams
   - Networks: Force-directed graphs

2. **Clarity Over Complexity**:
   - Focus on the story the data tells
   - Remove chartjunk (non-data ink)
   - Use clear labels and annotations
   - Include legends where necessary

3. **Color Usage**:
   - Choose accessible color schemes
   - Use color consistently and purposefully
   - Consider colorblind-friendly palettes
   - Use color to highlight important data points

4. **Interactivity with Purpose**:
   - Add tooltips for detailed information
   - Enable filtering and drilling down where useful
   - Make interactive elements obvious and intuitive
   - Ensure interactions enhance understanding

### Choosing the Right Visualization

| Data Relationship | Best Visualization Types | Notes |
|-------------------|--------------------------|-------|
| Comparison | Bar charts, column charts | Best for comparing discrete categories |
| Time Series | Line charts, area charts | Show trends over time |
| Distribution | Histograms, box plots | Display spread and outliers |
| Composition | Pie charts, stacked charts | Show parts of a whole |
| Correlation | Scatter plots, bubble charts | Reveal relationships between variables |
| Geographic | Maps, choropleth maps | Spatial patterns and regional differences |
| Networks | Node-link diagrams, adjacency matrices | Connections and relationships |
| Hierarchies | Treemaps, sunburst diagrams | Nested structures and proportions |

### Accessibility Considerations

1. **Text Alternatives**:
   - Provide alt text for visualizations
   - Include data tables alongside charts

2. **Keyboard Navigation**:
   - Ensure interactive elements are keyboard accessible
   - Implement proper tab order and focus styles

3. **Color Independence**:
   - Don't rely on color alone to convey information
   - Use patterns, shapes, and text labels as supplements
   - Test with colorblind simulation tools

4. **Screen Reader Support**:
   - Use ARIA labels and descriptions
   - Structure SVG elements semantically

For more detailed guidance, refer to the [DATA_VISUALIZATION_GUIDE.md](#data-visualization-guide) in the References section.

## Build and Deployment

### Local Development

For local development and testing:

```bash
# Start the development server
npm run dev
```

This will:
1. Start a local server (typically on port 3000)
2. Enable live reloading for changes
3. Serve content from the root of the repository

### Build Process

To create a production-ready build:

```bash
# Build for production
npm run build
# or
./scripts/build.sh
```

The build process:
1. Compiles and minifies JavaScript files
2. Processes and optimizes CSS
3. Optimizes assets (images, fonts)
4. Creates a production-ready build in the `dist/` folder
5. Generates the table of contents
6. Updates any necessary configuration for production

### Deployment to GitHub Pages

GitHub Pages is a simple way to host your static site directly from your GitHub repository.

**Steps:**

1.  **Ensure your repository is on GitHub.**
2.  **Set `homepage` in `package.json`**: **Consult your `PROJECT_BRIEF.md` for the correct URL.** This should be in the format `https://<username>.github.io/<repository-name>/`.
    ```json
    // In TEMPLATE/package.json
    {
      // ...
      "homepage": "https://yourusername.github.io/your-repo-name/",
      // ...
    }
    ```
3.  **Install `gh-pages`**:
    ```bash
    npm install --save-dev gh-pages
    ```
4.  **Add deploy scripts to `package.json`**:
    ```json
    // In TEMPLATE/package.json
    "scripts": {
      // ...
      "predeploy": "npm run build", // Or your specific build command from build.sh
      "deploy": "gh-pages -d dist"
    },
    ```
5.  **Configure Base URL Handling**: **Consult your `PROJECT_BRIEF.md` for the correct base path.** For assets to load correctly on GitHub Pages (which often serves from a subdirectory), your build tool needs to be aware of the base path.
    *   **For Vite (in `TEMPLATE/vite.config.js` or `TEMPLATE/vite.config.ts`):**
        Set the `base` option. This should match the repository name subdirectory.
        ```javascript
        // vite.config.js
        import { defineConfig } from 'vite';
        import react from '@vitejs/plugin-react';

        export default defineConfig(({ command }) => {
          const base = command === 'build' ? '/your-repo-name/' : '/'; // Get '/your-repo-name/' from PROJECT_BRIEF.md
          return {
            plugins: [react()],
            base: base,
          };
        });
        ```
    *   **For other build tools**: Consult their documentation for setting a public path or base URL.
6.  **Build your project**:
    ```bash
    npm run build # Or your specific build command from build.sh
    ```
7.  **Deploy**:
    ```bash
    npm run deploy
    ```
    This will push the contents of your `dist` (or equivalent build output) folder to a `gh-pages` branch in your repository, which GitHub Pages will then serve.
8.  **Configure GitHub Pages Source**: In your GitHub repository settings, under "Pages", ensure the source is set to deploy from the `gh-pages` branch and the `/ (root)` folder.

**Using GitHub Actions for Automated Deployment:**

You can automate the deployment process using GitHub Actions. A sample workflow file (`TEMPLATE/.github/workflows/deploy-gh-pages.yml`) is provided. Ensure it's configured correctly for your Node.js version and build steps. **Remember to set the `BASE_URL` secret in your GitHub repository settings if your workflow needs it (e.g., if it dynamically sets the base path during build). This `BASE_URL` should correspond to the repository name, like `/your-repo-name/`, as defined in your `PROJECT_BRIEF.md`.**

**Troubleshooting GitHub Pages Deployment:**

1. **Base URL Configuration**:
   - Problem: Assets and scripts failing to load (404 errors)
   - Fix: Update `vite.config.js` to use conditional base path:
   ```javascript
   export default defineConfig({
     base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   })
   ```
   - Also update React components to use `import.meta.env.BASE_URL`:
   ```jsx
   <img src={`${import.meta.env.BASE_URL}assets/images/logo.png`} />
   ```

2. **Module System Incompatibility**:
   - Problem: Build fails with `require is not defined` or `__dirname is not defined`
   - Fix: Convert CommonJS patterns to ES Module syntax:
   ```javascript
   // Instead of:
   const path = require('path');
   const __dirname = process.cwd();
   // Use:
   import path from 'path';
   import { fileURLToPath } from 'url';
   const __dirname = path.dirname(fileURLToPath(import.meta.url));
   ```

3. **Missing Package.json Configuration**:
   - Problem: Incorrect base paths in production build
   - Fix: Add `homepage` field to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name/",
   }
   ```

4. **CORS Issues with Embedded Content**:
   - Problem: Content fails to load due to cross-origin restrictions
   - Fix: Use relative paths and wrap scripts in IIFE:
   ```javascript
   (function() {
     // Use relative paths: './data.json' instead of '/data.json'
   })();
   ```

5. **SPA Routing (Deep Linking)**: GitHub Pages is designed for static sites. When a user directly accesses a URL like `your-site.com/some/path` (a client-side route in an SPA), GitHub Pages will return a 404 error because it looks for a file at `/some/path/index.html`.
        *   **Solution (The `404.html` Hack)**:
            1.  Create a custom `404.html` file in your repository root (or `docs/` folder if deploying from there).
            2.  This `404.html` should contain a script that captures the requested path and redirects to `index.html` with the path information in a query string or hash fragment.
            3.  Your `index.html` (or main SPA router) then reads this information and navigates to the correct client-side route.
            *   Example `404.html` script snippet (from `rafgraph/spa-github-pages`):
                ```html
                <!-- In 404.html -->
                <script>
                  sessionStorage.redirect = location.href;
                </script>
                <meta http-equiv="refresh" content="0;URL='/?redirect=true'">
                ```
            *   Example `index.html` script snippet to handle redirect:
                ```javascript
                // In index.html or your main app script
                (function(){
                  var redirect = sessionStorage.redirect;
                  delete sessionStorage.redirect;
                  if (redirect && redirect != location.href) {
                    history.replaceState(null, null, redirect);
                  }
                })();
                ```
            *   Alternatively, a more common approach for the `404.html` script:
                ```html
                <!-- In 404.html -->
                <script>
                  const path = location.pathname;
                  const query = location.search;
                  const hash = location.hash;
                  // Adjust the target path as needed, e.g., to include your repo name if deploying to a subpath
                  const targetPath = '/your-repo-name/'; // Or just '/' if deploying to a custom domain root
                  location.href = `${targetPath}?p=${encodeURIComponent(path)}&q=${encodeURIComponent(query)}&h=${encodeURIComponent(hash)}`;
                </script>
                ```
                Then, in your `index.html` or router, parse `p`, `q`, and `h` from the query string to reconstruct the original URL and route accordingly.
        *   **Note**: This hack works well for many SPAs but might have limitations for SEO if not further configured with sitemaps and pre-rendering. For complex SPAs needing robust routing and SEO, consider platforms like Netlify that have built-in support for SPA redirects.

6.  **Debugging Techniques**:
    *   **Browser Developer Tools**: Use the Console, Network, and Elements tabs to diagnose issues.
    *   **Verbose Logging**: Temporarily add more `console.log` statements to understand the flow and where it breaks.
    *   **Isolation**: Test the standalone HTML in complete isolation first. Once it works, integrate it into the main project.
    *   **Documentation**: Keep the documentation of both the main project and the standalone component handy. Sometimes the issue is due to a missed configuration or step in the documentation.

#### Netlify Deployment Issues

Common issues when deploying to Netlify:

1. **Build Command Failures**:
   - Problem: Netlify build fails
   - Check: Netlify logs for detailed error messages
   - Fix: Ensure build commands work locally before deploying

2. **Environment Variables**:
   - Problem: Environment variables not available during build
   - Fix: Set them in the Netlify UI under Site settings > Build & deploy > Environment

3. **Redirect Issues**:
   - Problem: 404 errors on page refresh or direct URL access
   - Fix: Add proper redirects in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Embedded Visualizations Issues

If D3.js or other visualizations aren't rendering properly:

1. **Empty or Incorrect Data Processing**:
   - Problem: "Cannot read properties of undefined" or empty visualizations
   - Fix: Robust data handling:
   ```javascript
   // Instead of:
   const newNode = {
     id: rawNode.id,
     fields: rawNode.fields || {}
   };
   
   // Use:
   const newNode = {
     id: rawNode.id,
     fields: {}
   };
   // Copy all properties from rawNode to newNode.fields
   for (const key in rawNode) {
     if (rawNode.hasOwnProperty(key) && key !== 'id') {
       newNode.fields[key] = rawNode[key];
     }
   }
   ```

2. **SVG Container Sizing Issues**:
   - Problem: Graph appears cut off or doesn't display
   - Fix: Set explicit SVG dimensions and handle container size changes:
   ```javascript
   // Get container dimensions
   const width = containerElement.clientWidth || 800; // Fallback if zero
   const height = containerElement.clientHeight || 600; // Fallback if zero
   
   // Apply to SVG
   svg.attr('width', width).attr('height', height);
   
   // Add debounced resize handler
   window.addEventListener('resize', debounce(() => {
     updateDimensions();
   }, 250));
   ```

3. **D3.js Force Layout Issues**:
   - Problem: Nodes overlap or fly off-screen
   - Fix: Adjust force parameters and add constraints:
   ```javascript
   simulation = d3.forceSimulation(nodes)
     .force('link', d3.forceLink(links).id(d => d.id).distance(150))
     .force('charge', d3.forceManyBody().strength(-400))
     .force('center', d3.forceCenter(width / 2, height / 2))
     .force('x', d3.forceX(width / 2).strength(0.05))
     .force('y', d3.forceY().y(d => getYPosition(d, height)).strength(0.15))
     .force('collision', d3.forceCollide().radius(d => getNodeSize(d) + 10));
   ```

4. **Missing DOM Elements**:
   - Problem: Script fails with "Cannot find element" errors
   - Fix: Add robust element checks:
   ```javascript
   const element = document.getElementById('element-id');
   if (!element) {
     console.error("#element-id not found!");
     return; // Exit function early
   }
   // Proceed with operations on element
   ```

5. **Filter Dropdowns Not Working**:
   - Problem: Filter dropdowns empty or not filtering content
   - Fix: Populate dropdowns after data is loaded:
   ```javascript
   function populateFilterDropdowns() {
     const filter = document.getElementById('filter-id');
     if (!filter) {
       console.error("#filter-id element not found!");
       return;
     }
     
     // Extract unique values
     const uniqueValues = [...new Set(data.map(item => item.field))].filter(Boolean);
     
     // Clear existing options except default
     while (filter.options.length > 1) filter.remove(1);
     
     // Add options
     uniqueValues.forEach(value => {
       const option = document.createElement('option');
       option.value = value;
       option.textContent = value;
       filter.appendChild(option);
     });
   }
   ```

#### Common Build Issues

Issues that may occur during the build process:

1. **Node.js Version Mismatch**:
   - Problem: Build fails due to Node.js version incompatibility
   - Fix: Use `.nvmrc` file to specify Node.js version:
   ```
   16.14.0
   ```
   - Use nvm: `nvm use` before building

2. **Missing Dependencies**:
   - Problem: Build fails due to missing npm packages
   - Fix: Ensure all dependencies are in `package.json` and run `npm install`

3. **Path Resolution Issues**:
   - Problem: Cannot find modules or assets
   - Fix: Use absolute imports or proper relative paths

#### Runtime Errors

Common issues that occur in the browser:

1. **JavaScript Errors**:
   - Problem: Console shows JS errors
   - Fix: Use try/catch blocks for error handling:
   ```javascript
   try {
     // Risky operation
   } catch (error) {
     console.error('Operation failed:', error);
     // Fallback behavior
   }
   ```

2. **CSS Rendering Issues**:
   - Problem: Styles not applying correctly
   - Fix: Check browser compatibility and use vendor prefixes where needed

3. **Network Errors**:
   - Problem: Failed to load resources
   - Fix: Implement proper error handling for fetch operations:
   ```javascript
   fetch('data.json')
     .then(response => {
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
       return response.json();
     })
     .then(data => {
       // Process data
     })
     .catch(error => {
       console.error('Could not load data:', error);
       // Show error message to user
       document.getElementById('error-container').textContent = 
         'Failed to load data. Please try again later.';
     });
   ```

#### Debugging Techniques

Tools and techniques for troubleshooting:

1. **Enable Verbose Storage Debugging**:
   ```javascript
   localStorage.setItem('debug-storage', 'true');
   ```

2. **Clear Stored Data**:
   ```javascript
   // Clear all stored data
   localStorage.clear();
   
   // Or selectively clear a specific dashboard
   import dashboardStorage from './storage-manager.js';
   dashboardStorage.clearDashboard('dashboard-id');
   ```

3. **Browser DevTools**:
   - Use the Network tab to inspect requests
   - Use the Console for JavaScript errors
   - Use the Elements panel to inspect DOM structure
   - Use the Application tab to view localStorage content

4. **Performance Monitoring**:
   - Use the Performance tab in DevTools to identify bottlenecks
   - Lighthouse audit for overall performance metrics

#### Handling Special Characters and Encoding

1.  **File Encoding**:
    *   **Issue**: Text displaying incorrectly (e.g.,  symbols) due to mismatched character encodings.
    *   **Solution**: Always save HTML, CSS, and JavaScript files as **UTF-8**.
        *   Ensure your HTML specifies UTF-8: `<meta charset="UTF-8">` as the first element in `<head>`.
        *   Configure your code editor to default to UTF-8.

2.  **HTML Entities**:
    *   **Issue**: Special characters like `<`, `>`, `&`, `"`, `'` in text content or attribute values can break HTML parsing or be misinterpreted.
    *   **Solution**: Use HTML entities:
        *   `&lt;` for `<`
        *   `&gt;` for `>`
        *   `&amp;` for `&`
        *   `&quot;` for `"`
        *   `&apos;` for `'` (less critical in HTML attributes, but good practice)
        *   `&nbsp;` for a non-breaking space.
    *   Content generated dynamically by JavaScript should also have special characters escaped before being injected as HTML (e.g., via `element.textContent = "user input <script>..."` is safer than `element.innerHTML = "user input <script>..."`).

3.  **JavaScript Strings**:
    *   **Issue**: Special characters in JavaScript strings, especially when constructing HTML dynamically or dealing with JSON.
    *   **Solution**:
        *   Use template literals (backticks `` ` ``) for easier string construction with variables.
        *   Be careful with quotes within strings. Use `\'` or `\"` to escape.
        *   When embedding JavaScript in HTML attributes (e.g., `onclick="alert('Hello & Welcome!')`
