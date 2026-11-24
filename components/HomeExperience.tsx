"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";
import { homeCopy } from "@/content/home";
import { ui } from "@/content/ui";
import { productsForHomeScene } from "@/content/products";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 48;

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
  section: HTMLElement,
  canvas: HTMLCanvasElement,
  copy: HTMLElement,
  folder: string,
  eager: boolean,
) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const frames: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
  const kids = Array.from(copy.children) as HTMLElement[];

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

  const draw = (img: HTMLImageElement) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = section.clientWidth;
    const h = section.clientHeight;
    if (w < 1 || h < 1) return;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
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

  // Entrance: text rises in as the scene arrives (before / at pin).
  gsap.set(copy, { opacity: 1 });
  gsap.set(kids, { opacity: 0, y: 36, filter: "blur(10px)" });
  gsap.to(kids, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    stagger: 0.12,
    duration: 1.05,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  const attachScrub = () => {
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=180%",
      pin: true,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const img = pickFrame(self.progress);
        if (img) draw(img);
        // Stay readable through most of the scrub; soft exit in last ~25%.
        const fade =
          self.progress < 0.72
            ? 1
            : Math.max(0, 1 - (self.progress - 0.72) / 0.28);
        gsap.set(copy, { opacity: fade });
      },
      onRefresh: (self) => {
        const img = pickFrame(self.progress);
        if (img) draw(img);
      },
    });
    ScrollTrigger.refresh();
  };

  const boot = async () => {
    const first = await loadImage(frameUrl(folder, 0));
    frames[0] = first;
    draw(first);
    attachScrub();

    const BATCH = 6;
    for (let start = 1; start < FRAME_COUNT; start += BATCH) {
      const jobs = [];
      for (let i = start; i < Math.min(start + BATCH, FRAME_COUNT); i++) {
        const idx = i;
        jobs.push(
          loadImage(frameUrl(folder, idx))
            .then((img) => {
              frames[idx] = img;
            })
            .catch(() => undefined),
        );
      }
      await Promise.all(jobs);
    }
  };

  if (eager) {
    boot();
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom+=60%",
    once: true,
    onEnter: () => {
      boot();
    },
  });
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
    <section
      data-fade-section
      data-premium="true"
      className="bg-graphite-soft px-6 py-24 md:px-12 md:py-32"
    >
      <div data-copy className="mx-auto max-w-3xl text-center">
        <p
          data-reveal
          className="text-[11px] font-medium tracking-[0.35em] text-cyan md:text-xs"
        >
          {t(homeCopy.related, locale)}
        </p>
        {items.map((p) => (
          <a
            key={p.slug}
            data-reveal
            href={href(locale, `products/${p.slug}`)}
            className="group mt-12 block max-w-2xl md:mt-14"
          >
            <span className="block text-3xl font-medium leading-tight tracking-tight text-mist transition duration-300 group-hover:text-cyan md:text-5xl md:leading-[1.15]">
              {t(p.name, locale)}
            </span>
            <span className="mt-5 block text-base leading-8 text-mist/55 md:text-lg md:leading-9">
              {t(p.intro, locale)}
            </span>
          </a>
        ))}
        <a
          data-reveal
          href={href(locale, "products")}
          className="mt-16 inline-block text-sm tracking-[0.15em] text-cyan transition hover:text-mist"
        >
          {t(homeCopy.viewAll, locale)}
        </a>
      </div>
    </section>
  );
}

