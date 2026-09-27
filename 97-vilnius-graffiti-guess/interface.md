# Vilnius Graffiti Guess

A seven-round visual guessing game using Vilnius graffiti photographs. Guessing builds a mental map of the city through streets, architecture, and surroundings.

## Interface

Desktop uses two panes; phones switch between Photo and Map views: an photograph and an interactive map with seven anonymous answer dots. Drag, scroll, or pinch to explore; Fit All includes the western TV tower; Center returns to central Vilnius. Pixel landmarks mark Gedimino bokštas, Seimas, Tauro kalnas, Halės turgus, Rotušė, TV bokštas, Trijų Kryžių kalnas, Baltasis tiltas, and Aušros vartai. Hover or tap reveals their names.

Choose one dot for an immediate reveal. Correct guesses get a bright YES; other guesses show the answer and distance. Optional sound, photo enlargement, seven-round recap, and replay. No accounts or saved scores.

## Material

Seven user-supplied photographs with matching user-supplied locations. OpenStreetMap road and river geometry. Built-in ImageGen landmark illustrations.

## Run

Serve the 100days repository over HTTP and open `97-vilnius-graffiti-guess/`. The root entry opens `dist/`, which contains the authored application. ES modules and local JSON fetches require HTTP.

## Connections

Visual memory, cultural connection, photography, playful cartography, learning through guessing.
