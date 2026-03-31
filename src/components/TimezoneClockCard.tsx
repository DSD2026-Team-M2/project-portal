import { Clock3 } from "lucide-react";

type TimezoneClockCardProps = {
  label: string;
  time: string;
  date: string;
  zone: string;
};

export function TimezoneClockCard({ label, time, date, zone }: TimezoneClockCardProps) {
  return (
    <div className="surface-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Clock3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{time}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{date}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{zone}</p>
    </div>
  );
}
