"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  wireContentReveal,
  wirePhotoEnter,
  wireTypoScroll,
} from "@/lib/typoReveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { children: ReactNode };

/**
 * Inner-page motion root — same start-of-line typography fill and photo enter as the homepage.
 */
export default function PageShell({ children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      root.querySelectorAll<HTMLElement>("[data-typo]").forEach((el) => {
        wireTypoScroll(el);
      });
      const photos = root.querySelectorAll<HTMLElement>("[data-photo]");
      if (photos.length) wirePhotoEnter(Array.from(photos));
      const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
      if (reveals.length) wireContentReveal(Array.from(reveals));

      const refresh = () => ScrollTrigger.refresh();
      void document.fonts.ready.then(refresh);
      requestAnimationFrame(refresh);
    },
    { scope: rootRef, dependencies: [] },
  );

  return (
    <div ref={rootRef} className="relative bg-graphite text-mist">
      {children}
    </div>
  );
}