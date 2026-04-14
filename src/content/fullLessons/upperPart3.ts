import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "";
const subAdv = "";

export const lessonPathlibWorkflows: Lesson = {
  slug: "pathlib-workflows",
  title: "pathlib workflows",
  subtitle: subInt,
  summary:
    "`Path` objects compose with `/`, hide OS path quirks, and read text or bytes without manual string juggling.",
  tier: "intermediate",
  readingTimeMinutes: 15,
  objectives: [
    "Join paths portably and glob files recursively",
    "Choose `Path` vs `os.path` when onboarding teammates",
  ],
  practicePrompts: [
    "List all `*.csv` under `./data` using `Path(\"data\").rglob(\"*.csv\")`.",
  ],
  keyTakeaways: [
    "`Path.resolve()` canonicalizes; `Path.cwd()` answers \"where am I\".",
    "Text vs bytes: pick `read_text` or `read_bytes` deliberately.",
    "Path objects clarify intent by separating path logic from string manipulation.",
  ],
  sections: [
    ...ql(
      "`Path` is the modern way to point at files: join with `/`, glob, read, write.",
      [
        "Join and read small files",
        "Walk trees with `rglob`",
        "Check mtimes in a lab",
      ],
    ),
    {
      type: "code",
      title: "Join and read",
      code: `from pathlib import Path\n\nroot = Path("project") / "configs"\ncfg = root / "app.toml"\nprint(cfg.exists(), cfg.read_text(encoding="utf-8")[:40])`,
    },
    {
      type: "h2",
      text: "Walking trees",
    },
    {
      type: "code",
      title: "rglob",
      code: `for py in Path("src").rglob("*.py"):\n    if "test" in py.name:\n        print(py)`,
    },
    {
      type: "p",
      text: "A practical advantage of `pathlib` is conceptual consistency. Joining, checking, iterating, and metadata queries all happen through one object model. This reduces subtle bugs from manual slash handling or mixed absolute and relative string paths.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Absolute path: full location from filesystem root.",
        "Relative path: location interpreted from current working directory.",
        "Glob pattern: wildcard path rule such as `*.csv`.",
        "Metadata: file properties such as size, modification time, and permissions.",
      ],
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Write `newer_than(path, seconds)` returning whether mtime is within the last `seconds` using `path.stat().st_mtime`.",
      ],
    },
    check("Why is `Path(\"a\") / \"b\"` nicer than string concatenation with slashes?"),
  ],
};

export const lessonItertoolsFunctoolsPatterns: Lesson = {
  slug: "itertools-functools-patterns",
  title: "itertools and functools patterns",
  subtitle: subAdv,
  summary:
    "`itertools` standardizes iterator patterns (grouping, windows, products). `functools.partial` bakes in repeated arguments without wrapping everything in lambdas.",
  tier: "advanced",
  readingTimeMinutes: 17,
  objectives: [
    "Use `groupby` correctly (input must already be sorted on the key)",
    "Apply `partial` to reduce repetition without hiding required args",
  ],
  practicePrompts: [
    "Group sorted log lines by hour prefix using `itertools.groupby`.",
  ],
  keyTakeaways: [
    "`pairwise` (3.10+) simplifies sliding windows; older code used `zip(xs, xs[1:])`.",
    "`@functools.cache` memoizes pure functions; watch memory on large domains.",
  ],
  sections: [
    ...ql(
      "`groupby` groups only consecutive keys; `partial` fixes the first arguments of a callable.",
      [
        "See `groupby` on sorted rows",
        "Freeze an argument with `partial`",
        "Build a cumulative sum",
      ],
    ),
    {
      type: "code",
      title: "groupby",
      code: `from itertools import groupby\n\nrows = [(\"east\", 1), (\"east\", 2), (\"west\", 3)]\nfor key, group in groupby(rows, key=lambda r: r[0]):\n    print(key, list(group))`,
    },
    {
      type: "h2",
      text: "partial",
    },
    {
      type: "code",
      title: "Freeze a parameter",
      code: `from functools import partial\n\nexp_of_ten = partial(pow, 10)  # first arg to pow fixed\nprint(exp_of_ten(3))  # 10**3 == 1000`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "`groupby` only groups consecutive keys. Sort first: `sorted(rows, key=...)`.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Use `itertools.accumulate` on a list of daily returns to build an equity curve.",
      ],
    },
    check("What goes wrong if you call `groupby` on rows sorted by time but group by user id?"),
  ],
};

