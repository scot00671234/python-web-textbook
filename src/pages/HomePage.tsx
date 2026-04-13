import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { HOME_FAQ_ITEMS } from "../content/homeFaq";
import { getAllLessons, modules } from "../content/curriculum";
import { getFlashcardDecks } from "../content/flashcards";
import { getPlainEnglishCards } from "../content/pythonInPlainEnglish";
import { DEFAULT_DESCRIPTION, SITE_NAME, getCanonicalBase } from "../lib/site";
import { faqPageJsonLd, organizationJsonLd, websiteJsonLd } from "../lib/structuredData";

const LESSON_1 = "/learn/how-to-use-this-site";
const LESSON_3 = "/learn/first-program";

type CarouselCard = {
  id: string;
  title: string;
  code: string;
  bullets: string[];
};

type HeroSnippet = {
  title: string;
  code: string;
};

function CodeTypewriter({ snippets }: { snippets: HeroSnippet[] }) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = snippets[snippetIndex];

  useEffect(() => {
    if (!current) return;
    const full = current.code;
    let delay = deleting ? 16 : 28;

    if (!deleting && charIndex === full.length) {
      delay = 1100;
    }
    if (deleting && charIndex === 0) {
      delay = 260;
    }

    const timer = window.setTimeout(() => {
      if (!deleting && charIndex < full.length) {
        setCharIndex((n) => n + 1);
        return;
      }
      if (!deleting && charIndex === full.length) {
        setDeleting(true);
        return;
      }
      if (deleting && charIndex > 0) {
        setCharIndex((n) => n - 1);
        return;
      }
      setDeleting(false);
      setSnippetIndex((n) => (n + 1) % snippets.length);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [charIndex, current, deleting, snippets.length]);

  if (!current) return null;

  return (
    <div className="overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
        <p className="font-mono text-xs font-semibold text-[var(--accent)]">Live Python demo</p>
        <p className="truncate text-xs text-[var(--muted)]">{current.title}</p>
      </div>
      <pre className="min-h-[18rem] bg-[var(--code-bg)] p-4 text-[13px] leading-[1.7] sm:p-5 sm:text-sm">
        <code className="font-mono text-[var(--code-fg)] [tab-size:2]">
          {current.code.slice(0, charIndex)}
          <span className="animate-pulse text-[var(--accent)]">|</span>
        </code>
      </pre>
    </div>
  );
}

function PlainEnglishPreviewCarousel({ cards }: { cards: CarouselCard[] }) {
  const [index, setIndex] = useState(0);

  const card = cards[index];
  if (!card) return null;

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 sm:px-5">
        <div>
          <p className="font-mono text-xs font-semibold text-[var(--accent)]">
            Card {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 font-serif text-lg font-semibold text-[var(--text)] sm:text-xl">
            {card.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + cards.length) % cards.length)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--surface-2)]"
            aria-label="Previous preview card"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % cards.length)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--surface-2)]"
            aria-label="Next preview card"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="border-b border-[var(--border)] lg:border-r lg:border-b-0">
          <p className="border-b border-[var(--border)] bg-[var(--surface-2)]/80 px-4 py-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase sm:px-5">
            Python
          </p>
          <pre className="overflow-auto bg-[var(--code-bg)] p-4 text-[13px] leading-[1.65] sm:p-5 sm:text-sm">
            <code className="font-mono text-[var(--code-fg)] [tab-size:2]">{card.code}</code>
          </pre>
        </div>
        <div>
          <p className="border-b border-[var(--border)] bg-[var(--surface-2)]/80 px-4 py-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase sm:px-5">
            Plain English
          </p>
          <ul className="space-y-3 p-4 text-sm leading-relaxed text-[var(--text)] sm:p-5 sm:text-base">
            {card.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 sm:px-5">
        <p className="text-xs text-[var(--muted)]">Live sample from Python in Plain English</p>
        <Link
          to="/learn/python-in-plain-english"
          className="text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
        >
          Open full card library
        </Link>
      </div>
    </div>
  );
}

