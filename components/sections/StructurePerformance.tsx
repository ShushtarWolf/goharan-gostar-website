export function StructurePerformance() {
  return (
    <section
      data-story-section
      className="section-shell bg-bg-graphite-elevated"
      aria-labelledby="performance-title"
    >
      <div
        className="parallax-layer absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, color-mix(in srgb, #00A8E8 14%, transparent), transparent 45%), radial-gradient(circle at 75% 65%, color-mix(in srgb, #0A3D7A 40%, transparent), transparent 50%), linear-gradient(160deg, #0a0e12 0%, #11161d 100%)",
        }}
      />
      <div className="section-content fade-target">
        <p className="mb-3 text-xs font-medium tracking-[0.28em] text-brand-cyan sm:text-sm">
          علم ساختار
        </p>
        <h2 id="performance-title" className="section-heading text-text-light">
          ساختار و عملکرد
        </h2>
        <p className="section-body mx-auto max-w-3xl text-pretty text-text-muted">
          اندازه، توزیع و هندسه منافذ، رفتار نهایی محصول را تعیین می‌کند. با
          کنترل دقیق منافذ در بازهٔ یک تا دویست میکرون و توزیع یکنواخت، عملکرد
          پایدار و تکرارپذیر در فیلتراسیون و کاربردهای صنعتی تضمین می‌شود.
        </p>
      </div>
    </section>
  );
}
