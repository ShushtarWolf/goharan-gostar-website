"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { withViewTransition } from "@/lib/motion/viewTransition";
import { routerPath } from "@/lib/paths";
import { stripBasePathForRouter } from "@/lib/motion/routerHref";
import type { Locale } from "@/lib/i18n";

function normalizeTrailingSlash(p: string) {
  if (p === "/") return p;
  return p.endsWith("/") ? p : `${p}/`;
}

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
  const pathname = usePathname() ?? "/";
  const internal =
    locale !== undefined
      ? routerPath(locale, path ?? "")
      : stripBasePathForRouter(href);
  const internalPath = normalizeTrailingSlash(internal);
  const currentPath = normalizeTrailingSlash(pathname);

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
        if (internalPath === currentPath) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        withViewTransition(() => {
          try {
            router.push(internalPath);
          } catch {
            window.location.assign(href);
          }
        });
      }}
    >
      {children}
    </a>
  );
}