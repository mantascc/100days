const TWO_PI = Math.PI * 2;

// Simple Perlin-like noise generator
function perlinNoise(t, seed = 0) {
  // Multi-octave noise approximation using sine waves
  const freq1 = 2 + seed * 0.1;
  const freq2 = 5 + seed * 0.2;
  const freq3 = 11 + seed * 0.3;

  const v1 = Math.sin(t * TWO_PI * freq1 + seed);
  const v2 = Math.sin(t * TWO_PI * freq2 + seed * 2) * 0.5;
  const v3 = Math.sin(t * TWO_PI * freq3 + seed * 3) * 0.25;

  return (v1 + v2 + v3) / 1.75; // normalize
}

// Curve definitions with data generators
const curves = [
  {
    name: "Hard reset",
    data: (() => {
      const cycles = 4;
      const points = 200;
      const yMin = 0.4;
      const yMax = 0.85;
      const data = [];
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const cyclePos = (t * cycles) % 1;
        let y = yMin + (yMax - yMin) * cyclePos;
        data.push({ t, y });
        if (Math.abs(y - yMax) < 1e-3) {
          data.push({ t: t + 0.0001, y: yMin });
        }
      }
      return data;
    })(),
    info: {
      range: "0.4 → 0.85",
      cycleCount: "4 (within normalized time 0–1)",
      waveform: "Sawtooth with vertical fall",
      phaseCharacter: "No full integration; coherence window too short",
      metaphor: "Survival through reboots, not rest"
    }
  },
  {
    name: "Balanced recovery",
    data: (() => {
      const cycles = 4;
      const points = 200;
      const yMin = 0.45;
      const yMax = 0.85;
      const data = [];
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const sine = Math.sin(2 * Math.PI * cycles * t);
        const normalized = 0.6 + 0.4 * ((sine + 1) / 2);
        const y = Math.max(yMin, Math.min(yMax, normalized));
        data.push({ t, y });
      }
      return data;
    })(),
    info: {
      range: "0.45 → 0.85",
      cycleCount: "4 (within normalized time 0–1)",
      waveform: "Biased sine wave",
      phaseCharacter: "Continuous exploration with rhythmic micro-integration",
      metaphor: "Rhythmic breath between flow and grounding"
    }
  },
  {
    name: "Adaptive drift",
    data: (() => {
      const points = 200;
      const yMin = 0.4;
      const yMax = 0.85;
      const data = [];
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const noise = perlinNoise(t, 42);
        // Add upward bias but allow deeper dips
        const normalized = (noise + 1) / 2; // 0..1
        // Use power function to create asymmetry: stays high, dips deep
        const biased = Math.pow(normalized, 0.6); // amplifies lower values, compresses upper
        const y = yMin + (yMax - yMin) * biased;
        data.push({ t, y });
      }
      return data;
    })(),
    info: {
      range: "0.4 → 0.85",
      cycleCount: "Non-repeating",
      waveform: "Low-frequency noise",
      phaseCharacter: "Pseudo-random wandering with local continuity",
      metaphor: "Wind patterns — never repeating, always flowing"
    }
  },
  {
    name: "Fractal breather",
    data: (() => {
      const points = 200;
      const yMin = 0.45;
      const yMax = 0.85;
      const data = [];
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        // Large slow wave
        const slowWave = Math.sin(t * TWO_PI * 1.5);
        // Fast micro-oscillations
        const fastWave = Math.sin(t * TWO_PI * 12) * 0.15;
        // Combine
        const combined = slowWave + fastWave;
        const normalized = (combined + 1.15) / 2.3;
        const y = yMin + (yMax - yMin) * normalized;
        data.push({ t, y: Math.max(yMin, Math.min(yMax, y)) });
      }
      return data;
    })(),
    info: {
      range: "0.45 → 0.85",
      cycleCount: "Multi-scale (nested)",
      waveform: "Nested oscillations",
      phaseCharacter: "Micro-fluctuations within broader seasonal cycle",
      metaphor: "Musician's vibrato; small entropy inside stable tone"
    }
  },
  {
    name: "The ratchet",
    data: (() => {
      const cycles = 4;
      const points = 200;
      const yMin = 0.45;
      const yMax = 0.95;
      const data = [];

      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const cyclePhase = (t * cycles) % 1;

        // Each cycle: burst up, partial recovery that doesn't reach previous low
        const burstHeight = Math.sin(cyclePhase * Math.PI) * 0.15; // 0 -> 0.15 -> 0
        const ratchetDrift = t * 0.35; // accumulating baseline drift
        const incompleteRecovery = cyclePhase < 0.7 ? 0 : (cyclePhase - 0.7) * 0.1; // slight dip late in cycle

        let y = yMin + ratchetDrift + burstHeight - incompleteRecovery;
        y = Math.max(yMin, Math.min(yMax, y));

        data.push({ t, y });
      }
      return data;
    })(),
    info: {
      range: "0.45 → 0.95",
      cycleCount: "4 (with incomplete recovery)",
      waveform: "Asymmetric staircase drift",
      phaseCharacter: "Entropy climbs in bursts, recovery plateaus never reach previous baseline",
      metaphor: "Codebase entropy, organizational debt accumulation"
    }
  }
];
