// Code examples database
const examples = {
    'grid-bash': `Terminal width: 80 columns
================================================================================`,

    'grid-js': `Terminal: 80 cols × 24 rows
────────────────────────────────────────────────────────────────────────────────
Every character takes one cell
────────────────────────────────────────────────────────────────────────────────`,

    'grid-python': `Terminal: 80 cols × 24 rows
────────────────────────────────────────────────────────────────────────────────
                     Each character occupies one cell
────────────────────────────────────────────────────────────────────────────────`,

    'tree-bash': `project
├── src
│   ├── index.js
│   └── utils.js
└── package.json`,

    'tree-js': `└── src
└──   index.js
└──   utils.js
└── package.json`,

    'tree-python': `Root Item
  ├─ Child 1
  │  └─ Grandchild
  └─ Child 2

Next Section
  └─ New item`,

    'styles-bash': `<span style="font-weight: bold">Bold text</span>
<span style="opacity: 0.6">Dim text</span>
<span style="text-decoration: underline">Underlined</span>
<span style="background: #fff; color: #000">Inverse</span>
<span style="text-decoration: line-through">Strikethrough</span>`,

    'styles-js': `<span style="font-weight: bold">Bold text</span>
<span style="opacity: 0.6">Dim text</span>
<span style="text-decoration: underline">Underlined</span>`,

    'colors-bash': `<span style="color: #000">Black</span> (30) / <span style="color: #808080">Bright Black</span> (90)
<span style="color: #c00">Red</span> (31) / <span style="color: #f00">Bright Red</span> (91)
<span style="color: #0c0">Green</span> (32) / <span style="color: #0f0">Bright Green</span> (92)
<span style="color: #c80">Yellow</span> (33) / <span style="color: #ff0">Bright Yellow</span> (93)
<span style="color: #00c">Blue</span> (34) / <span style="color: #00f">Bright Blue</span> (94)
<span style="color: #c0c">Magenta</span> (35) / <span style="color: #f0f">Bright Magenta</span> (95)
<span style="color: #0cc">Cyan</span> (36) / <span style="color: #0ff">Bright Cyan</span> (96)
<span style="color: #ccc">White</span> (37) / <span style="color: #fff">Bright White</span> (97)`,

    'colors-js': `<span style="color: #0f0">✓ Success</span>
<span style="color: #f00">✗ Error</span>
<span style="color: #ff0">⚠ Warning</span>`,

    'symbols-bash': `Status & Completion:
  ✓ Success  ✗ Failed  ⚠ Warning  ℹ Info

Tree Structure:
  ├── src
  │   └── index.js
  └── package.json

Progress:
  ● ○ ○ ○ ○  [20%]
  ■ ■ ■ □ □  [60%]

Arrows & Navigation:
  → Next  ← Back  ↑ Up  ↓ Down`,

    'progress-bash': `[█    ] 20%
[██   ] 40%
[███  ] 60%
[████ ] 80%
[█████] 100%`,

    'interactive-bash': `? Select environment: dev
You selected: dev`
};

// Copy language button functionality
document.querySelectorAll('.copy-lang-btn').forEach(button => {
    button.addEventListener('click', function() {
        const code = this.dataset.code;
        const originalText = this.textContent;

        navigator.clipboard.writeText(code).then(() => {
            this.classList.add('copied');
            this.textContent = 'Copied!';

            setTimeout(() => {
                this.classList.remove('copied');
                this.textContent = originalText;
            }, 2000);
        });
    });
});

