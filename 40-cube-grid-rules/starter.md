# CLI Material Palette

A design reference for the fundamental materials of command-line interfaces.

---

## Spatial Materials

### The Character Grid
Everything exists on a monospace grid. Each cell is one character wide, one line tall. This is the fundamental constraint and the source of CLI's unique aesthetic.

- **Standard width**: 80-120 characters
- **Vertical rhythm**: Line-by-line flow, no sub-line positioning
- **Grid snap**: All elements align to character boundaries

**Try it yourself:**

```bash
# Check your terminal width
tput cols

# Or display it with context
echo "Your terminal is $(tput cols) columns wide"

# See the 80-character boundary (traditional limit)
printf '=%.0s' {1..80} && echo

# Compare with 120 characters (modern comfort zone)
printf '=%.0s' {1..120} && echo
```

```javascript
// Node.js: Get terminal dimensions
console.log(`Terminal: ${process.stdout.columns} cols × ${process.stdout.rows} rows`);

// Demonstrate character grid alignment
const line = '─'.repeat(process.stdout.columns);
console.log(line);
console.log('Every character takes exactly one cell');
console.log(line);
```

```python
# Python: Terminal dimensions
import shutil
cols, rows = shutil.get_terminal_size()
print(f"Terminal: {cols} cols × {rows} rows")

# Visual grid demonstration
print("─" * cols)
print("Each character occupies one grid cell".center(cols))
print("─" * cols)
```

### Whitespace Hierarchy
Space is semantic structure.

```
command
  ├─ nested item
  │  └─ deeper nesting
  └─ sibling item

command output
  (blank line = conceptual break)
next command
```

- **Indentation**: 2 or 4 spaces, creates depth
- **Vertical spacing**: Line breaks divide concepts
- **Horizontal alignment**: Columns, tables, left-edge dominance

**Try it yourself:**

```bash
# Generate a tree structure (install with: brew install tree / apt install tree)
tree -L 2

# Or create one manually with box-drawing characters
echo "project"
echo "├── src"
echo "│   ├── index.js"
echo "│   └── utils.js"
echo "└── package.json"

# Demonstrate vertical spacing for conceptual breaks
echo "Step 1: Initialize"
echo "  Setting up environment..."
echo ""
echo "Step 2: Build"
echo "  Compiling sources..."
echo ""
echo "Step 3: Deploy"
echo "  Pushing to production..."
```

```javascript
// Node.js: Create hierarchical output
function printTree(items, indent = '') {
  items.forEach((item, i) => {
    const isLast = i === items.length - 1;
    const prefix = isLast ? '└──' : '├──';
    const childIndent = isLast ? '    ' : '│   ';

    console.log(`${indent}${prefix} ${item.name}`);
    if (item.children) {
      printTree(item.children, indent + childIndent);
    }
  });
}

printTree([
  { name: 'src', children: [
    { name: 'index.js' },
    { name: 'utils.js' }
  ]},
  { name: 'package.json' }
]);
```

```python
# Python: Indentation and vertical rhythm
def show_hierarchy():
    print("Root Item")
    print("  ├─ Child 1")
    print("  │  └─ Grandchild")
    print("  └─ Child 2")
    print()  # Blank line for conceptual break
    print("Next Section")
    print("  └─ New item")

show_hierarchy()

# Column alignment example
data = [
    ("Name", "Status", "Time"),
    ("build.js", "✓ Pass", "0.2s"),
    ("test.js", "✓ Pass", "1.5s"),
    ("deploy.sh", "✗ Fail", "0.1s"),
]

for row in data:
    print(f"{row[0]:<15} {row[1]:<10} {row[2]:>6}")
```

---

## Typographic Materials

### Weight & Style
Limited but powerful modifiers:

- **Bold** — emphasis, headers, current selection
- **Dim** — secondary information, deemphasized text
- **Underline** — rarely used, often indicates links or input fields
- **Inverse** — background/foreground swap, highlights, selected items
- **Strikethrough** — completed tasks, deprecated options

**Try it yourself:**

```bash
# ANSI escape codes for text styling
echo -e "\033[1mBold text\033[0m — for emphasis"
echo -e "\033[2mDim text\033[0m — for secondary info"
echo -e "\033[4mUnderlined text\033[0m — for links"
echo -e "\033[7mInverse text\033[0m — for highlights"
echo -e "\033[9mStrikethrough\033[0m — for completed items"

# Combining styles
echo -e "\033[1;4mBold + Underline\033[0m"

# Practical example: Task list
echo -e "Tasks:"
echo -e "  \033[9m✓ Write documentation\033[0m"
echo -e "  \033[1m→ Review code\033[0m (current)"
echo -e "  \033[2m  Deploy to production\033[0m"
```

