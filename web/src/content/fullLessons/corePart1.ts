import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

export const lessonNumbersAndStrings: Lesson = {
  slug: "numbers-and-strings",
  title: "Numbers and strings",
  subtitle: "Foundational skills you will use in every script.",
  summary:
    "Most beginner bugs are type confusion: math on numbers, text in strings, and explicit conversion between them. Learn the operators and f-strings once, reuse forever.",
  tier: "foundational",
  readingTimeMinutes: 17,
  objectives: [
    "Predict results for `//`, `%`, and `**`",
    "Choose quotes, escapes, and f-strings without syntax surprises",
  ],
  practicePrompts: [
    "Compute `0.1 + 0.2` in a REPL. Read about `decimal.Decimal` in the docs and write one sentence on when you would switch.",
    "Build an f-string that prints `Item: {name}, price: $2.50` using a variable `name`.",
  ],
  keyTakeaways: [
    "`//` is floor division; `/` always returns float in Python 3.",
    "Floating point is binary: equality checks often need tolerance or `Decimal`.",
    "f-strings evaluate expressions inside `{...}`; use double braces `{{` for literal braces.",
    "`\"score: \" + 10` is an error; use `f\"score: {10}\"` or `\"score: \" + str(10)`.",
  ],
  sections: [
    ...ql(
      "Numbers do math; strings carry text; never silently mix them.",
      [
        "Operators: `/`, `//`, `%`, `**`",
        "Strings: quotes, escapes, multiline blocks",
        "f-strings for readable output",
      ],
    ),
    {
      type: "h2",
      text: "Integers and floats",
    },
    {
      type: "p",
      text: "Python distinguishes whole numbers (`int`) from numbers with fractional parts (`float`). Mixed arithmetic usually promotes to `float`.",
    },
    {
      type: "code",
      title: "Arithmetic you will use daily",
      code: `a = 7 // 3   # floor division -> 2\nb = 7 % 3    # remainder -> 1\nc = 2**10    # power -> 1024\nx = 9 / 2    # true division -> 4.5`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "Never rely on `==` between floats for money or science thresholds. Prefer `math.isclose`, integer cents, or `decimal.Decimal`.",
    },
    {
      type: "h2",
      text: "Strings: quotes, escapes, and multiline blocks",
    },
    {
      type: "p",
      text: "Single and double quotes both create strings. Use whichever avoids escaping the other inside the literal. Backslash escapes special characters.",
    },
    {
      type: "code",
      title: "Escapes and multiline strings",
      code: `path = "C:\\\\Users\\\\me\\\\data.csv"  # doubled backslashes\npoem = """Line one\nLine two"""           # triple quotes allow newlines`,
    },
    {
      type: "h2",
      text: "f-strings (formatted string literals)",
    },
    {
      type: "code",
      title: "Readable output",
      code: `name = "Dr. Chen"\nscore = 0.9375\nprint(f"{name}, AUC={score:.3f}")`,
    },
    {
      type: "callout",
      variant: "note",
      text: "If you see `TypeError: can only concatenate str (not \"int\") to str`, you glued text to a number. Convert with `str(x)` or use an f-string.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Assign `pi = 3.14159265` and print it rounded to four decimals inside an f-string.",
        "Create a string with an apostrophe inside using double quotes on the outside.",
      ],
    },
    check("Without running, what does `3 * \"ha\"` print, and why?"),
  ],
};

export const lessonInputAndOutput: Lesson = {
  slug: "input-and-output",
  title: "Input and output",
  subtitle: "Foundational skills you will use in every script.",
  summary:
    "Terminal programs read text with `input()`. Treat every response as a string until you parse it; handle bad input at the boundary so the rest of your code stays clean.",
  tier: "foundational",
  readingTimeMinutes: 15,
  objectives: [
    "Read text with `input()` and convert with `int()` / `float()` safely",
    "Format terminal output with f-strings or `str.format`",
  ],
  practicePrompts: [
    "Wrap a `float(input(...))` call in try/except for `ValueError` and print a friendly message.",
    "Print a small table using f-strings with fixed width fields (`:>8`).",
  ],
  keyTakeaways: [
    "`input` always returns `str`. Conversion failures raise `ValueError`.",
    "For real CLI tools, `argparse` scales better than many `input()` prompts.",
    "Printing for humans and logging for machines are different jobs.",
  ],
  sections: [
    ...ql(
      "`input()` returns text; convert with `int()`/`float()` and catch `ValueError` at the edge.",
      [
        "Read a line and strip stray spaces",
        "Parse numbers safely",
        "Print formatted answers",
      ],
    ),
    {
      type: "h2",
      text: "Reading one line",
    },
    {
      type: "code",
      title: "Minimal prompt",
      code: `name = input("Your name: ").strip()\nprint(f"Hello, {name}")`,
    },
    {
      type: "h2",
      text: "Converting to numbers",
    },
    {
      type: "code",
      title: "Guarded conversion",
      code: `raw = input("Enter a positive integer: ").strip()\ntry:\n    n = int(raw)\nexcept ValueError:\n    raise SystemExit("That was not an integer.") from None\nprint("Twice:", n * 2)`,
    },
    {
      type: "callout",
      variant: "tip",
      text: "`.strip()` removes accidental spaces so `\" 42 \"` still converts cleanly.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Ask for two integers and print their sum, with error handling if either parse fails.",
      ],
    },
    check("Why is `if age:` a bad way to validate age typed from `input()` when `0` is a valid age?"),
  ],
};