function HomeFlashcardViewer({
  cards,
}: {
  cards: { id: string; front: string; back: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [index]);

  const card = cards[index];
  if (!card) return null;

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 sm:px-5">
        <p className="font-mono text-xs font-semibold text-[var(--accent)]">
          Flashcard {String(index + 1).padStart(2, "0")} of {cards.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + cards.length) % cards.length)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--surface-2)]"
            aria-label="Previous flashcard"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % cards.length)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--surface-2)]"
            aria-label="Next flashcard"
          >
            →
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className="block w-full p-6 text-left transition hover:bg-[var(--surface-2)]/35"
        aria-label={flipped ? "Show front of flashcard" : "Show back of flashcard"}
      >
        <p className="text-xs font-bold tracking-wide text-[var(--accent)] uppercase">
          {flipped ? "Answer" : "Question"}
        </p>
        <p className="mt-3 font-serif text-2xl font-semibold leading-tight text-[var(--text)]">
          {flipped ? card.back : card.front}
        </p>
      </button>
      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 sm:px-5">
        <p className="text-xs text-[var(--muted)]">Click card to flip</p>
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="text-sm font-semibold text-[var(--accent)]"
        >
          {flipped ? "Show question" : "Reveal answer"}
        </button>
      </div>
    </div>
  );
}

