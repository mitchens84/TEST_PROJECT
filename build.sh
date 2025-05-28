#!/bin/zsh

# build.sh - Orchestrates the project build process

echo "Starting build process..."

# --- Configuration ---
PROJECT_ROOT_NODE_MODULES_DIR="node_modules"
PROJECT_ROOT_PACKAGE_LOCK="package.json"
PROPOSAL_APP_DIR="src_react/proposal_app"
PROPOSAL_APP_OUTPUT_DIR="EXPRESS/career/full-proposal-component"

# --- 1. Build Internal React Proposal App ---
echo "Building Internal React Proposal App..."

echo "Forcefully removing old node_modules in $PROPOSAL_APP_DIR to ensure fresh dependencies..."
(cd "$PROPOSAL_APP_DIR" && rm -rf node_modules)

echo "Running npm install in $PROPOSAL_APP_DIR..."
(cd "$PROPOSAL_APP_DIR" && npm install)
if [ $? -ne 0 ]; then
  echo "Error: npm install failed for $PROPOSAL_APP_DIR. Aborting build."
  exit 1
fi

echo "Running npm run build for $PROPOSAL_APP_DIR..."
(cd "$PROPOSAL_APP_DIR" && npm run build)
if [ $? -ne 0 ]; then
  echo "Error: npm run build failed for $PROPOSAL_APP_DIR. Aborting build."
  exit 1
fi

echo "Clearing old proposal app assets from $PROPOSAL_APP_OUTPUT_DIR..."
rm -rf "$PROPOSAL_APP_OUTPUT_DIR"/*
mkdir -p "$PROPOSAL_APP_OUTPUT_DIR" # Ensure directory exists

echo "Copying built proposal app assets to $PROPOSAL_APP_OUTPUT_DIR..."
cp -R "$PROPOSAL_APP_DIR/dist/"* "$PROPOSAL_APP_OUTPUT_DIR/"
if [ $? -ne 0 ]; then
  echo "Error: Failed to copy built assets from $PROPOSAL_APP_DIR/dist. Aborting build."
  exit 1
fi
echo "Internal React Proposal App built and assets copied successfully."


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
# Correctly specify output for TEST_PROJECT
node ../generate-toc.js --expressDir ./EXPRESS --htmlOutputFile ./toc.html --htmlBaseDir . --all
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

# --- 5. Placeholder for Vite/React App Build ---
# If you have React applications managed by Vite, ensure package.json at the root
# has the necessary build scripts.
# For example, if the main project is a Vite project:
# echo "Building Vite application (if configured in root package.json)..."
# npm run build # This would call the build script defined in the root package.json
# if [ $? -ne 0 ]; then
#   echo "Error: Vite build failed. Aborting build."
#   exit 1
# fi
# echo "Vite application built successfully."

# Or for multiple Vite apps, loop through them or call specific build scripts.

echo "Build process completed successfully."
exit 0
