import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { modules } from "../content/curriculum";

export function LearnLayout() {
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("learn-sidebar-collapsed");
    setSidebarCollapsed(saved === "1");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("learn-sidebar-collapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

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
          <NavLink
            to="/learn/python-dictionary"
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
            Python dictionary
          </NavLink>
        </div>
        {modules.map((module) => (
          <div key={module.id} className="py-4 first:pt-0">
            <p className="px-3 text-xs font-bold tracking-[0.08em] text-[var(--text)] uppercase">
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
      <aside
        className={[
          "hidden shrink-0 transition-[width] duration-200 lg:block",
          sidebarCollapsed ? "w-16" : "w-72",
        ].join(" ")}
      >
        <div className="sticky top-24 overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md ring-1 ring-black/5 dark:ring-white/10">
          <div
            className={[
              "border-b border-[var(--border)] bg-[var(--surface-2)]",
              sidebarCollapsed ? "px-2 py-2" : "px-3 py-3",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={sidebarCollapsed ? "sr-only" : ""}>
                <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                  All lessons
                </p>
                <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
                  Click a lesson to jump. Order matters on your first pass.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)]"
                aria-label={sidebarCollapsed ? "Expand lessons sidebar" : "Collapse lessons sidebar"}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </button>
            </div>
          </div>
          {sidebarCollapsed ? (
            <div className="flex items-center justify-center px-2 py-3">
              <span className="select-none text-[10px] font-bold uppercase tracking-wide text-[var(--muted)] [writing-mode:vertical-rl]">
                Lessons
              </span>
            </div>
          ) : (
            <div className="p-2">
              <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto px-1 pb-2">
                {nav}
              </div>
            </div>
          )}
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

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
