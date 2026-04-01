type SectionLeadProps = {
  children: string;
};

export function SectionLead({ children }: SectionLeadProps) {
  return <p className="section-lead mt-3 max-w-3xl">{children}</p>;
}
