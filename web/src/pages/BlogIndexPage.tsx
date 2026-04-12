import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { getBlogArticles } from "../content/blogArticles";
import { getCanonicalBase } from "../lib/site";
import { breadcrumbJsonLd } from "../lib/structuredData";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso + "T12:00:00"));
  } catch {
    return iso;
  }
}

export function BlogIndexPage() {
  const articles = getBlogArticles();

  const jsonLd = useMemo(() => {
    const base = getCanonicalBase();
    if (!base) return undefined;
    return [breadcrumbJsonLd(base, [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ])];
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title="Blog"
        description="Short, concrete Python articles: tracebacks, lists vs dicts, __main__ guards, virtual environments, loops vs comprehensions, and mutable defaults."
        jsonLd={jsonLd}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link className="font-semibold text-[var(--accent)] no-underline" to="/">
              Home
            </Link>
          </li>
          <li aria-hidden className="select-none text-[var(--border)]">
            /
          </li>
          <li className="font-medium text-[var(--text)]">Blog</li>
        </ol>
      </nav>

      <header className="mt-6">
        <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Study notes</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Blog
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Standalone notes on Python mechanics you will hit in real scripts. They complement the lesson path;
          when a topic has a matching lesson, the article says so. Nothing here runs code for you—use your own
          interpreter for exercises.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-[var(--border)] rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              to={`/blog/${a.slug}`}
              className="block px-5 py-5 no-underline transition-colors hover:bg-[var(--surface-2)] sm:px-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl">
                  {a.title}
                </h2>
                <span className="text-xs font-medium text-[var(--muted)]">
                  {formatDate(a.datePublished)} · {a.readMinutes} min read
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{a.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
