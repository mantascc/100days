# Day 35: Flight Path Visualization

## Idea
iPad-optimized flight tracking interface showing real-time route optimization with great circle paths and waypoint notifications

## Description
This project creates an airline flight tracking dashboard optimized for iPad display. The interface shows flight SK 1789 (Copenhagen to Barcelona) with animated progress along a great circle route rendered on Leaflet map. A collapsible info panel displays flight details, aircraft information, and route optimization waypoints with fuel savings and time trade-offs. The implementation uses Turf.js for geodesic calculations and Font Awesome for the airplane icon. Waypoint notifications show optimization opportunities like "Waypoint Alpha: +12% fuel saving, +2 min".

The interface mimics professional flight planning software with iPad-specific layout including sidebar chrome and main content area. Progress bar and animated airplane marker provide real-time position feedback along the curved flight path.

## Data Concepts
- **Primary**: Spatial (geodesic paths, great circle routes, geographic coordinates)
- **Secondary**: Temporal (flight progress, estimated times, duration), Network (waypoint connections, route optimization)

## Conceptual Tags
#flight-tracking #geodesic-paths #great-circle #route-optimization #aviation #ipad-interface #real-time-tracking #waypoints

## Technical Tags
#leaflet #turf-js #geodesic-math #responsive-ipad #progress-animation #font-awesome

## Stack
- Leaflet.js (mapping)
- Turf.js (geodesic calculations)
- Font Awesome (icons)
- Vanilla JavaScript
- CSS (iPad frame simulation)

## Notes
- Great circle paths represent shortest distance between points on sphere
- Turf.js handles complex geodesic mathematics for accurate route rendering
- Waypoint optimization shows trade-offs common in flight planning (fuel vs time)
- iPad frame suggests device-specific UI optimized for cockpit/operations use
- Collapsible info panel maximizes map viewing area while preserving access to details
- Flight SK 1789 references SAS Scandinavian Airlines route