export const lessonDataclassesAndSlots: Lesson = {
  slug: "dataclasses-and-slots",
  title: "dataclasses and `__slots__`",
  subtitle: subInt,
  summary:
    "Dataclasses generate boring methods for record types. Slots trade flexibility for a smaller per-instance footprint when you truly have masses of objects.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Configure `dataclass` frozen models and defaults safely",
    "Explain tradeoffs of slots vs dict-backed instances",
  ],
  practicePrompts: [
    "Create a frozen `Point` dataclass and try to mutate an attribute; observe `FrozenInstanceError`.",
  ],
  keyTakeaways: [
    "Mutable defaults still need `field(default_factory=list)`.",
    "Slots break arbitrary attribute assignment (usually good) and complicate multiple inheritance (be careful).",
  ],
  sections: [
    ...ql(
      "Dataclasses save you hand-written `__init__`/`__repr__`; slots tighten memory when profiling says you must.",
      [
        "Frozen point example",
        "Slots sketch",
        "Compare to `NamedTuple`",
      ],
    ),
    {
      type: "code",
      title: "Dataclass",
      code: `from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: float\n    y: float\n\n    def translate(self, dx: float, dy: float) -> \"Point\":\n        return Point(self.x + dx, self.y + dy)\n\np = Point(1, 2)\nprint(p.translate(3, 4))`,
    },
    {
      type: "h2",
      text: "Slots sketch",
    },
    {
      type: "code",
      title: "Memory-oriented class",
      code: `class Row:\n    __slots__ = (\"id\", \"value\")\n\n    def __init__(self, id: int, value: float) -> None:\n        self.id = id\n        self.value = value`,
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Subclass `typing.NamedTuple` for an immutable row and compare ergonomics to `@dataclass(frozen=True)`.",
      ],
    },
    check("Why is `default=[]` inside `@dataclass` dangerous, and what do you use instead?"),
  ],
};

export const lessonBigOWithoutTerror: Lesson = {
  slug: "big-o-without-terror",
  title: "Big-O without terror",
  subtitle: subAdv,
  summary:
    "Big-O is vocabulary for growth: how work scales when n doubles. Use it to spot accidental quadratic loops, then confirm with timing.",
  tier: "advanced",
  readingTimeMinutes: 17,
  objectives: [
    "Identify O(n) vs O(n^2) patterns in Python snippets",
    "Use sets or dicts to drop linear scans to average constant time lookups",
  ],
  practicePrompts: [
    "Write two versions of \"find duplicates\" (list scan vs set) and time them on n=5000 with `timeit`.",
  ],
  keyTakeaways: [
    "Amortized cost matters: dict insertion is average O(1) with rare worst cases.",
    "Generators can change memory complexity even when time stays similar.",
    "Complexity analysis guides algorithm choice before premature micro-optimizations.",
  ],
  sections: [
    ...ql(
      "Ask: if I double the input size, does work quadruple? That is the heart of Big-O intuition.",
      [
        "Scan common complexity classes",
        "Spot nested loops over the same data",
        "Profile one hot path",
      ],
    ),
    {
      type: "h2",
      text: "Common classes",
    },
    {
      type: "ul",
      items: [
        "O(1): hash lookup, index into list, fixed-size arithmetic.",
        "O(n): single pass, copy of list, `in` on a list.",
        "O(n log n): efficient sorts (Timsort for Python lists).",
        "O(n^2): naive all-pairs loops without pruning.",
      ],
    },
    {
      type: "p",
      text: "Big-O is an asymptotic language, so it ignores constants and low-order terms. For small inputs, constants can dominate runtime. For large inputs, growth class usually dominates. Use this distinction to reason first, then verify with timing on realistic workloads.",
    },
    {
      type: "code",
      title: "Hidden quadratic",
      code: `def has_pair_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return True\n    return False`,
    },
    {
      type: "p",
      text: "For sorted numbers, two-pointer scan is O(n). For unsorted with hash set of complements, also O(n) average time.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Asymptotic growth: how runtime or memory changes as input size grows.",
        "Amortized cost: average operation cost over a sequence, including occasional expensive steps.",
        "Hot path: code section that consumes most execution time.",
        "Space complexity: how memory usage grows with input size.",
      ],
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Profile one hot loop with `python -m cProfile -s cumtime script.py` and note top functions.",
      ],
    },
    check("Why is `x in my_list` often slower than `x in my_set` when `len` grows?"),
  ],
};

