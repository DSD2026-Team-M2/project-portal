export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function resolveAssetHref(href: string): string {
  if (!href) return href;

  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(href) || /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("#")) {
    return href;
  }

  if (href.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${href.slice(1)}`;
  }

  return href;
}

export function withHash(path: string, hash?: string): string {
  return hash ? `${path}#${hash}` : path;
}
