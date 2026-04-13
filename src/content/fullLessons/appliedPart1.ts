import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "";
const subAdv = "";

export const lessonReproducibleResearchHabits: Lesson = {
  slug: "reproducible-research-habits",
  title: "Reproducible research habits in Python",
  subtitle: subInt,
  summary:
    "Reproducibility means another person (or future you) can rebuild results from recorded code, data versions, and environment pins. Python is one layer; habits are the rest.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Separate raw data, cleaned tables, figures, and scripts in a predictable folder layout",
    "Set random seeds where stochastic algorithms appear",
  ],
  practicePrompts: [
    "Create `project/` with `data/raw`, `data/processed`, `notebooks`, `src`, `outputs/figs`. Add a one-line README describing how to regenerate figures.",
  ],
  keyTakeaways: [
    "`python -m pip freeze > requirements.txt` captures a snapshot; prefer explicit pins for serious work.",
    "Treat Jupyter outputs as disposable unless you export figures via code paths.",
  ],
  sections: [
    ...ql(
      "Reproducible means: same code + same data + same environment pins gives the same results you published.",
      [
        "Separate raw, processed, figures, and source",
        "Set seeds where randomness appears",
        "Pick notebooks vs scripts deliberately",
      ],
    ),
    {
      type: "callout",
      variant: "warn",
      text: "Never edit raw data in place. Copy to `processed/` and document transforms in scripts or notebooks with cell outputs cleared before git commit.",
    },
    {
      type: "h2",
      text: "One-command rebuild mindset",
    },
    {
      type: "code",
      title: "Tiny reproducible driver",
      code: `# run_all.py\nimport random\nimport numpy as np\n\nSEED = 42\nrandom.seed(SEED)\nnp.random.seed(SEED)\n\ndef main() -> None:\n    xs = np.random.normal(size=5)\n    print(\"draw\", np.round(xs, 4))\n\nif __name__ == \"__main__\":\n    main()`,
    },
    {
      type: "p",
      text: "NumPy and many libraries read the global RNG state. For larger studies prefer explicit `Generator` objects (`np.random.default_rng(SEED)`) so streams do not collide silently.",
    },
    {
      type: "h2",
      text: "When notebooks are enough",
    },
    {
      type: "ul",
      items: [
        "Exploration, plotting, teaching: notebooks shine.",
        "Scheduled jobs, CLIs, and libraries: move logic into importable `.py` files.",
      ],
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Install `numpy` in a venv, run the driver twice, change `SEED`, and confirm outputs shift predictably.",
      ],
    },
    check("Name two things besides code that must be frozen for a paper to reproduce."),
  ],
};

export const lessonArraysTablesAndMeasurements: Lesson = {
  slug: "arrays-tables-and-measurements",
  title: "Arrays, tables, and measurements (NumPy and pandas shape)",
  subtitle: subInt,
  summary:
    "NumPy arrays hold homogeneous numeric data in contiguous blocks for speed. pandas `DataFrame` adds labeled columns for heterogeneous tabular work common in science and economics.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Perform elementwise math on arrays and reduce along an axis",
    "Load a CSV into pandas, select columns, and compute grouped means",
  ],
  practicePrompts: [
    "Read a small CSV with `read_csv`, drop missing values in one column, and plot a histogram of another column.",
  ],
  keyTakeaways: [
    "Broadcasting lets arrays of different shapes combine when trailing dimensions align or are 1.",
    "Avoid chained indexing like `df[df.A > 0][\"B\"] = ...` (assignment pitfalls); use `.loc`.",
  ],
  sections: [
    ...ql(
      "NumPy is fast homogeneous arrays; pandas adds labeled columns for messy real tables.",
      [
        "Elementwise math vs dot products",
        "Groupby summaries",
        "Tidy shape for plotting and models",
      ],
    ),
    {
      type: "callout",
      variant: "note",
      text: "Install stack: `pip install numpy pandas matplotlib`. Versions change; pin when a paper depends on them.",
    },
    {
      type: "code",
      title: "NumPy basics",
      code: `import numpy as np\n\na = np.array([1.0, 2.0, 3.0])\nb = np.array([10.0, 20.0, 30.0])\nprint(a * b)          # elementwise\nprint(a @ b)          # dot product\nprint(a.mean(), a.std(ddof=1))`,
    },
    {
      type: "code",
      title: "pandas groupby",
      code: `import pandas as pd\n\ndf = pd.DataFrame({\n    \"region\": [\"N\", \"N\", \"S\", \"S\"],\n    \"score\": [88, 92, 79, 85],\n})\nprint(df.groupby(\"region\")[\"score\"].mean())`,
    },
    {
      type: "h2",
      text: "Tidy vs wide",
    },
    {
      type: "p",
      text: "Tidy data: one variable per column, one observation per row. Wide pivots help human tables; tidy shapes help plotting and modeling APIs.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Create a 100-row `DataFrame` with columns `t` (0..99) and `y = 0.1*t + noise`. Plot `y` against `t` with matplotlib.",
      ],
    },
    check("Why is chained `df[mask][\"col\"] = x` risky compared to `.loc`?"),
  ],
};

