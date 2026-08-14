interface StatusCardProps {
  description: string;
  label: string;
  state: "checking" | "ok" | "error";
  technology: string;
}

const stateStyles = {
  checking: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-400",
    text: "Verificando",
  },
  ok: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    text: "Conectada",
  },
  error: {
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
    text: "Sin conexión",
  },
} as const;

export function StatusCard({ description, label, state, technology }: StatusCardProps) {
  const styles = stateStyles[state];

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            {label}
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">{technology}</h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${styles.dot}`} aria-hidden="true" />
          {styles.text}
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
