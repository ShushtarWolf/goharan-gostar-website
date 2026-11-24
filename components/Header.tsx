import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="flex items-start justify-start p-4 sm:p-6">
        <a
          href="#top"
          className="pointer-events-auto inline-flex rounded-sm bg-bg-graphite/40 p-1.5 backdrop-blur-md transition-opacity hover:opacity-90"
          aria-label="GXPORE — بازگشت به ابتدا"
        >
          <Logo priority />
        </a>
      </div>
    </header>
  );
}
