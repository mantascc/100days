(() => {
  'use strict';
  const data = window.VILNIUS_SAMPLE;
  const summary = document.getElementById('summary');
  if (!data?.stops?.length || !data.frames?.length || !window.L) {
    summary.textContent = 'The saved sample or map library could not load. Check the data and vendor files.';
    return;
  }
  const slider = document.getElementById('timeline');
  const play = document.getElementById('play');
  const label = document.getElementById('window-label');
  const name = document.getElementById('stop-name');
  const counts = document.getElementById('stop-counts');
  const time = document.getElementById('stop-time');
  const number = new Intl.NumberFormat('en');
  const radius = count => count === 0 ? 2 : Math.sqrt(count) * 1.5;
  const clock = minutes => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  const range = index => `${clock(index * data.windowMinutes)}–${clock((index + 1) * data.windowMinutes)}`;
  let frameIndex = Number(slider.value), selected = null, timer = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phoneLayout = window.matchMedia('(max-width: 600px)');
  const touchInput = window.matchMedia('(pointer: coarse)');
  let animation = null, animationTargets = null;
  let animationLightTarget = null, lightLevel = 1;
  const root = document.documentElement;
  const solar = window.VILNIUS_SOLAR;
  const solarValid = solar?.date === data.start.slice(0, 10) && solar.tzid === 'Europe/Vilnius';
  const minutes = stamp => Number(stamp.slice(11, 13)) * 60 + Number(stamp.slice(14, 16)) + Number(stamp.slice(17, 19)) / 60;
  const sun = solarValid ? {
    dawn: minutes(solar.civil_twilight_begin), rise: minutes(solar.sunrise),
    morning: minutes(solar.golden_hour.morning.end), evening: minutes(solar.golden_hour.evening.begin),
    set: minutes(solar.sunset), dusk: minutes(solar.civil_twilight_end)
  } : null;
  const smoothstep = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  function daylightAt(minute) {
    if (!sun) return 1;
    const keys = [[sun.dawn, 0], [sun.rise, .5], [sun.morning, 1],
      [sun.evening, 1], [sun.set, .5], [sun.dusk, 0]];
    if (minute <= sun.dawn || minute >= sun.dusk) return 0;
    for (let i = 1; i < keys.length; i++) {
      const [end, to] = keys[i], [start, from] = keys[i - 1];
      if (minute <= end) return from + (to - from) * smoothstep((minute - start) / (end - start));
    }
    return 0;
  }
  function paintDaylight(level) {
    lightLevel = level;
    const night = 1 - level;
    // Keep dawn dark a little longer, instead of flattening the city into mid-grey.
    const surface = level * level;
    const mix = (dark, light) => `rgb(${dark.map((v, i) => Math.round(v + (light[i] - v) * surface)).join(' ')})`;
    // Switch text polarity at mid-light to preserve legibility through twilight.
    const lightSurface = surface >= .5;
    const values = {
      '--page': mix([10, 15, 22], [247, 247, 243]),
      '--text': lightSurface ? '#242824' : '#edf0ed',
      '--muted': lightSurface ? '#303830' : '#dee4e9',
      '--line': lightSurface ? '#a1aaa0' : '#52606b',
      '--accent': lightSurface ? '#386349' : '#f4ce8f',
      '--hover': mix([32, 40, 48], [231, 236, 228]),
      '--point': mix([255, 224, 157], [67, 111, 78]),
      '--point-edge': mix([255, 239, 192], [39, 76, 50]),
      '--missing': mix([144, 162, 183], [132, 140, 131]),
      '--tile-invert': 1 - smoothstep((level - .5) / .35),
      '--tile-brightness': .85 + .31 * level,
      '--tile-opacity': .55 - .05 * level,
      '--halo-radius': `${5 * night}px`,
      '--halo': `rgba(255, 197, 108, ${.8 * night})`
    };
    for (const [key, value] of Object.entries(values)) root.style.setProperty(key, value);
    root.style.colorScheme = lightSurface ? 'light' : 'dark';
  }
  if (sun) {
    document.getElementById('solar-times').textContent = `Sunrise ${clock(Math.round(sun.rise))} · Sunset ${clock(Math.round(sun.set))}`;
  } else {
    document.getElementById('solar-times').textContent = 'Solar times unavailable — using daylight styling.';
  }
  slider.max = data.frames.length - 1;
  slider.disabled = play.disabled = false;

  // Leaflet 1.9.4 rounds circle radii to whole pixels. Preserve subpixels so
  // small count changes also morph smoothly, including during map redraws.
  const SmoothSVG = L.SVG.extend({
    _updateCircle(layer) {
      const point = layer._point, r = layer._radius;
      const arc = `a${r},${r} 0 1,0 `;
      this._setPath(layer, layer._empty() ? 'M0 0'
        : `M${point.x - r},${point.y}${arc}${2 * r},0 ${arc}${-2 * r},0`);
    }
  });
  const map = L.map('map', { minZoom: 10, maxZoom: 18, scrollWheelZoom: true, renderer: new SmoothSVG() });
  // Start on the city proper; pan/zoom to the outer stops without changing time.
  map.setView([54.701, 25.265], phoneLayout.matches ? 11 : 12);
  L.control.scale({ imperial: false }).addTo(map);
  const mapStatus = document.getElementById('map-status');
  if (location.protocol === 'file:') {
    mapStatus.textContent = 'For the street map, serve the repo over HTTP (python3 -m http.server). Saved counts still work here.';
  } else {
    let failures = 0;
    mapStatus.textContent = 'Loading street map…';
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      keepBuffer: 1
    });
    tiles.on('loading', () => { failures = 0; });
    tiles.on('tileerror', () => {
      failures += 1;
      mapStatus.textContent = 'Some map tiles could not load. Check your connection; saved passenger data remains available.';
    });
    tiles.on('load', () => { if (!failures) mapStatus.textContent = ''; });
    tiles.addTo(map);
  }

  let stopPopup = null;
  function refreshPopup() {
    if (!stopPopup) return;
    const content = document.createElement('div');
    for (const text of [name.textContent, counts.textContent, time.textContent]) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      content.append(paragraph);
    }
    stopPopup.setContent(content);
    const stop = data.stops[selected];
    stopPopup.setLatLng([stop.lat, stop.lon]);
  }

  function inspect(index) {
    selected = index;
    const stop = data.stops[index], value = data.frames[frameIndex].stops[index];
    name.textContent = `${stop.name} · stop ${stop.id}`;
    if (!value) {
      counts.textContent = `No observations in ${range(frameIndex)}. Passenger activity is unknown.`;
      time.textContent = 'This position appears elsewhere in the saved day.';
      refreshPopup();
      return;
    }
    counts.textContent = `${number.format(value.boardings)} boardings / ${number.format(value.alightings)} alightings · ${value.observations} recorded visits`;
    time.textContent = `${range(frameIndex)} · observations ${value.first.slice(11)}–${value.last.slice(11)}`;
    refreshPopup();
  }

  function selectStop(index) {
    inspect(index);
    if (phoneLayout.matches || touchInput.matches) {
      pause();
      const stop = data.stops[index];
      stopPopup ??= L.popup({ className: 'stop-popup', maxWidth: 260, autoPanPadding: [20, 20] });
      refreshPopup();
      stopPopup.setLatLng([stop.lat, stop.lon]).openOn(map);
    } else {
      markers[index].getElement()?.focus({ preventScroll: true });
    }
  }

  const markers = data.stops.map((stop, index) => {
    const marker = L.circleMarker([stop.lat, stop.lon], { radius: 1.5, weight: 1, bubblingMouseEvents: false }).addTo(map);
    marker.on('mouseover', () => inspect(index));
    marker.on('click', () => selectStop(index));
    const path = marker.getElement();
    path.setAttribute('tabindex', '0');
    path.setAttribute('role', 'button');
    path.addEventListener('focus', () => inspect(index));
    path.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStop(index); }
    });
    return marker;
  });

  // A finger can tap near a tiny mark without inflating its data-encoded area.
  map.on('click', event => {
    if (!phoneLayout.matches && !touchInput.matches) return;
    let nearest = -1, distance = 22;
    markers.forEach((marker, index) => {
      const delta = map.latLngToContainerPoint(marker.getLatLng()).distanceTo(event.containerPoint);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    if (nearest !== -1) selectStop(nearest);
  });

  // Keep the actual displayed state so a new scrub can interrupt a tween cleanly.
  const visualStates = markers.map(() => ({ area: 2.25, fill: 0, stroke: .45 }));
  function paint(index, state) {
    visualStates[index] = state;
    const marker = markers[index], path = marker.getElement();
    marker.setRadius(Math.sqrt(state.area));
    // Only opacity and geometry change per animation frame; other styles stay put.
    path.setAttribute('fill-opacity', state.fill);
    path.setAttribute('stroke-opacity', state.stroke);
  }

  function settleAnimation() {
    cancelAnimationFrame(animation);
    animation = null;
    if (animationTargets) animationTargets.forEach((state, index) => paint(index, state));
    if (animationLightTarget !== null) paintDaylight(animationLightTarget);
    animationTargets = null;
    animationLightTarget = null;
  }

  function transitionTo(targets, duration, targetLight) {
    cancelAnimationFrame(animation);
    animation = null;
    animationTargets = targets;
    animationLightTarget = targetLight;
    if (!duration || reducedMotion.matches || document.hidden) { settleAnimation(); return; }
    const from = visualStates.map(state => ({ ...state }));
    const fromLight = lightLevel;
    const changing = targets.flatMap((target, index) =>
      Object.keys(target).some(key => target[key] !== from[index][key]) ? [index] : []);
    if (!changing.length && fromLight === targetLight) { animationTargets = null; animationLightTarget = null; return; }
    const started = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - started) / duration);
      const ease = progress * progress * (3 - 2 * progress);
      if (fromLight !== targetLight) paintDaylight(fromLight + (targetLight - fromLight) * ease);
      for (const index of changing) {
        const start = from[index], target = targets[index];
        // Interpolate circle area, not passenger labels or geographic position.
        paint(index, {
          area: start.area + (target.area - start.area) * ease,
          fill: start.fill + (target.fill - start.fill) * ease,
          stroke: start.stroke + (target.stroke - start.stroke) * ease
        });
      }
      if (progress < 1) animation = requestAnimationFrame(tick);
      else { animation = null; animationTargets = null; animationLightTarget = null; }
    }
    animation = requestAnimationFrame(tick);
  }

  function render(duration = 320) {
    const frame = data.frames[frameIndex];
    const midpoint = (frameIndex + .5) * data.windowMinutes;
    const phase = !sun ? 'Day' : midpoint < sun.dawn || midpoint >= sun.dusk ? 'Night'
      : midpoint < sun.morning ? 'Dawn' : midpoint < sun.evening ? 'Day' : 'Dusk';
    document.getElementById('light-phase').textContent = phase;
    slider.value = frameIndex;
    slider.style.setProperty('--progress', `${100 * frameIndex / (data.frames.length - 1)}%`);
    slider.setAttribute('aria-valuetext', range(frameIndex));
    label.textContent = range(frameIndex);
    summary.textContent = frame.observations
      ? `${number.format(frame.boardings)} boardings · ${number.format(Object.keys(frame.stops).length)} observed stop positions`
      : 'No observations · passenger activity unknown.';
    const targets = [];
    for (const [index, marker] of markers.entries()) {
      const value = frame.stops[index], stop = data.stops[index];
      const current = visualStates[index];
      targets.push({ area: (value ? radius(value.boardings) : 1.5) ** 2,
        fill: value?.boardings ? .6 : 0, stroke: value ? .8 : .45 });
      marker.setStyle(value
        ? { color: '#274c32', fillColor: '#436f4e', fillOpacity: current.fill, opacity: current.stroke, weight: .8, dashArray: null }
        : { color: '#848c83', fillOpacity: current.fill, opacity: current.stroke, weight: .8, dashArray: '1 2' });
      marker.getElement().setAttribute('data-observed', String(Boolean(value)));
      marker.getElement().setAttribute('aria-label', value
        ? `${stop.name}, stop ${stop.id}: ${value.boardings} boardings, ${value.alightings} alightings, ${value.observations} visits, ${range(frameIndex)}`
        : `${stop.name}, stop ${stop.id}: no observations, ${range(frameIndex)}`);
    }
    // Put observed circles above the missing-position reference marks.
    // Within them, smaller circles stay reachable where platforms overlap.
    Object.keys(frame.stops).sort((a, b) => frame.stops[b].boardings - frame.stops[a].boardings)
      .forEach(index => markers[index].bringToFront());
    if (selected !== null) inspect(selected);
    transitionTo(targets, duration, daylightAt(midpoint));
  }

  function pause() {
    clearInterval(timer);
    timer = null;
    play.textContent = 'Play';
    play.setAttribute('aria-pressed', 'false');
  }
  play.addEventListener('click', () => {
    if (timer !== null) { pause(); return; }
    if (frameIndex === data.frames.length - 1) { frameIndex = 0; render(); }
    play.textContent = 'Pause';
    play.setAttribute('aria-pressed', 'true');
    timer = setInterval(() => {
      frameIndex += 1;
      render(850);
      if (frameIndex === data.frames.length - 1) pause();
    }, 1000);
  });
  slider.addEventListener('input', () => { pause(); frameIndex = Number(slider.value); render(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pause(); settleAnimation(); }
  });
  window.addEventListener('pagehide', () => { pause(); settleAnimation(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) settleAnimation(); });
  new ResizeObserver(() => {
    map.invalidateSize({ pan: false });
    if (stopPopup?.isOpen()) stopPopup.update();
  }).observe(document.getElementById('map'));

  const legend = document.getElementById('legend');
  for (const value of [10, 50, 100]) {
    const item = document.createElement('span'), dot = document.createElement('i');
    dot.style.width = dot.style.height = `${radius(value) * 2}px`;
    item.append(dot, `${value}`);
    legend.append(item);
  }
  legend.append('boardings / 30 min');
  render(0);
})();
