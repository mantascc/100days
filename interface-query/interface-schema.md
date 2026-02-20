# interface.md Schema

Standard metadata format for documenting 100days projects.

---

## Purpose

Each project gets an `interface.md` file that:
- Documents what the project does and why
- Tags it with data concepts and techniques
- Makes projects searchable and relatable
- Captures insights and discoveries

---

## Structure

```markdown
# Day X: [Project Name]

## Idea
[One-line concept - imperative or descriptive, < 80 chars]

## Description
[2-4 paragraphs explaining:
- What the project does/shows
- How it works at a high level
- What makes it interesting or unique
- Any conceptual or metaphorical significance]

## Data Concepts
- **Primary**: [Main data concept category]
- **Secondary**: [Optional - additional concepts if applicable]

## Conceptual Tags
#tag1 #tag2 #tag3 #tag4
[Theoretical/conceptual/domain tags - what ideas it explores]

## Technical Tags
#tech1 #tech2 #tech3
[Implementation/technology tags - how it's built]

## Stack
- [Technology/library 1]
- [Technology/library 2]
- [Key technical approaches]

## [Optional Sections]
### Mechanics
[Detailed algorithm/physics/rules explanation]

### Parameters
[Tunable values, controls, configuration options]

### Motion Design
[If applicable - animation principles, easing, timing]

### Algorithm
[If applicable - step-by-step process]

### Physics Analogy
[If applicable - real-world physics parallels]

## Notes
- [Key insights, discoveries, observations]
- [Connections to other projects or concepts]
- [Limitations, trade-offs, or interesting failures]
- [Metaphors, references, inspirations]
- [Things that worked well or didn't work]
```

---

## Field Definitions

### Required Fields

#### `# Day X: [Project Name]`
- **Format**: `# Day X: Title Case Name`
- **Example**: `# Day 12: Perlin Noise Wind`
- **Purpose**: Clear identifier and title

#### `## Idea`
- **Format**: Single line, < 80 characters
- **Style**: Imperative (command) or descriptive statement
- **Examples**:
  - "Interactive visualization of entropy as gradient from order to chaos"
  - "Collective flocking behavior emerges from simple local alignment rules"
- **Purpose**: Elevator pitch - instant understanding

#### `## Description`
- **Format**: 2-4 paragraphs of prose
- **Content**:
  - What it does (observable behavior)
  - How it works (mechanism at high level)
  - Why it's interesting (insight or significance)
  - Optional: metaphor or real-world connection
- **Purpose**: Full context for someone unfamiliar with the project

#### `## Data Concepts`
- **Format**: Bulleted list with primary + optional secondary
- **Categories** (use these labels):
  - **Network** - graphs, connections, relationships, social networks
  - **Clustering** - spatial grouping, pattern detection, proximity
  - **Statistical** - entropy, probability, stochastic, distributions
  - **Temporal** - time-series, history, periodic, evolution
  - **Spatial** - geographic, geometric, positioning, layout
  - **Audio** - sound, signal processing, frequencies
  - **Visual** - image processing, color theory, rendering
  - **Emergence** - self-organization, bottom-up patterns
- **Example**:
  ```markdown
  - **Primary**: Statistical (stochastic process)
  - **Secondary**: Temporal (motion history)
  ```
- **Purpose**: Categorize for the concept graph, enable filtering

#### `## Conceptual Tags`
- **Format**: Space-separated hashtags, all lowercase
- **Content**: Theoretical/domain concepts explored
- **Examples**: `#entropy #flocking #emergence #self-organization #apophenia`
- **Purpose**: Thematic/conceptual search and connections

#### `## Technical Tags`
- **Format**: Space-separated hashtags, all lowercase
- **Content**: Implementation technologies and techniques
- **Examples**: `#canvas #webgl #spatial-hashing #particle-system #perlin-noise`
- **Purpose**: Technical search, learning resources

#### `## Stack`
- **Format**: Bulleted list
- **Content**: Technologies, libraries, key approaches
- **Examples**:
  - HTML5 Canvas
  - Vanilla JS with RequestAnimationFrame
  - D3.js force simulation
  - Spatial hashing for O(n) lookup
- **Purpose**: Quick technical overview

#### `## Notes`
- **Format**: Bulleted list or short paragraphs
- **Content**:
  - Insights and discoveries
  - What worked / what didn't
  - Connections to other work
  - References (papers, artists, techniques)
  - Metaphors or real-world parallels
  - Future directions or variations
- **Purpose**: Capture learnings and context

---

### Optional Sections

Add these if relevant to the project:

#### `## Mechanics`
Detailed explanation of algorithms, physics, rules. Use when the Description isn't enough.

#### `## Parameters`
List of tunable values, controls, configuration options with their ranges and effects.

#### `## Motion Design`
Animation principles, easing functions, timing details for projects with significant motion.

#### `## Algorithm`
Step-by-step pseudocode or process description for complex computational approaches.

#### `## Physics Analogy`
Real-world physics parallels that help understand the simulation (e.g., "charged particles in electric field").

---

## Style Guidelines

### Writing Tone
- **Clear and direct** - avoid jargon unless necessary
- **Present tense** - "The system creates..." not "The system created..."
- **Active voice** - "Agents align with neighbors" not "Neighbors are aligned by agents"
- **Concrete** - specific details over vague descriptions

### Naming Conventions
- **Tags**: lowercase, hyphenated (`#random-walk` not `#RandomWalk`)
- **Data concepts**: Capitalized category names (`Network`, `Statistical`)
- **Titles**: Title Case (`Perlin Noise Wind` not `perlin noise wind`)

### Length Guidelines
- **Idea**: 1 line, < 80 chars
- **Description**: 2-4 paragraphs, ~150-300 words
- **Tags**: 4-8 conceptual tags, 3-6 technical tags
- **Notes**: 3-8 bullet points

---

## Examples

See existing interface.md files:
- `day-1/interface.md` - statistical/temporal, parametric motion
- `day-2/interface.md` - network/emergence, agent-based model
- `day-3/interface.md` - clustering, chaos injection
- `day-4/interface.md` - statistical, pure random walk
- `day-7/interface.md` - clustering/network, perception of patterns

---

## Usage

1. **Creating**: Use this schema when documenting new projects
2. **Searching**: Grep by tags, data concepts, or keywords
3. **Graphing**: Parse data concepts to build concept graph
4. **Filtering**: Query by stack, technique, or theme
5. **Learning**: Trace technique evolution across days

---

## Metadata for Tools

This schema enables:
- **Concept graph**: Parse `Data Concepts` to connect projects
- **Tag search**: Extract all `#tags` for filtering
- **Stack analysis**: Identify technology patterns
- **Thematic grouping**: Cluster by conceptual tags
- **Knowledge base**: Full-text search across descriptions

---

*Last updated: 2026-02-19*
