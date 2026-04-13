import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "Intermediate track: plain English, bigger ideas per page.";

export const lessonPolicyEvaluationMethodology: Lesson = {
  slug: "policy-evaluation-methodology",
  title: "Policy evaluation methodology with Python",
  subtitle: subInt,
  summary:
    "Policy evaluation starts with a clear causal question, then a design that can answer it. Python helps you make assumptions explicit and reproducible.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Translate a policy question into treatment, outcome, unit, and time",
    "Choose a first-pass design: RCT, matching, DiD, RDD, or synthetic control",
    "Build a small analysis checklist before touching code",
  ],
  practicePrompts: [
    "Pick one real policy you care about and write one sentence each for treatment, control, outcome, and observation window.",
  ],
  keyTakeaways: [
    "Design quality comes before model complexity.",
    "Most mistakes come from unclear units, timing, or outcomes, not from missing advanced syntax.",
    "Write assumptions next to code so teammates can challenge them early.",
  ],
  sections: [
    ...ql(
      "Start with a causal question, map it to data, then pick the simplest design that fits the policy context.",
      [
        "Frame the question and estimand",
        "Compare common policy evaluation designs",
        "Use a reproducible Python workflow skeleton",
      ],
    ),
    {
      type: "h2",
      text: "The minimum question template",
    },
    {
      type: "ul",
      items: [
        "Who receives the policy, and who does not?",
        "What outcome should change if the policy works?",
        "When should effects show up?",
        "What confounders could create fake effects?",
      ],
    },
    {
      type: "code",
      title: "Analysis skeleton in plain Python",
      code: `policy = {
    "name": "After-school tutoring",
    "treatment": "School offers tutoring slots",
    "outcome": "Student test score after one semester",
    "unit": "Student",
    "window": "Baseline and endline within same school year",
}

assumptions = [
    "No policy spillovers to comparison units",
    "Outcome measured the same way across groups",
    "Assignment process is documented",
]

print(policy["name"])
for a in assumptions:
    print("-", a)`,
    },
    {
      type: "h2",
      text: "Method map",
    },
    {
      type: "ul",
      items: [
        "RCT: best internal validity when random assignment is feasible.",
        "Matching: useful for observational data when treated and control groups differ at baseline, but only addresses observed covariates.",
        "DiD: compare pre/post changes between treated and comparison groups under parallel-trends assumptions.",
        "RDD: exploit sharp eligibility cutoffs, then estimate local effects near the threshold.",
        "Synthetic control: build a weighted comparison unit when one treated unit exists.",
      ],
    },
    {
      type: "callout",
      variant: "note",
      text: "You do not need author names in your report unless they add real value. Focus on assumptions, design choices, and diagnostics.",
    },
    check(
      "If randomization is impossible, what is your strongest argument that treated and comparison units were on similar trajectories before treatment?",
    ),
  ],
};