// Execute button functionality
document.querySelectorAll('.execute-btn').forEach(button => {
    button.addEventListener('click', function() {
        const exampleKey = this.dataset.example;
        const outputId = `output-${exampleKey}`;
        const outputElement = document.getElementById(outputId);

        if (outputElement) {
            // Special handling for progress/temporal animations
            if (exampleKey === 'progress') {
                animateProgress(outputElement);
            } else if (exampleKey === 'blink') {
                animateBlinkingText(outputElement);
            } else if (exampleKey === 'tasks') {
                animateTaskList(outputElement);
            } else if (exampleKey === 'menu') {
                animateMenuSelection(outputElement);
            } else if (exampleKey === 'checkbox') {
                animateCheckboxRadio(outputElement);
            } else if (exampleKey === 'confirm') {
                animateConfirmation(outputElement);
            } else if (exampleKey === 'tabs') {
                animateTabNavigation(outputElement);
            } else if (exampleKey === 'diff') {
                animateDiff(outputElement);
            } else if (exampleKey === 'status') {
                animateStatusDetails(outputElement);
            } else if (examples[`${exampleKey}-bash`]) {
                outputElement.innerHTML = examples[`${exampleKey}-bash`];
            }
        }
    });
});

// Animate progress indicators
function animateProgress(element) {
    const spinners = {
        braille: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        dots: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
        circles: ['◐', '◓', '◑', '◒']
    };

    const progressTypes = {
        eighthBlocks: ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'],
        shading: ['░', '▒', '▓', '█'],
        vertical: ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
    };

    const animations = {
        cornerArcs: ['◜', '◝', '◞', '◟'],
        cornerBoxes: ['▖', '▘', '▝', '▗'],
        sizeProgression: ['⋅', '∙', '·', '•', '●'],
        dotPulse: ['·', '•', '●', '•', '·'],
        circlePulse: ['∘', '○', '◯', '○', '∘'],
        twinkling: ['✦', '✧', '★', '✧', '✦'],
        burst: ['✶', '✷', '✸', '✹']
    };

    let frame = 0;
    let progress = 0;

    const interval = setInterval(() => {
        const braille = spinners.braille[frame % spinners.braille.length];
        const dotsSpin = spinners.dots[frame % spinners.dots.length];
        const circle = spinners.circles[frame % spinners.circles.length];

        const cornerArc = animations.cornerArcs[frame % animations.cornerArcs.length];
        const cornerBox = animations.cornerBoxes[frame % animations.cornerBoxes.length];
        const sizeProg = animations.sizeProgression[frame % animations.sizeProgression.length];
        const dotPulse = animations.dotPulse[frame % animations.dotPulse.length];
        const circlePulse = animations.circlePulse[frame % animations.circlePulse.length];
        const twinkle = animations.twinkling[frame % animations.twinkling.length];
        const burst = animations.burst[frame % animations.burst.length];

        // Progress bars - cycle between 0-100%
        const progressPercent = Math.floor(progress / 10);
        const eighthBar = '█'.repeat(progressPercent) + ' '.repeat(10 - progressPercent);
        const shadingBar = progressTypes.shading[Math.min(3, Math.floor(progress / 25))].repeat(10);
        const verticalBar = progressTypes.vertical[Math.min(7, Math.floor(progress / 12.5))].repeat(5);

        element.innerHTML = `<span style="color: #0cc">Spinning:</span>
Braille:  ${braille} Loading...
Dots:     ${dotsSpin} Processing...
Circles:  ${circle} Working...

<span style="color: #0cc">Progress Bars:</span>
Eighth:   [${eighthBar}] ${progress}%

<span style="color: #0cc">Block Style:</span>
Shading:  ${shadingBar}
Vertical: ${verticalBar}

<span style="color: #0cc">Animations:</span>
Corners:  ${cornerArc} ${cornerBox} Size: ${sizeProg}
Pulsing:  ${dotPulse} ${circlePulse}
Stars:    ${twinkle} ${burst}`;

        frame++;
        progress += 2;

        // Reset progress to 0 when it reaches 100, creating a continuous loop
        if (progress > 100) {
            progress = 0;
        }
    }, 100);
}

