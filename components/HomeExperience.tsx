"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";
import { homeCopy } from "@/content/home";
import { ui } from "@/content/ui";
import { productsForHomeScene } from "@/content/products";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import RelatedMagneticLink from "@/components/RelatedMagneticLink";
import {
  wirePhotoEnter,
  wireTypoFrameScrub,
  wireTypoScroll,
} from "@/lib/typoReveal";
import { typo } from "@/components/layout/typography";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 48;
/** Tall track ≈ 1.85× viewport; sticky stage is 100vh (no GSAP pin). */
const FRAME_TRACK_CLASS = "relative h-[185vh] bg-graphite";

type SceneId = "hero" | "silencer" | "pipette" | "medical";

const SCENES: {
  id: SceneId;
  folder: string;
  eager?: boolean;
  homeScene?: "silencer" | "pipette" | "medical";
}[] = [
  { id: "hero", folder: "sUOZV", eager: true },
  { id: "silencer", folder: "ggT4W", homeScene: "silencer" },
  { id: "pipette", folder: "T3KVy", homeScene: "pipette" },
  { id: "medical", folder: "GcRW0", homeScene: "medical" },
];

const INTRO_PHOTOS = [
  asset("/photos/ead0bbd7-a967-487d-be1c-817c241baab5.webp"),
  asset("/photos/7f84af14-4ce0-4bcb-8ec7-a0d98287dcd4.webp"),
  asset("/photos/80969f47-178f-4997-93f5-cd0355fa0800.webp"),
];

function frameUrl(folder: string, index: number) {
  return asset(`/frames/${folder}/${String(index).padStart(3, "0")}.webp`);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wireFrameScrub(
  track: HTMLElement,
  canvas: HTMLCanvasElement,
  copy: HTMLElement,
  folder: string,
  eager: boolean,
) {
  const stage =
    track.querySelector<HTMLElement>("[data-frame-stage]") ?? track;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const frames: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);

  const pickFrame = (progress: number) => {
    const i = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(progress * (FRAME_COUNT - 1))),
    );
    if (frames[i]) return frames[i]!;
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (i - d >= 0 && frames[i - d]) return frames[i - d]!;
      if (i + d < FRAME_COUNT && frames[i + d]) return frames[i + d]!;
    }
    return null;
  };

  // Memory (iOS): the backing store is only reallocated when the stage's size changes,
  // not on every scrub frame, and released while the stage is far off screen.
  let lastImg: HTMLImageElement | null = null;
  let near = true;
  const draw = (img: HTMLImageElement) => {
    lastImg = img;
    if (!near) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (w < 1 || h < 1) return;

    const bw = Math.round(w * dpr);
    const bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw = w;
    let dh = h;
    let dx = 0;
    let dy = 0;
    if (ir > cr) {
      dw = h * ir;
      dx = (w - dw) / 2;
    } else {
      dh = w / ir;
      dy = (h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  const onScrub = (progress: number) => {
    const img = pickFrame(progress);
    if (img) draw(img);
  };

  // Create scrub ST immediately (DOM order) — do not wait on image load.
  wireTypoFrameScrub(copy, track, onScrub);

  const loadFrames = async (again = false) => {
    loaded = true;
    try {
      const first = frames[0] ?? (await loadImage(frameUrl(folder, 0)));
      frames[0] = first;
      draw(lastImg && again ? lastImg : first);
      if (!again) ScrollTrigger.refresh();
    } catch {
      /* poster CSS still shows */
    }

    const BATCH = 6;
    for (let start = 1; start < FRAME_COUNT; start += BATCH) {
      const jobs = [];
      for (let i = start; i < Math.min(start + BATCH, FRAME_COUNT); i++) {
        const idx = i;
        jobs.push(
          loadImage(frameUrl(folder, idx))
            .then((img) => {
              if (!released) frames[idx] = img;
            })
            .catch(() => undefined),
        );
      }
      await Promise.all(jobs);
    }
  };

  // Far off screen (more than ~1.5 screens away): free the canvas backing store and the
  // decoded frames (re-fetched from the HTTP cache on the way back; frame 0 stays as a
  // fallback). The stage is never visible while released, so nothing on screen changes.
  let loaded = eager;
  let released = false;
  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        if (!e) return;
        if (e.isIntersecting) {
          near = true;
          if (released) {
            released = false;
            void loadFrames(true);
          } else if (lastImg) {
            draw(lastImg);
          }
        } else if (loaded) {
          near = false;
          released = true;
          for (let i = 1; i < FRAME_COUNT; i++) frames[i] = null;
          canvas.width = 1;
          canvas.height = 1;
        }
      },
      { rootMargin: "150% 0px 150% 0px" },
    ).observe(track);
  }

  if (eager) {
    void loadFrames();
    return;
  }

  ScrollTrigger.create({
    trigger: track,
    start: "top bottom+=60%",
    once: true,
    onEnter: () => {
      void loadFrames();
    },
  });
}

