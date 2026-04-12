import type { LessonSection } from "../types";

/** Fast path: one-line promise + tiny roadmap so readers know where time goes. */
export function ql(in10Seconds: string, onThisPage: string[]): LessonSection[] {
  return [
    {
      type: "callout",
      variant: "tip",
      text: `In 10 seconds: ${in10Seconds}`,
    },
    { type: "h2", text: "On this page" },
    { type: "ol", items: onThisPage },
  ];
}

/** Short self-check before the reader scrolls away. */
export function check(text: string): LessonSection {
  return {
    type: "callout",
    variant: "note",
    text: `Check: ${text}`,
  };
}
