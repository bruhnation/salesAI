type DailyProgressCardProps = {
  completed: number;
  goal: number;
  freeLabel: string;
  industryLabel?: string;
};

export function DailyProgressCard({
  completed,
  goal,
  freeLabel,
  industryLabel,
}: DailyProgressCardProps) {
  const progress = goal > 0 ? Math.min(100, (completed / goal) * 100) : 0;
  const goalMet = completed >= goal;

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
            Today&apos;s route
          </p>
          <p className="mt-1 text-sm font-bold text-accent">{freeLabel}</p>
          {industryLabel && (
            <p className="mt-1 text-xs text-muted">{industryLabel} scenarios</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-black tabular-nums">
            {completed}
            <span className="text-base font-semibold text-muted">/{goal}</span>
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Daily goal
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            goalMet ? "bg-streak" : "bg-accent"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-muted">
        {goalMet
          ? "Daily goal hit — streak protected 🔥"
          : `${goal - completed} more call${goal - completed === 1 ? "" : "s"} to hit your goal`}
      </p>
    </section>
  );
}