// Animate diff display
function animateDiff(element) {
    const diffSteps = [
        {
            title: 'Original SQL Query:',
            lines: [
                { type: 'normal', text: 'SELECT id, name, email' },
                { type: 'normal', text: 'FROM users' },
                { type: 'normal', text: 'WHERE status = \'active\'' },
                { type: 'normal', text: 'ORDER BY created_at DESC' },
                { type: 'normal', text: 'LIMIT 10;' }
            ],
            duration: 2000
        },
        {
            title: 'Modified SQL Query:',
            lines: [
                { type: 'removed', text: '- SELECT id, name, email' },
                { type: 'added', text: '+ SELECT id, name, email, phone' },
                { type: 'normal', text: '  FROM users' },
                { type: 'removed', text: '- WHERE status = \'active\'' },
                { type: 'added', text: '+ WHERE status = \'active\' AND verified = true' },
                { type: 'normal', text: '  ORDER BY created_at DESC' },
                { type: 'removed', text: '- LIMIT 10;' },
                { type: 'added', text: '+ LIMIT 25;' }
            ],
            duration: 0 // Stay on this screen
        }
    ];

    let currentStep = 0;

    function renderStep() {
        const step = diffSteps[currentStep];
        let output = `<span style="color: #fff">${step.title}</span>\n\n`;

        step.lines.forEach(line => {
            if (line.type === 'removed') {
                output += `<span style="background: #400; color: #f88">${line.text}</span>\n`;
            } else if (line.type === 'added') {
                output += `<span style="background: #040; color: #8f8">${line.text}</span>\n`;
            } else {
                output += `<span style="color: #999">${line.text}</span>\n`;
            }
        });

        element.innerHTML = output;

        if (currentStep < diffSteps.length - 1 && step.duration > 0) {
            setTimeout(() => {
                currentStep++;
                renderStep();
            }, step.duration);
        }
    }

    renderStep();
}

// Animate status with details
function animateStatusDetails(element) {
    const tasks = [
        {
            name: 'Database migration',
            status: 'success',
            details: [
                'Applied 3 migrations',
                'Updated schema version to 1.4.2',
                'Completed in 2.3s'
            ]
        },
        {
            name: 'API health check',
            status: 'success',
            details: [
                'Endpoint: https://api.example.com',
                'Response time: 145ms',
                'Status: 200 OK'
            ]
        },
        {
            name: 'Build production assets',
            status: 'error',
            details: [
                'Failed to compile src/utils/parser.js',
                'SyntaxError: Unexpected token (line 42)',
                'Build failed after 8.7s'
            ]
        },
        {
            name: 'Run test suite',
            status: 'success',
            details: [
                'Tests: 247 passed, 0 failed',
                'Coverage: 94.2%',
                'Duration: 12.4s'
            ]
        }
    ];

    let currentTaskIndex = 0;

    function renderTasks() {
        let output = '';

        tasks.forEach((task, index) => {
            if (index < currentTaskIndex) {
                const icon = task.status === 'success' ? '●' : '●';
                const color = task.status === 'success' ? '#0f0' : '#f00';

                output += `<span style="color: ${color}">${icon}</span> ${task.name}\n`;

                task.details.forEach(detail => {
                    output += `  <span style="color: #666">${detail}</span>\n`;
                });

                output += '\n';
            }
        });

        element.innerHTML = output.trim();
    }

    const interval = setInterval(() => {
        currentTaskIndex++;
        renderTasks();

        if (currentTaskIndex > tasks.length) {
            clearInterval(interval);
        }
    }, 1000);

    renderTasks();
}

// Animate blinking text
function animateBlinkingText(element) {
    const text = 'Gathering data';
    let currentIndex = 0;
    let cycles = 0;
    const maxCycles = 3; // Run 3 full cycles

    const interval = setInterval(() => {
        // Create the output with the current character highlighted
        let output = '';
        for (let i = 0; i < text.length; i++) {
            if (i === currentIndex) {
                // Highlight current character with white color
                output += `<span style="color: #fff">${text[i]}</span>`;
            } else {
                // Other characters in dim color
                output += `<span style="color: #666">${text[i]}</span>`;
            }
        }

        element.innerHTML = output;

        currentIndex++;

        // Reset to beginning after completing the text
        if (currentIndex >= text.length) {
            currentIndex = 0;
            cycles++;

            // Stop after completing all cycles
            if (cycles >= maxCycles) {
                clearInterval(interval);
                // Show final state with all characters in white
                element.innerHTML = `<span style="color: #fff">${text}</span>`;
            }
        }
    }, 100); // 100ms per character
}

