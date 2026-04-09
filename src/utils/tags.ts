export function isAttentionTag(tag: string): boolean {
  return tag.startsWith("attention:");
}

export function getAttentionTagLabel(tag: string): string {
  return isAttentionTag(tag) ? tag.slice("attention:".length) : tag;
}

export function getStatusTone(status: string): string {
  switch (status) {
    case "completed":
    case "final":
    case "ready":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "in-progress":
    case "active":
    case "draft":
      return "border-sky-100 bg-sky-50 text-sky-700";
    case "at-risk":
    case "watch":
      return "border-amber-100 bg-amber-50 text-amber-700";
    case "blocked":
    case "archived":
      return "border-slate-200 bg-slate-100 text-slate-600";
    case "in-review":
      return "border-violet-100 bg-violet-50 text-violet-700";
    default:
      return "border-slate-200 bg-white/80 text-slate-700";
  }
}

export function getTypeTone(type: string): string {
  switch (type) {
    case "research":
      return "border-teal-100 bg-teal-50 text-teal-700";
    case "meeting":
      return "border-slate-200 bg-slate-100 text-slate-700";
    case "weekly-report":
      return "border-indigo-100 bg-indigo-50 text-indigo-700";
    case "decision":
      return "border-amber-100 bg-amber-50 text-amber-700";
    case "interface":
      return "border-cyan-100 bg-cyan-50 text-cyan-700";
    case "test":
      return "border-lime-100 bg-lime-50 text-lime-700";
    case "demo":
      return "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-700";
    case "milestone":
      return "border-blue-100 bg-blue-50 text-blue-700";
    default:
      return "border-sky-100 bg-sky-50 text-sky-700";
  }
}