export const lessonVisualizationForEvidence: Lesson = {
  slug: "visualization-for-evidence",
  title: "Visualization for evidence, not decoration",
  subtitle: subInt,
  summary:
    "Figures should answer a question. Label axes with units, show sample size or uncertainty when relevant, and default to uncluttered scales readers can trust.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Build a labeled scatter or line plot and save to a file path from code",
    "Choose color palettes that remain legible when printed grayscale",
  ],
  practicePrompts: [
    "Add horizontal error bars or a text annotation with `n=` sample size on one plot.",
  ],
  keyTakeaways: [
    "`plt.savefig` should set `dpi` explicitly for publication targets.",
    "For interactive exploration, matplotlib is fine; for dashboards consider plotly after you outgrow static exports.",
  ],
  sections: [
    ...ql(
      "A good figure states claim, axes, units, and uncertainty; decoration without those fails peer review.",
      [
        "Build one honest line plot",
        "Save with explicit dpi",
        "Choose encoding that matches the claim",
      ],
    ),
    {
      type: "code",
      title: "Minimal publication-style plot",
      code: `import matplotlib.pyplot as plt\n\nxs = [0, 1, 2, 3]\nys = [1.1, 1.9, 3.2, 3.9]\nplt.figure(figsize=(4, 3))\nplt.plot(xs, ys, marker=\"o\")\nplt.xlabel(\"Time (days)\")\nplt.ylabel(\"Response (a.u.)\")\nplt.title(\"Pilot run A\")\nplt.tight_layout()\nplt.savefig(\"outputs/figs/pilot_a.png\", dpi=200)`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "Dual y-axes often mislead readers unless scales are carefully justified. Prefer normalizing series or two stacked panels.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Plot the same data as a bar chart and decide which encoding matches the claim you want to make.",
      ],
    },
    check("What is missing if a plot shows relative change but no sample size or date range?"),
  ],
};

