export type PythonDictionaryCategory =
  | "Core syntax"
  | "Data types"
  | "Control flow"
  | "Functions"
  | "Data structures"
  | "Files and errors"
  | "Modules and packages"
  | "OOP"
  | "Data and ML";

export type PythonDictionaryEntry = {
  id: string;
  term: string;
  category: PythonDictionaryCategory;
  meaning: string;
  example?: string;
  related?: string[];
};

const entries: PythonDictionaryEntry[] = [
  {
    id: "variable",
    term: "variable",
    category: "Core syntax",
    meaning:
      "A name that points to a value. You create it with assignment, for example `x = 3`.",
    example: `x = 3
name = "Asha"`,
    related: ["assignment", "type"],
  },
  {
    id: "assignment",
    term: "assignment (`=`)",
    category: "Core syntax",
    meaning:
      "Stores a value under a name. In Python, `=` assigns, it does not test equality.",
    example: `score = 10`,
    related: ["variable", "comparison (`==`)"],
  },
  {
    id: "comparison-eq",
    term: "comparison (`==`)",
    category: "Core syntax",
    meaning:
      "Checks whether two values are equal. It returns `True` or `False`.",
    example: `print(3 == 3)  # True`,
    related: ["assignment (`=`)", "bool"],
  },
  {
    id: "comment",
    term: "comment (`#`)",
    category: "Core syntax",
    meaning:
      "Text for humans that Python ignores. Useful for brief intent notes.",
    example: `# convert from hours to minutes
minutes = hours * 60`,
    related: ["docstring"],
  },
  {
    id: "indentation",
    term: "indentation",
    category: "Core syntax",
    meaning:
      "Leading spaces that define code blocks in Python. Wrong indentation causes errors.",
    example: `if ok:
    print("runs")
print("outside block")`,
    related: ["if statement", "for loop", "while loop"],
  },
  {
    id: "operator-precedence",
    term: "operator precedence",
    category: "Core syntax",
    meaning:
      "Rules for which part of an expression runs first, such as multiplication before addition.",
    example: `print(2 + 3 * 4)      # 14
print((2 + 3) * 4)    # 20`,
    related: ["expression", "parentheses"],
  },
  {
    id: "is-operator",
    term: "`is` operator",
    category: "Core syntax",
    meaning:
      "Checks object identity, not value equality. Use `is` mainly for `None` checks.",
    example: `if value is None:
    print("missing")`,
    related: ["None", "comparison (`==`)"],
  },
  {
    id: "bool",
    term: "bool",
    category: "Data types",
    meaning: "A Boolean value, either `True` or `False`.",
    example: `is_ready = True`,
    related: ["if statement", "comparison (`==`)"],
  },
  {
    id: "str",
    term: "str",
    category: "Data types",
    meaning: "Text data, written in quotes.",
    example: `message = "Hello"`,
    related: ["f-string", "list"],
  },
  {
    id: "int",
    term: "int",
    category: "Data types",
    meaning: "Whole numbers, for example `-2`, `0`, `42`.",
    example: `count = 42`,
    related: ["float", "type"],
  },
  {
    id: "float",
    term: "float",
    category: "Data types",
    meaning: "Numbers with decimals, for example `3.14`.",
    example: `pi = 3.14159`,
    related: ["int", "type"],
  },
  {
    id: "none",
    term: "None",
    category: "Data types",
    meaning:
      "A special value meaning no value. Commonly used as a default placeholder.",
    example: `result = None`,
    related: ["is", "function"],
  },
  {
    id: "type-builtin",
    term: "type(...)",
    category: "Data types",
    meaning: "Returns the runtime type of a value.",
    example: `x = 3.14
print(type(x))  # float`,
    related: ["int", "float", "str", "bool"],
  },
  {
    id: "casting",
    term: "type casting",
    category: "Data types",
    meaning:
      "Converting a value from one type to another, for example text to integer.",
    example: `age_text = "21"
age = int(age_text)`,
    related: ["int", "float", "str", "try/except"],
  },
  {
    id: "if-statement",
    term: "if statement",
    category: "Control flow",
    meaning: "Runs code only when a condition is true.",
    example: `if score >= 60:
    print("pass")`,
    related: ["elif", "else", "bool"],
  },
  {
    id: "elif",
    term: "elif",
    category: "Control flow",
    meaning: "An additional condition checked if previous `if` conditions failed.",
    example: `if x > 10:
    print("big")
elif x > 5:
    print("medium")`,
    related: ["if statement", "else"],
  },
  {
    id: "else",
    term: "else",
    category: "Control flow",
    meaning: "Fallback block when earlier conditions did not match.",
    example: `if ok:
    print("yes")
else:
    print("no")`,
    related: ["if statement", "elif"],
  },
  {
    id: "range",
    term: "range(...)",
    category: "Control flow",
    meaning:
      "Creates an integer sequence often used in loops. End value is excluded.",
    example: `for i in range(3):
    print(i)  # 0, 1, 2`,
    related: ["for loop"],
  },
  {
    id: "enumerate",
    term: "enumerate(...)",
    category: "Control flow",
    meaning: "Loops with both index and value at the same time.",
    example: `for i, word in enumerate(["a", "b"], start=1):
    print(i, word)`,
    related: ["for loop", "list"],
  },
  {
    id: "for-loop",
    term: "for loop",
    category: "Control flow",
    meaning: "Repeats code for each item in a sequence.",
    example: `for n in [1, 2, 3]:
    print(n)`,
    related: ["while loop", "range"],
  },
  {
    id: "while-loop",
    term: "while loop",
    category: "Control flow",
    meaning: "Repeats code while a condition stays true.",
    example: `n = 0
while n < 3:
    n += 1`,
    related: ["for loop", "break", "continue"],
  },
  {
    id: "break",
    term: "break",
    category: "Control flow",
    meaning: "Stops the nearest loop immediately.",
    example: `for x in items:
    if x == target:
        break`,
    related: ["continue", "for loop"],
  },
  {
    id: "continue",
    term: "continue",
    category: "Control flow",
    meaning: "Skips to the next loop iteration.",
    example: `for n in nums:
    if n < 0:
        continue`,
    related: ["break", "for loop"],
  },
  {
    id: "function",
    term: "function",
    category: "Functions",
    meaning:
      "A reusable block of code defined with `def`. It can take inputs and return outputs.",
    example: `def add(a, b):
    return a + b`,
    related: ["return", "argument", "parameter"],
  },
  {
    id: "parameter",
    term: "parameter",
    category: "Functions",
    meaning:
      "A variable name in a function definition. It receives input when the function is called.",
    example: `def greet(name):
    print(name)`,
    related: ["argument", "function"],
  },
  {
    id: "argument",
    term: "argument",
    category: "Functions",
    meaning: "A value passed into a function call.",
    example: `greet("Mina")`,
    related: ["parameter", "function"],
  },
  {
    id: "return",
    term: "return",
    category: "Functions",
    meaning: "Sends a value back from a function to the caller.",
    example: `def square(x):
    return x * x`,
    related: ["function"],
  },
  {
    id: "lambda",
    term: "lambda",
    category: "Functions",
    meaning:
      "A small anonymous function expression, often used for short transformations.",
    example: `nums = [1, 2, 3]
print(list(map(lambda n: n * 2, nums)))`,
    related: ["function", "map", "sorted"],
  },
  {
    id: "scope",
    term: "scope",
    category: "Functions",
    meaning:
      "Where a variable name is visible. Local names exist inside a function unless explicitly shared.",
    related: ["function", "global"],
  },
  {
    id: "docstring",
    term: "docstring",
    category: "Functions",
    meaning:
      "A triple-quoted string at the top of a function, class, or module used as documentation.",
    example: `def add(a, b):
    """Return sum of a and b."""
    return a + b`,
    related: ["comment (`#`)", "function"],
  },
  {
    id: "f-string",
    term: "f-string",
    category: "Core syntax",
    meaning:
      "A string format style that inserts expressions inside braces, for example `{name}`.",
    example: `name = "Asha"
print(f"Hi {name}")`,
    related: ["str", "formatting"],
  },
  {
    id: "list",
    term: "list",
    category: "Data structures",
    meaning: "An ordered, mutable collection of items.",
    example: `nums = [1, 2, 3]
nums.append(4)`,
    related: ["tuple", "dict", "set"],
  },
  {
    id: "tuple",
    term: "tuple",
    category: "Data structures",
    meaning: "An ordered, immutable collection of items.",
    example: `point = (3, 4)`,
    related: ["list"],
  },
  {
    id: "dict",
    term: "dict",
    category: "Data structures",
    meaning: "A key-value mapping, sometimes called a hash map.",
    example: `user = {"name": "Asha", "age": 12}`,
    related: ["set", "list"],
  },
  {
    id: "set",
    term: "set",
    category: "Data structures",
    meaning: "An unordered collection of unique values.",
    example: `tags = {"python", "data", "python"}
print(tags)`,
    related: ["dict", "list"],
  },
  {
    id: "list-comprehension",
    term: "list comprehension",
    category: "Data structures",
    meaning:
      "A compact way to build a list from a loop, with optional filtering.",
    example: `squares = [n * n for n in range(5) if n % 2 == 0]`,
    related: ["for loop", "list"],
  },
  {
    id: "slice",
    term: "slice",
    category: "Data structures",
    meaning:
      "A way to take part of a sequence, usually with `[start:stop]` syntax.",
    example: `nums = [10, 20, 30, 40]
print(nums[1:3])`,
    related: ["list", "str"],
  },
  {
    id: "append",
    term: "append(...)",
    category: "Data structures",
    meaning: "Adds one item to the end of a list.",
    example: `items = [1, 2]
items.append(3)`,
    related: ["list", "extend(...)"],
  },
  {
    id: "extend",
    term: "extend(...)",
    category: "Data structures",
    meaning:
      "Adds every item from another iterable to the end of a list.",
    example: `items = [1, 2]
items.extend([3, 4])`,
    related: ["list", "append(...)"],
  },
  {
    id: "keys-values-items",
    term: "dict keys/values/items",
    category: "Data structures",
    meaning:
      "Methods to access dictionary keys, values, or key-value pairs for iteration.",
    example: `user = {"name": "Asha", "age": 12}
for k, v in user.items():
    print(k, v)`,
    related: ["dict", "for loop"],
  },
  {
    id: "import",
    term: "import",
    category: "Modules and packages",
    meaning: "Brings code from another module into your file.",
    example: `import math
print(math.sqrt(9))`,
    related: ["module", "package", "pip"],
  },
  {
    id: "module",
    term: "module",
    category: "Modules and packages",
    meaning: "A Python file that contains code you can import.",
    related: ["import", "package"],
  },
  {
    id: "package",
    term: "package",
    category: "Modules and packages",
    meaning: "A collection of related modules, often installable with `pip`.",
    related: ["module", "pip"],
  },
  {
    id: "pip",
    term: "pip",
    category: "Modules and packages",
    meaning:
      "The standard Python package installer. It downloads and installs libraries.",
    example: `pip install pandas`,
    related: ["package", "virtual environment"],
  },
  {
    id: "virtual-environment",
    term: "virtual environment",
    category: "Modules and packages",
    meaning:
      "An isolated Python environment so project dependencies do not conflict.",
    related: ["pip", "package"],
  },
  {
    id: "__name__-main",
    term: "__name__ == \"__main__\"",
    category: "Modules and packages",
    meaning:
      "A guard that runs code only when the file is executed directly, not when imported.",
    example: `def main():
    print("run app")

if __name__ == "__main__":
    main()`,
    related: ["module", "import"],
  },
  {
    id: "exception",
    term: "exception",
    category: "Files and errors",
    meaning:
      "A runtime error object. If not handled, it stops your program and prints a traceback.",
    related: ["try/except", "traceback"],
  },
  {
    id: "try-except",
    term: "try/except",
    category: "Files and errors",
    meaning:
      "A pattern to handle expected errors without crashing the whole program.",
    example: `try:
    n = int(text)
except ValueError:
    n = 0`,
    related: ["exception"],
  },
  {
    id: "traceback",
    term: "traceback",
    category: "Files and errors",
    meaning:
      "A stack trace showing where an error happened and which calls led to it.",
    related: ["exception"],
  },
  {
    id: "with-open",
    term: "with open(...)",
    category: "Files and errors",
    meaning:
      "The recommended way to read or write files, because it closes the file automatically.",
    example: `with open("notes.txt", "r", encoding="utf-8") as f:
    text = f.read()`,
    related: ["file", "context manager"],
  },
  {
    id: "finally",
    term: "finally",
    category: "Files and errors",
    meaning:
      "A block that always runs after `try`/`except`, even if there is a return or error.",
    example: `try:
    risky()
finally:
    cleanup()`,
    related: ["try/except", "exception"],
  },
  {
    id: "raise",
    term: "raise",
    category: "Files and errors",
    meaning: "Manually throws an exception when input or state is invalid.",
    example: `if n <= 0:
    raise ValueError("n must be positive")`,
    related: ["exception", "try/except"],
  },
  {
    id: "class",
    term: "class",
    category: "OOP",
    meaning:
      "A blueprint for creating objects that hold data and behavior together.",
    example: `class Counter:
    def __init__(self):
        self.n = 0`,
    related: ["object", "method", "__init__"],
  },
  {
    id: "object",
    term: "object (instance)",
    category: "OOP",
    meaning: "A concrete value created from a class.",
    example: `c = Counter()`,
    related: ["class", "method"],
  },
  {
    id: "method",
    term: "method",
    category: "OOP",
    meaning: "A function defined inside a class and called on instances.",
    example: `c.bump()`,
    related: ["class", "self"],
  },
  {
    id: "init",
    term: "__init__",
    category: "OOP",
    meaning:
      "A special method that runs when an object is created, usually to set initial state.",
    related: ["class", "object (instance)"],
  },
  {
    id: "self",
    term: "self",
    category: "OOP",
    meaning:
      "The current instance inside a method. It lets methods read and update that object's data.",
    related: ["class", "method"],
  },
  {
    id: "inheritance",
    term: "inheritance",
    category: "OOP",
    meaning:
      "A class can reuse and extend behavior from another class.",
    example: `class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "woof"`,
    related: ["class", "method", "super()"],
  },
  {
    id: "super",
    term: "super()",
    category: "OOP",
    meaning: "Lets a child class call a method from its parent class.",
    example: `class LoudGreeter(Greeter):
    def hi(self):
        return super().hi().upper()`,
    related: ["inheritance", "class"],
  },
  {
    id: "dataclass",
    term: "dataclass",
    category: "OOP",
    meaning:
      "A decorator that auto-generates boilerplate methods for data-holder classes.",
    example: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int`,
    related: ["class"],
  },
  {
    id: "numpy-array",
    term: "NumPy array",
    category: "Data and ML",
    meaning:
      "A fast, typed array for numerical computing. Common in data science and ML.",
    example: `import numpy as np
x = np.array([1.0, 2.0, 3.0])`,
    related: ["pandas DataFrame", "vectorization"],
  },
  {
    id: "pandas-dataframe",
    term: "pandas DataFrame",
    category: "Data and ML",
    meaning:
      "A table-like structure with labeled rows and columns, widely used for data analysis.",
    example: `import pandas as pd
df = pd.DataFrame({"x": [1, 2], "y": [3, 4]})`,
    related: ["NumPy array"],
  },
  {
    id: "train-test-split",
    term: "train/test split",
    category: "Data and ML",
    meaning:
      "A way to evaluate models by training on one part of data and testing on unseen data.",
    related: ["overfitting", "cross-validation"],
  },
  {
    id: "overfitting",
    term: "overfitting",
    category: "Data and ML",
    meaning:
      "When a model memorizes training noise and performs poorly on new data.",
    related: ["train/test split", "cross-validation"],
  },
  {
    id: "cross-validation",
    term: "cross-validation",
    category: "Data and ML",
    meaning:
      "Repeatedly splits training data into folds to estimate model performance more reliably.",
    related: ["train/test split", "overfitting"],
  },
  {
    id: "feature",
    term: "feature",
    category: "Data and ML",
    meaning:
      "An input variable used by a model, such as age, income, or word count.",
    related: ["target label", "pandas DataFrame"],
  },
  {
    id: "target-label",
    term: "target label",
    category: "Data and ML",
    meaning: "The outcome variable a model tries to predict.",
    related: ["feature", "classification", "regression (ML)"],
  },
  {
    id: "classification",
    term: "classification",
    category: "Data and ML",
    meaning:
      "A supervised learning task where the output is a category, such as spam/not spam.",
    related: ["target label", "precision", "recall"],
  },
  {
    id: "regression-ml",
    term: "regression (ML)",
    category: "Data and ML",
    meaning:
      "A supervised learning task where the output is a numeric value.",
    related: ["target label", "MSE"],
  },
  {
    id: "precision-metric",
    term: "precision",
    category: "Data and ML",
    meaning:
      "Out of all predicted positives, the fraction that are truly positive.",
    related: ["recall", "classification"],
  },
  {
    id: "recall-metric",
    term: "recall",
    category: "Data and ML",
    meaning:
      "Out of all truly positive examples, the fraction correctly predicted positive.",
    related: ["precision", "classification"],
  },
  {
    id: "mse",
    term: "MSE",
    category: "Data and ML",
    meaning:
      "Mean squared error, a common regression metric averaging squared prediction errors.",
    related: ["regression (ML)"],
  },
];

export const pythonDictionaryStarterTerms = [
  "variable",
  "assignment",
  "str",
  "int",
  "if-statement",
  "for-loop",
  "function",
  "return",
  "list",
  "dict",
  "import",
  "try-except",
] as const;

export function getPythonDictionaryEntries(): PythonDictionaryEntry[] {
  return entries;
}

