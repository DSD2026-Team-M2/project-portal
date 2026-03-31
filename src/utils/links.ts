export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function withHash(path: string, hash?: string): string {
  return hash ? `${path}#${hash}` : path;
}
