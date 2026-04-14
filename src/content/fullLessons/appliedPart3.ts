import type { Lesson } from "../types";
import { check, ql } from "./pedagogy";

const subInt = "";

export const lessonCausalityAndVariablesFoundations: Lesson = {
  slug: "causality-and-variables-foundations",
  title: "Causality and variables: foundations for empirical research",
  subtitle: subInt,
  summary:
    "Causal research begins by defining variables precisely, mapping relationships clearly, and stating the counterfactual question in plain language. Statistical software is useful only after this conceptual work is complete.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Distinguish outcome, treatment, confounder, mediator, and collider variables",
    "Write one clear estimand statement for a policy or scientific question",
    "Explain why variable definitions are part of identification, not only data cleaning",
  ],
  keyTakeaways: [
    "Weak variable definitions create weak causal claims even when estimation code is correct.",
    "A counterfactual statement should be explicit before model choice.",
    "Good design logic reduces the risk of false confidence from complex regressions.",
  ],
  sections: [
    ...ql(
      "Define the causal question and variable roles before choosing estimators.",
      [
        "Variable roles and causal logic",
        "Counterfactual framing",
        "Design discipline before software",
      ],
    ),
    {
      type: "h2",
      text: "Start with variable roles, not equations",
    },
    {
      type: "p",
      text: "Many empirical mistakes begin when variables are listed but not conceptually assigned. An outcome variable captures what you want to explain. A treatment variable captures the policy or exposure of interest. Confounders influence both treatment and outcome. Mediators sit on a causal pathway. Colliders are common effects of two causes and should not be controlled reflexively.",
    },
    {
      type: "ul",
      items: [
        "Outcome: the measured result, for example test score growth.",
        "Treatment: the intervention or exposure, for example tutoring access.",
        "Confounder: a pre-treatment factor affecting both treatment and outcome.",
        "Mediator: a mechanism variable that transmits part of the treatment effect.",
        "Collider: a variable caused by treatment and another cause of outcome.",
      ],
    },
    {
      type: "h2",
      text: "Counterfactual statement template",
    },
    {
      type: "p",
      text: "Write one sentence that compares two states of the same target population: outcome if treated versus outcome if untreated during a defined period. This is the estimand target. If this sentence is vague, the empirical strategy will also be vague.",
    },
    {
      type: "p",
      text: "A useful writing discipline is to include unit, time horizon, and comparison condition in one line. For example, average score change per student over one semester under tutoring access versus no tutoring access. This prevents silent shifts in meaning during analysis.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Construct validity: whether your variable actually measures the concept you claim.",
        "Counterfactual: unobserved outcome for the same unit under an alternative treatment state.",
        "Estimand: exact causal quantity the study aims to estimate.",
        "Identification: argument that links observed comparisons to the target estimand.",
      ],
    },
    {
      type: "code",
      title: "Structured causal question sketch",
      code: `causal_question = {
    "population": "Public middle-school students in district X",
    "treatment": "Access to after-school tutoring",
    "outcome": "Change in standardized math score",
    "window": "One semester",
    "estimand": "Average treatment effect on treated students",
}

for k, v in causal_question.items():
    print(f"{k}: {v}")`,
    },
    {
      type: "h2",
      text: "Why this belongs in science methods",
    },
    {
      type: "p",
      text: "Scientific quality depends on construct clarity. If a variable is unstable, poorly measured, or post-treatment when it should be pre-treatment, your inference can fail regardless of estimator sophistication. Conceptual rigor is the first quality filter.",
    },
    check("Why can a technically correct regression still produce a weak causal claim?"),
  ],
};

