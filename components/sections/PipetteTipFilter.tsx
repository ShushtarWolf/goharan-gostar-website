import { VideoBackground } from "@/components/VideoBackground";

export function PipetteTipFilter() {
  return (
    <section
      data-story-section
      className="section-shell bg-bg-graphite"
      aria-labelledby="pipette-title"
    >
      <VideoBackground src="/videos/pipette.mp4" />
      <div className="section-content fade-target">
        <h2 id="pipette-title" className="section-heading text-text-light">
          فیلتر سرسمپلر
        </h2>
        <p className="section-body mx-auto max-w-2xl text-pretty text-text-muted">
          حفاظت از نمونه‌ها در برابر آلودگی با فیلتراسیون دقیق در مقیاس میکرو
        </p>
      </div>
    </section>
  );
}
