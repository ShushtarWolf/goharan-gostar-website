import { VideoBackground } from "@/components/VideoBackground";

export function Hero() {
  return (
    <section
      id="top"
      data-story-section
      className="section-shell bg-bg-graphite"
      aria-labelledby="hero-title"
    >
      <VideoBackground src="/videos/hero.mp4" />
      <div className="section-content fade-target">
        <p className="mb-4 text-xs font-medium tracking-[0.35em] text-brand-cyan sm:text-sm">
          GXPORE
        </p>
        <h1
          id="hero-title"
          className="section-heading text-balance text-text-light"
        >
          مهندسی آنچه دیده نمی‌شود
        </h1>
        <p className="section-body mx-auto max-w-2xl text-balance text-text-muted">
          ساختارهای میکروسکوپی که عملکرد محصولات واقعی را شکل می‌دهند
        </p>
      </div>
    </section>
  );
}
