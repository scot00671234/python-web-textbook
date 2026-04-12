import type { Lesson, LessonSection } from "../content/types";

/** Flatten backticks and extra spaces for clearer speech. */
export function stripTicksForSpeech(s: string): string {
  return s.replace(/`[^`]*`/g, " ").replace(/\s+/g, " ").trim();
}

function sectionToChunks(section: LessonSection): string[] {
  switch (section.type) {
    case "h2":
    case "h3":
      return [stripTicksForSpeech(section.text)].filter(Boolean);
    case "p":
      return [stripTicksForSpeech(section.text)].filter(Boolean);
    case "ul":
    case "ol":
      return section.items
        .map((item) => stripTicksForSpeech(item))
        .filter(Boolean);
    case "code": {
      const intro = section.title
        ? `Code example: ${stripTicksForSpeech(section.title)}.`
        : "Here is a short code example. Symbols are skipped in audio.";
      return [intro];
    }
    case "callout": {
      const body = stripTicksForSpeech(section.text);
      if (!body) return [];
      const label =
        section.variant === "tip"
          ? "Tip."
          : section.variant === "warn"
            ? "Heads up."
            : "Note.";
      return [`${label} ${body}`];
    }
    case "practice": {
      const title = section.title
        ? stripTicksForSpeech(section.title)
        : "Try it yourself";
      const steps = section.steps.map(
        (t, i) => `Step ${i + 1}. ${stripTicksForSpeech(t)}`,
      );
      return [title, ...steps].filter(Boolean);
    }
    default:
      return [];
  }
}

/** Ordered phrases for text-to-speech (one utterance per chunk where possible). */
export function lessonToSpeechChunks(lesson: Lesson): string[] {
  const out: string[] = [];
  out.push(lesson.title);
  if (lesson.subtitle) {
    out.push(stripTicksForSpeech(lesson.subtitle));
  }
  out.push(stripTicksForSpeech(lesson.summary));

  if (lesson.objectives?.length) {
    out.push("After this lesson you should be able to:");
    for (const o of lesson.objectives) {
      const t = stripTicksForSpeech(o);
      if (t) out.push(t);
    }
  }

  for (const section of lesson.sections) {
    out.push(...sectionToChunks(section));
  }

  if (lesson.practicePrompts?.length) {
    out.push("Your turn. Try these when you can.");
    for (const p of lesson.practicePrompts) {
      const t = stripTicksForSpeech(p);
      if (t) out.push(t);
    }
  }

  if (lesson.keyTakeaways?.length) {
    out.push("Key takeaways.");
    for (const k of lesson.keyTakeaways) {
      const t = stripTicksForSpeech(k);
      if (t) out.push(t);
    }
  }

  return out.filter((c) => c.length > 0);
}
