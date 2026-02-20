# Canvas Skill

A Claude Code skill that renders data in a browser window.

---

## Concept

```
Terminal → JSON → HTML file → Browser
```

CLI agent grows a visual organ.

---

## Files

### canvas.sh
```bash
#!/bin/bash
DATA="$1"
HTML="/tmp/canvas-$(date +%s).html"

cat > "$HTML" << EOF
<!DOCTYPE html>
<html>
<head><style>body{font-family:monospace;padding:2rem;background:#111;color:#0f0}</style></head>
<body>
<pre id="out"></pre>
<script>
const data = ${DATA};
document.getElementById('out').textContent = JSON.stringify(data, null, 2);
</script>
</body>
</html>
EOF

echo "file://$HTML"
open "$HTML" 2>/dev/null || xdg-open "$HTML" 2>/dev/null
```

### SKILL.md
```markdown
# Canvas

Renders JSON data in browser.

## Trigger
User asks to "show", "visualize", or "display" data.

## Usage
./canvas.sh '<json>'

## Example
./canvas.sh '{"metric":"engagement","value":0.87}'
```

---

## Test

```bash
chmod +x canvas.sh
./canvas.sh '{"hello":"world"}'
```

---

## Modes (future)

| Mode | Transport | State |
|------|-----------|-------|
| 1a | file:// | static |
| 1b | localhost GET | static |
| 2 | WebSocket/SSE | live |

---

## Open questions

- How does skill detect if canvas is already open?
- What data shapes need which visualizations?
- Bidirectional: can canvas send back to Claude Code?

---

## Style seed

Monospace. Dark. Green on black. Minimal chrome. Data as protagonist.