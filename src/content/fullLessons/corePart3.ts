import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subFound = "Foundational skills you will use in every script.";

export const lessonDictionaries: Lesson = {
  slug: "dictionaries",
  title: "Dictionaries",
  subtitle: subFound,
  summary:
    "Dicts map keys to values in average constant time. Reach for `.get` when a key might be missing, and iterate `.items()` when you need both sides.",
  tier: "foundational",
  readingTimeMinutes: 17,
  objectives: [
    "Use `.get`, `.setdefault`, and `collections.Counter` appropriately",
    "Iterate keys, values, and items without redundant lookups",
  ],
  practicePrompts: [
    "Count word frequencies in a short string (split on spaces, lowercase, strip punctuation roughly).",
  ],
  keyTakeaways: [
    "Insertion order is preserved in Python 3.7+ dicts (CPython 3.6+). Do not rely on sort unless you sort explicitly.",
    "Keys must be immutable (or otherwise hashable).",
    "`d[k]` raises `KeyError` if missing; `.get(k, default)` does not.",
  ],
  sections: [
    ...ql(
      "Dicts answer: given a key, what value belongs to it? Prefer `.get` when absence is normal.",
      [
        "Literal syntax and `.get`",
        "Counting pattern with a frequency dict",
        "Invert/group lab",
      ],
    ),
    {
      type: "code",
      title: "Basics",
      code: `scores = {"Ada": 99, "Lin": 88}\nscores["Lin"] = 90\nprint(scores.get("Sam", 0))`,
    },
    {
      type: "h2",
      text: "Counting pattern",
    },
    {
      type: "code",
      title: "Frequency dict",
      code: `counts = {}\nfor word in ["a", "b", "a"]:\n    counts[word] = counts.get(word, 0) + 1\nprint(counts)`,
    },
    {
      type: "callout",
      variant: "note",
      text: "`collections.Counter` wraps the same idea with nicer helpers like `most_common`.",
    },
    {
      type: "callout",
      variant: "warn",
      text: "Default dict values with `d.setdefault` when you want to mutate nested structures; otherwise `.get` keeps surprises smaller.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Invert a dict: map each value to the list of keys that had that value (assume values may repeat).",
      ],
    },
    check("Why does looping `for k in d:` sometimes cost extra work if you also need values? What should you loop over instead?"),
  ],
};

export const lessonSets: Lesson = {
  slug: "sets",
  title: "Sets",
  subtitle: subFound,
  summary:
    "Sets store unique items and answer membership fast. Use them for dedupe, uniqueness constraints, and quick overlap checks between groups.",
  tier: "foundational",
  readingTimeMinutes: 13,
  objectives: [
    "Use set literals and comprehensions",
    "Choose set vs list when duplicates and order do not matter",
  ],
  practicePrompts: [
    "Given two lists of user ids, print how many unique users visited either list.",
  ],
  keyTakeaways: [
    "Set membership is average O(1); list membership is O(n).",
    "Empty set is `set()`, not `{}` (that is an empty dict).",
  ],
  sections: [
    ...ql(
      "Sets = unique unordered values + fast membership + set algebra operators.",
      [
        "Union / intersection / difference in code",
        "When to pick set over list",
        "Tiny lab",
      ],
    ),
    {
      type: "code",
      title: "Operations",
      code: `a = {1, 2, 3}\nb = {3, 4, 5}\nprint(a | b)   # union\nprint(a & b)   # intersection\nprint(a - b)   # difference`,
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Find characters that appear in both strings `s1` and `s2` using set intersection.",
      ],
    },
    check("Why is `{{1,2}}` invalid while `{1,2}` is fine?"),
  ],
};

export const lessonFunctionsBasics: Lesson = {
  slug: "functions-basics",
  title: "Functions: the basics",
  subtitle: subFound,
  summary:
    "Functions bundle a name, parameters, and a return path. They are how you stop repeating yourself and how you test logic in isolation.",
  tier: "foundational",
  readingTimeMinutes: 19,
  objectives: [
    "Define functions with parameters, defaults, and docstrings",
    "Avoid mutable default arguments (`def f(x=[]):` is a classic bug)",
  ],
  practicePrompts: [
    "Write `clamp(x, lo, hi)` that returns `x` forced into `[lo, hi]`.",
  ],
  keyTakeaways: [
    "Use `None` as a sentinel default, then assign `items = items if items is not None else []` (or `or []` only when empty list is acceptable).",
    "Keyword arguments improve readability at call sites: `save(path, overwrite=True)`.",
  ],
  sections: [
    ...ql(
      "A function names a chunk of work; call it with arguments; `return` hands a value back.",
      [
        "Define and call a small function",
        "Learn the mutable-default trap",
        "Scope in one paragraph",
      ],
    ),
    {
      type: "code",
      title: "Definition and call",
      code: `def area_rectangle(width: float, height: float) -> float:\n    """Return area in square units."""\n    return width * height\n\nprint(area_rectangle(3, 4))`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "Mutable defaults are shared across calls. Prefer `def append_item(item, bucket=None): bucket = [] if bucket is None else bucket`.",
    },
    {
      type: "h2",
      text: "Scope (intro)",
    },
    {
      type: "p",
      text: "Assignment inside a function creates a local name unless declared `global` or `nonlocal`. Reading a name searches outward through enclosing scopes.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Write `median_of_three(a, b, c)` without sorting the whole world (nested comparisons or small sort of three items both count).",
      ],
    },
    check("What happens if you forget `return` inside a function that should produce a value?"),
  ],
};

export const lessonImports: Lesson = {
  slug: "imports",
  title: "Imports and standard library",
  subtitle: subFound,
  summary:
    "Imports wire files together. Prefer explicit names over star-imports, and learn `if __name__ == \"__main__\"` so utilities stay import-safe.",
  tier: "foundational",
  readingTimeMinutes: 15,
  objectives: [
    "Read `help()` and online docs for a stdlib module quickly",
    "Avoid `from module import *` in real projects",
  ],
  practicePrompts: [
    "Import `math` and print `math.hypot(3, 4)`. Then import only `sqrt` with a `from` form.",
  ],
  keyTakeaways: [
    "`if __name__ == \"__main__\":` lets a file be both importable library and runnable script.",
    "Relative imports (`from .pkg import x`) apply inside packages, not loose scripts.",
  ],
  sections: [
    ...ql(
      "`import` loads a module object; `from ... import` binds one name; both are cached after first import.",
      [
        "Compare import styles",
        "Understand `sys.path` shadowing",
        "Call stdlib `datetime` once",
      ],
    ),
    {
      type: "code",
      title: "Common styles",
      code: `import json\nfrom pathlib import Path\n\ndata = {"ok": True}\nprint(json.dumps(data))`,
    },
    {
      type: "h2",
      text: "Where Python looks for modules",
    },
    {
      type: "p",
      text: "The import system searches `sys.path`: the script directory, entries from `PYTHONPATH`, and standard library paths. Name your files so they do not shadow stdlib (`json.py` in your folder will break `import json`).",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Use `datetime.date.today()` to print today's ISO date string (`isoformat()`).",
      ],
    },
    check("Why does `from math import *` make code harder to grep and refactor?"),
  ],
};
