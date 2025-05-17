#!/bin/zsh

# build.sh - Orchestrates the project build process

echo "Starting build process..."

# --- Configuration ---
NODE_MODULES_DIR="node_modules" # New path: node_modules is at the project root
PACKAGE_LOCK="package.json" # New path: package.json is at the project root

# --- 1. Install/Update Dependencies (if needed) ---
# Check if node_modules exists and if package.json is newer than a marker file in node_modules
# This is a simple way to check if npm install might be needed.
# A more robust check might involve comparing package.json/package-lock.json modification times.
NEEDS_NPM_INSTALL=false
if [ ! -d "$NODE_MODULES_DIR" ]; then
  NEEDS_NPM_INSTALL=true
else
  # Create a marker file to track the last npm install relative to package.json changes
  # This is a simplified check. For more accuracy, compare modification dates of
  # package.json and a marker file updated after npm install.
  if [ "$PACKAGE_LOCK" -nt "$NODE_MODULES_DIR" ]; then
    NEEDS_NPM_INSTALL=true
  fi
fi

if [ "$NEEDS_NPM_INSTALL" = true ]; then
  echo "Changes detected in package.json or node_modules missing. Running npm install in project root..."
  npm install # New command: run npm install in the current directory (project root)
  if [ $? -ne 0 ]; then
    echo "Error: npm install failed. Aborting build."
    exit 1
  fi
else
  echo "Dependencies appear up to date. Skipping npm install."
fi

# --- 2. Generate Table of Contents ---
echo "Generating Table of Contents..."
# Correctly specify output for TEST_PROJECT
node ../generate-toc.js --expressDir ./EXPRESS --htmlOutputFile ./toc.html --htmlBaseDir . --all
if [ $? -ne 0 ]; then
  echo "Error: Failed to generate Table of Contents. Aborting build."
  exit 1
fi
echo "Table of Contents generated successfully."

# --- 3. Run Quality Checks ---
echo "Running Quality Checks..."
node run-qc.js
if [ $? -ne 0 ]; then
  echo "Error: Quality Checks failed. Please review the errors. Aborting build."
  # Consider making QC failure non-fatal for some CI/CD workflows by removing exit 1
  exit 1
fi
echo "Quality Checks passed."

# --- 4. Placeholder for Vite/React App Build ---
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
