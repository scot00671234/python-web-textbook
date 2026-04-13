import { Link } from "react-router-dom";
import { getPythonDictionaryEntries } from "../content/pythonDictionary";

type GlossaryHit = {
  id: string;
  meaning: string;
};

const dictionaryWordMap: Record<string, GlossaryHit> = (() => {
  const map: Record<string, GlossaryHit> = {};
  for (const entry of getPythonDictionaryEntries()) {
    const lower = entry.term.toLowerCase();
    const noBackticks = lower.replace(/`/g, "");
    const noParens = noBackticks.replace(/\([^)]*\)/g, " ");
    const compact = noParens.replace(/\s+/g, " ").trim();
    if (!compact || compact.includes(" ")) continue;
    const key = compact.replace(/[^a-z0-9_/]/g, "");
    if (!key) continue;
    if (!map[key]) {
      map[key] = { id: entry.id, meaning: entry.meaning };
    }
  }
  return map;
})();

function normalizeWordToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9_/]/g, "");
}

/** Renders `backticks` in strings as inline code; links dictionary terms to /learn/python-dictionary. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]*`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code key={i} className="inline-code">
              {part.slice(1, -1)}
            </code>
          );
        }
        const tokens = part.split(/([A-Za-z][A-Za-z0-9_/]*)/g);
        return (
          <span key={i}>
            {tokens.map((token, j) => {
              const normalized = normalizeWordToken(token);
              const hit = normalized ? dictionaryWordMap[normalized] : undefined;
              if (!hit) return <span key={j}>{token}</span>;
              return (
                <span key={j} className="group relative inline">
                  <Link
                    to={`/learn/python-dictionary#${hit.id}`}
                    className="rounded-sm underline decoration-dotted underline-offset-2 transition hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    title={hit.meaning}
                  >
                    {token}
                  </Link>
                  <span className="absolute left-0 top-[calc(100%+0.3rem)] z-30 hidden w-72 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed text-[var(--text)] shadow-lg group-hover:block group-focus-within:block">
                    <span>{hit.meaning}</span>
                    <Link
                      to={`/learn/python-dictionary#${hit.id}`}
                      className="mt-2 block text-[11px] font-semibold text-[var(--accent)] no-underline hover:underline"
                    >
                      Open in dictionary →
                    </Link>
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}
