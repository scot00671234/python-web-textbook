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
    "statsmodels emphasizes estimation with inference, including standard errors and confidence intervals. The core skill is not pressing fit, it is connecting coefficients to a research question, assumptions, and decision context.",
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
    "Coefficient interpretation should always specify unit, conditioning set, and uncertainty.",
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
      type: "p",
      text: "In applied econometrics, uncertainty choice is part of model design. If errors are correlated within schools, firms, or regions, cluster-robust uncertainty at that level is often more credible than assuming independent residuals.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Coefficient: estimated change in the outcome linked to one-unit change in a predictor, holding others fixed in the model.",
        "Standard error: estimated uncertainty of the coefficient under chosen assumptions.",
        "Confidence interval: a range of plausible coefficient values under the model and sampling assumptions.",
        "Heteroskedasticity: error variability differs across observations.",
      ],
    },
    {
      type: "h2",
      text: "From coefficient table to evidence",
    },
    {
      type: "ol",
      items: [
        "State the estimand in words before reading the table.",
        "Translate coefficient scale into domain units.",
        "Report interval estimates, not only significance stars.",
        "Name one threat to validity and one robustness check.",
      ],
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
    "Time order matters because observations carry memory, seasonality, and policy timing. Panel data adds an entity dimension, so good analysis must preserve both temporal order and unit identity before estimation.",
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
    "Panel methods succeed when indexing and timing are correct, not when formulas look advanced.",
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
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Time series: observations indexed by time for one unit.",
        "Panel data: observations indexed by both entity and time.",
        "Fixed effects: unit-specific intercepts that absorb time-invariant differences.",
        "Resampling: aggregating time-indexed data into a new frequency such as weekly or monthly.",
      ],
    },
    {
      type: "p",
      text: "A practical discipline is to audit panel integrity before modeling: each row should represent one entity-time observation, each entity should have interpretable coverage, and missing periods should be documented because they can bias trend interpretation.",
    },
    {
      type: "h2",
      text: "Frequent mistakes in early panel work",
    },
    {
      type: "ul",
      items: [
        "Mixing levels and growth rates in one regression without clear interpretation.",
        "Computing lags across entity boundaries because sorting was incomplete.",
        "Treating irregularly spaced observations as if intervals were equal.",
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
    "This lesson builds causal discipline before software choice. Packages implement estimators, but identification comes from design logic, assumptions, and domain knowledge. A clear counterfactual story should exist before model specification begins.",
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
    "Credible causal work starts with a transparent estimand and identification argument.",
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
      type: "p",
      text: "This distinction affects method choice. Selection into sample may require redesigning data collection or weighting. Confounding may require design changes, stronger controls, or quasi-experimental structure. Treating both as generic bias can lead to incorrect fixes.",
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
      type: "h2",
      text: "Minimal causal design checklist",
    },
    {
      type: "ol",
      items: [
        "Define treatment timing and assignment mechanism.",
        "Define outcome window and measurement process.",
        "State primary estimand and target population.",
        "State one falsification or placebo test.",
      ],
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Estimand: the specific causal quantity you want to estimate.",
        "Confounder: variable that influences both treatment and outcome.",
        "Collider: common effect of two causes, which can induce bias if controlled improperly.",
        "Placebo test: diagnostic where no effect should appear if design assumptions are valid.",
      ],
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
    "Prediction asks how well you forecast unseen outcomes under deployment-like conditions. Explanation asks how model outputs change with features under explicit assumptions. The workflows overlap, but metric choice, validation design, and communication duties are different in professional ML teams.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Pick a metric aligned with costs of false positives vs false negatives",
    "Describe calibration in plain language",
    "Differentiate ranking quality (AUC) from probability quality (Brier/log loss)",
  ],
  practicePrompts: [
    "For a skewed medical screening story, argue for precision vs recall as headline metric.",
  ],
  keyTakeaways: [
    "Accuracy hides imbalance; inspect confusion matrices.",
    "Calibration matters when probabilities drive decisions (thresholds on predicted risk).",
    "A model can rank well and still produce badly calibrated probabilities.",
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
      type: "p",
      text: "In professional settings, confusion starts when teams use one model output for two different decisions. Product teams may need ranked priorities for intervention, while policy or operations teams may need calibrated probabilities for budgeting and staffing. The algorithm can be identical, but the evidence standard is not.",
    },
    {
      type: "ul",
      items: [
        "Prediction: will this customer churn in 30 days?",
        "Explanation: which product behaviors associate with churn in our fitted model?",
      ],
    },
    {
      type: "p",
      text: "Explanation language should stay disciplined. A feature with strong importance in a predictive model means the model relied on it for forecast accuracy in this dataset. It does not, by itself, prove that changing that feature will change outcomes in the real world.",
    },
    {
      type: "callout",
      variant: "note",
      text: "Interpretability tools (SHAP, partial dependence) summarize models; they are not automatic causal truth.",
    },
    {
      type: "h2",
      text: "Metrics for different decision types",
    },
    {
      type: "p",
      text: "Metric choice should be linked to consequence, not habit. A fraud team that misses true fraud cases may prioritize recall. A clinical triage model with limited specialist capacity may prioritize precision at the top of the queue. Choosing metrics without decision context produces attractive dashboards with weak operational value.",
    },
    {
      type: "ul",
      items: [
        "Ranking decision: use AUC-ROC or precision-recall AUC when class imbalance is strong.",
        "Probability decision: inspect Brier score or log loss, then check calibration plots.",
        "Threshold decision: report confusion matrix at the chosen threshold, not only at 0.5.",
      ],
    },
    {
      type: "code",
      title: "Threshold-sensitive reporting sketch",
      code: `import numpy as np
from sklearn.metrics import precision_score, recall_score, f1_score

y_true = np.array([1, 0, 1, 0, 1, 0, 0, 1])
y_prob = np.array([0.92, 0.61, 0.55, 0.40, 0.49, 0.31, 0.20, 0.79])

for t in [0.3, 0.5, 0.7]:
    y_pred = (y_prob >= t).astype(int)
    print(
        f"threshold={t:.1f}",
        "precision=", round(precision_score(y_true, y_pred), 3),
        "recall=", round(recall_score(y_true, y_pred), 3),
        "f1=", round(f1_score(y_true, y_pred), 3),
    )`,
    },
    {
      type: "callout",
      variant: "tip",
      text: "When reporting model quality, include one ranking metric, one threshold metric at the deployment cutoff, and one calibration metric. This three-part view prevents overconfident claims from a single number.",
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
    "Production ML needs repeatable preprocessing and evaluation. `Pipeline` and `ColumnTransformer` keep transformations tied to folds and train data only, which prevents leakage and makes deployment behavior match training behavior.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Fit a `Pipeline` with preprocessing plus classifier on synthetic data",
    "Explain why `fit` must not see test rows",
    "Use cross-validation on a full pipeline, not on preprocessed arrays built outside folds",
  ],
  practicePrompts: [
    "Wrap the example pipeline in `GridSearchCV` tuning `C` for logistic regression (small grid).",
  ],
  keyTakeaways: [
    "`pipeline.named_steps` documents the chain; use meaningful step names.",
    "`ColumnTransformer` routes different columns through different preprocessors.",
    "Treat the pipeline object as the deployable artifact, not only the final estimator.",
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
      type: "p",
      text: "This point is central in real ML operations. If preprocessing logic is reimplemented manually in a service layer, small mismatches accumulate: different missing-value defaults, changed category handling, or stale feature order. Packaging preprocessing and model steps together reduces that operational risk.",
    },
    {
      type: "h2",
      text: "Fold-safe model selection",
    },
    {
      type: "p",
      text: "Tune hyperparameters with cross-validation around the full pipeline. If scaling or encoding happens outside CV, validation is optimistic because fold boundaries were ignored.",
    },
    {
      type: "p",
      text: "A practical mental model is this: every transformation that can learn from data must be treated as a model component and fit only within training folds. This includes scaling, imputation, target encoding, dimensionality reduction, and feature selection.",
    },
    {
      type: "code",
      title: "Cross-validate the whole pipeline",
      code: `from sklearn.model_selection import StratifiedKFold, cross_val_score

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
scores = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc")
print("cv_auc_mean", round(float(scores.mean()), 3))
print("cv_auc_std", round(float(scores.std()), 3))`,
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
    "Most disappointing ML launches fail at evaluation hygiene, not model architecture. This lesson covers leakage patterns, split design, baseline discipline, and why offline scores must be interpreted next to deployment constraints.",
  tier: "advanced",
  isPractical: true,
  readingTimeMinutes: 18,
  objectives: [
    "Implement a time-aware split sketch for ordered observations",
    "Name three feature types that often leak target information",
    "Plan one offline-to-online sanity check before shipping",
  ],
  practicePrompts: [
    "Write pseudocode for `GroupKFold` when rows share a user id.",
  ],
  keyTakeaways: [
    "Target encoding without inner-CV leaks badly when computed on the full set.",
    "Always compare against a dumb baseline (majority class, last value forecast).",
    "Use split strategy that matches real deployment timing and entity boundaries.",
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
      type: "p",
      text: "Leakage usually appears when feature engineering is faster than data governance. Analysts join tables that contain post-outcome updates, include labels created by downstream workflows, or compute aggregates over windows that extend past prediction time. The model then learns information that would not exist at decision time.",
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
      type: "h2",
      text: "Split strategy by deployment reality",
    },
    {
      type: "p",
      text: "The split is an argument about future use. If the model predicts next month from this month, validation should mimic that temporal boundary. If the model predicts for new users, avoid placing the same user in both train and test. Evaluation should mirror deployment, not only optimize sample efficiency.",
    },
    {
      type: "ul",
      items: [
        "Time-dependent labels: train on past, validate on future windows.",
        "Repeated entities (users, patients, firms): use group-aware splits to avoid same-entity bleed.",
        "Rare events: stratify where valid, but never violate temporal order to force balance.",
      ],
    },
    {
      type: "code",
      title: "Time-ordered split sketch",
      code: `import numpy as np\n\ndef time_split_indices(dates, frac_train=0.7):\n    order = np.argsort(dates)\n    cut = int(len(order) * frac_train)\n    train_idx = order[:cut]\n    test_idx = order[cut:]\n    return train_idx, test_idx`,
    },
    {
      type: "h2",
      text: "Reality checks before launch",
    },
    {
      type: "ol",
      items: [
        "Compare to a dumb baseline and document lift in absolute terms.",
        "Stress test one plausible shift, for example class prevalence change.",
        "Define what metric decline triggers rollback in production.",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "A model that beats baseline offline can still fail in production when labels are delayed, user behavior shifts, or decision thresholds are misaligned with business capacity. Pair offline validation with clear online monitoring criteria.",
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