function FrameStage({
  folder,
  eager,
  children,
  id,
}: {
  folder: string;
  eager?: boolean;
  children: ReactNode;
  id: string;
}) {
  const poster = frameUrl(folder, 0);
  return (
    <section
      data-frame-section
      data-folder={folder}
      data-eager={eager ? "true" : undefined}
      data-id={id}
      className={FRAME_TRACK_CLASS}
    >
      <div
        data-frame-stage
        className="sticky top-0 h-screen overflow-hidden bg-graphite"
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <canvas className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-graphite/55 to-graphite/25" />
        {children}
      </div>
    </section>
  );
}

function RelatedStrip({
  locale,
  scene,
}: {
  locale: Locale;
  scene: "silencer" | "pipette" | "medical";
}) {
  const items = productsForHomeScene(scene);
  if (!items.length) return null;
  return (
    <section className={`bg-graphite-soft ${typo.homeRelatedY} ${typo.sectionX}`}>
      <div className="mx-auto max-w-3xl text-center">
        <p
          data-typo
          className={typo.eyebrowCyan}
        >
          {t(homeCopy.related, locale)}
        </p>
        <div className={`${typo.stackXl} space-y-8 md:space-y-10`}>
          {items.map((p) => {
            const intro = t(p.intro, locale);
            const short =
              intro.length > 140
                ? `${intro.slice(0, 137).replace(/\s+\S*$/, "")}…`
                : intro;
            return (
              <RelatedMagneticLink
                key={p.slug}
                href={href(locale, `products/${p.slug}`)}
                title={t(p.name, locale)}
                body={short}
              />
            );
          })}
        </div>
        <a
          data-typo
          href={href(locale, "products")}
          className={`mt-14 inline-block md:mt-16 ${typo.linkCta}`}
        >
          {t(homeCopy.viewAll, locale)}
        </a>
      </div>
    </section>
  );
}