export const lessonRandomizedControlledTrialsInPractice: Lesson = {
  slug: "randomized-controlled-trials-in-practice",
  title: "Randomized controlled trials in practice",
  subtitle: subInt,
  summary:
    "Randomization is the strongest practical design for internal validity when feasible. The challenge is operational execution, compliance tracking, and interpretation discipline, not only assignment by chance.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Explain why randomization supports causal interpretation on average",
    "Distinguish assignment from uptake and define intention-to-treat clearly",
    "Describe how attrition and noncompliance can weaken trial credibility",
  ],
  keyTakeaways: [
    "Trial credibility depends on implementation quality and transparent reporting.",
    "Intent-to-treat estimates policy assignment effect even with partial uptake.",
    "Balance checks and attrition analysis are core evidence, not optional extras.",
  ],
  sections: [
    ...ql(
      "RCT logic is simple in theory, but execution details determine evidence quality.",
      [
        "Assignment and uptake",
        "Balance and attrition checks",
        "Interpretation with implementation limits",
      ],
    ),
    {
      type: "h2",
      text: "Assignment, uptake, and interpretation",
    },
    {
      type: "p",
      text: "Random assignment creates comparable groups in expectation. However, real programs include noncompliance, delayed rollout, and missing follow-up. Report both assignment effect (intent-to-treat) and implementation facts so decision-makers can separate policy design from delivery quality.",
    },
    {
      type: "h2",
      text: "Minimal trial diagnostics",
    },
    {
      type: "ol",
      items: [
        "Balance baseline covariates across assigned groups.",
        "Report uptake rates by assignment status.",
        "Report attrition by group and discuss plausible bias direction.",
        "State primary outcome and analysis window before estimation.",
      ],
    },
    {
      type: "p",
      text: "Balance should be interpreted as evidence quality, not a ritual table. Small imbalances can occur by chance, but large systematic differences suggest implementation issues or randomization failures that need explanation.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Intent-to-treat: effect of assignment regardless of compliance.",
        "Noncompliance: assigned units do not follow assigned treatment status.",
        "Attrition: missing follow-up outcomes after assignment.",
        "Internal validity: credibility of causal interpretation within the studied sample.",
      ],
    },
    {
      type: "code",
      title: "Intent-to-treat estimate sketch",
      code: `import pandas as pd

df = pd.DataFrame(
    {
        "assigned": [1, 1, 1, 0, 0, 0],
        "outcome": [72, 75, 70, 67, 68, 66],
    }
)

itt = df[df["assigned"] == 1]["outcome"].mean() - df[df["assigned"] == 0]["outcome"].mean()
print("Intent-to-treat effect:", round(float(itt), 2))`,
    },
    {
      type: "p",
      text: "This estimate answers an assignment question, which is often the policy-relevant quantity for public decisions. It does not automatically answer the effect among participants who complied.",
    },
    check("Why is intention-to-treat often preferred as the primary reported estimate in policy trials?"),
  ],
};

export const lessonDifferenceInDifferencesResearchDesign: Lesson = {
  slug: "difference-in-differences-research-design",
  title: "Difference-in-differences as a research design",
  subtitle: subInt,
  summary:
    "Difference-in-differences estimates treatment effects by comparing changes over time between treated and comparison groups. The central credibility requirement is a plausible parallel-trends argument in the pre-treatment period.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Describe DiD as change-versus-change logic in plain language",
    "State the parallel-trends condition and how to probe it empirically",
    "Identify common DiD threats such as differential shocks and composition changes",
  ],
  keyTakeaways: [
    "DiD is a design argument supported by data diagnostics, not only a regression term.",
    "Pre-treatment trend evidence should appear in every serious DiD report.",
    "Interpretation requires care when treatment timing or composition changes strongly.",
  ],
  sections: [
    ...ql(
      "DiD compares trajectories, so trend diagnostics are central evidence.",
      [
        "Change-versus-change logic",
        "Parallel-trends discipline",
        "Threats and robustness checks",
      ],
    ),
    {
      type: "h2",
      text: "Core logic",
    },
    {
      type: "p",
      text: "If treated and comparison groups would have evolved similarly without treatment, the extra change in treated units after policy exposure can be interpreted causally. This logic fails when pre-treatment trajectories differ for reasons unrelated to treatment.",
    },
    {
      type: "h2",
      text: "Pre-trend evidence is mandatory",
    },
    {
      type: "p",
      text: "Plot group means in multiple pre-treatment periods. One pre-period is weak evidence. Multiple aligned pre-periods provide stronger support for parallel-trends plausibility, though they do not prove it conclusively.",
    },
    {
      type: "p",
      text: "When pre-trends diverge, do not force a DiD conclusion by default. Revisit group construction, explore alternative comparison groups, or shift to a design whose assumptions better fit the assignment process.",
    },
    {
      type: "code",
      title: "DiD estimate from grouped means",
      code: `import pandas as pd

panel = pd.DataFrame(
    {
        "group": ["treated", "treated", "control", "control"],
        "period": ["pre", "post", "pre", "post"],
        "y": [61, 69, 60, 63],
    }
)

avg = panel.pivot_table(index="group", columns="period", values="y", aggfunc="mean")
did = (avg.loc["treated", "post"] - avg.loc["treated", "pre"]) - (
    avg.loc["control", "post"] - avg.loc["control", "pre"]
)
print("DiD:", round(float(did), 2))`,
    },
    {
      type: "h2",
      text: "Frequent design threats",
    },
    {
      type: "ul",
      items: [
        "Policy anticipation effects before formal rollout.",
        "Different concurrent shocks across groups.",
        "Changing sample composition over time.",
      ],
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Parallel trends: treated and comparison groups would have evolved similarly without treatment.",
        "Anticipation effect: behavior changes before official treatment start.",
        "Composition change: group membership shifts over time in ways related to outcome.",
        "Event-study plot: period-by-period effect profile relative to treatment timing.",
      ],
    },
    check("Why is a single post-treatment coefficient not enough evidence without pre-trend diagnostics?"),
  ],
};

