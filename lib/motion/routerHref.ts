/** Turn a full public href into a path suitable for `router.push` with basePath. */
export function stripBasePathForRouter(fullHref: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (base && fullHref.startsWith(base)) {
    const rest = fullHref.slice(base.length);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return fullHref;
}