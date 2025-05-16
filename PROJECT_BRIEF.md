# Project Brief: Test Project

**Date Created:** 2025-05-16
**Version:** 1.0.0
**Primary Contact/Owner:** AI Test Lead
**Project Directory:** `/Users/mitchens/Local/PAGES/TEST_PROJECT/`

---

## 1. Project Overview

**Brief Description:**
*   This project serves as a comprehensive test case for the front-end page development system. It will involve setting up the template, creating sample content, testing automation scripts, and verifying the storage system and deployment configurations.

---

## 2. Goals and Objectives

*   **Main Aims:**
    *   Validate the setup process outlined in `COMPREHENSIVE_FRONTEND_GUIDE.md`.
    *   Test all automation scripts (`generate-toc.js`, `add-content.js`, `setup-storage.js`, `run-qc.js`, `build.sh`).
    *   Verify the functionality of the storage system (`storage-manager.js`, `auto-storage.js`, `simple-storage.js`) using `test.html`.
    *   Confirm data pipeline integration with `airtable_workflow_extractor.py` (conceptually, using dummy data if real Airtable not set up).
    *   Ensure deployment configurations for GitHub Pages are correctly generated and documented.
*   **Target Audience:**
    *   Developers and AI assistants who will use this template system.
*   **Key Information/Functionality to Provide:**
    *   A simple multi-section static site.
    *   Demonstration of persistent storage.

---

## 3. Content Structure & Key Features

*   **Main Content Sections (Planned `EXPRESS/` subdirectories):**
    *   `introduction` (General welcome and overview)
    *   `features` (Details about specific test features)
    *   `results` (Placeholder for test outcomes)
*   **Specific Interactive Elements or Visualizations:**
    *   Standard form elements in `test.html` for storage testing.
    *   Collapsible sections.
*   **Unique UI/UX Considerations:**
    *   None for this test project; standard template UI will be used.

---

## 4. Data Sources (if applicable)

### Airtable Integration

*   **Airtable Data Source CSV:** `/Users/mitchens/Library/CloudStorage/GoogleDrive-bean.vegandog@gmail.com/My Drive/INDEX_AIRTABLE.csv`
*   **Environment Variable for API Key:** `AIRTABLE_API_KEY` (Value sourced from `/Users/mitchens/Local/AGENTS/.env`)
*   **Environment Variable for Base ID:** `AIRTABLE_BASE_ID` (To be extracted or defined, e.g., `appTestBaseId`)
*   **Environment Variable for Table ID:** `AIRTABLE_TABLE_NAME` (To be extracted or defined, e.g., `TestTable`)
*   **Airtable View ID (if used):** N/A for this test (or specify if a dummy view is used)
*   **Expected Output Data File:** `data/test_project_workflow_data.json`
    *   *Note: `airtable_workflow_extractor.py` might need adjustment if not using default `workflow_data.json` or if it needs to parse the CSV.*

### Other Data Sources

*   None for this test project.

---

## 5. Design and Branding

*   **Color Scheme:** Using template defaults.
*   **Fonts:** Using template defaults.
*   **Logo:** N/A.
*   **Style Guide/Branding Assets Link:** N/A.

---

## 6. Deployment Configuration

### GitHub Pages

*   **GitHub Account:** `mitchens84`
*   **Target GitHub Repository Name:** `TestProjectRepo` (Example, can be auto-generated or specified)
*   **Target GitHub Repository URL:** `https://github.com/mitchens84/TestProjectRepo`
*   **`homepage` value for `package.json`:** `https://mitchens84.github.io/TestProjectRepo/`
*   **Base URL for Vite (`vite.config.js`):** `/TestProjectRepo/`

### Netlify

*   **Target Netlify Site Name:** N/A for this test.
*   **Build Command (in `netlify.toml`):** `bash build.sh`
*   **Publish Directory (in `netlify.toml`):** `dist/`

---

## 7. Custom Configurations & Deviations

*   **Project-Specific Environment Variables (beyond Airtable):**
    *   None planned.
*   **Modifications to Standard Scripts or Template Files:**
    *   `airtable_workflow_extractor.py`: May need `OUTPUT_FILE` variable changed to `data/test_project_workflow_data.json`. Will need to be adapted to read from the specified CSV file instead of direct Airtable API calls if that's the new requirement.
    *   `build.sh`: Paths will need adjustment as it's now at the project root, not parent.
*   **Specific QC Checks to Emphasize:**
    *   All script executions.
    *   Storage persistence in `test.html`.
    *   Correct ToC generation.

---

## 8. Notes & To-Do

*   [ ] Confirm if `airtable_workflow_extractor.py` should be modified to parse the provided CSV (`/Users/mitchens/Library/CloudStorage/GoogleDrive-bean.vegandog@gmail.com/My Drive/INDEX_AIRTABLE.csv`) or if it should still attempt to use the Airtable API (in which case, Base ID and Table Name from the CSV need to be identified and used).
*   [ ] Verify all paths in copied scripts are correct for the new project structure.
*   [ ] Update `.env` file with the correct `AIRTABLE_API_KEY` from `/Users/mitchens/Local/AGENTS/.env`.

