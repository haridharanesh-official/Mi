# Design and verification

## Direction
Built-in Image Gen generated `concept.png`, using the brief: four coordinated opening/timeline/journey/letter panels; near-black wine, ivory and antique gold; editorial serif; arch-framed opening; no stock people or fabricated personal media. The generated board is a direction reference, not a user-approved pixel specification.

## Visual comparison
Inspected concept.png, desktop.png and mobile.png with view_image. Browser screenshots captured in Codex IAB; no external browser fallback. Desktop viewport 1440×900 and mobile 390×844. The reference is a 1312×1199 multi-panel board, so a single native-size page comparison is not meaningful.

| Point | Concept | Implementation and decision |
|---|---|---|
| Opening copy | Main opening plus invented marginal copy | Exact user opening kept; invented marginal copy omitted. No added hero eyebrow. |
| Type | Thin editorial serif, gold italics | Local Cormorant Garamond, Manrope; mobile line breaks inspected. |
| Palette | Wine black / ivory / antique gold | Tokens preserved; subtle wine light at base of hero. |
| Composition | Arch and spacious central heading | Rounded CSS arch used rather than pointed illustrated arch; intentional simplification. |
| Photography | Imagined city landscape in reference | Omitted: genuine media required and not supplied. Explicitly labelled media slots remain. |
| Story rhythm | Dark opening, ivory history, wine route, ivory letter | Expanded into all requested chapters using the same palette and typography. |
| Mobile | No separate reference | Responsive adaptation inspected, no horizontal page overflow at 375,390,430,768,1440,1920. |

Opening copy comparison: all required opening lines and CTA present, in order; optional requested floating music control included. No invented hero prose. The visual direction is verified; full photographic fidelity cannot be claimed until original media are supplied.

## Functional verification
- Production build passed (Next 15.5.25), including TypeScript validation and static prerendering. Route first-load JavaScript 114 kB.
- Media importer executed successfully with empty manifest.
- IAB: journey link, date easter egg, music not-configured state, birthday dialog open/close and Escape dismissal passed.
- Production dialog retested. Browser error log empty.
- Relationship counter displayed 4 years, 6 months, 20 days on 10 September 2026.
- Reduced motion stylesheet disables animation and smooth scrolling.
- Media lightbox, swipe, video and audio playback are implemented but not exercised with original assets because none have been supplied.

## Remaining before personal delivery
Replace names, birthday, photos, song, captions and alt text. Check actual media playback and cropping on a physical phone. Website is local, not deployed. Placeholder media intentionally remain. No claim of production readiness with personal assets or 10/10 photographic fidelity is made.
