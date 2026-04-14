import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "";
const subAdv = "";

export const lessonCashflowsNpvAndScenarios: Lesson = {
  slug: "cashflows-npv-and-scenarios",
  title: "Cash flows, NPV, and scenarios in code",
  subtitle: subInt,
  summary:
    "Net present value converts future cash flows into present terms through an explicit discount structure. The analytical value is comparison under stated assumptions, not certainty about future performance.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Explain in plain language why a dollar later is worth less than a dollar now",
    "Implement NPV with a loop and verify each discounted term",
    "Compare two scenarios and explain how discount-rate changes alter decisions",
  ],
  practicePrompts: [
    "Modify the function so it accepts `(period, cashflow)` pairs in any order, sorts by period, and then discounts correctly.",
    "Create a two-scenario table (`base`, `conservative`) and write one sentence interpreting which assumptions drive the NPV difference.",
  ],
  keyTakeaways: [
    "NPV is not a fact, it is a model output tied to assumptions you choose and must report.",
    "Always show a small sensitivity table. One single discount rate can hide decision risk.",
    "The same cash flows can look attractive or weak depending on timing and discount rate.",
    "Decision quality improves when financing assumptions and operating assumptions are separated clearly.",
  ],
  sections: [
    ...ql(
      "NPV asks a simple question: after discounting future cash flows, how much value is this project worth in today's money?",
      [
        "Build intuition for discounting one cash flow",
        "Implement NPV in a short Python function",
        "Interpret outputs with scenario and sensitivity checks",
      ],
    ),
    {
      type: "h2",
      text: "Start with intuition before formulas",
    },
    {
      type: "p",
      text: "If someone offers you 100 today or 100 in one year, most people prefer 100 today. You can invest it, keep flexibility, and avoid uncertainty. Discounting turns that intuition into a number.",
    },
    {
      type: "p",
      text: "With discount rate `r`, one future cash flow `CF` at period `t` contributes `CF / (1 + r)^t` to present value. NPV is the sum of those discounted contributions.",
    },
    {
      type: "callout",
      variant: "note",
      text: "Teaching tip: keep periods explicit. If cash flows are yearly, `t=1` means end of year 1, `t=2` means end of year 2, and so on.",
    },
    {
      type: "code",
      title: "Compute NPV and inspect discounted terms",
      code: `def npv(rate: float, cashflows: list[float]) -> float:
    """cashflows[k] occurs at the end of period k+1."""
    total = 0.0
    for k, cf in enumerate(cashflows, start=1):
        discounted = cf / (1 + rate) ** k
        print(f"period={k}, raw={cf:.2f}, discounted={discounted:.2f}")
        total += discounted
    return total

project_flows = [-1000, 300, 420, 510]
result = npv(0.08, project_flows)
print(f"NPV = {result:.2f}")`,
    },
    {
      type: "h2",
      text: "Read the output like an analyst",
    },
    {
      type: "p",
      text: "The print lines show each period's contribution. Later periods should shrink more because they are discounted for longer. If they do not, check your period index.",
    },
    {
      type: "p",
      text: "The final NPV is the net value of all discounted flows. Positive NPV means value creation under your assumptions. Negative NPV means value destruction under those assumptions.",
    },
    {
      type: "p",
      text: "Interpretation should include scale and alternatives. A project with slightly positive NPV may still be dominated by another project with better risk profile, lower capital lock-up, or stronger strategic fit. NPV is one decision input, not the entire decision.",
    },
    {
      type: "h2",
      text: "Scenario and sensitivity check",
    },
    {
      type: "code",
      title: "Compare discount-rate assumptions",
      code: `flows = [-1000, 300, 420, 510]
for rate in [0.06, 0.08, 0.12]:
    print(f"rate={rate:.0%}, npv={npv(rate, flows):.2f}")`,
    },
    {
      type: "p",
      text: "This tiny loop prevents overconfidence. If your decision flips between 6 percent and 12 percent, the project is assumption-sensitive and needs careful discussion, not a single-number conclusion.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Discount rate: rate used to convert future cash flows into present-value terms.",
        "Present value: value today of money received in the future under a discount assumption.",
        "Sensitivity analysis: evaluating how conclusions change when assumptions vary.",
        "Scenario analysis: comparing coherent sets of assumptions such as base and conservative cases.",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "Common mistake: mixing monthly and yearly rates with yearly cash-flow periods. Rate frequency and period frequency must match.",
    },
    {
      type: "practice",
      title: "Your turn",
      steps: [
        "Add an input check that raises a clear error when `rate <= -1`, because division would break.",
        "Build a small list of scenario dicts (`name`, `rate`, `flows`) and print a ranked table by NPV.",
        "Write a one-paragraph interpretation: which assumption matters most, and what additional data would reduce uncertainty.",
      ],
    },
    check(
      "If you increase the discount rate while keeping future cash flows fixed, what usually happens to NPV, and why?",
    ),
  ],
};

