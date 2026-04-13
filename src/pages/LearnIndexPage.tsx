import { useMemo } from "react";
import { Link } from "react-router-dom";
import { LessonTierBadge } from "../components/LessonTierBadge";
import { Seo } from "../components/Seo";
import { getAllLessons, modules } from "../content/curriculum";
import { estimateLessonReadMinutes } from "../lib/lessonReadTime";
import { getCanonicalBase } from "../lib/site";
import { breadcrumbJsonLd } from "../lib/structuredData";

export function LearnIndexPage() {
  const total = getAllLessons().length;

  const jsonLd = useMemo(() => {
    const base = getCanonicalBase();
    if (!base) return undefined;
    return [
      breadcrumbJsonLd(base, [
        { name: "Home", path: "/" },
        { name: "All lessons", path: "/learn" },
      ]),
    ];
  }, []);

  return (
    <div className="py-8 lg:py-10">
      <Seo
        title="All lessons"
        description={`Ordered Python lessons (${total} total) from first steps through applied topics—self-paced, with flashcards and plain-English companion readings.`}
        jsonLd={jsonLd}
      />
      <header className="max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          All lessons in order
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
          Scroll to browse every module and work top to bottom inside each
          section. When you see &quot;Lab&quot; or &quot;Your turn,&quot; try the
          smallest version at the keyboard.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {modules.map((module, modIdx) => (
          <section key={module.id} className="scroll-mt-28">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-sm font-bold text-[var(--accent)]">
                {String(modIdx + 1).padStart(2, "0")}
              </span>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-[var(--text)]">
                {module.title}
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              {module.blurb}
            </p>

            <ul className="mt-5 divide-y divide-[var(--border)] overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              {module.lessons.map((lesson) => {
                const estimatedReadMinutes = estimateLessonReadMinutes(lesson);
                return (
                  <li key={lesson.slug}>
                    <Link
                      className="flex flex-col gap-2 px-5 py-4 no-underline transition-colors hover:bg-[var(--surface-2)] sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                      to={`/learn/${lesson.slug}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--text)]">
                            {lesson.title}
                          </span>
                          <LessonTierBadge lesson={lesson} />
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                          {lesson.summary}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 text-xs font-semibold text-[var(--muted)]">
                        <span>~{estimatedReadMinutes} min</span>
                        <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[var(--text)]">
                          Open →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
