# 98 · Vilnius transport

One weekday of measured stop activity, with a street map and time exploration.
Serve the repo root with `python3 -m http.server 8000`, then open
`http://localhost:8000/98-vilnius-transport/`.
No application build or package install is needed. The map needs internet access.
Opening from `file://` still shows saved counts, but deliberately disables online
map tiles because they require an HTTP referrer.

## Interaction

- Drag the time slider (or use arrow keys) through **48 non-overlapping 30-minute
  windows**, 00:00–24:00 on 15 September 2025. The initial view is 00:00–00:30.
- Play advances one window per second. Pause holds the window; scrubbing pauses
  playback. Playback stops at 23:30–24:00; Play at the end restarts at midnight.
  Switching away from the page pauses it.
- Circle **area** encodes raw recorded boardings, with a fixed pixels-per-count
  scale across time and map zoom. Circle area and opacity ease between windows
  over 850 ms during playback and 320 ms when scrubbing. Rapid scrubbing retargets
  from the current visible size rather than restarting from the previous window.
  Numeric counts describe the selected measured window throughout; intermediate
  circle sizes are visual transitions, not additional measurements. Positions
  stay fixed. Reduced-motion preferences disable these transitions.
- Hollow green marks mean observed zero boardings. Tiny dashed grey marks mean
  no observation at that position in the selected window. Whole empty windows
  explicitly report unknown coverage, not zero passengers.
- Hover, focus, or tap a stop to inspect boardings, alightings, recorded visits
  and first/last observed arrival. Selected detail updates when time changes.
- Pan and zoom the map to orient yourself using the Neris, streets, and place names.
  The basemap fades from dark monochrome at night to pale monochrome by day.
- Light/dark mode follows the selected window's midpoint. Night stops become
  warm lights with soft halos; unobserved positions remain dim, cool hollow marks.
  At dawn the map and page brighten and halos recede; dusk reverses this.
  Circle area remains the measurement; the glow is a visual treatment, not extra
  boardings. No manual theme switch is needed: scrubbing controls the daylight.
- On phones, controls wrap into a compact layout with 44 px play, scrub and zoom
  targets. The map starts one zoom level wider to show more of the city. Tapping
  a stop pauses playback and opens its details on the map; a near miss within
  22 px selects the nearest stop without changing the visible circle scale.
  The popup and layout adapt to narrow screens and device safe areas.

## Sunlight and the clock assumption

