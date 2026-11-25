---
name: goharan-home-qa
description: >-
  QA guardrails for the GXPORE / Goharan homepage (scroll-scrub frames, Codrops
  gooey nav, index4 typography). Use when changing HomeExperience, SiteHeader,
  typoReveal, gooey, or when the user reports white boxes near the nav, missing
  text/photo motion, or sticky/gooey issues on /fa/. Pair with gsap-scrolltrigger
  / gsap-react skills under .agents/skills/. Prefer frontend-atlas sticky+scrub
  over GSAP pin: true.
---

# Goharan homepage QA

## Non-negotiables

1. **WebGL paints every `.goo-picture`.** CSS `opacity: 0` does **not** hide it. The goo canvas (z-40) redraws picture rects as opaque textures (shader forces `a=1` on picture RGB).
2. **Never add fake/hidden goo targets** (anchors, off-screen imgs, full-bleed posters, transparent PNGs as `.goo-picture`) to “keep strands alive.” Only real, visible intro photos may be `.goo-picture`.
3. **Scene sticky without paint:** use `[data-goo-hold]` markers only — they lean the menu in `runGooey`, they must **never** be classed `.goo-picture`.
4. **Nav is `position: fixed`.** Picture strands die past intro; holds only lean. Do not “fix” by painting extra pictures.
5. **Typography paths (no stacked GSAP pins):**
   - Static / scene scroll copy → `wireTypoScroll` (long enter scrub; scene triggers use section `center center` end so copy is readable when the scene owns the view)
   - Frame canvases → CSS `sticky` stage inside a tall track + `wireTypoFrameScrub` (**no** `pin: true`)
6. **Fonts:** body = Vazirmatn; headlines = `font-display` (IBM Plex Sans Arabic). Do not collapse back to a single face.
7. **Photos on home** come from Alireza’s `public/photos/` only — never invent stock URLs.
8. **Still screenshots are NOT enough.** Mid-scroll motion evidence is required, and no in-viewport copy may stay invisible.

## After any goo / typo / sticky / font change

Hard-refresh live `/fa/` (or local). Scroll with real wheel/step — do not only jump-to-Y.

| Checkpoint | Must see | Must NOT see |
|---|---|---|
| Hero | Title + body readable; display face; mid-scrub words moving | White photo box over/near nav; blank black viewport with only nav |
| Intro | Mid-scroll: words mid-fly (opacity &lt; 1); then photos + copy on mist/light | Empty text while photos show; painted holds; ghost text from other scenes |
| Structure / CTA | Enter scrub then readable when section centered | Floating product rectangles; blank mid-scene; overlapping ghost typography |
| Video scene | Scene title while sticky stage fills view; scrub frames; hold lean ok | Anchor / hold painted as goo-picture; text blank for most of hold |
| Related | Titles readable | White boxes over related text |

Browser asserts:

```js
document.querySelectorAll(".goo-picture--anchor").length === 0
document.querySelectorAll(".goo-picture").length === 3 // intro grid only
document.querySelectorAll("[data-goo-hold]").length >= 1
document.querySelectorAll("[data-frame-stage]").length >= 1
getComputedStyle(document.querySelector("h1,h2")).fontFamily // includes Plex or plex
```

Motion evidence (while scrolling intro/structure into view) **and** no invisible in-view copy when settled:

```js
// Mid-scroll: some words still animating
[...document.querySelectorAll(".typo-word")].some(w => +getComputedStyle(w).opacity < 0.95)

// Settled on a scene: in-viewport typo-words must be readable (avg ≈ 1)
(() => {
  const words = [...document.querySelectorAll(".typo-word")].filter(w => {
    const r = w.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.width > 0;
  });
  if (!words.length) return true;
  const avg = words.reduce((s, w) => s + +getComputedStyle(w).opacity, 0) / words.length;
  return avg > 0.85;
})()
```

Also run: `node lib/home-qa-check.mjs`  
Prefer frontend-atlas `scripts/motion-audit.mjs` against local `/fa` at 1440 and 390 before declaring done.

## Fix ladder (ponytail)

1. White box near nav → grep `goo-picture` / `GooStrand` / `--anchor` → **delete** painted targets; do not shrink them.
2. Blank copy / black empty viewport → check late exit scrub; prefer enter-only / sticky track; **delete** stacked `pin: true`.
3. Ghost overlapping typography → pin-spacer corruption; migrate to sticky + scrub.
4. “No text motion” in a still → widen scrub; verify mid-scroll opacity; stills alone do not pass QA.
5. “Sticky died” past intro → confirm holds lean + nav `fixed`; never add painted pictures.

## Related files

- `components/HomeExperience.tsx`
- `components/SiteHeader.tsx`
- `lib/typoReveal.ts`
- `lib/gooey/*`
- `app/globals.css`
- `app/layout.tsx`
- `.agents/skills/gsap-scrolltrigger` (official GSAP)
- `.agents/skills/frontend-atlas` (sticky over pin; motion-audit)
