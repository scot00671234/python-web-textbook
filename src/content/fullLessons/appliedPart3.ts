import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "";

export const lessonPolicyEvaluationMethodology: Lesson = {
  slug: "policy-evaluation-methodology",
  title: "Policy evaluation methodology with Python",
  subtitle: subInt,
  summary:
    "Strong policy evaluation starts with a causal question and a credible comparison. Python helps you document assumptions, structure data, and keep decisions reproducible.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Translate a policy question into treatment, outcome, unit, and time",
    "Choose a first-pass design: RCT, matching, DiD, RDD, or synthetic control",
    "Build a practical pre-analysis checklist before touching code",
    "Separate identification assumptions from implementation details",
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
      text: "The minimum policy question template",
    },
    {
      type: "p",
      text: "Before opening a notebook, write the evaluation question in one sentence. Example: `Did free bus passes increase school attendance among low-income students within one academic year?` If this sentence is vague, your analysis will also be vague.",
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
      type: "h3",
      text: "Real-world framing example",
    },
    {
      type: "p",
      text: "Suppose a city launches evening tutoring in half of its public schools. Your treatment is school-level tutoring availability, your unit is student, your outcome could be math score growth, and your window might be one semester before and after rollout.",
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
      text: "Design choice by policy context",
    },
    {
      type: "p",
      text: "Choose the simplest design that matches how the policy was assigned. If assignment is random, use RCT logic. If assignment depends on an eligibility rule, consider RDD. If rollout happens over time across groups, DiD is often a strong first option.",
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
      type: "h3",
      text: "RCT and quasi-experimental logic",
    },
    {
      type: "p",
      text: "When random assignment is feasible, RCT logic is usually the cleanest route. Many policy teams cannot randomize due to legal or political constraints, so quasi-experimental designs become the practical path. The main rule is simple: your design must explain why treated and comparison groups are credible counterfactuals.",
    },
    {
      type: "h3",
      text: "Matching in plain language",
    },
    {
      type: "p",
      text: "Matching tries to compare treated units with similar untreated units on observed features. Think of it as pairing students, firms, or municipalities that looked similar before policy exposure. Matching does not solve hidden confounding, so always write clearly which variables were used and which were unavailable.",
    },
    {
      type: "code",
      title: "Nearest-neighbor matching sketch",
      code: `treated = [
    {"id": "T1", "age": 22, "income": 28000},
    {"id": "T2", "age": 35, "income": 42000},
]
control = [
    {"id": "C1", "age": 21, "income": 27500},
    {"id": "C2", "age": 36, "income": 43000},
    {"id": "C3", "age": 52, "income": 61000},
]

def distance(a, b):
    return abs(a["age"] - b["age"]) + abs(a["income"] - b["income"]) / 1000

for t in treated:
    match = min(control, key=lambda c: distance(t, c))
    print(t["id"], "matched with", match["id"])`,
    },
    {
      type: "h3",
      text: "RDD in plain language",
    },
    {
      type: "p",
      text: "Regression discontinuity uses a cutoff rule. Units just above and below a threshold can be treated as highly comparable. The estimate is local, so describe it as the effect near the cutoff, not for all units everywhere.",
    },
    {
      type: "h3",
      text: "Synthetic control in plain language",
    },
    {
      type: "p",
      text: "Synthetic control is useful when one city, region, or institution receives treatment and you need a comparison trend. You build a weighted blend of untreated units that mimics pre-policy behavior, then compare post-policy outcomes.",
    },
    {
      type: "code",
      title: "Synthetic control toy calculation",
      code: `treated_post = 72.0
donors_post = {"A": 65.0, "B": 70.0, "C": 68.0}
weights = {"A": 0.5, "B": 0.3, "C": 0.2}

synthetic_post = sum(weights[k] * donors_post[k] for k in donors_post)
effect = treated_post - synthetic_post
print("Synthetic post outcome:", round(synthetic_post, 2))
print("Treated minus synthetic:", round(effect, 2))`,
    },
    {
      type: "h2",
      text: "Pre-analysis checklist that prevents weak studies",
    },
    {
      type: "ol",
      items: [
        "Define treatment assignment in one sentence.",
        "Define outcome construction in one sentence.",
        "Write the observation window and baseline period.",
        "State one design-specific identification assumption.",
        "Write one falsification or placebo check you can run.",
      ],
    },
    {
      type: "callout",
      variant: "note",
      text: "Do not pad reports with method jargon. Decision-makers need the core design logic, assumptions, diagnostics, and limits.",
    },
    {
      type: "practice",
      title: "Lab: design before code",
      steps: [
        "Pick one policy case (education, housing, health, labor, or energy).",
        "Write treatment, outcome, unit, timing, and one plausible confounder.",
        "Choose one design and justify it in two short sentences.",
      ],
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
    "You can implement transparent policy estimators in short Python scripts. The key is to understand what comparison each estimator is making and why it is credible.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 22,
  objectives: [
    "Compute treatment-control differences and DiD with pandas",
    "Run a simple regression specification with statsmodels",
    "Report effect size with uncertainty, not only p-values",
    "Prototype matching, RDD, and synthetic control workflows in compact scripts",
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
      type: "p",
      text: "Interpretation: this first gap is descriptive, not automatically causal. It ignores baseline differences between groups. Use it as a baseline check before stronger designs.",
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
      type: "p",
      text: "Interpretation: DiD asks whether the treated group changed more than the control group over the same period. In a job-training program, this can approximate a causal effect if pre-trends are similar.",
    },
    {
      type: "h2",
      text: "Matching implementation sketch",
    },
    {
      type: "code",
      title: "Propensity-style score and nearest match (toy)",
      code: `import pandas as pd

df = pd.DataFrame(
    {
        "id": ["T1", "T2", "C1", "C2", "C3"],
        "treated": [1, 1, 0, 0, 0],
        "age": [22, 35, 21, 36, 52],
        "income_k": [28, 42, 27.5, 43, 61],
        "outcome": [78, 83, 75, 80, 74],
    }
)

treated = df[df["treated"] == 1].copy()
control = df[df["treated"] == 0].copy()

def row_distance(t_row, c_row):
    return abs(t_row["age"] - c_row["age"]) + abs(t_row["income_k"] - c_row["income_k"])

pairs = []
for _, t in treated.iterrows():
    best_idx = min(control.index, key=lambda i: row_distance(t, control.loc[i]))
    pairs.append((t["id"], control.loc[best_idx, "id"]))

print("Matched pairs:", pairs)`,
    },
    {
      type: "p",
      text: "This script shows mechanics, not full causal validity. In real projects, include balance diagnostics and sensitivity checks.",
    },
    {
      type: "h2",
      text: "RDD implementation sketch",
    },
    {
      type: "code",
      title: "Local comparison around cutoff",
      code: `import pandas as pd

df = pd.DataFrame(
    {
        "score": [68, 71, 74, 75, 76, 79, 82],
        "outcome": [58, 61, 62, 66, 68, 69, 71],
    }
)
cutoff = 75
bandwidth = 2

local = df[(df["score"] >= cutoff - bandwidth) & (df["score"] <= cutoff + bandwidth)].copy()
local["treated"] = (local["score"] >= cutoff).astype(int)

left_mean = local[local["treated"] == 0]["outcome"].mean()
right_mean = local[local["treated"] == 1]["outcome"].mean()
print("Local RDD gap:", round(right_mean - left_mean, 2))`,
    },
    {
      type: "h2",
      text: "Synthetic control implementation sketch",
    },
    {
      type: "code",
      title: "Post-period treated minus synthetic",
      code: `import pandas as pd

post = pd.Series({"treated": 72.0, "A": 65.0, "B": 70.0, "C": 68.0})
weights = pd.Series({"A": 0.5, "B": 0.3, "C": 0.2})

synthetic = float((post[weights.index] * weights).sum())
effect = post["treated"] - synthetic
print("Synthetic level:", round(synthetic, 2))
print("Estimated effect:", round(effect, 2))`,
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
      type: "h2",
      text: "A practical workflow you can reuse",
    },
    {
      type: "ol",
      items: [
        "Check group counts and missing values.",
        "Plot or tabulate pre-policy trends.",
        "Compute a simple baseline gap.",
        "Estimate method-specific effect (DiD, matching, RDD, or synthetic control).",
        "Run one robustness check, for example an alternative control group.",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      text: "Do not over-interpret one specification. Show robustness checks, placebo checks, and pre-trend evidence when possible.",
    },
    {
      type: "practice",
      title: "Lab: one-page evaluation notebook",
      steps: [
        "Load a small CSV with treated/control and pre/post fields.",
        "Compute both naive gap and DiD estimate.",
        "Write three sentences: estimate, uncertainty, and one key limitation.",
      ],
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
    "Decision-makers need clear statements about effect size, uncertainty, and limits. Your job is to translate model output into actionable policy evidence without overselling certainty.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Convert regression output into plain-English policy statements",
    "Separate statistical uncertainty from practical significance",
    "Write limitations that are honest and useful",
    "Communicate method-specific assumptions in one short paragraph",
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
      type: "p",
      text: "A good policy statement answers four questions fast: how much effect, on whom, over what period, and with what uncertainty. If any part is missing, readers may fill gaps with incorrect assumptions.",
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
      text: "Worked example for a policy brief",
    },
    {
      type: "p",
      text: "Example wording: `The tutoring policy is associated with a 2.4-point increase in math scores per student over one semester (95% CI: 0.8 to 4.0). This estimate applies to schools like those in the study and may differ in districts with different baseline resources.`",
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
    {
      type: "h2",
      text: "Method-specific communication examples",
    },
    {
      type: "ul",
      items: [
        "Matching: `After matching on observed baseline covariates, treated units showed X-point higher outcomes. This relies on no important hidden confounders.`",
        "DiD: `The treated group improved X points more than the comparison group after policy rollout. This relies on parallel pre-policy trends.`",
        "RDD: `Near the eligibility threshold, crossing the cutoff is associated with an X-point outcome jump. This is a local effect near the cutoff.`",
        "Synthetic control: `Post-policy outcomes exceed the synthetic comparison path by X points. Credibility depends on pre-policy fit quality.`",
      ],
    },
    {
      type: "h2",
      text: "Checklist for evidence quality before publication",
    },
    {
      type: "ol",
      items: [
        "Do your figures show pre-policy trajectories clearly?",
        "Did you report uncertainty intervals next to point estimates?",
        "Did you state one internal validity risk in plain language?",
        "Did you state one external validity limit in plain language?",
        "Did you avoid causal language when design assumptions are weak?",
      ],
    },
    {
      type: "code",
      title: "Simple policy brief formatter",
      code: `def brief(method, effect, ci_low, ci_high, scope, key_assumption):
    return (
        f"Method: {method}. "
        f"Estimated effect: {effect:.2f}. "
        f"Likely range: {ci_low:.2f} to {ci_high:.2f}. "
        f"Scope: {scope}. "
        f"Key assumption: {key_assumption}."
    )

print(
    brief(
        method="Difference-in-differences",
        effect=2.4,
        ci_low=0.8,
        ci_high=4.0,
        scope="Public middle schools in one district over one semester",
        key_assumption="Pre-policy trends are comparable across groups",
    )
)`,
    },
    {
      type: "practice",
      title: "Lab: rewrite for a non-technical reader",
      steps: [
        "Take one estimate from your notebook.",
        "Write one sentence for effect and uncertainty.",
        "Write one sentence for limits and where the estimate may not transfer.",
      ],
    },
    check(
      "If your estimate is statistically significant but tiny, how would you explain practical relevance to a minister or city manager?",
    ),
  ],
};
