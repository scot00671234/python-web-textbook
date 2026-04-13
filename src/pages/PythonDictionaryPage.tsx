import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Seo } from "../components/Seo";
import {
  getPythonDictionaryEntries,
  pythonDictionaryStarterTerms,
  type PythonDictionaryCategory,
} from "../content/pythonDictionary";

const ALL = "All";

function startsWithLetter(term: string, letter: string): boolean {
  return term.trim().toLowerCase().startsWith(letter.toLowerCase());
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

function fuzzyTokenMatch(queryToken: string, candidateToken: string): boolean {
  if (!queryToken || !candidateToken) return false;
  if (candidateToken.includes(queryToken) || candidateToken.startsWith(queryToken)) return true;

  const len = queryToken.length;
  if (len <= 4) return levenshteinDistance(queryToken, candidateToken) <= 1;
  return levenshteinDistance(queryToken, candidateToken) <= 2;
}

function fuzzyMatch(query: string, haystack: string): boolean {
  const queryTokens = normalizeText(query).split(" ").filter(Boolean);
  const hayTokens = normalizeText(haystack).split(" ").filter(Boolean);
  if (!queryTokens.length) return true;

  return queryTokens.every((qt) => hayTokens.some((ht) => fuzzyTokenMatch(qt, ht)));
}

export function PythonDictionaryPage() {
  const location = useLocation();
  const entries = getPythonDictionaryEntries();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PythonDictionaryCategory | typeof ALL>(ALL);
  const [letter, setLetter] = useState<typeof ALL | string>(ALL);
  const [focusMode, setFocusMode] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(entries.map((e) => e.category))).sort((a, b) => a.localeCompare(b)),
    [entries],
  );

  const availableLetters = useMemo(
    () =>
      Array.from(
        new Set(
          entries
            .map((e) => e.term.trim().charAt(0).toUpperCase())
            .filter((x) => x >= "A" && x <= "Z"),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [entries],
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    return entries
      .filter((entry) => {
        if (category !== ALL && entry.category !== category) return false;
        if (letter !== ALL && !startsWithLetter(entry.term, letter)) return false;
        if (!q) return true;
        const hay = `${entry.term} ${entry.category} ${entry.meaning} ${(entry.related ?? []).join(" ")}`;
        return fuzzyMatch(q, hay);
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [entries, query, category, letter]);

  const starterEntries = useMemo(() => {
    const byId = new Map(entries.map((e) => [e.id, e]));
    return pythonDictionaryStarterTerms
      .map((id) => byId.get(id))
      .filter((x): x is (typeof entries)[number] => x != null);
  }, [entries]);

  const activeIndex = useMemo(() => {
    if (!filtered.length) return -1;
    if (!activeEntryId) return 0;
    return Math.max(
      0,
      filtered.findIndex((entry) => entry.id === activeEntryId),
    );
  }, [activeEntryId, filtered]);

  const activeEntry = activeIndex >= 0 ? filtered[activeIndex] : null;

  useEffect(() => {
    if (!filtered.length) {
      setActiveEntryId(null);
      setFocusMode(false);
      return;
    }
    if (!activeEntryId || !filtered.some((entry) => entry.id === activeEntryId)) {
      setActiveEntryId(filtered[0].id);
    }
  }, [activeEntryId, filtered]);

  const moveFocusEntry = useCallback((delta: number) => {
    if (!filtered.length) return;
    const nextIndex = (activeIndex + delta + filtered.length) % filtered.length;
    setActiveEntryId(filtered[nextIndex]?.id ?? null);
  }, [activeIndex, filtered]);

  useEffect(() => {
    if (!focusMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveFocusEntry(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveFocusEntry(-1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusMode, moveFocusEntry]);

  useEffect(() => {
    const raw = location.hash.replace(/^#/, "").trim();
    if (!raw) return;
    const targetId = decodeURIComponent(raw);
    const target = entries.find((entry) => entry.id === targetId);
    if (!target) return;

    // Ensure the linked term is visible even if filters were previously narrowed.
    setQuery("");
    setCategory(ALL);
    setLetter(ALL);
    setActiveEntryId(target.id);

    requestAnimationFrame(() => {
      document.getElementById(target.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [entries, location.hash]);

  return (
    <div className="max-w-5xl py-8 lg:py-10">
      <Seo
        title="Python dictionary"
        description="Beginner-friendly Python dictionary with clear definitions, examples, and filters by category."
      />

      <header className="border-b border-[var(--border)] pb-8">
        <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          Quick reference
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Python dictionary
        </h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[var(--muted)]">
          A plain-language dictionary of common Python terms. Use it to quickly check what
          something means, then jump back to your lesson.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {entries.length} terms total, {filtered.length} showing
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFocusMode((prev) => !prev)}
            disabled={!filtered.length}
            className={[
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              focusMode
                ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]/40",
              !filtered.length ? "cursor-not-allowed opacity-50" : "",
            ].join(" ")}
          >
            {focusMode ? "Exit focus mode" : "Focus mode"}
          </button>
          <p className="text-xs text-[var(--muted)]">
            Click through with arrows, or use keyboard left/right.
          </p>
        </div>
      </header>

      <section className="mt-6 space-y-4 rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <label className="block">
          <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
            Search terms
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: list, function, try/except, dataframe..."
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none ring-0 transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
        </label>

        <div>
          <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Category</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory(ALL)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                category === ALL
                  ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--accent)]/40",
              ].join(" ")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  category === c
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--accent)]/40",
                ].join(" ")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Starts with</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLetter(ALL)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                letter === ALL
                  ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--accent)]/40",
              ].join(" ")}
            >
              All
            </button>
            {availableLetters.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLetter(l)}
                className={[
                  "rounded-full border px-2.5 py-1.5 text-xs font-semibold transition",
                  letter === l
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--accent)]/40",
                ].join(" ")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <h2 className="text-sm font-bold text-[var(--text)]">Start here first</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          If you are new to Python, these terms give you the fastest useful foundation.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {starterEntries.map((entry) => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] no-underline transition hover:border-[var(--accent)]/40"
            >
              {entry.term}
            </a>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-card border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          No terms match your current filters. Try clearing one filter or using fewer words.
        </p>
      ) : focusMode && activeEntry ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Focus mode {activeIndex + 1}/{filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveFocusEntry(-1)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => moveFocusEntry(1)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-sans text-xl font-semibold text-[var(--text)]">
                {activeEntry.term}
              </h2>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--muted)] uppercase">
                {activeEntry.category}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
              {activeEntry.meaning}
            </p>
            {activeEntry.example ? (
              <div className="mt-3">
                <p className="text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
                  Context snippet
                </p>
                <pre className="mt-1.5 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3 text-xs leading-relaxed sm:text-sm">
                  <code className="font-mono text-[var(--code-fg)]">{activeEntry.example}</code>
                </pre>
              </div>
            ) : null}
            {activeEntry.related?.length ? (
              <p className="mt-3 text-xs text-[var(--muted)]">
                Related:{" "}
                <span className="font-medium text-[var(--text)]">
                  {activeEntry.related.join(", ")}
                </span>
              </p>
            ) : null}
          </div>
        </section>
      ) : (
        <ul className="mt-8 space-y-3">
          {filtered.map((entry) => (
            <li
              key={entry.id}
              id={entry.id}
              className="scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-sans text-lg font-semibold text-[var(--text)]">{entry.term}</h2>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--muted)] uppercase">
                  {entry.category}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
                {entry.meaning}
              </p>
              {entry.example ? (
                <div className="mt-3">
                  <p className="text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
                    Context snippet
                  </p>
                  <pre className="mt-1.5 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3 text-xs leading-relaxed sm:text-sm">
                    <code className="font-mono text-[var(--code-fg)]">{entry.example}</code>
                  </pre>
                </div>
              ) : null}
              {entry.related?.length ? (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Related:{" "}
                  <span className="font-medium text-[var(--text)]">{entry.related.join(", ")}</span>
                </p>
              ) : null}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveEntryId(entry.id);
                    setFocusMode(true);
                  }}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/40"
                >
                  Open in focus mode
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