export const lessonMonteCarloForDecisions: Lesson = {
  slug: "monte-carlo-for-decisions",
  title: "Monte Carlo for decisions under uncertainty",
  subtitle: subInt,
  summary:
    "Monte Carlo simulation converts uncertain inputs into outcome distributions. It is most useful when you need to compare strategies under downside risk, tail behavior, and model assumption stress.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Use `numpy.random.Generator` with a seed so results are reproducible",
    "Interpret mean and tail percentiles as different decision signals",
    "Explain why assumption choice matters as much as code correctness",
  ],
  practicePrompts: [
    "Simulate 10,000 yearly outcomes for two strategies with different win probabilities, then compare median and 10th percentile.",
    "Write two sentences: one for a risk-neutral reader (mean-focused) and one for a risk-averse reader (tail-focused).",
  ],
  keyTakeaways: [
    "Monte Carlo does not remove uncertainty, it makes uncertainty visible.",
    "Always document seed, distribution assumptions, and why those choices are defensible.",
    "Tail metrics can change decisions even when means look similar.",
    "Scenario transparency matters more than simulation size once draws are sufficiently large.",
  ],
  sections: [
    ...ql(
      "Draw many random futures, then read the whole distribution, not only the average.",
      [
        "Set up reproducible random draws",
        "Summarize outcomes with mean and percentiles",
        "Interpret results for real decision-making",
      ],
    ),
    {
      type: "h2",
      text: "Why this method matters",
    },
    {
      type: "p",
      text: "Many decisions are made with uncertain inputs, such as demand, defaults, or conversion rates. A single expected value hides risk. Monte Carlo lets you see both typical and bad-case outcomes.",
    },
    {
      type: "code",
      title: "Simulate yearly profit distribution (toy)",
      code: `import numpy as np

rng = np.random.default_rng(42)
n_sims = 20_000
n_trials = 100
p_win = 0.55
gain_if_win = 1.2
loss_if_lose = -1.0

wins = rng.binomial(1, p_win, size=(n_sims, n_trials))
profit_per_trial = np.where(wins == 1, gain_if_win, loss_if_lose)
year_profit = profit_per_trial.sum(axis=1)

print("mean", round(float(year_profit.mean()), 2))
print("median", round(float(np.percentile(year_profit, 50)), 2))
print("10th_pct", round(float(np.percentile(year_profit, 10)), 2))`,
    },
    {
      type: "h2",
      text: "How to interpret these numbers",
    },
    {
      type: "p",
      text: "The mean is the long-run average across simulated futures. The median is the middle outcome. The 10th percentile is a downside marker: 10 percent of simulations are worse than this.",
    },
    {
      type: "p",
      text: "If two strategies have similar means but different 10th percentiles, risk-sensitive teams often prefer the strategy with better downside protection.",
    },
    {
      type: "p",
      text: "In professional settings, report both central tendency and downside metrics in the same table. This keeps stakeholder discussions anchored to tradeoffs instead of single-number optimism.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Monte Carlo simulation: repeated random draws from stated distributions to generate outcome distributions.",
        "Percentile: cutoff below which a chosen share of simulated outcomes falls.",
        "Downside risk: magnitude or probability of unfavorable outcomes.",
        "Assumption set: explicit distributional and structural choices that define the simulation world.",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "Common mistake: presenting simulation outputs as predictions. They are conditional on your input assumptions, not guaranteed future truth.",
    },
    {
      type: "practice",
      title: "Your turn",
      steps: [
        "Add a second strategy with lower mean but lower downside risk. Compare both using mean and 10th percentile.",
        "Estimate `P(year_profit < 0)` for each strategy and explain which one you would pick under a conservative policy.",
      ],
    },
    check(
      "Why can two strategies with almost equal mean outcomes still imply very different decisions?",
    ),
  ],
};

