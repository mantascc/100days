# Day 98: Vilnius Transport

## Idea
Explore a day of measured passenger activity through geography and daylight.

## Description
A minimal street map places real Vilnius public transport observations in their
geographic context. Scrub or play through 15 September 2025 in 48 half-hour
windows. Circle area shows recorded boardings on a fixed scale, making changes
across the day comparable. Hollow and dashed marks distinguish measured zero
from missing observations.

The page and map follow the day's solar cycle. Warm lights at night gradually
become green circles in daylight, with twilight around sunrise and sunset.
Smooth transformations connect measured windows while the displayed counts
remain the selected window's values. The transport timestamps lack a UTC offset;
the lighting layer assumes they use Vilnius local time.

The interface keeps the date, selected time, sunlight context, legend and
coverage caveat visible. Supporting methodology and instructions live in an
expandable section. Touch targets, wrapping controls and stop popups adapt the
same exploration to phones.

## Data Concepts
- **Primary**: Spatial (geographic stop positions)
- **Secondary**: Temporal (passenger activity and daylight across one day)

## Conceptual Tags
#vilnius #public-transport #geography #time #measured-data #daylight #missing-data

## Technical Tags
#leaflet #svg #vanilla-js #animation #responsive-design #coordinate-projection

## Stack
- Vanilla HTML, CSS and JavaScript; no application build step
- Locally vendored Leaflet 1.9.4 with OpenStreetMap tiles
- Saved official DILAX observations and Sunrise-Sunset.org solar metadata
- Python and pyproj for preprocessing only

## Interaction
- Drag the timeline or use arrow keys to scrub; scrubbing pauses playback.
- Play advances one half-hour window per second and stops at the end of the day.
- Hover, focus or tap a stop for boardings, alightings and recorded visits.
- Pan and zoom to explore the city. Tapping a stop on mobile pauses playback
  and opens a popup; nearby taps select small marks without inflating their area.

## Motion Design
Circle area and opacity ease over 850 ms during playback and 320 ms when
scrubbing. Interrupted transitions continue from the current visual state.
Positions and numeric measurements never interpolate. Reduced-motion preferences
disable transitions. Lighting follows each window's midpoint, using saved solar
events: sunrise 06:52 and sunset 19:35, with gradual twilight on either side.

## Notes
- Official data from SĮ „Susisiekimo paslaugos“, published by Valstybės duomenų
  agentūra: 32,999 observations, 2,220 stop IDs and 2,223 coordinate positions.
- Sensor-equipped vehicles only; unequal coverage is not total city ridership.
- Missing observations are unknown activity, not zero passengers.
- The map shows current geography; the passenger data is a historical snapshot.
- Original responses, preprocessing, credits and limitations are in [README.md](README.md).
- Serve the repository over HTTP and open `98-vilnius-transport/`. Online map
  tiles need internet access; transport and solar data are saved locally.
