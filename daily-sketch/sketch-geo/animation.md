🟢 Easy to Animate: The "Parameter Tweakers"
These shapes have simple mathematical properties like radius, offset, gap, or angle that can be mapped directly to time t. By letting t oscillate these values (using a Math.sin(t) for example), they animate very naturally.

Arcs: ring (pulse radius), concentric (pulse gap between rings), offset (move their centers apart/together), venn (rotate centers or push them apart)
Lines: parallel (make spacing wave), radial (spin the lines like a radar), grid (wave the line spacing), perspective (move the vanishing point vx, vy)
Curves: sine (animate the phase/amplitude)
🟡 Medium to Animate: The "Path Tracers"
These are defined by continuous loop formulas. They are static when drawn instantly (for i=0..steps), but if we tie the "current length of the drawn path" or a "point traveling along the path" to time t, they come alive.

Arcs: rose (unfurl the petals), spiral (draw it outwards over time), log spiral (same)
Curves: lissajous, epitrochoid, hypotrochoid, cardioid, astroid, lemniscate, trefoil (For all of these, we can either animate a dot moving along the path, or have the path "draw itself" by letting t control the 

(i / steps)
 limit)
🔴 Hard to Animate: The "Structural Constraints"
These shapes look simple but are fundamentally rigid. Animating them requires either bending their structure (which might ruin the shape) or writing complex math to keep them mathematically valid while in motion.

Arcs: tangent (Circles touching precisely. If they grow, their centers must move perfectly to maintain tangency.)
Lines: diagonal / hatch (These are drawn by overflowing the screen bounding boxes explicitly. Animating their tilt or spacing might cause visible clipping or jitter), fan (The math is tied directly to iterating along the screen borders 0..W and 0..H. Animating the insertion points requires changing the border logic entirely), chevron (Hardcoded peaks and line intersections. Requires carefully animating vertices simultaneously to prevent the chevrons from breaking up.)