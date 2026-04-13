import { getFlashcardDecks } from "../content/flashcards";
import { getAllLessons } from "../content/curriculum";
import { getPlainEnglishCards } from "../content/pythonInPlainEnglish";
import { getPythonDictionaryEntries } from "../content/pythonDictionary";
import { getBlogArticles } from "../content/blogArticles";

export type SearchKind = "lesson" | "page" | "deck" | "plain" | "blog" | "dictionary";

export type SearchHit = {
  id: string;
  kind: SearchKind;
  title: string;
  href: string;
  /** Module name, page description, or deck blurb. */
  subtitle: string;
};

type InternalHit = SearchHit & { haystack: string };

let cache: InternalHit[] | null = null;

function buildIndex(): InternalHit[] {
  if (cache) return cache;
  const hits: InternalHit[] = [];

  for (const { module, lesson } of getAllLessons()) {
    const hay = [
      lesson.title,
      lesson.summary,
      lesson.subtitle ?? "",
      lesson.slug,
      ...(lesson.objectives ?? []),
      ...(lesson.keyTakeaways ?? []),
    ]
      .join(" ")
      .toLowerCase();
    hits.push({
      id: `lesson-${lesson.slug}`,
      kind: "lesson",
      title: lesson.title,
      href: `/learn/${lesson.slug}`,
      subtitle: module.title,
      haystack: hay,
    });
  }

  const pages: Omit<InternalHit, "haystack">[] = [
    {
      id: "page-learn",
      kind: "page",
      title: "All lessons",
      href: "/learn",
      subtitle: "Lesson list and recommended path",
    },
    {
      id: "page-flashcards",
      kind: "page",
      title: "Flashcards",
      href: "/learn/flashcards",
      subtitle: "Quick recall by deck",
    },
    {
      id: "page-plain",
      kind: "page",
      title: "Python in plain English",
      href: "/learn/python-in-plain-english",
      subtitle: "Code next to plain-language readings",
    },
    {
      id: "page-dictionary",
      kind: "page",
      title: "Python dictionary",
      href: "/learn/python-dictionary",
      subtitle: "Beginner-friendly terms, meanings, and examples",
    },
    {
      id: "page-home",
      kind: "page",
      title: "Home",
      href: "/",
      subtitle: "Start here",
    },
    {
      id: "page-blog",
      kind: "page",
      title: "Blog",
      href: "/blog",
      subtitle: "Articles on learning Python with this textbook",
    },
  ];
  for (const p of pages) {
    hits.push({
      ...p,
      haystack: `${p.title} ${p.subtitle} ${p.href}`.toLowerCase(),
    });
  }

  for (const deck of getFlashcardDecks()) {
    hits.push({
      id: `deck-${deck.id}`,
      kind: "deck",
      title: deck.title,
      href: "/learn/flashcards",
      subtitle: deck.blurb,
      haystack: `${deck.title} ${deck.blurb} flashcards`.toLowerCase(),
    });
  }

  for (const card of getPlainEnglishCards()) {
    hits.push({
      id: `plain-${card.id}`,
      kind: "plain",
      title: card.title,
      href: `/learn/python-in-plain-english#${card.id}`,
      subtitle: "Python in plain English",
      haystack: `${card.title} ${card.bullets.join(" ")} plain english`.toLowerCase(),
    });
  }

  for (const term of getPythonDictionaryEntries()) {
    hits.push({
      id: `dictionary-${term.id}`,
      kind: "dictionary",
      title: term.term,
      href: "/learn/python-dictionary",
      subtitle: term.meaning,
      haystack: `${term.term} ${term.category} ${term.meaning} ${(term.related ?? []).join(" ")} python dictionary`.toLowerCase(),
    });
  }

  for (const post of getBlogArticles()) {
    const body = post.sections
      .flatMap((s) => [s.heading, ...s.paragraphs])
      .join(" ")
      .toLowerCase();
    hits.push({
      id: `blog-${post.slug}`,
      kind: "blog",
      title: post.title,
      href: `/blog/${post.slug}`,
      subtitle: post.description,
      haystack: `${post.title} ${post.description} ${body} blog`.toLowerCase(),
    });
  }

  cache = hits;
  return hits;
}

function tokensMatch(haystack: string, tokens: string[]): boolean {
  return tokens.every((t) => haystack.includes(t));
}

function scoreHit(hit: InternalHit, tokens: string[], rawLower: string): number {
  if (!tokens.length) return 0;
  if (!tokensMatch(hit.haystack, tokens)) return 0;
  const title = hit.title.toLowerCase();
  let s = 0;
  if (title === rawLower) s += 120;
  else if (title.startsWith(rawLower)) s += 90;
  else if (tokens.every((t) => title.includes(t))) s += 70;
  else if (title.includes(rawLower)) s += 50;
  else s += 25;
  if (hit.kind === "lesson" && hit.haystack.includes(rawLower)) s += 10;
  return s;
}

/** Client-side search: every word in the query must appear somewhere in the indexed text. */
export function searchSite(query: string, limit = 80): SearchHit[] {
  const raw = query.trim().toLowerCase();
  if (!raw) return [];
  const tokens = raw.split(/\s+/).filter(Boolean);
  const items = buildIndex()
    .map((hit) => ({ hit, score: scoreHit(hit, tokens, raw) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title));

  const out: SearchHit[] = [];
  const seen = new Set<string>();
  for (const { hit } of items) {
    const key = `${hit.kind}:${hit.href}:${hit.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const { id, kind, title, href, subtitle } = hit;
    out.push({ id, kind, title, href, subtitle });
    if (out.length >= limit) break;
  }
  return out;
}
