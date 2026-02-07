#!/bin/bash

# CLI Material Palette - Local Server Starter
# This script starts a simple HTTP server to view the interactive guide

echo "🚀 CLI Material Palette - Interactive Guide"
echo "==========================================="
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✓ Starting server with Python 3..."
    echo "📡 Server running at: http://localhost:8000"
    echo "🌐 Open your browser to: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
# Check if Python 2 is available
elif command -v python &> /dev/null; then
    echo "✓ Starting server with Python 2..."
    echo "📡 Server running at: http://localhost:8000"
    echo "🌐 Open your browser to: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
# Check if Node.js is available
elif command -v node &> /dev/null; then
    echo "✓ Starting server with Node.js..."
    echo "📡 Installing http-server (if needed)..."
    npx http-server -p 8000
else
    echo "❌ Error: No suitable HTTP server found"
    echo ""
    echo "Please install one of the following:"
    echo "  • Python 3: https://python.org"
    echo "  • Node.js: https://nodejs.org"
    echo ""
    echo "Or open index.html directly in your browser"
    exit 1
fi
