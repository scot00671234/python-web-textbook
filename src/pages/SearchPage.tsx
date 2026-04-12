import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { searchSite, type SearchHit } from "../lib/siteSearch";

function kindLabel(kind: SearchHit["kind"]): string {
  switch (kind) {
    case "lesson":
      return "Lesson";
    case "deck":
      return "Flashcard deck";
    case "plain":
      return "Plain English card";
    case "blog":
      return "Blog article";
    default:
      return "Page";
  }
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const results = useMemo(() => searchSite(q, 120), [q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title={q ? `Search: ${q}` : "Search"}
        description="Search lessons, flashcards, plain-English cards, and blog posts in this Python web textbook."
        noIndex
      />
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text)]">Search</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {q ? (
          <>
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-[var(--text)]">&quot;{q}&quot;</span>
          </>
        ) : (
          "Enter a search term in the bar at the top of the site."
        )}
      </p>

      {q && results.length === 0 ? (
        <p className="mt-8 rounded-card border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          No matches. Try another word, fewer words, or browse{" "}
          <Link className="font-semibold text-[var(--accent)] no-underline hover:underline" to="/learn">
            all lessons
          </Link>
          .
        </p>
      ) : null}

      {results.length > 0 ? (
        <ul className="mt-8 divide-y divide-[var(--border)] rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          {results.map((hit) => (
            <li key={hit.id}>
              <Link
                className="flex flex-col gap-1 px-5 py-4 no-underline transition-colors hover:bg-[var(--surface-2)]"
                to={hit.href}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text)]">{hit.title}</span>
                  <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                    {kindLabel(hit.kind)}
                  </span>
                </div>
                {hit.subtitle ? (
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{hit.subtitle}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