// Animate task list execution
function animateTaskList(element) {
    const tasks = [
        { name: 'Installing dependencies', duration: 1500 },
        { name: 'Building project', duration: 2000 },
        { name: 'Running tests', duration: 1800 },
        { name: 'Generating documentation', duration: 1200 },
        { name: 'Deploying to server', duration: 1600 }
    ];

    const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let currentTaskIndex = 0;
    let spinnerFrame = 0;
    let taskStartTime = Date.now();
    let taskStates = tasks.map(() => 'pending'); // 'pending', 'running', 'done'

    const interval = setInterval(() => {
        const elapsed = Date.now() - taskStartTime;

        // Check if current task is done
        if (elapsed >= tasks[currentTaskIndex].duration) {
            taskStates[currentTaskIndex] = 'done';
            currentTaskIndex++;
            taskStartTime = Date.now();

            // If all tasks are done, stop the animation
            if (currentTaskIndex >= tasks.length) {
                clearInterval(interval);
                renderTasks();
                return;
            }
        }

        // Mark current task as running
        taskStates[currentTaskIndex] = 'running';

        // Update spinner frame
        spinnerFrame = (spinnerFrame + 1) % spinnerFrames.length;

        renderTasks();
    }, 80);

    function renderTasks() {
        let output = '';

        tasks.forEach((task, index) => {
            if (taskStates[index] === 'done') {
                output += `<span style="color: #0f0">✓</span> <span style="color: #fff">${task.name}</span>\n`;
            } else if (taskStates[index] === 'running') {
                output += `<span style="color: #fff">${spinnerFrames[spinnerFrame]}</span> <span style="color: #fff">${task.name}...</span>\n`;
            } else {
                output += `<span style="color: #666">○</span> <span style="color: #666">${task.name}</span>\n`;
            }
        });

        element.innerHTML = output.trim();
    }

    // Initial render
    renderTasks();
}

// Animate menu selection
function animateMenuSelection(element) {
    const menuItems = [
        'New Project',
        'Open File',
        'Save',
        'Settings',
        'Exit'
    ];

    let selectedIndex = 0;
    let step = 0;
    const maxSteps = 12; // Move through menu 2-3 times

    const interval = setInterval(() => {
        let output = '<span style="color: #0cc">Select an option:</span>\n\n';

        menuItems.forEach((item, index) => {
            if (index === selectedIndex) {
                output += `<span style="color: #000; background: #fff"> ► ${item} </span>\n`;
            } else {
                output += `<span style="color: #666">   ${item}</span>\n`;
            }
        });

        element.innerHTML = output;

        step++;
        selectedIndex = (selectedIndex + 1) % menuItems.length;

        if (step >= maxSteps) {
            clearInterval(interval);
            // Final state - show selection made
            selectedIndex = 2; // Select "Save"
            output = '<span style="color: #0cc">Select an option:</span>\n\n';
            menuItems.forEach((item, index) => {
                if (index === selectedIndex) {
                    output += `<span style="color: #000; background: #fff"> ► ${item} </span>\n`;
                } else {
                    output += `<span style="color: #666">   ${item}</span>\n`;
                }
            });
            output += '\n<span style="color: #0f0">✓ Selected: Save</span>';
            element.innerHTML = output;
        }
    }, 400);
}

