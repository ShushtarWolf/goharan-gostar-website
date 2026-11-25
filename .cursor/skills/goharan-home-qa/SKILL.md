---
name: goharan-home-qa
description: >-
  QA guardrails for the GXPORE / Goharan homepage (scroll-scrub frames, Codrops
  gooey nav, index4 typography). Use when changing HomeExperience, SiteHeader,
  typoReveal, gooey, or when the user reports white boxes near the nav, missing
  text/photo motion, or sticky/gooey issues on /fa/. Pair with gsap-scrolltrigger
  / gsap-react skills under .agents/skills/.
---

# Goharan homepage QA

## Non-negotiables

1. **WebGL paints every `.goo-picture`.** CSS `opacity: 0` does **not** hide it. The goo canvas (z-40) redraws picture rects as opaque textures (shader forces `a=1` on picture RGB).
2. **Never add fake/hidden goo targets** (anchors, off-screen imgs, full-bleed posters, transparent PNGs as `.goo-picture`) to “keep strands alive.” Only real, visible intro photos may be `.goo-picture`.
3. **Scene sticky without paint:** use `[data-goo-hold]` markers only — they lean the menu in `runGooey`, they must **never** be classed `.goo-picture`.
4. **Nav is `position: fixed`.** Picture strands die past intro; holds only lean. Do not “fix” by painting extra pictures.
5. **Typography paths:**
   - Static scroll copy → `wireTypoScroll` (long enter scrub, stay readable)
   - Pinned text scenes (`[data-typo-scene]`) → `wireTypoScenePin` (enter + hold, no blank exit)
   - Frame canvases → `wireTypoPinExit`
6. **Fonts:** body = Vazirmatn; headlines = `font-display` (IBM Plex Sans Arabic). Do not collapse back to a single face.
7. **Photos on home** come from Alireza’s `public/photos/` only — never invent stock URLs.

## After any goo / typo / pin / font change

Hard-refresh live `/fa/` (or local). **Stills are not enough for motion** — scroll through the scrub range and capture mid-enter.

| Checkpoint | Must see | Must NOT see |
|---|---|---|
| Hero | Title + body readable; display face | White photo box over/near nav |
| Intro | Mid-scroll: words mid-fly (opacity &lt; 1); then photos + copy | Empty text while photos show; painted holds |
| Structure / CTA | While pinned: enter then hold readable | Floating product rectangles; blank mid-pin |
| Video scene | Scene title; scrub frames; hold lean ok | Anchor / hold painted as goo-picture |
| Related | Titles readable | White boxes over related text |

Browser asserts:

```js
document.querySelectorAll(".goo-picture--anchor").length === 0
document.querySelectorAll(".goo-picture").length === 3 // intro grid only
document.querySelectorAll("[data-goo-hold]").length >= 1
getComputedStyle(document.querySelector("h1,h2")).fontFamily // includes Plex or plex
```

Motion evidence (while scrolling intro/structure into view):

```js
[...document.querySelectorAll(".typo-word")].some(w => +getComputedStyle(w).opacity < 0.95)
```

Also run: `node lib/home-qa-check.mjs`

## Fix ladder (ponytail)

1. White box near nav → grep `goo-picture` / `GooStrand` / `--anchor` → **delete** painted targets; do not shrink them.
2. Blank copy → check exit scrub on static lines; prefer enter-only / scene-pin hold.
3. “No text motion” in a still → widen scrub or use `wireTypoScenePin`; verify mid-scroll opacity.
4. “Sticky died” past intro → confirm holds lean + nav `fixed`; never add painted pictures.

## Related files

- `components/HomeExperience.tsx`
- `components/SiteHeader.tsx`
- `lib/typoReveal.ts`
- `lib/gooey/*`
- `app/globals.css`
- `app/layout.tsx`
- `.agents/skills/gsap-scrolltrigger` (official GSAP)
