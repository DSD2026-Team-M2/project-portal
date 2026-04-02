import type { ReactNode } from "react";

type MetadataPanelProps = {
  title: string;
  children: ReactNode;
};

export function MetadataPanel({ title, children }: MetadataPanelProps) {
  return (
    <section className="meta-panel">
      <p className="meta-panel-title">{title}</p>
      <div className="mt-4 space-y-3 text-[0.98rem] leading-7 text-slate-600">{children}</div>
    </section>
  );
}
