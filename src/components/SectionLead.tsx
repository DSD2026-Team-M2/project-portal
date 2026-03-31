type SectionLeadProps = {
  children: string;
};

export function SectionLead({ children }: SectionLeadProps) {
  return (
    <div className="callout-box mt-4 max-w-3xl">
      <p className="reading-lead">{children}</p>
    </div>
  );
}
