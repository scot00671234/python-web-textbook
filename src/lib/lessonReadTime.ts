import type { Lesson, LessonSection } from "../content/types";

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function estimateSectionWords(section: LessonSection): number {
  switch (section.type) {
    case "h2":
    case "h3":
    case "p":
      return countWords(section.text);
    case "ul":
    case "ol":
      return section.items.reduce((sum, item) => sum + countWords(item), 0);
    case "callout":
      return countWords(section.text);
    case "practice":
      return (section.title ? countWords(section.title) : 0) +
        section.steps.reduce((sum, step) => sum + countWords(step), 0);
    case "code": {
      const titleWords = section.title ? countWords(section.title) : 0;
      const codeLines = section.code.split("\n").filter((line) => line.trim().length > 0).length;
      // Treat code as slower to read than prose, roughly 8 "words" per non-empty line.
      return titleWords + codeLines * 8;
    }
    default:
      return 0;
  }
}

export function estimateLessonReadMinutes(lesson: Lesson): number {
  const baseWords =
    countWords(lesson.title) +
    (lesson.subtitle ? countWords(lesson.subtitle) : 0) +
    countWords(lesson.summary) +
    (lesson.objectives?.reduce((sum, item) => sum + countWords(item), 0) ?? 0) +
    lesson.sections.reduce((sum, section) => sum + estimateSectionWords(section), 0) +
    (lesson.practicePrompts?.reduce((sum, item) => sum + countWords(item), 0) ?? 0) +
    (lesson.keyTakeaways?.reduce((sum, item) => sum + countWords(item), 0) ?? 0);

  // Beginner-friendly pacing, a little slower than typical blog WPM.
  const minutes = Math.ceil(baseWords / 165);
  return Math.max(3, minutes);
}