export const lessonLinearModelsInferenceStatsmodels: Lesson = {
  slug: "linear-models-inference-statsmodels",
  title: "Linear models and inference with statsmodels (shape of the craft)",
  subtitle: subInt,
  summary:
    "statsmodels emphasizes estimation plus inference: standard errors, p-values, confidence intervals. Treat output as something you must translate into domain language.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Fit an OLS model with a formula string and interpret coefficients at a high level",
    "Name two reasons standard errors change (heteroskedasticity, clustering) without deriving formulas",
  ],
  practicePrompts: [
    "Fit `y ~ x` on simulated data where you know the true slope; compare the estimated slope to truth.",
  ],
  keyTakeaways: [
    "`smf.ols(..., data=df).fit()` returns a `Results` object rich with diagnostics.",
    "Statistical assumptions are not Python's job: the code will run even when assumptions fail.",
  ],
  sections: [
    ...ql(
      "OLS fits a weighted sum of predictors; standard errors answer how noisy that fit is under stated assumptions.",
      [
        "Fit `smf.ols` on simulated truth",
        "Read coefficients vs ground truth",
        "Know SE choice matters in real data",
      ],
    ),
    {
      type: "callout",
      variant: "note",
      text: "Install: `pip install statsmodels pandas`. This lesson is methods education, not econometric advice for a specific policy decision.",
    },
    {
      type: "code",
      title: "OLS with formula API",
      code: `import numpy as np\nimport pandas as pd\nimport statsmodels.formula.api as smf\n\nrng = np.random.default_rng(0)\nn = 200\nx = rng.normal(size=n)\neps = rng.normal(scale=0.5, size=n)\ny = 2.0 + 1.5 * x + eps\n\ndf = pd.DataFrame({\"y\": y, \"x\": x})\nmodel = smf.ols(\"y ~ x\", data=df).fit()\nprint(model.summary())`,
    },
    {
      type: "h2",
      text: "Which standard errors?",
    },
    {
      type: "p",
      text: "Homoskedasticity-classic SEs, HC robust variants, and cluster-robust SEs answer different data-generating stories. Read the statsmodels docs for `cov_type` options when you move beyond toy lines.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add a binary column `d` to the simulated data, refit `y ~ x + d`, and explain the intercept change in words.",
      ],
    },
    check("If coefficients move wildly when you change `cov_type`, what does that say about your assumptions?"),
  ],
};

export const lessonTimeSeriesAndPanelsIntro: Lesson = {
  slug: "time-series-and-panels-intro",
  title: "Time series and panels: when you need them",
  subtitle: subInt,
  summary:
    "Time order matters: shocks persist, seasons repeat, and policies phase in. Panels add another index (entity) so you must respect both dimensions before modeling.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Parse dates with pandas and compute simple growth rates safely",
    "Describe fixed effects as \"one intercept per unit\" intuition",
  ],
  practicePrompts: [
    "With `df` sorted by `country` then `year`, compute year-over-year percent change of `gdp` within each country using `groupby` + `pct_change`.",
  ],
  keyTakeaways: [
    "Plot the series first. Models are downstream of eyes.",
    "Naive regression on levels can imply nonsense dynamics; differences or explicit dynamics models exist for a reason.",
  ],
  sections: [
    ...ql(
      "Time adds dependence: yesterday influences today; panels add another index (entity) you must sort and group correctly.",
      [
        "Parse a `DatetimeIndex` and inspect returns",
        "Resample consciously",
        "Name panel long format",
      ],
    ),
    {
      type: "code",
      title: "Synthetic daily series (no network)",
      code: `import numpy as np\nimport pandas as pd\n\nrng = np.random.default_rng(0)\nidx = pd.date_range(\"2020-01-01\", periods=120, freq=\"B\")\nprice = 100 + np.cumsum(rng.normal(0, 0.6, size=len(idx)))\ndf = pd.DataFrame({\"price\": price}, index=idx)\nprint(df.head())\nprint(df[\"price\"].pct_change().describe())`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "Synthetic prices teach pandas mechanics only. Real markets need domain models, compliance, and data vendors. Nothing here is trading or investment advice.",
    },
    {
      type: "h2",
      text: "Panels in one sentence each",
    },
    {
      type: "ul",
      items: [
        "Long format: one row per (entity, time) measurement.",
        "Fixed effects soak up stable differences across entities so you can focus on within variation (when assumptions allow).",
      ],
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Resample `df` to monthly mean price using `.resample(\"ME\").mean()` (month-end; older pandas used `M`).",
      ],
    },
    check("Why must `pct_change` usually follow `groupby` when multiple entities share one dataframe?"),
  ],
};

