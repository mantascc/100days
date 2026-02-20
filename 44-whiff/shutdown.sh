#!/bin/bash

echo "Shutting down Whiff servers..."

# Kill WebSocket server (port 8081)
WS_PID=$(lsof -ti :8081)
if [ ! -z "$WS_PID" ]; then
  kill $WS_PID
  echo "✓ WebSocket server stopped (port 8081)"
else
  echo "○ WebSocket server not running"
fi

# Kill Vite dev server (port 5173)
VITE_PID=$(lsof -ti :5173)
if [ ! -z "$VITE_PID" ]; then
  kill $VITE_PID
  echo "✓ Vite dev server stopped (port 5173)"
else
  echo "○ Vite dev server not running"
fi

echo "Shutdown complete."
