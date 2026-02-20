# Project Query Tools

Two tools for searching and filtering 100days projects by concept, tag, or keyword.

---

## Web Interface: `query-projects.html`

**Usage:** Open in browser

```bash
cd skill
open query-projects.html
```

Or from project root:
```bash
open skill/query-projects.html
```

**Features:**
- Visual card-based project browser
- Real-time search across all metadata
- Filter by data concept dropdown
- Shows project day, title, idea, concepts, and tags
- Live stats (total projects, filtered count)
- Computational minimalism aesthetic

**Search capabilities:**
- Keyword search (title, idea, concepts, tags)
- Data concept filter (Network, Clustering, Statistical, etc.)
- Combined filters

---

## CLI Tool: `query.js`

**Usage:** Command line

```bash
cd skill
node query.js <search-term>
node query.js --concept=<concept>
node query.js --tag=<tag>
node query.js --day=<number>
```

Or from project root:
```bash
node skill/query.js <search-term>
```

### Examples

**Search by keyword:**
```bash
node query.js entropy
node query.js particles
node query.js "random walk"
```

**Filter by data concept:**
```bash
node query.js --concept=network
node query.js --concept=statistical
node query.js --concept=clustering
```

**Filter by tag:**
```bash
node query.js --tag=flocking
node query.js --tag=canvas
node query.js --tag=emergence
```

**Get specific day:**
```bash
node query.js --day=12
```

**Combine filters:**
```bash
node query.js particles --concept=statistical
node query.js canvas --tag=physics
node query.js --concept=network --tag=graph
```

### Output Format

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

## Data Concepts

Available concept filters:

- **network** - graphs, connections, relationships
- **clustering** - spatial grouping, pattern detection
- **statistical** - entropy, probability, stochastic processes
- **temporal** - time-series, history, periodic events
- **spatial** - geographic, geometric, positioning
- **audio** - sound, signal processing
- **visual** - image processing, color, rendering
- **emergence** - self-organization, bottom-up patterns

---

## Use Cases

### Find similar projects
```bash
node query.js --concept=network        # All network-related projects
node query.js --tag=flocking           # Flocking/swarm simulations
```

### Explore techniques
```bash
node query.js canvas                   # Canvas-based projects
node query.js webgl                    # WebGL projects
node query.js --tag=physics            # Physics simulations
```

### Research specific topics
```bash
node query.js entropy                  # Entropy visualizations
node query.js cluster                  # Clustering projects
node query.js agent                    # Agent-based models
```

### Review by day
```bash
node query.js --day=1                  # View Day 1
node query.js --day=50                 # View Day 50
```

---

## Schema

Both tools parse `interface.md` files following the schema in `interface-schema.md`:

- **Day & Title**: Project identifier
- **Idea**: One-line concept
- **Data Concepts**: Primary/Secondary categorization
- **Conceptual Tags**: Thematic/theoretical tags
- **Technical Tags**: Implementation tags
- **Stack**: Technologies used

---

## Tips

**Web interface:**
- Type in search box and press Enter or click Search
- Use concept dropdown for precise filtering
- Click Clear to reset all filters
- Cards show first 6 tags for readability

**CLI tool:**
- Use quotes for multi-word searches: `"random walk"`
- Combine multiple filters for precise results
- Case-insensitive search
- Searches across title, idea, concepts, tags, and stack

---

## Implementation

**Web**: Standalone HTML + vanilla JS, fetches interface.md files via HTTP

**CLI**: Node.js script, reads interface.md files from filesystem

Both use same parsing logic for consistency.

---

*See `interface-schema.md` for metadata structure*
