import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { getBlogArticleBySlug } from "../content/blogArticles";
import { getCanonicalBase } from "../lib/site";
import { organizationJsonLd } from "../lib/structuredData";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso + "T12:00:00"));
  } catch {
    return iso;
  }
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const article = slug ? getBlogArticleBySlug(slug) : undefined;

  const jsonLd = useMemo(() => {
    const a = slug ? getBlogArticleBySlug(slug) : undefined;
    if (!a) return undefined;
    const base = getCanonicalBase();
    const url = base ? `${base}/blog/${a.slug}` : undefined;
    const graph: Record<string, unknown>[] = [];
    if (base) {
      graph.push(organizationJsonLd(base));
    }
    const orgRef = base
      ? { "@id": `${base}/#organization` }
      : { "@type": "Organization", name: "Python Web Textbook" };
    graph.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      datePublished: a.datePublished,
      dateModified: a.dateModified ?? a.datePublished,
      author: orgRef,
      publisher: orgRef,
      mainEntityOfPage: url ? { "@type": "WebPage", "@id": url } : undefined,
      isAccessibleForFree: true,
    });
    if (url && base) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
          { "@type": "ListItem", position: 3, name: a.title, item: url },
        ],
      });
    }
    return graph;
  }, [slug]);

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Seo title="Article not found" description="That blog post does not exist." noIndex />
        <p className="text-sm font-medium text-[var(--muted)]">Blog</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--text)]">
          We could not find that article
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          The URL may be mistyped, or the post may have been renamed.
        </p>
        <Link
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] no-underline"
          to="/blog"
        >
          Back to the blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-read px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title={article.title}
        description={article.description}
        ogType="article"
        articlePublishedTime={article.datePublished}
        articleModifiedTime={article.dateModified ?? article.datePublished}
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
          <li>
            <Link className="font-semibold text-[var(--accent)] no-underline" to="/blog">
              Blog
            </Link>
          </li>
          <li aria-hidden className="select-none text-[var(--border)]">
            /
          </li>
          <li className="line-clamp-2 font-medium text-[var(--text)]">{article.title}</li>
        </ol>
      </nav>

      <header className="mt-6">
        <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Blog</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Published {formatDate(article.datePublished)}
          {article.dateModified && article.dateModified !== article.datePublished
            ? ` · Updated ${formatDate(article.dateModified)}`
            : null}{" "}
          · About {article.readMinutes} min read
        </p>
        <p className="mt-6 text-base leading-relaxed text-[var(--muted)]">{article.description}</p>
      </header>

      <div className="blog-prose mt-10 space-y-10">
        {article.sections.map((section, si) => (
          <section key={section.heading} aria-labelledby={`blog-sec-${article.slug}-${si}`}>
            <h2
              id={`blog-sec-${article.slug}-${si}`}
              className="font-serif text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl"
            >
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-14 border-t border-[var(--border)] pt-8">
        <p className="text-sm font-semibold text-[var(--text)]">Continue learning</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link className="font-semibold text-[var(--accent)] no-underline hover:underline" to="/learn">
              Browse all lessons
            </Link>
          </li>
          <li>
            <Link
              className="font-semibold text-[var(--accent)] no-underline hover:underline"
              to="/learn/flashcards"
            >
              Flashcards
            </Link>
          </li>
          <li>
            <Link className="font-semibold text-[var(--accent)] no-underline hover:underline" to="/blog">
              More blog posts
            </Link>
          </li>
        </ul>
      </footer>
    </article>
  );
}