export const lessonBooleansAndConditions: Lesson = {
  slug: "booleans-and-conditions",
  title: "Booleans and conditions",
  subtitle: "Foundational skills you will use in every script.",
  summary:
    "Conditions drive every program: comparisons yield `True`/`False`, and `and`/`or` short-circuit. Learn truthiness once so `if` reads like plain English.",
  tier: "foundational",
  readingTimeMinutes: 15,
  objectives: [
    "Combine comparisons with `and`, `or`, and `not` predictably",
    "Avoid `== True` noise; use truthiness on purpose",
  ],
  practicePrompts: [
    "Predict the value of `0 and 5` and `[] or [1]` before you run it.",
    "Write a condition `age_ok` that is true when `age` is between 18 and 65 inclusive.",
  ],
  keyTakeaways: [
    "`and` returns the first falsy operand, else the last. `or` returns the first truthy operand, else the last.",
    "Chained comparisons like `0 < x < 10` are both readable and correct.",
    "Use `is` / `is not` only with `None` and singletons, not for value equality.",
  ],
  sections: [
    ...ql(
      "Booleans answer yes/no; comparisons and `and`/`or` combine those answers safely.",
      [
        "Compare values with `<`, `==`, etc.",
        "Use truthiness in `if` without clutter",
        "Know when `is None` beats a bare `if x`",
      ],
    ),
    {
      type: "h2",
      text: "Comparisons",
    },
    {
      type: "code",
      title: "Chained comparisons",
      code: `x = 4\nprint(0 < x < 10)      # True\nprint(1 < x < 3)       # False`,
    },
    {
      type: "h2",
      text: "Truthiness",
    },
    {
      type: "ul",
      items: [
        "Falsy: `None`, `0`, `0.0`, empty containers (`\"\"`, `[]`, `{}`, `set()`).",
        "Everything else is truthy in Boolean context (`if`, `while`, `bool(...)`).",
      ],
    },
    {
      type: "callout",
      variant: "note",
      text: "`if value:` is idiomatic when `value` may be `None` or empty. Prefer explicit `is None` when `0` or `[]` are valid states you must distinguish.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Set `a = 10`, `b = 0`. Print `a / b` only when `b != 0`, else print `undefined`.",
      ],
    },
    check("Why is `if x == True` usually worse than `if x` when `x` is already boolean?"),
  ],
};

export const lessonIfElifElse: Lesson = {
  slug: "if-elif-else",
  title: "if / elif / else",
  subtitle: "Foundational skills you will use in every script.",
  summary:
    "Branches pick one path. Python runs the first true branch and skips the rest. Put invalid cases first so the happy path stays flat and readable.",
  tier: "foundational",
  readingTimeMinutes: 16,
  objectives: [
    "Order `elif` chains from most specific to most general",
    "Recognize when a lookup dict is clearer than a long `if` ladder",
  ],
  practicePrompts: [
    "Convert a three-branch `if/elif/else` on a single variable into a `dict` lookup plus `.get` for the default branch.",
  ],
  keyTakeaways: [
    "Python uses indentation, not braces, to define blocks. Keep block depth shallow.",
    "Match / case (Python 3.10+) can clarify category-style branching when patterns are simple.",
  ],
  sections: [
    ...ql(
      "`if` / `elif` / `else` mean: first match wins; validate bad input before the happy path.",
      [
        "Read a branching example end to end",
        "Guard invalid values first",
        "Practice with `input` and a dict lookup variant",
      ],
    ),
    {
      type: "code",
      title: "Classic grading example",
      code: `score = 88\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\nprint(grade)`,
    },
    {
      type: "h2",
      text: "Guarding invalid input first",
    },
    {
      type: "p",
      text: "Handle edge cases at the top (`if score < 0 or score > 100: ...`) so the happy path stays unindented and easy to read.",
    },
    {
      type: "callout",
      variant: "warn",
      text: "Overlapping ranges (two `if` branches that could both be true) are a common bug; use `if` / `elif` so only one runs.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Before the `if` chain, set `score` from `input` and validate it is between 0 and 100, printing an error and exiting if not.",
      ],
    },
    check("When is a `dict` mapping codes to labels clearer than five `elif` lines?"),
  ],
};
