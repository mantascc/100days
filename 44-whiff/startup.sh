#!/bin/bash

echo "Starting Whiff servers..."

# Start WebSocket server in background
cd canvas-app && npm run ws > /dev/null 2>&1 &
WS_PID=$!
echo "✓ WebSocket server started (port 8081) - PID: $WS_PID"

# Start Vite dev server in background
npm run dev > /dev/null 2>&1 &
VITE_PID=$!
echo "✓ Vite dev server started (port 5173) - PID: $VITE_PID"

cd ..
echo ""
echo "Whiff is ready!"
echo "Open http://localhost:5173 in your browser"
echo ""
echo "To stop servers, run: ./shutdown.sh"
