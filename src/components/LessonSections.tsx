import type { LessonSection } from "../content/types";
import { CodeRetypePractice } from "./CodeRetypePractice";

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
        return <span key={i}>{part}</span>;
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
    case "code": {
      const trimmed = section.code.trim();
      return (
        <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md ring-1 ring-black/5 dark:ring-white/10">
          {section.title ? (
            <figcaption className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs font-semibold leading-snug text-[var(--text)]">
              <span className="text-[var(--muted)]">Code · </span>
              {section.title}
            </figcaption>
          ) : null}
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
      );
    }
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
