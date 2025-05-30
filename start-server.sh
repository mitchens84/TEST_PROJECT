#!/bin/bash

# Local Development Server Launcher for TEST_PROJECT
# This script starts a local HTTP server to avoid CORS issues with ES modules

PORT=${1:-8000}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting TEST_PROJECT local development server..."
echo "📁 Project directory: $SCRIPT_DIR"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3"
    cd "$SCRIPT_DIR"
    python3 local-server.py --port $PORT
elif command -v python &> /dev/null; then
    # Check if it's Python 3
    if python -c 'import sys; exit(0 if sys.version_info >= (3, 0) else 1)' 2>/dev/null; then
        echo "🐍 Using Python (version 3)"
        cd "$SCRIPT_DIR"
        python local-server.py --port $PORT
    else
        echo "❌ Python 3 is required but only Python 2 is available"
        exit 1
    fi
elif command -v node &> /dev/null; then
    echo "📦 Python not found, trying Node.js http-server..."
    if command -v npx &> /dev/null; then
        cd "$SCRIPT_DIR"
        echo "🌐 Starting server on http://localhost:$PORT"
        npx http-server -p $PORT -c-1 --cors
    else
        echo "❌ Neither Python 3 nor npx (Node.js) found"
        echo "Please install Python 3 or Node.js to run the local server"
        exit 1
    fi
else
    echo "❌ No suitable server found"
    echo "Please install either:"
    echo "  - Python 3: https://python.org"
    echo "  - Node.js: https://nodejs.org"
    exit 1
fi
