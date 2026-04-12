import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subFound = "Foundational skills you will use in every script.";

export const lessonWhileLoops: Lesson = {
  slug: "while-loops",
  title: "while loops",
  subtitle: subFound,
  summary:
    "Use `while` when you repeat until a condition flips: read input until \"quit\", drain a buffer, or retry until success. Always move state toward exit inside the loop.",
  tier: "foundational",
  readingTimeMinutes: 15,
  objectives: [
    "Write a correct `while` loop with an explicit update step",
    "Choose `while` vs `for` when the iteration count is unknown up front",
  ],
  practicePrompts: [
    "Write a loop that reads numbers until the user types `done`, then prints the sum.",
  ],
  keyTakeaways: [
    "`while True:` with a `break` is common for menu-driven programs.",
    "Off-by-one mistakes often live in loop updates; trace `i` on paper once.",
    "If nothing inside the loop can change the condition, you have an infinite loop.",
  ],
  sections: [
    ...ql(
      "`while` means: keep going until this condition becomes false; update something each pass.",
      [
        "Read a countdown pattern",
        "See the sentinel pattern for user input",
        "Practice with randomness",
      ],
    ),
    {
      type: "code",
      title: "Count down",
      code: `n = 3\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("go")`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "If the condition never becomes false, you have an infinite loop. In the REPL, interrupt with Ctrl+C (Windows/Linux/macOS terminal).",
    },
    {
      type: "h2",
      text: "Sentinel pattern",
    },
    {
      type: "p",
      text: "Read inputs until a special value appears. Always normalize with `.strip().lower()` if you accept text commands.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Simulate rolling a die with `random.randint` until two sixes appear in a row (import `random`).",
      ],
    },
    check("Why is `while n:` risky if `n` might become negative when you meant to stop at zero?"),
  ],
};

export const lessonForLoops: Lesson = {
  slug: "for-loops",
  title: "for loops and iterables",
  subtitle: subFound,
  summary:
    "`for` is the default loop: it walks an iterable in order. Master `range`, `enumerate`, and `zip` once; they appear in almost every script.",
  tier: "foundational",
  readingTimeMinutes: 17,
  objectives: [
    "Use `range` with one, two, or three arguments correctly",
    "Iterate characters and list slices without mutating while you walk",
  ],
  practicePrompts: [
    "Use `enumerate` on a list of words and print `index: word` for each item.",
  ],
  keyTakeaways: [
    "`range(stop)` starts at 0 and excludes `stop`.",
    "Never modify a list while iterating forward over it; build a new list or iterate a copy.",
  ],
  sections: [
    ...ql(
      "`for x in thing` runs the body once per item; no manual index math unless you want it.",
      [
        "Loop over characters and `range`",
        "Use `enumerate` and `zip` patterns",
        "Practice accumulator style sums",
      ],
    ),
    {
      type: "code",
      title: "Basics",
      code: `for ch in "abc":\n    print(ch.upper())\n\nfor i in range(3, 8, 2):\n    print(i)  # 3, 5, 7`,
    },
    {
      type: "h2",
      text: "Common patterns",
    },
    {
      type: "ul",
      items: [
        "`for i, value in enumerate(items):` when you need the index.",
        "`for a, b in zip(xs, ys):` when two sequences advance together.",
        "`sum(x * x for x in nums)` uses a generator expression without building a list.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      text: "Prefer `for` over `while` with a manual counter unless the stop rule is genuinely messy.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Given `nums = [3, 1, 4, 1, 5]`, print the running total after each element using a `for` loop and an accumulator variable.",
      ],
    },
    check("What does `list(range(3))` produce, and why is the last value not `3`?"),
  ],
};

export const lessonLists: Lesson = {
  slug: "lists",
  title: "Lists",
  subtitle: subFound,
  summary:
    "Lists are ordered, mutable bags. Index from zero, slice with half-open ranges, and remember assignment never copies unless you ask for a copy.",
  tier: "foundational",
  readingTimeMinutes: 17,
  objectives: [
    "Index, slice, and copy lists without accidental shared mutation",
    "Use `append`, `extend`, and list comprehensions appropriately",
  ],
  practicePrompts: [
    "Show why `b = a` then `b.append(1)` mutates `a`. Fix with `b = a.copy()` or `b = list(a)`.",
  ],
  keyTakeaways: [
    "`lst[-1]` is the last element; `lst[:-1]` is all but the last.",
    "`extend` adds each element of another iterable; `append` adds one object (possibly a list as a single item).",
  ],
  sections: [
    ...ql(
      "Lists keep order and allow in-place edits; slicing returns new lists; assignment aliases the same list.",
      [
        "Index and slice confidently",
        "List comprehensions for map/filter shapes",
        "Ordered dedupe lab",
      ],
    ),
    {
      type: "code",
      title: "Indexing and slicing",
      code: `items = [10, 20, 30, 40]\nprint(items[1:3])   # [20, 30] (stop exclusive)\nprint(items[::-1])  # reversed shallow copy`,
    },
    {
      type: "h2",
      text: "List comprehension (readability first)",
    },
    {
      type: "code",
      title: "Square positives",
      code: `nums = [-2, 3, -1, 4]\nsquares = [n * n for n in nums if n > 0]\nprint(squares)`,
    },
    {
      type: "callout",
      variant: "tip",
      text: "If the comprehension needs many clauses, switch to a plain `for` loop so readers can follow.",
    },
    {
      type: "callout",
      variant: "warn",
      text: "`items = items.sort()` is wrong: `list.sort` sorts in place and returns `None`. Use `items.sort()` or `sorted_items = sorted(items)`.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Remove duplicates from a list while preserving order (hint: track `seen` as a set).",
      ],
    },
    check("After `a = [1,2]` and `b = a`, what is `b is a`? Why does that matter when you mutate?"),
  ],
};

export const lessonTuples: Lesson = {
  slug: "tuples",
  title: "Tuples",
  subtitle: subFound,
  summary:
    "Tuples bundle a fixed number of fields without surprise mutation. They are dict keys when lists are not, and they return multiple values cleanly.",
  tier: "foundational",
  readingTimeMinutes: 13,
  objectives: [
    "Unpack tuples into variables and in `for` loops",
    "Explain why immutability helps when data must be hashable",
  ],
  practicePrompts: [
    "Return `(quotient, remainder)` from a small division helper using `divmod` internally.",
  ],
  keyTakeaways: [
    "One-item tuples need a trailing comma: `(42,)`.",
    "Named tuples (`collections.namedtuple` or `typing.NamedTuple`) document fields without a full class.",
  ],
  sections: [
    ...ql(
      "Tuples are lightweight records: order matters, contents should stay stable for hashing.",
      [
        "Unpacking into variables",
        "Mutability vs inner lists",
        "Short lab on references",
      ],
    ),
    {
      type: "code",
      title: "Unpacking",
      code: `point = (3, 4)\nx, y = point\nprint(x + y)`,
    },
    {
      type: "h2",
      text: "Immutability in plain language",
    },
    {
      type: "p",
      text: "You cannot change a tuple in place, but mutable objects inside a tuple can still change (for example a list member). The tuple holds references.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Create `t = ([1, 2],)` then append `3` to the inner list. Print `t` and explain why the tuple \"changed\".",
      ],
    },
    check("Why can `{(1, 2)}` be a set of tuples but `{[1, 2]}` is illegal?"),
  ],
};
