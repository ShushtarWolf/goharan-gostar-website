export function withViewTransition(callback: () => void | Promise<void>) {
  if (typeof document === "undefined") {
    void callback();
    return;
  }
  const doc = document as Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => void;
  };
  if (doc.startViewTransition) {
    doc.startViewTransition(callback);
  } else {
    void callback();
  }
}

export function productTransitionName(slug: string) {
  return `product-image-${slug.replace(/[^a-z0-9-]/gi, "-")}`;
}