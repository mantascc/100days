# capture

Record a short looping video per sketch with Playwright + ffmpeg.

## one-time setup

```sh
npm install
npm run install:browsers
```

## record everything

```sh
npm run capture
```

Filter by slug substring:

```sh
npm run capture -- 25-spotlight
```

## writing a scenario

One file per sketch under `scenarios/<sketch-slug>.mjs`:

```js
export const meta = {
    slug: '25-spotlight-grid',
    title: 'Spotlight grid',
    warmupMs: 600,    // wait this long after page load before recording starts
};

export async function play(page) {
    // perform the interaction you want to record.
    // viewport is 720x720; the page is the sketch's index.html.
    await page.mouse.move(200, 200);
    await page.waitForTimeout(600);
    await page.mouse.move(520, 520, { steps: 60 });
    await page.waitForTimeout(800);
}
```

Total recorded length is `warmupMs` (trimmed) + however long `play()` runs. Aim for a ~3–4s clip after trimming.

## pipeline

`capture.mjs`:

1. Spawn chromium, 720×720 viewport, record video to `.raw/<slug>/*.webm`.
2. `goto` the sketch's `index.html`, wait `warmupMs`, run `play()`.
3. ffmpeg trims the first `warmupMs` and transcodes to `../assets/videos/<slug>.mp4` (H.264, CRF 26).
4. Second ffmpeg pass extracts the first frame to `../assets/posters/<slug>.jpg`.
5. Writes `../assets/gallery.json` consumed by `index.html`.