export const lessonRegressionDiscontinuityForPolicy: Lesson = {
  slug: "regression-discontinuity-for-policy",
  title: "Regression discontinuity for policy decisions",
  subtitle: subInt,
  summary:
    "Regression discontinuity design uses assignment cutoffs to estimate local causal effects near a threshold. Its strength comes from local comparability, while its limitation is local scope.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Explain why units near a cutoff can be highly comparable",
    "Define local treatment effect interpretation near the threshold",
    "Describe bandwidth and manipulation checks in plain language",
  ],
  keyTakeaways: [
    "RDD estimates are local near the cutoff and should be reported as local.",
    "Bandwidth choice changes bias-variance tradeoff and must be transparent.",
    "Density and covariate continuity checks strengthen design credibility.",
  ],
  sections: [
    ...ql(
      "RDD leverages threshold rules to build local causal comparisons.",
      [
        "Local comparison intuition",
        "Bandwidth and continuity checks",
        "Local interpretation discipline",
      ],
    ),
    {
      type: "h2",
      text: "Why threshold designs can be credible",
    },
    {
      type: "p",
      text: "When assignment is determined by a cutoff score, units just above and below that cutoff are often similar except for treatment status. This near-threshold comparison can approximate a randomized contrast locally.",
    },
    {
      type: "h2",
      text: "Key diagnostics",
    },
    {
      type: "ul",
      items: [
        "Check whether pre-treatment covariates change smoothly at the cutoff.",
        "Check whether the running variable density jumps sharply at the cutoff.",
        "Report sensitivity across plausible bandwidth choices.",
      ],
    },
    {
      type: "p",
      text: "Bandwidth decisions should be justified as a tradeoff between local comparability and sample size. Very narrow windows increase noise. Very wide windows risk comparing units that are no longer locally similar.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Running variable: score or index that determines eligibility status.",
        "Cutoff: threshold value where treatment assignment changes.",
        "Bandwidth: neighborhood around cutoff included in estimation.",
        "Manipulation test: check whether units sort strategically around threshold.",
      ],
    },
    {
      type: "code",
      title: "Local gap around cutoff",
      code: `import pandas as pd

df = pd.DataFrame(
    {
        "score": [68, 71, 74, 75, 76, 79, 82],
        "outcome": [58, 61, 62, 66, 68, 69, 71],
    }
)

cutoff = 75
bw = 2
local = df[(df["score"] >= cutoff - bw) & (df["score"] <= cutoff + bw)].copy()
local["treated"] = (local["score"] >= cutoff).astype(int)

gap = local[local["treated"] == 1]["outcome"].mean() - local[local["treated"] == 0]["outcome"].mean()
print("Local cutoff gap:", round(float(gap), 2))`,
    },
    {
      type: "p",
      text: "Interpret the result as a local estimate near the threshold. Avoid broad population claims unless additional evidence supports transportability.",
    },
    check("Why should an RDD estimate usually be described as local rather than universal?"),
  ],
};