export default function HomeExperience({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      root.querySelectorAll<HTMLElement>("[data-frame-section]").forEach((section) => {
        const canvas = section.querySelector("canvas");
        const copy = section.querySelector<HTMLElement>("[data-copy]");
        const folder = section.dataset.folder;
        if (!canvas || !copy || !folder) return;
        wireFrameScrub(
          section,
          canvas,
          copy,
          folder,
          section.dataset.eager === "true",
        );
      });

      root.querySelectorAll<HTMLElement>("[data-fade-section]").forEach((section) => {
        const copy = section.querySelector<HTMLElement>("[data-copy]");
        if (!copy) return;
        const premium = section.dataset.premium === "true";
        const targets = copy.querySelectorAll<HTMLElement>("[data-reveal]");
        const els = targets.length ? Array.from(targets) : Array.from(copy.children);

        gsap.fromTo(
          els,
          {
            opacity: 0,
            y: premium ? 56 : 32,
            filter: premium ? "blur(12px)" : "blur(4px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: premium ? 0.16 : 0.1,
            duration: premium ? 1.25 : 0.85,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  const heroPoster = frameUrl("sUOZV", 0);

  return (
    <div ref={rootRef} className="relative bg-graphite text-mist">
      <section
        data-frame-section
        data-folder="sUOZV"
        data-eager="true"
        data-id="hero"
        className="relative h-screen overflow-hidden bg-graphite"
        style={{
          backgroundImage: `url(${heroPoster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <canvas className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-graphite/50 to-graphite/30" />
        <div
          data-copy
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-5 text-[11px] font-medium tracking-[0.4em] text-cyan md:text-xs">
            {t(homeCopy.heroEyebrow, locale)}
          </p>
          <h1 className="max-w-3xl text-4xl font-medium leading-[1.15] tracking-tight text-mist md:text-6xl lg:text-7xl">
            {t(homeCopy.heroTitle, locale)}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-mist/80 md:text-xl md:leading-9">
            {t(homeCopy.heroBody, locale)}
          </p>
        </div>
      </section>

      {/* Intro — redesigned with premium load motion */}
      <section
        data-fade-section
        data-premium="true"
        className="relative overflow-hidden bg-mist px-6 py-28 text-ink md:px-12 md:py-36"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(10,61,122,0.08),transparent_55%)]" />
        <div
          data-copy
          className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:items-center lg:gap-20"
        >
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {INTRO_PHOTOS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  data-reveal
                  src={src}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`w-full object-cover ${
                    i === 0
                      ? "col-span-2 h-48 md:h-64"
                      : "h-36 md:h-44"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p
              data-reveal
              className="mb-5 text-[11px] font-medium tracking-[0.3em] text-navy md:text-xs"
            >
              {t(homeCopy.introEyebrow, locale)}
            </p>
            <h2
              data-reveal
              className="text-3xl font-medium leading-[1.25] tracking-tight md:text-5xl md:leading-[1.2]"
            >
              {t(homeCopy.introTitle, locale)}
            </h2>
            <p
              data-reveal
              className="mt-8 max-w-xl text-base leading-9 text-ink/70 md:text-lg md:leading-10"
            >
              {t(homeCopy.introBody, locale)}
            </p>
          </div>
        </div>
      </section>

      <section
        data-fade-section
        data-premium="true"
        className="relative flex min-h-[80vh] items-center bg-graphite-soft px-6 py-24 md:px-12"
      >
        <div data-copy className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[11px] font-medium tracking-[0.35em] text-cyan md:text-xs">
            {t(homeCopy.structureEyebrow, locale)}
          </p>
          <h2 className="text-3xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            {t(homeCopy.structureTitle, locale)}
          </h2>
          <p className="mt-8 text-base leading-9 text-mist/65 md:text-xl md:leading-10">
            {t(homeCopy.structureBody, locale)}
          </p>
        </div>
      </section>

      {SCENES.filter((s) => s.id !== "hero").map((scene) => {
        const copyKey = scene.homeScene!;
        const sceneCopy = homeCopy.scenes[copyKey];
        return (
          <div key={scene.id}>
            <section
              data-frame-section
              data-folder={scene.folder}
              data-id={scene.id}
              className="relative h-screen overflow-hidden bg-graphite"
              style={{
                backgroundImage: `url(${frameUrl(scene.folder, 0)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <canvas className="absolute inset-0 h-full w-full" aria-hidden />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-graphite/55 to-graphite/25" />
              <div
                data-copy
                className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
              >
                <h2 className="max-w-3xl text-4xl font-medium leading-tight tracking-tight text-mist md:text-6xl">
                  {t(sceneCopy.title, locale)}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-mist/85 md:text-xl md:leading-9">
                  {t(sceneCopy.body, locale)}
                </p>
              </div>
            </section>
            <RelatedStrip locale={locale} scene={copyKey} />
          </div>
        );
      })}

      <section
        data-fade-section
        data-premium="true"
        className="relative flex min-h-[70vh] items-center bg-graphite px-6 py-24 md:px-12"
      >
        <div data-copy className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[11px] font-medium tracking-[0.35em] text-cyan md:text-xs">
            {t(homeCopy.performanceEyebrow, locale)}
          </p>
          <h2 className="text-3xl font-medium leading-snug tracking-tight md:text-5xl">
            {t(homeCopy.performanceTitle, locale)}
          </h2>
        </div>
      </section>

      <section
        data-fade-section
        data-premium="true"
        className="relative flex min-h-[70vh] items-center justify-center bg-navy px-6 py-28"
      >
        <div data-copy className="max-w-2xl text-center">
          <h2 className="text-3xl font-medium leading-snug tracking-tight md:text-5xl">
            {t(homeCopy.ctaTitle, locale)}
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 text-base text-mist/85 md:text-lg">
            <a
              href={`tel:${ui.contact.phoneIran}`}
              className="transition hover:text-cyan"
              dir="ltr"
            >
              {ui.contact.phoneIran}
            </a>
            <a
              href={`tel:${ui.contact.phoneTurkey}`}
              className="transition hover:text-cyan"
              dir="ltr"
            >
              {ui.contact.phoneTurkey}
            </a>
            <a
              href={`mailto:${ui.contact.email}`}
              className="transition hover:text-cyan"
              dir="ltr"
            >
              {ui.contact.email}
            </a>
            <a
              href={href(locale, "contact")}
              className="mt-4 text-sm tracking-[0.15em] text-cyan transition hover:text-mist"
            >
              {t(ui.ctaContact, locale)}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-graphite px-6 py-8 text-center text-xs text-mist/45">
        {t(ui.footer, locale)}
      </footer>
    </div>
  );
}
