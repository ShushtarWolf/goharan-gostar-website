"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import {
  localeLabel,
  localeShort,
  locales,
  switchLocaleHref,
} from "@/lib/localePath";
import { stripBasePathForRouter } from "@/lib/motion/routerHref";
import { withViewTransition } from "@/lib/motion/viewTransition";
import type { Locale } from "@/lib/i18n";

type Props = { locale: Locale };

export default function LanguageMenu({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const close = useCallback(() => setOpen(false), []);

  const animateOpen = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panel, { clearProps: "all", opacity: 1 });
      return;
    }
    gsap.fromTo(
      panel,
      { opacity: 0, y: 10, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.38,
        ease: "power3.out",
        transformOrigin: "center bottom",
      },
    );
  }, []);

  const animateClose = useCallback((onDone: () => void) => {
    const panel = panelRef.current;
    if (!panel || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }
    gsap.to(panel, {
      opacity: 0,
      y: 8,
      scale: 0.96,
      duration: 0.22,
      ease: "power2.in",
      onComplete: onDone,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    animateOpen();

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(e.target as Node)) animateClose(close);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        animateClose(() => {
          close();
          btnRef.current?.focus();
        });
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, animateOpen, animateClose]);

  const pick = (target: Locale) => {
    if (target === locale) {
      animateClose(close);
      return;
    }
    const full = switchLocaleHref(pathname, target);
    const internal = stripBasePathForRouter(full);
    animateClose(() => {
      close();
      withViewTransition(() => {
        router.push(internal);
      });
    });
  };

  const toggle = () => {
    if (open) {
      animateClose(close);
    } else {
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        className="flex h-8 min-w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] font-medium tracking-wide text-cyan transition hover:border-cyan/40 hover:bg-white/10 hover:text-white md:min-w-12 md:text-xs"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label={`Language: ${localeLabel(locale)}`}
        onClick={toggle}
      >
        {localeShort(locale)}
      </button>

      <div
        ref={panelRef}
        id={menuId}
        role="listbox"
        aria-label="Choose language"
        aria-hidden={!open}
        className={`absolute bottom-[calc(100%+0.5rem)] end-0 z-50 min-w-[9.5rem] overflow-hidden rounded-xl border border-white/15 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] ${
          open ? "pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(30,40,55,0.92), rgba(12,14,18,0.95))",
          backdropFilter: "blur(18px) saturate(1.4)",
        }}
      >
        <ul className="py-1">
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start text-[12px] transition hover:bg-white/10 md:text-sm ${
                  l === locale ? "text-cyan" : "text-white/75"
                }`}
                onClick={() => pick(l)}
              >
                <span>{localeLabel(l)}</span>
                <span className="text-[10px] tracking-wider opacity-60">
                  {localeShort(l)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}