import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "";

export const lessonClassesAndState: Lesson = {
  slug: "classes-and-state",
  title: "Classes and objects",
  subtitle: subInt,
  summary:
    "A `class` is a template; calling it builds an `instance` with its own attributes. Methods are functions that always receive the instance as the first argument, conventionally named `self`.",
  tier: "intermediate",
  readingTimeMinutes: 19,
  objectives: [
    "Implement `__init__` and instance methods on a simple model type",
    "Decide when a dict or dataclass is simpler than a hand-written class",
  ],
  practicePrompts: [
    "Model a `BankAccount` with `deposit`, `withdraw`, and `balance` (raise `ValueError` on overdraft).",
  ],
  keyTakeaways: [
    "Instance attributes live on `self`; class attributes are shared unless shadowed.",
    "`__repr__` should look like code you could paste to recreate the object when possible.",
  ],
  sections: [
    ...ql(
      "Classes group data and the functions that operate on that data; `self` is the instance you are touching.",
      [
        "Read a tiny class end to end",
        "Compare dict-only design vs a class",
        "Add a readable `__repr__`",
      ],
    ),
    {
      type: "code",
      title: "Minimal counter class",
      code: `class Counter:\n    def __init__(self, start: int = 0) -> None:\n        self.value = start\n\n    def tick(self) -> int:\n        self.value += 1\n        return self.value\n\nc = Counter(10)\nprint(c.tick(), c.tick())`,
    },
    {
      type: "h2",
      text: "When a dict is enough",
    },
    {
      type: "p",
      text: "If you only shuffle a fixed set of keys and never attach behavior, a dict or `TypedDict` stays lighter. Add a class when invariants and methods clarify intent.",
    },
    {
      type: "callout",
      variant: "tip",
      text: "`dataclasses.dataclass` auto-writes `__init__`, `__repr__`, and comparisons. Reach for it before writing six dunder methods by hand.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add `__repr__` to `Counter` returning `Counter(value=...)`.",
      ],
    },
    check("In one phrase, what is the difference between `Counter` and `c = Counter()`?"),
  ],
};

export const lessonMethodsAndDundersIntro: Lesson = {
  slug: "methods-and-dunders-intro",
  title: "Methods and dunder hooks (intro)",
  subtitle: subInt,
  summary:
    "Double-underscore methods plug your objects into built-in syntax: `+`, `len`, loops. Learn the few hooks your type needs; ignore the long tail until a library forces it.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Implement `__len__` and `__iter__` on a tiny collection wrapper",
    "Read dunder-heavy code without memorizing every hook",
  ],
  practicePrompts: [
    "Wrap a list in `Bucket` so `len(b)` and `for x in b` delegate to the inner list.",
  ],
  keyTakeaways: [
    "`__str__` is for humans; `__repr__` is for developers (ideally unambiguous).",
    "Operator overloading should mirror math intuition, not surprise readers.",
  ],
  sections: [
    ...ql(
      "Dunders connect user-defined classes to operators and builtins; you opt in per method.",
      [
        "How `__init__` fits into object creation",
        "Sketch `__add__` and `__repr__`",
        "Equality guard with `isinstance`",
      ],
    ),
    {
      type: "h2",
      text: "`__init__` is not a constructor in the C++ sense",
    },
    {
      type: "p",
      text: "Python constructs the object, then calls `__init__` to initialize it. Rarely you also touch `__new__` for metaclass tricks; ignore until needed.",
    },
    {
      type: "code",
      title: "Vector addition sketch",
      code: `class Vec2:\n    def __init__(self, x: float, y: float) -> None:\n        self.x = x\n        self.y = y\n\n    def __add__(self, other: "Vec2") -> "Vec2":\n        return Vec2(self.x + other.x, self.y + other.y)\n\n    def __repr__(self) -> str:\n        return f"Vec2({self.x}, {self.y})"\n\nprint(Vec2(1, 2) + Vec2(3, 4))`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "Do not overload operators for unrelated meanings (`__add__` that writes to disk). That confuses every reader and tooling.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Implement `__eq__` for `Vec2` comparing coordinates (remember `isinstance` guard).",
      ],
    },
    check("Why should `__eq__` refuse to compare against non-`Vec2` types?"),
  ],
};

export const lessonInheritanceAndComposition: Lesson = {
  slug: "inheritance-and-composition",
  title: "Inheritance vs composition",
  subtitle: subInt,
  summary:
    "Inheritance reuses code through an is-a relationship. Composition reuses code by holding collaborators (has-a). Default to composition when the parent class would force empty or misleading methods.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Sketch a problem both ways and compare maintenance cost",
    "Use `super()` intentionally in cooperative hierarchies",
  ],
  practicePrompts: [
    "Refactor a small `Dog(Animal)` example into `Dog` holding an `AnimalTraits` helper and note which methods moved.",
  ],
  keyTakeaways: [
    "Deep inheritance trees are hard to reason about; shallow trees plus protocols often age better.",
    "Abstract base classes (`abc.ABC`) document required methods when subclasses must stay compatible.",
  ],
  sections: [
    ...ql(
      "Pick inheritance when the subtype truly is the base type everywhere; otherwise compose small objects.",
      [
        "Read a two-class inheritance sample",
        "See composition as dependency injection",
        "Reflect in writing",
      ],
    ),
    {
      type: "code",
      title: "Tiny inheritance",
      code: `class Shape:\n    def area(self) -> float:\n        raise NotImplementedError\n\nclass Square(Shape):\n    def __init__(self, side: float) -> None:\n        self.side = side\n\n    def area(self) -> float:\n        return self.side * self.side`,
    },
    {
      type: "h2",
      text: "Composition pattern",
    },
    {
      type: "p",
      text: "`Notifier` holds a `Transport` (`EmailTransport`, `SmsTransport`). Swapping transport does not fork the whole class tree.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Write 150 words: one feature in your own work that started as inheritance and became awkward. How would composition change the API?",
      ],
    },
    check("When does `super()` matter, and when can you ignore it in small scripts?"),
  ],
};

