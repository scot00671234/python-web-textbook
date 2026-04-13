import { useMemo, useState } from "react";
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

export function PythonDictionaryPage() {
  const entries = getPythonDictionaryEntries();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PythonDictionaryCategory | typeof ALL>(ALL);
  const [letter, setLetter] = useState<typeof ALL | string>(ALL);

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
    const q = query.trim().toLowerCase();
    return entries
      .filter((entry) => {
      if (category !== ALL && entry.category !== category) return false;
      if (letter !== ALL && !startsWithLetter(entry.term, letter)) return false;
      if (!q) return true;
      const hay = `${entry.term} ${entry.category} ${entry.meaning} ${(entry.related ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [entries, query, category, letter]);

  const starterEntries = useMemo(() => {
    const byId = new Map(entries.map((e) => [e.id, e]));
    return pythonDictionaryStarterTerms
      .map((id) => byId.get(id))
      .filter((x): x is (typeof entries)[number] => x != null);
  }, [entries]);

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
                <pre className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3 text-xs leading-relaxed sm:text-sm">
                  <code className="font-mono text-[var(--code-fg)]">{entry.example}</code>
                </pre>
              ) : null}
              {entry.related?.length ? (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Related:{" "}
                  <span className="font-medium text-[var(--text)]">{entry.related.join(", ")}</span>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