export const lessonPolicyEvaluationWithPython: Lesson = {
  slug: "policy-evaluation-with-python",
  title: "Core policy evaluation methods in Python",
  subtitle: subInt,
  summary:
    "You can implement transparent baseline estimators in a few lines of Python. The main goal is clarity about what each estimator compares.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 22,
  objectives: [
    "Compute treatment-control differences and DiD with pandas",
    "Run a simple regression specification with statsmodels",
    "Report effect size with uncertainty, not only p-values",
  ],
  practicePrompts: [
    "Replace the toy columns with your own CSV data and recompute the DiD estimate with grouped means.",
  ],
  keyTakeaways: [
    "A small baseline pipeline beats a complex model you cannot explain.",
    "Always inspect pre-policy trends and sample composition before interpreting estimates.",
    "Standard errors and confidence intervals matter as much as point estimates.",
  ],
  sections: [
    ...ql(
      "This lesson turns core policy estimators into short, readable Python snippets you can adapt.",
      [
        "Difference in means",
        "Difference-in-differences with grouped averages",
        "Regression form for transparent reporting",
      ],
    ),
    {
      type: "code",
      title: "Difference in means (toy data)",
      code: `import pandas as pd

df = pd.DataFrame(
    {
        "treated": [1, 1, 1, 0, 0, 0],
        "outcome": [74, 78, 81, 70, 68, 72],
    }
)

effect = df.loc[df["treated"] == 1, "outcome"].mean() - df.loc[df["treated"] == 0, "outcome"].mean()
print("Naive treated-control gap:", round(effect, 2))`,
    },
    {
      type: "code",
      title: "Difference-in-differences in pandas",
      code: `import pandas as pd

panel = pd.DataFrame(
    {
        "group": ["treated", "treated", "control", "control"],
        "period": ["pre", "post", "pre", "post"],
        "outcome": [62, 70, 60, 63],
    }
)

avg = panel.pivot_table(index="group", columns="period", values="outcome", aggfunc="mean")
did = (avg.loc["treated", "post"] - avg.loc["treated", "pre"]) - (
    avg.loc["control", "post"] - avg.loc["control", "pre"]
)
print("DiD estimate:", round(float(did), 2))`,
    },
    {
      type: "code",
      title: "Regression form of DiD with robust uncertainty",
      code: `import pandas as pd
import statsmodels.formula.api as smf

df = pd.DataFrame(
    {
        "treated": [1, 1, 1, 1, 0, 0, 0, 0],
        "post": [0, 0, 1, 1, 0, 0, 1, 1],
        "outcome": [61, 63, 69, 71, 60, 61, 63, 64],
    }
)

model = smf.ols("outcome ~ treated + post + treated:post", data=df).fit(cov_type="HC1")
did_beta = model.params["treated:post"]
ci_low, ci_high = model.conf_int().loc["treated:post"]

print("DiD beta:", round(did_beta, 3))
print("95% CI:", round(ci_low, 3), "to", round(ci_high, 3))`,
    },
    {
      type: "callout",
      variant: "warn",
      text: "Do not over-interpret one specification. Show robustness checks, placebo checks, and pre-trend evidence when possible.",
    },
    check(
      "Can you explain in one sentence what comparison creates the DiD estimate, without using equations?",
    ),
  ],
};

export const lessonPolicyEvaluationInterpretation: Lesson = {
  slug: "policy-evaluation-interpretation",
  title: "Interpreting and communicating policy estimates",
  subtitle: subInt,
  summary:
    "Decision-makers need effect sizes, uncertainty, and limitations in plain language. Your job is to translate model output into clear policy evidence.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Convert regression output into plain-English policy statements",
    "Separate statistical uncertainty from practical significance",
    "Write limitations that are honest and useful",
  ],
  practicePrompts: [
    "Take one estimate from your notebook and rewrite it as a two-sentence policy brief for a non-technical audience.",
  ],
  keyTakeaways: [
    "A precise number without context can mislead.",
    "Policy communication should always include uncertainty and scope conditions.",
    "Good reporting reduces misuse of evidence.",
  ],
  sections: [
    ...ql(
      "Translate coefficients into policy language that non-coders can act on, while staying honest about uncertainty.",
      [
        "From coefficient to plain English",
        "Uncertainty and practical significance",
        "Reusable reporting template",
      ],
    ),
    {
      type: "h2",
      text: "Plain-English translation pattern",
    },
    {
      type: "ul",
      items: [
        "State the unit: per student, household, school, municipality, or firm.",
        "State the time window: immediate, one term, one year.",
        "State uncertainty: confidence interval or plausible range.",
        "State caveats: design assumptions and external validity limits.",
      ],
    },
    {
      type: "code",
      title: "Tiny helper for narrative output",
      code: `def report_effect(effect, ci_low, ci_high, unit_label):
    return (
        f"Estimated policy effect: {effect:.2f} points per {unit_label}. "
        f"Plausible range: {ci_low:.2f} to {ci_high:.2f}."
    )

print(report_effect(2.4, 0.8, 4.0, "student"))`,
    },
    {
      type: "h2",
      text: "Template for policy memo",
    },
    {
      type: "ol",
      items: [
        "Question: What policy effect did we estimate?",
        "Design: Why this method is credible in this context.",
        "Result: Effect size and uncertainty in plain language.",
        "Limits: What this estimate does not prove.",
        "Action: What decision this evidence can support now.",
      ],
    },
    check(
      "If your estimate is statistically significant but tiny, how would you explain practical relevance to a minister or city manager?",
    ),
  ],
};
