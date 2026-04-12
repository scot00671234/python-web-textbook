import { NavLink } from "react-router-dom";
import { SITE_NAME } from "../lib/site";
import { SiteSearch } from "./SiteSearch";
import { ThemeToggle } from "./ThemeToggle";

const linkClass =
  "rounded-full px-3 py-2 text-sm font-medium text-[var(--muted)] no-underline hover:bg-[var(--surface-2)] hover:text-[var(--text)]";

const activeClass = "bg-[var(--surface-2)] text-[var(--text)]";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--bg)_72%,transparent)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 sm:px-6 sm:py-2.5 lg:gap-4 lg:px-8 lg:py-0 lg:h-16">
        <NavLink
          to="/"
          className="group flex shrink-0 items-center gap-3 no-underline"
          end
        >
          <img
            src="/favicon.svg"
            width={40}
            height={40}
            alt=""
            className="h-10 w-10 shrink-0 rounded-2xl shadow-md ring-2 ring-white/30 transition group-hover:shadow-lg dark:ring-black/20"
            decoding="async"
          />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-[var(--text)] [font-variant-ligatures:none]">
              <span className="text-base lowercase">{SITE_NAME}</span>
            </div>
            <div className="text-xs text-[var(--muted)]">Beginner Python · structured lessons</div>
          </div>
        </NavLink>

        <div className="order-last w-full min-w-0 sm:order-none sm:flex-1 sm:max-w-md lg:max-w-lg">
          <SiteSearch />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <nav className="flex max-w-[100vw] items-center overflow-x-auto">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [linkClass, isActive ? activeClass : ""].join(" ")
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/learn/flashcards"
              className={({ isActive }) =>
                [linkClass, isActive ? activeClass : ""].join(" ")
              }
            >
              Flashcards
            </NavLink>
            <NavLink
              to="/learn/python-in-plain-english"
              className={({ isActive }) =>
                [linkClass, isActive ? activeClass : ""].join(" ")
              }
            >
              Plain English
            </NavLink>
            <NavLink
              to="/learn"
              end
              className={({ isActive }) =>
                [linkClass, isActive ? activeClass : ""].join(" ")
              }
            >
              All lessons
            </NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