export const lessonBacktestsAndOverfitting: Lesson = {
  slug: "backtests-and-overfitting",
  title: "Backtests, overfitting, and humility",
  subtitle: subAdv,
  summary:
    "A backtest is a historical simulation under assumptions about data, execution, and costs. Without strict separation of design and evaluation, backtests often overstate edge and understate fragility.",
  tier: "advanced",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Describe walk-forward validation in words",
    "List researcher degrees of freedom that inflate backtest returns",
    "Explain why execution assumptions can dominate modeled alpha",
  ],
  practicePrompts: [
    "Write a checklist of five questions you would ask a colleague who shows a 20% annualized backtest.",
  ],
  keyTakeaways: [
    "Transaction costs, borrow constraints, and corporate actions change realized performance.",
    "Multiple testing without correction rewards luck.",
    "Backtest credibility depends on process discipline as much as code quality.",
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
      type: "p",
      text: "Walk-forward structure reflects actual research workflow: you only know the past when setting rules. This temporal discipline is essential because many apparent strategies rely on future information leakage when evaluated with naive splits.",
    },
    {
      type: "h2",
      text: "Execution realism checklist",
    },
    {
      type: "ul",
      items: [
        "Include transaction costs and slippage assumptions.",
        "State turnover and capacity implications.",
        "Document data revisions and survivorship handling.",
      ],
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Walk-forward validation: repeated train-then-test over advancing time windows.",
        "Overfitting: learning patterns that do not generalize out of sample.",
        "Slippage: difference between intended execution price and realized price.",
        "Survivorship bias: bias from excluding assets or entities that disappeared.",
      ],
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
    "Large language models generate plausible text, not guaranteed truth. Production quality comes from retrieval grounding, constrained output formats, evaluation sets, and fallback behavior when model responses are weak or unsafe.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Sketch a request/response loop with system vs user messages",
    "List three failure modes you have personally seen in model outputs",
    "Define one measurable quality target for an LLM feature (for example citation validity rate)",
  ],
  practicePrompts: [
    "Write a policy: which user inputs may never be sent to a third-party API?",
  ],
  keyTakeaways: [
    "Temperature and top-p change creativity vs determinism; default low for extraction tasks.",
    "Log prompts and responses with redaction when debugging, not raw secrets.",
    "LLM systems need product metrics, not only prompt tweaks.",
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
      type: "p",
      text: "Grounding should be treated as an information-contract problem. The model is allowed to answer only from a bounded evidence set, and the system must verify that each claim is traceable to that evidence. Without this contract, high fluency can hide unsupported statements.",
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
      type: "h2",
      text: "Add measurable quality checks",
    },
    {
      type: "p",
      text: "Teams improve quality when they measure failure modes directly. Instead of saying the assistant feels better, define test cases and track pass rates by category: citation correctness, policy compliance, refusal behavior, and task completion. Measurement converts prompt iteration into engineering work.",
    },
    {
      type: "ul",
      items: [
        "Citation validity rate: share of answers where cited evidence actually supports the claim.",
        "Refusal quality: harmful or unsupported requests should fail safely with useful guidance.",
        "Task success rate: user can complete the intended workflow after one model response.",
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
    "Embeddings map content to vectors so semantic neighbors sit nearby. Retrieval quality depends on chunking, metadata filters, and evaluation protocol, not only on vector database choice.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Compute cosine similarity between two small vectors by hand in code",
    "Explain chunking tradeoffs for long documents",
    "Name at least two retrieval metrics used in offline evaluation",
  ],
  practicePrompts: [
    "Implement brute-force `top_k(query_vec, corpus_matrix)` with NumPy dot products and argsort.",
  ],
  keyTakeaways: [
    "Normalize vectors before cosine similarity if you use dot products.",
    "Vector databases optimize nearest neighbor at scale; start in-memory for learning.",
    "Retrieval should be evaluated with labeled queries, not only anecdotal prompts.",
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
      type: "p",
      text: "A strong retrieval system balances semantic recall and contextual precision. Chunks should contain a coherent unit of meaning, such as one claim with supporting detail, so that retrieved passages are both relevant and interpretable when shown to users.",
    },
    {
      type: "h2",
      text: "How to evaluate retrieval quality",
    },
    {
      type: "p",
      text: "Evaluation should use representative query sets from real tasks, not synthetic questions only. If users ask multi-step questions, a retrieval benchmark with single-fact queries will overestimate field performance. Alignment between evaluation data and production demand is essential.",
    },
    {
      type: "ul",
      items: [
        "Recall@k: did any relevant chunk appear in the top-k?",
        "MRR (mean reciprocal rank): how early did the first relevant chunk appear?",
        "nDCG: rewards ranked lists that place multiple relevant chunks near the top.",
      ],
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Token-count a paragraph with a tokenizer from `tiktoken` for OpenAI models or `transformers` if installed; compare counts for two chunk sizes.",
        "Create five labeled query -> relevant chunk pairs and compute recall@3 manually.",
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
    "Treat prompts as sensitive data flows. Mature AI systems combine data minimization, redaction, safety policy enforcement, and incident response playbooks so failures degrade safely instead of exposing users or organizations.",
  tier: "advanced",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Write a data classification table: public, internal, restricted",
    "Plan backoff and user-visible errors when the model API times out",
    "Define one security control for prompt injection and one for secret exfiltration",
  ],
  practicePrompts: [
    "List five fields that must never be logged verbatim from user forms in a health application.",
  ],
  keyTakeaways: [
    "EU GDPR and similar regimes care about purpose limitation and deletion timelines.",
    "Adversarial prompts happen; combine allowlists, output filters, and human review.",
    "Safety is a system property that includes model choice, tooling, and operational controls.",
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
      type: "p",
      text: "Logging should be purpose-limited. Keep only what is needed for reliability, abuse detection, and legal obligations, then define retention windows explicitly. Undisciplined logs become a hidden liability because they combine sensitive content with broad internal access.",
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
      type: "h2",
      text: "Threat model starter for AI features",
    },
    {
      type: "ul",
      items: [
        "Prompt injection: malicious text tries to override instructions or leak hidden data.",
        "Data exfiltration: model output includes secrets from context or tool results.",
        "Tool abuse: model is tricked into unsafe API calls or actions.",
      ],
    },
    {
      type: "p",
      text: "For each threat, define prevention, detection, and response. Example: prevent with scoped tool permissions, detect with anomaly alerts, respond with automatic feature disable plus human review.",
    },
    {
      type: "h2",
      text: "Operational governance essentials",
    },
    {
      type: "ul",
      items: [
        "Own a model change log: what changed, why, and expected risk impact.",
        "Maintain incident severity levels with response timelines and escalation paths.",
        "Run periodic red-team style tests against current prompts, tools, and policies.",
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
    "Randomized experiments estimate causal effects by assigning treatment with chance, so groups are comparable on average. Good analysis then focuses on effect size, uncertainty, and precommitted rules.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Simulate an A/B test and compute an average treatment effect estimate",
    "Explain in plain language why randomization supports causal interpretation",
    "Explain why repeated peeking inflates false positives",
  ],
  practicePrompts: [
    "Run many null simulations (true lift = 0) and compare false-positive rates under fixed sample size versus repeated peeking.",
    "Write a short analysis note that reports estimate, uncertainty, and one design limitation.",
  ],
  keyTakeaways: [
    "Randomization is a design choice that gives causal leverage, not a statistical decoration.",
    "Always report uncertainty with the estimate, not estimate alone.",
    "Stopping-rule discipline is essential if you want trustworthy p-values.",
    "Effect size should be interpreted with baseline context and operational constraints.",
  ],
  sections: [
    ...ql(
      "A/B tests use random assignment so observed differences can be interpreted causally on average.",
      [
        "Simulate treatment assignment and outcomes",
        "Estimate effect size and uncertainty",
        "Understand why peeking can trick you",
      ],
    ),
    {
      type: "h2",
      text: "Design first, statistics second",
    },
    {
      type: "p",
      text: "Before running code, define your outcome, sample size target, and stopping rule. If these change after seeing results, your reported significance can become misleading.",
    },
    {
      type: "code",
      title: "Simulate and estimate average treatment effect (toy)",
      code: `import numpy as np

rng = np.random.default_rng(7)
n = 600
treatment = rng.binomial(1, 0.5, size=n).astype(bool)

baseline = rng.normal(10.0, 1.5, size=n)
true_lift = 0.4
noise = rng.normal(0, 0.7, size=n)
outcome = baseline + true_lift * treatment + noise

treated_mean = outcome[treatment].mean()
control_mean = outcome[~treatment].mean()
ate_hat = treated_mean - control_mean
print("estimated_lift", round(float(ate_hat), 3))`,
    },
    {
      type: "h2",
      text: "From estimate to decision",
    },
    {
      type: "p",
      text: "The difference in means is your effect estimate. Next you need uncertainty, often confidence intervals or standard errors, before claiming a win.",
    },
    {
      type: "p",
      text: "For approximately normal continuous outcomes, a two-sample t-test is a common start. For proportions, use methods designed for rates, such as Wilson intervals or logistic models.",
    },
    {
      type: "p",
      text: "In practical A/B testing, decision quality depends on more than significance. Teams should define minimum meaningful effect, expected implementation cost, and downside risk before declaring a rollout. A small positive estimate may still be unhelpful if it does not offset operational burden.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Average treatment effect: mean outcome difference attributable to assignment.",
        "Power: probability that the test detects a real effect of chosen size.",
        "Type I error: false positive claim when true effect is zero.",
        "Sequential peeking: repeated significance checks before planned sample size is reached.",
      ],
    },
    {
      type: "h2",
      text: "A compact reporting standard",
    },
    {
      type: "ol",
      items: [
        "Report baseline level and effect size in original units.",
        "Report uncertainty interval and sample size by group.",
        "State stopping rule and any deviations from pre-analysis plan.",
        "State one plausible external-validity limit.",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "Common mistake: checking p-values repeatedly and stopping when one dips below 0.05. This inflates false positives unless your design accounts for sequential looks.",
    },
    {
      type: "practice",
      title: "Your turn",
      steps: [
        "Wrap the simulation in `simulate_once(n, true_lift)` and run it 1000 times for `true_lift = 0.0`. Count how often you would falsely claim a win.",
        "Repeat with fixed sample size and no peeking. Compare false-positive rates.",
        "Write three lines: effect estimate, uncertainty summary, and one limitation of this toy setup.",
      ],
    },
    check(
      "Why does random assignment help causal interpretation even when treated and control means differ by chance in one realized sample?",
    ),
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
    "Text preprocessing choices are measurement choices, not only engineering choices.",
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
      type: "p",
      text: "Methodological quality in text analysis starts with transparent preprocessing decisions. Lowercasing, punctuation handling, token boundaries, and stopword choices change the measured representation of language. Document those decisions because they affect reproducibility and interpretation.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Tokenization: splitting raw text into analysis units such as words or subwords.",
        "Normalization: transforming text into a consistent representation.",
        "Stopwords: high-frequency words often removed for specific tasks.",
        "Bag-of-words: representation based on token counts without word order.",
      ],
    },
    {
      type: "h2",
      text: "Interpretation caution",
    },
    {
      type: "p",
      text: "A text model can detect association patterns in language use, but association is not causal explanation. If one group uses more of a term, that pattern may reflect context, demographics, platform norms, or measurement artifacts. Treat text outputs as evidence to investigate, not final causal conclusions.",
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
