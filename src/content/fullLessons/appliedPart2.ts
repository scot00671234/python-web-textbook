import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "";
const subAdv = "";

export const lessonCashflowsNpvAndScenarios: Lesson = {
  slug: "cashflows-npv-and-scenarios",
  title: "Cash flows, NPV, and scenarios in code",
  subtitle: subInt,
  summary:
    "Net present value discounts future cash flows by a rate reflecting time preference and risk. Code makes assumptions explicit so you can stress-test them.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Implement NPV as a loop over dated cash flows with a constant discount rate",
    "Compare two scenarios by varying growth or discount assumptions",
  ],
  practicePrompts: [
    "Extend the snippet to accept cash flows in any order by sorting on period index before discounting.",
  ],
  keyTakeaways: [
    "NPV is sensitive to the discount rate; report a small sensitivity table, not a single magic number.",
    "This lesson teaches mechanics. It is not investment, tax, or legal advice.",
  ],
  sections: [
    ...ql(
      "NPV answers: are future cash flows worth more than money today, given a discount rate you state out loud?",
      [
        "Implement discounting in a tiny function",
        "Compare scenarios by changing rate or flows",
        "Optional IRR search lab",
      ],
    ),
    {
      type: "callout",
      variant: "warn",
      text: "Educational examples only. Real decisions need professional advice, audited data, and institutional controls.",
    },
    {
      type: "code",
      title: "NPV with constant rate",
      code: `def npv(rate: float, cashflows: list[float]) -> float:\n    \"\"\"cashflows[k] is at end of period k+1 (common convention).\"\"\"\n    total = 0.0\n    for k, cf in enumerate(cashflows):\n        total += cf / (1 + rate) ** (k + 1)\n    return total\n\nprint(npv(0.08, [-1000, 300, 420, 510]))`,
    },
    {
      type: "h2",
      text: "Scenario table",
    },
    {
      type: "p",
      text: "Build a list of dicts or a small `DataFrame` with columns `scenario`, `rate`, `npv`. Plotting three rates takes minutes and prevents silent optimism.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Implement IRR via binary search on the rate `r` such that `npv(r, flows) ≈ 0` for a simple two-sign-change cashflow list.",
      ],
    },
    check("If you double the discount rate, does NPV usually rise or fall, holding cash flows fixed?"),
  ],
};

export const lessonMonteCarloForDecisions: Lesson = {
  slug: "monte-carlo-for-decisions",
  title: "Monte Carlo for decisions under uncertainty",
  subtitle: subInt,
  summary:
    "Simulate many futures by drawing random inputs according to assumptions. Inspect the whole distribution of outcomes, not only the mean.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Use `numpy.random.Generator` for reproducible draws",
    "Summarize simulation output with percentiles",
  ],
  practicePrompts: [
    "Plot a histogram of simulated total returns after 252 daily steps with drift 0 and small volatility (GBM toy).",
  ],
  keyTakeaways: [
    "Document the RNG seed and distribution choices next to plots.",
    "Garbage in, garbage out: the hardest part is defensible input distributions.",
  ],
  sections: [
    ...ql(
      "Monte Carlo means: draw random futures many times, summarize the distribution, do not worship the mean alone.",
      [
        "Run many simulations with a fixed seed",
        "Read mean vs tail percentiles",
        "Stress-test assumptions verbally",
      ],
    ),
    {
      type: "code",
      title: "Portfolio of independent bets (toy)",
      code: `import numpy as np\n\nrng = np.random.default_rng(42)\nn_sims = 50_000\np_win = 0.55\npayout = 1.0\nstake = 1.0\nwins = rng.binomial(1, p_win, size=n_sims)\nprofit = wins * payout - stake\nprint(\"mean\", profit.mean())\nprint(\"5th pct\", np.percentile(profit, 5))`,
    },
    {
      type: "h2",
      text: "Why seed",
    },
    {
      type: "p",
      text: "Seeds make collaboration possible: teammates reproduce your histogram. Change the seed to stress-test RNG sensitivity occasionally.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Estimate the probability that cumulative profit after 100 independent bets stays above zero using the same `p_win`.",
      ],
    },
    check("Why is documenting the RNG seed as important as documenting the discount rate in finance code?"),
  ],
};