export default function HomeExperience({
  locale,
}: {
  locale: Locale;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Frames first, top→bottom, ST created sync (no async pin order bugs).
      root.querySelectorAll<HTMLElement>("[data-frame-section]").forEach((track) => {
        const canvas = track.querySelector("canvas");
        const copy = track.querySelector<HTMLElement>("[data-copy]");
        const folder = track.dataset.folder;
        if (!canvas || !copy || !folder) return;
        wireFrameScrub(
          track,
          canvas,
          copy,
          folder,
          track.dataset.eager === "true",
        );
      });

      // Text scenes: enter scrub only — no GSAP pin / pin-spacer.
      root.querySelectorAll<HTMLElement>("[data-typo-scene]").forEach((section) => {
        section.querySelectorAll<HTMLElement>("[data-typo]").forEach((el) => {
          wireTypoScroll(el, {
            trigger: section,
            start: "top 90%",
            end: "center center",
          });
        });
      });

      // Intro mist copy: shared section trigger so words finish when section is centered.
      const intro = root.querySelector<HTMLElement>("section.bg-mist");
      if (intro) {
        intro.querySelectorAll<HTMLElement>("[data-typo]").forEach((el) => {
          wireTypoScroll(el, {
            trigger: intro,
            start: "top 85%",
            end: "center center",
          });
        });
      }

      // Other static copy (related, footer) — skip frame/scene/intro.
      root.querySelectorAll<HTMLElement>("[data-typo]").forEach((el) => {
        if (el.closest("[data-frame-section]")) return;
        if (el.closest("[data-typo-scene]")) return;
        if (intro && intro.contains(el)) return;
        wireTypoScroll(el);
      });
      const photos = root.querySelectorAll<HTMLElement>("[data-photo]");
      if (photos.length) wirePhotoEnter(Array.from(photos));

      const refresh = () => ScrollTrigger.refresh();
      void document.fonts.ready.then(refresh);
      requestAnimationFrame(refresh);
    },
    { scope: rootRef, dependencies: [] },
  );

  return (
    <div ref={rootRef} className="relative bg-graphite text-mist">
      <FrameStage folder="sUOZV" eager id="hero">
        <div
          data-copy
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[min(100%,46rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(6,8,12,0.8)_0%,rgba(6,8,12,0.42)_48%,transparent_74%)]"
          />
          <p data-typo className={`relative mb-5 ${typo.eyebrowCyan}`}>
            {t(homeCopy.heroEyebrow, locale)}
          </p>
          <h1 data-typo className={`relative max-w-3xl ${typo.heroTitle}`}>
            {t(homeCopy.heroTitle, locale)}
          </h1>
          <p data-typo className={`relative max-w-lg ${typo.stackMd} ${typo.bodyOnDarkSm}`}>
            {t(homeCopy.heroBody, locale)}
          </p>
        </div>
      </FrameStage>

      <section className={`relative overflow-hidden bg-mist text-ink ${typo.sectionX} pt-40 pb-20 md:pt-56 md:pb-24`}>
        <span
          data-goo-hold
          aria-hidden
          className="pointer-events-none absolute bottom-24 left-1/2 h-2 w-28 -translate-x-1/2"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(12,14,18,0.05),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {INTRO_PHOTOS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  data-photo
                  data-goo-target
                  src={src}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`goo-picture w-full object-cover ${
                    i === 0
                      ? "col-span-2 h-48 md:h-64"
                      : "h-36 md:h-44"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="order-1 overflow-hidden lg:order-2">
            <p data-typo className={`mb-5 ${typo.eyebrowCyan}`}>
              {t(homeCopy.introEyebrow, locale)}
            </p>
            <h2 data-typo className={`${typo.sectionTitle} !text-ink`}>
              {t(homeCopy.introTitle, locale)}
            </h2>
            <p
              data-typo
              className={`${typo.stackLg} max-w-xl text-base leading-9 text-ink/70 md:text-lg md:leading-10`}
            >
              {t(homeCopy.introBody, locale)}
            </p>
          </div>
        </div>
      </section>

      <section
        data-typo-scene
        className={`relative bg-graphite ${typo.sectionX} pt-20 pb-40 md:pt-24 md:pb-56`}
      >
        <div className="relative mx-auto max-w-5xl overflow-hidden">
          <p data-typo className={`mb-5 ${typo.eyebrowCyan}`}>
            {t(homeCopy.missionLabel, locale)}
          </p>
          <h2 data-typo className={`max-w-4xl ${typo.homeMission}`}>
            {t(homeCopy.mission, locale)}
          </h2>
          <ul className={`${typo.stackXl} grid gap-8 sm:grid-cols-3 sm:gap-10 md:gap-14`}>
            {homeCopy.missionHighlights.map((item) => (
              <li
                key={item.en}
                className="border-t border-cyan/40 pt-5 text-sm leading-7 text-mist/70 md:text-base md:leading-8"
              >
                {t(item, locale)}
              </li>
            ))}
          </ul>
          <div className={`${typo.stackXl} max-w-3xl pt-6 md:pt-10`}>
            <h3 data-typo className={`mb-4 ${typo.eyebrowCyan}`}>
              {t(homeCopy.visionLabel, locale)}
            </h3>
            <p className={typo.bodyOnDark}>
              {t(homeCopy.vision, locale)}
            </p>
            <p className="mt-5 text-sm tracking-[0.15em] text-cyan">
              {t(homeCopy.visionNext, locale)}
            </p>
          </div>
        </div>
      </section>

      <section
        data-typo-scene
        className={`relative bg-graphite-soft ${typo.sectionX} py-24 md:py-32`}
      >
        <span
          data-goo-hold
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-1/2 h-2 w-28 -translate-x-1/2"
        />
        <div
          data-copy
          className="relative z-10 mx-auto max-w-3xl overflow-hidden text-center"
        >
          <p data-typo className={`mb-4 ${typo.eyebrowCyan}`}>
            {t(homeCopy.structureEyebrow, locale)}
          </p>
          <h2 data-typo className={typo.sectionTitle}>
            {t(homeCopy.structureTitle, locale)}
          </h2>
          <p data-typo className={`${typo.stackLg} ${typo.bodyOnDark} md:text-xl md:leading-10`}>
            {t(homeCopy.structureBody, locale)}
          </p>
        </div>
      </section>

      {SCENES.filter((s) => s.id !== "hero").map((scene) => {
        const copyKey = scene.homeScene!;
        const sceneCopy = homeCopy.scenes[copyKey];
        return (
          <div key={scene.id}>
            <FrameStage folder={scene.folder} id={scene.id}>
              <div
                data-copy
                className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]"
              >
                <span
                  data-goo-hold
                  aria-hidden
                  className="pointer-events-none absolute bottom-28 left-1/2 h-2 w-28 -translate-x-1/2"
                />
                <h2 data-typo className={`max-w-3xl ${typo.heroTitle} md:text-6xl lg:text-6xl`}>
                  {t(sceneCopy.title, locale)}
                </h2>
                <p data-typo className={`max-w-xl ${typo.stackMd} ${typo.bodyOnDarkSm}`}>
                  {t(sceneCopy.body, locale)}
                </p>
              </div>
            </FrameStage>
            <RelatedStrip locale={locale} scene={copyKey} />
          </div>
        );
      })}

      <section
        data-typo-scene
        className={`relative bg-graphite ${typo.sectionX} pt-24 pb-10 md:pt-32 md:pb-12`}
      >
        <span
          data-goo-hold
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-1/2 h-2 w-28 -translate-x-1/2"
        />
        <div
          data-copy
          className="relative z-10 mx-auto max-w-3xl overflow-hidden text-center"
        >
          <p data-typo className={`mb-4 ${typo.eyebrowCyan}`}>
            {t(homeCopy.performanceEyebrow, locale)}
          </p>
          <h2 data-typo className={typo.sectionTitle}>
            {t(homeCopy.performanceTitle, locale)}
          </h2>
        </div>
      </section>

      <section
        data-typo-scene
        className={`relative bg-graphite ${typo.sectionX} pt-10 pb-32 md:pt-12 md:pb-40`}
      >
        <span
          data-goo-hold
          aria-hidden
          className="pointer-events-none absolute bottom-28 left-1/2 h-2 w-28 -translate-x-1/2"
        />
        <div data-copy className="relative z-10 max-w-2xl overflow-hidden text-center">
          <h2 data-typo className={typo.sectionTitle}>
            {t(homeCopy.ctaTitle, locale)}
          </h2>
          <div className={`${typo.stackXl} flex flex-col items-center gap-5 text-base text-mist/85 md:text-lg`}>
            <a
              href={`tel:${ui.contact.phoneIran}`}
              className="transition hover:text-cyan"
            >
              <span className="me-2 text-mist/45">
                {locale === "fa" ? "ایران" : locale === "tr" ? "İran" : "Iran"}
              </span>
              <span dir="ltr">{ui.contact.phoneIran}</span>
            </a>
            <a
              href={`tel:${ui.contact.phoneTurkey}`}
              className="transition hover:text-cyan"
            >
              <span className="me-2 text-mist/45">
                {locale === "fa" ? "ترکیه" : locale === "tr" ? "Türkiye" : "Turkey"}
              </span>
              <span dir="ltr">{ui.contact.phoneTurkey}</span>
            </a>
            <a
              href={`mailto:${ui.contact.email}`}
              className="transition hover:text-cyan"
              dir="ltr"
            >
              {ui.contact.email}
            </a>
            <a
              data-typo
              href={href(locale, "contact")}
              className="mt-2 text-sm tracking-[0.15em] text-cyan transition hover:text-mist"
            >
              {t(ui.ctaContact, locale)}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-graphite px-6 pb-8 pt-8 text-center text-xs text-mist/45">
        <p data-typo>{t(ui.footer, locale)}</p>
      </footer>
    </div>
  );
}