export const lessonDesigningCliTools: Lesson = {
  slug: "designing-cli-tools",
  title: "Designing CLI tools people trust",
  subtitle: subAdv,
  summary:
    "Users script your CLI. Stable flags, stderr for errors, exit codes for success vs failure, and tests around `main()` keep CLIs maintainable.",
  tier: "advanced",
  readingTimeMinutes: 17,
  objectives: [
    "Build a subcommand-style CLI or single-entry flags with argparse",
    "Return non-zero exit codes on failure with helpful messages",
  ],
  practicePrompts: [
    "Add `--verbose` that bumps logging level before work runs.",
  ],
  keyTakeaways: [
    "`argparse.Namespace` maps to simple functions; keep business logic importable without running CLI side effects.",
    "Document examples in `--help` epilog strings.",
  ],
  sections: [
    ...ql(
      "`argparse` builds argv parsing; return ints from `main` and wrap with `SystemExit` at the bottom.",
      [
        "Minimal CLI skeleton",
        "Why Typer/Click exist",
        "Validate inputs and exit nonzero",
      ],
    ),
    {
      type: "code",
      title: "argparse skeleton",
      code: `import argparse\n\ndef main(argv: list[str] | None = None) -> int:\n    p = argparse.ArgumentParser(description=\"Say hello\")\n    p.add_argument(\"name\")\n    p.add_argument(\"--loud\", action=\"store_true\")\n    args = p.parse_args(argv)\n    msg = f\"Hello, {args.name}\"\n    print(msg.upper() if args.loud else msg)\n    return 0\n\nif __name__ == \"__main__\":\n    raise SystemExit(main())`,
    },
    {
      type: "callout",
      variant: "tip",
      text: "Typer and Click reduce boilerplate; still learn argparse to read older tools and standard library patterns.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add validation that `name` is non-empty and exit 2 with stderr message when invalid.",
      ],
    },
    check("Why should libraries parse argv in a `main(argv)` function instead of only at import time?"),
  ],
};

export const lessonReadingProfessionalCode: Lesson = {
  slug: "reading-professional-code",
  title: "Reading professional codebases",
  subtitle: subAdv,
  summary:
    "Reading code is a skill: find the front door, follow one story, lean on tests, and write notes instead of passively scrolling.",
  tier: "advanced",
  readingTimeMinutes: 17,
  objectives: [
    "Sketch a dependency graph after one hour of exploration",
    "Extract one reusable pattern into your own toy repo without copying proprietary code",
  ],
  practicePrompts: [
    "Pick an MIT-licensed small library on GitHub: list its public API surface in a markdown scratch file.",
  ],
  keyTakeaways: [
    "Tests show how authors expect modules to behave; failing tests reveal invariants.",
    "Git history (`git log -p -- path`) explains why odd code exists.",
  ],
  sections: [
    ...ql(
      "Treat a repo like a map: entrypoint first, then package layout, then tests as examples.",
      [
        "Four-step navigation loop",
        "License caution",
        "Diagram one command flow",
      ],
    ),
    {
      type: "h2",
      text: "Navigation loop",
    },
    {
      type: "ol",
      items: [
        "Find how to run it (README, pyproject, Makefile).",
        "Locate package root (`src/foo` or `foo/`).",
        "Open `tests/` mirror tree; jump to implementation from failing test names.",
        "Trace one user story end-to-end across modules.",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "Do not paste large chunks of GPL code into proprietary products without license compliance. Learn the idea, write your own small version.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Draw a three-box diagram: inputs, core logic, outputs for one command in a tool you use daily.",
      ],
    },
    check("What is one question you can ask about any module: \"who imports this and why\"?"),
  ],
};