export const lessonCausalQuestionsBeforePackages: Lesson = {
  slug: "causal-questions-before-packages",
  title: "Causal questions before fancy packages",
  subtitle: subAdv,
  summary:
    "Vocabulary and habits for asking whether a claim is causal, not a full causal inference course. Packages run math; identification lives in study design, assumptions, and domain knowledge. Sketch what you would compare under randomization and draw a DAG before reaching for new tools.",
  tier: "advanced",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "List confounders that open a backdoor between treatment and outcome",
    "Recognize when a DAG makes a policy lever identifiable from observational data",
  ],
  practicePrompts: [
    "Sketch a three-node DAG on paper: treatment, outcome, confounder. Write one sentence per edge about sign and lag.",
  ],
  keyTakeaways: [
    "Regression coefficients condition on whatever you put in the model; omitted variables still hurt.",
    "Sensitivity analyses (placebo tests, alternative specs) belong in the workflow, not as afterthoughts.",
  ],
  sections: [
    ...ql(
      "No package turns correlation into causation; draw the story of the world first, then pick tools.",
      [
        "Separate selection from confounding",
        "See why experiments break confounding on average",
        "Write a critique without new installs",
      ],
    ),
    {
      type: "callout",
      variant: "warn",
      text: "Expect to study causal inference properly (books, coursework, advisors) if your job depends on causal claims. This lesson orients you so API tutorials make sense; it cannot replace careful identification work.",
    },
    {
      type: "h2",
      text: "Selection vs confounding",
    },
    {
      type: "p",
      text: "Selection: who enters the sample differs systematically. Confounding: a third variable drives both treatment and outcome. Different fixes, same symptom: biased naive comparisons.",
    },
    {
      type: "h2",
      text: "When experiments help",
    },
    {
      type: "p",
      text: "Random assignment breaks confounding links on average. In code, analyze experiments with simple differences or regression with treatment indicators; keep preregistration and intent-to-treat concepts in your head even if this lesson stays code-light.",
    },
    {
      type: "callout",
      variant: "tip",
      text: "Python packages like `dowhy`, `econml`, or `linearmodels` exist for serious work. Learn the identification story first, then map it to an API.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Write 200 words critiquing a headline causal claim from the news using only vocabulary from this lesson (no new package installs required).",
      ],
    },
    check("If a regression controls for a collider, what can happen to coefficients even with a huge sample?"),
  ],
};

export const lessonPredictionVsExplanationMindset: Lesson = {
  slug: "prediction-vs-explanation-mindset",
  title: "Prediction mindset vs explanation mindset",
  subtitle: subInt,
  summary:
    "A short map of two goals: prediction scores how well you fill unknown labels; explanation asks which inputs move the outcome under a model's assumptions. One workflow can support both, but the metrics and pitfalls differ. Follow with dedicated ML coursework if you build production models.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Pick a metric aligned with costs of false positives vs false negatives",
    "Describe calibration in plain language",
  ],
  practicePrompts: [
    "For a skewed medical screening story, argue for precision vs recall as headline metric.",
  ],
  keyTakeaways: [
    "Accuracy hides imbalance; inspect confusion matrices.",
    "Calibration matters when probabilities drive decisions (thresholds on predicted risk).",
  ],
  sections: [
    ...ql(
      "Prediction asks how well labels fill in; explanation asks what the fitted model emphasizes; pick metrics accordingly.",
      [
        "Contrast churn prediction vs driver analysis",
        "See why accuracy can mislead",
        "Link to calibration and thresholds",
      ],
    ),
    {
      type: "callout",
      variant: "note",
      text: "Machine learning is a large field. These applied lessons stress honest evaluation and clear questions, not comprehensive theory (optimization, generalization bounds, architecture design, etc.).",
    },
    {
      type: "h2",
      text: "Same model, two questions",
    },
    {
      type: "ul",
      items: [
        "Prediction: will this customer churn in 30 days?",
        "Explanation: which product behaviors associate with churn in our fitted model?",
      ],
    },
    {
      type: "callout",
      variant: "note",
      text: "Interpretability tools (SHAP, partial dependence) summarize models; they are not automatic causal truth.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "List three decisions at your job or school where a probability forecast would help more than a single yes/no model output.",
      ],
    },
    check("When is high accuracy compatible with useless deployment decisions?"),
  ],
};

