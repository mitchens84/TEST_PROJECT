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
     - [7.3.1. External Pre-built React Applications](#external-pre-built-react-applications)
     - [7.3.2. Internal React Applications (Project-Contained)](#internal-react-applications-project-contained)
   - [Data Visualizations with D3.js](#data-visualizations-with-d3js)
   - [3D Visualizations](#3d-visualizations)

8. [Data Visualization Best Practices](#data-visualization-best-practices)
   - [Key Principles](#key-principles)
   - [Choosing the Right Visualization](#choosing-the-right-visualization)
   - [Accessibility Considerations](#accessibility-considerations)

9. [Build and Deployment](#build-and-deployment)
   - [Local Development](#local-development)
   - [Build Process](#build-process)
   - [Deployment Strategy: Main Branch First](#deployment-strategy-main-branch-first)
   - [Deployment to GitHub Pages](#deployment-to-github-pages)
     - [9.4.1. Repository Setup on GitHub](#repository-setup-on-github)
     - [9.4.2. Local Git Setup](#local-git-setup)
     - [9.4.3. Building the Project](#building-the-project)
     - [9.4.4. Preparing Files for GitHub Pages (`docs` folder method)](#preparing-files-for-github-pages-docs-folder-method)
     - [9.4.5. Committing and Pushing to GitHub](#committing-and-pushing-to-github)
     - [9.4.6. Configuring GitHub Pages Settings](#configuring-github-pages-settings)
     - [9.4.7. Verification](#verification)
   - [Deployment to Netlify](#deployment-to-netlify)
   - [Advanced Deployment: GitHub Actions](#advanced-deployment-github-actions)
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

The Table of Contents is automatically generated from the `/EXPRESS/` directory structure using a Node.js script. As of May 2025, the ToC is displayed in a collapsible sidebar for improved user experience and screen real estate management.

#### Collapsible Sidebar ToC

**Functionality:**
*   **Toggle Button:** A button (typically with '«' to collapse and '»' to expand, or '☰') is present, usually fixed to the top-left of the viewport.
*   **Behavior:** Clicking the button slides the sidebar ToC in and out of view.
*   **State Persistence:** The collapsed/expanded state of the sidebar is saved in `localStorage` (using a project-specific key like `sidebarState_PROJECTNAME`), so the user's preference is remembered across sessions.
*   **Content Area Adjustment:** When the sidebar collapses, the main content area expands to utilize the available space. When expanded, the content area adjusts to make space for the sidebar.
*   **Animation:** CSS transitions provide a smooth sliding effect.

**Implementation Overview:**
1.  **HTML Structure (`index.html`):**
    *   A toggle button element (e.g., `<button id="sidebar-toggle-btn">`) is added, usually directly within the `<body>`.
    *   The main sidebar (`<div id="sidebar">`) and content area (`<div id="content-area">`) are structured to allow for this interaction.
2.  **CSS Styling (`index.html` or linked CSS):**
    *   The sidebar is typically `position: fixed` to allow it to slide independently.
    *   A CSS class (e.g., `.sidebar-collapsed`) is applied to the sidebar (and often the `<body>` element) to trigger the collapsed state.
        *   `transform: translateX(-100%);` is commonly used to hide the sidebar off-screen.
    *   The `margin-left` of the content area is adjusted based on the sidebar's state.
    *   The toggle button is also `position: fixed` to remain accessible.
3.  **JavaScript Logic (`index.html`):**
    *   An event listener on the toggle button handles the click.
    *   It toggles the `.sidebar-collapsed` class on relevant elements.
    *   It updates `localStorage` with the new state.
    *   On page load (`DOMContentLoaded`), it checks `localStorage` to apply the previously saved state.

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

### Client-Side Access Control

This section outlines different tiers for implementing basic client-side access control. It's crucial to understand that **client-side protection is not truly secure** and can be bypassed by users with technical knowledge. It serves as a deterrent for casual browsing rather than a robust security measure. Always consider the sensitivity of the content when choosing an approach.

#### Tier 0: Basic Obscurity Prompt (In-Page)

This is the simplest form of password protection, embedded directly into the main HTML page (e.g., `index.html`).

**How it Works:**
*   A JavaScript `prompt()` dialog asks the user for a password when the page loads.
*   The entered password is compared against a plain text password stored directly in the script.
*   If correct, `sessionStorage` is used to store the password (or a flag) for the current session, preventing repeated prompts on page refresh or navigation within the same session (if other pages implement the same check).
*   If incorrect, the page content is typically replaced with an "Access Denied" message, and script execution is halted.

**Implementation Files (within `TEMPLATE`):**
*   Logic is embedded directly in `/TEMPLATE/index.html` (or any page needing protection).

**Key Characteristics:**
*   **Password in Plain Text:** The password is visible in the page source.
*   **Extremely Low Security:** Easily bypassed by viewing source or disabling JavaScript.
*   **Simple to Implement:** Requires minimal code.
*   **Session-Based "Remember Me":** Avoids re-prompting within the same browser session.

**Example Snippet (to be placed at the start of `<body>` in the HTML file):**
```html
<script>
    // --- Basic Password Protection - Tier 0 ---
    (function() {
        const sitePassword = "YOUR_CHOSEN_PASSWORD"; // IMPORTANT: Change this!
        let sessionPassword = null;
        try {
            sessionPassword = sessionStorage.getItem('tier0Password');
        } catch (e) { console.warn("Session storage access denied."); }

        if (sessionPassword === sitePassword) { return; } // Already authenticated in this session

        const enteredPassword = prompt("Enter password to view content:", "");
        if (enteredPassword === sitePassword) {
            try {
                sessionStorage.setItem('tier0Password', enteredPassword);
            } catch (e) { console.warn("Session storage access denied for saving password."); }
        } else {
            document.body.innerHTML = '<h1 style="text-align:center; margin-top: 50px; font-family: sans-serif;">Access Denied</h1>';
            throw new Error("Access Denied - Halting further script execution.");
        }
    })();
</script>
```
**When to Use:**
*   When you need a very minimal barrier to entry for non-sensitive content, primarily to discourage casual, unintended access.

#### Tier 1: Hashed Password with Separate Login Page

This approach offers a slightly more structured (though still client-side) way to handle password protection.

**How it Works:**
*   A dedicated `login.html` page prompts for the password.
*   A `config.js` file stores a SHA-256 hash of the actual password.
*   An `auth.js` script on `login.html` takes the user's input, hashes it using the Web Crypto API (SHA-256), and compares it to the stored hash.
*   If the hashes match, an authentication flag (e.g., `isAuthenticated = true`) is set in `sessionStorage`. The user is then redirected to the main content page.
*   A `check-auth.js` script is included on all protected content pages. It checks for the authentication flag in `sessionStorage`. If not present or false, it redirects the user to `login.html`.

**Implementation Files (within `TEMPLATE`):**
*   `/TEMPLATE/login.html`: The page where users enter the password.
*   `/TEMPLATE/src/config.js`: Stores the hashed password and other configurations (e.g., login page path, default redirect page).
    *   **Important:** You must generate the SHA-256 hash of your chosen password and update `config.js`.
*   `/TEMPLATE/src/auth.js`: Handles the login logic on `login.html` (password hashing, comparison, setting session flag, redirection).
*   `/TEMPLATE/src/check-auth.js`: Included on protected pages to verify authentication status and redirect if necessary.

**Key Characteristics:**
*   **Password Hashed (Client-Side):** The actual password is not stored in plain text in the configuration. However, the hashing and comparison logic are client-side.
*   **Low Security:** While better than plain text, it's still client-side and can be reverse-engineered or bypassed. The content itself is still sent to the client.
*   **More User-Friendly Flow:** A dedicated login page can provide a better user experience than a simple prompt.
*   **Session-Based Authentication:** Uses `sessionStorage` to keep the user logged in for the session.

**When to Use:**
*   For content that requires a slightly more formal access step than Tier 0, but where true server-side security is not available or overkill.
*   Suitable for discouraging casual access to moderately non-public information.

### Choosing a Tier

*   **No Access Control:** For fully public content.
*   **Tier 0:** For a quick, minimal deterrent for non-sensitive content.
*   **Tier 1:** When a slightly more formal login experience is desired, still understanding the client-side limitations.

For any truly sensitive information, **always use server-side authentication and authorization.**

## Implementing a User Notification System

A user notification system provides valuable feedback for user actions. Here's a pattern implemented in a React application using TypeScript:

**1. Setup in the Main Application Component (e.g., `App.tsx`)**

*   **State Management:**
    ```typescript
    // Define notification types
    type NotificationType = 'info' | 'success' | 'error';

    interface NotificationState {
      message: string;
      type: NotificationType;
    }

    // In your App component
    const [notification, setNotification] = useState<NotificationState>({ message: '', type: 'info' });
    const [showNotification, setShowNotification] = useState(false);
    const notificationTimeoutRef = useRef<number | null>(null);
    ```

*   **`triggerNotification` Function:** This function is passed down to child components.
    ```typescript
    const triggerNotification = useCallback((message: string, type: NotificationType = 'info') => {
      setNotification({ message, type });
      setShowNotification(true);

      // Clear existing timeout if any
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }

      // Auto-hide notification after a delay (e.g., 3 seconds)
      notificationTimeoutRef.current = window.setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }, []);
    ```
    *Note: Remember to clear the timeout in a `useEffect` cleanup function if `App.tsx` can unmount.*

*   **`renderNotifications` Function:** This function renders the notification UI.
    ```tsx
    const renderNotifications = () => {
      if (!showNotification) return null;
      return (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
          <button onClick={() => setShowNotification(false)} className="close-notification">&times;</button>
        </div>
      );
    };

    // In App.tsx's return statement:
    // {renderNotifications()}
    ```

*   **Basic CSS for Notifications (e.g., in `App.css`):**
    ```css
    .notification {
      padding: 10px 15px;
      margin-bottom: 15px;
      border-radius: 4px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed; /* Or relative to a container */
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      min-width: 300px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .notification-info { background-color: #2196F3; }
    .notification-success { background-color: #4CAF50; }
    .notification-error { background-color: #f44336; }
    .close-notification {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 15px;
    }
    ```

**2. Usage in Child Components**

*   Child components receive `triggerNotification` as a prop.
    ```typescript
    interface ChildProps {
      triggerNotification: (message: string, type?: NotificationType) => void;
    }

    const MyChildComponent = ({ triggerNotification }: ChildProps) => {
      const handleAction = () => {
        // ... perform action ...
        triggerNotification('Action completed successfully!', 'success');
      };
      // ...
    };
    ```

## Building Multi-Tabbed Components with Persistent State

This pattern describes creating a component with multiple tabs where the active tab and the data within each tab are persisted using `localStorage`.

**1. Main Application Component (`App.tsx`) Structure:**

*   **Active Tab State:**
    ```typescript
    const [activeTab, setActiveTab] = useState<string>(() => 
      getStoredValue(LOCAL_STORAGE_KEYS.activeTab, 'overview') // 'overview' is the default
    );
    ```
*   **Persisting Active Tab:**
    ```typescript
    useEffect(() => {
      setStoredValue(LOCAL_STORAGE_KEYS.activeTab, activeTab);
    }, [activeTab]);
    ```
*   **Tab Navigation UI:**
    ```tsx
    // Example tab button
    <button 
      onClick={() => setActiveTab('overview')} 
      className={activeTab === 'overview' ? 'active' : ''}
    >
      Overview
    </button>
    ```
*   **Conditional Rendering of Tab Content:**
    ```tsx
    <div className="tab-content">
      {activeTab === 'overview' && <ProposalOverview {...propsToPass} />}
      {activeTab === 'details' && <ProposalDetails {...propsToPass} />}
      {/* ... other tabs ... */}
    </div>
    ```

**2. Individual Tab Components (e.g., `ProposalOverview.tsx`):**

*   **Manage Own State:** Each tab component manages its own data and UI state.
    ```typescript
    // Example state for overview data
    const [overviewData, setOverviewData] = useState<OverviewSection[]>(() =>
      getStoredValue(LOCAL_STORAGE_KEYS.overviewData, initialOverviewData)
    );
    ```
*   **Persist Own Data:** Use `useEffect` to save its specific data to `localStorage` when that data changes.
    ```typescript
    useEffect(() => {
      setStoredValue(LOCAL_STORAGE_KEYS.overviewData, overviewData);
    }, [overviewData]);
    ```
*   **`localStorageUtils.ts`**: A utility module for `getStoredValue` and `setStoredValue` is highly recommended (see "Managing Interactive Form Elements" section for an example).

## 5. Content Development Workflow

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
        *   **Cons:** Can be harder to make responsive, communication between iframe and parent page is more complex (requires `postMessage`), can have SEO implications if not handled carefully, and may create a "double scrollbar" user experience if not sized correctly.
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

Vite is the recommended bundler for developing React applications due to its speed and modern feature set.

#### 7.3.1. External Pre-built React Applications

For complex React applications that are developed and maintained as separate projects (e.g., within a `DASHBOARDS` or `APPS` monorepo), the integration approach is to embed their static build output.

*   **Workflow:**
    1.  Develop and build the external React application in its own repository or directory structure using Vite (or CRA, etc.). This should produce a `dist` or `build` folder containing a static `index.html` and its assets (JS, CSS, images).
    2.  Manually (or via a custom script) copy the *contents* of this `dist` (or `build`) folder into a designated subdirectory within the `EXPRESS/` folder of the consuming project (e.g., `TEST_PROJECT/EXPRESS/my-react-app/`).
    3.  The main project's `build.sh` script does *not* attempt to build this external React app. It only includes the path to its `index.html` when generating the Table of Contents.
*   **Pros:** Decouples the build processes, allows independent development cycles, avoids dependency conflicts between the shell project and the complex React app.
*   **Cons:** Requires a manual or scripted step to copy the built assets.

#### 7.3.2. Internal React Applications (Project-Contained)

For React components or mini-applications that are integral to a specific project (like `TEST_PROJECT`) and should be self-contained within it.

*   **Structure:**
    *   Create a dedicated source directory within the project, e.g., `src_react/my_internal_app/`.
    *   This directory will house a complete Vite + React + TypeScript setup:
        *   `package.json` (for its specific dependencies like React, Vite, TypeScript, and related types like `@types/react`).
        *   `vite.config.ts` (configured with `base: './'` for relative asset paths, and other project-specific Vite settings).
        *   `tsconfig.json` (configured for a React TypeScript project, typically including settings like `"jsx": "react-jsx"`, `"esModuleInterop": true`, `"strict": true, target ECMAScript version, and `"isolatedModules": true`. Vite's default `npx create-vite my-react-app --template react-ts` command provides a good starting point for this file).
        *   `index.html` (Vite entry point).
        *   `src/main.tsx`, `src/App.tsx`, etc.
    *   This approach is similar to the "Create React App" (CRA) setup but within the context of this template system.
*   **Build Integration:**
    1.  The main project's `build.sh` script is modified to include steps to build this internal React app:
        *   `cd src_react/my_internal_app`
        *   `npm install` (if `node_modules` is missing or `package.json` updated)
        *   `npm run build` (which typically runs `tsc && vite build`)
        *   `cd ../..` (back to project root)
    2.  After the internal React app is built (e.g., to `src_react/my_internal_app/dist/`), the `build.sh` script copies the contents of this `dist` folder to the appropriate subdirectory in `EXPRESS/` (e.g., `EXPRESS/some_section/my_internal_app/`).
    3.  The Table of Contents generator then picks up the `index.html` from this `EXPRESS/` location.
*   **Pros:**
    *   The project is fully self-contained and standalone.
    *   The build process for the interactive component is part of the main project's build.
*   **Cons:**
    *   The main project's `build.sh` becomes slightly more complex.
    *   Build times for the main project might increase if the internal React app is large.
*   **Example Configuration (`vite.config.ts` for internal app):**
    ```typescript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import path from 'path';

    export default defineConfig({
      plugins: [react()],
      base: './', // Crucial for embedded content
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            entryFileNames: `assets/[name].js`,
            chunkFileNames: `assets/[name].js`,
            assetFileNames: `assets/[name].[ext]`
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      }
    });
    ```
*   **Example `build.sh` additions:**
    ```bash
    # --- Build Internal React App ---
    # Define these variables at the top of your build.sh or per app
    # INTERNAL_APP_NAME="my_internal_app" # A descriptive name
    # INTERNAL_APP_SRC_DIR="src_react/$INTERNAL_APP_NAME"
    # INTERNAL_APP_OUTPUT_DIR="EXPRESS/some_section/$INTERNAL_APP_NAME"

    echo "Building Internal React App: $INTERNAL_APP_NAME"
    echo "Source directory: $INTERNAL_APP_SRC_DIR"
    echo "Output directory: $INTERNAL_APP_OUTPUT_DIR"

    if [ ! -d "$INTERNAL_APP_SRC_DIR" ]; then
      echo "ERROR: Source directory $INTERNAL_APP_SRC_DIR does not exist. Skipping build for $INTERNAL_APP_NAME."
    else
      # Navigate to the app's directory safely
      pushd "$INTERNAL_APP_SRC_DIR" > /dev/null
      if [ $? -ne 0 ]; then
        echo "ERROR: Failed to navigate to $INTERNAL_APP_SRC_DIR. Skipping build for $INTERNAL_APP_NAME."
      else
        if [ ! -d "node_modules" ] || [ ! -f "package-lock.json" ] && [ -f "package.json" ]; then
          echo "node_modules not found or package-lock.json missing in $INTERNAL_APP_SRC_DIR. Running npm install..."
          npm install
          if [ $? -ne 0 ]; then
            echo "ERROR: npm install failed for $INTERNAL_APP_NAME. Skipping build."
            popd > /dev/null
            # Optionally exit the script: exit 1
            # Continue to next build step if desired
            # continue # if in a loop
          fi
        fi

        echo "Running build for $INTERNAL_APP_NAME..."
        npm run build
        if [ $? -ne 0 ]; then
          echo "ERROR: npm run build failed for $INTERNAL_APP_NAME."
          # Optionally exit the script: exit 1
        else
          echo "Build successful for $INTERNAL_APP_NAME."
          # Navigate back
          popd > /dev/null

          echo "Copying built internal app assets from $INTERNAL_APP_SRC_DIR/dist/ to $INTERNAL_APP_OUTPUT_DIR..."
          mkdir -p "$INTERNAL_APP_OUTPUT_DIR"
          # Ensure the dist directory exists before attempting to copy
          if [ -d "$INTERNAL_APP_SRC_DIR/dist" ]; then
            # Using rsync for more robust copying, or cp -R
            rsync -a --delete "$INTERNAL_APP_SRC_DIR/dist/" "$INTERNAL_APP_OUTPUT_DIR/"
            # cp -R "$INTERNAL_APP_SRC_DIR/dist/"* "$INTERNAL_APP_OUTPUT_DIR/" # Alternative
            echo "Copy complete for $INTERNAL_APP_NAME."
          else
            echo "ERROR: dist directory not found in $INTERNAL_APP_SRC_DIR after build. Copy skipped for $INTERNAL_APP_NAME."
          fi
        fi
        # If npm install or build failed and we didn't exit, ensure popd is called if pushd was successful
        if [ $? -ne 0 ] && [ -d "$INTERNAL_APP_SRC_DIR" ]; then # Check if still in pushd context
             if ! popd > /dev/null 2>&1; then # try to pop, suppress error if already popped
                : # do nothing if popd fails (e.g. already popped due to error handling)
             fi
        fi
      fi
    fi
    echo "--- Finished processing $INTERNAL_APP_NAME ---"
    ```

*   **Troubleshooting Internal React Apps:**
    *   **Blank Page After Build/Copy:**
        *   **`base` path in `vite.config.ts`:** Ensure `base: './'` is set. This is critical for assets to be referenced relatively from the copied `index.html`.
        *   **Copy Destination:** Verify the `build.sh` script copies the *contents* of the internal app's `dist/` folder (e.g., `dist/*` or `dist/.`) into the correct `EXPRESS/some_section/my_app/` directory, not the `dist` folder itself as a subdirectory.
        *   **Browser Console:** Check for 404 errors for JS/CSS files. The paths in the `index.html` (view source in browser) should be relative (e.g., `./assets/index-XXXX.js`).
    *   **Asset Loading Failures (404s for JS, CSS, Images):**
        *   Usually related to the `base` path or incorrect copy process (see above).
        *   If using image paths directly in CSS (e.g., `background-image: url(...)`), ensure these paths are correct relative to the final CSS file location or use absolute paths from the root if your server setup supports it (less common for this embedded scenario). Vite often handles this well for assets imported into JS/TSX.
    *   **Build Failures within the Internal App:**
        *   Run `npm install` and `npm run build` manually inside the `src_react/my_internal_app/` directory to see detailed error messages (TypeScript errors, dependency issues, Vite configuration problems).
        *   Ensure all necessary dependencies are listed in its `package.json`.
    *   **Styling Conflicts:**
        *   CSS from the internal React app might conflict with the main shell page's global styles, or vice-versa.
        *   **Solution 1 (CSS Modules):** Use CSS Modules within the React app for locally scoped class names. This is the most robust solution. (e.g., `import styles from './MyComponent.module.css'; <div className={styles.myClass}>...</div>`)
        *   **Solution 2 (Namespacing):** Manually prefix all CSS classes in the React app with a unique identifier (e.g., `.my-internal-app-button {}`).
        *   **Solution 3 (Iframe - if isolation is paramount):** If complete style isolation is needed and the app is complex enough, consider if it should be an "External Pre-built React Application" (Section 7.3.1) embedded via an iframe, though this adds complexity.
    *   **JavaScript Conflicts:** Less common if the React app is self-contained, but ensure global variables or polyfills from the main page don't interfere with the React app's environment.

### 4.4 User Notification System (Feedback for Actions)

For interactive applications, providing feedback to users (e.g., "Settings saved successfully," "Error submitting form") is crucial. A simple global notification system can be implemented, especially in React applications.

**Conceptual React Example (using Context for global access):**

1.  **`NotificationContext.js` (or `.tsx`)**
    ```jsx
    // src/contexts/NotificationContext.js
    import React, { createContext, useState, useCallback, useRef } from 'react';

    export const NotificationContext = createContext({
      addNotification: () => {},
    });

    export const NotificationProvider = ({ children }) => {
      const [notifications, setNotifications] = useState([]);
      const notificationIdRef = useRef(0);

      const addNotification = useCallback((message, type = 'info', duration = 3000) => {
        const id = notificationIdRef.current++;
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
      }, []);

      return (
        <NotificationContext.Provider value={{ addNotification }}>
          {children}
          <div className="notification-container">
            {notifications.map(n => (
              <div key={n.id} className={`notification notification-${n.type}`}>
                {n.message}
              </div>
            ))}
          </div>
        </NotificationContext.Provider>
      );
    };
    ```

2.  **Basic CSS for Notifications (e.g., `App.css`)**
    ```css
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050; /* Ensure it's above most other content */
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .notification {
      padding: 10px 15px;
      border-radius: 4px;
      color: #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      min-width: 250px;
      /* Add animations for appearing/disappearing if desired */
    }
    .notification-info { background-color: #2196F3; }
    .notification-success { background-color: #4CAF50; }
    .notification-error { background-color: #f44336; }
    ```

3.  **Wrap your `App` with the Provider**
    ```jsx
    // src/main.jsx or src/App.jsx
    import { NotificationProvider } from './contexts/NotificationContext'; // Adjust path

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </React.StrictMode>
    );
    ```

4.  **Use in a component**
    ```jsx
    // src/components/MyFormComponent.jsx
    import React, { useContext } from 'react';
    import { NotificationContext } from '../contexts/NotificationContext'; // Adjust path

    const MyFormComponent = () => {
      const { addNotification } = useContext(NotificationContext);

      const handleSubmit = () => {
        // ... submit logic ...
        const success = true; // or false based on submission result
        if (success) {
          addNotification('Form submitted successfully!', 'success');
        } else {
          addNotification('Failed to submit form.', 'error');
        }
      };
      return <button onClick={handleSubmit}>Submit</button>;
    };
    ```
This provides a basic, non-intrusive way to give feedback.

### 4.5 Building Multi-Tabbed Components

Many applications require organizing content or functionality into tabs. The "Interactive Career Proposal" test project demonstrated this pattern.

**Key Elements:**
1.  **State for Active Tab:** Manage which tab is currently selected.
2.  **Tab Navigation UI:** Buttons or links to switch between tabs.
3.  **Conditional Content Rendering:** Display content based on the active tab.
4.  **(Optional) Persistence:** Save the active tab to `localStorage` so the user returns to the same tab.

**Conceptual React Example:**
```jsx
// src/components/TabbedComponent.jsx
import React, { useState, useEffect } from 'react';
import { getStoredValue, setStoredValue } from '../utils/localStorageUtils'; // Assuming you have this

// Define your tab components
const Tab1Content = () => <div>Content for Tab 1</div>;
const Tab2Content = () => <div>Content for Tab 2</div>;
const Tab3Content = () => <div>Content for Tab 3</div>;

const TAB_CONFIG = [
  { id: 'tab1', label: 'Tab One', component: <Tab1Content /> },
  { id: 'tab2', label: 'Tab Two', component: <Tab2Content /> },
  { id: 'tab3', label: 'Tab Three', component: <Tab3Content /> },
];
const DEFAULT_TAB_ID = TAB_CONFIG[0].id;
const LOCAL_STORAGE_KEY_ACTIVE_TAB = 'myComponent_activeTab';

const TabbedComponent = () => {
  const [activeTabId, setActiveTabId] = useState(() =>
    getStoredValue(LOCAL_STORAGE_KEY_ACTIVE_TAB, DEFAULT_TAB_ID)
  );

  useEffect(() => {
    setStoredValue(LOCAL_STORAGE_KEY_ACTIVE_TAB, activeTabId);
  }, [activeTabId]);

  const activeTabContent = TAB_CONFIG.find(tab => tab.id === activeTabId)?.component || null;

  return (
    <div>
      <div className="tab-navigation">
        {TAB_CONFIG.map(tab => (
          <button
            key={tab.id}
            className={activeTabId === tab.id ? 'active' : ''}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content-area">
        {activeTabContent}
      </div>
    </div>
  );
};

export default TabbedComponent;
```
**CSS for Tabs (Basic Example):**
```css
.tab-navigation button {
  padding: 10px 15px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
}
.tab-navigation button.active {
  background-color: #fff;
  border-bottom-color: #fff;
}
.tab-content-area {
  padding: 20px;
  border: 1px solid #ccc;
  border-top: none;
}
```
This structure allows each tab's content to be a separate component, potentially managing its own state and `localStorage` persistence as well.

## 7. Front-End Development Techniques

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
        *   **Cons:** Can be harder to make responsive, communication between iframe and parent page is more complex (requires `postMessage`), can have SEO implications if not handled carefully, and may create a "double scrollbar" user experience if not sized correctly.
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

Vite is the recommended bundler for developing React applications due to its speed and modern feature set.

#### 7.3.1. External Pre-built React Applications

For complex React applications that are developed and maintained as separate projects (e.g., within a `DASHBOARDS` or `APPS` monorepo), the integration approach is to embed their static build output.

*   **Workflow:**
    1.  Develop and build the external React application in its own repository or directory structure using Vite (or CRA, etc.). This should produce a `dist` or `build` folder containing a static `index.html` and its assets (JS, CSS, images).
    2.  Manually (or via a custom script) copy the *contents* of this `dist` (or `build`) folder into a designated subdirectory within the `EXPRESS/` folder of the consuming project (e.g., `TEST_PROJECT/EXPRESS/my-react-app/`).
    3.  The main project's `build.sh` script does *not* attempt to build this external React app. It only includes the path to its `index.html` when generating the Table of Contents.
*   **Pros:** Decouples the build processes, allows independent development cycles, avoids dependency conflicts between the shell project and the complex React app.
*   **Cons:** Requires a manual or scripted step to copy the built assets.

#### 7.3.2. Internal React Applications (Project-Contained)

For React components or mini-applications that are integral to a specific project (like `TEST_PROJECT`) and should be self-contained within it.

*   **Structure:**
    *   Create a dedicated source directory within the project, e.g., `src_react/my_internal_app/`.
    *   This directory will house a complete Vite + React + TypeScript setup:
        *   `package.json` (for its specific dependencies like React, Vite, TypeScript, and related types like `@types/react`).
        *   `vite.config.ts` (configured with `base: './'` for relative asset paths, and other project-specific Vite settings).
        *   `tsconfig.json` (configured for a React TypeScript project, typically including settings like `"jsx": "react-jsx"`, `"esModuleInterop": true`, `"strict": true, target ECMAScript version, and `"isolatedModules": true`. Vite's default `npx create-vite my-react-app --template react-ts` command provides a good starting point for this file).
        *   `index.html` (Vite entry point).
        *   `src/main.tsx`, `src/App.tsx`, etc.
    *   This approach is similar to the "Create React App" (CRA) setup but within the context of this template system.
*   **Build Integration:**
    1.  The main project's `build.sh` script is modified to include steps to build this internal React app:
        *   `cd src_react/my_internal_app`
        *   `npm install` (if `node_modules` is missing or `package.json` updated)
        *   `npm run build` (which typically runs `tsc && vite build`)
        *   `cd ../..` (back to project root)
    2.  After the internal React app is built (e.g., to `src_react/my_internal_app/dist/`), the `build.sh` script copies the contents of this `dist` folder to the appropriate subdirectory in `EXPRESS/` (e.g., `EXPRESS/some_section/my_internal_app/`).
    3.  The Table of Contents generator then picks up the `index.html` from this `EXPRESS/` location.
*   **Pros:**
    *   The project is fully self-contained and standalone.
    *   The build process for the interactive component is part of the main project's build.
*   **Cons:**
    *   The main project's `build.sh` becomes slightly more complex.
    *   Build times for the main project might increase if the internal React app is large.
*   **Example Configuration (`vite.config.ts` for internal app):**
    ```typescript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import path from 'path';

    export default defineConfig({
      plugins: [react()],
      base: './', // Crucial for embedded content
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            entryFileNames: `assets/[name].js`,
            chunkFileNames: `assets/[name].js`,
            assetFileNames: `assets/[name].[ext]`
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      }
    });
    ```
*   **Example `build.sh` additions:**
    ```bash
    # --- Build Internal React App ---
    # Define these variables at the top of your build.sh or per app
    # INTERNAL_APP_NAME="my_internal_app" # A descriptive name
    # INTERNAL_APP_SRC_DIR="src_react/$INTERNAL_APP_NAME"
    # INTERNAL_APP_OUTPUT_DIR="EXPRESS/some_section/$INTERNAL_APP_NAME"

    echo "Building Internal React App: $INTERNAL_APP_NAME"
    echo "Source directory: $INTERNAL_APP_SRC_DIR"
    echo "Output directory: $INTERNAL_APP_OUTPUT_DIR"

    if [ ! -d "$INTERNAL_APP_SRC_DIR" ]; then
      echo "ERROR: Source directory $INTERNAL_APP_SRC_DIR does not exist. Skipping build for $INTERNAL_APP_NAME."
    else
      # Navigate to the app's directory safely
      pushd "$INTERNAL_APP_SRC_DIR" > /dev/null
      if [ $? -ne 0 ]; then
        echo "ERROR: Failed to navigate to $INTERNAL_APP_SRC_DIR. Skipping build for $INTERNAL_APP_NAME."
      else
        if [ ! -d "node_modules" ] || [ ! -f "package-lock.json" ] && [ -f "package.json" ]; then
          echo "node_modules not found or package-lock.json missing in $INTERNAL_APP_SRC_DIR. Running npm install..."
          npm install
          if [ $? -ne 0 ]; then
            echo "ERROR: npm install failed for $INTERNAL_APP_NAME. Skipping build."
            popd > /dev/null
            # Optionally exit the script: exit 1
            # Continue to next build step if desired
            # continue # if in a loop
          fi
        fi

        echo "Running build for $INTERNAL_APP_NAME..."
        npm run build
        if [ $? -ne 0 ]; then
          echo "ERROR: npm run build failed for $INTERNAL_APP_NAME."
          # Optionally exit the script: exit 1
        else
          echo "Build successful for $INTERNAL_APP_NAME."
          # Navigate back
          popd > /dev/null

          echo "Copying built internal app assets from $INTERNAL_APP_SRC_DIR/dist/ to $INTERNAL_APP_OUTPUT_DIR..."
          mkdir -p "$INTERNAL_APP_OUTPUT_DIR"
          # Ensure the dist directory exists before attempting to copy
          if [ -d "$INTERNAL_APP_SRC_DIR/dist" ]; then
            # Using rsync for more robust copying, or cp -R
            rsync -a --delete "$INTERNAL_APP_SRC_DIR/dist/" "$INTERNAL_APP_OUTPUT_DIR/"
            # cp -R "$INTERNAL_APP_SRC_DIR/dist/"* "$INTERNAL_APP_OUTPUT_DIR/" # Alternative
            echo "Copy complete for $INTERNAL_APP_NAME."
          else
            echo "ERROR: dist directory not found in $INTERNAL_APP_SRC_DIR after build. Copy skipped for $INTERNAL_APP_NAME."
          fi
        fi
        # If npm install or build failed and we didn't exit, ensure popd is called if pushd was successful
        if [ $? -ne 0 ] && [ -d "$INTERNAL_APP_SRC_DIR" ]; then # Check if still in pushd context
             if ! popd > /dev/null 2>&1; then # try to pop, suppress error if already popped
                : # do nothing if popd fails (e.g. already popped due to error handling)
             fi
        fi
      fi
    fi
    echo "--- Finished processing $INTERNAL_APP_NAME ---"
    ```

*   **Troubleshooting Internal React Apps:**
    *   **Blank Page After Build/Copy:**
        *   **`base` path in `vite.config.ts`:** Ensure `base: './'` is set. This is critical for assets to be referenced relatively from the copied `index.html`.
        *   **Copy Destination:** Verify the `build.sh` script copies the *contents* of the internal app's `dist/` folder (e.g., `dist/*` or `dist/.`) into the correct `EXPRESS/some_section/my_app/` directory, not the `dist` folder itself as a subdirectory.
        *   **Browser Console:** Check for 404 errors for JS/CSS files. The paths in the `index.html` (view source in browser) should be relative (e.g., `./assets/index-XXXX.js`).
    *   **Asset Loading Failures (404s for JS, CSS, Images):**
        *   Usually related to the `base` path or incorrect copy process (see above).
        *   If using image paths directly in CSS (e.g., `background-image: url(...)`), ensure these paths are correct relative to the final CSS file location or use absolute paths from the root if your server setup supports it (less common for this embedded scenario). Vite often handles this well for assets imported into JS/TSX.
    *   **Build Failures within the Internal App:**
        *   Run `npm install` and `npm run build` manually inside the `src_react/my_internal_app/` directory to see detailed error messages (TypeScript errors, dependency issues, Vite configuration problems).
        *   Ensure all necessary dependencies are listed in its `package.json`.
    *   **Styling Conflicts:**
        *   CSS from the internal React app might conflict with the main shell page's global styles, or vice-versa.
        *   **Solution 1 (CSS Modules):** Use CSS Modules within the React app for locally scoped class names. This is the most robust solution. (e.g., `import styles from './MyComponent.module.css'; <div className={styles.myClass}>...</div>`)
        *   **Solution 2 (Namespacing):** Manually prefix all CSS classes in the React app with a unique identifier (e.g., `.my-internal-app-button {}`).
        *   **Solution 3 (Iframe - if isolation is paramount):** If complete style isolation is needed and the app is complex enough, consider if it should be an "External Pre-built React Application" (Section 7.3.1) embedded via an iframe, though this adds complexity.
    *   **JavaScript Conflicts:** Less common if the React app is self-contained, but ensure global variables or polyfills from the main page don't interfere with the React app's environment.

## 9. Build and Deployment

### Local Development

For efficient local development:

1. **Local Development Server**:

```bash
# Using live-server (pure HTML/CSS/JS projects)
npx live-server

# OR for Vite projects
npm run dev
```

2. **Local Environment Setup**:
   * Create a `.env.local` file for development environment variables
   * Ensure data paths work in both development and production environments

3. **Cross-Browser Testing**:
   * Test locally on multiple browsers
   * Consider using tools like BrowserStack for broader testing
   * Ensure responsive design works at various screen sizes

### Build Process

The project's build process prepares the application for deployment:

1. **Basic Build Process**:

```bash
# Run the build script
./scripts/build.sh
```

2. **What the Build Does**:
   * Validates HTML files
   * Generates the ToC
   * Builds any internal React applications
   * Copies assets to the appropriate locations
   * Creates a distribution directory (`dist/`)

3. **Build Configuration**:
   * Adjust the build script ([`build.sh`](build.sh )) as needed for your project
   * Set the correct output directories for your deployment target

### Deployment Strategy: Main Branch First

For consistent and safe deployments:

1. **Branch Management**:
   * Development work happens in feature branches
   * Pull requests are merged to `main` after review
   * The `main` branch is always deployable

2. **Pre-Deployment Steps**:
   * Run build locally to verify
   * Address any warnings or errors
   * Run the QC script for quality checks

### Deployment to GitHub Pages

To deploy to GitHub Pages:

1.  **Repository Setting**:
    *   Enable GitHub Pages in repository settings
    *   Select the branch to deploy (typically `main` or `gh-pages`)
    *   Set the folder to `/` (root) or `/docs` depending on your setup

2.  **Configuration for `package.json` and `vite.config.ts`**:
    *   **`package.json` `homepage` field**: Set this to `https://[your-github-username].github.io/[repository-name]/[project-subdirectory-if-any]/`. For example, for a project `7A-PROJECTS-SITRUNA` within a larger `PAGES` repository deployed by user `mitchens84`, it would be `https://mitchens84.github.io/PAGES/7A-PROJECTS-SITRUNA/`.
    *   **`vite.config.ts` `base` option**: Set this to `/[repository-name]/[project-subdirectory-if-any]/`. Following the example above, it would be `/PAGES/7A-PROJECTS-SITRUNA/`. This ensures that Vite correctly resolves asset paths for the GitHub Pages deployment.

3.  **Environment Variables for Authentication**:
    *   Create a `.env.local` file in the root of your React project (e.g., `/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/.env.local`).
    *   Add the following, replacing `your_sha256_hash_here` with the actual SHA-256 hash of your chosen password:
        ```env
        VITE_APP_PASSWORD_HASH=your_sha256_hash_here
        VITE_APP_TITLE="Your Project Title"
        VITE_APP_BASE_URL="/[repository-name]/[project-subdirectory-if-any]/"
        ```
        For the example project `7A-PROJECTS-SITRUNA` in the `PAGES` repository:
        ```env
        VITE_APP_PASSWORD_HASH=a9a9db0ff98a70745295a46a194af53495d39a7a370e42001ff8005184997999 # Example hash for "7A-PROJECTS-SITRUNA"
        VITE_APP_TITLE="7A Projects Sitruna"
        VITE_APP_BASE_URL="/PAGES/7A-PROJECTS-SITRUNA/"
        ```
    *   **Important**: Ensure `.env.local` is added to your `.gitignore` file to prevent committing sensitive information.
    *   For production deployments, use GitHub Secrets to store `VITE_APP_PASSWORD_HASH` and configure your deployment workflow (e.g., GitHub Actions) to create a `.env.production.local` file with this secret during the build process.

4.  **Manual Deployment**:

```bash
# Build the project
./scripts/build.sh

# If using a separate gh-pages branch:
git checkout gh-pages
git rm -r .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

5.  **GitHub Pages Configuration**:
    *   Update `vite.config.ts` with correct base URL (typically the repository name)
    *   Ensure asset paths are relative or include the base URL

#### Deployment to GitHub Pages

Deploying to GitHub Pages allows you to host your static site directly from your GitHub repository. This guide focuses on the "Deploy from a branch" using a `/docs` folder method, which is versatile for projects containing both source code and build artifacts.

**Username for GitHub Pages URL:** `mitchens84` (This will be used in examples like `https://mitchens84.github.io/REPOSITORY_NAME/`)

#### 9.4.1. Repository Setup on GitHub

1.  **Create a GitHub Repository:**
    *   Go to [GitHub](https://github.com) and log in.
    *   Click the \"+\" icon in the top-right corner and select \"New repository.\"
    *   **Repository name:** Choose a descriptive name (e.g., `PAGES` if you intend to host multiple sub-projects, or a specific project name like `my-awesome-project`). For this guide, we'll assume the repository is named `PAGES`.
    *   **Description:** (Optional) Add a brief description.
    *   **Public/Private:** GitHub Pages for free accounts typically requires the repository to be **public**. Private repositories can use GitHub Pages with a GitHub Pro, GitHub Team, or GitHub Enterprise Cloud account.
    *   **Initialize this repository with:** You can choose to add a README, .gitignore, or license. If you're starting from an existing local project, you might skip this.
    *   Click \"Create repository.\"

#### 9.4.2. Local Git Setup

**If you have an existing local project (like `7A-PROJECTS-SITRUNA` within a `PAGES` parent folder):**

1.  **Navigate to your project's root directory** in the terminal (e.g., `/Users/mitchens/Local/PAGES/`).
2.  **Initialize Git (if not already a Git repository):**
    ```bash
    git init
    ```
3.  **Add the GitHub repository as a remote:**
    ```bash
    git remote add origin https://github.com/mitchens84/PAGES.git
    ```
    (Replace `mitchens84/PAGES.git` with your actual GitHub username and repository name.)
4.  **Stage and commit your initial files:**
    ```bash
    git add .
    git commit -m "Initial project setup for PAGES repository"
    ```
5.  **Rename the default branch to `main` (if it's `master`):**
    ```bash
    git branch -M main
    ```

**If you are cloning an empty repository you just created on GitHub:**

```bash
git clone https://github.com/mitchens84/PAGES.git
cd PAGES
```

#### 9.4.3. Building the Project

For projects that require a build step (e.g., React applications built with Vite, like `7A-PROJECTS-SITRUNA`), you need to generate the static production files.

1.  **Navigate to the specific project directory** that needs building (e.g., `/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/`).
2.  **Install dependencies (if you haven't already):**
    ```bash
    npm install
    ```
3.  **Run the build script** (usually defined in `package.json`):
    ```bash
    npm run build
    ```
    This command typically creates a `dist/` folder (or `build/`) in the project's directory (e.g., `/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/dist/`) containing the optimized static assets.

#### 9.4.4. Preparing Files for GitHub Pages (`docs` folder method)

GitHub Pages can serve your site from the `/docs` folder on your `main` branch. This method is clean as it keeps your source code separate from the deployment files at the root of the repository.

1.  **Create the `docs` folder at the root of your `PAGES` repository** (e.g., `/Users/mitchens/Local/PAGES/docs/`) if it doesn't exist.
    ```bash
    mkdir -p /Users/mitchens/Local/PAGES/docs
    ```
2.  **Create a subdirectory within `docs` for your specific project.** This allows you to host multiple projects from the same `PAGES` repository.
    For `7A-PROJECTS-SITRUNA`, the path would be `/Users/mitchens/Local/PAGES/docs/7A-PROJECTS-SITRUNA/`.
    ```bash
    mkdir -p /Users/mitchens/Local/PAGES/docs/7A-PROJECTS-SITRUNA
    ```
3.  **Copy the *contents* of your project\'s build output directory** (e.g., `/Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/dist/`) into the newly created project-specific subdirectory in `docs` (e.g., `/Users/mitchens/Local/PAGES/docs/7A-PROJECTS-SITRUNA/`).
    ```bash
    # Example for macOS/Linux:
    cp -R /Users/mitchens/Local/PAGES/7A-PROJECTS-SITRUNA/dist/* /Users/mitchens/Local/PAGES/docs/7A-PROJECTS-SITRUNA/
    
    # For Windows (using xcopy in Command Prompt):
    # xcopy /E /I /Y "C:\\path\\to\\PAGES\\7A-PROJECTS-SITRUNA\\dist" "C:\\path\\to\\PAGES\\docs\\7A-PROJECTS-SITRUNA"
    ```
    Ensure you copy the *contents* of `dist`, not the `dist` folder itself.

4.  **If your project is a simple static HTML site without a build step** (e.g., content directly in `EXPRESS/some-static-page/index.html`), you would copy these files directly into a corresponding subdirectory within `/docs`. For example:
    ```bash
    mkdir -p /Users/mitchens/Local/PAGES/docs/some-static-page
    cp /Users/mitchens/Local/PAGES/EXPRESS/some-static-page/* /Users/mitchens/Local/PAGES/docs/some-static-page/
    ```

#### 9.4.5. Committing and Pushing to GitHub

1.  **Navigate back to the root of your `PAGES` repository** (e.g., `/Users/mitchens/Local/PAGES/`).
2.  **Stage the changes** (this includes the new `docs` folder and its contents):
    ```bash
    git add docs/
    # If you also made changes to source files, add them too or use `git add .`
    git add 7A-PROJECTS-SITRUNA/ # Or other source directories if changed
    ```
3.  **Commit the changes:**
    ```bash
    git commit -m "Deploy 7A-PROJECTS-SITRUNA to GitHub Pages via /docs folder"
    ```
4.  **Push the changes to GitHub:**
    ```bash
    git push origin main
    ```

#### 9.4.6. Configuring GitHub Pages Settings

1.  Go to your `PAGES` repository on GitHub (`https://github.com/mitchens84/PAGES`).
2.  Click on the **Settings** tab.
3.  In the left sidebar, scroll down to the **Code and automation** section and click on **Pages**.
4.  Under **Build and deployment**:
    *   For **Source**, select **Deploy from a branch**.
    *   For **Branch**, ensure `main` is selected and choose `/docs` from the folder dropdown menu.
    *   Click **Save**.

5.  GitHub Pages will now build and deploy your site from the `/docs` folder. This might take a few minutes. You should see a message like "Your site is live at `https://mitchens84.github.io/PAGES/`" or "Your site is ready to be published at `https://mitchens84.github.io/PAGES/`".

#### 9.4.7. Verification

*   Once deployed, your project should be accessible at a URL like:
    `https://mitchens84.github.io/PAGES/7A-PROJECTS-SITRUNA/` (if you copied the contents of `dist` into `/docs/7A-PROJECTS-SITRUNA/`).
*   If you deployed a simple static page from `EXPRESS/some-static-page/` to `/docs/some-static-page/`, it would be at `https://mitchens84.github.io/PAGES/some-static-page/`.
*   Test all links and functionality.

**Important Considerations for Vite-based projects (like `7A-PROJECTS-SITRUNA`):**
*   **`vite.config.ts` (or `.js`):** Ensure the `base` property in your Vite configuration is set correctly for subdirectory deployment. If your site is at `https://mitchens84.github.io/PAGES/7A-PROJECTS-SITRUNA/`, the `base` should be `\'/PAGES/7A-PROJECTS-SITRUNA/\'`.\n    ```typescript\n    // vite.config.ts\n    import { defineConfig } from \'vite\';\n    import react from \'@vitejs/plugin-react\';\n\n    export default defineConfig({\n      plugins: [react()],\n      base: \'/PAGES/7A-PROJECTS-SITRUNA/\', // Crucial for GitHub Pages subdirectory\n      // ... other configurations\n    });\n    ```\n    You will need to rebuild (`npm run build`) and re-copy files to the `docs` folder if you change this.\n*   **`.env` variables:** For `VITE_APP_BASE_URL` in your `.env.local` or `.env.production`, it should also match this base path: `VITE_APP_BASE_URL=/PAGES/7A-PROJECTS-SITRUNA/`.\n\nBy following these steps, you can systematically deploy your projects to GitHub Pages using the `/docs` folder method, keeping your repository organized.

### Deployment to Netlify

Netlify offers a powerful and flexible platform for deploying static sites and front-end applications.

1. **Netlify Configuration File** (`netlify.toml`):

```toml
[build]
  publish = "dist"
  command = "./scripts/build.sh"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Manual Deployment**:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod
```

3. **Continuous Deployment**:
   * Connect your GitHub repository to Netlify
   * Configure build settings in the Netlify dashboard
   * Set environment variables for deployment

### Advanced Deployment: GitHub Actions

Automating deployment with GitHub Actions:

1. **Create a GitHub Actions Workflow File** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build
        run: ./scripts/build.sh
        env:
          SHARED_PASSWORD: ${{ secrets.SHARED_PASSWORD }}
          AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
        
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: dist
          clean: true
```

2. **Set Up Secrets**:
   * Add repository secrets in GitHub for sensitive values
   * Reference these secrets in the workflow file

3. **Monitor Deployments**:
   * Check the "Actions" tab in your repository
   * Debug failures in the workflow logs

### Pre-Deployment Checklist

Before final deployment, verify:

- [ ] All links work correctly
- [ ] Images load properly
- [ ] Storage system functions as expected
- [ ] Visualizations render correctly
- [ ] Content is responsive on various screen sizes
- [ ] Cross-browser compatibility is confirmed
- [ ] Performance is acceptable (run Lighthouse or WebPageTest)
- [ ] Environment variables are properly set
- [ ] Login/authentication works correctly
- [ ] No development-only code is present

## 10. Troubleshooting Guide

### Storage System Issues

- **Symptoms**: Data not persisting, unexpected values in storage.
- **Solutions**:
  - Ensure `auto-storage.js` is correctly included in your HTML.
  - Check browser console for errors related to storage access.
  - Verify that your data keys are consistent and correctly spelled.
  - Use the "Inspect Current Storage" feature to debug stored values.

### GitHub Pages Deployment Issues

- **Symptoms**: Site not updating, 404 errors, broken links.
- **Solutions**:
  - Ensure you have committed and pushed all changes to the `main` or `gh-pages` branch.
  - Check the repository settings to confirm the correct branch is selected for GitHub Pages.
  - Verify that the `base` option in `vite.config.ts` is correctly set (typically to the repository name).
  - Inspect the generated HTML for correct asset paths.

### Netlify Deployment Issues

- **Symptoms**: Build errors, site not deploying, broken links.
- **Solutions**:
  - Check the build logs in the Netlify dashboard for error messages.
  - Ensure all environment variables are set in the Netlify UI.
  - Verify that the `publish` directory in `netlify.toml` is correct.
  - Check for any redirects or rewrites that may be misconfigured.

### Embedded Visualizations Issues

- **Symptoms**: Visualizations not displaying, errors in the console.
- **Solutions**:
  - Ensure the data file is correctly loaded and accessible.
  - Check the console for CORS errors or file not found errors.
  - Verify that the visualization code is correct and matches the data structure.
  - For D3.js visualizations, ensure that the SVG container is correctly sized and appended to the DOM.

### Common Build Issues

- **Symptoms**: Build fails, warnings during build.
- **Solutions**:
  - Read the error messages carefully; they often indicate the problem.
  - Ensure all dependencies are correctly installed and up to date.
  - Check for syntax errors or missing files.
  - Run the QC script to identify potential issues.

### Runtime Errors

- **Symptoms**: Errors occurring when using the application, features not working.
- **Solutions**:
  - Check the browser console for error messages and stack traces.
  - Use `try...catch` blocks to gracefully handle errors in your code.
  - Debug using breakpoints or `console.log` statements to identify the source of the error.

### Debugging Techniques

- Use browser developer tools (F12) to inspect elements, debug JavaScript, and monitor network requests.
- Add `debugger;` statements in your JavaScript code to trigger breakpoints.
- Use `console.log` generously to track the flow of data and identify where things go wrong.
- For network-related issues, check the "Network" tab in developer tools to inspect requests and responses.

## 11. Instructions for AI LLM

### General Principles

When working with this repository as an AI assistant, follow these general principles:

1. **Repository Understanding**:
   * Begin by understanding the repository structure by referring to this guide
   * Note the key file paths and components mentioned in the "Essential File Paths" section
   * Identify which parts of the repository are template/boilerplate code and which are project-specific

2. **Project Brief First**:
   * Always review the `PROJECT_BRIEF.md` to understand the specific requirements
   * Use the project brief to determine deployment destinations, data sources, and special requirements
   * Refer back to the project brief when making decisions about architecture or implementation

3. **Consistent Standards**:
   * Follow the established patterns for storage, component structure, and data fetching
   * Maintain consistent file naming, directory structure, and code style
   * Use the tools and libraries already included in the project

4. **Documentation**:
   * Update documentation when adding new features or patterns
   * Add comments for complex logic
   * Ensure the Table of Contents reflects new content

### Autonomous Repository Setup Protocol

When setting up a new repository based on this template, follow this protocol:

1. **Initial Setup**:
   * Clone or download the base template repository
   * Remove template-specific files and placeholder content
   * Run `npm install` to install dependencies

2. **Project Customization**:
   * Create a `PROJECT_BRIEF.md` based on the template
   * Update the [`README.md`](README.md ) with project-specific information
   * Configure environment variables in `.env.example`
   * Set up GitHub Pages or Netlify deployment settings

3. **Content Structure**:
   * Create the initial content structure in `/EXPRESS/`
   * Run the [`add-content.js`](add-content.js ) script to generate section folders
   * Update assets and components as needed

4. **Data Integration**:
   * Configure Airtable data sources based on the project brief
   * Update the Airtable script parameters for the project
   * Verify correct data output location

5. **Validation and Testing**:
   * Run the build script locally to verify setup
   * Check for any template references that need updating
   * Test the storage system with sample content
   * Verify that the ToC is generated correctly

## 12. References

### Data Visualization Guide

For comprehensive guidance on creating effective data visualizations:

* **"The Visual Display of Quantitative Information"** by Edward Tufte
* **D3.js Documentation**: [https://d3js.org/](https://d3js.org/)
* **Observable**: [https://observablehq.com/](https://observablehq.com/) - Examples and tutorials
* **Visualization Types Reference**: [https://datavizcatalogue.com/](https://datavizcatalogue.com/)
* **Color Tools**:
  * ColorBrewer: [https://colorbrewer2.org/](https://colorbrewer2.org/)
  * Adobe Color: [https://color.adobe.com/](https://color.adobe.com/)

### General AI Interaction Guidelines

For AI assistants working with this codebase:

* **Prefer Convention Over Configuration**: Follow the established patterns in the codebase
* **Incremental Changes**: Suggest smaller, iterative changes rather than complete rewrites
* **Documentation First**: Update documentation alongside code changes
* **Error Handling**: Always include robust error handling in recommended code
* **Accessibility**: Consider accessibility in all UI recommendations

### Essential File Paths

Key files and directories to be aware of:

* **`/scripts/build.sh`**: Main build script
* **`/scripts/generate-toc.js`**: Table of Contents generator
* **`/scripts/add-content.js`**: Content addition script
* **`/EXPRESS/`**: Main content directory
* **`/src/auto-storage.js`**: Storage system
* **`/src/storage-manager.js`**: Core storage engine
* **`/index.html`**: Main entry point
* **`/.github/workflows/deploy-gh-pages.yml`**: GitHub Actions workflow for deployment
* **`/netlify.toml`**: Netlify configuration

### External Resources

Additional references and resources:

* **GitHub Pages Documentation**: [https://docs.github.com/en/pages](https://docs.github.com/en/pages)
* **Netlify Documentation**: [https://docs.netlify.com/](https://docs.netlify.com/)
* **Airtable API Documentation**: [https://airtable.com/developers/web/api/introduction](https://airtable.com/developers/web/api/introduction)
* **Vite Documentation**: [https://vitejs.dev/guide/](https://vitejs.dev/guide/)
* **React Documentation**: [https://react.dev/](https://react.dev/)
* **Three.js Documentation**: [https://threejs.org/docs/](https://threejs.org/docs/)
* **D3.js Documentation**: [https://d3js.org/](https://d3js.org/)
* **Web Accessibility Standards**: [https://www.w3.org/WAI/standards-guidelines/](https://www.w3.org/WAI/standards-guidelines/)
