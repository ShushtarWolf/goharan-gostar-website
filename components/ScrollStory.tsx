"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP + ScrollTrigger storytelling: fade text in/out per section,
 * subtle parallax / slow zoom on background layers.
 */
export function ScrollStory() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(".fade-target", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-story-section]");

      sections.forEach((section) => {
        const content = section.querySelector(".fade-target");
        const parallax = section.querySelector(".parallax-layer");

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 72%",
                end: "top 28%",
                scrub: 0.6,
              },
            },
          );

          gsap.fromTo(
            content,
            { opacity: 1 },
            {
              opacity: 0,
              ease: "power1.in",
              scrollTrigger: {
                trigger: section,
                start: "bottom 78%",
                end: "bottom 35%",
                scrub: 0.6,
              },
            },
          );
        }

        if (parallax) {
          gsap.fromTo(
            parallax,
            { scale: 1.08, yPercent: -4 },
            {
              scale: 1,
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
