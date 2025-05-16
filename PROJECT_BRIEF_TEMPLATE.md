# Project Brief: [Project Title]

**Date Created:** YYYY-MM-DD
**Version:** 1.0.0
**Primary Contact/Owner:** [Name/Email]

---

## 1. Project Overview

**Brief Description:**
*   [A short summary of the project's purpose and what it aims to achieve.]

---

## 2. Goals and Objectives

*   **Main Aims:**
    *   [Goal 1]
    *   [Goal 2]
*   **Target Audience:**
    *   [Describe the primary users of this project.]
*   **Key Information/Functionality to Provide:**
    *   [Feature/Information 1]
    *   [Feature/Information 2]

---

## 3. Content Structure & Key Features

*   **Main Content Sections (Planned `EXPRESS/` subdirectories):**
    *   `section-name-1` (e.g., Introduction, Overview)
    *   `section-name-2` (e.g., Data Analysis, Visualization Gallery)
    *   `section-name-3` (e.g., Methodology, Resources)
*   **Specific Interactive Elements or Visualizations:**
    *   [List any D3.js charts, React components, complex forms, etc.]
*   **Unique UI/UX Considerations:**
    *   [Any special navigation, accessibility needs, or design elements.]

---

## 4. Data Sources (if applicable)

### Airtable Integration

*   **Environment Variable for API Key:** `PROJECT_AIRTABLE_API_KEY` (Store actual key in `.env`)
*   **Environment Variable for Base ID:** `PROJECT_AIRTABLE_BASE_ID` (Store actual ID in `.env`)
*   **Environment Variable for Table ID:** `PROJECT_AIRTABLE_TABLE_ID` (Store actual ID in `.env`)
*   **Airtable View ID (if used):** [Specify View ID or N/A]
*   **Expected Output Data File:** `data/workflow_data.json` (or specify custom path/name)
    *   *Note: Ensure `airtable_workflow_extractor.py` is configured or modified if output path/name is custom.*

### Other Data Sources

*   [Describe any other data inputs, e.g., static JSON files, other APIs.]

---

## 5. Design and Branding

*   **Color Scheme:** [Primary, Secondary, Accent colors or N/A if using template defaults]
*   **Fonts:** [Specify fonts or N/A]
*   **Logo:** [Path to logo asset or N/A]
*   **Style Guide/Branding Assets Link:** [Link or N/A]

---

## 6. Deployment Configuration

### GitHub Pages

*   **Target GitHub Repository URL:** `https://github.com/[yourusername]/[your-repo-name]`
*   **`homepage` value for `package.json`:** `https://[yourusername].github.io/[your-repo-name]/`
*   **Base URL for Vite (`vite.config.js`):** `/[your-repo-name]/` (Ensure this matches the `homepage` path)

### Netlify

*   **Target Netlify Site Name:** [e.g., `my-awesome-project.netlify.app` or N/A]
*   **Build Command (in `netlify.toml`):** `bash build.sh` (Verify this is suitable)
*   **Publish Directory (in `netlify.toml`):** `dist/` (Verify this is suitable)

---

## 7. Custom Configurations & Deviations

*   **Project-Specific Environment Variables (beyond Airtable):**
    *   [Variable Name 1]: [Purpose]
*   **Modifications to Standard Scripts or Template Files:**
    *   [File Name]: [Brief description of modification]
*   **Specific QC Checks to Emphasize:**
    *   [e.g., "Ensure all external links in 'Resources' section are valid."]

---

## 8. Notes & To-Do

*   [Any other relevant project information, open questions, or tasks.]
*   [ ] Task 1
*   [ ] Task 2

