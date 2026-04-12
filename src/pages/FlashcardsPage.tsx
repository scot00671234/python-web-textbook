import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FlashcardStudy } from "../components/FlashcardStudy";
import { Seo } from "../components/Seo";
import { getCanonicalBase } from "../lib/site";
import { breadcrumbJsonLd } from "../lib/structuredData";
import { getFlashcardDeckById, getFlashcardDecks } from "../content/flashcards";

const STORAGE_KEY = "flashcards-last-deck";

export function FlashcardsPage() {
  const decks = useMemo(() => getFlashcardDecks(), []);
  const [searchParams, setSearchParams] = useSearchParams();

  const deckParam = searchParams.get("deck");
  const deck =
    (deckParam ? getFlashcardDeckById(deckParam) : undefined) ?? decks[0] ?? null;

  useEffect(() => {
    if (deckParam && getFlashcardDeckById(deckParam)) return;
    const storedId = sessionStorage.getItem(STORAGE_KEY);
    const stored = storedId ? getFlashcardDeckById(storedId) : undefined;
    const nextId = stored?.id ?? decks[0]?.id;
    if (nextId) setSearchParams({ deck: nextId }, { replace: true });
  }, [deckParam, decks, setSearchParams]);

  useEffect(() => {
    if (deck?.id) sessionStorage.setItem(STORAGE_KEY, deck.id);
  }, [deck?.id]);

  const jsonLd = useMemo(() => {
    const base = getCanonicalBase();
    if (!base) return undefined;
    return [
      breadcrumbJsonLd(base, [
        { name: "Home", path: "/" },
        { name: "All lessons", path: "/learn" },
        { name: "Flashcards", path: "/learn/flashcards" },
      ]),
    ];
  }, []);

  if (!deck) {
    return (
      <div className="max-w-read py-10">
        <Seo
          title="Flashcards"
          description="Quick-recall flashcard decks for Python terms and patterns used alongside this textbook’s lessons."
          jsonLd={jsonLd}
        />
        <p className="text-sm text-[var(--muted)]">No flashcard decks configured.</p>
        <Link className="mt-4 inline-block font-semibold text-[var(--accent)] no-underline" to="/learn">
          Back to lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-10">
      <Seo title={`Flashcards: ${deck.title}`} description={deck.blurb} jsonLd={jsonLd} />
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link className="font-semibold text-[var(--accent)] no-underline" to="/learn">
              All lessons
            </Link>
          </li>
          <li aria-hidden className="select-none text-[var(--border)]">
            /
          </li>
          <li className="font-medium text-[var(--text)]">Flashcards</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Study mode</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Flashcards
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Quick recall: read the front, think your answer, then flip. Same shortcuts as many study apps: Space
          to flip, arrows to move. Pick a deck below; your last deck is remembered for this browser tab.
        </p>
      </header>

      <div className="mt-8">
        <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">Deck</p>
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Flashcard decks"
        >
          {decks.map((d) => {
            const active = d.id === deck.id;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSearchParams({ deck: d.id }, { replace: true })}
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] text-[var(--text)] dark:bg-[color-mix(in_oklab,var(--accent)_18%,var(--surface))]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
                ].join(" ")}
              >
                {d.title}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{deck.blurb}</p>
      </div>

      <div className="mt-10 rounded-card border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <FlashcardStudy deck={deck} key={deck.id} />
      </div>
    </div>
  );
}