export function HomePage() {
  const totalLessons = getAllLessons().length;
  const flashcardDecks = useMemo(() => getFlashcardDecks(), []);
  const totalFlashcards = useMemo(
    () => flashcardDecks.reduce((sum, deck) => sum + deck.cards.length, 0),
    [flashcardDecks],
  );
  const featuredFlashcards = useMemo(() => flashcardDecks.flatMap((d) => d.cards).slice(0, 3), [flashcardDecks]);
  const plainEnglishPreviewCards = useMemo(
    () =>
      getPlainEnglishCards()
        .filter((c) => c.level === 1)
        .slice(0, 5)
        .map((c) => ({ id: c.id, title: c.title, code: c.code, bullets: c.bullets })),
    [],
  );
  const heroSnippets = useMemo(
    () =>
      getPlainEnglishCards()
        .slice(0, 28)
        .map((c) => ({
          title: c.title,
          code: c.code,
        }))
        .filter((c) => c.code.trim().length > 0)
        .map((c) => ({
        title: c.title,
        code: c.code,
      })),
    [],
  );

  const jsonLd = useMemo(() => {
    const base = getCanonicalBase();
    if (!base) {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
      };
    }
    return [
      organizationJsonLd(base),
      websiteJsonLd(base, DEFAULT_DESCRIPTION, `${base}/search?q={search_term_string}`),
      faqPageJsonLd(base, [...HOME_FAQ_ITEMS]),
    ];
  }, []);

  return (
    <div>
      <Seo
        title="Learn Python from the first click"
        description={DEFAULT_DESCRIPTION}
        keywords="pylearn, learn Python, Python tutorial, free Python course, Python for beginners, online Python textbook, Python flashcards"
        jsonLd={jsonLd}
      />
      <section className="hero-grid border-b border-[var(--border)]">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold tracking-tight text-balance text-[var(--text)] sm:text-5xl lg:text-[3.2rem] lg:leading-[1.06]">
              Learn Python from the first click
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              Read short lessons, see working code, and translate syntax into plain English. Practice
              with built-in TYPE and flashcards as you go.
            </p>

            <div className="mt-8 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <p className="text-xs font-bold tracking-wide text-[var(--accent)] uppercase">Start here</p>
              <Link
                className="mt-3 flex w-full items-center justify-center rounded-full bg-[var(--text)] py-3.5 text-center text-sm font-bold text-[var(--bg)] no-underline transition hover:opacity-95 active:scale-[0.99] sm:text-base"
                to={LESSON_1}
              >
                Start lesson 1 (about 8 minutes)
              </Link>
              <p className="mt-3 text-center text-xs leading-relaxed text-[var(--muted)]">
                No install needed for this first page. It teaches how the site works and how to practice.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link
                className="font-semibold text-[var(--accent)] no-underline hover:underline"
                to="/learn"
              >
                See all {totalLessons} lessons (overview)
              </Link>
              <span className="hidden text-[var(--border)] sm:inline" aria-hidden>
                |
              </span>
              <Link
                className="font-semibold text-[var(--accent)] no-underline hover:underline"
                to="/learn/flashcards"
              >
                Flashcards
              </Link>
              <span className="hidden text-[var(--border)] sm:inline" aria-hidden>
                |
              </span>
              <Link
                className="font-semibold text-[var(--accent)] no-underline hover:underline"
                to="/learn/python-in-plain-english"
              >
                Plain English
              </Link>
              <span className="hidden text-[var(--border)] sm:inline" aria-hidden>
                |
              </span>
              <Link
                className="font-semibold text-[var(--accent)] no-underline hover:underline"
                to={LESSON_3}
              >
                I already have Python: skip to first code
              </Link>
              <span className="hidden text-[var(--border)] sm:inline" aria-hidden>
                |
              </span>
              <a
                className="font-semibold text-[var(--accent)] no-underline hover:underline"
                href="#course-map"
              >
                Jump to topic list
              </a>
            </div>

            <p className="mt-8 text-sm text-[var(--muted)]">
              <span className="font-semibold text-[var(--text)]">{totalLessons}</span> lessons
              <span className="mx-2 text-[var(--border)]">·</span>
              <span className="font-semibold text-[var(--text)]">{modules.length}</span> modules
              <span className="mx-2 text-[var(--border)]">·</span>
              <span className="font-semibold text-[var(--text)]">{totalFlashcards}</span> flashcards
            </p>
          </div>
          <div className="space-y-4">
            <CodeTypewriter snippets={heroSnippets} />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Practice and retention, built in
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            Use flashcards while you learn. These are real cards from the site, not placeholder content.
          </p>
          <div className="mx-auto mt-8 w-full max-w-4xl">
            <HomeFlashcardViewer cards={featuredFlashcards} />
          </div>
          <div className="mx-auto mt-6 w-full max-w-4xl">
            <Link
              className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] no-underline hover:underline"
              to="/learn/flashcards"
            >
              Open all flashcards
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              See the value in 30 seconds
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              This is how the site teaches: short runnable Python on the left, direct plain-English
              meaning on the right. You can step cards now, then jump into lessons when you are ready.
            </p>
          </div>

          <div className="mt-8">
            <PlainEnglishPreviewCarousel cards={plainEnglishPreviewCards} />
          </div>

        </div>
      </section>

      <section
        id="course-map"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight">
              All topics ({modules.length} modules)
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              Each card is one chapter of the path, from foundations through
              intermediate and advanced tracks, plus applied modules for
              research, econometrics, machine learning, finance, AI, and related
              workflows. For your first time through,
              start with{" "}
              <Link className="font-semibold text-[var(--accent)] no-underline hover:underline" to={LESSON_1}>
                lesson 1
              </Link>{" "}
              instead of picking a random card.
            </p>
          </div>
          <Link
            className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] no-underline shadow-sm transition hover:bg-[var(--surface-2)]"
            to="/learn"
          >
            Open full lesson list
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {modules.map((module, i) => (
            <article
              key={module.id}
              className="group relative overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:shadow-lg"
            >
              <div
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--accent)] via-sky-400 to-indigo-500 opacity-80"
                aria-hidden
              />
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs font-bold tracking-widest text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-xs font-semibold text-[var(--muted)]">
                  {module.lessons.length} lessons
                </p>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-[var(--text)]">
                {module.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {module.blurb}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  className="inline-flex items-center gap-1 text-sm font-bold text-[var(--accent)] no-underline group-hover:underline"
                  to={`/learn/${module.lessons[0]?.slug ?? ""}`}
                >
                  First lesson in this module
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  className="text-xs font-semibold text-[var(--muted)] no-underline hover:text-[var(--text)]"
                  to="/learn"
                >
                  In full list
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="border-t border-[var(--border)] bg-[var(--surface)] py-12 sm:py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2
            id="faq-heading"
            className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Common questions
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            Short answers for people comparing options or landing from search. If you need a detail, the
            linked lessons go deeper.
          </p>
          <dl className="mt-10 space-y-8 max-w-3xl">
            {HOME_FAQ_ITEMS.map((item) => (
              <div key={item.question} className="border-b border-[var(--border)] pb-8 last:border-0 last:pb-0">
                <dt className="font-serif text-lg font-semibold text-[var(--text)]">{item.question}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

    </div>
  );
}
