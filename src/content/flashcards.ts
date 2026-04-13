import type { FlashcardDeck } from "./types";

const decks: FlashcardDeck[] = [
  {
    id: "python-core",
    title: "Core Python",
    blurb: "Types, names, operators, and strings from the first modules.",
    cards: [
      {
        id: "pc-1",
        front: 'What is a "literal" in Python?',
        back: 'A value written directly in source code, like 42, 3.14, or "hi". It is not a name pointing to a value.',
      },
      {
        id: "pc-2",
        front: "What does type(x) tell you?",
        back: "The kind of value x is at runtime (for example int, str, list). It answers what kind of object this is.",
      },
      {
        id: "pc-3",
        front: 'What happens for 2 + 3 versus "2" + "3"?',
        back: "2 + 3 is 5 (integer addition). \"2\" + \"3\" is \"23\" (string concatenation). Same plus sign, different types.",
      },
      {
        id: "pc-4",
        front: "Why does input() often need int(...) or float(...)?",
        back: "input() always returns a string. If you want a number for math, you must convert explicitly.",
      },
      {
        id: "pc-5",
        front: "What is assignment (name = value)?",
        back: "It binds the name to an object in a namespace. Reassigning the name does not destroy the old object if something else still refers to it.",
      },
      {
        id: "pc-6",
        front: "What is an f-string?",
        back: "A string prefixed with f that can embed expressions in {...}. It keeps formatting readable without long concatenation.",
      },
      {
        id: "pc-7",
        front: "When should you use == versus is?",
        back: "== compares value (equality). is compares identity (same object in memory). For most data, use ==.",
      },
      {
        id: "pc-8",
        front: "What does immutable mean for a string?",
        back: "You cannot change characters in place. Methods like .upper() return a new string and leave the original alone.",
      },
      {
        id: "pc-9",
        front: "What is None?",
        back: "A built-in singleton that means \"no value\" or \"missing.\" Functions without an explicit return value return None.",
      },
      {
        id: "pc-10",
        front: "What is the difference between / and // for numbers?",
        back: "/ is true division (often a float). // is floor division (drops the fractional part toward negative infinity).",
      },
      {
        id: "pc-11",
        front: "Name several values that are falsy in a boolean context.",
        back: "False, None, numeric zero, empty string, and empty containers like [], {}, set() all evaluate as false in if and while tests.",
      },
      {
        id: "pc-12",
        front: "What does a chained comparison like 1 < x < 10 mean?",
        back: "It is equivalent to (1 < x) and (x < 10). Both sides must be true. It is clearer than combining inequalities by hand.",
      },
      {
        id: "pc-13",
        front: "What does += do?",
        back: "Augmented assignment: x += 3 means roughly x = x + 3, but the exact behavior can differ for mutable types like lists (in-place extend).",
      },
      {
        id: "pc-14",
        front: "What is a comment in Python?",
        back: "Text after # on a line is ignored by the interpreter. Comments explain intent for humans; they do not change runtime behavior.",
      },
      {
        id: "pc-15",
        front: "What is the difference between str and repr for display?",
        back: "str aims at readable output for users. repr often shows a string you could paste back to recreate the value; debugging favors repr-style detail.",
      },
      {
        id: "pc-16",
        front: "What does id(x) return?",
        back: "An integer identity for the object (implementation detail, often the memory address). Comparing id values is like using is for object identity.",
      },
    ],
  },
  {
    id: "control-collections",
    title: "Control flow & collections",
    blurb: "Branches, loops, lists, dicts, and sets: how real programs branch and hold data.",
    cards: [
      {
        id: "cc-1",
        front: "When does Python run elif versus else?",
        back: "elif runs only if previous conditions were false and its own condition is true. else runs only when every preceding condition was false.",
      },
      {
        id: "cc-2",
        front: "Rule of thumb: when to use while versus for?",
        back: "Use for when you iterate a known sequence or range. Use while when you repeat while a condition holds. Watch for infinite loops with while.",
      },
      {
        id: "cc-3",
        front: "What does range(n) produce?",
        back: "A lazy sequence of integers from 0 through n - 1. It is the usual driver for \"do this n times\" for loops.",
      },
      {
        id: "cc-4",
        front: "In one sentence each: list versus tuple?",
        back: "List is ordered and mutable, written with square brackets. Tuple is ordered and immutable, written with parentheses, often used for fixed records or dict keys.",
      },
      {
        id: "cc-5",
        front: "What is a dictionary (dict)?",
        back: "A mapping from keys to values with fast lookup by key. Keys must be hashable (for example strings, numbers, tuples of immutables).",
      },
      {
        id: "cc-6",
        front: "What is a set?",
        back: "An unordered collection of unique elements. Use it for membership tests, deduplication, and set algebra (union, intersection, difference).",
      },
      {
        id: "cc-7",
        front: "list.sort() versus sorted(list)",
        back: "list.sort() sorts in place and returns None. sorted(list) returns a new sorted list and leaves the original list unchanged.",
      },
      {
        id: "cc-8",
        front: "What is a list comprehension?",
        back: "A compact expression form like [expr for x in iterable if condition] to build a list. Prefer a normal loop if it gets hard to read.",
      },
      {
        id: "cc-9",
        front: "What does break do inside a loop?",
        back: "It exits the innermost loop immediately and continues after the loop body.",
      },
      {
        id: "cc-10",
        front: "What does continue do inside a loop?",
        back: "It skips the rest of the current iteration and jumps to the next iteration of the innermost loop.",
      },
      {
        id: "cc-11",
        front: "Why use dict.get(key, default)?",
        back: "d[key] raises KeyError if the key is missing. get returns your default instead, which is useful for counts and optional fields.",
      },
      {
        id: "cc-12",
        front: "What do dict.keys(), dict.values(), and dict.items() give you?",
        back: "View objects over keys, values, or (key, value) pairs. They reflect live changes to the dict and are iterable in for loops.",
      },
      {
        id: "cc-13",
        front: "When does the else clause on a for loop run?",
        back: "It runs after the loop finishes all iterations normally. If the loop exits with break, the else block is skipped.",
      },
      {
        id: "cc-14",
        front: "What does enumerate(iterable) help with?",
        back: "It yields (index, item) pairs so you can loop with both position and value without manual range(len(...)).",
      },
      {
        id: "cc-15",
        front: "What does zip(a, b) do?",
        back: "It pairs elements from iterables in lockstep until the shortest one ends. Common for parallel iteration over two lists.",
      },
      {
        id: "cc-16",
        front: "What does pass do?",
        back: "It is a no-op placeholder. Use it where syntax requires a statement but you intentionally want an empty body (stub classes, empty except blocks you will fill later).",
      },
    ],
  },
  {
    id: "functions-files",
    title: "Functions, modules & files",
    blurb: "Reusable code, imports, files, and errors.",
    cards: [
      {
        id: "ff-1",
        front: "What does def create?",
        back: "A function object bound to a name. Calling the name with parentheses runs the body and can pass arguments.",
      },
      {
        id: "ff-2",
        front: "Parameter versus argument?",
        back: "The parameter is the name in the function definition. The argument is the value the caller passes at the call site.",
      },
      {
        id: "ff-3",
        front: "What does return do?",
        back: "It ends the function call and sends a value back to the caller. If you omit return, the function returns None.",
      },
      {
        id: "ff-4",
        front: 'Why use if __name__ == "__main__": in a .py file?',
        back: "Code under that guard runs when the file is executed as a script, not when the file is imported as a module. Handy for small entry points.",
      },
      {
        id: "ff-5",
        front: "import module versus from module import name",
        back: "import module keeps names under a namespace like module.foo. from ... import pulls names into your scope: shorter to type but easier to shadow or lose track of origins.",
      },
      {
        id: "ff-6",
        front: "What does with open(...) as f: buy you?",
        back: "The context manager closes the file when the block ends, even if an error occurs. Safer than remembering to call close() yourself.",
      },
      {
        id: "ff-7",
        front: "Text mode versus binary mode for files?",
        back: "Text mode decodes bytes to str with an encoding. Binary mode reads and writes bytes unchanged. Use binary for images, pickles, or exact byte control.",
      },
      {
        id: "ff-8",
        front: "What is an exception?",
        back: "A signal that something went wrong. Normal control flow stops and Python looks for a matching except. Uncaught exceptions stop the program or thread.",
      },
      {
        id: "ff-9",
        front: "What does *args collect in a function signature?",
        back: "Extra positional arguments arrive as a tuple bound to the name after the star (often args).",
      },
      {
        id: "ff-10",
        front: "What does **kwargs collect?",
        back: "Extra keyword arguments arrive as a dict mapping names to values (often kwargs).",
      },
      {
        id: "ff-11",
        front: "Why is a mutable default argument like def f(x=[]): risky?",
        back: "The default list is created once at function definition time and reused across calls, so callers can share accidental state. Use None and assign inside the body instead.",
      },
      {
        id: "ff-12",
        front: "What does LEGB mean for name lookup?",
        back: "Local, Enclosing (nested defs), Global (module), Builtins. Python searches those scopes in order when resolving a bare name.",
      },
      {
        id: "ff-13",
        front: "What does raise do?",
        back: "It throws an exception you choose, optionally with a message. You can re-raise inside except to preserve the traceback.",
      },
      {
        id: "ff-14",
        front: "What does the finally block do in try/except?",
        back: "finally always runs when leaving the try construct, whether or not an exception occurred. Use it for cleanup that must run (unlock, close resources).",
      },
      {
        id: "ff-15",
        front: "What is a lambda?",
        back: "A small anonymous function defined with lambda arguments: expression. It is limited to a single expression body; use def for multi-step logic.",
      },
      {
        id: "ff-16",
        front: "Why prefer pathlib over string paths for many tasks?",
        back: "pathlib.Path gives object-oriented joins, existence checks, and globbing with less brittle string concatenation than manual slashes.",
      },
    ],
  },
  {
    id: "oop-and-quality",
    title: "Objects, typing & tests",
    blurb: "Classes, protocols, environments, and pytest-style habits.",
    cards: [
      {
        id: "oq-1",
        front: "In a method, what does self refer to?",
        back: "The instance the method was called on. Python passes it explicitly as the first parameter by convention named self.",
      },
      {
        id: "oq-2",
        front: "What is __init__?",
        back: "The initializer called after a new instance is created. It sets up attributes; it is not the same as a constructor in some other languages but fills a similar role.",
      },
      {
        id: "oq-3",
        front: "Inheritance versus composition in one line each?",
        back: "Inheritance means an is-a relationship and shares behavior through the class hierarchy. Composition means has-a: an object holds other objects to reuse behavior without subclassing.",
      },
      {
        id: "oq-4",
        front: "What is a dunder method?",
        back: "A special method whose name starts and ends with double underscores, like __str__ or __len__. Python calls them for built-in operations and operators.",
      },
      {
        id: "oq-5",
        front: "What does a @decorator above a def do at a high level?",
        back: "It replaces the function object with the return value of the decorator callable, usually a wrapper that adds behavior before or after the original function.",
      },
      {
        id: "oq-6",
        front: "What is a generator function?",
        back: "A function that uses yield to produce values lazily one at a time. Calling it returns a generator iterator; good for large streams and pipelines.",
      },
      {
        id: "oq-7",
        front: "What is a Protocol in typing terms?",
        back: "A structural type: anything with these methods matches, without inheritance. Useful for duck typing with static checkers.",
      },
      {
        id: "oq-8",
        front: "What is gradual typing?",
        back: "You add type hints incrementally. Python ignores them at runtime (unless you use a separate checker); they still help documentation and tools like mypy or Pyright.",
      },
      {
        id: "oq-9",
        front: "Why use a virtual environment (venv)?",
        back: "It isolates project dependencies from your system Python and from other projects, so versions of libraries do not fight each other.",
      },
      {
        id: "oq-10",
        front: "In pytest, what does assert x == y express?",
        back: "A test expectation. If it fails, pytest prints a rich comparison. Simple asserts are idiomatic; pytest rewrites them for clearer failures.",
      },
      {
        id: "oq-11",
        front: "What is a fixture in pytest?",
        back: "A named setup resource (database connection, temp directory, app client) that tests request by parameter name or decorator. It manages lifecycle and reuse.",
      },
      {
        id: "oq-12",
        front: "What does @dataclass reduce boilerplate for?",
        back: "It auto-generates __init__, __repr__, and comparison methods for classes that are mostly bundles of fields with types.",
      },
      {
        id: "oq-13",
        front: "What does __slots__ on a class do?",
        back: "It predeclares allowed attribute names, which can shrink memory and catch typos on assignment, at the cost of flexibility compared to a normal dict-backed instance.",
      },
      {
        id: "oq-14",
        front: "What is logging versus print for production code?",
        back: "Logging attaches levels, timestamps, and handlers so you can filter and route output. print is fine for quick scripts; services need structured logs.",
      },
      {
        id: "oq-15",
        front: "What is Big-O intuition for nested loops over n items?",
        back: "Often O(n²) if both loops scan n elements. It is a growth rate shorthand, not exact milliseconds.",
      },
      {
        id: "oq-16",
        front: "What does itertools.groupby require?",
        back: "The iterable must already be sorted by the same key you group on, because groupby only groups consecutive runs of equal keys.",
      },
    ],
  },
  {
    id: "data-and-models",
    title: "DataFrames, models & evaluation",
    blurb: "Pandas-shaped habits, sklearn pipelines, and honest metrics.",
    cards: [
      {
        id: "dm-1",
        front: "What is a pandas Series?",
        back: "A one-dimensional labeled array: one column of data with an index. Many Series share an index inside a DataFrame.",
      },
      {
        id: "dm-2",
        front: "What is a DataFrame?",
        back: "A table of columns (each a Series) sharing a row index. Think spreadsheet-like data with typed columns in memory.",
      },
      {
        id: "dm-3",
        front: "Why avoid chained indexing like df[a][b] for assignment?",
        back: "It can hit a copy versus view ambiguity and fail silently or warn. Prefer df.loc[row, col] = value for explicit, predictable assignment.",
      },
      {
        id: "dm-4",
        front: "What does df.merge do compared to concat?",
        back: "merge joins tables on keys (SQL-style). concat stacks or appends along an axis; it does not align on keys unless you use keys and axis carefully.",
      },
      {
        id: "dm-5",
        front: "What is tidy data in one sentence?",
        back: "Each variable is a column, each observation is a row, and each kind of observational unit forms a table (Hadley Wickham's idea).",
      },
      {
        id: "dm-6",
        front: "In sklearn, what does fit do?",
        back: "It learns parameters from training data (for example means for scaling or coefficients for a model).",
      },
      {
        id: "dm-7",
        front: "What does transform do?",
        back: "It applies learned parameters to new data without re-learning them. Used on validation and test sets after fit on train.",
      },
      {
        id: "dm-8",
        front: "Why put preprocessing and the model in one Pipeline?",
        back: "So cross-validation fits scalers and models only on each training fold, which prevents information from validation folds leaking into preprocessing.",
      },
      {
        id: "dm-9",
        front: "What is train_test_split used for?",
        back: "Randomly splitting rows into train and test sets to estimate out-of-sample performance. Stratify=y helps preserve class balance for classification.",
      },
      {
        id: "dm-10",
        front: "Precision versus recall (high level)?",
        back: "Precision asks: of positive predictions, how many were right? Recall asks: of actual positives, how many did we find? They trade off in many models.",
      },
      {
        id: "dm-11",
        front: "Why can high R² still be a bad model?",
        back: "R² can rise with irrelevant predictors, non-linear truth fit by wrong linear models, or leaked data. Always check residuals, holdout performance, and domain sense.",
      },
      {
        id: "dm-12",
        front: "What is a confusion matrix?",
        back: "A table of predicted versus actual classes showing true positives, false positives, true negatives, and false negatives for classification.",
      },
      {
        id: "dm-13",
        front: "What does fit_transform mean in sklearn?",
        back: "Fit on the data, then transform it in one step. Convenient for training data; use separate fit and transform on validation or test to avoid leakage.",
      },
      {
        id: "dm-14",
        front: "What is autocorrelation in time series?",
        back: "Correlation of a series with a lagged copy of itself. It breaks IID assumptions, so you often need time-aware splits or models that handle sequence.",
      },
      {
        id: "dm-15",
        front: "What is a panel in econometrics-style data?",
        back: "Repeated observations across entities (for example firms or people) over time. You must respect dependence within units when splitting or modeling.",
      },
      {
        id: "dm-16",
        front: "What is a baseline model in ML workflows?",
        back: "A simple model (majority class, logistic regression on a few features) to beat before chasing complex models. It calibrates how hard the problem is.",
      },
    ],
  },
  {
    id: "thinking-applied",
    title: "How experts think",
    blurb: "Stats, ML, finance, and AI habits from the applied lessons.",
    cards: [
      {
        id: "ta-1",
        front: "What is NPV in one line?",
        back: "The sum of future cash flows discounted to today. It answers whether a project beats a stated discount rate, given your assumptions.",
      },
      {
        id: "ta-2",
        front: "Why seed a random number generator in simulations?",
        back: "So runs are reproducible: teammates and future you see the same random draws when debugging or comparing code.",
      },
      {
        id: "ta-3",
        front: "What is data leakage in ML?",
        back: "Letting information from the test set or the future into training or preprocessing so metrics look unrealistically good.",
      },
      {
        id: "ta-4",
        front: "Prediction versus explanation: what is the distinction?",
        back: "Prediction targets out-of-sample accuracy. Explanation targets mechanisms or causal effects. A strong predictor can encode the wrong causal story.",
      },
      {
        id: "ta-5",
        front: "Why are backtests easy to overfit?",
        back: "You tune on the same history you evaluate. Many tries mean multiple testing unless you hold out data and preregister rules.",
      },
      {
        id: "ta-6",
        front: "LLM as tool versus oracle?",
        back: "Treat outputs as drafts: ground them in your sources, verify facts, add human review for high stakes. Models optimize plausibility, not guaranteed truth.",
      },
      {
        id: "ta-7",
        front: "What is embedding retrieval?",
        back: "Turn text into vectors, find nearest neighbors to a query, then pass those chunks to the model so answers stay tied to your corpus.",
      },
      {
        id: "ta-8",
        front: "Why does peeking in A/B tests inflate false positives?",
        back: "Stopping the first time p is below 0.05 tries many chances under the null. Some runs cross that line by luck; use preregistered sample sizes or sequential methods.",
      },
      {
        id: "ta-9",
        front: "What is a confounder?",
        back: "A variable that affects both treatment and outcome. Ignoring it can make associations look causal when they are not.",
      },
      {
        id: "ta-10",
        front: "What is walk-forward validation for time-ordered data?",
        back: "Train on an early window, validate on the next chunk, roll forward. Random splits lie when regimes shift over time.",
      },
      {
        id: "ta-11",
        front: "Monte Carlo versus bootstrap (rough distinction)?",
        back: "Monte Carlo simulates data from an assumed generative model. Bootstrap resamples your observed data to approximate sampling variation without a parametric model.",
      },
      {
        id: "ta-12",
        front: "Why log prompts carefully around third-party LLM APIs?",
        back: "They may contain secrets or personal data. Prefer redaction, short retention, and policies about what must never leave your network.",
      },
      {
        id: "ta-13",
        front: "What does cosine similarity measure between two vectors?",
        back: "How aligned their directions are, scaled by magnitude. Common for embeddings after normalization so dot products approximate cosine.",
      },
      {
        id: "ta-14",
        front: "Why normalize lat/lon before computing areas on a map?",
        back: "Degrees are not square meters. Reproject to an equal-area or appropriate projected CRS before buffers or area calculations.",
      },
      {
        id: "ta-15",
        front: "What is multiple testing?",
        back: "Running many hypothesis tests raises the chance at least one looks significant by luck. Corrections or pre-registration reduce false discoveries.",
      },
      {
        id: "ta-16",
        front: "What is a choropleth map weakness?",
        back: "Big regions dominate visually even when counts are small. Dot density or hex bins can show within-region variation when you have point-level data.",
      },
    ],
  },
  {
    id: "policy-evaluation",
    title: "Policy evaluation with Python",
    blurb: "Design logic, causal assumptions, and plain-language reporting.",
    cards: [
      {
        id: "pe-1",
        front: "What is the core policy evaluation question?",
        back: "What would outcomes have been for treated units in the same period if the policy had not been implemented? This is the counterfactual.",
      },
      {
        id: "pe-2",
        front: "Difference-in-means estimate in one line?",
        back: "Average outcome among treated units minus average outcome among control units. It is simple but biased if groups differ before treatment.",
      },
      {
        id: "pe-3",
        front: "What assumption is central for DiD?",
        back: "Parallel trends: without treatment, treated and control groups would have changed similarly over time.",
      },
      {
        id: "pe-4",
        front: "How do you compute a DiD estimate?",
        back: "(Treated post minus treated pre) minus (Control post minus control pre).",
      },
      {
        id: "pe-5",
        front: "Why check pre-policy trends before DiD?",
        back: "If groups already move differently before treatment, the DiD estimate may reflect those trend differences, not policy impact.",
      },
      {
        id: "pe-6",
        front: "What is matching used for?",
        back: "To create more comparable treated and control groups in observational data by aligning on observed covariates. It does not automatically fix hidden confounding.",
      },
      {
        id: "pe-7",
        front: "What does RDD exploit?",
        back: "A treatment assignment cutoff in a running variable. Units just above and below the threshold can be compared for a local causal effect.",
      },
      {
        id: "pe-8",
        front: "What is synthetic control in plain terms?",
        back: "A weighted combination of untreated units that mimics the treated unit before policy, then serves as its counterfactual after policy.",
      },
      {
        id: "pe-9",
        front: "Why report confidence intervals, not only p-values?",
        back: "Intervals show both direction and plausible magnitude. A p-value alone hides effect size and practical relevance.",
      },
      {
        id: "pe-10",
        front: "Statistical significance versus practical significance?",
        back: "Statistical significance asks whether evidence is unlikely under a null model. Practical significance asks whether the effect is large enough to matter for policy.",
      },
      {
        id: "pe-11",
        front: "One sentence for external validity?",
        back: "External validity is whether an estimate from this setting can generalize to different places, times, or populations.",
      },
      {
        id: "pe-12",
        front: "What should every policy estimate sentence include?",
        back: "Unit, time window, effect size, uncertainty range, and key assumption caveat.",
      },
    ],
  },
];

export function getFlashcardDecks(): FlashcardDeck[] {
  return decks;
}

export function getFlashcardDeckById(id: string): FlashcardDeck | undefined {
  return decks.find((d) => d.id === id);
}
