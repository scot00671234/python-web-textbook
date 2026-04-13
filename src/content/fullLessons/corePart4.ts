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
    "Build one small project that solves a real weekly task. Focus on an end-to-end loop you can run and explain, then improve it in short iterations.",
  tier: "foundational",
  readingTimeMinutes: 13,
  objectives: [
    "Pick one practical project with a clear user and use case",
    "Ship a v1 that works end-to-end with simple file storage",
  ],
  practicePrompts: [
    "Choose one project below and write a one-sentence definition of done before coding.",
  ],
  keyTakeaways: [
    "A small working tool teaches more than a large unfinished plan.",
    "Clear inputs and outputs matter more than advanced architecture at this stage.",
    "Real-world examples become easy when your project mirrors a task you already do.",
  ],
  sections: [
    ...ql(
      "Start with one user problem, then build the smallest script that handles it from input to output.",
      [
        "Choose a project that gives value this week",
        "Design the first version around a simple loop",
        "Add careful improvements only after v1 works",
      ],
    ),
    {
      type: "p",
      text: "A mini-project is not a toy if it solves a real problem. If you repeatedly rename files, track spending, or summarize survey notes, you already have valid project ideas. Keep version one small: one command, one file format, one useful output.",
    },
    {
      type: "h2",
      text: "Project 1: Expense tracker for monthly budgeting",
    },
    {
      type: "p",
      text: "Use case: a student or freelancer wants a fast daily spending log. Start by appending lines like `2026-04-13,12.50,lunch` to `expenses.txt`, then compute totals by month. This teaches input handling, file writes, and grouping logic.",
    },
    {
      type: "code",
      title: "Small slice of an expense tracker",
      code: `from datetime import date

amount = float(input("Amount: "))
note = input("Note: ").strip()
row = f"{date.today().isoformat()},{amount:.2f},{note}\\n"

with open("expenses.txt", "a", encoding="utf-8") as f:
    f.write(row)

print("Saved:", row.strip())`,
    },
    {
      type: "h2",
      text: "Project 2: Study flashcards from your own weak topics",
    },
    {
      type: "p",
      text: "Use case: exam revision where weak topics change each week. Store pairs like `front|back`, quiz yourself in random order, and record missed cards in `review.txt`. This teaches loops, randomization, and simple progress tracking.",
    },
    {
      type: "h2",
      text: "Project 3: Policy memo helper for research teams",
    },
    {
      type: "p",
      text: "Use case: you repeatedly draft policy notes from model output. Write a script that takes effect size, confidence interval, and unit, then generates two plain-English sentences. This is useful in economics and public policy workflows and reinforces string formatting and function design.",
    },
    {
      type: "h2",
      text: "How to decide what to build first",
    },
    {
      type: "ol",
      items: [
        "Pick the project with the clearest real user, often you.",
        "Define one sentence for success, for example: `I can log one expense and print this month's total.`",
        "Implement only what is needed for that sentence.",
        "Test with real inputs, not only ideal fake examples.",
      ],
    },
    {
      type: "h2",
      text: "Good stretch goals after version one",
    },
    {
      type: "ul",
      items: [
        "Add two or three tiny tests for your core function outputs.",
        "Refactor repeated lines into helper functions with clear names.",
        "Add simple validation and friendly error messages for bad input.",
      ],
    },
    {
      type: "practice",
      title: "Lab: ship one useful v1",
      steps: [
        "Choose one project and start a timer for 30 minutes.",
        "Build the smallest end-to-end version that truly runs.",
        "Write three bullet points: what works, what broke, and what to improve next.",
      ],
    },
    check("Can another person run your script and describe its value in one sentence?"),
  ],
};
