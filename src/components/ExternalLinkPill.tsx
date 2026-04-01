import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

type ExternalLinkPillProps = {
  href: string;
  children: ReactNode;
};

export function ExternalLinkPill({ href, children }: ExternalLinkPillProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="external-link-pill">
      <span className="min-w-0 truncate">{children}</span>
      <ExternalLink className="h-4 w-4 shrink-0" />
    </a>
  );
}
