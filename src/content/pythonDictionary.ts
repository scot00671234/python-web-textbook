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
    meaning:
      "Ends the current function call immediately. With an expression, that expression becomes the call’s value; with no expression, or if execution falls off the end of the function, the call’s value is `None`.",
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
      "The region where a name binding is visible. Python looks up bare names using LEGB order: Local, Enclosing (nested functions), Global (module), Builtins. Assigning inside a function creates a local binding for the whole function unless you use `global` or `nonlocal`.",
    example: `x = 10
def show():
    x = 99
    print(x)  # local x`,
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
    example: `# math_tools.py
def add(a, b):
    return a + b`,
    related: ["import", "package"],
  },
  {
    id: "package",
    term: "package",
    category: "Modules and packages",
    meaning: "A collection of related modules, often installable with `pip`.",
    example: `# mypkg/__init__.py
# mypkg/utils.py
from mypkg import utils`,
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
    example: `python -m venv .venv
# activate, then:
pip install pandas`,
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
    example: `x = int("abc")  # ValueError`,
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
    example: `def f():
    int("x")
f()  # traceback shows call chain`,
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
    example: `class User:
    def __init__(self, name):
        self.name = name`,
    related: ["class", "object (instance)"],
  },
  {
    id: "self",
    term: "self",
    category: "OOP",
    meaning:
      "The current instance inside a method. It lets methods read and update that object's data.",
    example: `class Counter:
    def bump(self):
        self.n += 1`,
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
    example: `from sklearn.model_selection import train_test_split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)`,
    related: ["overfitting", "cross-validation"],
  },
  {
    id: "overfitting",
    term: "overfitting",
    category: "Data and ML",
    meaning:
      "When a model memorizes training noise and performs poorly on new data.",
    example: `print(model.score(X_train, y_train))  # high
print(model.score(X_test, y_test))    # much lower`,
    related: ["train/test split", "cross-validation"],
  },
  {
    id: "cross-validation",
    term: "cross-validation",
    category: "Data and ML",
    meaning:
      "Repeatedly splits training data into folds to estimate model performance more reliably.",
    example: `from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)`,
    related: ["train/test split", "overfitting"],
  },
  {
    id: "feature",
    term: "feature",
    category: "Data and ML",
    meaning:
      "An input variable used by a model, such as age, income, or word count.",
    example: `X = df[["age", "income", "sessions"]]`,
    related: ["target label", "pandas DataFrame"],
  },
  {
    id: "target-label",
    term: "target label",
    category: "Data and ML",
    meaning: "The outcome variable a model tries to predict.",
    example: `y = df["churned"]`,
    related: ["feature", "classification", "regression (ML)"],
  },
  {
    id: "classification",
    term: "classification",
    category: "Data and ML",
    meaning:
      "A supervised learning task where the output is a category, such as spam/not spam.",
    example: `from sklearn.linear_model import LogisticRegression
clf = LogisticRegression().fit(X_train, y_train)`,
    related: ["target label", "precision", "recall"],
  },
  {
    id: "regression-ml",
    term: "regression (ML)",
    category: "Data and ML",
    meaning:
      "A supervised learning task where the output is a numeric value.",
    example: `from sklearn.linear_model import LinearRegression
reg = LinearRegression().fit(X_train, y_train)`,
    related: ["target label", "MSE"],
  },
  {
    id: "precision-metric",
    term: "precision",
    category: "Data and ML",
    meaning:
      "Out of all predicted positives, the fraction that are truly positive.",
    example: `precision = tp / (tp + fp)`,
    related: ["recall", "classification"],
  },
  {
    id: "recall-metric",
    term: "recall",
    category: "Data and ML",
    meaning:
      "Out of all truly positive examples, the fraction correctly predicted positive.",
    example: `recall = tp / (tp + fn)`,
    related: ["precision", "classification"],
  },
  {
    id: "mse",
    term: "MSE",
    category: "Data and ML",
    meaning:
      "Mean squared error, a common regression metric averaging squared prediction errors.",
    example: `mse = ((y_true - y_pred) ** 2).mean()`,
    related: ["regression (ML)"],
  },
  {
    id: "expression",
    term: "expression",
    category: "Core syntax",
    meaning:
      "A piece of code that evaluates to a value, such as `2 + 3` or `name.upper()`.",
    example: `total = 2 + 3 * 4
print(total)`,
    related: ["operator precedence", "statement"],
  },
  {
    id: "statement",
    term: "statement",
    category: "Core syntax",
    meaning:
      "A complete instruction Python can execute, for example assignment, `if`, `for`, or `return`.",
    example: `x = 10
if x > 5:
    print("big")`,
    related: ["expression", "if statement"],
  },
  {
    id: "truthy-falsy",
    term: "truthy and falsy",
    category: "Data types",
    meaning:
      "Values Python treats like true or false in conditions. `0`, `\"\"`, `[]`, and `None` are common falsy values.",
    example: `items = []
if items:
    print("has data")
else:
    print("empty")`,
    related: ["bool", "if statement"],
  },
  {
    id: "pass",
    term: "pass",
    category: "Control flow",
    meaning:
      "A placeholder statement that does nothing. Useful when syntax requires a block but you are not ready to implement it.",
    example: `if debug_mode:
    pass`,
    related: ["if statement", "while loop"],
  },
  {
    id: "default-parameter",
    term: "default parameter",
    category: "Functions",
    meaning:
      "A function parameter with a fallback value used when the caller does not provide that argument.",
    example: `def power(base, exp=2):
    return base ** exp

print(power(5))`,
    related: ["parameter", "argument"],
  },
  {
    id: "keyword-arguments",
    term: "keyword arguments",
    category: "Functions",
    meaning:
      "Arguments passed by parameter name, which makes calls clearer and order-independent.",
    example: `def greet(name, excited=False):
    if excited:
        print("Hi", name, "!")

greet(name="Asha", excited=True)`,
    related: ["argument", "parameter"],
  },
  {
    id: "unpacking",
    term: "unpacking",
    category: "Data structures",
    meaning:
      "Assigning items from a sequence into multiple variables in one line.",
    example: `point = (3, 4)
x, y = point
print(x, y)`,
    related: ["tuple", "list"],
  },
  {
    id: "sorted-builtin",
    term: "sorted(...)",
    category: "Data structures",
    meaning:
      "Returns a new sorted list from any iterable without changing the original data.",
    example: `nums = [4, 1, 3]
print(sorted(nums))
print(nums)`,
    related: ["list", "lambda"],
  },
  {
    id: "assert",
    term: "assert",
    category: "Files and errors",
    meaning:
      "Checks a condition and raises an error if it is false. Useful for quick sanity checks while developing.",
    example: `x = 5
assert x > 0
assert x < 0  # raises AssertionError`,
    related: ["exception", "raise"],
  },
  {
    id: "alias-import",
    term: "import alias (`as`)",
    category: "Modules and packages",
    meaning:
      "Renames an imported module or symbol for shorter or clearer usage.",
    example: `import numpy as np
from math import sqrt as root
print(root(9))`,
    related: ["import", "module"],
  },
  {
    id: "encapsulation",
    term: "encapsulation",
    category: "OOP",
    meaning:
      "Bundling related data and behavior in one class, and exposing a clean interface to other code.",
    example: `class BankAccount:
    def __init__(self, balance):
        self._balance = balance

    def deposit(self, amount):
        self._balance += amount`,
    related: ["class", "method", "object (instance)"],
  },
  {
    id: "list-pop",
    term: "pop(...)",
    category: "Data structures",
    meaning:
      "Removes and returns an item from a list. By default it removes the last item.",
    example: `items = ["a", "b", "c"]
last = items.pop()
print(last)
print(items)`,
    related: ["list", "append(...)"],
  },
  {
    id: "dict-setdefault-method",
    term: "setdefault(...)",
    category: "Data structures",
    meaning:
      "Gets a dictionary value by key, and if missing, inserts a default value first.",
    example: `scores = {}
scores.setdefault("math", []).append(90)
scores.setdefault("math", []).append(95)
print(scores)`,
    related: ["dict", "dict keys/values/items"],
  },
  {
    id: "membership-in",
    term: "membership (`in`)",
    category: "Core syntax",
    meaning:
      "Checks whether a value exists in a collection or appears in a string.",
    example: `letters = ["a", "b", "c"]
print("b" in letters)
print("py" in "python")`,
    related: ["list", "str", "if statement"],
  },
  {
    id: "boolean-operators",
    term: "boolean operators (`and`, `or`, `not`)",
    category: "Control flow",
    meaning:
      "Combine or invert conditions to build more complex decision logic.",
    example: `age = 20
has_id = True
if age >= 18 and has_id:
    print("allow")`,
    related: ["bool", "if statement"],
  },
  {
    id: "ternary-expression",
    term: "ternary expression",
    category: "Control flow",
    meaning:
      "A short one-line `if/else` expression used to choose between two values.",
    example: `score = 72
label = "pass" if score >= 60 else "fail"
print(label)`,
    related: ["if statement", "expression"],
  },
  {
    id: "global-keyword",
    term: "global",
    category: "Functions",
    meaning:
      "Lets a function assign to a name defined at module level. Use sparingly because it can make code harder to reason about.",
    example: `count = 0

def bump():
    global count
    count += 1`,
    related: ["scope", "function"],
  },
  {
    id: "kwargs",
    term: "`*args` and `**kwargs`",
    category: "Functions",
    meaning:
      "Collect extra positional and keyword arguments in flexible function definitions.",
    example: `def show(*args, **kwargs):
    print(args)
    print(kwargs)

show(1, 2, mode="fast")`,
    related: ["argument", "parameter"],
  },
  {
    id: "open-modes",
    term: "file modes (`r`, `w`, `a`)",
    category: "Files and errors",
    meaning:
      "`r` reads, `w` writes from scratch, and `a` appends to the end of a file.",
    example: `with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("first line\\n")

with open("notes.txt", "a", encoding="utf-8") as f:
    f.write("second line\\n")`,
    related: ["with open(...)", "file"],
  },
  {
    id: "json-module",
    term: "json",
    category: "Modules and packages",
    meaning:
      "Standard library module for converting between Python objects and JSON text.",
    example: `import json
data = {"name": "Asha", "score": 95}
raw = json.dumps(data)
print(raw)
print(json.loads(raw)["name"])`,
    related: ["module", "dict"],
  },
  {
    id: "pathlib",
    term: "pathlib",
    category: "Modules and packages",
    meaning:
      "Standard library module for file system paths with object-oriented operations.",
    example: `from pathlib import Path
p = Path("data") / "report.csv"
print(p.name)
print(p.suffix)`,
    related: ["module", "with open(...)"],
  },
  {
    id: "classmethod",
    term: "@classmethod",
    category: "OOP",
    meaning:
      "A method that receives the class (`cls`) instead of an instance. Often used for alternate constructors.",
    example: `class User:
    def __init__(self, name):
        self.name = name

    @classmethod
    def guest(cls):
        return cls("Guest")`,
    related: ["class", "method", "staticmethod"],
  },
  {
    id: "staticmethod",
    term: "@staticmethod",
    category: "OOP",
    meaning:
      "A method stored in a class namespace that does not use `self` or `cls`.",
    example: `class MathTools:
    @staticmethod
    def add(a, b):
        return a + b

print(MathTools.add(2, 3))`,
    related: ["class", "method", "classmethod"],
  },
  {
    id: "vectorization",
    term: "vectorization",
    category: "Data and ML",
    meaning:
      "Applying operations to whole arrays at once instead of looping in pure Python, often much faster.",
    example: `import numpy as np
x = np.array([1, 2, 3])
print(x * 10)`,
    related: ["NumPy array", "pandas DataFrame"],
  },
  {
    id: "feature-scaling",
    term: "feature scaling",
    category: "Data and ML",
    meaning:
      "Rescaling input features to similar ranges so some models train more reliably.",
    example: `from sklearn.preprocessing import StandardScaler
X_scaled = StandardScaler().fit_transform(X)`,
    related: ["feature", "classification", "regression (ML)"],
  },
  {
    id: "list-sort",
    term: "list.sort(...)",
    category: "Data structures",
    meaning:
      "Sorts a list in place, which means it changes the original list directly.",
    example: `nums = [3, 1, 2]
nums.sort()
print(nums)`,
    related: ["sorted(...)", "list"],
  },
  {
    id: "dict-comprehension-term",
    term: "dict comprehension",
    category: "Data structures",
    meaning:
      "A compact way to build a dictionary from a loop expression.",
    example: `nums = [1, 2, 3]
squares = {n: n * n for n in nums}
print(squares)`,
    related: ["dict", "list comprehension"],
  },
  {
    id: "set-comprehension",
    term: "set comprehension",
    category: "Data structures",
    meaning:
      "A compact way to build a set from an iterable, often to keep unique transformed values.",
    example: `words = ["cat", "car", "dog"]
first_letters = {w[0] for w in words}
print(first_letters)`,
    related: ["set", "list comprehension"],
  },
  {
    id: "breakpoint",
    term: "breakpoint()",
    category: "Files and errors",
    meaning:
      "Pauses program execution and opens the debugger so you can inspect variables step by step.",
    example: `x = 10
y = x * 2
breakpoint()
z = y + 5`,
    related: ["traceback", "exception"],
  },
  {
    id: "stack-trace",
    term: "stack frame",
    category: "Files and errors",
    meaning:
      "One layer in the call stack, showing a function call context at a specific point in execution.",
    example: `def a():
    b()

def b():
    int("x")

a()`,
    related: ["traceback", "function"],
  },
  {
    id: "logging",
    term: "logging",
    category: "Files and errors",
    meaning:
      "A structured way to report runtime events (info, warnings, errors) instead of using only print.",
    example: `import logging
logging.basicConfig(level=logging.INFO)
logging.info("Started processing file")`,
    related: ["exception", "traceback"],
  },
  {
    id: "virtualenv-activate",
    term: "activate virtual environment",
    category: "Modules and packages",
    meaning:
      "Turns on an isolated environment so `python` and `pip` use project-specific packages.",
    example: `python -m venv .venv
# Windows PowerShell:
.venv\\Scripts\\Activate.ps1`,
    related: ["virtual environment", "pip"],
  },
  {
    id: "requirements-txt",
    term: "requirements.txt",
    category: "Modules and packages",
    meaning:
      "A text file listing Python package dependencies so others can install the same environment.",
    example: `pip freeze > requirements.txt
pip install -r requirements.txt`,
    related: ["pip", "package"],
  },
  {
    id: "init-py",
    term: "__init__.py",
    category: "Modules and packages",
    meaning:
      "A file that marks a directory as a Python package and can define package-level exports.",
    example: `# mypkg/__init__.py
from .utils import add`,
    related: ["package", "module"],
  },
  {
    id: "property-decorator",
    term: "@property",
    category: "OOP",
    meaning:
      "Lets you access a method like an attribute, useful for computed read-only values.",
    example: `class Circle:
    def __init__(self, r):
        self.r = r

    @property
    def area(self):
        return 3.14 * self.r * self.r`,
    related: ["class", "method", "encapsulation"],
  },
  {
    id: "dunder-method",
    term: "dunder method",
    category: "OOP",
    meaning:
      "A special method with double underscores, like `__init__`, that customizes Python object behavior.",
    example: `class User:
    def __repr__(self):
        return "User()"`,
    related: ["__init__", "class"],
  },
  {
    id: "random-seed",
    term: "random seed",
    category: "Data and ML",
    meaning:
      "A fixed starting value for random number generation so results are reproducible.",
    example: `import random
random.seed(42)
print(random.random())`,
    related: ["train/test split", "cross-validation"],
  },
  {
    id: "data-leakage",
    term: "data leakage",
    category: "Data and ML",
    meaning:
      "When information from the future or test data leaks into training, causing overly optimistic performance.",
    example: `# Bad pattern:
# fit scaler on all data before train/test split`,
    related: ["overfitting", "train/test split"],
  },
  {
    id: "confusion-matrix",
    term: "confusion matrix",
    category: "Data and ML",
    meaning:
      "A table counting true/false positives and negatives for classification models.",
    example: `from sklearn.metrics import confusion_matrix
print(confusion_matrix(y_true, y_pred))`,
    related: ["classification", "precision", "recall"],
  },
  {
    id: "causal-estimand",
    term: "estimand",
    category: "Data and ML",
    meaning:
      "The exact quantity you want to estimate, such as average treatment effect over a defined population and period.",
    example: `estimand = "Average treatment effect on test scores after one semester"
print(estimand)`,
    related: ["feature", "target label"],
  },
  {
    id: "counterfactual",
    term: "counterfactual",
    category: "Data and ML",
    meaning:
      "The unobserved outcome for the same unit under an alternative treatment state.",
    example: `# Conceptual example:
# observed: student had tutoring
# counterfactual: same student without tutoring`,
    related: ["estimand", "overfitting"],
  },
  {
    id: "confounder",
    term: "confounder",
    category: "Data and ML",
    meaning:
      "A variable that influences both treatment and outcome, which can bias naive comparisons.",
    example: `# Prior achievement can confound tutoring -> test score analysis`,
    related: ["estimand", "data leakage"],
  },
  {
    id: "collider",
    term: "collider",
    category: "Data and ML",
    meaning:
      "A variable caused by two other variables. Conditioning on it can introduce bias.",
    example: `# Conceptual: hiring decision influenced by skill and interview luck`,
    related: ["confounder", "estimand"],
  },
  {
    id: "intention-to-treat",
    term: "intention-to-treat (ITT)",
    category: "Data and ML",
    meaning:
      "Effect of assignment to treatment, regardless of whether participants actually complied.",
    example: `# Compare outcomes by assigned group, not only by actual uptake`,
    related: ["estimand", "confounder"],
  },
  {
    id: "parallel-trends",
    term: "parallel trends",
    category: "Data and ML",
    meaning:
      "A key Difference-in-Differences assumption that treated and comparison groups would have moved similarly without treatment.",
    example: `# Check pre-treatment trend alignment before using DiD`,
    related: ["estimand", "confounder"],
  },
  {
    id: "bandwidth-rdd",
    term: "bandwidth (RDD)",
    category: "Data and ML",
    meaning:
      "Window around a cutoff used in regression discontinuity analyses.",
    example: `# Keep observations with score in [cutoff - bw, cutoff + bw]`,
    related: ["estimand", "parallel trends"],
  },
  {
    id: "synthetic-control",
    term: "synthetic control",
    category: "Data and ML",
    meaning:
      "A weighted combination of untreated units used as a comparison path for one treated unit.",
    example: `effect = treated_post - synthetic_post`,
    related: ["estimand", "parallel trends"],
  },
  {
    id: "asymptotic-growth",
    term: "asymptotic growth",
    category: "Core syntax",
    meaning:
      "How runtime or memory grows as input size becomes large, which Big-O summarizes.",
    example: `# O(n) usually scales better than O(n^2) as n grows`,
    related: ["operator precedence", "expression"],
  },
  {
    id: "amortized-cost",
    term: "amortized cost",
    category: "Core syntax",
    meaning:
      "Average cost per operation over many operations, including occasional expensive ones.",
    example: `# Dict insertion is average O(1) amortized`,
    related: ["asymptotic growth", "list"],
  },
  {
    id: "correlation-id",
    term: "correlation id",
    category: "Files and errors",
    meaning:
      "An identifier attached to logs/events so one request can be traced across multiple components.",
    example: `logging.info("processed order", extra={"correlation_id": req_id})`,
    related: ["logging", "traceback"],
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

