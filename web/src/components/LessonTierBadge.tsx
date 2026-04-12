import type { Lesson } from "../content/types";

/** Compact pills for list views (All lessons). */
export function LessonTierBadge({ lesson }: { lesson: Lesson }) {
  const b = badgeForLesson(lesson);
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${b.className}`}
      >
        {b.label}
      </span>
      {lesson.isPractical ? <AppliedBadge compact /> : null}
    </span>
  );
}

/** Larger pills for lesson header. */
export function LessonTierBadgeLarge({ lesson }: { lesson: Lesson }) {
  const b = badgeForLesson(lesson);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span
        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${b.largeClassName}`}
      >
        {b.longLabel}
      </span>
      {lesson.isPractical ? <AppliedBadge /> : null}
    </span>
  );
}

function AppliedBadge({ compact }: { compact?: boolean }) {
  const cls = compact
    ? "rounded-full border border-emerald-600/25 bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-900 dark:text-emerald-100"
    : "rounded-full border border-emerald-600/35 bg-emerald-600/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 dark:text-emerald-100";
  return <span className={cls}>Applied</span>;
}

function badgeForLesson(lesson: Lesson): {
  label: string;
  longLabel: string;
  className: string;
  largeClassName: string;
} {
  const starter = lesson.subtitle?.includes("Starter notes") ?? false;
  const tier = lesson.tier ?? "foundational";

  if (starter) {
    return {
      label: "Starter",
      longLabel: "Starter notes",
      className:
        "bg-amber-500/15 text-amber-900 dark:text-amber-100 border border-amber-500/25",
      largeClassName:
        "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200",
    };
  }
  if (tier === "advanced") {
    return {
      label: "Advanced",
      longLabel: "Advanced track",
      className:
        "bg-violet-500/15 text-violet-900 dark:text-violet-100 border border-violet-500/25",
      largeClassName:
        "border-violet-500/40 bg-violet-500/10 text-violet-900 dark:text-violet-100",
    };
  }
  if (tier === "intermediate") {
    return {
      label: "Intermediate",
      longLabel: "Intermediate track",
      className:
        "bg-sky-500/15 text-sky-900 dark:text-sky-100 border border-sky-500/25",
      largeClassName:
        "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:text-sky-100",
    };
  }
  return {
    label: "Foundational",
    longLabel: "Foundational",
    className: "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]",
    largeClassName:
      "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]",
  };
}
