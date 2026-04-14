import type { Lesson, Module } from "./types";
import {
  lessonAiSafetyPrivacyAndData,
  lessonBacktestsAndOverfitting,
  lessonBigOWithoutTerror,
  lessonBooleansAndConditions,
  lessonCashflowsNpvAndScenarios,
  lessonCausalQuestionsBeforePackages,
  lessonCausalityAndVariablesFoundations,
  lessonClassesAndState,
  lessonComprehensionsAndIteration,
  lessonDataclassesAndSlots,
  lessonDecoratorsFirstContact,
  lessonDesigningCliTools,
  lessonDictionaries,
  lessonEmbeddingsAndRetrievalSketch,
  lessonErrorsAndDebugging,
  lessonExperimentsAndAbTesting,
  lessonDifferenceInDifferencesResearchDesign,
  lessonForLoops,
  lessonFunctionsBasics,
  lessonGeneratorsAndLazyPipelines,
  lessonGeodataAndMapsIntro,
  lessonGradualTypingTradeoffs,
  lessonIfElifElse,
  lessonImports,
  lessonInheritanceAndComposition,
  lessonInputAndOutput,
  lessonItertoolsFunctoolsPatterns,
  lessonLinearModelsInferenceStatsmodels,
  lessonLists,
  lessonLlmsAsToolsNotOracles,
  lessonLoggingAndObservability,
  lessonMethodsAndDundersIntro,
  lessonMiniProjectIdeas,
  lessonMlEvaluationAndLeakage,
  lessonMonteCarloForDecisions,
  lessonNumbersAndStrings,
  lessonPathlibWorkflows,
  lessonMatchingAndSyntheticControl,
  lessonPolicyEvaluationInterpretation,
  lessonPolicyEvaluationMethodology,
  lessonPolicyEvaluationWithPython,
  lessonPredictionVsExplanationMindset,
  lessonProtocolsAndTyping,
  lessonReadingFiles,
  lessonReadingProfessionalCode,
  lessonRandomizedControlledTrialsInPractice,
  lessonRegressionDiscontinuityForPolicy,
  lessonScikitLearnPipelines,
  lessonSets,
  lessonTestingWithPytest,
  lessonTextAsDataIntro,
  lessonTimeSeriesAndPanelsIntro,
  lessonTuples,
  lessonTypeAnnotationsBasics,
  lessonVenvsAndDependencies,
  lessonWhileLoops,
} from "./fullLessons";

