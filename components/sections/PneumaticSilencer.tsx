import { VideoBackground } from "@/components/VideoBackground";

export function PneumaticSilencer() {
  return (
    <section
      data-story-section
      className="section-shell bg-bg-graphite"
      aria-labelledby="silencer-title"
    >
      <VideoBackground src="/videos/silencer.mp4" />
      <div className="section-content fade-target">
        <h2 id="silencer-title" className="section-heading text-text-light">
          صداگیر پنوماتیک
        </h2>
        <p className="section-body mx-auto max-w-2xl text-pretty text-text-muted">
          ساختار متخلخل جریان هوا را کنترل و صدای خروجی را کاهش می‌دهد
        </p>
      </div>
    </section>
  );
}
