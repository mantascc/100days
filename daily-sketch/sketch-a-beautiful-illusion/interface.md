# sketch-a-beautiful-illusion

## idea
The machine generates the pattern. The human supplies the mind. A perspective study in which language fragments at independent depths align into a human face from one viewpoint, then dissolve as the observer moves. An editorial essay continues beneath the interactive illustration, with the title and opening lines visible on arrival.

## tags
language, perception, cognition, llm, anamorphosis, typography, observer, editorial

## interaction
Move the pointer slowly across the illustration to change perspective. On touch, drag sideways; vertical swipes scroll the essay. Focus the illustration and use arrow keys for keyboard navigation. The face consists entirely of text fragments, without a visible mesh or underlying image.

## stack
Standalone index.html · Canvas 2D with pinhole projection · 1,420 deterministic text fragments · system typography. The editable React/Vinext source remains in app/.

## editing
Open index.html directly or serve this directory. No installation is needed for the standalone sketch. To update it from the React source, run `node scripts/export-sketch.mjs` after editing app/page.tsx or app/globals.css. The source project uses `npm run dev` and `npm run build`.

## status
Includes the editorial revision. The existing privately hosted Sites version predates that revision; moving the local files does not republish it.

## numbered edition
Promoted to [96-beautiful-illusion](../../96-beautiful-illusion/). The current edition uses the approved language-and-mind essay, a Mintis / 001 masthead, FIELDWORK, and separate language and perception tags. Figure and interaction captions are removed.