export const lessonBacktestsAndOverfitting: Lesson = {
  slug: "backtests-and-overfitting",
  title: "Backtests, overfitting, and humility",
  subtitle: subAdv,
  summary:
    "A backtest replays history with a strategy. If you peek at test data while designing rules, you manufacture performance. Honest workflows separate design, validation, and holdout.",
  tier: "advanced",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Describe walk-forward validation in words",
    "List researcher degrees of freedom that inflate backtest returns",
  ],
  practicePrompts: [
    "Write a checklist of five questions you would ask a colleague who shows a 20% annualized backtest.",
  ],
  keyTakeaways: [
    "Transaction costs, borrow constraints, and corporate actions change realized performance.",
    "Multiple testing without correction rewards luck.",
  ],
  sections: [
    ...ql(
      "Backtests are easy to overfit; time-aware validation and preregistered rules fight imaginary alpha.",
      [
        "Explain walk-forward in one sentence",
        "List degrees of freedom that inflate curves",
        "See window tuning as a red flag",
      ],
    ),
    {
      type: "h2",
      text: "Train and test in time",
    },
    {
      type: "p",
      text: "Fit parameters on an early window, evaluate on the next chunk, roll forward. Random cross-section splits lie when regimes shift.",
    },
    {
      type: "callout",
      variant: "warn",
      text: "Past performance of a toy strategy does not indicate future results. This section builds statistical skepticism, not a trading edge.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Take a simple moving-average crossover on synthetic prices. Show how changing window lengths after seeing the plot shifts reported returns.",
      ],
    },
    check("Name one choice you must freeze before looking at out-of-sample performance."),
  ],
};

export const lessonLlmsAsToolsNotOracles: Lesson = {
  slug: "llms-as-tools-not-oracles",
  title: "LLMs as tools, not oracles",
  subtitle: subInt,
  summary:
    "Large language models complete plausible text. Ground outputs in sources you control, surface confidence limits, and design human review for high-stakes fields.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Sketch a request/response loop with system vs user messages",
    "List three failure modes you have personally seen in model outputs",
  ],
  practicePrompts: [
    "Write a policy: which user inputs may never be sent to a third-party API?",
  ],
  keyTakeaways: [
    "Temperature and top-p change creativity vs determinism; default low for extraction tasks.",
    "Log prompts and responses with redaction when debugging, not raw secrets.",
  ],
  sections: [
    ...ql(
      "Treat LLMs like interns who type fast: give sources, verify outputs, never ship secrets raw.",
      [
        "Ground with retrieval + citations",
        "Sketch HTTP payload shape",
        "Draft a safe system prompt",
      ],
    ),
    {
      type: "h2",
      text: "Grounding pattern",
    },
    {
      type: "ol",
      items: [
        "Retrieve candidate documents (search, files).",
        "Ask the model to cite passage ids or quotes limited to those docs.",
        "Programmatically verify citations exist before showing users the answer.",
      ],
    },
    {
      type: "code",
      title: "Pseudo-code for an HTTP JSON API",
      code: `# pip install httpx (example only; wire your vendor + keys safely)\nimport httpx\n\npayload = {\n    \"model\": \"gpt-4o-mini\",\n    \"messages\": [\n        {\"role\": \"system\", \"content\": \"Answer only using the provided CONTEXT.\"},\n        {\"role\": \"user\", \"content\": \"CONTEXT: ...\\nQUESTION: ...\"},\n    ],\n    \"temperature\": 0.2,\n}\n# response = httpx.post(\"https://api.example.com/v1/chat/completions\", json=payload, timeout=30)\n# data = response.json()`,
    },
    {
      type: "callout",
      variant: "note",
      text: "Never commit API keys. Use environment variables and secret managers. Rotate keys if leaked.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Draft a system prompt for summarizing meeting notes that forbids inventing action items not present in the text.",
      ],
    },
    check("What is one failure mode when temperature is high on a factual extraction task?"),
  ],
};

export const lessonEmbeddingsAndRetrievalSketch: Lesson = {
  slug: "embeddings-and-retrieval-sketch",
  title: "Embeddings and retrieval (sketch)",
  subtitle: subInt,
  summary:
    "An embedding maps text (or images) to a vector so that similar items sit nearby in space. Retrieval returns top-k neighbors to stuff into a prompt window.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Compute cosine similarity between two small vectors by hand in code",
    "Explain chunking tradeoffs for long documents",
  ],
  practicePrompts: [
    "Implement brute-force `top_k(query_vec, corpus_matrix)` with NumPy dot products and argsort.",
  ],
  keyTakeaways: [
    "Normalize vectors before cosine similarity if you use dot products.",
    "Vector databases optimize nearest neighbor at scale; start in-memory for learning.",
  ],
  sections: [
    ...ql(
      "Embeddings turn text into vectors; retrieval finds nearest chunks so the model reads your corpus, not the internet.",
      [
        "Cosine similarity between toy vectors",
        "Chunk size tradeoffs",
        "Optional brute-force top-k",
      ],
    ),
    {
      type: "code",
      title: "Cosine similarity toy",
      code: `import numpy as np\n\ndef cosine(a: np.ndarray, b: np.ndarray) -> float:\n    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))\n\nq = np.array([1.0, 0.0, 0.0])\nd1 = np.array([0.9, 0.1, 0.0])\nd2 = np.array([0.0, 1.0, 0.0])\nprint(cosine(q, d1), cosine(q, d2))`,
    },
    {
      type: "h2",
      text: "Chunking",
    },
    {
      type: "p",
      text: "Too small: context fragments. Too large: many unrelated ideas in one vector. Metadata (title, section, page) helps filters before vector search.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Token-count a paragraph with a tokenizer from `tiktoken` for OpenAI models or `transformers` if installed; compare counts for two chunk sizes.",
      ],
    },
    check("If chunks are huge, why might top-k retrieval return irrelevant passages even when cosine scores look high?"),
  ],
};

