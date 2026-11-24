"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 48;

type Scene = {
  id: string;
  folder: string;
  title: string;
  body: string;
  eager?: boolean;
};

const SCENES: Scene[] = [
  {
    id: "hero",
    folder: "sUOZV",
    title: "مهندسی آنچه دیده نمی‌شود",
    body: "ساختارهای میکروسکوپی که عملکرد محصولات واقعی را شکل می‌دهند",
    eager: true,
  },
  {
    id: "silencer",
    folder: "ggT4W",
    title: "صداگیر پنوماتیک",
    body: "ساختار متخلخل جریان هوا را کنترل و صدای خروجی را کاهش می‌دهد",
  },
  {
    id: "pipette",
    folder: "T3KVy",
    title: "فیلتر سرسمپلر",
    body: "حفاظت از نمونه‌ها در برابر آلودگی با فیلتراسیون دقیق در مقیاس میکرو",
  },
  {
    id: "medical",
    folder: "GcRW0",
    title: "کاربرد پزشکی",
    body: "هوا عبور می‌کند؛ مایع متوقف می‌شود — حفاظت دقیق در لحظه‌ای که اهمیت دارد",
  },
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

  // Fixed-length slot list; missing frames fall back to nearest loaded.
  const frames: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
  let loadedCount = 0;

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
  gsap.fromTo(
    copy,
    { opacity: 1 },
    {
      opacity: 0,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: eager ? "top+=12% top" : "center top",
        end: "+=50%",
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
    // First frame only → instant paint + scrub can start.
    const first = await loadImage(frameUrl(folder, 0));
    frames[0] = first;
    loadedCount = 1;
    draw(first);
    attachScrub();

    // Load remaining in small batches so the network stays usable.
    const BATCH = 6;
    for (let start = 1; start < FRAME_COUNT; start += BATCH) {
      const jobs = [];
      for (let i = start; i < Math.min(start + BATCH, FRAME_COUNT); i++) {
        const idx = i;
        jobs.push(
          loadImage(frameUrl(folder, idx))
            .then((img) => {
              frames[idx] = img;
              loadedCount += 1;
            })
            .catch(() => {
              /* keep nearest-frame fallback */
            }),
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

export default function HomeExperience() {
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
        gsap.fromTo(
          copy.children,
          { opacity: 0.4, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 45%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  const hero = SCENES[0];
  const heroPoster = frameUrl(hero.folder, 0);

  return (
    <div ref={rootRef} className="relative bg-graphite text-mist">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-start p-4 md:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/logo-fa.png")}
          alt="GXPORE"
          className="pointer-events-auto h-8 w-auto opacity-95 md:h-10"
        />
      </header>

      {/* 1. Hero — WebP frame scrub */}
      <section
        data-frame-section
        data-folder={hero.folder}
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
          <p className="mb-4 text-xs tracking-[0.35em] text-cyan md:text-sm">GXPORE</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-mist md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/85 md:text-lg">{hero.body}</p>
        </div>
      </section>

      {/* 2. Company intro */}
      <section
        data-fade-section
        className="relative flex min-h-screen items-center bg-mist px-6 py-24 text-ink md:px-12"
      >
        <div data-copy className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm text-navy">گوهران گستر نادین</p>
            <h2 className="text-2xl font-semibold leading-snug md:text-4xl">
              اولین و تخصصی‌ترین تولیدکننده قطعات متخلخل در ایران و خاورمیانه
            </h2>
            <p className="mt-6 text-base leading-8 text-ink/80 md:text-lg">
              گوهران گستر نادین با برند بین‌المللی GXPORE، اولین و تخصصی‌ترین
              تولیدکننده قطعات متخلخل پلیمری در ایران و خاورمیانه. ما ساختار مواد
              را مهندسی می‌کنیم تا عملکرد دقیق و قابل‌اتکا در فیلتراسیون، تجهیزات
              پزشکی و سیستم‌های صنعتی خلق شود.
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

      {/* 3. Structure range */}
      <section
        data-fade-section
        className="relative flex min-h-[80vh] items-center bg-graphite-soft px-6 py-24 md:px-12"
      >
        <div data-copy className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm text-cyan">از ساختار تا محصول</p>
          <h2 className="text-2xl font-semibold md:text-4xl">منافذ از ۱ تا ۲۰۰ میکرون</h2>
          <p className="mt-6 text-base leading-8 text-mist/75 md:text-lg">
            اندازه حفرات قابل تنظیم از ۱ تا ۲۰۰ میکرون، بنا به کاربرد و اندازه
            ناخالصی‌ها، با توزیع یکنواخت — ناخالصی‌ها را جدا می‌کند و جریانی پاک و
            قابل‌اتکا می‌سازد.
          </p>
        </div>
      </section>

      {/* 4–6. Product frame scrubs */}
      {SCENES.slice(1).map((scene) => (
        <section
          key={scene.id}
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
            className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-24 text-center md:pb-32"
          >
            <h2 className="text-3xl font-semibold text-mist md:text-5xl">{scene.title}</h2>
            <p className="mt-4 max-w-lg text-base text-mist/85 md:text-lg">{scene.body}</p>
          </div>
        </section>
      ))}

      {/* 7 */}
      <section
        data-fade-section
        className="relative flex min-h-[70vh] items-center bg-graphite px-6 py-24 md:px-12"
      >
        <div data-copy className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm text-cyan">ساختار و عملکرد</p>
          <h2 className="text-2xl font-semibold leading-snug md:text-4xl">
            اندازه، توزیع و هندسه منافذ، رفتار نهایی محصول را تعیین می‌کند
          </h2>
        </div>
      </section>

      {/* 8 */}
      <section
        data-fade-section
        className="relative flex min-h-[70vh] items-center justify-center bg-navy px-6 py-28"
      >
        <div data-copy className="max-w-2xl text-center">
          <h2 className="text-2xl font-semibold leading-snug md:text-4xl">
            بیایید آنچه را که بعد می‌آید مهندسی کنیم
          </h2>
          <p className="mt-8 inline-block border border-cyan/60 px-8 py-3 text-sm tracking-wide text-cyan">
            تماس — به‌زودی
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-graphite px-6 py-8 text-center text-xs text-mist/45">
        © گوهران گستر نادین · GXPORE
      </footer>
    </div>
  );
}
