#!/bin/bash

# Build script for the Career Proposal React component

# Navigate to the career proposal directory
cd "$(dirname "$0")/../src_react/career-proposal" || exit

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to build this component."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm to build this component."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the component
echo "Building the React component..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "The component has been built to: /EXPRESS/career/full-proposal-component/"
    echo "You can now access it at: http://localhost:8000/EXPRESS/career/full-proposal-component/"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