export const lessonAiSafetyPrivacyAndData: Lesson = {
  slug: "ai-safety-privacy-and-data",
  title: "Safety, privacy, and data handling for AI features",
  subtitle: subAdv,
  summary:
    "Treat prompts like sensitive inputs: minimize retention, scrub PII, and design kill switches. Monitor cost and latency because models fail open when overloaded.",
  tier: "advanced",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Write a data classification table: public, internal, restricted",
    "Plan backoff and user-visible errors when the model API times out",
  ],
  practicePrompts: [
    "List five fields that must never be logged verbatim from user forms in a health application.",
  ],
  keyTakeaways: [
    "EU GDPR and similar regimes care about purpose limitation and deletion timelines.",
    "Adversarial prompts happen; combine allowlists, output filters, and human review.",
  ],
  sections: [
    ...ql(
      "Ship AI features like payments: classify data, minimize retention, plan outages, and involve humans for high stakes.",
      [
        "Sketch logging redaction",
        "List restricted fields",
        "Write a kill-switch runbook line",
      ],
    ),
    {
      type: "h2",
      text: "Logging policy sketch",
    },
    {
      type: "ul",
      items: [
        "Store hashed user ids if you need correlation.",
        "Truncate prompts in logs; keep full text only in encrypted short-term buffers if legally allowed.",
        "Alert on anomalous token usage spikes (possible abuse or loops).",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "Automated decisions about people may face legal review depending on jurisdiction. Involve counsel early, not after launch.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Write a runbook section: \"If vendor error rate exceeds 5% for 10 minutes, disable AI features and show static guidance.\"",
      ],
    },
    check("Why is storing full prompts in plaintext logs riskier than storing only a hash of the user id?"),
  ],
};

export const lessonExperimentsAndAbTesting: Lesson = {
  slug: "experiments-and-ab-testing",
  title: "Experiments and A/B testing in code",
  subtitle: subInt,
  summary:
    "Randomized experiments compare outcomes between groups that differ only by treatment assignment on average. Code helps simulate, analyze, and document them.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Simulate a two-arm experiment with NumPy and compare means",
    "Explain why peeking inflates false positive rates",
  ],
  practicePrompts: [
    "Run 2000 simulated experiments under the null (no effect) with early stopping when p<0.05; observe inflated false positives vs fixed sample.",
  ],
  keyTakeaways: [
    "Preregister metrics and stopping rules when possible.",
    "Block randomization when units vary within strata (simple sketch in code comments).",
  ],
  sections: [
    ...ql(
      "A/B tests randomize who sees what so average differences reflect treatment, not selection; peeking breaks that story.",
      [
        "Simulate two arms in NumPy",
        "Link peeking to false positives",
        "Histogram many simulated lifts",
      ],
    ),
    {
      type: "code",
      title: "Simulate lift",
      code: `import numpy as np\n\nrng = np.random.default_rng(7)\nn = 400\ntreatment = rng.binomial(1, 0.5, size=n).astype(bool)\nbase = rng.normal(10.0, 1.5, size=n)\nlift = 0.4\noutcome = base + lift * treatment + rng.normal(0, 0.3, size=n)\nprint(outcome[treatment].mean() - outcome[~treatment].mean())`,
    },
    {
      type: "h2",
      text: "Simple stats link",
    },
    {
      type: "p",
      text: "For Gaussian-ish outcomes with equal variance, a two-sample t-test is a starting point. For rates, look at Wilson intervals or logistic regression; reach for `scipy.stats` or `statsmodels` after you write down assumptions.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Wrap the simulation in a function `simulate_once(n, lift)` returning the observed mean difference. Call it 500 times and plot a histogram of differences.",
      ],
    },
    check("Under the null (no true lift), why does stopping the moment p<0.05 inflate false positives?"),
  ],
};

