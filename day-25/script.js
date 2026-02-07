// DOM Elements
const grid = document.querySelector('.grid');
const densitySlider = document.getElementById('density');
const hueSlider = document.getElementById('hue');


// State Variables
let isMoving = false;
let timeout;
let spacing = 20; // Initial spacing value
let mouseX = 0;
let mouseY = 0;

/**
 * Updates the active dot color based on hue value
 * @param {number} hue - The hue value (0-360)
 */
function updateDotColor(hue) {
    document.documentElement.style.setProperty('--dot-hue', hue);
}

/**
 * Generates the grid of dots based on current spacing
 */
function generateGrid() {
    // Clear existing dots
    grid.innerHTML = '';
    
    // Calculate grid dimensions
    const gridRect = grid.getBoundingClientRect();
    const cols = Math.floor(gridRect.width / spacing);
    const rows = Math.floor(gridRect.height / spacing);
    
    // Generate dots dynamically
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.style.left = (col * spacing + spacing/2) + 'px';
            dot.style.top = (row * spacing + spacing/2) + 'px';
            grid.appendChild(dot);
        }
    }
}

/**
 * Updates the active state of dots based on mouse position
 * @param {number} radius - The radius of the active area around the mouse
 */
function updateDotsSize(radius) {
    document.querySelectorAll('.dot').forEach(dot => {
        const rect = dot.getBoundingClientRect();
        const distance = Math.sqrt(
            (mouseX - rect.left) ** 2 + 
            (mouseY - rect.top) ** 2
        );
        dot.classList.toggle('active', distance < radius);
    });
}

// Event Listeners
densitySlider.addEventListener('input', (e) => {
    // Invert the slider value: min(15) + max(32) - current value
    // So slider value 15 gives spacing 32, slider value 32 gives spacing 15
    spacing = 15 + 32 - parseInt(e.target.value);
    generateGrid();
});

hueSlider.addEventListener('input', (e) => {
    updateDotColor(e.target.value);
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    updateDotsSize(50);
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        isMoving = false;
        updateDotsSize(45); // Reduce radius when stopped
    }, 200);
});

hueSlider.addEventListener('input', function() {
    const hueValue = hueSlider.value;
    console.log(`Current hue value: ${hueValue}`);
});

// Initialize
generateGrid();
updateDotColor(hueSlider.value); // Set initial color
