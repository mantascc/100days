import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Create HTTP server for form submissions
const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const submission = JSON.parse(body);
        const { formId, data: formData, outputFile } = submission;

        // Add timestamp to submission
        const entry = {
          ...formData,
          timestamp: new Date().toISOString(),
          submittedAt: new Date().toLocaleString()
        };

        // Resolve file path (relative to project root)
        const filepath = resolve('..', outputFile);

        // Read existing data or create new array
        let existingData = [];
        if (existsSync(filepath)) {
          const content = readFileSync(filepath, 'utf-8');
          existingData = JSON.parse(content);
        }

        // Append new entry
        existingData.push(entry);

        // Write back to file
        writeFileSync(filepath, JSON.stringify(existingData, null, 2));

        console.log(`✓ Form submission saved to ${outputFile}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Feedback saved successfully!'
        }));
      } catch (error) {
        console.error('Error saving form submission:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Failed to save feedback'
        }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8081);
console.log('HTTP server running on http://localhost:8081');

// Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });
console.log('WebSocket server running on ws://localhost:8081');

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = message.toString();
    console.log('Received:', data);

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send welcome message
  ws.send(JSON.stringify({ type: 'connected', message: 'Canvas WebSocket ready' }));
});
