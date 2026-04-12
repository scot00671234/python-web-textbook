import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subFound = "Foundational skills you will use in every script.";

export const lessonReadingFiles: Lesson = {
  slug: "reading-files",
  title: "Reading and writing files",
  subtitle: subFound,
  summary:
    "Files are bytes on disk; text mode decodes to strings. Always pick encoding explicitly for text, and use `with` so handles close on errors.",
  tier: "foundational",
  readingTimeMinutes: 17,
  objectives: [
    "Read and write text files line by line and whole-file",
    "Explain why `encoding=\"utf-8\"` should appear in cross-platform scripts",
  ],
  practicePrompts: [
    "Copy a text file while skipping blank lines using a `with` block for both files.",
  ],
  keyTakeaways: [
    "`Path.read_text` / `write_text` (pathlib) are ergonomic for small files.",
    "Binary mode (`\"rb\"`) is for bytes; do not decode JPEGs as UTF-8.",
  ],
  sections: [
    ...ql(
      "Text files need an encoding; `with` guarantees close; big files stream line by line.",
      [
        "Read a whole small file with pathlib",
        "Stream a large file safely",
        "Practice parsing simple lines",
      ],
    ),
    {
      type: "code",
      title: "Classic text read",
      code: `from pathlib import Path\n\np = Path("notes.txt")\ntext = p.read_text(encoding="utf-8")\nlines = text.splitlines()\nprint(len(lines), "lines")`,
    },
    {
      type: "h2",
      text: "Large files",
    },
    {
      type: "p",
      text: "For huge logs, iterate the file object: memory stays bounded because you process one line at a time.",
    },
    {
      type: "code",
      title: "Line iteration",
      code: `with open("big.log", encoding="utf-8", errors="replace") as f:\n    for line in f:\n        if "ERROR" in line:\n            print(line.rstrip())`,
    },
    {
      type: "callout",
      variant: "note",
      text: "`errors=\"replace\"` avoids crashes on rare mojibake, but audit whether you should fail fast instead for scientific pipelines.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Write a CSV-free version: read `rows.txt` where each line is `name,score` and print the highest score.",
      ],
    },
    check("Why is reading an entire multi-gigabyte log with `read_text()` a bad idea?"),
  ],
};

export const lessonErrorsAndDebugging: Lesson = {
  slug: "errors-and-debugging",
  title: "Errors and debugging",
  subtitle: subFound,
  summary:
    "Exceptions are signals, not personal failures. Read the traceback, shrink the repro, fix one thing, rerun. Narrow `except` clauses so real bugs surface.",
  tier: "foundational",
  readingTimeMinutes: 17,
  objectives: [
    "Map common exceptions (`TypeError`, `ValueError`, `KeyError`) to typical causes",
    "Use try/except narrowly, then re-raise or wrap when appropriate",
  ],
  practicePrompts: [
    "Trigger a `KeyError` on purpose, catch it, print a friendly message, and use `raise ... from e` to chain exceptions.",
  ],
  keyTakeaways: [
    "Bare `except:` hides bugs. Catch specific types first.",
    "`assert` is for developer checks, not user validation (can be disabled with `-O`).",
  ],
  sections: [
    ...ql(
      "Errors point to lines; exceptions have types; catch narrowly; chain with `from` to keep context.",
      [
        "Traceback reading order",
        "Targeted try/except",
        "Three-step debug checklist",
      ],
    ),
    {
      type: "h2",
      text: "Traceback anatomy",
    },
    {
      type: "ul",
      items: [
        "Last line names the exception type and message.",
        "Above it, the stack lists newest frames last in CPython's default print order (read upward for cause).",
      ],
    },
    {
      type: "code",
      title: "Targeted handling",
      code: `def parse_int(s: str) -> int:\n    try:\n        return int(s)\n    except ValueError as e:\n        raise ValueError(f"not an int: {s!r}") from e`,
    },
    {
      type: "h2",
      text: "Debugging checklist",
    },
    {
      type: "ol",
      items: [
        "Can you reproduce in five lines or fewer?",
        "What changed since it last worked?",
        "Print types: `print(type(x), x)` before the line that fails.",
      ],
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Run `python -m pdb your_script.py` once, set a breakpoint with `b 5`, continue with `c`, and inspect a variable with `p name`.",
      ],
    },
    check("When should you re-raise the same exception versus wrap it in a new type?"),
  ],
};

export const lessonMiniProjectIdeas: Lesson = {
  slug: "mini-project-ideas",
  title: "Mini-project ideas",
  subtitle: subFound,
  summary:
    "Ship a tiny vertical slice: input, logic, file output. Success is a working loop you can demo in two minutes, not a polished product.",
  tier: "foundational",
  readingTimeMinutes: 13,
  objectives: [
    "Pick one project and define a one-sentence success criterion",
    "Ship a v1 that runs end-to-end, then iterate",
  ],
  practicePrompts: [
    "Implement the expense tracker: append lines `YYYY-MM-DD,amount,note` to `expenses.txt` and print month totals.",
  ],
  keyTakeaways: [
    "Readable file formats beat clever databases until you feel pain.",
    "Automate something you already do by hand weekly.",
  ],
  sections: [
    ...ql(
      "Pick one idea, define done in one sentence, build the smallest loop that hits it tonight.",
      [
        "Expense tracker shape",
        "Flashcard flow",
        "Stretch ideas when basics feel easy",
      ],
    ),
    {
      type: "h2",
      text: "Expense tracker (text file)",
    },
    {
      type: "p",
      text: "Loop: prompt amount and note, append CSV-like line, print running total for today. Add `list` command to show last ten lines.",
    },
    {
      type: "h2",
      text: "Terminal flashcards",
    },
    {
      type: "p",
      text: "Store `front|back` pairs. Randomize. Track correct streak. Save weak cards to `review.txt`.",
    },
    {
      type: "h2",
      text: "Stretch goals",
    },
    {
      type: "ul",
      items: [
        "Add simple tests with `assert` functions.",
        "Refactor repeated logic into functions once patterns repeat.",
        "Package data paths with `pathlib` and a `--data-dir` flag later when you learn `argparse`.",
      ],
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Choose one idea. Spend 25 minutes building the smallest runnable slice, then write what you would do next.",
      ],
    },
    check("What is your one-sentence definition of done for the slice you picked?"),
  ],
};
