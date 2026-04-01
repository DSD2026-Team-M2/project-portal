import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type InternalLinkPillProps = {
  to: string;
  children: ReactNode;
};

export function InternalLinkPill({ to, children }: InternalLinkPillProps) {
  return (
    <Link to={to} className="internal-link-pill">
      <span className="min-w-0 truncate">{children}</span>
      <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}
