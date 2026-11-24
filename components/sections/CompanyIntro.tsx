export function CompanyIntro() {
  return (
    <section
      data-story-section
      className="section-shell bg-bg-light text-text-dark"
      aria-labelledby="company-title"
    >
      <div
        className="parallax-layer absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, color-mix(in srgb, #00A8E8 12%, transparent), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 100%, color-mix(in srgb, #0A3D7A 8%, transparent), transparent 50%)",
        }}
      />
      <div className="section-content fade-target">
        <h2 id="company-title" className="section-heading text-brand-navy">
          گوهران گستر نادین
        </h2>
        <p className="section-body mx-auto max-w-3xl text-pretty text-text-dark-muted">
          گوهران گستر نادین با برند بین‌المللی GXPORE، اولین و تخصصی‌ترین
          تولیدکننده قطعات متخلخل پلیمری در ایران و خاورمیانه. ما ساختار مواد را
          مهندسی می‌کنیم تا عملکرد دقیق و قابل‌اتکا در فیلتراسیون، تجهیزات پزشکی
          و سیستم‌های صنعتی خلق شود.
        </p>
      </div>
    </section>
  );
}
