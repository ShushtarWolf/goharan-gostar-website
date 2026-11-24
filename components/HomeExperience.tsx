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

const SCENES: { id: SceneId; folder: string; eager?: boolean; homeScene?: "silencer" | "pipette" | "medical" }[] = [
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

  gsap.set(copy, { opacity: 1 });
  gsap.set(copy.children, { opacity: 1, y: 0 });
  // Keep product-scene copy readable through most of the scrub; fade late.
  gsap.fromTo(
    copy,
    { opacity: 1 },
    {
      opacity: 0,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: eager ? "top+=12% top" : "bottom-=35% top",
        end: eager ? "+=50%" : "+=40%",
        scrub: true,
      },
    },
  );

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
    <section className="bg-graphite-soft px-6 py-20 md:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm tracking-wide text-cyan">
          {t(homeCopy.related, locale)}
        </p>
        <div className="mt-10 flex flex-col items-center gap-10">
          {items.map((p) => (
            <a
              key={p.slug}
              href={href(locale, `products/${p.slug}`)}
              className="group block max-w-xl transition"
            >
              <span className="block text-2xl font-semibold text-mist transition group-hover:text-cyan md:text-3xl">
                {t(p.name, locale)}
              </span>
              <span className="mt-3 block text-base leading-7 text-mist/65 md:text-lg">
                {t(p.intro, locale)}
              </span>
            </a>
          ))}
        </div>
        <a
          href={href(locale, "products")}
          className="mt-12 inline-block text-sm text-cyan transition hover:text-mist"
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
        gsap.fromTo(
          copy.children,
          {
            opacity: 0,
            y: premium ? 48 : 28,
            filter: premium ? "blur(8px)" : "blur(0px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: premium ? 0.14 : 0.08,
            duration: premium ? 1.15 : 0.7,
            ease: premium ? "power3.out" : "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/40 to-graphite/25" />
        <div
          data-copy
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-4 text-xs tracking-[0.35em] text-cyan md:text-sm">
            {t(homeCopy.heroEyebrow, locale)}
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-mist md:text-5xl lg:text-6xl">
            {t(homeCopy.heroTitle, locale)}
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/85 md:text-lg">
            {t(homeCopy.heroBody, locale)}
          </p>
        </div>
      </section>

      <section
        data-fade-section
        className="relative flex min-h-screen items-center bg-mist px-6 py-24 text-ink md:px-12"
      >
        <div data-copy className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm text-navy">{t(homeCopy.introEyebrow, locale)}</p>
            <h2 className="text-2xl font-semibold leading-snug md:text-4xl">
              {t(homeCopy.introTitle, locale)}
            </h2>
            <p className="mt-6 text-base leading-8 text-ink/80 md:text-lg">
              {t(homeCopy.introBody, locale)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {INTRO_PHOTOS.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`h-40 w-full object-cover md:h-52 ${i === 0 ? "col-span-2" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        data-fade-section
        data-premium="true"
        className="relative flex min-h-[80vh] items-center bg-graphite-soft px-6 py-24 md:px-12"
      >
        <div data-copy className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm tracking-[0.2em] text-cyan">
            {t(homeCopy.structureEyebrow, locale)}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {t(homeCopy.structureTitle, locale)}
          </h2>
          <p className="mt-8 text-base leading-9 text-mist/75 md:text-xl md:leading-10">
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/45 to-transparent" />
              <div
                data-copy
                className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
              >
                <h2 className="text-3xl font-semibold text-mist drop-shadow-lg md:text-5xl">
                  {t(sceneCopy.title, locale)}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-mist/90 drop-shadow md:text-lg md:leading-9">
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
          <p className="mb-3 text-sm tracking-[0.2em] text-cyan">
            {t(homeCopy.performanceEyebrow, locale)}
          </p>
          <h2 className="text-3xl font-semibold leading-snug tracking-tight md:text-5xl">
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
          <h2 className="text-3xl font-semibold leading-snug tracking-tight md:text-5xl">
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
              className="mt-4 text-sm tracking-wide text-cyan transition hover:text-mist"
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