export const lessonTextAsDataIntro: Lesson = {
  slug: "text-as-data-intro",
  title: "Text as data (introduction)",
  subtitle: subInt,
  summary:
    "Start with normalization, tokenization, and counting. Classical bag-of-words models still baseline modern pipelines and help debug newer models.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Lowercase, strip punctuation roughly, and build a `Counter` of tokens",
    "Explain when lemmatization helps vs adds complexity",
  ],
  practicePrompts: [
    "Use `collections.Counter` on words from a paragraph; print the ten most common.",
  ],
  keyTakeaways: [
    "`str.split()` is a crude tokenizer; `nltk` or `spaCy` add linguistic awareness when you need it.",
    "Stopwords lists are language- and domain-specific.",
  ],
  sections: [
    ...ql(
      "Text pipelines start boring: normalize, tokenize, count. That baseline catches bad data before fancy models hide it.",
      [
        "Build a token counter",
        "Know when lemmatization pays off",
        "Optional sparse bag-of-words vector",
      ],
    ),
    {
      type: "code",
      title: "Normalize and count",
      code: `import re\nfrom collections import Counter\n\ndef tokens(text: str) -> list[str]:\n    text = text.lower()\n    text = re.sub(r\"[^a-z0-9\\s]\", \" \", text)\n    return [t for t in text.split() if t]\n\ntxt = \"Data, data! Models? models.\"\nprint(Counter(tokens(txt)))`,
    },
    {
      type: "h2",
      text: "Why not jump straight to transformers",
    },
    {
      type: "p",
      text: "Tiny linear models on bag-of-words features train fast and expose data bugs. They are weak on semantics but excellent sanity checks.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Build a vocabulary of the 500 most frequent tokens across three strings; map each string to a sparse count vector manually (dict of int).",
      ],
    },
    check("Why might `str.split()` mis-tokenize compared to a language-specific tokenizer?"),
  ],
};

export const lessonGeodataAndMapsIntro: Lesson = {
  slug: "geodata-and-maps-intro",
  title: "Geodata and maps without getting lost",
  subtitle: subInt,
  summary:
    "Coordinates live in a coordinate reference system (CRS). Mixing CRS without transforming produces nonsense maps. Libraries like GeoPandas and PyProj handle transforms once you know source and target EPSG codes.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Explain EPSG:4326 vs projected CRS in one sentence each",
    "Plot points from a CSV of lat/lon with matplotlib after converting to projected coordinates or accepting distortion for small regions",
  ],
  practicePrompts: [
    "Install `geopandas` in a venv and load a natural earth countries sample; print CRS and bounds.",
  ],
  keyTakeaways: [
    "Area calculations need projected CRS; lat/lon degrees are not square meters.",
    "Choropleths hide within-region variation; consider dot density or hex bins when counts support it.",
  ],
  sections: [
    ...ql(
      "Every lat/lon lives in a CRS; mixing them without `to_crs` is how maps lie quietly.",
      [
        "Know EPSG:4326 vs projected CRS",
        "Scatter small regions in degrees cautiously",
        "Reproject before areas or buffers",
      ],
    ),
    {
      type: "code",
      title: "Points from lat/lon (matplotlib only)",
      code: `import matplotlib.pyplot as plt\n\n# WGS84 degrees (EPSG:4326): fine for small-area scatter, not for areas\nlats = [37.77, 34.05, 40.71]\nlons = [-122.42, -118.24, -74.01]\nplt.scatter(lons, lats)\nplt.xlabel(\"Longitude\")\nplt.ylabel(\"Latitude\")\nplt.title(\"Three cities (toy)\")\nplt.show()`,
    },
    {
      type: "callout",
      variant: "note",
      text: "For publication maps, reproject with GeoPandas `to_crs` to an equal-area or appropriate projected CRS before computing buffers or areas.",
    },
    {
      type: "h2",
      text: "GeoPandas one-liner install",
    },
    {
      type: "p",
      text: "`pip install geopandas` pulls wheels on common platforms. If install fails, read the GeoPandas install docs for GDAL/PROJ hints on your OS.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Create a `GeoDataFrame` from the three city points with `geometry=gpd.points_from_xy(lon, lat, crs=\"EPSG:4326\")` and reproject to `EPSG:3857` for web-style meters.",
      ],
    },
    check("Why should you not compute polygon areas directly from latitude/longitude degrees?"),
  ],
};
