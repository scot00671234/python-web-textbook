import { getBlogArticles } from "../content/blogArticles";
import { getAllLessons } from "../content/curriculum";

/** Paths for sitemap.xml (no `/search`—that route is `noindex`). */
export function getSitemapStaticPaths(): string[] {
  const fixed = [
    "/",
    "/learn",
    "/learn/flashcards",
    "/learn/python-in-plain-english",
    "/learn/python-dictionary",
    "/blog",
  ];
  const lessons = getAllLessons().map(({ lesson }) => `/learn/${lesson.slug}`);
  const blog = getBlogArticles().map((a) => `/blog/${a.slug}`);
  return [...new Set([...fixed, ...lessons, ...blog])].sort((a, b) => a.localeCompare(b));
}
