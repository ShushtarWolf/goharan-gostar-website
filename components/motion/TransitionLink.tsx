"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { withViewTransition } from "@/lib/motion/viewTransition";
import { routerPath } from "@/lib/paths";
import { stripBasePathForRouter } from "@/lib/motion/routerHref";
import type { Locale } from "@/lib/i18n";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /** When set, router.push uses basePath-safe internal path. */
  locale?: Locale;
  path?: string;
  children: ReactNode;
};

export default function TransitionLink({
  href,
  locale,
  path,
  children,
  onClick,
  ...rest
}: Props) {
  const router = useRouter();
  const internal =
    locale !== undefined
      ? routerPath(locale, path ?? "")
      : stripBasePathForRouter(href);

  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          rest.target === "_blank"
        ) {
          return;
        }
        e.preventDefault();
        withViewTransition(() => {
          router.push(internal);
        });
      }}
    >
      {children}
    </a>
  );
}