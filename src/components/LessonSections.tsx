import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { getPythonDictionaryEntries } from "../content/pythonDictionary";
import type { LessonSection } from "../content/types";
import { CodeRetypePractice } from "./CodeRetypePractice";

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

/** Renders `backticks` in strings as inline code for easier scanning. */
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
                  <span className="pointer-events-none absolute left-0 top-[calc(100%+0.3rem)] z-30 hidden w-72 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed text-[var(--text)] shadow-lg group-hover:block group-focus-within:block">
                    {hit.meaning}
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

export function LessonSections({
  sections,
  lessonSlug,
}: {
  sections: LessonSection[];
  lessonSlug: string;
}) {
  return (
    <div className="lesson-prose max-w-read">
      {sections.map((section, idx) => (
        <SectionBlock key={idx} section={section} sectionIndex={idx} lessonSlug={lessonSlug} />
      ))}
    </div>
  );
}

function SectionBlock({
  section,
  sectionIndex,
  lessonSlug,
}: {
  section: LessonSection;
  sectionIndex: number;
  lessonSlug: string;
}) {
  switch (section.type) {
    case "h2":
      return (
        <h2 className="scroll-mt-28 pt-2 font-serif text-[1.35rem] font-semibold leading-snug tracking-tight text-[var(--text)] sm:text-2xl">
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-sans text-base font-semibold leading-snug tracking-tight text-[var(--text)] sm:text-lg">
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-[17px] leading-[1.8] text-[var(--muted)]">
          <RichText text={section.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-3 text-[17px] leading-[1.75] text-[var(--muted)]">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                aria-hidden
              />
              <span className="min-w-0">
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-3 pl-6 text-[17px] leading-[1.75] text-[var(--muted)] marker:font-semibold marker:text-[var(--accent)]">
          {section.items.map((item, i) => (
            <li key={i} className="pl-2">
              <RichText text={item} />
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <CodeSectionBlock
          section={section}
          lessonSlug={lessonSlug}
          sectionIndex={sectionIndex}
        />
      );
    case "practice":
      return (
        <aside className="border-t border-[var(--practice-border)] pt-5 sm:pt-6">
          <h3 className="font-sans text-base font-bold tracking-tight text-[var(--text)] sm:text-lg">
            {section.title ?? "Try it yourself"}
          </h3>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:font-bold marker:text-[var(--accent)] sm:text-[15px] sm:leading-relaxed">
            {section.steps.map((step, i) => (
              <li key={i} className="pl-2">
                <RichText text={step} />
              </li>
            ))}
          </ol>
        </aside>
      );
    case "callout": {
      const styles =
        section.variant === "tip"
          ? {
              border: "var(--callout-tip-border)",
              label: "Tip",
            }
          : section.variant === "warn"
            ? {
                border: "var(--callout-warn-border)",
                label: "Heads-up",
              }
            : {
                border: "var(--callout-note-border)",
                label: "Note",
              };
      return (
        <aside
          className="border-l-2 pl-4"
          style={{
            borderLeftColor: styles.border,
            background: "transparent",
          }}
        >
          <div className="text-[11px] font-bold tracking-wide text-[var(--muted)] uppercase">
            {styles.label}
          </div>
          <div className="mt-1 text-[15px] leading-relaxed text-[var(--muted)] sm:text-base sm:leading-relaxed">
            <RichText text={section.text} />
          </div>
        </aside>
      );
    }
    default:
      return null;
  }
}

function CodeSectionBlock({
  section,
  lessonSlug,
  sectionIndex,
}: {
  section: Extract<LessonSection, { type: "code" }>;
  lessonSlug: string;
  sectionIndex: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = section.code.trim();

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <>
      <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md ring-1 ring-black/5 dark:ring-white/10">
        <figcaption className="flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs font-semibold leading-snug text-[var(--text)]">
          <span>
            {section.title ? (
              <>
                <span className="text-[var(--muted)]">Code · </span>
                {section.title}
              </>
            ) : (
              "Code example"
            )}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
            title="Expand code block"
            aria-label="Expand code block"
          >
            <ExpandIcon />
            Expand
          </button>
        </figcaption>
        <pre className="overflow-x-auto bg-[var(--code-bg)] p-4 text-[13px] leading-[1.65] sm:p-5 sm:text-sm">
          <code className="font-mono text-[var(--code-fg)] [tab-size:2]">
            {section.code}
          </code>
        </pre>
        {trimmed ? (
          <CodeRetypePractice
            expectedCode={section.code}
            title={section.title}
            storageKey={`${lessonSlug}-s${sectionIndex}`}
          />
        ) : null}
      </figure>

      {expanded && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Expanded code block"
              className="fixed inset-0 z-[230] flex flex-col bg-[var(--bg)]/95 backdrop-blur-sm"
            >
              <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-2 rounded-t-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {section.title ? section.title : "Code example"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                  >
                    Close
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-hidden rounded-b-2xl border-x border-b border-[var(--border)] bg-[var(--surface)]">
                  <pre className="h-[min(62vh,42rem)] overflow-auto bg-[var(--code-bg)] p-5 text-[15px] leading-[1.75] sm:p-6 sm:text-base">
                    <code className="font-mono text-[var(--code-fg)] [tab-size:2]">
                      {section.code}
                    </code>
                  </pre>
                  {trimmed ? (
                    <div className="border-t border-[var(--border)] bg-[var(--surface)]">
                      <CodeRetypePractice
                        expectedCode={section.code}
                        title={section.title}
                        storageKey={`${lessonSlug}-s${sectionIndex}`}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 3H3v5" />
      <path d="M16 3h5v5" />
      <path d="M3 16v5h5" />
      <path d="M21 16v5h-5" />
    </svg>
  );
}
