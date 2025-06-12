#!/bin/zsh

# build.sh - Orchestrates the project build process

echo "Starting build process..."

# --- Configuration ---
PROJECT_ROOT_NODE_MODULES_DIR="node_modules"
PROJECT_ROOT_PACKAGE_LOCK="package.json"
PROPOSAL_HELPER_APP_DIR="src_react/proposal_app"
PROPOSAL_HELPER_APP_OUTPUT_DIR="EXPRESS/proposal_helper_app_component"
CAREER_PROPOSAL_APP_DIR="src_react/career-proposal"
CAREER_PROPOSAL_APP_OUTPUT_DIR="EXPRESS/career/full-proposal-component"

# --- 1. Build Proposal Helper App ---
echo "Building Proposal Helper App..."

echo "Forcefully removing old node_modules in $PROPOSAL_HELPER_APP_DIR to ensure fresh dependencies..."
(cd "$PROPOSAL_HELPER_APP_DIR" && rm -rf node_modules)

echo "Running npm install in $PROPOSAL_HELPER_APP_DIR..."
(cd "$PROPOSAL_HELPER_APP_DIR" && npm install)
if [ $? -ne 0 ]; then
  echo "Error: npm install failed for $PROPOSAL_HELPER_APP_DIR. Aborting build."
  exit 1
fi

echo "Running npm run build for $PROPOSAL_HELPER_APP_DIR..."
(cd "$PROPOSAL_HELPER_APP_DIR" && npm run build)
if [ $? -ne 0 ]; then
  echo "Error: npm run build failed for $PROPOSAL_HELPER_APP_DIR. Aborting build."
  exit 1
fi

echo "Clearing old proposal helper app assets from $PROPOSAL_HELPER_APP_OUTPUT_DIR..."
rm -rf "$PROPOSAL_HELPER_APP_OUTPUT_DIR"/*
mkdir -p "$PROPOSAL_HELPER_APP_OUTPUT_DIR" # Ensure directory exists

echo "Copying built proposal helper app assets to $PROPOSAL_HELPER_APP_OUTPUT_DIR..."
cp -R "$PROPOSAL_HELPER_APP_DIR/dist/"* "$PROPOSAL_HELPER_APP_OUTPUT_DIR/"
if [ $? -ne 0 ]; then
  echo "Error: Failed to copy built assets from $PROPOSAL_HELPER_APP_DIR/dist. Aborting build."
  exit 1
fi
echo "Proposal Helper App built and assets copied successfully."

# --- Build Career Proposal App ---
echo "Building Career Proposal App..."

echo "Forcefully removing old node_modules in $CAREER_PROPOSAL_APP_DIR..."
(cd "$CAREER_PROPOSAL_APP_DIR" && rm -rf node_modules)

echo "Running npm install in $CAREER_PROPOSAL_APP_DIR..."
(cd "$CAREER_PROPOSAL_APP_DIR" && npm install)
if [ $? -ne 0 ]; then
  echo "Error: npm install failed for $CAREER_PROPOSAL_APP_DIR. Aborting build."
  exit 1
fi

echo "Running npm run build for $CAREER_PROPOSAL_APP_DIR..."
(cd "$CAREER_PROPOSAL_APP_DIR" && npm run build)
if [ $? -ne 0 ]; then
  echo "Error: npm run build failed for $CAREER_PROPOSAL_APP_DIR. Aborting build."
  exit 1
fi

echo "Clearing old career proposal app assets from $CAREER_PROPOSAL_APP_OUTPUT_DIR..."
rm -rf "$CAREER_PROPOSAL_APP_OUTPUT_DIR"/*
mkdir -p "$CAREER_PROPOSAL_APP_OUTPUT_DIR" # Ensure directory exists

# Vite has already placed the output in $CAREER_PROPOSAL_APP_OUTPUT_DIR
# So, no copy is needed here.

echo "Career Proposal App built successfully."

# --- 2. Install/Update Dependencies for TEST_PROJECT shell (if needed) ---
echo "Checking dependencies for TEST_PROJECT shell..."
NEEDS_NPM_INSTALL=false
if [ ! -d "$PROJECT_ROOT_NODE_MODULES_DIR" ]; then
  NEEDS_NPM_INSTALL=true
else
  if [ "$PROJECT_ROOT_PACKAGE_LOCK" -nt "$PROJECT_ROOT_NODE_MODULES_DIR" ]; then
    NEEDS_NPM_INSTALL=true
  fi
fi

if [ "$NEEDS_NPM_INSTALL" = true ]; then
  echo "Changes detected in project root package.json or node_modules missing. Running npm install in project root..."
  npm install # Installs dependencies for the main TEST_PROJECT shell, if any
  if [ $? -ne 0 ]; then
    echo "Error: npm install failed for project root. Aborting build."
    exit 1
  fi
else
  echo "Project root dependencies appear up to date. Skipping npm install."
fi

# --- 3. Generate Table of Contents ---
echo "Generating Table of Contents..."
# Use npm run to execute the script defined in package.json
# Pass arguments to the script after --
npm run generate-toc -- --expressDir ./EXPRESS --htmlOutputFile ./toc.html --htmlBaseDir . --all
if [ $? -ne 0 ]; then
  echo "Error: Failed to generate Table of Contents. Aborting build."
  exit 1
fi
echo "Table of Contents generated successfully."

# --- 4. Run Quality Checks ---
echo "Running Quality Checks..."
node run-qc.js
if [ $? -ne 0 ]; then
  echo "Error: Quality Checks failed. Please review the errors. Aborting build."
  # Consider making QC failure non-fatal for some CI/CD workflows by removing exit 1
  exit 1
fi
echo "Quality Checks passed."

echo "--- 5. Consolidating into 'dist' directory for Netlify deployment ---"

# Clean and create the deployment directory
rm -rf dist
mkdir -p dist

# Copy root-level static assets
echo "Copying root-level static assets to dist/..."
cp index.html dist/
cp CNAME dist/
cp favicon.ico dist/
cp favicon.svg dist/
cp toc.html dist/ # Ensure toc.html is generated before this step

# Copy main CSS
echo "Copying global styles to dist/assets/styles/..."
mkdir -p dist/assets/styles/ # Ensure assets/styles subdirectories exist
cp assets/styles/main.css dist/assets/styles/

# Copy the entire EXPRESS directory which contains all built components
echo "Copying EXPRESS directory contents to dist/EXPRESS/..."
cp -R EXPRESS dist/EXPRESS/
if [ $? -ne 0 ]; then
  echo "Error: Failed to copy EXPRESS directory to dist. Aborting build."
  exit 1
fi

echo "All deployable assets consolidated into 'dist' directory."
echo "Build process completed successfully."
exit 0
