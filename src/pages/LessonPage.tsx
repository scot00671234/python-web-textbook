import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { LessonAudioReader } from "../components/LessonAudioReader";
import { Seo } from "../components/Seo";
import { LessonTierBadgeLarge } from "../components/LessonTierBadge";
import { LessonSections, RichText } from "../components/LessonSections";
import {
  getAllLessons,
  getLessonBySlug,
  getLessonContext,
} from "../content/curriculum";
import { getCanonicalBase } from "../lib/site";
import { breadcrumbJsonLd, learningResourceLessonJsonLd } from "../lib/structuredData";

export function LessonPage() {
  const { slug } = useParams();
  const lesson = slug ? getLessonBySlug(slug) : undefined;
  const ctx = slug ? getLessonContext(slug) : undefined;

  const lessonDescription =
    lesson == null
      ? ""
      : lesson.summary.length > 220
        ? `${lesson.summary.slice(0, 217).trimEnd()}...`
        : lesson.summary;

  const jsonLd = useMemo(() => {
    if (!lesson) return undefined;
    const base = getCanonicalBase();
    if (!base) return undefined;
    const path = `/learn/${lesson.slug}`;
    const crumbs = [
      { name: "Home", path: "/" },
      { name: "All lessons", path: "/learn" },
      { name: lesson.title, path },
    ];
    return [
      learningResourceLessonJsonLd({
        base,
        name: lesson.title,
        description: lessonDescription,
        path,
        position: ctx?.lessonIndex1,
        moduleName: ctx?.module.title,
      }),
      breadcrumbJsonLd(base, crumbs),
    ];
  }, [lesson, lessonDescription, ctx]);

  if (!lesson) {
    return (
      <div className="max-w-read py-10">
        <Seo
          title="Missing lesson"
          description="That lesson URL is not part of pylearn."
          noIndex
        />
        <p className="text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">
          Missing lesson
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
          We could not find that page
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          The lesson slug in the URL does not exist yet. Open the full lesson
          list and pick a lesson from there.
        </p>
        <Link
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[var(--text)] px-5 text-sm font-semibold text-[var(--bg)] no-underline"
          to="/learn"
        >
          Back to all lessons
        </Link>
      </div>
    );
  }

  const sequence = getAllLessons();
  const idx = sequence.findIndex((x) => x.lesson.slug === lesson.slug);
  const prev = idx > 0 ? sequence[idx - 1] : undefined;
  const next = idx >= 0 && idx < sequence.length - 1 ? sequence[idx + 1] : undefined;

  const hasPractice = (lesson.practicePrompts?.length ?? 0) > 0;
  const hasTakeaways = (lesson.keyTakeaways?.length ?? 0) > 0;
  const showJump = hasPractice || hasTakeaways;

  return (
    <article className="max-w-read py-8 lg:py-10">
      <Seo title={lesson.title} description={lessonDescription} jsonLd={jsonLd} />
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
          {ctx ? (
            <li className="text-[var(--text)]">{ctx.module.title}</li>
          ) : null}
          {ctx ? (
            <li aria-hidden className="select-none text-[var(--border)]">
              /
            </li>
          ) : null}
          <li className="font-medium text-[var(--text)]">{lesson.title}</li>
        </ol>
      </nav>

      {ctx ? (
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
          <p className="font-medium text-[var(--text)]">
            Lesson {ctx.lessonIndex1} of {ctx.totalLessons}
          </p>
          <p className="mt-1 text-xs leading-relaxed sm:text-sm">
            In <span className="font-semibold text-[var(--text)]">{ctx.module.title}</span>
            : this is lesson {ctx.lessonInModule1} of {ctx.lessonsInModule} in that module.
          </p>
        </div>
      ) : null}

      <header className="mt-8 border-b border-[var(--border)] pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <LessonTierBadgeLarge lesson={lesson} />
          {lesson.readingTimeMinutes ? (
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-semibold text-[var(--muted)]">
              About {lesson.readingTimeMinutes} min read
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.4rem] lg:leading-tight">
          {lesson.title}
        </h1>
        {lesson.subtitle ? (
          <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
            <RichText text={lesson.subtitle} />
          </p>
        ) : null}
        <p className="mt-5 text-[17px] leading-[1.75] text-[var(--muted)]">
          <RichText text={lesson.summary} />
        </p>

        {lesson.objectives?.length ? (
          <div className="mt-8 rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              After this lesson you should be able to
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
              {lesson.objectives.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                    aria-hidden
                  />
                  <span>
                    <RichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showJump ? (
          <nav
            className="mt-8 flex flex-wrap gap-2 border-t border-dashed border-[var(--border)] pt-6 text-sm"
            aria-label="Jump to lesson sections"
          >
            <span className="w-full text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              Jump to
            </span>
            <a
              className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 font-medium text-[var(--text)] no-underline transition hover:border-[var(--accent)]/40"
              href="#lesson-reading"
            >
              Reading
            </a>
            {hasPractice ? (
              <a
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 font-medium text-[var(--text)] no-underline transition hover:border-[var(--accent)]/40"
                href="#lesson-practice"
              >
                Your turn
              </a>
            ) : null}
            {hasTakeaways ? (
              <a
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 font-medium text-[var(--text)] no-underline transition hover:border-[var(--accent)]/40"
                href="#lesson-summary"
              >
                Key takeaways
              </a>
            ) : null}
          </nav>
        ) : null}
      </header>

      <div id="lesson-reading" className="scroll-mt-28 pt-2">
        <h2 className="sr-only">Reading</h2>
        <LessonSections sections={lesson.sections} lessonSlug={lesson.slug} />
      </div>

      {lesson.practicePrompts?.length ? (
        <section
          id="lesson-practice"
          className="scroll-mt-28 mt-12 rounded-card border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-7"
          aria-labelledby="practice-heading"
        >
          <h2
            id="practice-heading"
            className="font-serif text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl"
          >
            Your turn
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
            Short prompts you can do with or without Python installed. If you only
            finish one, that still counts.
          </p>
          <ol className="mt-6 list-none space-y-3">
            {lesson.practicePrompts.map((p, n) => (
              <li
                key={p}
                className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--accent)] text-xs font-bold text-[var(--accent-fg)]"
                  aria-hidden
                >
                  {n + 1}
                </span>
                <p className="min-w-0 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px] sm:leading-relaxed">
                  <RichText text={p} />
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {lesson.keyTakeaways?.length ? (
        <section
          id="lesson-summary"
          className="scroll-mt-28 mt-8 rounded-card border border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--accent)_7%,var(--surface))] p-6 dark:bg-[color-mix(in_oklab,var(--accent)_11%,var(--surface))] sm:p-7"
          aria-labelledby="takeaways-heading"
        >
          <h2
            id="takeaways-heading"
            className="font-serif text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl"
          >
            Key takeaways
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Skim these before you close the tab. They are the ideas worth carrying
            forward.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px] sm:leading-relaxed">
            {lesson.keyTakeaways.map((t, i) => (
              <li key={t} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--surface)] text-xs font-bold text-[var(--accent)] ring-1 ring-[var(--border)]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <RichText text={t} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <LessonAudioReader lesson={lesson} />

      <footer className="mt-14 flex flex-col gap-3 border-t border-[var(--border)] pt-10 sm:flex-row sm:items-stretch sm:justify-between">
        {prev ? (
          <Link
            className="group inline-flex flex-1 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm no-underline shadow-sm transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)] hover:shadow-md sm:max-w-[48%]"
            to={`/learn/${prev.lesson.slug}`}
          >
            <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              Previous
            </span>
            <span className="mt-1 font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
              {prev.lesson.title}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            className="group inline-flex flex-1 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm no-underline shadow-sm transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)] hover:shadow-md sm:max-w-[48%] sm:text-right"
            to={`/learn/${next.lesson.slug}`}
          >
            <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              Next
            </span>
            <span className="mt-1 font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
              {next.lesson.title}
            </span>
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
