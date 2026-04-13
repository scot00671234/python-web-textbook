/**
 * Guided micro-missions for the in-browser Python playground (Pyodide).
 * Keep copy short; align roughly with early Foundations and Control flow lessons.
 */

export type PlaygroundSuccessCheck =
  /** Every part appears somewhere in stdout (case-insensitive). */
  | { kind: "stdout_includes_all"; parts: string[] }
  /** Every listed string appears as its own trimmed line (order does not matter). */
  | { kind: "stdout_lines_include"; lines: string[] }
  | { kind: "manual" };

export type PlaygroundChallenge = {
  id: string;
  title: string;
  /** One line under the title */
  blurb: string;
  category: "Warm-up" | "Logic" | "Data";
  /** What "done" means in plain language */
  objectives: string[];
  starterCode: string;
  /** Short nudges; reveal one at a time in the UI */
  hints: string[];
  /** Sample answer; learner may peek after trying */
  solutionCode: string;
  successCheck: PlaygroundSuccessCheck;
};

export const PLAYGROUND_CHALLENGES: PlaygroundChallenge[] = [
  {
    id: "say-hello",
    title: "Say hello",
    blurb: "Wake up `print` and greet the world.",
    category: "Warm-up",
    objectives: [
      "Print a line that includes the word Hello (capital H is fine).",
      "Run and see your message in Standard output.",
    ],
    starterCode: `# Print one line that includes Hello
`,
    hints: [
      "Use print(...) with a string in quotes.",
      'Example shape: print("Hello, ...")',
    ],
    solutionCode: `print("Hello from the playground!")`,
    successCheck: { kind: "stdout_includes_all", parts: ["hello"] },
  },
  {
    id: "do-math",
    title: "Math in the open",
    blurb: "Let Python compute so you can check the answer.",
    category: "Warm-up",
    objectives: [
      "Print the result of 2026 minus 1990 (or any expression you like).",
      "The output should show the number 36 somewhere.",
    ],
    starterCode: `# Print 2026 - 1990
`,
    hints: [
      "You can print an expression directly: print(7 * 8).",
      "Python respects normal arithmetic order; use parentheses when in doubt.",
    ],
    solutionCode: `print(2026 - 1990)`,
    successCheck: { kind: "stdout_includes_all", parts: ["36"] },
  },
  {
    id: "string-length",
    title: "How long is a string?",
    blurb: "Use `len` on text.",
    category: "Warm-up",
    objectives: [
      'Create a variable for the word Python (quotes mean "this is text").',
      "Print how many characters it has (should be 6).",
    ],
    starterCode: `word = "Python"
# Print the length of word
`,
    hints: [
      "len(word) counts characters in a string.",
      "Print that value with print(len(word)).",
    ],
    solutionCode: `word = "Python"
print(len(word))`,
    successCheck: { kind: "stdout_lines_include", lines: ["6"] },
  },
  {
    id: "count-down",
    title: "Countdown",
    blurb: "A tiny `for` loop with `range`.",
    category: "Logic",
    objectives: [
      "Print the numbers 3, then 2, then 1, each on its own line.",
      "Use a for loop with range (there are several valid ways).",
    ],
    starterCode: `# Print 3, 2, 1 on separate lines using a for loop
`,
    hints: [
      "range(3, 0, -1) counts down: 3, 2, 1.",
      "Or loop over a list: for n in [3, 2, 1]:",
    ],
    solutionCode: `for n in range(3, 0, -1):
    print(n)`,
    successCheck: { kind: "stdout_lines_include", lines: ["3", "2", "1"] },
  },
  {
    id: "sum-a-list",
    title: "Add a list",
    blurb: "Lists and `sum` work well together.",
    category: "Data",
    objectives: [
      "Given scores = [12, 8, 15], print the total (should be 35).",
      "You can use the built-in sum(...) function.",
    ],
    starterCode: `scores = [12, 8, 15]
# Print the sum of scores
`,
    hints: [
      "sum(scores) adds all numbers in the list.",
      "print(sum(scores)) is enough for this mission.",
    ],
    solutionCode: `scores = [12, 8, 15]
print(sum(scores))`,
    successCheck: { kind: "stdout_lines_include", lines: ["35"] },
  },
  {
    id: "dict-lookup",
    title: "Look up in a dict",
    blurb: "Keys point to values, like a tiny table.",
    category: "Data",
    objectives: [
      'The dict below maps names to scores. Print Ada\'s score (99).',
      "Use bracket lookup: scores[\"Ada\"]",
    ],
    starterCode: `scores = {"Ada": 99, "Lin": 88}
# Print Ada's score
`,
    hints: [
      'scores["Ada"] fetches the value for that key.',
      "Wrap it in print(...).",
    ],
    solutionCode: `scores = {"Ada": 99, "Lin": 88}
print(scores["Ada"])`,
    successCheck: { kind: "stdout_lines_include", lines: ["99"] },
  },
  {
    id: "even-numbers",
    title: "Filter evens",
    blurb: "Loop or comprehension: your choice.",
    category: "Logic",
    objectives: [
      "From nums = [2, 5, 8, 11], print only the even numbers (2 and 8), one per line.",
      "An even number has n % 2 == 0 in Python.",
    ],
    starterCode: `nums = [2, 5, 8, 11]
# Print each even number on its own line
`,
    hints: [
      "Loop with for n in nums: and use if n % 2 == 0:",
      "Or build a small list of evens and loop that.",
    ],
    solutionCode: `nums = [2, 5, 8, 11]
for n in nums:
    if n % 2 == 0:
        print(n)`,
    successCheck: { kind: "stdout_lines_include", lines: ["2", "8"] },
  },
  {
    id: "free-canvas",
    title: "Free canvas",
    blurb: "No mission text: experiment on your own.",
    category: "Warm-up",
    objectives: [
      "Try anything from the lessons: variables, loops, small functions.",
      "There is no auto-check here. Explore and use Run as often as you like.",
    ],
    starterCode: `print("Hello from real Python in your browser (Pyodide).")
print("2 ** 10 =", 2 ** 10)
`,
    hints: [
      "Stuck? Switch to Say hello or another mini-mission for a concrete goal.",
      "Visit All lessons for full explanations and type-along practice.",
    ],
    solutionCode: `# Your space — no single right answer
print("Keep experimenting!")
`,
    successCheck: { kind: "manual" },
  },
];

const byId = new Map(PLAYGROUND_CHALLENGES.map((c) => [c.id, c]));

export function getPlaygroundChallenge(id: string): PlaygroundChallenge {
  return byId.get(id) ?? PLAYGROUND_CHALLENGES[0]!;
}

export const DEFAULT_PLAYGROUND_CHALLENGE_ID = "say-hello";