export const lessonMatchingAndSyntheticControl: Lesson = {
  slug: "matching-and-synthetic-control",
  title: "Matching and synthetic control: comparative designs",
  subtitle: subInt,
  summary:
    "Matching and synthetic control construct comparison units when randomization is unavailable. Matching focuses on unit-level comparability with observed covariates. Synthetic control focuses on trajectory comparability for aggregate treated units.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 22,
  objectives: [
    "Explain when matching is appropriate and what it cannot fix",
    "Explain when synthetic control is appropriate and what pre-fit quality means",
    "Compare design assumptions across both methods in plain language",
  ],
  keyTakeaways: [
    "Matching addresses observed confounding only, not hidden confounding.",
    "Synthetic control credibility depends strongly on pre-treatment fit quality.",
    "Comparative methods require explicit diagnostics, not only point estimates.",
  ],
  sections: [
    ...ql(
      "Use matching for comparable units and synthetic control for comparable trajectories.",
      [
        "Matching logic and limits",
        "Synthetic control logic and diagnostics",
        "Choosing between designs",
      ],
    ),
    {
      type: "h2",
      text: "Matching in one paragraph",
    },
    {
      type: "p",
      text: "Matching pairs treated and untreated units that look similar on observed baseline characteristics. If important confounders are unobserved, matching cannot remove that bias. Report variable selection, overlap quality, and balance diagnostics clearly.",
    },
    {
      type: "code",
      title: "Nearest-neighbor matching sketch",
      code: `treated = [{"id": "T1", "age": 22, "income": 28.0}, {"id": "T2", "age": 35, "income": 42.0}]
control = [{"id": "C1", "age": 21, "income": 27.5}, {"id": "C2", "age": 36, "income": 43.0}]

def distance(a, b):
    return abs(a["age"] - b["age"]) + abs(a["income"] - b["income"])

for t in treated:
    m = min(control, key=lambda c: distance(t, c))
    print(t["id"], "->", m["id"])`,
    },
    {
      type: "h2",
      text: "Synthetic control in one paragraph",
    },
    {
      type: "p",
      text: "Synthetic control is useful when one region, city, or institution is treated and many untreated donor units are available. The method chooses donor weights to match pre-treatment outcomes, then compares post-treatment divergence. Strong pre-period fit is a central credibility requirement.",
    },
    {
      type: "code",
      title: "Synthetic control post-period contrast sketch",
      code: `treated_post = 72.0
donors_post = {"A": 65.0, "B": 70.0, "C": 68.0}
weights = {"A": 0.5, "B": 0.3, "C": 0.2}

synthetic_post = sum(weights[k] * donors_post[k] for k in donors_post)
effect = treated_post - synthetic_post
print("Synthetic post:", round(synthetic_post, 2))
print("Treated minus synthetic:", round(effect, 2))`,
    },
    {
      type: "h2",
      text: "Method choice guidance",
    },
    {
      type: "ul",
      items: [
        "Use matching when many treated and untreated micro-units exist with rich baseline covariates.",
        "Use synthetic control when treatment is aggregate and high-quality pre-period outcomes are available.",
        "Use both with transparent diagnostics and explicit scope limits.",
      ],
    },
    {
      type: "p",
      text: "Method selection should follow data structure and assignment narrative. Matching is often stronger when unit-level covariates are rich and overlap is adequate. Synthetic control is often stronger when treated exposure is aggregate and pre-period trajectory fit is demonstrably strong.",
    },
    {
      type: "h3",
      text: "Key terms (plain language)",
    },
    {
      type: "ul",
      items: [
        "Covariate balance: similarity of baseline characteristics after matching.",
        "Overlap support: region where treated and control covariate distributions both exist.",
        "Donor pool: untreated units used to construct synthetic comparison.",
        "Pre-fit quality: closeness of synthetic and treated trajectories before treatment.",
      ],
    },
    check("What is one core diagnostic you should report for matching and one for synthetic control?"),
  ],
};

