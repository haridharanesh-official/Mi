# For Adya — a gift with a journey

Next.js / React / TypeScript birthday site. Gift journey first; supporting relationship timeline last. Three routes: `/`, `/bloopers`, `/photobooth`.

## Run
`npm install`, `npm run dev`, then open http://localhost:3000.
For production: `npm run build`, then `npm start`.

## Personal content
Edit `content/story.ts` for Adya's name, messages, journey details, key dates and song. This module exports the media manifest from `content/media.json`. No private Drive access or credentials are used.

## Add approved photographs
Download your selected Drive originals into `media-inbox/<category>/`. Run `npm run media` to rotate, resize, compress, strip metadata and create blur previews. Edit captions, alt text, dates and priority in `content/media.json`.

Categories: `hero`, `train_start`, `journey_proof`, `train_story`, `hyderabad`, `charminar`, `charminar_portraits`, `bangle_reveal`, `couple`, `bloopers`, `photobooth`.

Hero, train_start, hyderabad and charminar use the highest-priority photo as a cinematic background. Set `focalPoint`, e.g. `"60% 40%"`, to preserve the subject in a cover crop; inspect on mobile. The kilometre proof and final bangle use uncropped contain sizing. Other chapter photos form horizontal editorial strips. Bloopers and Photobooth have dedicated walls with lightbox, keyboard arrows and swipe navigation. Couple photos also appear in Photobooth. No photos are fabricated when a category is empty.

Example manifest entry:
```json
{"category":"hero","file":"/photos/hero/trip.webp","alt":"Describe the actual photo","caption":"Your caption","width":1600,"height":1000,"priority":true,"focalPoint":"50% 50%"}
```

Place approved audio in `public/audio/` and set `story.music.file`. Playback is opt-in; the player persists across Next.js page navigation. No music file is included.

## Before sending to Adya
Add the original photos and song; review all captions and mobile focal points. The site is not yet deployed. Public assets become accessible after deployment; only publish approved photos. Search indexing is disabled but there is no authentication. Actual-media performance and playback still need to be checked after upload.

## Uploaded trip assets
18 original images from Pic are now imported into public/photos/trip as optimized WebP files. The manifest assigns them to story sections, Bloopers and Photobooth. Six booking/map screenshots are displayed uncropped as travel proof. Originals remain untouched. Edit captions and focalPoint in content/media.json. The music file is still optional and not supplied.

