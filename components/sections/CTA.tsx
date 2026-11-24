export function CTA() {
  return (
    <section
      id="contact"
      data-story-section
      className="section-shell bg-bg-graphite"
      aria-labelledby="cta-title"
    >
      <div
        className="parallax-layer absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 80%, color-mix(in srgb, #0A3D7A 55%, transparent), transparent 60%), radial-gradient(circle at 20% 20%, color-mix(in srgb, #00A8E8 12%, transparent), transparent 40%), #0a0e12",
        }}
      />
      <div className="section-content fade-target">
        <h2 id="cta-title" className="section-heading text-text-light">
          بیایید آنچه را که بعد می‌آید مهندسی کنیم
        </h2>
        <p className="section-body mx-auto mb-10 max-w-2xl text-pretty text-text-muted">
          توسعهٔ محصول سفارشی، همکاری فنی و طراحی ساختار متخلخل متناسب با نیاز
          شما — از ایده تا تولید صنعتی.
        </p>
        <a
          href="mailto:info@gxpore.com"
          className="inline-flex min-h-12 items-center justify-center border border-brand-cyan/60 bg-transparent px-8 text-base font-medium text-text-light transition-colors hover:border-brand-cyan hover:bg-brand-cyan/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
        >
          تماس با ما
        </a>
      </div>
    </section>
  );
}