export const lessonPolicyEvaluationMethodology: Lesson = {
  slug: "policy-evaluation-methodology",
  title: "Policy evaluation methodology with Python",
  subtitle: subInt,
  summary:
    "Strong policy evaluation starts with a causal estimand and a credible counterfactual. Python then supports reproducible data prep, diagnostics, and reporting. Methods are only trustworthy when assumptions are explicit and testable where possible.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 20,
  objectives: [
    "Translate a policy question into treatment, outcome, unit, and time",
    "Choose a first-pass design: RCT, matching, DiD, RDD, or synthetic control",
    "Build a practical pre-analysis checklist before touching code",
    "Separate identification assumptions from implementation details",
    "Name whether your target estimand is ATE, ATT, or a local effect",
  ],
  practicePrompts: [
    "Pick one real policy you care about and write one sentence each for treatment, control, outcome, and observation window.",
  ],
  keyTakeaways: [
    "Design quality comes before model complexity.",
    "Most mistakes come from unclear units, timing, or outcomes, not from missing advanced syntax.",
    "Write assumptions next to code so teammates can challenge them early.",
    "If you cannot explain the counterfactual, no amount of regression polish will rescue the study.",
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
      text: "This template is not a writing exercise, it is an identification safeguard. Ambiguity at this stage usually reappears later as model instability, inconsistent subgroup definitions, and fragile interpretation.",
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
      text: "Choose the estimand before choosing software",
    },
    {
      type: "ul",
      items: [
        "ATE: average effect if everyone received treatment versus no one.",
        "ATT: average effect among units that actually received treatment.",
        "Local effect: effect near a cutoff (RDD) or within matched overlap support.",
      ],
    },
    {
      type: "p",
      text: "Teams often skip this step and later argue about coefficients that answer different questions. Write your estimand in one line in the notebook header.",
    },
    {
      type: "h2",
      text: "Design choice by policy context",
    },
    {
      type: "p",
      text: "Method selection should follow assignment mechanics. If treatment is assigned by lottery, design around randomization. If treatment begins at a threshold, design around local comparison near the cutoff. If assignment changes over time by region, design around temporal and group contrasts. Software comes after this logic.",
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
    "You can implement transparent policy estimators in short Python scripts, but credible inference requires diagnostics and robust uncertainty choices. This lesson adds practical checks that move toy scripts closer to real analyst workflows.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 22,
  objectives: [
    "Compute treatment-control differences and DiD with pandas",
    "Run a simple regression specification with statsmodels",
    "Report effect size with uncertainty, not only p-values",
    "Prototype matching, RDD, and synthetic control workflows in compact scripts",
    "Add at least one design-specific diagnostic before interpretation",
  ],
  practicePrompts: [
    "Replace the toy columns with your own CSV data and recompute the DiD estimate with grouped means.",
  ],
  keyTakeaways: [
    "A small baseline pipeline beats a complex model you cannot explain.",
    "Always inspect pre-policy trends and sample composition before interpreting estimates.",
    "Standard errors and confidence intervals matter as much as point estimates.",
    "Method-specific diagnostics are part of the estimate, not optional appendix material.",
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
      text: "Use this naive gap as a descriptive benchmark, not as final evidence. A clear benchmark helps readers see what each stronger design contributes and where assumptions begin to matter.",
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
      text: "Pre-trend diagnostic sketch for DiD",
    },
    {
      type: "code",
      title: "Group means by period before treatment",
      code: `import pandas as pd

pre_panel = pd.DataFrame(
    {
        "group": ["treated", "treated", "control", "control"],
        "period": ["t-2", "t-1", "t-2", "t-1"],
        "outcome": [58, 60, 57, 59],
    }
)

trend = pre_panel.pivot_table(index="group", columns="period", values="outcome", aggfunc="mean")
print(trend)
print("treated_pre_change", trend.loc["treated", "t-1"] - trend.loc["treated", "t-2"])
print("control_pre_change", trend.loc["control", "t-1"] - trend.loc["control", "t-2"])`,
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
      text: "Uncertainty choices in clustered policy data",
    },
    {
      type: "p",
      text: "Policy outcomes are often correlated within schools, clinics, municipalities, or firms. If residuals cluster, use clustered standard errors by the assignment unit when possible, not only HC1.",
    },
    {
      type: "p",
      text: "When treatment assignment happens at the school or municipality level, uncertainty estimates should respect that level. Treating correlated units as independent can make confidence intervals appear narrower than they are.",
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
      variant: "tip",
      text: "High-quality policy notebooks usually include one design diagram, one table of assumptions, one main estimate table, and one robustness section. This structure improves both peer review and decision communication.",
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
    "Decision-makers need clear statements about effect size, uncertainty, assumptions, and transfer limits. Your job is to convert estimates into decision-grade evidence without claiming certainty the design cannot justify.",
  tier: "intermediate",
  isPractical: true,
  readingTimeMinutes: 16,
  objectives: [
    "Convert regression output into plain-English policy statements",
    "Separate statistical uncertainty from practical significance",
    "Write limitations that are honest and useful",
    "Communicate method-specific assumptions in one short paragraph",
    "State what population and time horizon the estimate applies to",
  ],
  practicePrompts: [
    "Take one estimate from your notebook and rewrite it as a two-sentence policy brief for a non-technical audience.",
  ],
  keyTakeaways: [
    "A precise number without context can mislead.",
    "Policy communication should always include uncertainty and scope conditions.",
    "Good reporting reduces misuse of evidence.",
    "Scope discipline is essential: local effects should not be sold as universal effects.",
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
      text: "A strong interpretation paragraph is specific about scale and audience. Replace generic wording like improved outcomes with exact units, baseline context, and decision implications that stakeholders can act on immediately.",
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
      text: "Internal validity vs external validity language",
    },
    {
      type: "ul",
      items: [
        "Internal validity: does the design support a causal claim in the studied sample?",
        "External validity: how far can this effect travel across places, populations, and periods?",
        "Report both explicitly to prevent over-generalization.",
      ],
    },
    {
      type: "p",
      text: "Internal validity answers whether your estimate is believable for studied units under stated assumptions. External validity answers where else that estimate might travel. Policy errors often happen when teams report the first and assume the second.",
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
      type: "callout",
      variant: "warn",
      text: "If your memo includes strong causal verbs such as caused, reduced, or increased, ensure that each claim is tied to a design assumption stated in plain language. Strong wording requires equally strong methodological support.",
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
