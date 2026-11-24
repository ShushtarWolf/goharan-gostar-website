"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type VideoBlock = {
  id: string;
  src: string;
  poster: string;
  title: string;
  body: string;
  eager?: boolean;
};

const VIDEO_BLOCKS: VideoBlock[] = [
  {
    id: "hero",
    src: asset("/videos/sUOZV.mp4"),
    poster: asset("/posters/sUOZV.webp"),
    title: "مهندسی آنچه دیده نمی‌شود",
    body: "ساختارهای میکروسکوپی که عملکرد محصولات واقعی را شکل می‌دهند",
    eager: true,
  },
  {
    id: "silencer",
    src: asset("/videos/ggT4W.mp4"),
    poster: asset("/posters/ggT4W.webp"),
    title: "صداگیر پنوماتیک",
    body: "ساختار متخلخل جریان هوا را کنترل و صدای خروجی را کاهش می‌دهد",
  },
  {
    id: "pipette",
    src: asset("/videos/T3KVy.mp4"),
    poster: asset("/posters/T3KVy.webp"),
    title: "فیلتر سرسمپلر",
    body: "حفاظت از نمونه‌ها در برابر آلودگی با فیلتراسیون دقیق در مقیاس میکرو",
  },
  {
    id: "medical",
    src: asset("/videos/GcRW0.mp4"),
    poster: asset("/posters/GcRW0.webp"),
    title: "کاربرد پزشکی",
    body: "هوا عبور می‌کند؛ مایع متوقف می‌شود — حفاظت دقیق در لحظه‌ای که اهمیت دارد",
  },
];

const INTRO_PHOTOS = [
  asset("/photos/ead0bbd7-a967-487d-be1c-817c241baab5.webp"),
  asset("/photos/7f84af14-4ce0-4bcb-8ec7-a0d98287dcd4.webp"),
  asset("/photos/80969f47-178f-4997-93f5-cd0355fa0800.webp"),
];

function ensureVideoSource(video: HTMLVideoElement) {
  const src = video.dataset.src;
  if (!src) return;
  if (video.getAttribute("src") === src) return;
  video.src = src;
  video.load();
}

function whenMeta(video: HTMLVideoElement) {
  return new Promise<void>((resolve) => {
    if (video.readyState >= 1 && video.duration) {
      resolve();
      return;
    }
    const done = () => {
      video.removeEventListener("loadedmetadata", done);
      resolve();
    };
    video.addEventListener("loadedmetadata", done);
  });
}

function revealVideoWhenReady(video: HTMLVideoElement) {
  // Keep poster visible; video is opacity-0 until a real frame exists (avoids black flash).
  gsap.set(video, { opacity: 0 });
  const show = () => {
    gsap.to(video, { opacity: 1, duration: 0.35, ease: "power1.out" });
  };
  if (video.readyState >= 2) {
    show();
    return;
  }
  video.addEventListener("loadeddata", show, { once: true });
}

function wireHeroCopy(section: HTMLElement, copy: HTMLElement) {
  // Never start at opacity 0 — that caused the empty/no-text screenshots.
  gsap.set(copy, { opacity: 1, clearProps: "transform" });
  gsap.set(copy.children, { opacity: 1, y: 0 });

  // Fade out only after the user has scrolled into the pin — not at load.
  gsap.fromTo(
    copy,
    { opacity: 1 },
    {
      opacity: 0,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top+=10% top",
        end: "+=55%",
        scrub: true,
      },
    },
  );
}

function wireProductCopy(section: HTMLElement, copy: HTMLElement) {
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
        start: "center top",
        end: "+=45%",
        scrub: true,
      },
    },
  );
}

function wireScrubVideo(
  section: HTMLElement,
  video: HTMLVideoElement,
  copy: HTMLElement,
) {
  const eager = video.dataset.eager === "true";

  if (eager) wireHeroCopy(section, copy);
  else wireProductCopy(section, copy);

  const startScrub = async () => {
    ensureVideoSource(video);
    await whenMeta(video);
    revealVideoWhenReady(video);

    const duration = video.duration || 1;
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* ignore seek errors before ready */
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=180%",
      pin: true,
      scrub: 0.4,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const t = self.progress * duration;
        if (Number.isFinite(t)) {
          try {
            video.currentTime = t;
          } catch {
            /* ignore */
          }
        }
      },
    });

    ScrollTrigger.refresh();
  };

  if (eager) {
    startScrub();
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom+=50%",
    once: true,
    onEnter: () => {
      startScrub();
    },
  });
}

export default function HomeExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      root.querySelectorAll<HTMLElement>("[data-video-section]").forEach((section) => {
        const video = section.querySelector("video");
        const copy = section.querySelector<HTMLElement>("[data-copy]");
        if (video && copy) wireScrubVideo(section, video, copy);
      });

      root.querySelectorAll<HTMLElement>("[data-fade-section]").forEach((section) => {
        const copy = section.querySelector<HTMLElement>("[data-copy]");
        if (!copy) return;
        gsap.fromTo(
          copy.children,
          { opacity: 0.35, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 40%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  const hero = VIDEO_BLOCKS[0];

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

      {/* 1. Hero */}
      <section
        data-video-section
        data-id="hero"
        className="relative h-screen overflow-hidden bg-graphite"
        style={{ backgroundImage: `url(${hero.poster})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          data-src={hero.src}
          data-eager="true"
          src={hero.src}
          poster={hero.poster}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/40 to-graphite/30" />
        <div
          data-copy
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-4 text-xs tracking-[0.35em] text-cyan md:text-sm">
            GXPORE
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-mist md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/85 md:text-lg">
            {hero.body}
          </p>
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
                className={`h-40 w-full object-cover md:h-52 ${
                  i === 0 ? "col-span-2" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. From structure to product */}
      <section
        data-fade-section
        className="relative flex min-h-[80vh] items-center bg-graphite-soft px-6 py-24 md:px-12"
      >
        <div data-copy className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm text-cyan">از ساختار تا محصول</p>
          <h2 className="text-2xl font-semibold md:text-4xl">
            منافذ از ۱ تا ۲۰۰ میکرون
          </h2>
          <p className="mt-6 text-base leading-8 text-mist/75 md:text-lg">
            اندازه حفرات قابل تنظیم از ۱ تا ۲۰۰ میکرون، بنا به کاربرد و اندازه
            ناخالصی‌ها، با توزیع یکنواخت — ناخالصی‌ها را جدا می‌کند و جریانی پاک و
            قابل‌اتکا می‌سازد.
          </p>
        </div>
      </section>

      {/* 4–6. Product videos */}
      {VIDEO_BLOCKS.slice(1).map((block) => (
        <section
          key={block.id}
          data-video-section
          data-id={block.id}
          className="relative h-screen overflow-hidden bg-graphite"
          style={{
            backgroundImage: `url(${block.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-0"
            data-src={block.src}
            poster={block.poster}
            muted
            playsInline
            preload="none"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/45 to-transparent" />
          <div
            data-copy
            className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-24 text-center md:pb-32"
          >
            <h2 className="text-3xl font-semibold text-mist md:text-5xl">{block.title}</h2>
            <p className="mt-4 max-w-lg text-base text-mist/85 md:text-lg">
              {block.body}
            </p>
          </div>
        </section>
      ))}

      {/* 7. Structure & performance */}
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

      {/* 8. CTA */}
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
