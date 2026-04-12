import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "Intermediate track: plain English, bigger ideas per page.";
const subAdv = "Advanced track: depth that still moves one step at a time.";

export const lessonTypeAnnotationsBasics: Lesson = {
  slug: "type-annotations-basics",
  title: "Type annotations (basics)",
  subtitle: subInt,
  summary:
    "Types are hints: they help editors and tools like mypy catch mistakes before runtime. They do not change how Python executes your program.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Annotate functions with built-in generics like `list[str]` (3.9+) or `List[str]` from typing",
    "Use `Optional[T]` or `T | None` for possibly missing values",
  ],
  practicePrompts: [
    "Install `mypy` and run `mypy .` on a two-file toy project; fix one reported error.",
  ],
  keyTakeaways: [
    "`from __future__ import annotations` postpones evaluation of annotations (forward refs easier).",
    "Protocols describe shape; TypedDict describes dict keys. Pick the lighter tool.",
  ],
  sections: [
    ...ql(
      "You write types on parameters and returns so humans and tools agree on expected shapes.",
      [
        "Function annotations",
        "Nested container types",
        "Run mypy on a tiny example",
      ],
    ),
    {
      type: "code",
      title: "Function annotations",
      code: `def greet(name: str, times: int = 1) -> str:\n    return (f"Hello, {name}\\n") * times`,
    },
    {
      type: "h2",
      text: "Containers",
    },
    {
      type: "code",
      title: "Nested structures",
      code: `from typing import Dict, List\n\ndef invert(groups: Dict[str, List[int]]) -> Dict[int, str]:\n    out: Dict[int, str] = {}\n    for label, nums in groups.items():\n        for n in nums:\n            out[n] = label\n    return out`,
    },
    {
      type: "callout",
      variant: "tip",
      text: "Prefer modern builtin generics (`dict[str, int]`) in new code on Python 3.9+.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Annotate a `median(nums: list[float]) -> float` function and ensure mypy passes on an empty-guard branch that raises `ValueError`.",
      ],
    },
    check("What is the difference between a runtime `TypeError` and a mypy error you only see before running?"),
  ],
};

export const lessonProtocolsAndTyping: Lesson = {
  slug: "protocols-and-typing",
  title: "Protocols and structural typing",
  subtitle: subInt,
  summary:
    "A `Protocol` says: anything with these methods is allowed. That is structural typing: shape over inheritance.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Define a `Readable` protocol with a `read(self, n: int = -1) -> bytes` method",
    "Contrast Protocol with inheritance from an ABC",
  ],
  practicePrompts: [
    "Write a function `dump(source: Readable, path: str) -> None` that reads chunks and writes to disk without knowing concrete classes.",
  ],
  keyTakeaways: [
    "`@runtime_checkable` enables `isinstance` checks against a Protocol (has runtime cost).",
    "Protocols compose well with dependency injection in tests (fake objects).",
  ],
  sections: [
    ...ql(
      "Protocols document duck types explicitly: if it walks like the interface, it passes.",
      [
        "Read a Protocol + concrete class",
        "Call through the Protocol type",
        "Add a second implementation",
      ],
    ),
    {
      type: "code",
      title: "Protocol example",
      code: `from typing import Protocol\n\nclass Greeter(Protocol):\n    def greet(self, name: str) -> str: ...\n\nclass Loud:\n    def greet(self, name: str) -> str:\n        return f\"HELLO {name.upper()}\"\n\ndef call(g: Greeter) -> str:\n    return g.greet(\"Ada\")\n\nprint(call(Loud()))`,
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add a second class `Quiet` implementing `greet` and pass both to `call`.",
      ],
    },
    check("When is an ABC base class clearer than a Protocol for your team?"),
  ],
};

export const lessonGradualTypingTradeoffs: Lesson = {
  slug: "gradual-typing-tradeoffs",
  title: "Gradual typing tradeoffs",
  subtitle: subAdv,
  summary:
    "You can add types file by file. The win is fewer surprise `None`s and wrong shapes at boundaries; the cost is discipline and occasional stub packages.",
  tier: "advanced",
  readingTimeMinutes: 19,
  objectives: [
    "Explain why `Any` is an escape hatch and when it is still honest",
    "Plan a rollout: stdlib and pure functions first, dynamic edges last",
  ],
  practicePrompts: [
    "Enable `disallow_untyped_defs = True` in one package subfolder and list five modules you would migrate first.",
  ],
  keyTakeaways: [
    "Typed code interoperates with untyped libraries via stubs (`types-*` packages on PyPI).",
    "Runtime validation (pydantic) and static typing solve different slices of the problem.",
  ],
  sections: [
    ...ql(
      "Gradual typing trades perfect purity for incremental safety; start where bugs hurt most.",
      [
        "What checkers can prove",
        "Where `Any` is honest",
        "Rollout exercise",
      ],
    ),
    {
      type: "h2",
      text: "What static checkers prove",
    },
    {
      type: "ul",
      items: [
        "Signature mismatches, missing attributes on known classes, impossible branches after narrowing.",
        "They do not prove termination, performance, or absence of security bugs.",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "Over-annotating dynamic JSON blobs as `dict[str, Any]` hides little. Prefer models or TypedDict at boundaries.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Annotate one public function per file in a tiny package until `mypy --strict` passes on that package only.",
      ],
    },
    check("Name one bug mypy can catch that unit tests might miss without exhaustive cases."),
  ],
};

