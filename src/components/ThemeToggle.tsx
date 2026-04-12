import { useId } from "react";
import { useTheme } from "../theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const labelId = useId();

  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text)] shadow-sm"
      onClick={toggleTheme}
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Toggle color theme
      </span>
      <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface-2)]">
        {theme === "dark" ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