```javascript
// Node.js: ANSI styling helpers
const styles = {
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
  underline: (text) => `\x1b[4m${text}\x1b[0m`,
  inverse: (text) => `\x1b[7m${text}\x1b[0m`,
  strikethrough: (text) => `\x1b[9m${text}\x1b[0m`,
};

console.log(styles.bold('Bold text') + ' — for emphasis');
console.log(styles.dim('Dim text') + ' — for secondary info');
console.log(styles.underline('Underlined') + ' — for links');
console.log(styles.inverse(' Inverse ') + ' — for selection');
console.log(styles.strikethrough('Done') + ' — completed');

// Menu example
console.log('\nSelect an option:');
console.log(styles.inverse(' Option 1 ') + ' ← selected');
console.log('  Option 2');
console.log(styles.dim('  Option 3 (disabled)'));
```

```python
# Python: ANSI text styling
class Style:
    BOLD = '\033[1m'
    DIM = '\033[2m'
    UNDERLINE = '\033[4m'
    INVERSE = '\033[7m'
    STRIKE = '\033[9m'
    RESET = '\033[0m'

print(f"{Style.BOLD}Bold text{Style.RESET} — for emphasis")
print(f"{Style.DIM}Dim text{Style.RESET} — for secondary info")
print(f"{Style.UNDERLINE}Underlined{Style.RESET} — for links")
print(f"{Style.INVERSE} Inverse {Style.RESET} — for highlights")
print(f"{Style.STRIKE}Strikethrough{Style.RESET} — completed")

# Build status example
print(f"\n{Style.BOLD}Build Status:{Style.RESET}")
print(f"  {Style.STRIKE}✓ Compile{Style.RESET}")
print(f"  {Style.INVERSE} → Test {Style.RESET}")
print(f"  {Style.DIM}  Deploy{Style.RESET}")
```

### Monospace Typography
Every character occupies equal width. Alignment is predictable. ASCII art becomes possible.

**Try it yourself:**

```bash
# Demonstrate predictable alignment with monospace
echo "Name         | Status | Time"
echo "-------------|--------|------"
echo "build.js     | ✓ Pass | 0.2s"
echo "test.js      | ✓ Pass | 1.5s"
echo "deploy.sh    | ✗ Fail | 0.1s"

# ASCII art is possible because of fixed-width characters
echo "  ╔═══════════════╗"
echo "  ║  ASCII Box    ║"
echo "  ║  Perfect      ║"
echo "  ║  Alignment    ║"
echo "  ╚═══════════════╝"
```

```javascript
// Node.js: Leverage monospace for alignment
const data = [
  { name: 'index.js', size: '2.4 KB', status: '✓' },
  { name: 'app.js', size: '15.8 KB', status: '✓' },
  { name: 'config.json', size: '0.5 KB', status: '✗' },
];

// Manual padding for perfect alignment
data.forEach(item => {
  const name = item.name.padEnd(15);
  const size = item.size.padStart(8);
  console.log(`${item.status} ${name} ${size}`);
});

// ASCII art logo
console.log(`
  ╭────────────╮
  │   CLI APP  │
  ╰────────────╯
`);
```

```python
# Python: Monospace alignment and ASCII art
files = [
    ("index.js", "2.4 KB", "✓"),
    ("app.js", "15.8 KB", "✓"),
    ("config.json", "0.5 KB", "✗"),
]

print("File            Size      Status")
print("─" * 35)
for name, size, status in files:
    print(f"{status} {name:<13} {size:>8}")

# ASCII diagram
print("""
    ┌─────────┐
    │  Input  │
    └────┬────┘
         │
    ┌────▼────┐
    │ Process │
    └────┬────┘
         │
    ┌────▼────┐
    │ Output  │
    └─────────┘
""")
```

---

## Color Materials

### ANSI 16-Color Palette
The base vocabulary. These are *variables* that terminal themes remap:

**Normal intensity:**
- Black, Red, Green, Yellow, Blue, Magenta, Cyan, White

**Bright variants:**
- Bright Black (gray), Bright Red, Bright Green, etc.

**Semantic conventions:**
- Red → errors, warnings
- Green → success, completion
- Yellow → warnings, attention
- Blue → information, links
- Magenta → special states
- Cyan → highlights, emphasis
- Dim → secondary information

**Try it yourself:**

```bash
# Display all 16 basic colors
echo -e "\033[30mBlack\033[0m   \033[90mBright Black (Gray)\033[0m"
echo -e "\033[31mRed\033[0m     \033[91mBright Red\033[0m"
echo -e "\033[32mGreen\033[0m   \033[92mBright Green\033[0m"
echo -e "\033[33mYellow\033[0m  \033[93mBright Yellow\033[0m"
echo -e "\033[34mBlue\033[0m    \033[94mBright Blue\033[0m"
echo -e "\033[35mMagenta\033[0m \033[95mBright Magenta\033[0m"
echo -e "\033[36mCyan\033[0m    \033[96mBright Cyan\033[0m"
echo -e "\033[37mWhite\033[0m   \033[97mBright White\033[0m"

# Semantic usage examples
echo ""
echo -e "\033[32m✓ Success:\033[0m Operation completed"
echo -e "\033[31m✗ Error:\033[0m File not found"
echo -e "\033[33m⚠ Warning:\033[0m Deprecated API"
echo -e "\033[34mℹ Info:\033[0m New version available"
echo -e "\033[36m→ Highlight:\033[0m Current step"
echo -e "\033[2m  (secondary context)\033[0m"
```

```javascript
// Node.js: Color palette helpers
const colors = {
  black: (t) => `\x1b[30m${t}\x1b[0m`,
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  blue: (t) => `\x1b[34m${t}\x1b[0m`,
  magenta: (t) => `\x1b[35m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
  white: (t) => `\x1b[37m${t}\x1b[0m`,
  gray: (t) => `\x1b[90m${t}\x1b[0m`, // bright black
};

// Show all colors
console.log(colors.red('Red') + ' ' + colors.green('Green') + ' ' + colors.blue('Blue'));

// Semantic usage
console.log(colors.green('✓ Build succeeded'));
console.log(colors.red('✗ Test failed'));
console.log(colors.yellow('⚠ 3 warnings'));
console.log(colors.cyan('→ Installing dependencies...'));
console.log(colors.gray('  (this may take a moment)'));

// Background colors
const bg = {
  red: (t) => `\x1b[41m${t}\x1b[0m`,
  green: (t) => `\x1b[42m${t}\x1b[0m`,
  yellow: (t) => `\x1b[43m${t}\x1b[0m`,
};

console.log('\n' + bg.green(' PASS ') + ' All tests passed');
console.log(bg.red(' FAIL ') + ' 2 tests failed');
```

```python
# Python: ANSI color codes
class Color:
    # Foreground colors
    BLACK = '\033[30m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'
    CYAN = '\033[36m'
    WHITE = '\033[37m'
    GRAY = '\033[90m'  # bright black
    RESET = '\033[0m'

    # Background colors
    BG_RED = '\033[41m'
    BG_GREEN = '\033[42m'
    BG_YELLOW = '\033[43m'

# Display palette
print(f"{Color.RED}Red{Color.RESET} {Color.GREEN}Green{Color.RESET} {Color.BLUE}Blue{Color.RESET}")

# Semantic usage
print(f"{Color.GREEN}✓ Success:{Color.RESET} Deployment completed")
print(f"{Color.RED}✗ Error:{Color.RESET} Connection timeout")
print(f"{Color.YELLOW}⚠ Warning:{Color.RESET} Low disk space")
print(f"{Color.CYAN}→ Info:{Color.RESET} Processing batch 3/10")
print(f"{Color.GRAY}  (estimated time: 2m 30s){Color.RESET}")

# Background highlights
print(f"\n{Color.BG_GREEN} PASS {Color.RESET} Integration tests")
print(f"{Color.BG_RED} FAIL {Color.RESET} Unit tests")
```

### Extended Colors
- **256-color mode**: Broader palette for gradients, syntax highlighting
- **24-bit true color**: Full RGB spectrum (not universally supported)

**Try it yourself:**

```bash
# 256-color mode demo
echo "256-color palette (showing selection):"
for i in {16..21} {22..27} {28..33}; do
  echo -en "\033[48;5;${i}m  \033[0m"
done
echo ""

# True color (24-bit RGB) if supported
echo -e "\033[38;2;255;100;0mTrue color orange\033[0m (if supported)"
echo -e "\033[38;2;0;200;255mTrue color cyan\033[0m (if supported)"

# Gradient effect with 256 colors
printf "Gradient: "
for i in {232..255}; do
  printf "\033[48;5;${i}m \033[0m"
done
echo ""
```

```javascript
// Node.js: 256-color and true color
// 256-color mode (more compatible)
const color256 = (code, text) => `\x1b[38;5;${code}m${text}\x1b[0m`;

console.log('256-color examples:');
console.log(color256(196, '■') + ' Deep red (196)');
console.log(color256(46, '■') + ' Bright green (46)');
console.log(color256(21, '■') + ' Deep blue (21)');
console.log(color256(201, '■') + ' Hot pink (201)');

// True color RGB (may not work in all terminals)
const rgb = (r, g, b, text) => `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;

console.log('\n24-bit true color (if supported):');
console.log(rgb(255, 100, 0, '■') + ' Orange');
console.log(rgb(100, 200, 255, '■') + ' Sky blue');
console.log(rgb(200, 50, 200, '■') + ' Purple');

// Gradient with 256 colors
process.stdout.write('Gradient: ');
for (let i = 232; i <= 255; i++) {
  process.stdout.write(`\x1b[48;5;${i}m \x1b[0m`);
}
console.log('');
```

```python
# Python: Extended color modes
# 256-color mode
def color_256(code, text):
    return f"\033[38;5;{code}m{text}\033[0m"

print("256-color palette:")
print(f"{color_256(196, '■')} Deep red (196)")
print(f"{color_256(46, '■')} Bright green (46)")
print(f"{color_256(21, '■')} Deep blue (21)")
print(f"{color_256(201, '■')} Hot pink (201)")

# True color (24-bit RGB)
def rgb(r, g, b, text):
    return f"\033[38;2;{r};{g};{b}m{text}\033[0m"

print("\n24-bit true color (if supported):")
print(f"{rgb(255, 100, 0, '■')} Custom orange")
print(f"{rgb(100, 200, 255, '■')} Custom sky blue")

# Gradient example
print("\nGrayscale gradient:")
for i in range(232, 256):
    print(f"\033[48;5;{i}m \033[0m", end="")
print()
```

---

## Symbol Vocabulary

### Status Indicators
```
✓ ✗ ✔︎ ✘  — completion states
● ○ ◉ ◯  — selection, loading states
■ □ ▪ ▫  — checkboxes, bullets
⚠ ⚡ ℹ ⓘ  — warnings, info, attention
```

**Try it yourself:**

```bash
# Status indicators in action
echo "✓ Completed task"
echo "✗ Failed task"
echo "● Current selection"
echo "○ Unselected option"
echo "■ Checked item"
echo "□ Unchecked item"
echo "⚠ Warning message"
echo "ℹ Information"

# Task list example
echo ""
echo "Build Status:"
echo "  ✓ Install dependencies"
echo "  ✓ Run linter"
echo "  ● Running tests... (current)"
echo "  ○ Build production"
echo "  ○ Deploy"
```

```javascript
// Node.js: Status indicators for task lists
const status = {
  done: '✓',
  fail: '✗',
  todo: '○',
  current: '●',
  checked: '■',
  unchecked: '□',
  warning: '⚠',
  info: 'ℹ',
};

// Task runner output
const tasks = [
  { name: 'Install deps', state: 'done' },
  { name: 'Lint code', state: 'done' },
  { name: 'Run tests', state: 'current' },
  { name: 'Build', state: 'todo' },
  { name: 'Deploy', state: 'todo' },
];

console.log('Build Pipeline:');
tasks.forEach(task => {
  const icon = status[task.state];
  const suffix = task.state === 'current' ? ' (running...)' : '';
  console.log(`  ${icon} ${task.name}${suffix}`);
});

// Checkbox menu
console.log('\nSelect features:');
console.log(`  ${status.checked} Dark mode`);
console.log(`  ${status.unchecked} Analytics`);
console.log(`  ${status.checked} Offline support`);
```

```python
# Python: Rich status indicators
class Icon:
    DONE = '✓'
    FAIL = '✗'
    TODO = '○'
    CURRENT = '●'
    CHECK = '■'
    UNCHECK = '□'
    WARNING = '⚠'
    INFO = 'ℹ'

# Build status display
tasks = [
    ("Install dependencies", "done"),
    ("Compile TypeScript", "done"),
    ("Run unit tests", "current"),
    ("Build bundle", "todo"),
    ("Deploy to prod", "todo"),
]

print("Build Progress:")
for task, state in tasks:
    icons = {'done': Icon.DONE, 'current': Icon.CURRENT, 'todo': Icon.TODO}
    suffix = " (in progress...)" if state == 'current' else ""
    print(f"  {icons[state]} {task}{suffix}")

# Alert messages
print(f"\n{Icon.DONE} Success: All tests passed")
print(f"{Icon.WARNING} Warning: API deprecated")
print(f"{Icon.INFO} Info: Update available")
```

### Structural Glyphs
```
│ ├ └ ─ ┼  — tree structures
→ ⇒ ↳ ⟶  — flow, hierarchy, progression
> » ›      — prompts, nesting
[ ] ( )    — containers, groupings
/ \ | -    — ASCII fallbacks
```

**Try it yourself:**

```bash
# Tree structure with box-drawing characters
echo "project/"
echo "├── src/"
echo "│   ├── index.js"
echo "│   ├── utils/"
echo "│   │   ├── helpers.js"
echo "│   │   └── config.js"
echo "│   └── components/"
echo "│       └── Button.js"
echo "└── package.json"

# Flow indicators
echo ""
echo "Pipeline:"
echo "  → Fetch data"
echo "  → Transform"
echo "  → Validate"
echo "  ⇒ Output"

# Prompt nesting
echo ""
echo "> Main command"
echo "  › Sub-option"
echo "    › Nested detail"
```

```javascript
// Node.js: Building tree structures
function renderTree(node, prefix = '', isLast = true) {
  const connector = isLast ? '└──' : '├──';
  const extension = isLast ? '    ' : '│   ';

  console.log(prefix + connector + ' ' + node.name);

  if (node.children) {
    node.children.forEach((child, i) => {
      const last = i === node.children.length - 1;
      renderTree(child, prefix + extension, last);
    });
  }
}

const fileTree = {
  name: 'project/',
  children: [
    {
      name: 'src/',
      children: [
        { name: 'index.js' },
        { name: 'utils.js' },
      ]
    },
    { name: 'package.json' }
  ]
};

renderTree(fileTree, '', true);

// Flow diagram
console.log('\nData Flow:');
console.log('  Input → Process → Validate ⇒ Output');

// Nested menu
console.log('\nMenu:');
console.log('> Settings');
console.log('  › Appearance');
console.log('    › Theme: Dark');
console.log('  › Privacy');
```

```python
# Python: Tree and flow structures
def print_tree(items, prefix="", is_last=True):
    connector = "└──" if is_last else "├──"
    print(f"{prefix}{connector} {items['name']}")

    if 'children' in items:
        extension = "    " if is_last else "│   "
        for i, child in enumerate(items['children']):
            last = i == len(items['children']) - 1
            print_tree(child, prefix + extension, last)

tree = {
    'name': 'project/',
    'children': [
        {
            'name': 'src/',
            'children': [
                {'name': 'app.py'},
                {'name': 'utils.py'},
            ]
        },
        {'name': 'requirements.txt'}
    ]
}

print_tree(tree)

# Flow indicators
print("\nWorkflow:")
print("  → Initialize")
print("  → Process")
print("  ⇒ Complete")

# ASCII fallback for compatibility
print("\nASCII-safe tree:")
print("project/")
print("|-- src/")
print("|   |-- app.py")
print("|   +-- utils.py")
print("+-- README.md")
```

### Progress & State
```
⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏  — spinner frames (Braille)
▏▎▍▌▋▊▉█  — progress bars
... ··· …  — loading, continuation
```

**Try it yourself:**

```bash
# Simple progress bar
echo "Progress:"
for i in {1..10}; do
  bar=$(printf '█%.0s' $(seq 1 $i))
  printf "\r[%-10s] %d%%" "$bar" $((i*10))
  sleep 0.1
done
echo ""

# Different block characters for granularity
echo "Fine-grained progress:"
blocks="▏▎▍▌▋▊▉█"
for i in {1..8}; do
  char=${blocks:$((i-1)):1}
  printf "\r%s Loading..." "$char"
  sleep 0.2
done
echo ""

# Spinner animation (run in background)
spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
for i in {1..20}; do
  printf "\r${spin:$((i%10)):1} Processing..."
  sleep 0.1
done
echo -e "\r✓ Done!        "
```

```javascript
// Node.js: Animated spinner
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let frame = 0;

function spinner(message) {
  return setInterval(() => {
    process.stdout.write(`\r${spinnerFrames[frame]} ${message}`);
    frame = (frame + 1) % spinnerFrames.length;
  }, 80);
}

// Usage example
const spin = spinner('Loading...');
setTimeout(() => {
  clearInterval(spin);
  process.stdout.write('\r✓ Done!       \n');
}, 3000);

// Progress bar
function progressBar(percent, width = 20) {
  const filled = Math.floor(width * percent / 100);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percent}%`;
}

// Simulate progress
let progress = 0;
const progressInterval = setInterval(() => {
  process.stdout.write('\r' + progressBar(progress));
  progress += 10;
  if (progress > 100) {
    clearInterval(progressInterval);
    console.log('\n✓ Complete');
  }
}, 200);
```

```python
# Python: Animated progress indicators
import sys
import time

# Spinner animation
def spinner_demo():
    frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    for i in range(30):
        frame = frames[i % len(frames)]
        sys.stdout.write(f'\r{frame} Loading...')
        sys.stdout.flush()
        time.sleep(0.1)
    sys.stdout.write('\r✓ Done!       \n')

# Progress bar
def progress_bar(percent, width=30):
    filled = int(width * percent / 100)
    bar = '█' * filled + '░' * (width - filled)
    return f"[{bar}] {percent}%"

# Demonstrate progress bar
print("Progress:")
for i in range(0, 101, 10):
    sys.stdout.write('\r' + progress_bar(i))
    sys.stdout.flush()
    time.sleep(0.2)
print('\n✓ Complete')

# Fine-grained progress with eighths
blocks = ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█']
print("\nFine-grained loader:")
for i, block in enumerate(blocks):
    sys.stdout.write(f'\r{block} Loading... {(i+1)*12}%')
    sys.stdout.flush()
    time.sleep(0.2)
print('\n✓ Done')

# Uncomment to run:
# spinner_demo()
```

---

## Temporal Materials

### Animation States
- **Spinners**: Character-by-character rotation for "working" state
- **Progress bars**: Growing sequences, percentage indicators
- **Streaming text**: Character or chunk-by-chunk reveal
- **Blinking cursor**: Temporal marker of input readiness

**Try it yourself:**

```bash
# Multi-style spinner (Braille dots)
frames=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
for i in {1..30}; do
  idx=$((i % 10))
  printf "\r${frames[$idx]} Processing..."
  sleep 0.1
done
echo -e "\r✓ Done!        "

# Growing progress bar with percentage
for i in {0..100..5}; do
  filled=$((i / 5))
  empty=$((20 - filled))
  bar=$(printf '█%.0s' $(seq 1 $filled))
  spaces=$(printf ' %.0s' $(seq 1 $empty))
  printf "\r[%s%s] %d%%" "$bar" "$spaces" "$i"
  sleep 0.1
done
echo ""

# Streaming text reveal
text="Building application..."
for (( i=0; i<${#text}; i++ )); do
  printf "%s" "${text:$i:1}"
  sleep 0.05
done
echo ""
```

```javascript
// Node.js: Combined animation examples
const readline = require('readline');

// Spinner with different styles
const spinners = {
  dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  line: ['|', '/', '-', '\\'],
  dots2: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
  arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
};

function animate(frames, message, duration = 3000) {
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${frames[i]} ${message}`);
    i = (i + 1) % frames.length;
  }, 80);

  setTimeout(() => {
    clearInterval(interval);
    process.stdout.write('\r✓ Complete!   \n');
  }, duration);
}

// Progress bar with ETA
function progressWithETA(total = 100) {
  let current = 0;
  const startTime = Date.now();

  const interval = setInterval(() => {
    const percent = Math.floor((current / total) * 100);
    const filled = Math.floor(percent / 5);
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);

    const elapsed = (Date.now() - startTime) / 1000;
    const eta = current > 0 ? ((elapsed / current) * (total - current)) : 0;

    process.stdout.write(
      `\r[${bar}] ${percent}% | ETA: ${eta.toFixed(1)}s`
    );

    current += 5;
    if (current > total) {
      clearInterval(interval);
      console.log('\n✓ Complete');
    }
  }, 100);
}

// Streaming text typewriter effect
async function typewriter(text, delay = 50) {
  for (const char of text) {
    process.stdout.write(char);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  console.log('');
}

// Usage:
// animate(spinners.dots, 'Loading...');
// progressWithETA(100);
// typewriter('Deploying to production...');
```

```python
# Python: Animation and timing examples
import sys
import time
from datetime import datetime

# Multi-style spinner
def spinner_styles():
    styles = {
        'dots': ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        'line': ['|', '/', '-', '\\'],
        'arrow': ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
        'dots2': ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
    }

    for style_name, frames in styles.items():
        print(f"\n{style_name}:")
        for i in range(20):
            frame = frames[i % len(frames)]
            sys.stdout.write(f'\r{frame} Loading...')
            sys.stdout.flush()
            time.sleep(0.1)
        sys.stdout.write('\r✓ Done!       \n')

# Progress with ETA
def progress_with_eta(total=100):
    start_time = time.time()

    for current in range(0, total + 1, 5):
        percent = int((current / total) * 100)
        filled = percent // 5
        bar = '█' * filled + '░' * (20 - filled)

        elapsed = time.time() - start_time
        eta = (elapsed / current) * (total - current) if current > 0 else 0

        sys.stdout.write(f'\r[{bar}] {percent}% | ETA: {eta:.1f}s')
        sys.stdout.flush()
        time.sleep(0.1)

    print('\n✓ Complete')

# Typewriter effect
def typewriter(text, delay=0.05):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

# Pulsing indicator
def pulse_indicator(duration=3):
    chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂']
    end_time = time.time() + duration
    i = 0

    while time.time() < end_time:
        sys.stdout.write(f'\r{chars[i % len(chars)]} Processing...')
        sys.stdout.flush()
        i += 1
        time.sleep(0.1)

    sys.stdout.write('\r✓ Complete!   \n')

# Uncomment to run:
# progress_with_eta(100)
# typewriter("Building your application...")
# pulse_indicator(3)
```

### Feedback Timing
- Immediate: Keystroke echo
- Sub-second: Command acknowledgment
- Persistent: Output remains scrollable

**Try it yourself:**

```bash
# Demonstrate different timing patterns
echo "Immediate feedback:"
read -p "Type something: " input
echo "You typed: $input"

echo ""
echo "Sub-second acknowledgment:"
echo -n "Running command... "
sleep 0.3
echo "✓"

echo ""
echo "Persistent history:"
echo "Command 1 output"
echo "Command 2 output"
echo "Command 3 output"
echo "(All remain scrollable)"
```

```javascript
// Node.js: Feedback timing patterns
const readline = require('readline');

// Immediate keystroke echo
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Immediate feedback:');
rl.question('Type something: ', (answer) => {
  console.log(`You typed: ${answer}`);

  // Sub-second acknowledgment
  console.log('\nSub-second acknowledgment:');
  process.stdout.write('Running command... ');

  setTimeout(() => {
    console.log('✓');

    // Persistent output
    console.log('\nPersistent history:');
    console.log('Command 1: ✓ Completed');
    console.log('Command 2: ✓ Completed');
    console.log('Command 3: ✓ Completed');
    console.log('(Scroll up to see all output)');

    rl.close();
  }, 300);
});

// Debounced input example
let timeout;
process.stdin.on('data', (key) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log('Input stabilized');
  }, 500);
});
```

```python
# Python: Timing and feedback patterns
import sys
import time
import select

# Immediate echo
print("Immediate feedback:")
user_input = input("Type something: ")
print(f"You typed: {user_input}")

# Sub-second acknowledgment
print("\nSub-second acknowledgment:")
sys.stdout.write("Running command... ")
sys.stdout.flush()
time.sleep(0.3)
print("✓")

# Persistent output demonstration
print("\nPersistent history:")
commands = [
    "Initialize project",
    "Install dependencies",
    "Run tests",
    "Build production bundle"
]

for i, cmd in enumerate(commands, 1):
    print(f"Step {i}: {cmd}")
    time.sleep(0.2)
    print(f"  ✓ Complete")

print("\n(All output remains scrollable)")

# Real-time character input (Unix-like systems)
def immediate_char_feedback():
    import tty
    import termios

    print("\nType characters (ESC to exit):")
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)

    try:
        tty.setraw(sys.stdin.fileno())
        while True:
            ch = sys.stdin.read(1)
            if ord(ch) == 27:  # ESC
                break
            print(f'\rYou pressed: {ch}', end='', flush=True)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        print('\n')

# Uncomment to try immediate character feedback:
# immediate_char_feedback()
```

---

## Interactive Materials

### Prompt Structures
```
user@host:~/path$          — standard shell prompt
[context] command >        — semantic prompt
? Select option:           — interactive question
↳ nested input             — follow-up prompts
```

**Try it yourself:**

```bash
# Different prompt styles
echo "user@$(hostname):$(pwd)\$"

# Semantic prompt
echo "[build] command > npm run build"

# Interactive question
read -p "? Select environment (dev/prod): " env
echo "You selected: $env"

# Nested prompt flow
echo "Installing package..."
read -p "  ↳ Enter version (default: latest): " version
version=${version:-latest}
echo "  Installing version: $version"

# Multi-step wizard
echo "Setup Wizard:"
read -p "  1. Project name: " name
read -p "  2. Author: " author
read -p "  3. License (MIT): " license
license=${license:-MIT}
echo ""
echo "✓ Created project '$name' by $author ($license)"
```

```javascript
// Node.js: Interactive prompt patterns
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Chain of prompts
function setupWizard() {
  console.log('Project Setup:');

  rl.question('? Project name: ', (name) => {
    rl.question('? Package manager (npm/yarn/pnpm): ', (pm) => {
      rl.question('  ↳ Install dependencies? (y/n): ', (install) => {

        console.log('\nConfiguration:');
        console.log(`  Name: ${name}`);
        console.log(`  PM: ${pm}`);
        console.log(`  Install: ${install === 'y' ? 'Yes' : 'No'}`);

        rl.close();
      });
    });
  });
}

// Confirmation with default
function confirm(question, defaultYes = true) {
  const suffix = defaultYes ? '(Y/n)' : '(y/N)';
  rl.question(`${question} ${suffix}: `, (answer) => {
    const normalized = answer.toLowerCase() || (defaultYes ? 'y' : 'n');
    console.log(normalized === 'y' ? '✓ Confirmed' : '✗ Cancelled');
    rl.close();
  });
}

// Context-aware prompt
function contextPrompt(context, command) {
  return `[${context}] > ${command}`;
}

console.log(contextPrompt('git:main', 'git status'));
console.log(contextPrompt('docker', 'ps -a'));

// setupWizard();
// confirm('Delete all files?', false);
```

```python
# Python: Prompt structures and input patterns
import sys

# Different prompt styles
def shell_prompt():
    import os
    hostname = os.uname().nodename
    cwd = os.getcwd()
    return f"{os.getenv('USER')}@{hostname}:{cwd}$"

print(shell_prompt())

# Semantic prompts
def semantic_prompt(context, default=''):
    prompt = f"[{context}] > "
    return input(prompt)

# Interactive questionnaire
def setup_wizard():
    print("Project Setup:")
    name = input("? Project name: ")
    author = input("? Author: ")
    license = input("? License (MIT): ") or "MIT"

    print(f"\n✓ Created '{name}' by {author}")
    print(f"  License: {license}")

# Nested prompts
def nested_prompts():
    print("Configure deployment:")
    env = input("? Environment (dev/staging/prod): ")

    if env == 'prod':
        confirm = input("  ↳ Are you sure? (y/n): ")
        if confirm.lower() != 'y':
            print("  ✗ Cancelled")
            return

    region = input("  ↳ Region (us-east-1): ") or "us-east-1"
    print(f"\n✓ Deploying to {env} in {region}")

# Confirmation with default
def confirm(question, default=True):
    suffix = "(Y/n)" if default else "(y/N)"
    response = input(f"{question} {suffix}: ").lower()

    if not response:
        return default

    return response in ['y', 'yes']

# Usage examples:
# setup_wizard()
# nested_prompts()
# if confirm("Continue?", True):
#     print("Proceeding...")
```

### Input Patterns
- **Inline editing**: Cursor position, character insertion
- **Tab completion**: Ghost text, suggestion menus
- **Selection menus**: Arrow navigation, highlighted options
- **Confirmation patterns**: [y/n], press any key, countdown timers

**Try it yourself:**

```bash
# Inline editing with read
echo "Editing example (use arrow keys, backspace):"
read -e -p "Edit this text: " -i "default value" result
echo "Result: $result"

# Simple selection menu
echo "Select an option:"
options=("Option 1" "Option 2" "Option 3" "Quit")
select opt in "${options[@]}"; do
  case $opt in
    "Option 1") echo "You chose 1"; break;;
    "Option 2") echo "You chose 2"; break;;
    "Option 3") echo "You chose 3"; break;;
    "Quit") break;;
  esac
done

# Yes/No confirmation
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "✓ Proceeding..."
else
  echo "✗ Cancelled"
fi

# Press any key
read -n 1 -s -r -p "Press any key to continue..."
echo ""

# Countdown timer
for i in {5..1}; do
  echo -ne "\rStarting in $i..."
  sleep 1
done
echo -e "\r✓ Started!     "
```

```javascript
// Node.js: Advanced input patterns
const readline = require('readline');

// Arrow key navigation menu
function selectionMenu(options) {
  let selected = 0;

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  function render() {
    console.clear();
    console.log('Select an option (↑/↓, Enter to confirm):\n');

    options.forEach((opt, i) => {
      const prefix = i === selected ? '●' : '○';
      const style = i === selected ? '\x1b[7m' : ''; // inverse
      const reset = '\x1b[0m';
      console.log(`  ${prefix} ${style}${opt}${reset}`);
    });
  }

  render();

  process.stdin.on('keypress', (str, key) => {
    if (key.name === 'up' && selected > 0) {
      selected--;
      render();
    } else if (key.name === 'down' && selected < options.length - 1) {
      selected++;
      render();
    } else if (key.name === 'return') {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      console.log(`\n✓ Selected: ${options[selected]}`);
    } else if (key.ctrl && key.name === 'c') {
      process.exit();
    }
  });
}

// Countdown timer
function countdown(seconds) {
  return new Promise((resolve) => {
    let remaining = seconds;

    const interval = setInterval(() => {
      process.stdout.write(`\rStarting in ${remaining}...`);
      remaining--;

      if (remaining < 0) {
        clearInterval(interval);
        process.stdout.write('\r✓ Started!       \n');
        resolve();
      }
    }, 1000);
  });
}

// Autocomplete suggestion
function autocomplete(input, suggestions) {
  const matches = suggestions.filter(s =>
    s.toLowerCase().startsWith(input.toLowerCase())
  );

  if (matches.length === 1 && input) {
    const suggestion = matches[0];
    const ghost = suggestion.slice(input.length);
    return `${input}\x1b[2m${ghost}\x1b[0m`;
  }

  return input;
}

// Usage:
// selectionMenu(['Deploy to staging', 'Deploy to production', 'Cancel']);
// countdown(5);
// console.log(autocomplete('he', ['hello', 'help', 'header']));
```

```python
# Python: Interactive input patterns
import sys
import tty
import termios
import time

# Arrow key menu selection
def selection_menu(options):
    """Interactive menu with arrow key navigation (Unix-like systems)"""
    selected = 0

    def render():
        sys.stdout.write('\033[2J\033[H')  # Clear screen
        print('Select an option (↑/↓, Enter to confirm):\n')

        for i, opt in enumerate(options):
            prefix = '●' if i == selected else '○'
            style = '\033[7m' if i == selected else ''
            reset = '\033[0m'
            print(f"  {prefix} {style}{opt}{reset}")

        sys.stdout.flush()

    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)

    try:
        tty.setraw(sys.stdin.fileno())
        render()

        while True:
            ch = sys.stdin.read(1)

            if ch == '\x1b':  # Arrow keys
                sys.stdin.read(1)  # '['
                direction = sys.stdin.read(1)

                if direction == 'A' and selected > 0:  # Up
                    selected -= 1
                    render()
                elif direction == 'B' and selected < len(options) - 1:  # Down
                    selected += 1
                    render()

            elif ch == '\r':  # Enter
                break
            elif ch == '\x03':  # Ctrl+C
                raise KeyboardInterrupt

    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        print(f'\n\n✓ Selected: {options[selected]}')

# Countdown timer
def countdown(seconds):
    for i in range(seconds, 0, -1):
        sys.stdout.write(f'\rStarting in {i}...')
        sys.stdout.flush()
        time.sleep(1)
    sys.stdout.write('\r✓ Started!       \n')

# Simple confirmation
def confirm(message, default=True):
    suffix = "(Y/n)" if default else "(y/N)"
    response = input(f"{message} {suffix}: ").strip().lower()

    if not response:
        return default

    return response in ['y', 'yes']

# Press any key
def press_any_key(message="Press any key to continue..."):
    print(message, end='', flush=True)

    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)

    try:
        tty.setraw(sys.stdin.fileno())
        sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        print()

# Usage examples:
# selection_menu(['Deploy staging', 'Deploy production', 'Cancel'])
# countdown(5)
# if confirm("Delete file?", False):
#     print("File deleted")
# press_any_key()
```

---

## Output Zones

### Stream Semantics
- **stdout**: Primary output stream (normal text)
- **stderr**: Error stream (often red-tinted or separate)
- **Interleaving**: How commands mix output types

**Try it yourself:**

```bash
# stdout vs stderr demonstration
echo "This goes to stdout"
echo "This goes to stderr" >&2

# Separate streams with colors
echo -e "\033[32mSuccess: Operation complete\033[0m"  # stdout (green)
echo -e "\033[31mError: Something failed\033[0m" >&2  # stderr (red)

# Redirect to see the difference
echo "Normal output" > output.txt
echo "Error message" >&2 > errors.txt

# Mixed output (interleaving)
{
  echo "Step 1: Starting..."
  echo "Warning: Low memory" >&2
  echo "Step 2: Processing..."
  echo "Error: File not found" >&2
  echo "Step 3: Complete"
} 2>&1 | cat  # Merges stderr into stdout

# Practical example
log_info() { echo "ℹ $1"; }
log_error() { echo -e "\033[31m✗ $1\033[0m" >&2; }

log_info "Deployment started"
log_error "Connection timeout"
log_info "Retrying..."
```

```javascript
// Node.js: Stream handling
// stdout for normal output
process.stdout.write('Normal output\n');
console.log('This goes to stdout');

// stderr for errors
process.stderr.write('\x1b[31mError output\x1b[0m\n');
console.error('This goes to stderr');

// Structured logging to different streams
const logger = {
  info: (msg) => console.log(`\x1b[34mℹ ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m✓ ${msg}\x1b[0m`),
  warn: (msg) => console.warn(`\x1b[33m⚠ ${msg}\x1b[0m`),
  error: (msg) => console.error(`\x1b[31m✗ ${msg}\x1b[0m`),
};

logger.info('Starting deployment...');
logger.success('Build completed');
logger.warn('Slow network detected');
logger.error('Deployment failed');

// Capture and separate streams
const { spawn } = require('child_process');

const child = spawn('npm', ['install']);

child.stdout.on('data', (data) => {
  process.stdout.write(`OUT: ${data}`);
});

child.stderr.on('data', (data) => {
  process.stderr.write(`ERR: ${data}`);
});
```

```python
# Python: Stream handling
import sys

# stdout (normal output)
print("This goes to stdout")
sys.stdout.write("Direct stdout write\n")

# stderr (errors and warnings)
print("This goes to stderr", file=sys.stderr)
sys.stderr.write("\033[31mError message\033[0m\n")

# Structured logging
class Logger:
    @staticmethod
    def info(msg):
        print(f"\033[34mℹ {msg}\033[0m")

    @staticmethod
    def success(msg):
        print(f"\033[32m✓ {msg}\033[0m")

    @staticmethod
    def warn(msg):
        print(f"\033[33m⚠ {msg}\033[0m", file=sys.stderr)

    @staticmethod
    def error(msg):
        print(f"\033[31m✗ {msg}\033[0m", file=sys.stderr)

# Usage
Logger.info("Starting process...")
Logger.success("Task completed")
Logger.warn("Low disk space")
Logger.error("Operation failed")

# Flush for immediate output
sys.stdout.write("Loading...")
sys.stdout.flush()  # Ensures immediate display

# Interleaved output example
def process_with_output():
    print("Step 1: Initialize")
    print("Warning: Deprecated API", file=sys.stderr)
    print("Step 2: Execute")
    print("Error: Connection lost", file=sys.stderr)
    print("Step 3: Cleanup")

process_with_output()
```

### Scrollback Behavior
- **Persistent history**: Previous commands remain visible
- **Screen clearing**: `clear` command for fresh context
- **Paging**: `less`, `more` for long output

**Try it yourself:**

```bash
# Demonstrate scrollback
for i in {1..50}; do
  echo "Line $i"
done
echo "You can scroll up to see all lines"

# Clear screen for fresh start
clear
echo "Screen cleared - previous output hidden"

# Conditional clearing
read -p "Clear screen? (y/n): " answer
if [[ $answer == "y" ]]; then
  clear
fi

# Paging long output
echo "Long output:"
seq 1 100 | less  # Press 'q' to quit

# Or with more (simpler)
seq 1 100 | more

# Auto-page if output is long
lines=$(tput lines)
output_lines=100

if [ $output_lines -gt $lines ]; then
  seq 1 100 | less
else
  seq 1 100
fi

# Clear specific lines (overwrite instead of scroll)
for i in {1..10}; do
  echo -ne "\rProcessing... $i/10"
  sleep 0.2
done
echo -e "\r✓ Complete!        "
```

```javascript
// Node.js: Screen management
const readline = require('readline');

// Clear screen
function clearScreen() {
  console.clear();
  // Or manually:
  // process.stdout.write('\x1b[2J\x1b[H');
}

// Persistent scrollback
function generateOutput(lines) {
  for (let i = 1; i <= lines; i++) {
    console.log(`Line ${i}`);
  }
  console.log('\n↑ Scroll up to see all output');
}

// Overwrite lines (no scrollback)
function updateInPlace(total) {
  for (let i = 0; i <= total; i++) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Processing... ${i}/${total}`);
  }
  console.log('\n✓ Complete!');
}

// Smart paging for long output
function displayWithPaging(lines) {
  const terminalHeight = process.stdout.rows || 24;

  if (lines.length > terminalHeight - 5) {
    console.log('Output is long. Showing first page...');
    console.log(lines.slice(0, terminalHeight - 5).join('\n'));
    console.log('\n(Use scrollback or pipe to less)');
  } else {
    console.log(lines.join('\n'));
  }
}

// Usage examples:
// clearScreen();
// generateOutput(50);
// updateInPlace(10);
// displayWithPaging(Array.from({length: 100}, (_, i) => `Line ${i + 1}`));

// Clear and show header
clearScreen();
console.log('╔════════════════════╗');
console.log('║  Fresh Start       ║');
console.log('╚════════════════════╝\n');
```

```python
# Python: Screen and scrollback management
import sys
import os
import time

# Clear screen
def clear_screen():
    os.system('clear' if os.name == 'posix' else 'cls')

# Generate scrollable output
def generate_output(lines):
    for i in range(1, lines + 1):
        print(f"Line {i}")
    print("\n↑ Scroll up to see all output")

# Update in place (no scrollback)
def update_in_place(total):
    for i in range(total + 1):
        sys.stdout.write(f'\rProcessing... {i}/{total}')
        sys.stdout.flush()
        time.sleep(0.1)
    sys.stdout.write('\r✓ Complete!        \n')

# Smart paging
def display_with_paging(lines):
    try:
        term_height = os.get_terminal_size().lines
    except:
        term_height = 24

    if len(lines) > term_height - 5:
        print("Output is long. Showing first page...")
        print('\n'.join(lines[:term_height - 5]))
        print("\n(Scroll up or pipe to less)")
    else:
        print('\n'.join(lines))

# Move cursor (ANSI escape codes)
def move_cursor(row, col):
    sys.stdout.write(f'\033[{row};{col}H')

def save_cursor():
    sys.stdout.write('\033[s')

def restore_cursor():
    sys.stdout.write('\033[u')

# Demo: Persistent vs ephemeral output
def demo_output_modes():
    print("Persistent output (creates scrollback):")
    for i in range(5):
        print(f"  Item {i + 1}")

    print("\nEphemeral output (overwrites):")
    for i in range(5):
        sys.stdout.write(f'\r  Loading: {"█" * (i + 1)}')
        sys.stdout.flush()
        time.sleep(0.3)
    print('\r  ✓ Done!     ')

# Usage:
# clear_screen()
# generate_output(50)
# update_in_place(10)
# demo_output_modes()

# Clear and show banner
clear_screen()
print("╔════════════════════╗")
print("║  Fresh Terminal    ║")
print("╚════════════════════╝\n")
```

---

## Compositional Patterns

### Information Density Modes

**Minimal:**
```
> command
OK
```

**Structured:**
```
Processing files...
  ✓ file1.txt (0.2s)
  ✓ file2.txt (0.1s)
Done. 2 files processed.
```

**Rich:**
```
╭─ Build Summary ────────────────────╮
│ Files processed:  245              │
│ Duration:         3.2s             │
│ Status:           ✓ Success        │
╰────────────────────────────────────╯
```

**Try it yourself:**

```bash
# Minimal mode - quick acknowledgment
echo "> deploy"
echo "OK"

# Structured mode - detailed progress
echo "Building project..."
echo "  ✓ Compile (0.3s)"
echo "  ✓ Bundle (1.2s)"
echo "  ✓ Minify (0.5s)"
echo "Done. 3 steps completed in 2.0s"

# Rich mode - formatted summary
cat << 'EOF'
╭─ Deployment Summary ───────────────────╮
│ Environment:      production           │
│ Region:           us-east-1            │
│ Deployed:         12 services          │
│ Duration:         45.3s                │
│ Status:           ✓ Success            │
╰────────────────────────────────────────╯
EOF

# Context-aware verbosity
VERBOSE=true

if [ "$VERBOSE" = true ]; then
  echo "Detailed output:"
  echo "  → Initializing..."
  echo "  → Processing item 1"
  echo "  → Processing item 2"
  echo "  ✓ Complete"
else
  echo "✓ Done"
fi

# Progress with optional detail
echo "Installing packages..."
for pkg in "react" "vue" "angular"; do
  echo "  → $pkg"
  # Add --quiet flag to suppress
done
echo "✓ Installed 3 packages"
```

```javascript
// Node.js: Different verbosity levels
const VerbosityLevel = {
  SILENT: 0,
  MINIMAL: 1,
  STRUCTURED: 2,
  RICH: 3
};

let verbosity = VerbosityLevel.STRUCTURED;

// Output functions for each level
function output(level, message) {
  if (verbosity >= level) {
    console.log(message);
  }
}

// Minimal
function minimalOutput() {
  output(VerbosityLevel.MINIMAL, '> deploy');
  output(VerbosityLevel.MINIMAL, 'OK');
}

// Structured
function structuredOutput() {
  output(VerbosityLevel.STRUCTURED, 'Building project...');
  output(VerbosityLevel.STRUCTURED, '  ✓ Compile (0.3s)');
  output(VerbosityLevel.STRUCTURED, '  ✓ Bundle (1.2s)');
  output(VerbosityLevel.STRUCTURED, '  ✓ Minify (0.5s)');
  output(VerbosityLevel.STRUCTURED, 'Done. 3 steps in 2.0s');
}

// Rich
function richOutput(data) {
  if (verbosity < VerbosityLevel.RICH) {
    console.log(`✓ ${data.service} deployed`);
    return;
  }

  const width = 40;
  const line = (text) => {
    const padding = width - text.length - 2;
    return `│ ${text}${' '.repeat(padding)} │`;
  };

  console.log('╭─ Deployment Summary ' + '─'.repeat(width - 23) + '╮');
  console.log(line(`Environment:      ${data.env}`));
  console.log(line(`Region:           ${data.region}`));
  console.log(line(`Duration:         ${data.duration}s`));
  console.log(line(`Status:           ✓ Success`));
  console.log('╰' + '─'.repeat(width) + '╯');
}

// Usage with flags
const args = process.argv.slice(2);
if (args.includes('--quiet')) verbosity = VerbosityLevel.MINIMAL;
if (args.includes('--verbose')) verbosity = VerbosityLevel.RICH;

// Example outputs
// minimalOutput();
// structuredOutput();
richOutput({
  env: 'production',
  region: 'us-east-1',
  duration: 45.3,
  service: 'api'
});
```

```python
# Python: Verbosity levels and formatting
from enum import IntEnum

class Verbosity(IntEnum):
    SILENT = 0
    MINIMAL = 1
    STRUCTURED = 2
    RICH = 3

verbosity = Verbosity.STRUCTURED

def output(level, message):
    if verbosity >= level:
        print(message)

# Minimal mode
def minimal_output():
    output(Verbosity.MINIMAL, "> deploy")
    output(Verbosity.MINIMAL, "OK")

# Structured mode
def structured_output():
    output(Verbosity.STRUCTURED, "Building project...")
    output(Verbosity.STRUCTURED, "  ✓ Compile (0.3s)")
    output(Verbosity.STRUCTURED, "  ✓ Bundle (1.2s)")
    output(Verbosity.STRUCTURED, "  ✓ Minify (0.5s)")
    output(Verbosity.STRUCTURED, "Done. 3 steps in 2.0s")

# Rich mode with box drawing
def rich_output(data):
    if verbosity < Verbosity.RICH:
        print(f"✓ {data['service']} deployed")
        return

    width = 40

    def line(text):
        padding = width - len(text) - 2
        return f"│ {text}{' ' * padding} │"

    print("╭─ Deployment Summary " + "─" * (width - 23) + "╮")
    print(line(f"Environment:      {data['env']}"))
    print(line(f"Region:           {data['region']}"))
    print(line(f"Duration:         {data['duration']}s"))
    print(line(f"Status:           ✓ Success"))
    print("╰" + "─" * width + "╯")

# Table formatting (structured)
def format_table(data):
    headers = ["Name", "Status", "Time"]
    rows = data

    # Calculate column widths
    widths = [
        max(len(str(row[i])) for row in [headers] + rows)
        for i in range(len(headers))
    ]

    # Print header
    header_row = " │ ".join(
        headers[i].ljust(widths[i]) for i in range(len(headers))
    )
    print(header_row)
    print("─" * (sum(widths) + 3 * (len(headers) - 1)))

    # Print rows
    for row in rows:
        print(" │ ".join(
            str(row[i]).ljust(widths[i]) for i in range(len(row))
        ))

# Usage
# minimal_output()
# structured_output()
rich_output({
    'env': 'production',
    'region': 'us-east-1',
    'duration': 45.3,
    'service': 'api'
})

# Table example
print("\nBuild Results:")
format_table([
    ["index.js", "✓ Pass", "0.3s"],
    ["app.js", "✓ Pass", "1.2s"],
    ["test.js", "✗ Fail", "0.1s"],
])
```

### Reading Rhythm
- **Left-edge scanning**: Eye starts at column 0
- **Indentation as hierarchy**: Visual nesting matches conceptual depth
- **Punctuation moments**: Symbols create micro-pauses
- **Vertical chunking**: Line breaks separate thoughts

**Try it yourself:**

```bash
# Left-edge alignment - all important info starts at column 0
echo "✓ Build complete"
echo "✗ Tests failed"
echo "⚠ 3 warnings"

# Good: Easy to scan
echo "deploy: success"
echo "tests:  failed"
echo "lint:   passed"

# Bad: Hard to scan (important info buried)
echo "The deployment was successful"
echo "The tests have failed"
echo "The linter has passed"

# Indentation for hierarchy
echo "Project Status:"
echo "  Backend:"
echo "    API: running"
echo "    DB:  connected"
echo "  Frontend:"
echo "    Build: complete"
echo "    Serve: port 3000"

# Vertical chunking for thought separation
echo "Step 1: Initialize"
echo "  Loading config..."
echo "  ✓ Done"
echo ""  # Blank line = conceptual break
echo "Step 2: Build"
echo "  Compiling..."
echo "  ✓ Done"
echo ""
echo "Step 3: Deploy"
echo "  Uploading..."
echo "  ✓ Done"

# Symbols create visual rhythm
echo "→ Starting"
echo "→ Processing"
echo "→ Validating"
echo "⇒ Complete"
```

```javascript
// Node.js: Reading rhythm and hierarchy
// Left-edge dominance - status first
function formatStatus(items) {
  items.forEach(item => {
    const status = item.success ? '✓' : '✗';
    const color = item.success ? '\x1b[32m' : '\x1b[31m';
    console.log(`${color}${status}\x1b[0m ${item.name}: ${item.message}`);
  });
}

formatStatus([
  { name: 'Build', success: true, message: 'completed in 2.3s' },
  { name: 'Tests', success: false, message: '3 failures' },
  { name: 'Lint', success: true, message: 'no issues' }
]);

// Hierarchical indentation
function printHierarchy(obj, indent = 0) {
  const prefix = '  '.repeat(indent);

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      console.log(`${prefix}${key}:`);
      printHierarchy(value, indent + 1);
    } else {
      console.log(`${prefix}${key}: ${value}`);
    }
  }
}

printHierarchy({
  'Backend': {
    'API': 'running',
    'Database': 'connected'
  },
  'Frontend': {
    'Build': 'complete',
    'Server': 'port 3000'
  }
});

// Vertical chunking with separators
function multiStepProcess(steps) {
  steps.forEach((step, i) => {
    console.log(`Step ${i + 1}: ${step.name}`);
    console.log(`  ${step.description}`);
    console.log(`  ✓ ${step.result}`);

    if (i < steps.length - 1) {
      console.log(''); // Conceptual break
    }
  });
}

multiStepProcess([
  { name: 'Initialize', description: 'Loading config...', result: 'Done' },
  { name: 'Build', description: 'Compiling...', result: 'Done' },
  { name: 'Deploy', description: 'Uploading...', result: 'Done' }
]);

// Progressive disclosure
function showProgress(level) {
  // Level 1: Just the essentials (left edge)
  console.log('✓ Deployment complete');

  // Level 2: Add context
  if (level >= 2) {
    console.log('  Duration: 45s');
    console.log('  Region: us-east-1');
  }

  // Level 3: Full details with hierarchy
  if (level >= 3) {
    console.log('  Services:');
    console.log('    → API');
    console.log('    → Worker');
    console.log('    → Cache');
  }
}

// showProgress(3);
```

```python
# Python: Visual rhythm and scanability
# Left-edge alignment for quick scanning
def format_status(items):
    for item in items:
        status = "✓" if item['success'] else "✗"
        color = "\033[32m" if item['success'] else "\033[31m"
        print(f"{color}{status}\033[0m {item['name']}: {item['message']}")

format_status([
    {'name': 'Build', 'success': True, 'message': 'completed in 2.3s'},
    {'name': 'Tests', 'success': False, 'message': '3 failures'},
    {'name': 'Lint', 'success': True, 'message': 'no issues'}
])

# Hierarchical nesting
def print_hierarchy(obj, indent=0):
    prefix = "  " * indent

    for key, value in obj.items():
        if isinstance(value, dict):
            print(f"{prefix}{key}:")
            print_hierarchy(value, indent + 1)
        else:
            print(f"{prefix}{key}: {value}")

print("\nSystem Status:")
print_hierarchy({
    'Backend': {
        'API': 'running',
        'Database': 'connected'
    },
    'Frontend': {
        'Build': 'complete',
        'Server': 'port 3000'
    }
})

# Vertical rhythm with separators
def multi_step_process(steps):
    for i, step in enumerate(steps):
        print(f"\nStep {i + 1}: {step['name']}")
        print(f"  {step['description']}")
        print(f"  ✓ {step['result']}")

        if i < len(steps) - 1:
            print()  # Conceptual break

multi_step_process([
    {'name': 'Initialize', 'description': 'Loading config...', 'result': 'Done'},
    {'name': 'Build', 'description': 'Compiling...', 'result': 'Done'},
    {'name': 'Deploy', 'description': 'Uploading...', 'result': 'Done'}
])

# Scannable lists with consistent rhythm
def format_list(items, symbol="→"):
    max_len = max(len(item['name']) for item in items)

    for item in items:
        name = item['name'].ljust(max_len)
        print(f"  {symbol} {name}  {item['status']}")

print("\nTasks:")
format_list([
    {'name': 'Install deps', 'status': '✓ Done'},
    {'name': 'Run tests', 'status': '● In progress'},
    {'name': 'Deploy', 'status': '○ Pending'}
], symbol="→")
```

---

## Design Constraints

### What You Cannot Do
- Position elements at pixel coordinates
- Use proportional fonts
- Rely on hover states
- Assume color support
- Display multiple overlapping layers

### What This Enables
- Universal accessibility (screen readers parse linearly)
- Predictable copy/paste behavior
- SSH-friendly remote operation
- Scriptable, parseable output
- Low bandwidth operation

---

## Material Philosophy

CLI is **typography-first design**. You're composing with:
- Rhythm (vertical spacing)
- Hierarchy (indentation, weight)
- Emphasis (color, symbols)
- Flow (left-to-right, top-to-bottom)

The constraint of the character grid creates a **design language of restraint** — where every choice matters because options are limited.

---

*This is not decoration. This is information architecture expressed through constrained materials.*