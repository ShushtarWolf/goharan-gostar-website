"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

type Props = { children: ReactNode };

/** Route enter — pairs with CSS View Transitions on `page-root`. */
export default function PageTransition({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    },
    { dependencies: [pathname] },
  );

  return (
    <div
      ref={ref}
      className="page-root"
      style={{ viewTransitionName: "page-root" }}
    >
      {children}
    </div>
  );
}