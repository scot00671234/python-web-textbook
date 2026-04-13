/**
 * Guided micro-missions for the in-browser Python playground (Pyodide).
 * Pyodide is real CPython: loops, functions, most of the standard library, and
 * in-memory files with open() all work. Avoid input() here (no real terminal).
 * Extra packages need an explicit load step; these missions stick to the stdlib.
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
  category: "Warm-up" | "Logic" | "Data" | "Stdlib";
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
    id: "define-double",
    title: "Return a value from a function",
    blurb: "`print` shows text; `return` hands a value back to the caller.",
    category: "Logic",
    objectives: [
      "Define a function `double(n)` that returns n times 2.",
      "Print double(7). The output line should be 14.",
    ],
    starterCode: `# Define double(n) that returns n * 2, then print double(7)
`,
    hints: [
      "Use def double(n): then a return line indented under it.",
      "Call double(7) inside print(...).",
    ],
    solutionCode: `def double(n):
    return n * 2

print(double(7))`,
    successCheck: { kind: "stdout_lines_include", lines: ["14"] },
  },
  {
    id: "join-words",
    title: "Glue strings together",
    blurb: "`str.join` builds one string from many pieces.",
    category: "Warm-up",
    objectives: [
      'Use join on a list of words so print shows exactly: learn.python.here (dots between words).',
      'The list can be ["learn", "python", "here"].',
    ],
    starterCode: `words = ["learn", "python", "here"]
# Print learn.python.here using str.join (the separator goes before .join)
`,
    hints: [
      'The separator is a string: ".".join(words).',
      "Wrap that expression in print(...).",
    ],
    solutionCode: `words = ["learn", "python", "here"]
print(".".join(words))`,
    successCheck: { kind: "stdout_lines_include", lines: ["learn.python.here"] },
  },
  {
    id: "string-replace",
    title: "Swap text inside a string",
    blurb: "`.replace` returns a new string; the original stays unchanged.",
    category: "Warm-up",
    objectives: [
      'Start with s = "I like tea". Replace tea with code so the printed line says I like code.',
    ],
    starterCode: `s = "I like tea"
# Print s with tea replaced by code
`,
    hints: [
      "s.replace(\"tea\", \"code\") returns a new string.",
      "print that result.",
    ],
    solutionCode: `s = "I like tea"
print(s.replace("tea", "code"))`,
    successCheck: { kind: "stdout_lines_include", lines: ["I like code"] },
  },
  {
    id: "sum-squares",
    title: "Sum of squares",
    blurb: "A generator expression inside `sum` avoids building a temporary list.",
    category: "Logic",
    objectives: [
      "For nums = [1, 2, 3, 4], print the sum of each number squared (1 + 4 + 9 + 16 = 30).",
    ],
    starterCode: `nums = [1, 2, 3, 4]
# Print sum(n * n for n in nums)
`,
    hints: [
      "sum(n * n for n in nums) is the usual shape.",
      "print(...) around that expression.",
    ],
    solutionCode: `nums = [1, 2, 3, 4]
print(sum(n * n for n in nums))`,
    successCheck: { kind: "stdout_lines_include", lines: ["30"] },
  },
  {
    id: "while-accumulator",
    title: "Add with a while loop",
    blurb: "Update a running total until a condition stops you.",
    category: "Logic",
    objectives: [
      "Use a while loop to add the numbers 1 through 5 (1+2+3+4+5) and print the total (15).",
    ],
    starterCode: `# total starts at 0, n starts at 1
# while n <= 5: add n to total, then n += 1
# print total
`,
    hints: [
      "Initialize total = 0 and n = 1 before the loop.",
      "Inside: total += n then n += 1.",
    ],
    solutionCode: `total = 0
n = 1
while n <= 5:
    total += n
    n += 1
print(total)`,
    successCheck: { kind: "stdout_lines_include", lines: ["15"] },
  },
  {
    id: "tuple-unpack",
    title: "Unpack a tuple",
    blurb: "Multiple names on the left can match multiple values on the right.",
    category: "Data",
    objectives: [
      "Given point = (3, 7), unpack into x and y, then print x + y on one line (10).",
    ],
    starterCode: `point = (3, 7)
# x, y = point
# print x + y
`,
    hints: [
      "Write x, y = point on one line.",
      "print(x + y).",
    ],
    solutionCode: `point = (3, 7)
x, y = point
print(x + y)`,
    successCheck: { kind: "stdout_lines_include", lines: ["10"] },
  },
  {
    id: "set-unique",
    title: "Count unique values",
    blurb: "A set keeps unique items; len tells you how many.",
    category: "Data",
    objectives: [
      "Print how many unique numbers are in [1, 2, 2, 3, 3, 3] (answer: 3).",
    ],
    starterCode: `nums = [1, 2, 2, 3, 3, 3]
# Build a set from nums, then print its length
`,
    hints: [
      "set(nums) drops duplicates.",
      "len(...) counts members.",
    ],
    solutionCode: `nums = [1, 2, 2, 3, 3, 3]
print(len(set(nums)))`,
    successCheck: { kind: "stdout_lines_include", lines: ["3"] },
  },
  {
    id: "math-sqrt",
    title: "Use the math module",
    blurb: "`import math` unlocks sqrt, pi, trig, and more.",
    category: "Stdlib",
    objectives: [
      "Import math. Print the square root of 81 as a whole number (9) using int(...).",
    ],
    starterCode: `# import math
# print int form of sqrt(81)
`,
    hints: [
      "math.sqrt(81) is 9.0.",
      "int(...) turns it into 9 for a clean print.",
    ],
    solutionCode: `import math

print(int(math.sqrt(81)))`,
    successCheck: { kind: "stdout_lines_include", lines: ["9"] },
  },
  {
    id: "json-parse",
    title: "Read JSON text",
    blurb: "`json.loads` turns a JSON string into Python dicts and lists.",
    category: "Stdlib",
    objectives: [
      'Parse the JSON string into a dict and print the value of the key "points" (should be 100).',
    ],
    starterCode: `import json

payload = '{"name": "Ada", "points": 100}'
# Use json.loads then print the points field
`,
    hints: [
      "data = json.loads(payload) gives you a dict.",
      'print(data["points"]).',
    ],
    solutionCode: `import json

payload = '{"name": "Ada", "points": 100}'
data = json.loads(payload)
print(data["points"])`,
    successCheck: { kind: "stdout_lines_include", lines: ["100"] },
  },
  {
    id: "memory-file",
    title: "Write and read a file (in memory)",
    blurb: "Pyodide gives you a virtual filesystem: open, write, read, then print.",
    category: "Stdlib",
    objectives: [
      'Write the word done to a file named scratch.txt, then read it back and print the line (strip spaces).',
    ],
    starterCode: `# with open("scratch.txt", "w", encoding="utf-8") as f:
#     f.write("done")
# then open for reading, read(), strip(), print
`,
    hints: [
      "Use two with open(...) blocks or one write block and one read block.",
      "After reading, print(text.strip()).",
    ],
    solutionCode: `with open("scratch.txt", "w", encoding="utf-8") as f:
    f.write("done")

with open("scratch.txt", encoding="utf-8") as f:
    print(f.read().strip())`,
    successCheck: { kind: "stdout_lines_include", lines: ["done"] },
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