export const lessonVenvsAndDependencies: Lesson = {
  slug: "venvs-and-dependencies",
  title: "Virtual environments and dependencies",
  subtitle: subInt,
  summary:
    "A venv is an isolated Python + `site-packages` per project so dependencies stop fighting each other.",
  tier: "intermediate",
  readingTimeMinutes: 17,
  objectives: [
    "Create and activate a venv on your OS",
    "Freeze dependencies with `pip freeze > requirements.txt` and understand its limits",
  ],
  practicePrompts: [
    "Create `venv/`, install `pytest`, confirm `which python` (or `where python` on Windows) points inside the venv when active.",
  ],
  keyTakeaways: [
    "`python -m venv .venv` then `source .venv/bin/activate` (Unix) or `.venv\\Scripts\\activate` (Windows).",
    "Prefer `pip install -r requirements.txt` in CI for reproducibility; consider `pip-tools` or Poetry for lockfiles when projects grow.",
  ],
  sections: [
    ...ql(
      "Each project gets its own venv so `pip install` here cannot break another folder.",
      [
        "Why global installs hurt",
        "Create and activate",
        "Split dev vs prod requirements",
      ],
    ),
    {
      type: "h2",
      text: "Why not pip install globally",
    },
    {
      type: "p",
      text: "Two projects needing different major versions of the same library cannot coexist in one global environment. Virtualenvs isolate that tension.",
    },
    {
      type: "code",
      title: "Typical workflow",
      code: `# Unix/macOS\npython3 -m venv .venv\nsource .venv/bin/activate\npython -m pip install -U pip\npip install pandas==2.2.2`,
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add a `requirements-dev.txt` with `pytest` and `ruff` separate from runtime deps.",
      ],
    },
    check("Why is `pip freeze` alone not a perfect lockfile for reproducible builds?"),
  ],
};

export const lessonTestingWithPytest: Lesson = {
  slug: "testing-with-pytest",
  title: "Testing with pytest (shape of the craft)",
  subtitle: subInt,
  summary:
    "Tests lock behavior you care about. pytest finds `test_*` functions, asserts with plain `assert`, and parametrizes tables of cases cheaply.",
  tier: "intermediate",
  readingTimeMinutes: 19,
  objectives: [
    "Write parametrized tests for a pure function",
    "Use fixtures for expensive setup without hiding data flow",
  ],
  practicePrompts: [
    "Write three tests for `clamp(x, lo, hi)` including edge cases.",
  ],
  keyTakeaways: [
    "Arrange, act, assert: one mental sentence per test improves failure messages.",
    "`pytest.raises` documents expected failures.",
  ],
  sections: [
    ...ql(
      "One test = one behavior claim; parametrization covers many inputs without copy-paste.",
      [
        "Smallest passing test",
        "Parametrize a table",
        "Fixture for temp files",
      ],
    ),
    {
      type: "code",
      title: "Simple test",
      code: `# tests/test_mathy.py\ndef clamp(x: float, lo: float, hi: float) -> float:\n    return max(lo, min(hi, x))\n\ndef test_clamp_inside():\n    assert clamp(1.5, 0.0, 1.0) == 1.0`,
    },
    {
      type: "callout",
      variant: "note",
      text: "In real repos, keep helpers like `clamp` in a non-test module and import them into `tests/` so production code stays importable.",
    },
    {
      type: "h2",
      text: "Parametrize",
    },
    {
      type: "code",
      title: "Table-driven",
      code: `import pytest\n\n@pytest.mark.parametrize("x,expected", [(5, 1), (-3, 0), (0.5, 0.5)])\ndef test_clamp_0_1(x, expected):\n    assert clamp(x, 0.0, 1.0) == expected`,
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add `tmp_path` fixture test that writes a file and asserts contents round-trip.",
      ],
    },
    check("What is one behavior you should not bother testing because it adds noise?"),
  ],
};

export const lessonLoggingAndObservability: Lesson = {
  slug: "logging-and-observability",
  title: "Logging and observability (intro)",
  subtitle: subInt,
  summary:
    "`logging` separates severity, message, and destination. Configure once at startup; libraries use named loggers so apps can tune noise per module.",
  tier: "intermediate",
  readingTimeMinutes: 15,
  objectives: [
    "Configure basic logging once at program entry",
    "Choose log levels intentionally (`INFO` vs `DEBUG`)",
  ],
  practicePrompts: [
    "Replace three strategic `print` calls in a script with `logging.info` and a `basicConfig` line.",
  ],
  keyTakeaways: [
    "`logging.exception` inside `except` includes stack traces automatically.",
    "Correlation IDs propagate across services when you add them to the `LoggerAdapter`.",
  ],
  sections: [
    ...ql(
      "Logging is structured printing with levels, handlers, and optional machine-readable formats.",
      [
        "Minimal setup",
        "Why libraries use `getLogger(__name__)`",
        "Optional JSON lines lab",
      ],
    ),
    {
      type: "code",
      title: "Starter setup",
      code: `import logging\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")\nlogging.info("started")\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    logging.exception("boom")`,
    },
    {
      type: "callout",
      variant: "note",
      text: "Libraries should log to named loggers (`logging.getLogger(__name__)`) so apps can tune verbosity per module.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Attach a `FileHandler` writing JSON lines with `python-json-logger` or a tiny custom formatter dict.",
      ],
    },
    check("When is `print` still the right tool despite having logging available?"),
  ],
};