export const lessonComprehensionsAndIteration: Lesson = {
  slug: "comprehensions-and-iteration",
  title: "Comprehensions and iteration patterns",
  subtitle: subInt,
  summary:
    "List and dict comprehensions are loops in expression form. If readers need comments to follow it, switch back to a regular `for` loop.",
  tier: "intermediate",
  readingTimeMinutes: 15,
  objectives: [
    "Write guarded comprehensions and dict/set comprehensions",
    "Choose between comprehension and explicit loop for team readability",
  ],
  practicePrompts: [
    "Build `{word: len(word) for word in words if len(word) > 3}`.",
  ],
  keyTakeaways: [
    "Walrus operator `:=` can share subexpressions inside comprehensions (Python 3.8+).",
    "Generator expressions save memory when passed to functions like `sum` or `any`.",
  ],
  sections: [
    ...ql(
      "Comprehensions = compact loops; read them left-to-right as nested fors; bail out to explicit loops when dense.",
      [
        "Guarded list comprehension",
        "Flatten nested lists",
        "Group values into dict of lists",
      ],
    ),
    {
      type: "code",
      title: "Guard clause",
      code: `nums = range(10)\nevens_sq = [n * n for n in nums if n % 2 == 0]\nprint(evens_sq)`,
    },
    {
      type: "h2",
      text: "Nested comprehension",
    },
    {
      type: "code",
      title: "Pairs",
      code: `matrix = [[1, 2], [3, 4]]\nflat = [x for row in matrix for x in row]\nprint(flat)`,
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "From `records = [(\"east\", 1), (\"west\", 2), (\"east\", 3)]`, build a dict mapping region to list of values using a comprehension or defaultdict.",
      ],
    },
    check("Which `for` is outer in `[x for row in matrix for x in row]`?"),
  ],
};

export const lessonGeneratorsAndLazyPipelines: Lesson = {
  slug: "generators-and-lazy-pipelines",
  title: "Generators and lazy pipelines",
  subtitle: subInt,
  summary:
    "`yield` pauses a function and resumes on the next iteration, so you stream data instead of materializing giant lists.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Write a generator function and consume it with a `for` loop",
    "Chain stages with plain functions before reaching for heavy frameworks",
  ],
  practicePrompts: [
    "Write `read_numbers(path)` yielding floats line by line without loading the file into memory.",
  ],
  keyTakeaways: [
    "A generator iterator runs until the next `yield` or `return`.",
    "`yield from` delegates iteration to another iterable cleanly.",
  ],
  sections: [
    ...ql(
      "Generators produce values lazily; great for big files and staged pipelines.",
      [
        "Read a simple `yield` loop",
        "Sketch pipeline stages",
        "Chain without building full lists",
      ],
    ),
    {
      type: "code",
      title: "Count up",
      code: `def count_to(n: int):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nprint(list(count_to(4)))`,
    },
    {
      type: "h2",
      text: "Pipeline sketch",
    },
    {
      type: "p",
      text: "`lines -> parse -> clean -> aggregate` as separate generator functions is easy to test stage by stage.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Chain `integers()` yielding 1..n with `squares(gen)` yielding squares, print first five values without building a full list.",
      ],
    },
    check("Why can you only iterate a generator object once unless you rebuild it?"),
  ],
};

export const lessonDecoratorsFirstContact: Lesson = {
  slug: "decorators-first-contact",
  title: "Decorators (first contact)",
  subtitle: subInt,
  summary:
    "`@decorator` above `def` applies a function to the function you just defined. Always use `functools.wraps` so metadata survives.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Implement a trivial decorator using `functools.wraps`",
    "Explain why decorators preserve metadata when written correctly",
  ],
  practicePrompts: [
    "Write `announce` that prints the function name before calling the wrapped function.",
  ],
  keyTakeaways: [
    "`functools.wraps` copies `__name__` and `__doc__` to the wrapper.",
    "Parameterized decorators need an extra factory layer returning the real decorator.",
  ],
  sections: [
    ...ql(
      "Decorators wrap callables to add cross-cutting behavior (logging, timing, access control).",
      [
        "Read a bare decorator example",
        "See why `wraps` matters",
        "Try a logging wrapper",
      ],
    ),
    {
      type: "code",
      title: "Bare decorator",
      code: `import functools\n\ndef twice(fn):\n    @functools.wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs) * 2\n    return wrapper\n\n@twice\ndef one():\n    return 1\n\nprint(one())`,
    },
    {
      type: "callout",
      variant: "note",
      text: "Real-world decorators often live in libraries (`pytest.fixture`, Flask routes). Read their docs for argument semantics.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add a decorator `log_calls` that prints args/kwargs before invoking (be careful logging secrets).",
      ],
    },
    check("Without `wraps`, what breaks in tracebacks or `help()` for wrapped functions?"),
  ],
};
