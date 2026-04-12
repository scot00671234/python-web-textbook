export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  readMinutes: number;
  sections: BlogSection[];
};

const ARTICLES: BlogArticle[] = [
  {
    slug: "reading-a-python-traceback",
    title: "How to read a Python traceback (without guessing)",
    description:
      "Tracebacks look noisy. Here is a repeatable way to find the line you broke, tell NameError from TypeError, and stop pasting the whole wall of text into chat when you only need one line.",
    datePublished: "2026-01-08",
    readMinutes: 12,
    sections: [
      {
        heading: "Start at the bottom, then walk up one frame",
        paragraphs: [
          "Python prints the most recent call last. The very last line is usually the exception type and message, for example `NameError: name 'totla' is not defined` or `TypeError: unsupported operand type(s) for +: 'int' and 'str'`. That line tells you what went wrong in plain language.",
          "The block above it is a stack of frames: each `File \"...\", line N, in function_name` is one stop on the path that led to the error. The frame at the bottom is where the exception was raised. Often that is your file and your line number—open that file, go to that line, and compare what you wrote to what you meant.",
          "If the bottom frame is inside library code you did not write, walk up until you see your own file path. The bug is usually in the last frame you control that passes bad data into the library.",
        ],
      },
      {
        heading: "Common messages and what they usually mean",
        paragraphs: [
          "`IndentationError` / `TabError`: Python uses indentation for blocks. Mixed tabs and spaces, a missing colon before a new block, or a line that is indented without a parent `if`/`for`/`def` often triggers this. Fix the structure, not random spacing on unrelated lines.",
          "`NameError`: you used a variable or function name Python does not know in that scope—typo, wrong name after a refactor, or using a name before assignment. `UnboundLocalError` is a cousin: you assigned to a name later in the function so Python treats it as local, but you read it earlier.",
          "`TypeError` on `+`, `*`, or calling something: you combined types that do not support that operation, or you called a non-callable. Read the message; it often prints the two types involved. Convert explicitly (for example `str(n)`) or fix the data shape.",
          "`KeyError` / `IndexError`: you asked for a key or index that does not exist. For dicts, check keys with `in` or `.get`. For lists, check length before indexing `[-1]` or using a user-supplied index.",
        ],
      },
      {
        heading: "Make a minimal reproducer before you panic",
        paragraphs: [
          "If you cannot see the mistake, copy the smallest amount of code that still raises the same error into a new file. Remove features until only the failing line and its inputs remain. Half the time the mistake becomes obvious; the other half, you have something safe to paste into a question or compare with a working example from this textbook’s lessons.",
          "This site’s TYPE practice checks text against a fixed snippet; it does not run arbitrary Python or reproduce full tracebacks. For runtime errors, run the same file locally and use the steps above on the traceback your interpreter prints.",
        ],
      },
      {
        heading: "One habit that saves hours",
        paragraphs: [
          "After you fix a bug, add one line of comment or a tiny test (even a `print` you will remove later) that would have failed immediately next time. You are not “done” when the error disappears—you are done when you could explain to someone else why it happened.",
        ],
      },
    ],
  },
  {
    slug: "list-versus-dict-when-python",
    title: "Lists vs dicts in Python: practical rules (not textbook definitions)",
    description:
      "When to reach for a list, when a dict is the right shape, and the mistakes beginners make with both—including mutability surprises that show up in real scripts.",
    datePublished: "2026-01-18",
    readMinutes: 11,
    sections: [
      {
        heading: "Use a list when order and duplicates matter",
        paragraphs: [
          "Lists keep insertion order (in modern Python). They are ideal for sequences: lines in a file, samples in time order, tasks in a queue you process from one end. Indexing with `0`, `1`, … or iterating with `for x in items` is natural when position means something.",
          "Lists allow duplicates. That is either a feature (every measurement is kept) or a footgun (the same user id appears twice because you appended twice). If uniqueness is a requirement of your problem, a list is the wrong primary structure unless you explicitly sort and dedupe.",
        ],
      },
      {
        heading: "Use a dict when you look things up by a stable key",
        paragraphs: [
          "Dicts map keys to values. If your mental model is “given a user id, get a profile” or “given a column name, get a count”, a dict matches the problem. Average time for key lookup is effectively O(1) for typical sizes; scanning a list of pairs for a match is O(n) every time.",
          "Keys must be hashable (strings and numbers are common). Lists cannot be dict keys; tuples can if they contain only immutable parts. If you need a key like `(row, col)`, a dict of tuples is fine.",
          "Prefer `.get(key, default)` when a missing key is normal; use `[key]` when a missing key should be a loud failure so you notice bad data early.",
        ],
      },
      {
        heading: "Mutability: both are mutable; shared references sting harder on dicts",
        paragraphs: [
          "Appending to a list or updating a dict entry changes the same object every variable pointing at it sees. That is why `def append_item(x, item): x.append(item)` mutates the caller’s list, and why storing the same dict in two places lets one function “silently” change data another function reads.",
          "If you need a fresh empty collection inside a loop or function default, create it inside the loop or function body (`result = []` or `result = {}`), not as a default argument—see the article on mutable defaults on this blog.",
        ],
      },
      {
        heading: "Quick decision checklist",
        paragraphs: [
          "Need stable lookup by id or name? Dict. Need to preserve processing order in a pipeline? List. Need both—ordered groups keyed by id? Often a dict mapping id to list, or a list of small dicts, depending on how you read the code later.",
          "The lessons on lists and dicts in this textbook go deeper with exercises; use those pages when you are ready to move from rules to muscle memory.",
        ],
      },
    ],
  },
  {
    slug: "if-name-main-explained-python",
    title: "What `if __name__ == \"__main__\":` does (and why every tutorial shows it)",
    description:
      "The guard is not magic syntax sugar. It is how one `.py` file can behave as an importable module and as a runnable script without running side effects at import time.",
    datePublished: "2026-01-28",
    readMinutes: 10,
    sections: [
      {
        heading: "Two ways a file runs",
        paragraphs: [
          "When you run `python mytool.py`, Python sets the special name `__name__` on that file’s module object to `\"__main__\"`. Code at module level runs top to bottom immediately—including imports, function definitions (which register functions but do not run their bodies), and bare statements like `print` or `input`.",
          "When another file does `import mytool`, Python loads `mytool.py` as a module. In that case `__name__` is the string `\"mytool\"` (the module name), not `\"__main__\"`. You usually do not want `input()` prompts or demo `print` spam to run during an import.",
        ],
      },
      {
        heading: "The guard pattern",
        paragraphs: [
          "Put imports, constants, function and class definitions at module level as usual. Put “only when I run this file directly” logic—CLI parsing, a demo `main()`, quick tests—under:",
          "`if __name__ == \"__main__\":` followed by an indented block. That block runs for `python mytool.py` and is skipped when `mytool` is imported.",
          "Libraries you `pip install` almost never rely on this guard for core behavior; they expose functions and classes. Small tools and homework scripts use it constantly so teammates can `import mytool` in a notebook without side effects.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Indentation under the `if` matters. Everything that should run only in script mode must be indented under that line. A `return` at module level outside any function is illegal; `main()` should be a function you call from the guarded block.",
          "Running the same file under different names (symlinks, `-m` package runs) can change how `__name__` looks in edge cases; for learning, stick to `python file.py` vs `import file` and you are covered.",
        ],
      },
      {
        heading: "How this ties to the textbook",
        paragraphs: [
          "Several lessons in this path ask you to run a small file locally. When you see `if __name__ == \"__main__\":` in an example, treat it as “this is the entry point when I execute the file,” not as something you must copy into every one-liner experiment.",
        ],
      },
    ],
  },
  {
    slug: "venv-and-pip-starter-workflow",
    title: "A minimal venv + pip workflow that stays out of your way",
    description:
      "Create an isolated environment per project, install dependencies into it, and avoid the two most common footguns: global installs and “I fixed it yesterday on another machine.”",
    datePublished: "2026-02-06",
    readMinutes: 12,
    sections: [
      {
        heading: "Why a virtual environment exists",
        paragraphs: [
          "Your system Python may be used by the OS or other tools. Installing packages globally with `pip install` can upgrade libraries something else depended on—or install a version your project does not support. A virtual environment is a directory with its own `python` and `site-packages` so project A and project B never fight.",
          "You commit the dependency list (`requirements.txt` or a lock file from a modern tool), not the venv folder itself. The venv is disposable: delete and recreate when something goes weird.",
        ],
      },
      {
        heading: "Concrete commands (Windows and Unix-shaped shells)",
        paragraphs: [
          "Create: `python -m venv .venv` in your project root. Activate: on Windows cmd `\\.venv\\Scripts\\activate.bat`, PowerShell `\\.venv\\Scripts\\Activate.ps1`, on macOS/Linux `source .venv/bin/activate`. Your prompt often shows `(.venv)` when active.",
          "Install: `python -m pip install --upgrade pip` once in a fresh venv, then `python -m pip install package_name`. Using `python -m pip` guarantees you are targeting the interpreter from the active environment, not a stray global `pip`.",
          "Freeze what worked: `python -m pip freeze > requirements.txt`. On a new machine: create venv, activate, then `python -m pip install -r requirements.txt`.",
        ],
      },
      {
        heading: "What this site does not do for you",
        paragraphs: [
          "Lessons in this textbook may show code you run locally; they do not manage your venv or pip cache. When a lesson says “install requests,” do it inside your activated venv so imports in that lesson’s script resolve predictably.",
          "If `pip` cannot find a package, check typos, Python version compatibility, and whether you are online. Corporate proxies and SSL inspection break installs in ways no tutorial can fix blindly—your IT docs matter there.",
        ],
      },
      {
        heading: "When you are ready for more",
        paragraphs: [
          "Pinning exact versions, dev vs prod dependencies, and reproducible builds move you toward `pip-tools`, Poetry, or `uv`. You do not need those on day one; a venv plus `requirements.txt` is enough to pair with the early lessons here without turning setup into a second job.",
        ],
      },
    ],
  },
  {
    slug: "for-loop-vs-comprehension-readability",
    title: "For loops vs list comprehensions: choose readability, not cleverness",
    description:
      "Comprehensions are not always shorter or faster in the ways that matter. Here is how to pick a plain loop, a comprehension, or a generator expression when writing and reading Python.",
    datePublished: "2026-02-20",
    readMinutes: 11,
    sections: [
      {
        heading: "When a comprehension shines",
        paragraphs: [
          "A list comprehension `[f(x) for x in items if cond(x)]` is great when the transformation and filter are each one clear expression. Readers see “build a new list from an iterable” in one glance. Nested comprehensions beyond one level rarely stay readable—flatten into loops or small helper functions.",
          "Dict and set comprehensions follow the same rule: one conceptual step per comprehension. `{x.id: x for x in rows if x.valid}` is idiomatic.",
        ],
      },
      {
        heading: "When a for loop is the professional choice",
        paragraphs: [
          "Use a loop when you need multiple statements per item: open files, catch exceptions per item, append to several collections, or log progress. Stuffing that into a comprehension forces side effects into expressions and hides errors.",
          "Use a loop when `break` or `continue` clarifies control flow, or when the body is long enough that naming intermediate variables helps. Your future self reads loops left-to-right; dense comprehensions decode like a puzzle.",
        ],
      },
      {
        heading: "Generators: one item at a time",
        paragraphs: [
          "`(f(x) for x in items)` is a generator expression. It does not build a whole list in memory; it yields values as you iterate. That matters for large files or streams. Passing a generator to a consumer (`sum(...)`, `all(...)`, another loop) is memory-friendly.",
          "If you need the length or random access, you must materialize a list—sometimes `list(gen)` is fine, sometimes you redesign so you do not need the whole sequence at once.",
        ],
      },
      {
        heading: "Practice",
        paragraphs: [
          "Take one comprehension from a lesson and rewrite it as a three-line loop with a descriptive accumulator name. Then rewrite it back. If the comprehension version is not obviously shorter and clearer, keep the loop.",
        ],
      },
    ],
  },
  {
    slug: "mutable-default-arguments-python",
    title: "Why `def f(x=[])` is a bug (mutable default arguments in Python)",
    description:
      "Default arguments are evaluated once at function definition time, not on each call. Mutable defaults share one object across calls—here is the fix every style guide recommends.",
    datePublished: "2026-03-04",
    readMinutes: 9,
    sections: [
      {
        heading: "What actually happens",
        paragraphs: [
          "When Python executes `def f(items=[]):`, it creates a single list object and binds it as the default for `items`. Every call that omits `items` reuses that same list. A second call sees whatever the first call appended.",
          "That surprises people who think defaults are re-evaluated per call like `items = items or []` inside the body would be. They are not.",
        ],
      },
      {
        heading: "The standard fix",
        paragraphs: [
          "Use `None` (or another sentinel) and assign inside the function:",
          "`def f(items=None):` then `if items is None: items = []` before using `items`. Each call gets a fresh list unless the caller passes their own list to share on purpose.",
          "The same pattern applies to dicts, sets, and other mutable defaults. For immutable defaults like numbers or strings, the pitfall does not apply—there is nothing to mutate in place.",
        ],
      },
      {
        heading: "Dataclasses and mutable fields",
        paragraphs: [
          "`dataclasses.field(default_factory=list)` exists because the same rule applies to defaults on class fields. Use `default_factory`, not `default=[]`, when each instance needs its own empty list.",
        ],
      },
      {
        heading: "Where to learn more here",
        paragraphs: [
          "This textbook includes a lesson on the mutable default guard pattern with examples. Read it after you can write a small function with parameters confidently—then the warning will stick.",
        ],
      },
    ],
  },
];

export function getBlogArticles(): BlogArticle[] {
  return ARTICLES;
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
