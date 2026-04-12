import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CodeRetypePractice } from "../components/CodeRetypePractice";
import { Seo } from "../components/Seo";
import { getCanonicalBase } from "../lib/site";
import { breadcrumbJsonLd } from "../lib/structuredData";
import {
  getPlainEnglishCardsGrouped,
  plainEnglishLevelLabel,
  type PlainEnglishCard,
} from "../content/pythonInPlainEnglish";

const LAYOUT_STORAGE_KEY = "python-plain-english-layout";

type LayoutMode = "split" | "stacked";

function readStoredLayout(): LayoutMode {
  try {
    const v = sessionStorage.getItem(LAYOUT_STORAGE_KEY);
    if (v === "stacked" || v === "split") return v;
  } catch {
    /* ignore */
  }
  return "split";
}

function isPlainEnglishInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "textarea, input, select, button, a[href], [role='tablist'], [role='tab'], [role='dialog']",
    ),
  );
}

function shouldIgnoreCardStepArrows(): boolean {
  const ae = document.activeElement;
  if (ae instanceof HTMLTextAreaElement || ae instanceof HTMLInputElement || ae instanceof HTMLSelectElement)
    return true;
  return ae instanceof HTMLElement && ae.isContentEditable;
}

function CodeAndEnglish({
  card,
  layout,
}: {
  card: PlainEnglishCard;
  layout: LayoutMode;
}) {
  const stacked = layout === "stacked";
  const hasCode = card.code.trim().length > 0;

  const pythonBlock = (
    <div>
      <p className="border-b border-[var(--border)] bg-[var(--surface-2)]/80 px-4 py-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase sm:px-5">
        Python
      </p>
      <pre className="max-h-[min(28rem,70vh)] overflow-auto bg-[var(--code-bg)] p-4 text-[13px] leading-[1.65] sm:p-5 sm:text-sm">
        <code className="font-mono text-[var(--code-fg)] [tab-size:2]">{card.code}</code>
      </pre>
      {hasCode ? (
        <div className="px-2 pb-2 sm:px-3">
          <CodeRetypePractice
            expectedCode={card.code}
            title={card.title}
            storageKey={`plain-english-${card.id}`}
            source="plainEnglish"
          />
        </div>
      ) : null}
    </div>
  );

  const englishBlock = (
    <>
      <p className="border-b border-[var(--border)] bg-[var(--surface-2)]/80 px-4 py-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase sm:px-5">
        Plain English
      </p>
      <ul className="space-y-3 p-4 text-[15px] leading-relaxed text-[var(--muted)] sm:p-5 sm:text-base sm:leading-relaxed">
        {card.bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
              aria-hidden
            />
            <span className="min-w-0 text-[var(--text)]">{b}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (stacked) {
    return (
      <div className="flex flex-col">
        <div className="border-b border-[var(--border)]">{pythonBlock}</div>
        <div>{englishBlock}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-0 lg:grid-cols-2 lg:gap-0">
      <div className="border-b border-[var(--border)] lg:border-b-0 lg:border-r">{pythonBlock}</div>
      <div>{englishBlock}</div>
    </div>
  );
}

export function PythonInPlainEnglishPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const sections = useMemo(() => {
    let n = 0;
    return getPlainEnglishCardsGrouped().map(({ level, cards: levelCards }) => ({
      level,
      items: levelCards.map((card) => ({ card, number: ++n })),
    }));
  }, []);

  const flatItems = useMemo(() => {
    const out: { card: PlainEnglishCard; number: number }[] = [];
    for (const s of sections) {
      for (const item of s.items) out.push(item);
    }
    return out;
  }, [sections]);

  const cardIndexById = useMemo(() => {
    const m = new Map<string, number>();
    flatItems.forEach((item, i) => m.set(item.card.id, i));
    return m;
  }, [flatItems]);

  const [layout, setLayout] = useState<LayoutMode>(() => readStoredLayout());
  /** Index into `flatItems` while stepping with arrows; null = not stepping. */
  const [browseIndex, setBrowseIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(LAYOUT_STORAGE_KEY, layout);
    } catch {
      /* ignore */
    }
  }, [layout]);

  /** Open step mode from URL hash (e.g. shared links from search). */
  useEffect(() => {
    const id = location.hash.replace(/^#/, "").trim();
    if (!id) return;
    const i = flatItems.findIndex(({ card }) => card.id === id);
    if (i >= 0) setBrowseIndex(i);
  }, [flatItems, location.hash]);

  /** Lock page scroll while focus mode (full-screen card) is open. */
  useEffect(() => {
    if (browseIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [browseIndex]);

  /** Keep the URL hash in sync while stepping (React Router + no extra history entries). */
  useEffect(() => {
    if (browseIndex === null) return;
    const id = flatItems[browseIndex]?.card.id;
    if (!id) return;
    if (location.hash === `#${id}`) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: id },
      { replace: true, preventScrollReset: true },
    );
  }, [browseIndex, flatItems, location.hash, location.pathname, location.search, navigate]);

  const exitFocusMode = useCallback(() => {
    setBrowseIndex((prev) => {
      if (prev != null) {
        const id = flatItems[prev]?.card.id;
        if (id) {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          });
        }
      }
      return null;
    });
    navigate({ pathname: location.pathname, search: location.search, hash: "" }, { replace: true });
  }, [flatItems, location.pathname, location.search, navigate]);

  const onArticleBackgroundClick = useCallback(
    (globalIndex: number, e: React.MouseEvent) => {
      if (isPlainEnglishInteractiveTarget(e.target)) return;
      setBrowseIndex(globalIndex);
    },
    [],
  );

  const focusModeActive = browseIndex !== null;

  useEffect(() => {
    if (!focusModeActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (shouldIgnoreCardStepArrows()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        exitFocusMode();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setBrowseIndex((i) => {
          if (i === null) return 0;
          return Math.min(flatItems.length - 1, i + 1);
        });
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setBrowseIndex((i) => {
          if (i === null) return 0;
          return Math.max(0, i - 1);
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exitFocusMode, flatItems.length, focusModeActive]);

  const jsonLd = useMemo(() => {
    const base = getCanonicalBase();
    if (!base) return undefined;
    return [
      breadcrumbJsonLd(base, [
        { name: "Home", path: "/" },
        { name: "All lessons", path: "/learn" },
        { name: "Python in plain English", path: "/learn/python-in-plain-english" },
      ]),
    ];
  }, []);

  return (
    <div className="py-8 lg:py-10">
      <Seo
        title="Python in plain English"
        description="Short Python snippets paired with plain-language bullets—an on-ramp and reading aid alongside the main lesson path, with optional typing practice on each card."
        jsonLd={jsonLd}
      />
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
          <li className="font-medium text-[var(--text)]">Python in plain English</li>
        </ol>
      </nav>

      <header className="mt-6">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Reading aid</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Python in plain English
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Cards ramp from small snippets to busier patterns. The English is about intent and flow, not
            a symbol-by-symbol grammar lesson. Under each Python panel, open{" "}
            <strong className="font-semibold text-[var(--text)]">TYPE</strong> to practice typing the
            snippet with the same check used in lessons. Pick a layout that matches how you like to
            read: two columns on a wide screen, or code first with translation underneath (works well on
            a phone or when you want to read top to bottom).
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Layout</p>
            <div
              className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm"
              role="group"
              aria-label="How to show code and plain English"
            >
              <button
                type="button"
                onClick={() => setLayout("split")}
                aria-pressed={layout === "split"}
                className={[
                  "rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm",
                  layout === "split"
                    ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]",
                ].join(" ")}
              >
                Side by side
              </button>
              <button
                type="button"
                onClick={() => setLayout("stacked")}
                aria-pressed={layout === "stacked"}
                className={[
                  "rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm",
                  layout === "stacked"
                    ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]",
                ].join(" ")}
              >
                Stacked (code first)
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBrowseIndex(0)}
            title="One card at a time, full screen. Arrow keys to step, Esc to exit. You can also open focus mode by clicking a card (outside TYPE and other controls)."
            aria-label="Open focus mode from the first card. Full screen, one translation at a time. Arrow keys to move, Escape to exit."
            className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-full bg-[var(--text)] px-4 text-sm font-semibold text-[var(--bg)] shadow-md transition hover:opacity-95 sm:self-center sm:px-5"
          >
            Focus mode
          </button>
        </div>
      </header>

      <div className="mt-12 space-y-14 sm:space-y-16">
        {sections.map(({ level, items }) => (
          <section key={level} aria-labelledby={`level-${level}-heading`}>
            <h2
              id={`level-${level}-heading`}
              className="border-b border-[var(--border)] pb-3 font-serif text-2xl font-semibold tracking-tight text-[var(--text)]"
            >
              {plainEnglishLevelLabel[level]}
              <span className="ml-2 text-base font-normal text-[var(--muted)]">
                (level {level} of 3)
              </span>
            </h2>
            <div className="mt-8 space-y-10 sm:space-y-12">
              {items.map(({ card, number: n }) => {
                const globalIndex = cardIndexById.get(card.id) ?? 0;
                const isBrowseActive = browseIndex !== null && browseIndex === globalIndex;
                return (
                <article
                  id={card.id}
                  key={card.id}
                  onClick={(e) => onArticleBackgroundClick(globalIndex, e)}
                  className={[
                    "cursor-pointer overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow dark:ring-white/10",
                    isBrowseActive
                      ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)] dark:ring-offset-[var(--bg)]"
                      : "ring-1 ring-black/5 hover:ring-[var(--accent)]/25",
                  ].join(" ")}
                  aria-labelledby={`plain-${card.id}-title`}
                  aria-current={isBrowseActive ? "true" : undefined}
                >
                  <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 sm:px-5">
                    <p className="font-mono text-xs font-semibold text-[var(--accent)]">
                      {String(n).padStart(2, "0")}
                    </p>
                    <h3
                      id={`plain-${card.id}-title`}
                      className="mt-1 font-serif text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl"
                    >
                      {card.title}
                    </h3>
                  </div>
                  <CodeAndEnglish card={card} layout={layout} />
                </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {browseIndex !== null && flatItems[browseIndex] && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="plain-english-focus-title"
              className="fixed inset-0 z-[200] flex flex-col bg-[var(--bg)] text-[var(--text)]"
            >
              <p className="sr-only" aria-live="polite">
                Card {browseIndex + 1} of {flatItems.length}: {flatItems[browseIndex].card.title}
              </p>
              <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                    Python in plain English · Focus
                  </p>
                  <h2
                    id="plain-english-focus-title"
                    className="mt-0.5 truncate font-serif text-lg font-semibold tracking-tight sm:text-xl"
                  >
                    {flatItems[browseIndex].card.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs font-semibold text-[var(--accent)]">
                    {String(flatItems[browseIndex].number).padStart(2, "0")} · {browseIndex + 1} of{" "}
                    {flatItems.length}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <div
                    className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5 shadow-sm"
                    role="group"
                    aria-label="Layout in focus mode"
                  >
                    <button
                      type="button"
                      onClick={() => setLayout("split")}
                      aria-pressed={layout === "split"}
                      className={[
                        "rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs",
                        layout === "split"
                          ? "bg-[var(--text)] text-[var(--bg)]"
                          : "text-[var(--muted)] hover:text-[var(--text)]",
                      ].join(" ")}
                    >
                      Side by side
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayout("stacked")}
                      aria-pressed={layout === "stacked"}
                      className={[
                        "rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs",
                        layout === "stacked"
                          ? "bg-[var(--text)] text-[var(--bg)]"
                          : "text-[var(--muted)] hover:text-[var(--text)]",
                      ].join(" ")}
                    >
                      Stacked
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={exitFocusMode}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-2)] sm:text-sm"
                  >
                    Exit
                  </button>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                  <article className="overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                    <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 sm:px-5">
                      <p className="font-mono text-xs font-semibold text-[var(--accent)]">
                        {String(flatItems[browseIndex].number).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 font-serif text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl">
                        {flatItems[browseIndex].card.title}
                      </h3>
                    </div>
                    <CodeAndEnglish card={flatItems[browseIndex].card} layout={layout} />
                  </article>
                </div>
              </div>

              <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 py-4 backdrop-blur-md sm:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex gap-2 sm:flex-1">
                    <button
                      type="button"
                      className="min-h-11 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface)] disabled:opacity-40"
                      onClick={() => setBrowseIndex((i) => (i === null ? 0 : Math.max(0, i - 1)))}
                      disabled={browseIndex <= 0}
                      aria-label="Previous card"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="min-h-11 flex-1 rounded-full bg-[var(--text)] py-3 text-sm font-bold text-[var(--bg)] transition hover:opacity-95 disabled:opacity-40"
                      onClick={() =>
                        setBrowseIndex((i) => (i === null ? 0 : Math.min(flatItems.length - 1, i + 1)))
                      }
                      disabled={browseIndex >= flatItems.length - 1}
                      aria-label="Next card"
                    >
                      Next →
                    </button>
                  </div>
                  <p className="text-center text-[11px] leading-snug text-[var(--muted)] sm:text-right sm:text-xs">
                    Arrow keys · Esc exits · not while typing in TYPE
                  </p>
                </div>
              </footer>
            </div>,
            document.body,
          )
        : null}

      <p className="mt-12 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
        You can TYPE any card on this page from the Python column. For lesson-sized examples, use
        retype practice under each code block in lessons, or drill terms on{" "}
        <Link className="font-semibold text-[var(--accent)] no-underline hover:underline" to="/learn/flashcards">
          flashcards
        </Link>
        .
      </p>
    </div>
  );
}
