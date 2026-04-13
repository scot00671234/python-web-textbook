/** Home FAQ: same strings power visible markup and FAQPage JSON-LD (AEO). */
export type HomeFaqItem = {
  question: string;
  /** Direct answer first, then detail—better for snippets and answer engines. */
  answer: string;
};

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    question: "Is pylearn really free?",
    answer:
      "Yes. The lessons, flashcards, plain-English cards, and blog are free to read in your browser, and you do not need an account. Optional typing checks compare your text to the lesson’s example snippet; they are not a paid tutoring service.",
  },
  {
    question: "Does this site run any Python code I type?",
    answer:
      "No. Lessons expect you to run code on your own machine when the lesson says to. On-page typing practice only checks whether you matched a provided example snippet character-for-character; it is practice, not a full Python interpreter in the browser.",
  },
  {
    question: "Where should I start if I am brand new?",
    answer:
      "Start with lesson 1 (“How to use this textbook”). The path is ordered on purpose so later lessons do not assume knowledge you have not seen yet.",
  },
  {
    question: "How do I search inside the textbook?",
    answer:
      "Use the search bar in the header. It finds lessons, flashcards, plain-English cards, and blog posts by matching the words you type. It is simple client-side search, not an AI tutor.",
  },
];
