/** Home FAQ: same strings power visible markup and FAQPage JSON-LD (AEO). */
export type HomeFaqItem = {
  question: string;
  /** Direct answer first, then detail—better for snippets and answer engines. */
  answer: string;
};

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    question: "Is Python Web Textbook really free?",
    answer:
      "Yes. The lessons, flashcards, plain-English cards, and blog are free to read in your browser, and you do not need an account. Optional typing checks compare your text to the lesson’s example snippet; they are not a paid tutoring service.",
  },
  {
    question: "Do I need to install Python before lesson 1?",
    answer:
      "No for the first lesson: it is about how to study here. You will need Python installed on your computer by the time you reach the “first program” lesson, which tells you how to check that it works.",
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
    question: "Can this site replace a computer science degree or a paid bootcamp?",
    answer:
      "No. It is self-paced reading and practice material. A degree or bootcamp adds instructors, deadlines, projects, and feedback this site does not provide. Use this textbook as one structured free resource alongside your own projects and community.",
  },
  {
    question: "How do I search inside the textbook?",
    answer:
      "Use the search bar in the header. It finds lessons, flashcards, plain-English cards, and blog posts by matching the words you type. It is simple client-side search, not an AI tutor.",
  },
];
