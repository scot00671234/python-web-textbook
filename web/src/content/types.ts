export type LessonSection =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; code: string; title?: string }
  | { type: "callout"; variant: "tip" | "note" | "warn"; text: string }
  | { type: "practice"; title?: string; steps: string[] };

/** Where this lesson sits on the path (badges + expectations). */
export type LessonTier = "foundational" | "intermediate" | "advanced";

export type Lesson = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  objectives?: string[];
  sections: LessonSection[];
  readingTimeMinutes?: number;
  /** Short exercises to do at the keyboard (optional but recommended). */
  practicePrompts?: string[];
  /** Two to four bullets you can skim before moving on. */
  keyTakeaways?: string[];
  /** Default is foundational when omitted. */
  tier?: LessonTier;
  /** Domain or workflow focus (research, ML, finance, econometrics, AI, etc.). */
  isPractical?: boolean;
};

export type Module = {
  id: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
};

export type Flashcard = {
  id: string;
  /** Question or term (face-up first). */
  front: string;
  /** Answer or definition (after flip). */
  back: string;
};

export type FlashcardDeck = {
  id: string;
  title: string;
  blurb: string;
  cards: Flashcard[];
};
