import { VideoBackground } from "@/components/VideoBackground";

export function MedicalApplication() {
  return (
    <section
      data-story-section
      className="section-shell bg-bg-graphite"
      aria-labelledby="medical-title"
    >
      <VideoBackground src="/videos/medical.mp4" />
      <div className="section-content fade-target">
        <h2 id="medical-title" className="section-heading text-text-light">
          کاربرد پزشکی
        </h2>
        <p className="section-body mx-auto max-w-2xl text-pretty text-text-muted">
          فیلترهایی که گاز را عبور می‌دهند و مایع را متوقف می‌کنند؛ طراحی‌شده
          برای تجهیزات پزشکی حیاتی.
        </p>
      </div>
    </section>
  );
}
