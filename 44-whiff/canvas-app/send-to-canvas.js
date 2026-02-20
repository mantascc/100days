import { WebSocket } from 'ws';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);
const filename = args[0];

if (!filename) {
  console.error('Usage: node send-to-canvas.js <json-filename> [--type line|bar|table] [--xKey <key>] [--yKey <key>] [--yKeys <key1,key2,...>] [--colors <color1,color2,...>] [--label <label>]');
  process.exit(1);
}

// Parse optional arguments
const options = {};
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--type' && args[i + 1]) {
    options.type = args[i + 1];
    i++;
  } else if (args[i] === '--xKey' && args[i + 1]) {
    options.xKey = args[i + 1];
    i++;
  } else if (args[i] === '--yKey' && args[i + 1]) {
    options.yKey = args[i + 1];
    i++;
  } else if (args[i] === '--yKeys' && args[i + 1]) {
    options.yKeys = args[i + 1].split(',');
    i++;
  } else if (args[i] === '--colors' && args[i + 1]) {
    options.colors = args[i + 1].split(',');
    i++;
  } else if (args[i] === '--label' && args[i + 1]) {
    options.label = args[i + 1];
    i++;
  }
}

// Read the JSON file - check data folder first, then parent directory
let filepath = resolve('..', 'data', filename);
let content;
try {
  content = readFileSync(filepath, 'utf-8');
} catch {
  // Try parent directory if not in data folder
  filepath = resolve('..', filename);
  content = readFileSync(filepath, 'utf-8');
}

let data;
try {
  const parsed = JSON.parse(content);

  // If visualization options are provided, wrap the data
  if (Object.keys(options).length > 0) {
    data = JSON.stringify({
      ...options,
      data: parsed
    });
  } else {
    // Send as-is if no options provided
    data = content;
  }
} catch (err) {
  console.error('✗ Error reading file:', err.message);
  process.exit(1);
}

const ws = new WebSocket('ws://localhost:8081');

ws.on('open', () => {
  ws.send(data);
  ws.close();
  console.log('✓ Data sent to canvas');
});

ws.on('error', (err) => {
  console.error('✗ WebSocket error:', err.message);
  process.exit(1);
});
