#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Send data via WebSocket, passing all arguments
cd "$SCRIPT_DIR/canvas-app" && node send-to-canvas.js "$@"
