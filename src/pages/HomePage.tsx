import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { HOME_FAQ_ITEMS } from "../content/homeFaq";
import { getAllLessons, modules } from "../content/curriculum";
import { DEFAULT_DESCRIPTION, SITE_NAME, getCanonicalBase } from "../lib/site";
import { faqPageJsonLd, organizationJsonLd, websiteJsonLd } from "../lib/structuredData";

const LESSON_1 = "/learn/how-to-use-this-site";
const LESSON_2 = "/learn/what-is-python";
const LESSON_3 = "/learn/first-program";

export function HomePage() {
  const totalLessons = getAllLessons().length;

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
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)] shadow-sm">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden
            />
            Free · in your browser · no account
          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-balance text-[var(--text)] sm:text-5xl lg:text-[3.1rem] lg:leading-[1.08]">
            Learn Python from the first click
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            Short lessons in order, like a textbook. Open{" "}
            <strong className="font-semibold text-[var(--text)]">lesson 1</strong>{" "}
            below: it explains how to study here. You add Python on your computer
            when you reach the &quot;first program&quot; lesson.
          </p>

          <div className="mt-8 max-w-xl rounded-card border-2 border-[var(--accent)]/35 bg-[var(--surface)] p-5 shadow-md sm:p-6">
            <p className="text-xs font-bold tracking-wide text-[var(--accent)] uppercase">
              If you only do one thing
            </p>
            <Link
              className="mt-3 flex w-full items-center justify-center rounded-full bg-[var(--text)] py-3.5 text-center text-sm font-bold text-[var(--bg)] no-underline shadow-md transition hover:opacity-95 active:scale-[0.99] sm:text-base"
              to={LESSON_1}
            >
              Start lesson 1 (about 8 minutes)
            </Link>
            <p className="mt-3 text-center text-xs leading-relaxed text-[var(--muted)]">
              No install needed for this first page. It teaches how the site works
              and how to practice.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
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

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <dt className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                Lessons
              </dt>
              <dd className="mt-1 font-serif text-2xl font-semibold text-[var(--text)]">
                {totalLessons}
              </dd>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <dt className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                Modules
              </dt>
              <dd className="mt-1 font-serif text-2xl font-semibold text-[var(--text)]">
                {modules.length}
              </dd>
            </div>
            <div className="col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:col-span-1">
              <dt className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                Pace
              </dt>
              <dd className="mt-1 text-sm font-semibold leading-snug text-[var(--text)]">
                Your schedule
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Your first three lessons (in order)
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            The site is built as a path. These three lessons are the on-ramp
            before variables and harder topics.
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            <li className="flex gap-4 rounded-card border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--text)] text-sm font-bold text-[var(--bg)]"
                aria-hidden
              >
                1
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                  Start
                </p>
                <Link
                  className="mt-1 block font-semibold text-[var(--accent)] no-underline hover:underline"
                  to={LESSON_1}
                >
                  How to use this textbook
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  How to read lessons, practice, and not get lost.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-card border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] text-sm font-bold text-[var(--text)] ring-1 ring-[var(--border)]"
                aria-hidden
              >
                2
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                  Then
                </p>
                <Link
                  className="mt-1 block font-semibold text-[var(--accent)] no-underline hover:underline"
                  to={LESSON_2}
                >
                  What is Python, really?
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  Plain-language picture of what runs on your machine.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-card border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] text-sm font-bold text-[var(--text)] ring-1 ring-[var(--border)]"
                aria-hidden
              >
                3
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                  Then
                </p>
                <Link
                  className="mt-1 block font-semibold text-[var(--accent)] no-underline hover:underline"
                  to={LESSON_3}
                >
                  Your first program
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  Needs Python installed. The lesson tells you how to check.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            How you use this site (simple loop)
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            Reading alone is not enough. Each lesson is built around this habit.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Read one screen at a time",
                d: "Stop after each section if you want. Re-read one paragraph instead of rushing.",
              },
              {
                n: "02",
                t: "Type the example code",
                d: "Use your own editor when the lesson shows code. Typing beats copy-paste for memory.",
              },
              {
                n: "03",
                t: "Run it and say what changed",
                d: "Run the file, look at the output, then say in one sentence what happened.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
              >
                <span className="font-mono text-xs font-bold text-[var(--accent)]">
                  {step.n}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-[var(--text)]">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {step.d}
                </p>
              </li>
            ))}
          </ol>
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

      <section className="border-t border-[var(--border)] bg-[var(--surface-2)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            When it feels hard
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              "If a word is new, treat it like vocabulary: write it on a sticky note, do not stop to memorize everything.",
              "If code fails, read the last line of the error first; it usually names the kind of problem.",
              "If you are tired, stop mid-lesson on purpose. Small daily sessions beat heroic cramming.",
            ].map((text) => (
              <li
                key={text}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--muted)] shadow-sm"
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
