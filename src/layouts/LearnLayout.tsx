import { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { modules } from "../content/curriculum";

export function LearnLayout() {
  const [open, setOpen] = useState(false);

  const nav = useMemo(
    () => (
      <>
        <div className="flex flex-col gap-2 px-2 pb-3">
          <NavLink
            to="/learn/flashcards"
            className={({ isActive }) =>
              [
                "flex w-full items-center justify-center rounded-xl border-2 px-3 py-2.5 text-xs font-bold no-underline transition-colors",
                isActive
                  ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface))]",
              ].join(" ")
            }
            onClick={() => setOpen(false)}
          >
            Flashcards: quick recall
          </NavLink>
          <NavLink
            to="/learn/python-in-plain-english"
            className={({ isActive }) =>
              [
                "flex w-full items-center justify-center rounded-xl border-2 px-3 py-2.5 text-xs font-bold no-underline transition-colors",
                isActive
                  ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface))]",
              ].join(" ")
            }
            onClick={() => setOpen(false)}
          >
            Python in plain English
          </NavLink>
        </div>
        {modules.map((module) => (
          <div key={module.id} className="py-4 first:pt-0">
            <p className="px-3 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
              {module.title}
            </p>
            <p className="mt-1 px-3 text-xs leading-relaxed text-[var(--muted)]">
              {module.blurb}
            </p>
            <ul className="mt-3 space-y-1">
              {module.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <NavLink
                    to={`/learn/${lesson.slug}`}
                    className={({ isActive }) =>
                      [
                        "block border-l-2 py-2 pl-3 pr-2 text-sm leading-snug no-underline transition-colors",
                        isActive
                          ? "border-[var(--accent)] bg-[var(--surface-2)] font-medium text-[var(--text)]"
                          : "border-transparent text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
                      ].join(" ")
                    }
                    onClick={() => setOpen(false)}
                  >
                    {lesson.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    ),
    [],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 pb-16 sm:px-6 lg:px-8">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md ring-1 ring-black/5 dark:ring-white/10">
          <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-3 py-3">
            <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              All lessons
            </p>
            <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
              Click a lesson to jump. Order matters on your first pass.
            </p>
          </div>
          <div className="p-2">
          <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto px-1 pb-2">
            {nav}
          </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="lg:hidden">
          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left text-sm font-semibold text-[var(--text)]"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span>All lessons</span>
            <span className="text-[var(--muted)]">{open ? "▲" : "▼"}</span>
          </button>
          {open ? (
            <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
              {nav}
            </div>
          ) : null}
        </div>

        <Outlet />
      </div>
    </div>
  );
}
