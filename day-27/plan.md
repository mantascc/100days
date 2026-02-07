Step-by-step build plan:
Description:
A minimalist browser-based fly simulator where a 2x2 pixel responds to WASD/arrow controls with realistic physics. The fly struggles against gravity with exponentially decreasing thrust as it climbs higher, never able to breach the forbidden 1% ceiling zone at the top of the screen. Horizontal momentum persists roughly twice as long as vertical, creating the characteristic dart-and-drift movement of insects. The physics system uses separate air resistance coefficients, altitude-based energy decay, and differentiated boundary behaviors (soft floor bounce, dampened wall collision, ceiling rejection) to create an organic struggle against atmospheric forces.
Phase 1: Static setup

HTML structure (playground div, fly div)
CSS (full viewport, 2x2 pixel, positioning)
Initial fly position (center screen)

Phase 2: Basic movement

Keyboard input capture (WASD + arrows)
Position update loop (requestAnimationFrame)
Direct position changes (no physics yet)
Boundary detection (edges + 1% ceiling zone)

Phase 3: Velocity system

Add vx, vy variables
Convert input to velocity changes (impulses)
Apply velocity to position each frame
Simple clamping at boundaries

Phase 4: Gravity

Constant downward acceleration to vy
Test fall behavior
Adjust gravity constant for feel

Phase 5: Air resistance

Separate decay rates: horizontal (0.98?) vs vertical (0.97?)
Horizontal persists ~2x longer than vertical
Test drift behavior

Phase 6: Altitude energy decay

Calculate height ratio (current_y / screen_height)
Apply exponential multiplier to upward thrust
Formula: thrust * (1 - height_ratio)²
Test ceiling struggle

Phase 7: Boundary physics

Floor: soft bounce (velocity * -0.6)
Walls: dampened bounce (velocity * -0.3)
Ceiling: push-back or hard stop

Phase 8: Polish

Gravity intensification when falling (1.2x multiplier if vy > 0)
Fine-tune all constants
Window resize handling

Key constants to expose:

gravity, airResistanceX, airResistanceY
moveForce, upwardForce
bounceFloor, bounceWall, bounceCeiling