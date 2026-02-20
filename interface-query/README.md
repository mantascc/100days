# Query Skill - Project Search & Discovery

Tools for searching and filtering 100days projects by concept, tag, or keyword.

---

## Tools

### `query-projects.html` - Web Interface
Visual card-based project browser with real-time search and filtering.

**Usage:**
```bash
cd skill
open query-projects.html
```

**Features:**
- Visual card layout with project metadata
- Real-time keyword search
- Data concept dropdown filter
- Shows: day, title, idea, concepts, tags
- Live stats (total/showing count)
- Computational minimalism aesthetic

---

### `query.js` - CLI Tool
Command-line interface for terminal-based querying.

**Usage:**
```bash
cd skill
node query.js <search-term>
node query.js --concept=<concept>
node query.js --tag=<tag>
node query.js --day=<number>
```

**Features:**
- Fast terminal-based search
- Filter by concept, tag, day, or keyword
- Colored output with project details
- Combine multiple filters
- Searches across all metadata

---

## Quick Reference

### Data Concepts
- **network** - graphs, connections, relationships
- **clustering** - spatial grouping, pattern detection
- **statistical** - entropy, probability, stochastic
- **temporal** - time-series, history, periodic
- **spatial** - geographic, geometric, positioning
- **audio** - sound, signal processing
- **visual** - image processing, color, rendering
- **emergence** - self-organization, patterns

---

## Examples

### Web Interface
```bash
cd skill
open query-projects.html

# Then in browser:
# - Type "entropy" in search box
# - Select "Statistical" from dropdown
# - Click Search
```

### CLI Tool

**Search by keyword:**
```bash
node query.js entropy
node query.js particles
node query.js "random walk"
```

**Filter by concept:**
```bash
node query.js --concept=network
node query.js --concept=statistical
node query.js --concept=clustering
```

**Filter by tag:**
```bash
node query.js --tag=flocking
node query.js --tag=canvas
node query.js --tag=physics
```

**Get specific day:**
```bash
node query.js --day=12
node query.js --day=50
```

**Combine filters:**
```bash
node query.js particles --concept=statistical
node query.js canvas --tag=physics
node query.js --concept=network --tag=graph
```

---

## Output Format

### Web Interface
Card-based layout showing:
- Project day number
- Title
- One-line idea
- Primary & secondary concepts (colored tags)
- First 6 conceptual tags

### CLI Tool
```
Found 3 projects:

Day 1: Entropy
  Interactive visualization of entropy as gradient from order to chaos
  → Statistical / Temporal
  #entropy #order-chaos #parametric-motion
  ./day-1/

Day 4: Random Walk
  Stochastic patterns emerge from purely random individual motion
  → Statistical (stochastic process)
  #random-walk #stochastic #brownian-motion
  ./day-4/
```

---

## How It Works

Both tools parse `interface.md` files following the schema in `interface-schema.md`:

**Metadata extracted:**
- Day number & title
- One-line idea
- Primary & secondary data concepts
- Conceptual tags (thematic)
- Technical tags (implementation)
- Stack/technologies

**Search capabilities:**
- Full-text search across all fields
- Concept-based filtering
- Tag matching (partial or exact)
- Day number lookup
- Combined filter logic (AND operations)

---

## Use Cases

### Find Similar Projects
```bash
node query.js --concept=network        # All network projects
node query.js --tag=flocking           # Flocking simulations
node query.js --tag=boids              # Boids-related
```

### Explore Techniques
```bash
node query.js canvas                   # Canvas-based projects
node query.js webgl                    # WebGL projects
node query.js --tag=physics            # Physics simulations
```

### Research Topics
```bash
node query.js entropy                  # Entropy visualizations
node query.js cluster                  # Clustering projects
node query.js agent                    # Agent-based models
```

### Browse by Day
```bash
node query.js --day=1                  # View Day 1
node query.js --day=50                 # View Day 50
```

---

## Technical Details

### Web Tool (query-projects.html)
- Standalone HTML + vanilla JS
- Fetches interface.md files via HTTP
- Client-side parsing and filtering
- No build step required
- Works with any web server

### CLI Tool (query.js)
- Node.js script
- Reads interface.md from filesystem
- Fast regex-based parsing
- Colored terminal output
- Works offline

### Parsing Logic
Both use same interface.md parsing:
```javascript
// Extract title from markdown header
const titleMatch = content.match(/^#\s+Day\s+\d+:\s+(.+)$/m);

// Extract idea section
const ideaMatch = content.match(/##\s+Idea\s*\n([^\n]+)/);

// Extract primary concept
const primaryMatch = content.match(/\*\*Primary\*\*:\s+(.+?)(?:\n|$)/);

// Extract tags
const tagsMatch = content.match(/##\s+Conceptual Tags\s*\n([^\n]+)/);
```

---

## Integration

### From Project Root
```bash
# Web
open skill/query-projects.html

# CLI
node skill/query.js entropy
```

### With Other Tools
```bash
# Find projects using canvas
node skill/query.js canvas > canvas-projects.txt

# Count network projects
node skill/query.js --concept=network | grep "Day" | wc -l

# Export search results
node skill/query.js --tag=physics >> research-notes.md
```

---

## File Structure

```
skill/
├── README.md              # This file
├── QUERY.md              # Detailed usage guide
├── query-projects.html   # Web interface
└── query.js              # CLI tool
```

---

## Related Files

- `../interface-schema.md` - Metadata schema definition
- `../day-*/interface.md` - Individual project metadata (51 files)
- `../computational-minimalism/` - Design system tools

---

## Tips

### Web Interface
- Press Enter in search box to submit
- Use Clear button to reset all filters
- Concept dropdown shows all 8 categories
- Cards are clickable areas

### CLI Tool
- Use quotes for multi-word searches: `"random walk"`
- Filters are case-insensitive
- Multiple search terms use AND logic
- Combine filters for precise results
- Output can be piped to other commands

### Performance
- Web: Loads all 51 files on startup (fast)
- CLI: Reads only needed files (instant)
- Both cache results for repeated queries

---

*Part of the 100 Days of Creative Coding project*
