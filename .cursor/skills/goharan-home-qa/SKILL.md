---
name: goharan-home-qa
description: >-
  QA guardrails for the GXPORE / Goharan homepage (scroll-scrub frames, Codrops
  gooey nav, index4 typography). Use when changing HomeExperience, SiteHeader,
  typoReveal, gooey, or when the user reports white boxes near the nav, missing
  text/photo motion, or sticky/gooey issues on /fa/.
---

# Goharan homepage QA

## Non-negotiables

1. **WebGL paints every `.goo-picture`.** CSS `opacity: 0` does **not** hide it. The goo canvas (z-40) redraws picture rects as opaque textures.
2. **Never add fake/hidden goo targets** (anchors, off-screen imgs, full-bleed posters) to “keep strands alive.” Only real, visible intro photos may be `.goo-picture`.
3. **Nav is already `position: fixed`.** If strands die past intro, that is expected with intro-only pictures — do not “fix” by adding painted anchors.
4. **One typo path for static copy:** `wireTypoScroll` enter-only (stay readable). Pin scenes use `wireTypoPinExit`. Related titles must keep `data-typo` without breaking Persian joining.
5. **Photos on home** come from Alireza’s `public/photos/` only — never invent stock URLs.

## After any goo / typo / pin change

Hard-refresh `https://shushtarwolf.github.io/goharan-gostar-website/fa/` (or local) and screenshot:

| Checkpoint | Must see | Must NOT see |
|---|---|---|
| Hero | Title + body readable | White photo box over/near nav |
| Intro | Text + 3 photos; enter motion | Empty text column while photos show |
| Structure / CTA | Centered copy visible | Floating product rectangles |
| Video scene | Scene title; scrub frames | Anchor photo over nav |
| Related | Titles readable; optional magnetic | White boxes over related text |

Also assert in browser (or a one-liner check):

```js
document.querySelectorAll(".goo-picture--anchor").length === 0
document.querySelectorAll(".goo-picture").length === 3 // intro grid only
```

## Fix ladder (ponytail)

1. Symptom = white box near nav → grep `goo-picture` / `GooStrand` / `--anchor` → **delete** painted targets; do not shrink them.
2. Symptom = blank copy → check `wireTypoScroll` exit scrub; prefer enter-only for static lines.
3. Symptom = “sticky died” → confirm `nav` is `fixed`; explain strand targets are intro-only; do not add DOM for WebGL.

## Related files

- `components/HomeExperience.tsx`
- `components/SiteHeader.tsx`
- `lib/typoReveal.ts`
- `lib/gooey/*`
- `app/globals.css`
