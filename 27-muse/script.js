// Check if mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

// Show mobile warning if on mobile device
if (isMobileDevice()) {
    document.getElementById('mobile-warning').style.display = 'flex';
    document.getElementById('playground').style.display = 'none';
}

// Get references to elements
const playground = document.getElementById('playground');
const fly = document.getElementById('fly');

// Fly position
let x, y;
let playgroundWidth, playgroundHeight;

// Fly velocity
let vx = 0;
let vy = 0;

// Keyboard state
const keys = {};

// Physics constants - Adjust these to tune the simulation!
const moveForce = 0.6;          // Base movement impulse strength
const gravity = 0.15;           // Constant downward acceleration
const airResistanceX = 0.98;    // Horizontal drag (higher = more glide)
const airResistanceY = 0.96;    // Vertical drag (lower = falls faster)
const bounceFloor = -0.6;       // Floor bounce (60% energy return)
const bounceWall = -0.3;        // Wall bounce (30% energy return)
const bounceCeiling = -0.2;     // Ceiling rejection (20% energy return)

// Initialize fly position at bottom center
function initFly() {
    playgroundWidth = playground.clientWidth;
    playgroundHeight = playground.clientHeight;

    // Center horizontally, near bottom (20px from bottom)
    x = playgroundWidth / 2 - 4; // -4 to center the 8px fly
    y = playgroundHeight - 20;

    updateFlyPosition();
}

// Update fly DOM position
function updateFlyPosition() {
    fly.style.left = x + 'px';
    fly.style.top = y + 'px';
}

// Keyboard input capture
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Boundary detection with bounce physics
function checkBoundaries() {
    const ceilingZone = playgroundHeight * 0.01; // 1% ceiling zone
    const flySize = 8; // 8x8 pixel fly

    // Left wall - dampened bounce
    if (x < 0) {
        x = 0;
        vx *= bounceWall;
    }

    // Right wall - dampened bounce
    if (x > playgroundWidth - flySize) {
        x = playgroundWidth - flySize;
        vx *= bounceWall;
    }

    // Top boundary (1% ceiling zone) - minimal bounce (push-back)
    if (y < ceilingZone) {
        y = ceilingZone;
        vy *= bounceCeiling;
    }

    // Bottom floor - soft bounce
    if (y > playgroundHeight - flySize) {
        y = playgroundHeight - flySize;
        vy *= bounceFloor;
    }
}

// Main update loop
function update() {
    // Apply gravity with intensification when falling
    const gravityMultiplier = vy > 0 ? 1.2 : 1.0; // Falls faster than it rises
    vy += gravity * gravityMultiplier;

    // Calculate altitude-based energy decay
    const heightRatio = y / playgroundHeight; // 0 at top, 1 at bottom
    // More gradual decay: starts strong, only weakens significantly near top
    const altitudeMultiplier = 0.3 + (0.7 * heightRatio); // 30% strength at top, 100% at bottom

    // Handle keyboard input - apply impulses to velocity
    if (keys['w'] || keys['arrowup']) {
        // Upward thrust weakens with altitude
        vy -= moveForce * altitudeMultiplier;
    }
    if (keys['s'] || keys['arrowdown']) {
        vy += moveForce;
    }
    if (keys['a'] || keys['arrowleft']) {
        vx -= moveForce;
    }
    if (keys['d'] || keys['arrowright']) {
        vx += moveForce;
    }

    // Apply air resistance (horizontal persists ~2x longer than vertical)
    vx *= airResistanceX;
    vy *= airResistanceY;

    // Apply velocity to position
    x += vx;
    y += vy;

    // Apply boundaries
    checkBoundaries();

    // Update position
    updateFlyPosition();

    // Continue loop
    requestAnimationFrame(update);
}

// Initialize on load
initFly();

// Start update loop
requestAnimationFrame(update);

// Re-initialize on window resize
window.addEventListener('resize', () => {
    playgroundWidth = playground.clientWidth;
    playgroundHeight = playground.clientHeight;
    // Keep fly position relative if possible, otherwise re-center
    if (y > playgroundHeight - 8) {
        y = playgroundHeight - 20;
    }
    if (x > playgroundWidth - 8) {
        x = playgroundWidth / 2 - 4;
    }
    updateFlyPosition();
});
