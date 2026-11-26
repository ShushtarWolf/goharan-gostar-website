"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  specs: string[][];
  placeholderNote?: string;
};

export default function AnimatedSpecsTable({ specs, placeholderNote }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rows = root.querySelectorAll("tbody tr");
      gsap.set(rows, { opacity: 0, y: 10 });
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.035,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal className="mt-4 overflow-x-auto border border-white/10">
      {placeholderNote ? (
        <p className="border-b border-white/10 px-3 py-2 text-sm text-mist/50">
          {placeholderNote}
        </p>
      ) : null}
      <table className="min-w-full text-sm">
        <tbody>
          {specs.map((row, i) => (
            <tr
              key={i}
              className={
                i === 0 ? "bg-white/5 font-medium text-mist" : "text-mist/75"
              }
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-t border-white/10 px-3 py-2 whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}