export const lessonScikitLearnPipelines: Lesson = {
  slug: "scikit-learn-pipelines",
  title: "scikit-learn pipelines and preprocessing",
  subtitle: subInt,
  summary:
    "Hands-on pattern: a `Pipeline` chains steps so preprocessing parameters are learned only from training data during cross-validation, which blocks a common leakage mistake. Enough to follow sklearn docs; model choice and tuning strategy still need deeper study.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Fit a `Pipeline` with preprocessing plus classifier on synthetic data",
    "Explain why `fit` must not see test rows",
  ],
  practicePrompts: [
    "Wrap the example pipeline in `GridSearchCV` tuning `C` for logistic regression (small grid).",
  ],
  keyTakeaways: [
    "`pipeline.named_steps` documents the chain; use meaningful step names.",
    "`ColumnTransformer` routes different columns through different preprocessors.",
  ],
  sections: [
    ...ql(
      "Pipelines bundle preprocess + model so anything learned from training data never sneaks in from the test split.",
      [
        "Fit preprocessing only on train",
        "Evaluate on held-out rows",
        "Serialize the whole chain for serving",
      ],
    ),
    {
      type: "callout",
      variant: "note",
      text: "Install: `pip install scikit-learn`. This example uses synthetic data only.",
    },
    {
      type: "code",
      title: "Pipeline with scaling",
      code: `import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(0)\nX = rng.normal(size=(500, 4))\nlogits = 0.7 * X[:, 0] + 0.3 * X[:, 1]\nprobs = 1 / (1 + np.exp(-logits))\ny = (rng.random(500) < probs).astype(int)\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=0, stratify=y\n)\n\npipe = Pipeline([\n    (\"scale\", StandardScaler()),\n    (\"clf\", LogisticRegression(max_iter=200)),\n])\npipe.fit(X_train, y_train)\nprint(\"accuracy\", pipe.score(X_test, y_test))`,
    },
    {
      type: "h2",
      text: "Serving matches training",
    },
    {
      type: "p",
      text: "Serialize the entire `Pipeline` (joblib) so production uses the same scaling constants learned in training.",
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Add `from sklearn.metrics import classification_report` and print metrics on the test split.",
      ],
    },
    check("What breaks if you `fit` a `StandardScaler` on the full dataset before splitting?"),
  ],
};

export const lessonMlEvaluationAndLeakage: Lesson = {
  slug: "ml-evaluation-and-leakage",
  title: "Evaluation, leakage, and reality checks",
  subtitle: subAdv,
  summary:
    "Why naive validation lies: leakage from future data, duplicated rows, or mistimed features. Sketch time-aware and group-wise splits and always compare to a dumb baseline. A primer on evaluation hygiene, not a full experimental-design course.",
  tier: "advanced",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Implement a time-aware split sketch for ordered observations",
    "Name three feature types that often leak target information",
  ],
  practicePrompts: [
    "Write pseudocode for `GroupKFold` when rows share a user id.",
  ],
  keyTakeaways: [
    "Target encoding without inner-CV leaks badly when computed on the full set.",
    "Always compare against a dumb baseline (majority class, last value forecast).",
  ],
  sections: [
    ...ql(
      "Leakage = features built with knowledge from the future or the label; validation then lies.",
      [
        "Name classic leakage shapes",
        "Sketch time-aware splits",
        "Compare honest vs optimistic validation",
      ],
    ),
    {
      type: "callout",
      variant: "note",
      text: "Teams shipping ML spend serious effort on data contracts, monitoring drift, and offline vs online metrics. Treat this lesson as a checklist starter, not the end of the story.",
    },
    {
      type: "h2",
      text: "Classic leakage examples",
    },
    {
      type: "ul",
      items: [
        "Future aggregates merged back into past rows.",
        "Duplicate rows across train and test.",
        "Identifiers that proxy for the label indirectly.",
      ],
    },
    {
      type: "code",
      title: "Time-ordered split sketch",
      code: `import numpy as np\n\ndef time_split_indices(dates, frac_train=0.7):\n    order = np.argsort(dates)\n    cut = int(len(order) * frac_train)\n    train_idx = order[:cut]\n    test_idx = order[cut:]\n    return train_idx, test_idx`,
    },
    {
      type: "practice",
      title: "Lab",
      steps: [
        "Take a public tabular dataset with a date column. Fit two models: random split vs time split. Compare validation accuracy and discuss which is honest for deployment.",
      ],
    },
    check("Why is a random 80/20 split often wrong for time-ordered fraud or finance labels?"),
  ],
};
