#!/bin/bash

# Script to build all React components for deployment

# Set the base directory to the script location
BASE_DIR="$(dirname "$0")/.."
cd "$BASE_DIR" || exit

# Create necessary directories
mkdir -p ./build_logs
mkdir -p ./EXPRESS/career/full-proposal-component

# Create a log file for build output
BUILD_LOG="./build_logs/build-$(date +%Y%m%d-%H%M%S).log"
touch "$BUILD_LOG"

echo "Building all React components..." | tee -a "$BUILD_LOG"

# Build the Career Proposal React component
echo "Building Career Proposal component..." | tee -a "$BUILD_LOG"

# Navigate to the career proposal directory
cd "./src_react/career-proposal" || {
  echo "❌ Could not find career-proposal directory" | tee -a "$BUILD_LOG"
  exit 1
}

# Install dependencies
echo "Installing dependencies for Career Proposal..." | tee -a "$BUILD_LOG"
npm install >> "$BUILD_LOG" 2>&1

# Build the component
echo "Running build for Career Proposal..." | tee -a "$BUILD_LOG"
npm run build >> "$BUILD_LOG" 2>&1

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Career Proposal built successfully" | tee -a "$BUILD_LOG"
else
  echo "❌ Career Proposal build failed, check logs at $BUILD_LOG" | tee -a "$BUILD_LOG"
  exit 1
fi

# Return to base directory
cd "$BASE_DIR" || exit

# -- Add more component builds here as needed --

echo "All components built successfully!" | tee -a "$BUILD_LOG"
exit 0