const howToUseThisSite: Lesson = {
  slug: "how-to-use-this-site",
  title: "How to use this textbook",
  subtitle: "If you have never coded, start here. This page is for you",
  summary:
    "You do not need prior programming experience. This lesson explains how the course is organized, how to study without burning out, and what to do the moment you feel lost.",
  objectives: [
    "Follow a simple study loop: read → type → run → explain aloud",
    "Know what to do when a lesson feels confusing or “too fast”",
  ],
  readingTimeMinutes: 8,
  tier: "foundational",
  practicePrompts: [
    "Create a folder on your desktop named `python-practice` (or any name you like). You will use it in the next lessons.",
    "After you finish reading, close the tab and explain to someone (or a voice memo) what you will do first when you open Python.",
  ],
  keyTakeaways: [
    "You learn Python with your fingers, not only your eyes. Typing tiny programs matters more than perfect understanding on pass one.",
    "Confusion is data: it tells you exactly which sentence to reread or which line to re-type.",
    "This site is ordered on purpose: skipping ahead is fine for curiosity, but the path below removes hidden prerequisites.",
  ],
  sections: [
    {
      type: "callout",
      variant: "warn",
      text: "If a word like “interpreter” or “terminal” sounds alien, that is normal. Each lesson introduces a few new words on purpose. Treat them like vocabulary in a new language, not a test.",
    },
    {
      type: "p",
      text: "Treat each lesson like a short chapter: read slowly, then type the examples yourself. Watching code is not the same as writing code. Python rewards repetition: five-line programs, written often, beat giant weekend cram sessions.",
    },
    {
      type: "h2",
      text: "The 4-step loop that actually works",
    },
    {
      type: "ol",
      items: [
        "Read one section without multitasking.",
        "Type the code exactly (even if you do not understand every symbol yet).",
        "Run it and look at the output like evidence in a detective story.",
        "Say in one sentence what changed when you ran it.",
      ],
    },
    {
      type: "h2",
      text: "How the course is structured",
    },
    {
      type: "p",
      text: "We move from concrete to abstract. First you will print text and do simple arithmetic (things you can see immediately). Then we introduce names (variables), decisions (if), repetition (loops), and grouping (functions). Later units introduce collections (lists, dictionaries) and reading files (skills you use in real scripts). After that, the path continues into intermediate topics (objects, idioms, typing, tests) and then advanced lessons that feel closer to graduate depth, still in the same plain-English style.",
    },
    {
      type: "ul",
      items: [
        "Lessons marked as “starter notes” still teach orientation: they tell you why a topic exists before you dive into syntax.",
        "Code blocks are intentionally small so you can keep the whole program in your head.",
        "When you see “Lab” boxes, do them at the keyboard. Even a partial try counts.",
      ],
    },
    {
      type: "practice",
      title: "Your first 5-minute habit",
      steps: [
        "Pick one lesson from Orientation (this one counts).",
        "Set a timer for 5 minutes and read only until the timer ends.",
        "Write down one question you still have (spelling does not matter).",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      text: "Keep every practice file in one folder. Names like `lesson_01_hello.py` make future-you grateful.",
    },
    {
      type: "h2",
      text: "What “reading Python like English” means",
    },
    {
      type: "p",
      text: "Code is not magic; it is a very strict kind of writing. The goal is not memorizing every function name. The goal is recognizing patterns: assignment, loops, function calls, and data shaped as lists and dictionaries. When those patterns feel familiar, reading unfamiliar code becomes closer to reading a recipe.",
    },
    {
      type: "h3",
      text: "When you feel stuck, try this order",
    },
    {
      type: "ul",
      items: [
        "Re-run the program and read the error message slowly (it is usually closer than it feels).",
        "Compare your code to the lesson character by character. Typos are the classic culprit.",
        "Take a 2-minute break, then re-type the example from scratch (do not copy-paste).",
      ],
    },
  ],
};

const whatIsPython: Lesson = {
  slug: "what-is-python",
  title: "What is Python, really?",
  subtitle: "A mental model you can reuse in every future lesson",
  summary:
    "Python is a general-purpose programming language: one tool you can use for homework helpers, small business automation, science, games, and websites. This lesson builds a picture of what runs where, without drowning you in jargon.",
  objectives: [
    "Describe what happens when you run a `.py` file",
    "Separate the language (Python) from helpful extras (libraries)",
  ],
  readingTimeMinutes: 10,
  tier: "foundational",
  practicePrompts: [
    "In one sentence, answer: “What job does the Python interpreter do?” Use your own words.",
    "If you can, open a terminal and type `python --version` or `python3 --version`. If that fails, write down the exact message you see. That message is your next clue when you install later.",
  ],
  keyTakeaways: [
    "Your code is text; Python is the program that reads that text and follows instructions.",
    "Libraries are optional add-ons: learn core Python first, then reach for libraries when you have a specific project.",
    "You do not need to know “everything Python can do” to be productive. Most beginners use a small slice of the language for a long time.",
  ],
  sections: [
    {
      type: "p",
      text: "A programming language is a set of rules for writing instructions a computer can follow. Python’s rules aim for readability: indentation groups related lines, names can be descriptive, and many tasks can be expressed in a small amount of code.",
    },
    {
      type: "h2",
      text: "Where Python runs (the picture to keep)",
    },
    {
      type: "p",
      text: "You write text in a file (for example `hello.py`). A program called the Python interpreter reads that file and performs the instructions line by line. If a line asks Python to print a message, you see output in a terminal window.",
    },
    {
      type: "h3",
      text: "Three words worth learning early",
    },
    {
      type: "ul",
      items: [
        "Editor: where you write the file (VS Code, Notepad++, even Notepad in a pinch).",
        "Terminal (shell): where you run commands like `python hello.py`.",
        "Interpreter: the program that executes your Python instructions.",
      ],
    },
    {
      type: "code",
      title: "A first line (read it even if you cannot run it yet)",
      code: 'print("Hello from a tiny program")',
    },
    {
      type: "callout",
      variant: "note",
      text: "Install steps differ on Windows vs Mac vs Linux. If you are not ready to install anything, keep reading. The ideas still transfer, and you can return when you are ready.",
    },
    {
      type: "h2",
      text: "Python the language vs. “batteries included”",
    },
    {
      type: "p",
      text: "The language gives you building blocks: numbers, text, lists, functions, classes, modules. The standard library (ships with Python) adds practical tools: dates, file paths, JSON, and more. Third-party packages (installed separately) extend Python into web development, data analysis, automation, and games.",
    },
    {
      type: "practice",
      title: "Reality check (2 minutes)",
      steps: [
        "Name one real-life chore you wish a computer could help with (sorting files, reminders, budgeting).",
        "Guess whether that chore is mostly “math,” “text,” or “repetition.” You will map those guesses to Python features later.",
      ],
    },
  ],
};

const firstProgram: Lesson = {
  slug: "first-program",
  title: "Your first program",
  subtitle: "Print, run, edit, repeat. That is the whole craft in miniature",
  summary:
    "You will write a two-line script, run it, change it, and then intentionally break it. Breaking code on purpose removes the fear of errors: an error is just Python saying “I could not follow that sentence.”",
  objectives: [
    "Create a `.py` file and run it from a terminal",
    "Connect a SyntaxError message to a missing quote or typo",
  ],
  readingTimeMinutes: 12,
  tier: "foundational",
  practicePrompts: [
    "Change `Alex` to your own first name (keep the quotes). Run again.",
    "Add a second `print(...)` line that prints your favorite snack. Run again.",
  ],
  keyTakeaways: [
    "`print` shows output; it is the fastest way to check what your program “thinks.”",
    "Text inside quotes is a string; Python treats strings differently from plain words in code.",
    "Errors include clues: read the last line first, then look upward for the filename and line number.",
  ],
  sections: [
    {
      type: "h2",
      text: "Do this slowly (checklist)",
    },
    {
      type: "ol",
      items: [
        "Open a text editor and save an empty file as `hello.py` in your practice folder.",
        "Type the code below exactly, then save.",
        "Open a terminal in that same folder (or `cd` into it).",
        "Run `python hello.py` or `python3 hello.py` (use whichever works on your machine).",
      ],
    },
    {
      type: "code",
      title: "hello.py",
      code: 'name = "Alex"\nprint("Hello,", name)',
    },
    {
      type: "h2",
      text: "What each line is doing (plain English)",
    },
    {
      type: "ul",
      items: [
        "`name = \"Alex\"` stores the text `Alex` in a variable called `name` (a reusable label).",
        "`print(\"Hello,\", name)` prints two pieces separated by a space: the string `Hello,` and whatever is currently inside `name`.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      text: "If you get `python: command not found`, try `python3` instead, or install Python and reopen the terminal so your PATH updates.",
    },
    {
      type: "practice",
      title: "Micro-lab: make it yours",
      steps: [
        "Run the program once and confirm you see `Hello, Alex` (or similar).",
        "Change the string to your name and run again.",
        "Swap the comma inside print for a plus sign and observe what changes (we will explain why later).",
      ],
    },
    {
      type: "h2",
      text: "A deliberate mistake (highly recommended)",
    },
    {
      type: "p",
      text: "Remove the closing quote in `\"Alex\"` and run the file. Python will raise a `SyntaxError`. That looks scary, but it is helpful: the message points near where Python got confused.",
    },
    {
      type: "callout",
      variant: "note",
      text: "Professional programmers cause errors on purpose all the time (tests, refactors, experiments). Beginners should practice the same muscle: read the message, fix one thing, rerun.",
    },
  ],
};

const variablesAndNames: Lesson = {
  slug: "variables-and-names",
  title: "Variables and readable names",
  subtitle: "Turning “that number over there” into something you can reuse",
  summary:
    "Variables are labels for values. The moment you can name a value, you can reuse it, update it, and print it without copying the same literal all over your program.",
  objectives: [
    "Create variables with `=`",
    "Choose clearer names without spaces",
  ],
  readingTimeMinutes: 14,
  tier: "foundational",
  practicePrompts: [
    "Write `minutes = 25` and `seconds = minutes * 60`, then print `seconds`. Predict the output before you run.",
    "Rename `minutes` to `m` and notice how much harder the program is to read. Rename it back.",
  ],
  keyTakeaways: [
    "`=` in Python means “assign,” not “equal” like in algebra class.",
    "Readable names are a kindness to future-you; short cryptic names cost time later.",
    "Python cares about capitalization: `total` and `Total` are two different labels.",
  ],
  sections: [
    {
      type: "p",
      text: "Assignment uses a single equals sign: `price = 12`. That does not mean “price equals 12” in the algebraic sense; it means “from now on, in this part of the program, `price` refers to the value 12 until you assign something else to `price`”.",
    },
    {
      type: "h3",
      text: "How to picture a variable",
    },
    {
      type: "p",
      text: "In Python, a variable name is a label that refers to an object in memory. Assignment moves that label: `a = 1` then `a = 2` means the name `a` now refers to a different object, not that the integer 1 was edited in place.",
    },
    {
      type: "p",
      text: "Some people still imagine a name as a sticky note that you move from one value to another. That image helps for numbers and short strings, but it breaks down for mutable values: two names can refer to the same list, so a change through one name shows up through the other. When you reach lists and dicts, think \"names refer to objects\" first.",
    },
    {
      type: "code",
      title: "Everyday quantities",
      code: "coffee_cups = 2\nprice_per_cup = 4.50\ntotal = coffee_cups * price_per_cup\nprint(total)",
    },
    {
      type: "h2",
      text: "Rules beginners bump into",
    },
    {
      type: "ul",
      items: [
        "Names cannot contain spaces; use underscores like `coffee_cups`.",
        "Names should start with a letter or underscore; avoid starting with numbers.",
        "Python is case-sensitive: `Total` and `total` are different names.",
      ],
    },
    {
      type: "practice",
      title: "Lab: read the story in the names",
      steps: [
        "Run the coffee example as-is.",
        "Change `coffee_cups` to `3` and predict the new total before running.",
        "Rename `price_per_cup` to `p` (but keep behavior identical). Does the program feel easier or harder to understand?",
      ],
    },
    {
      type: "callout",
      variant: "note",
      text: "If you only remember one idea from this lesson, remember: assignment attaches a name to an object. The next lessons on lists and dicts show why that matters when objects can change.",
    },
  ],
};

export const modules: Module[] = [
  {
    id: "orientation",
    title: "Orientation",
    blurb: "How to learn here, what Python is, and how to run tiny programs.",
    lessons: [howToUseThisSite, whatIsPython, firstProgram],
  },
  {
    id: "foundations",
    title: "Foundations",
    blurb: "Variables, types, operators, and text: ideas you use in every script.",
    lessons: [
      variablesAndNames,
      lessonNumbersAndStrings,
      lessonInputAndOutput,
    ],
  },
  {
    id: "control-flow",
    title: "Control flow",
    blurb: "Decisions and repetition: the shape of real logic.",
    lessons: [
      lessonBooleansAndConditions,
      lessonIfElifElse,
      lessonWhileLoops,
      lessonForLoops,
    ],
  },
  {
    id: "data",
    title: "Data in memory",
    blurb:
      "Lists, tuples, dictionaries, and sets: ordered sequences, key lookups, and uniqueness. We use plain language, then tie it to how Python actually stores references.",
    lessons: [
      lessonLists,
      lessonTuples,
      lessonDictionaries,
      lessonSets,
    ],
  },
  {
    id: "functions-modules",
    title: "Functions and modules",
    blurb:
      "Define and call functions, return values correctly, understand scope (LEGB), import modules without surprises.",
    lessons: [lessonFunctionsBasics, lessonImports],
  },
  {
    id: "files-projects",
    title: "Files, errors, and small projects",
    blurb: "Move from snippets to trustworthy scripts.",
    lessons: [
      lessonReadingFiles,
      lessonErrorsAndDebugging,
      lessonMiniProjectIdeas,
    ],
  },
  {
    id: "object-oriented",
    title: "Object-oriented Python",
    blurb: "Classes, methods, and when objects earn their complexity.",
    lessons: [
      lessonClassesAndState,
      lessonMethodsAndDundersIntro,
      lessonInheritanceAndComposition,
    ],
  },
  {
    id: "modern-idioms",
    title: "Modern idioms",
    blurb: "Expressive loops, lazy pipelines, and hooks that read like sentences.",
    lessons: [
      lessonComprehensionsAndIteration,
      lessonGeneratorsAndLazyPipelines,
      lessonDecoratorsFirstContact,
    ],
  },
  {
    id: "types-contracts",
    title: "Types and contracts",
    blurb: "Annotations, protocols, and the mindset behind gradual typing.",
    lessons: [
      lessonTypeAnnotationsBasics,
      lessonProtocolsAndTyping,
      lessonGradualTypingTradeoffs,
    ],
  },
  {
    id: "packaging-quality",
    title: "Packaging and quality",
    blurb: "Environments, tests, and logs: the boring spine of reliable software.",
    lessons: [
      lessonVenvsAndDependencies,
      lessonTestingWithPytest,
      lessonLoggingAndObservability,
    ],
  },
  {
    id: "stdlib-depth",
    title: "Standard library depth",
    blurb: "Batteries included: paths, iteration helpers, and data classes done carefully.",
    lessons: [
      lessonPathlibWorkflows,
      lessonItertoolsFunctoolsPatterns,
      lessonDataclassesAndSlots,
    ],
  },
  {
    id: "expert-habits",
    title: "Expert habits",
    blurb: "Complexity science for practitioners: cost models, interfaces, and reading code like a pro.",
    lessons: [
      lessonBigOWithoutTerror,
      lessonDesigningCliTools,
      lessonReadingProfessionalCode,
    ],
  },
  {
    id: "science-research-methods",
    title: "Science and research methods",
    blurb:
      "Causal research design from variable definition to core identification strategies. Focus on high-quality reasoning for RCT, DiD, RDD, matching, and synthetic control.",
    lessons: [
      lessonCausalityAndVariablesFoundations,
      lessonRandomizedControlledTrialsInPractice,
      lessonDifferenceInDifferencesResearchDesign,
      lessonRegressionDiscontinuityForPolicy,
      lessonMatchingAndSyntheticControl,
    ],
  },
  {
    id: "econometrics-economics",
    title: "Econometrics and quantitative economics",
    blurb:
      "Method-first econometrics for applied work: variable definition, model specification, uncertainty choices, and causal interpretation discipline across time series and panel settings.",
    lessons: [
      lessonLinearModelsInferenceStatsmodels,
      lessonTimeSeriesAndPanelsIntro,
      lessonCausalQuestionsBeforePackages,
    ],
  },
  {
    id: "policy-evaluation",
    title: "Policy evaluation",
    blurb:
      "High-standard evaluation design and communication: estimands, identification assumptions, diagnostics, uncertainty, and policy-usable interpretation without overstating certainty.",
    lessons: [
      lessonPolicyEvaluationMethodology,
      lessonPolicyEvaluationWithPython,
      lessonPolicyEvaluationInterpretation,
    ],
  },
  {
    id: "machine-learning-practice",
    title: "Machine learning in practice",
    blurb:
      "Applied ML with methodological rigor: metric alignment to decisions, pipeline discipline, leakage control, calibration, and evaluation that mirrors deployment reality.",
    lessons: [
      lessonPredictionVsExplanationMindset,
      lessonScikitLearnPipelines,
      lessonMlEvaluationAndLeakage,
    ],
  },
  {
    id: "finance-quantitative",
    title: "Finance and quantitative analysis",
    blurb:
      "Quantitative finance methods with explicit assumptions: valuation logic, uncertainty simulation, and robust backtesting standards under realistic execution constraints.",
    lessons: [
      lessonCashflowsNpvAndScenarios,
      lessonMonteCarloForDecisions,
      lessonBacktestsAndOverfitting,
    ],
  },
  {
    id: "applied-ai",
    title: "AI systems in the real world",
    blurb:
      "Large models as tools, retrieval-shaped workflows, and safety habits around data.",
    lessons: [
      lessonLlmsAsToolsNotOracles,
      lessonEmbeddingsAndRetrievalSketch,
      lessonAiSafetyPrivacyAndData,
    ],
  },
  {
    id: "surveys-text-spatial",
    title: "Surveys, text, and spatial workflows",
    blurb:
      "Experiments and A/B tests, text as measurable data, and maps when geography matters.",
    lessons: [
      lessonExperimentsAndAbTesting,
      lessonTextAsDataIntro,
      lessonGeodataAndMapsIntro,
    ],
  },
];

const lessonIndex = new Map<string, Lesson>();
for (const mod of modules) {
  for (const lesson of mod.lessons) {
    lessonIndex.set(lesson.slug, lesson);
  }
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessonIndex.get(slug);
}

export function getAllLessons(): { module: Module; lesson: Lesson }[] {
  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ module, lesson })),
  );
}

export function getLessonContext(slug: string):
  | {
      module: Module;
      lesson: Lesson;
      lessonIndex1: number;
      totalLessons: number;
      lessonInModule1: number;
      lessonsInModule: number;
    }
  | undefined {
  const all = getAllLessons();
  const i = all.findIndex((x) => x.lesson.slug === slug);
  if (i < 0) return undefined;
  const { module, lesson } = all[i]!;
  const lessonInModule1 =
    module.lessons.findIndex((l) => l.slug === slug) + 1;
  return {
    module,
    lesson,
    lessonIndex1: i + 1,
    totalLessons: all.length,
    lessonInModule1,
    lessonsInModule: module.lessons.length,
  };
}
