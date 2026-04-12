import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchSite, type SearchHit } from "../lib/siteSearch";

const MIN_CHARS = 2;
const DROPDOWN_MAX = 8;
const DEBOUNCE_MS = 250;

function kindLabel(kind: SearchHit["kind"]): string {
  switch (kind) {
    case "lesson":
      return "Lesson";
    case "deck":
      return "Deck";
    case "plain":
      return "Plain English";
    case "blog":
      return "Article";
    default:
      return "Page";
  }
}

export function SiteSearch() {
  const listId = useId();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    if (debounced.length < MIN_CHARS) return [];
    return searchSite(debounced, DROPDOWN_MAX);
  }, [debounced]);

  const showList = open && debounced.length >= MIN_CHARS;

  useEffect(() => {
    if (!showList) setActive(-1);
  }, [showList, results]);

  useEffect(() => {
    if (!showList) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showList]);

  const goSearchPage = useCallback(
    (q: string) => {
      const t = q.trim();
      if (!t) return;
      navigate(`/search?q=${encodeURIComponent(t)}`);
      setOpen(false);
      setActive(-1);
    },
    [navigate],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (active >= 0 && active < results.length) {
        const hit = results[active];
        if (hit) navigate(hit.href);
        setOpen(false);
        setQuery("");
        return;
      }
      goSearchPage(query);
    },
    [active, goSearchPage, navigate, query, results],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showList || results.length === 0) {
        if (e.key === "Enter") {
          e.preventDefault();
          goSearchPage(query);
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [goSearchPage, query, results.length, showList],
  );

  return (
    <div ref={rootRef} className="relative w-full min-w-0 max-w-lg">
      <form role="search" onSubmit={onSubmit} className="relative">
        <label htmlFor={listId} className="sr-only">
          Search lessons and pages
        </label>
        <input
          id={listId}
          type="search"
          name="q"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-controls={showList ? `${listId}-listbox` : undefined}
          aria-expanded={showList}
          className="h-10 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] py-2 pl-10 pr-24 text-sm text-[var(--text)] shadow-sm outline-none ring-[var(--accent)]/0 transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20"
        />
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
        </span>
        <button
          type="submit"
          className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-full bg-[var(--text)] px-3 text-xs font-bold text-[var(--bg)] transition hover:opacity-90"
        >
          Go
        </button>
      </form>

      {showList ? (
        <div
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[min(24rem,70vh)] overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-2 shadow-lg ring-1 ring-black/10 dark:ring-white/10"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[var(--muted)]">
              No quick matches. Press Go for full search.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]/60">
              {results.map((hit, idx) => (
                <li key={hit.id} role="presentation">
                  <Link
                    role="option"
                    aria-selected={idx === active}
                    className={[
                      "block px-4 py-2.5 text-left no-underline transition-colors",
                      idx === active ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]/80",
                    ].join(" ")}
                    to={hit.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    onMouseEnter={() => setActive(idx)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text)]">{hit.title}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                        {kindLabel(hit.kind)}
                      </span>
                    </div>
                    {hit.subtitle ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">{hit.subtitle}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-[var(--border)] px-3 py-2">
            <button
              type="button"
              className="w-full rounded-lg py-1.5 text-center text-xs font-semibold text-[var(--accent)] hover:bg-[var(--surface-2)]"
              onClick={() => goSearchPage(debounced)}
            >
              See all results for &quot;{debounced}&quot;
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
