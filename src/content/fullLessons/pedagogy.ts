import type { LessonSection } from "../types";

/** Fast path: one-line promise + tiny roadmap so readers know where time goes. */
export function ql(in10Seconds: string, onThisPage: string[]): LessonSection[] {
  return [
    {
      type: "p",
      text: `In 10 seconds: ${in10Seconds}`,
    },
    { type: "h3", text: "On this page" },
    { type: "ol", items: onThisPage },
    {
      type: "callout",
      variant: "note",
      text: "How to study this lesson: read one section, run the code, then explain the output in your own words before moving on.",
    },
  ];
}

/** Short self-check before the reader scrolls away. */
export function check(text: string): LessonSection {
  return {
    type: "callout",
    variant: "note",
    text: `Self-check: ${text}`,
  };
}
