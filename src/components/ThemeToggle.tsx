import { useId } from "react";
import { useTheme } from "../theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const labelId = useId();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="group relative inline-flex h-10 w-16 items-center rounded-full bg-gradient-to-br from-[#f8f8fb] via-[#b8bcc6] to-[#fdfdff] p-[1.5px] text-[var(--text)] shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.24)] dark:from-[#8e93a0] dark:via-[#5f6472] dark:to-[#c2c7d2]"
      onClick={toggleTheme}
      aria-labelledby={labelId}
      aria-pressed={isDark}
    >
      <span id={labelId} className="sr-only">
        Toggle color theme
      </span>
      <span
        aria-hidden
        className="absolute inset-[1.5px] rounded-full bg-[var(--surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(0,0,0,0.25)] dark:bg-[var(--surface-2)]"
      />
      <span
        aria-hidden
        className={`relative z-10 grid h-7 w-7 place-items-center rounded-full border border-white/45 bg-[var(--surface-2)] text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
          isDark ? "translate-x-7" : "translate-x-1"
        }`}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
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