// Animate checkbox and radio groups
function animateCheckboxRadio(element) {
    const checkboxes = [
        { label: 'Enable logging', checked: false },
        { label: 'Auto-save', checked: false },
        { label: 'Dark mode', checked: false }
    ];

    const radios = ['Development', 'Staging', 'Production'];
    let selectedRadio = 0;

    let step = 0;
    const steps = [
        () => { checkboxes[0].checked = true; },
        () => { checkboxes[2].checked = true; },
        () => { selectedRadio = 1; },
        () => { checkboxes[1].checked = true; },
        () => { selectedRadio = 2; }
    ];

    function render() {
        let output = '<span style="color: #0cc">Select features:</span>\n';
        checkboxes.forEach(item => {
            const icon = item.checked ? '☑' : '☐';
            const color = item.checked ? '#0f0' : '#666';
            output += `<span style="color: ${color}">${icon}</span> ${item.label}\n`;
        });

        output += '\n<span style="color: #0cc">Select environment:</span>\n';
        radios.forEach((item, index) => {
            const icon = index === selectedRadio ? '●' : '○';
            const color = index === selectedRadio ? '#0f0' : '#666';
            output += `<span style="color: ${color}">${icon}</span> ${item}\n`;
        });

        element.innerHTML = output;
    }

    render();

    const interval = setInterval(() => {
        if (step < steps.length) {
            steps[step]();
            render();
            step++;
        } else {
            clearInterval(interval);
        }
    }, 600);
}

// Animate confirmation dialog
function animateConfirmation(element) {
    const sequence = [
        {
            text: '<span style="color: #ff0">⚠</span>  <span style="color: #fff">Delete 5 files?</span>\n\n<span style="color: #666">This action cannot be undone.</span>\n\n<span style="color: #0cc">Continue? (y/N):</span> _',
            duration: 1500
        },
        {
            text: '<span style="color: #ff0">⚠</span>  <span style="color: #fff">Delete 5 files?</span>\n\n<span style="color: #666">This action cannot be undone.</span>\n\n<span style="color: #0cc">Continue? (y/N):</span> y',
            duration: 800
        },
        {
            text: '<span style="color: #ff0">⚠</span>  <span style="color: #fff">Delete 5 files?</span>\n\n<span style="color: #666">This action cannot be undone.</span>\n\n<span style="color: #0cc">Continue? (y/N):</span> y\n\n<span style="color: #0f0">✓ Files deleted successfully</span>',
            duration: 2000
        }
    ];

    let currentStep = 0;

    function showStep() {
        if (currentStep < sequence.length) {
            element.innerHTML = sequence[currentStep].text;
            setTimeout(() => {
                currentStep++;
                showStep();
            }, sequence[currentStep].duration);
        }
    }

    showStep();
}

// Animate tab navigation
function animateTabNavigation(element) {
    const tabs = ['Overview', 'Details', 'Settings'];
    const tabContent = {
        'Overview': 'Project Status: Active\nLast updated: 2 hours ago\nTotal items: 142',
        'Details': 'Name: CLI Material Palette\nVersion: 1.0.0\nAuthor: Design Team',
        'Settings': 'Theme: Dark\nLanguage: English\nNotifications: Enabled'
    };

    let activeTab = 0;
    let step = 0;
    const sequence = [0, 1, 2, 1, 0]; // Tab switching sequence

    function render() {
        let output = '';

        // Render tabs
        tabs.forEach((tab, index) => {
            if (index === activeTab) {
                output += `<span style="color: #000; background: #fff"> ${tab} </span> `;
            } else {
                output += `<span style="color: #666">${tab}</span> `;
            }
        });

        output += '\n' + '─'.repeat(40) + '\n\n';
        output += `<span style="color: #fff">${tabContent[tabs[activeTab]]}</span>`;

        element.innerHTML = output;
    }

    render();

    const interval = setInterval(() => {
        step++;
        if (step < sequence.length) {
            activeTab = sequence[step];
            render();
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

// Tab navigation for sections
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active from all nav links
            document.querySelectorAll('nav a').forEach(a => {
                a.classList.remove('active');
            });

            // Show target section
            target.classList.add('active');

            // Activate nav link
            this.classList.add('active');
        }
    });
});

// Show first section by default
document.addEventListener('DOMContentLoaded', () => {
    const firstSection = document.querySelector('section');
    const firstNavLink = document.querySelector('nav a');

    if (firstSection) {
        firstSection.classList.add('active');
    }
    if (firstNavLink) {
        firstNavLink.classList.add('active');
    }
});

console.log('CLI Material Palette loaded');