Solar events are saved for central Vilnius (54.6872 N, 25.2797 E) on the sample
date, **2025-09-15**, in **Europe/Vilnius (UTC+03:00 on that date)**. They do not
depend on the viewer's timezone, current date or computer clock. Source:
[Sunrise-Sunset.org API v2](https://sunrise-sunset.org/api), retrieved with:

```text
https://api.sunrise-sunset.org/v2?lat=54.6872&lng=25.2797&date=2025-09-15&tz=Europe%2FVilnius
```

The original response is in `data/solar-source.json`; `data/solar.js` wraps that
snapshot and its request URL for the browser. There are no runtime solar API calls.

| Event | Vilnius local time |
| --- | --- |
| Civil dawn | 06:15:18 |
| Sunrise | 06:51:41 |
| Morning golden hour ends | 07:39:06 |
| Evening golden hour starts | 18:48:00 |
| Sunset | 19:35:16 |
| Civil dusk | 20:11:29 |

The **transport source does not state a UTC offset**. For the visual daylight
layer only, we assume its clock is Vilnius local time. This assumption is visible
on the page; the records and time bins are unchanged. It is not a verified claim
about the transport timestamps.

Daylight eases from 0 at civil dawn, through 0.5 at sunrise, to 1 at the end of
morning golden hour. The reverse uses evening golden hour, sunset and civil dusk.
Those levels are visual design choices anchored to calculated solar events, not
measured illumination or weather. The sun events use their full seconds; UI labels
round to minutes. The selected window's midpoint sets the target light level, and
the existing circle animation also interpolates the page colors, map treatment,
point colors and halo. Rapid scrubbing continues from the visible lighting state.
Reduced-motion preference snaps directly to the selected state. Text switches
polarity at mid-light to remain legible; geographic coordinates and numeric counts
never interpolate.

## Source and attribution

- [Official passenger-flow dataset](https://data.gov.lt/datasets/3901/).
- Provider: SĮ „Susisiekimo paslaugos“; publisher: Valstybės duomenų agentūra.
- Data license: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
- [Stotele API](https://get.data.gov.lt/datasets/gov/sp/keleiviu_srautai/Stotele).
- [Field definitions](https://data.gov.lt/datasets/3901/versions/1503/models/Stotele/).
- [Official schema](https://github.com/atviriduomenys/manifest/blob/master/datasets/gov/sp/keleiviu_srautai.csv), also saved as `data/schema.csv`.
- Downloaded 2026-09-28 UTC. Historical data, not live.
- Map: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
  Standard OSM tiles are requested only for the visible map through Leaflet,
  with browser caching and visible attribution. No bulk download or tile archive.

## Saved sample

**2025-09-15 00:00 inclusive to 2025-09-16 00:00 exclusive**, using source arrival
timestamps without timezone conversion. The saved API response contains 32,999
observations, 4,069 trip IDs, 2,220 stop IDs, and 2,223 stop/coordinate combinations.
There are 68,461 raw boardings and 68,081 raw alightings. The selected day has no
observations between 01:00 and 04:00; this does not establish whether vehicles
were operating or carrying passengers then.

Exact request:

```sh
curl --fail --location --get \
  'https://get.data.gov.lt/datasets/gov/sp/keleiviu_srautai/Stotele/:format/json' \
  --data-urlencode 'atvykimo_laikas>="2025-09-15T00:00:00"&atvykimo_laikas<"2025-09-16T00:00:00"&limit(50001)' \
  --output /tmp/vilnius-day.json
```

The response is preserved losslessly as `data/day-source.json.gz`; the generated
browser data includes its uncompressed SHA-256 and exact query. The snapshot is
below the 50,001-record cap. Displayed figures always refer to this snapshot,
not guaranteed total city ridership. The portal can revise data over time.
A follow-up request with the returned pagination cursor and the same date filter
returned no further records (`data/day-page-check.json`).
The original one-hour snapshot remains in `data/source.json.gz` with its empty
pagination check in `data/page-check.json`; the browser now uses the day sample.

## Fields and processing

| Source field | Use |
| --- | --- |
| `keliones_stoteles_id` | Validate unique observations |
| `reiso_id` | Count observed trips |
| `stoteles_id` | Stop identity, keeping platforms separate |
| `pavadinimas` | Label as supplied, including source spelling |
| `geometrija_wkt` | LKS-94 / EPSG:3346 stop position |
| `atvykimo_laikas` | Assign half-hour window and report first/last arrival |
| `ilipusiu_sk` | Raw boardings, summed within stop/window |
| `islipusiu_sk` | Raw alightings, summed within stop/window |

`prepare.py` validates unique record IDs, date range, nonnegative integer counts,
and coordinates. It groups by `(stop ID, northing, easting)`; different locations
under the same ID remain separate. No rows are dropped or counts fabricated.
The source WKT uses northing/easting order. Pyproj converts easting/northing from
EPSG:3346 to WGS84 (EPSG:4326) with `always_xy=True`; latitude and longitude are
rounded to 7 decimals. Leaflet places those positions on its Web Mercator map.

Each observation goes into `floor(minutes since midnight / 30)`. Frames contain
sparse per-stop sums, observed visits and first/last timestamps. An absent stop
entry means **no observation**, not a zero-valued record. Sums across all frames
must match the source totals. `data/sample.js` contains stop positions and frames;
the browser makes no transport API requests.

To rebuild the checked-in data (Python 3 and pyproj needed only for preprocessing):

```sh
python3 -m venv /tmp/vilnius-preprocess-venv
/tmp/vilnius-preprocess-venv/bin/pip install pyproj==3.8.0
/tmp/vilnius-preprocess-venv/bin/python prepare.py
```

Leaflet 1.9.4 JS/CSS is vendored locally from its npm distribution; license in
`vendor/LEAFLET-LICENSE`. Only circle markers are used, so marker icon assets are
not required. This adds one browser library for pan/zoom/tile handling and one
preprocessing library for verified coordinate conversion.

## Limits

- Sensors are installed on only some vehicles and can fail. Unequal service and
  sensor coverage influence circle sizes; these are not normalized rates.
- Raw counts are used, not DILAX's recalculated fields. Provider-recommended
  vehicle/day quality filters are not applied; measurements are not presented as
  cleaned ridership estimates. The original dataset also documents a historical
  gap from 2022-06-25 to 2023-08-26, outside this selected day.
- Transport timestamps have no UTC offset. The source clock is preserved with no
  timezone conversion. The daylight layer's Vilnius-local assumption is described
  above; it should be revised if the provider clarifies a different timezone.
- The street map is current geography, not the historical road network. Tile
  availability depends on the external map service; saved transport counts remain
  usable if tiles fail.
- No route joins, origin/destination inference or trajectories. Boardings count
  events, not unique people. Alightings need not equal boardings in a window/day.
- Stops absent for the entire day are not included. Nearby platforms may overlap;
  zoom or keyboard focus helps inspect them. Coordinates are not jittered.
- This is one weekday sample, not a representative average or evidence of a
  recurring citywide pattern. The visual interpretation remains open.
