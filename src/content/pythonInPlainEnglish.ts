/** Rough difficulty ramp: 1 first reads, 2 patterns you see in real scripts, 3 bigger ideas. */
export type PlainEnglishLevel = 1 | 2 | 3;

export const plainEnglishLevelLabel: Record<PlainEnglishLevel, string> = {
  1: "Getting started",
  2: "Building fluency",
  3: "Stretch readings",
};

export type PlainEnglishCard = {
  id: string;
  level: PlainEnglishLevel;
  title: string;
  code: string;
  /** Short plain-English points. Intent and flow, not a symbol-by-symbol gloss. */
  bullets: string[];
};

const cards: PlainEnglishCard[] = [
  // --- Level 1 ---
  {
    id: "hello-print",
    level: 1,
    title: "Printing a message",
    code: `print("Hello, world.")`,
    bullets: [
      "Tell Python to show the text Hello, world. on the screen.",
      "print is a built-in action. The text in quotes is a string value you pass to it.",
      "This line does not save anything for later. It only runs once when the program reaches it.",
    ],
  },
  {
    id: "comments",
    level: 1,
    title: "A note for humans only",
    code: `# score is still rough; fix rounding later
score = 87
print(score)`,
    bullets: [
      "The line starting with # is a comment. Python ignores it. It is only for people reading the file.",
      "The next line is real code: remember 87 under the name score.",
      "Then print that number. Comments help you remember why code exists without changing behavior.",
    ],
  },
  {
    id: "variables-and-fstring",
    level: 1,
    title: "Saving a value and using it in a sentence",
    code: `name = "Asha"
age = 12
print(f"{name} is {age} years old.")`,
    bullets: [
      "Remember the text Asha under the label name so you can use it again.",
      "Remember the number 12 under the label age.",
      "Build one sentence that plugs the remembered name and age into the sentence, then show that sentence on the screen.",
    ],
  },
  {
    id: "booleans",
    level: 1,
    title: "A true or false switch",
    code: `logged_in = True
if logged_in:
    print("Welcome back.")`,
    bullets: [
      "Remember the yes-or-no value True under the name logged_in.",
      "If that remembered value counts as true, run the indented welcome line.",
      "If it were False, Python would skip the indented block entirely.",
    ],
  },
  {
    id: "string-strip",
    level: 1,
    title: "Cleaning whitespace around text",
    code: `raw = "  hello  "
clean = raw.strip()
print(clean)`,
    bullets: [
      "Remember a string that has extra spaces on both sides.",
      "Ask for a new string that is the same letters but without leading or trailing spaces. Remember that as clean.",
      "Print clean so you see hello without the padding.",
    ],
  },
  {
    id: "if-elif-else",
    level: 1,
    title: "Choosing a branch",
    code: `score = 82
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("Keep practicing")`,
    bullets: [
      "Start with the number 82 stored as score.",
      "If the score is 90 or higher, show the letter A and skip the rest of this decision block.",
      "Otherwise, if the score is still 80 or higher, show B.",
      "If neither rule matched, tell the person to keep practicing.",
    ],
  },
  {
    id: "for-range",
    level: 1,
    title: "Repeating a fixed number of times",
    code: `for i in range(3):
    print(i)`,
    bullets: [
      "range(3) means count 0, then 1, then 2, and stop before 3.",
      "For each counted value, call that value i for the body of the loop.",
      "Each time through, print whatever i is right then. So you see 0, then 1, then 2.",
    ],
  },
  {
    id: "while-loop",
    level: 1,
    title: "Repeating while a condition stays true",
    code: `n = 0
while n < 3:
    print(n)
    n = n + 1`,
    bullets: [
      "Start with n equal to 0.",
      "As long as n is still less than 3, keep doing the indented block.",
      "Inside the block, print n, then bump n up by 1 so the loop can eventually stop.",
      "When n reaches 3, the condition fails and the loop ends.",
    ],
  },
  {
    id: "def-function",
    level: 1,
    title: "Naming a reusable recipe",
    code: `def square(x):
    return x * x

print(square(5))`,
    bullets: [
      "Define a small recipe called square. It expects one input you will call x.",
      "`return` stops the recipe right there and hands the caller the value of the expression after it (here x times x).",
      "Later, run the recipe with the number 5 plugged in. The call `square(5)` evaluates to 25, which `print` displays.",
    ],
  },
  {
    id: "list-build",
    level: 1,
    title: "Collecting values in order",
    code: `words = []
words.append("first")
words.append("second")
print(len(words))`,
    bullets: [
      "Start with an empty ordered list called words.",
      "Add the string first to the end of the list, then add second after it.",
      "Print how many items are in the list now (2).",
    ],
  },
  {
    id: "for-each-list",
    level: 1,
    title: "Doing something for every item in a list",
    code: `for word in ["tea", "water", "juice"]:
    print(word, len(word))`,
    bullets: [
      "Walk the list in order: tea, then water, then juice.",
      "For each item, temporarily call it word inside the loop body.",
      "Each time, print that word and how many characters it has.",
    ],
  },

  // --- Level 2 ---
  {
    id: "dict-lookup",
    level: 2,
    title: "Looking up meaning by key",
    code: `prices = {"apple": 1.2, "banana": 0.5}
print(prices["apple"])`,
    bullets: [
      "A dict maps each key to one value, like a two-column lookup table (not alphabetical like a paper dictionary, and keys can be many immutable types, not only strings).",
      "Look up the entry for apple with bracket syntax and print that number.",
      "If you asked for a key that is not in the dict, Python raises `KeyError` unless you use `.get` or another safe pattern.",
    ],
  },
  {
    id: "dict-get-default",
    level: 2,
    title: "Lookup with a fallback when the key might be missing",
    code: `counts = {"yes": 3}
n = counts.get("maybe", 0)
print(n)`,
    bullets: [
      "counts remembers how many times yes happened.",
      "Ask for the value at maybe. If that key does not exist, use 0 instead of crashing.",
      "Print that result, which is 0 here.",
    ],
  },
  {
    id: "enumerate-loop",
    level: 2,
    title: "Looping with both an index and the value",
    code: `items = ["a", "b", "c"]
for i, ch in enumerate(items):
    print(i, ch)`,
    bullets: [
      "You have an ordered list of strings.",
      "enumerate walks the list and hands you two things each time: the position i and the item ch.",
      "So you print 0 and a, then 1 and b, then 2 and c. Handy when you care about order, not only the value.",
    ],
  },
  {
    id: "try-except-input",
    level: 2,
    title: "Turning user text into a number safely",
    code: `raw = input("Enter a whole number: ")
try:
    n = int(raw)
    print("You typed", n)
except ValueError:
    print("That was not a whole number.")`,
    bullets: [
      "Ask the user for a line of text and remember it as raw.",
      "Try to convert that text to an integer. If it works, print a friendly message with the number.",
      "If the text cannot be converted to a whole number, do not crash. Show a clear apology instead.",
    ],
  },
  {
    id: "set-intersection",
    level: 2,
    title: "Finding what two groups share",
    code: `a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)`,
    bullets: [
      "Remember two unordered sets of unique numbers.",
      "The & operator means intersection: only values that appear in both sets.",
      "Print that shared set, here {2, 3}. Order might look random when printed, that is normal for sets.",
    ],
  },
  {
    id: "comprehension",
    level: 2,
    title: "Building a new list in one expression",
    code: `nums = [1, 2, 3, 4]
squares = [n * n for n in nums if n % 2 == 0]
print(squares)`,
    bullets: [
      "Start from the list of numbers 1 through 4.",
      "Build a new list: for each n in that list, if n is even, include n times n in the result.",
      "So only 2 and 4 qualify, and you get 4 and 16. Print that new list.",
    ],
  },
  {
    id: "mutable-default-guard",
    level: 2,
    title: "Avoiding a shared list across calls",
    code: `def add_one(x, acc=None):
    if acc is None:
        acc = []
    acc.append(x)
    return acc

print(add_one(1))
print(add_one(2))`,
    bullets: [
      "This function can collect numbers into a list called acc.",
      "If the caller does not pass acc, start a fresh empty list inside the call. Do not use [] directly in the header, or every call could share one list by accident.",
      "Each standalone call here gets its own list, so the prints are [1] and [2], not a growing shared list.",
    ],
  },
  {
    id: "with-open",
    level: 2,
    title: "Reading a file and closing it cleanly",
    code: `with open("notes.txt", "r", encoding="utf-8") as f:
    text = f.read()
print(text[:50])`,
    bullets: [
      "Open the file notes.txt for reading as text, using UTF-8 so characters decode sensibly.",
      "While the file is open, read the whole thing into memory as one big string called text.",
      "When the indented block ends, Python closes the file for you even if something went wrong.",
      "Then print only the first 50 characters as a quick preview.",
    ],
  },
  {
    id: "zip-parallel",
    level: 2,
    title: "Walking two lists in parallel",
    code: `names = ["Ann", "Bo"]
scores = [91, 88]
for name, score in zip(names, scores):
    print(name, score)`,
    bullets: [
      "You have two lists meant to line up by position.",
      "zip pairs the first name with the first score, then the second with the second, and stops when the shorter list ends.",
      "Each pass prints one name and its matching score.",
    ],
  },

  // --- Level 3 ---
  {
    id: "class-instance",
    level: 3,
    title: "A tiny blueprint and one object built from it",
    code: `class Counter:
    def __init__(self):
        self.n = 0

    def bump(self):
        self.n = self.n + 1

c = Counter()
c.bump()
print(c.n)`,
    bullets: [
      "Describe a kind of thing called Counter. Each counter remembers its own n, starting at 0.",
      "bump means add one to this counter's own n.",
      "Make one counter called c, call bump once on it, then print that counter's n (1).",
    ],
  },
  {
    id: "inheritance-override",
    level: 3,
    title: "A more specific kind that replaces one behavior",
    code: `class Greeter:
    def hi(self):
        return "Hello"

class LoudGreeter(Greeter):
    def hi(self):
        return super().hi().upper()

print(LoudGreeter().hi())`,
    bullets: [
      "Greeter knows how to say hi in a calm way.",
      "LoudGreeter is a subtype: it redefines hi to mean call the parent version, then shout it with upper.",
      "super().hi() means use the old recipe from the class above. The print shows HELLO in all caps.",
    ],
  },
  {
    id: "generator-yield",
    level: 3,
    title: "Producing values one at a time, on demand",
    code: `def first_three():
    yield 1
    yield 2
    yield 3

for n in first_three():
    print(n)`,
    bullets: [
      "first_three is a generator function. yield means pause here and hand this value to whoever is iterating.",
      "The caller's for loop pulls values until the function runs out of yields.",
      "You print 1, then 2, then 3 without building a whole list in memory first.",
    ],
  },
  {
    id: "decorator-wrap",
    level: 3,
    title: "Wrapping a function to run extra steps around it",
    code: `def announce(fn):
    def inner(*args, **kwargs):
        print("about to run")
        return fn(*args, **kwargs)
    return inner

@announce
def add(a, b):
    return a + b

print(add(2, 3))`,
    bullets: [
      "announce builds a new little function inner that prints a line, then calls the original function with whatever arguments you passed.",
      "The @announce line means: replace add with the wrapped version so every call goes through inner.",
      "So calling add(2, 3) prints about to run, then returns 5 from the real add, and that return value is what print shows.",
    ],
  },
  {
    id: "map-filter",
    level: 3,
    title: "Transforming and filtering in one breath",
    code: `nums = [1, 2, 3, 4, 5]
small_even = list(
    map(lambda n: n * 10, filter(lambda n: n % 2 == 0, nums))
)
print(small_even)`,
    bullets: [
      "Start from a list of integers.",
      "filter keeps only the even numbers: 2 and 4 here.",
      "map multiplies each kept number by 10, giving 20 and 40.",
      "list(...) turns the lazy pipeline into a real list you can print.",
    ],
  },

  // --- More level 1 ---
  {
    id: "input-line",
    level: 1,
    title: "Asking the user for one line of text",
    code: `name = input("What is your name? ")
print("Nice to meet you,", name)`,
    bullets: [
      "Show the prompt text, wait until the user types a line and presses Enter.",
      "Remember whatever they typed (without the final Enter) under the name name.",
      "Print a greeting that includes that remembered text.",
    ],
  },
  {
    id: "substring-in",
    level: 1,
    title: "Checking if a piece of text appears inside another",
    code: `word = "team"
if "eat" in word:
    print("found it")
else:
    print("nope")`,
    bullets: [
      "Remember the string team.",
      "The in operator asks whether the letters eat appear in order inside that string. Here they do (t-ea-m).",
      "So Python runs the first branch and prints found it.",
    ],
  },
  {
    id: "tuple-unpack",
    level: 1,
    title: "Splitting a pair into two names at once",
    code: `point = (3, 4)
x, y = point
print(x + y)`,
    bullets: [
      "Remember a pair of numbers as one tuple value.",
      "Unpack means give the first slot the name x and the second slot the name y in one step.",
      "Print x plus y, which is 7 here.",
    ],
  },
  {
    id: "multiline-string",
    level: 1,
    title: "A string that spans several lines",
    code: `note = """Line one
Line two"""
print(note)`,
    bullets: [
      "Triple quotes start a string that can include real line breaks inside it.",
      "Remember that whole block of text under note.",
      "Print it so both lines appear exactly as written.",
    ],
  },
  {
    id: "augmented-add",
    level: 1,
    title: "Shorthand for updating a number in place",
    code: `score = 10
score += 5
print(score)`,
    bullets: [
      "Start with score equal to 10.",
      "score += 5 means take the current score, add 5, and put the result back into score.",
      "Print score, now 15.",
    ],
  },
  {
    id: "string-index",
    level: 1,
    title: "Grabbing one character by position",
    code: `s = "Python"
print(s[0], s[-1])`,
    bullets: [
      "Remember the string Python.",
      "Index 0 is the first character, capital P.",
      "Index -1 is a Python trick meaning last character, here n.",
    ],
  },
  {
    id: "len-string",
    level: 1,
    title: "How long is this text",
    code: `msg = "Hi!"
print(len(msg))`,
    bullets: [
      "Remember a short string.",
      "len counts how many characters are in it, including punctuation.",
      "Print that count, 3 for Hi!.",
    ],
  },
  {
    id: "not-operator",
    level: 1,
    title: "Flipping yes and no",
    code: `ready = False
if not ready:
    print("wait")`,
    bullets: [
      "ready is false, meaning not ready yet.",
      "not ready flips it to true for the if test.",
      "So the indented line runs and prints wait.",
    ],
  },
  {
    id: "min-max",
    level: 1,
    title: "Picking the smallest or largest out of several numbers",
    code: `print(min(4, 9, 2))
print(max(4, 9, 2))`,
    bullets: [
      "min looks at all the values you pass and returns the smallest, here 2.",
      "max returns the largest, here 9.",
      "These work with more than two arguments and with lists too.",
    ],
  },
  {
    id: "type-builtin",
    level: 1,
    title: "Asking what kind of value something is",
    code: `x = 3.14
print(type(x))`,
    bullets: [
      "Remember a floating point number under x.",
      "type(x) asks Python for a small description object that represents the float type.",
      "Printing it shows something like class float, which helps when debugging mixed data.",
    ],
  },

  // --- More level 2 ---
  {
    id: "split-join",
    level: 2,
    title: "Breaking a sentence into words and gluing words back",
    code: `s = "one fish two fish"
words = s.split()
print(words)
print(" ".join(words))`,
    bullets: [
      "split with no argument splits on whitespace and gives a list of word strings.",
      "Printing words shows a list with four pieces.",
      "join is the opposite on strings: put a single space between every word and build one string again.",
    ],
  },
  {
    id: "list-slice",
    level: 2,
    title: "Taking a middle piece of a list without changing the original",
    code: `nums = [10, 20, 30, 40, 50]
chunk = nums[1:4]
print(chunk)`,
    bullets: [
      "nums is an ordered list of five numbers.",
      "The slice 1:4 means start at index 1 (20) and stop before index 4 (exclusive), so you get 20, 30, 40.",
      "chunk is a new list. nums itself is unchanged.",
    ],
  },
  {
    id: "dict-items-loop",
    level: 2,
    title: "Walking every key and value in a dictionary",
    code: `ages = {"Ann": 12, "Bo": 14}
for name, age in ages.items():
    print(name, "is", age)`,
    bullets: [
      "ages maps each person's name to an integer age.",
      "items hands you pairs name, age one at a time in a loop.",
      "Each pass prints one sentence about that person.",
    ],
  },
  {
    id: "shallow-copy-list",
    level: 2,
    title: "Shallow copy of a list: new list, same inner objects",
    code: `a = [1, 2, 3]
b = a[:]
b[0] = 99
print(a[0], b[0])`,
    bullets: [
      "a points at a list of three numbers.",
      "b = a[:] makes a new list with the same top-level elements.",
      "Changing b[0] does not change a[0] here because the integers themselves are not shared containers. (If elements were mutable lists, shallow copies get trickier.)",
    ],
  },
  {
    id: "any-all",
    level: 2,
    title: "Asking if at least one or every value passes a test",
    code: `flags = [False, True, False]
print(any(flags), all(flags))`,
    bullets: [
      "flags is a list of booleans.",
      "any means is at least one entry true. Here yes, because of the middle True.",
      "all means is every entry true. Here no, because of the False values.",
    ],
  },
  {
    id: "raise-valueerror",
    level: 2,
    title: "Stopping early with a clear error when input is wrong",
    code: `def pick_positive(n):
    if n <= 0:
        raise ValueError("n must be positive")
    return n * 2

print(pick_positive(3))`,
    bullets: [
      "pick_positive expects a positive number.",
      "If someone passes zero or negative, do not guess. Raise ValueError with a human message.",
      "If the value is fine, return twice that number. The print shows 6 for input 3.",
    ],
  },
  {
    id: "isinstance-check",
    level: 2,
    title: "Branching based on the type of a value",
    code: `def describe(x):
    if isinstance(x, int):
        return "integer"
    if isinstance(x, str):
        return "text"
    return "something else"

print(describe(5), describe("hi"))`,
    bullets: [
      "describe looks at whatever object you pass in.",
      "isinstance checks the real runtime type, not only what a name sounds like.",
      "First call returns integer, second returns text.",
    ],
  },
  {
    id: "json-loads",
    level: 2,
    title: "Turning JSON text into Python lists and dicts",
    code: `import json

raw = '{"count": 3, "ok": true}'
data = json.loads(raw)
print(data["count"], data["ok"])`,
    bullets: [
      "json.loads reads a string that looks like JSON and builds normal Python objects.",
      "Here you get a dict with keys count and ok.",
      "Printing those entries shows 3 and True.",
    ],
  },
  {
    id: "sorted-key",
    level: 2,
    title: "Sorting by something other than the default order",
    code: `words = ["aa", "z", "bbb"]
print(sorted(words, key=len))`,
    bullets: [
      "You have three strings of different lengths.",
      "sorted without key would use alphabetical order.",
      "Passing key=len tells sorted to compare by length instead, so order becomes z, aa, bbb.",
    ],
  },
  {
    id: "for-else-no-break",
    level: 2,
    title: "Running a cleanup block only if the loop never hit break",
    code: `for n in [2, 4, 6]:
    if n == 5:
        print("found")
        break
else:
    print("never found five")`,
    bullets: [
      "The loop checks each number. None of them equals 5.",
      "Because break never ran, Python runs the else attached to the for.",
      "That else does not mean otherwise after if. It means the loop finished without breaking.",
    ],
  },
  {
    id: "docstring-def",
    level: 2,
    title: "Attaching a help string to a function",
    code: `def add(a, b):
    """Return the sum of a and b."""
    return a + b

print(add.__doc__.strip())`,
    bullets: [
      "The first string inside the function, in triple quotes, is stored as documentation, not run as code.",
      "Python keeps it on add.__doc__ for tools and humans.",
      "Printing it shows the sentence you wrote about what add does.",
    ],
  },
  {
    id: "pathlib-join",
    level: 2,
    title: "Building file paths without messy slash strings",
    code: `from pathlib import Path

p = Path("data") / "2024" / "log.txt"
print(p)`,
    bullets: [
      "Path represents a path on disk in an object-oriented way.",
      "Using / between Path objects and strings joins folders in the right style for your OS.",
      "Printing shows one combined path string.",
    ],
  },

  // --- More level 3 ---
  {
    id: "property-decorator",
    level: 3,
    title: "Making a method look like simple attribute access",
    code: `class Circle:
    def __init__(self, r):
        self.r = r

    @property
    def area(self):
        return 3.14159 * self.r * self.r

c = Circle(2)
print(c.area)`,
    bullets: [
      "Circle stores a radius r.",
      "The property decorator lets you write a method area that behaves like reading an attribute: no parentheses.",
      "Behind the scenes Python still runs your function, so you can compute from r instead of storing area twice.",
    ],
  },
  {
    id: "dataclass-tiny",
    level: 3,
    title: "Letting Python write boring boilerplate for a data holder",
    code: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p)`,
    bullets: [
      "@dataclass tells Python to auto-build init, repr, and comparisons for fields you list.",
      "Point is just two integers with names x and y.",
      "Creating Point(1, 2) works without you writing def __init__ by hand.",
    ],
  },
  {
    id: "match-case",
    level: 3,
    title: "Branching on the shape of a value in Python 3.10+",
    code: `cmd = ("move", 3)
match cmd:
    case ("move", n):
        print("move by", n)
    case _:
        print("unknown")`,
    bullets: [
      "cmd is a tuple with a string tag and a number.",
      "match compares cmd to patterns. The first pattern expects the literal move and captures the second slot as n.",
      "So it prints move by 3. The underscore pattern is a catch-all if nothing else matched.",
    ],
  },
  {
    id: "functools-partial",
    level: 3,
    title: "Freezing some arguments so the rest can be filled in later",
    code: `from functools import partial

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
print(square(5))`,
    bullets: [
      "power needs a base and an exponent.",
      "partial builds a new callable square that always uses exp equal to 2.",
      "Calling square(5) really calls power(5, 2), so you get 25.",
    ],
  },
  {
    id: "yield-from",
    level: 3,
    title: "Delegating to another generator without a manual loop",
    code: `def inner():
    yield 1
    yield 2

def outer():
    yield from inner()
    yield 3

print(list(outer()))`,
    bullets: [
      "inner yields two values.",
      "yield from inner() means yield everything inner would yield, as if those yields happened inside outer.",
      "Then outer yields 3. list collects everything into [1, 2, 3].",
    ],
  },
  {
    id: "staticmethod",
    level: 3,
    title: "A helper that belongs to the class but does not need self",
    code: `class Mathy:
    @staticmethod
    def add(a, b):
        return a + b

print(Mathy.add(2, 3))`,
    bullets: [
      "staticmethod marks a function that lives in the class namespace but does not receive the instance as first argument.",
      "You can call it on the class name without making an object first.",
      "Here it is just a namespaced add that returns 5.",
    ],
  },
  {
    id: "abstract-base",
    level: 3,
    title: "Forcing subclasses to implement a method",
    code: `class Animal:
    def speak(self):
        raise NotImplementedError("subclasses must implement")

class Dog(Animal):
    def speak(self):
        return "woof"

print(Dog().speak())`,
    bullets: [
      "Animal defines the idea speak but refuses to run it on the base class itself.",
      "NotImplementedError is a loud signal to programmers: override this in every concrete subtype.",
      "Dog provides speak, so calling it on a Dog returns woof.",
    ],
  },
  {
    id: "generator-expression",
    level: 3,
    title: "A one-shot iterator instead of building a whole list",
    code: `nums = (n * n for n in range(4))
print(sum(nums))`,
    bullets: [
      "Parentheses with for inside create a generator expression: lazy, one value at a time.",
      "sum walks that iterator and adds without storing all squares in a list first.",
      "Here squares are 0, 1, 4, 9 and the total is 14.",
    ],
  },
  {
    id: "try-finally-return",
    level: 3,
    title: "Cleanup that still runs even when you return inside try",
    code: `def demo():
    try:
        return 1
    finally:
        print("cleanup")

print(demo())`,
    bullets: [
      "try can contain a return like any other block.",
      "finally means run this block on the way out no matter how try exits, including return.",
      "So cleanup prints before the caller sees the returned 1.",
    ],
  },

  // --- Intermediate-heavy (mostly level 2) ---
  {
    id: "defaultdict-int",
    level: 2,
    title: "A dict that invents a default value for missing keys",
    code: `from collections import defaultdict

counts = defaultdict(int)
counts["a"] += 1
counts["a"] += 1
print(counts["a"], counts["missing"])`,
    bullets: [
      "defaultdict(int) means if you read a key that was never set, you get 0 automatically instead of KeyError.",
      "So += on a fresh key starts from zero and increments cleanly.",
      "missing was never written, but reading it returns 0 and does not store the key unless you assign later.",
    ],
  },
  {
    id: "counter-most-common",
    level: 2,
    title: "Counting how often each thing appears",
    code: `from collections import Counter

c = Counter(["red", "blue", "red", "red"])
print(c.most_common(1))`,
    bullets: [
      "Counter walks an iterable and builds a map from item to how many times it showed up.",
      "red appears three times, blue once.",
      "most_common(1) returns a short ranked list, here telling you red won first place.",
    ],
  },
  {
    id: "deque-popleft",
    level: 2,
    title: "A double-ended queue: fast pops from the front",
    code: `from collections import deque

q = deque([1, 2, 3])
q.append(4)
print(q.popleft(), list(q))`,
    bullets: [
      "deque is tuned for fast pushes and pops on both ends, unlike a list where popping index 0 is slow for huge data.",
      "append adds on the right.",
      "popleft removes the leftmost item and returns it, so you see 1 and the rest becomes [2, 3, 4].",
    ],
  },
  {
    id: "namedtuple-row",
    level: 2,
    title: "Giving tuple fields readable names",
    code: `from collections import namedtuple

Row = namedtuple("Row", ["id", "score"])
r = Row(id=7, score=91)
print(r.score)`,
    bullets: [
      "namedtuple builds a tiny class whose instances behave like tuples but let you read fields by name.",
      "Row(7, 91) would also work positionally; keyword form is clearer.",
      "r.score is nicer than remembering index 1 means score.",
    ],
  },
  {
    id: "dict-setdefault",
    level: 2,
    title: "Insert a default once, then work with the real value",
    code: `d = {}
d.setdefault("k", []).append(1)
d.setdefault("k", []).append(2)
print(d["k"])`,
    bullets: [
      "setdefault says if key k is missing, store this default (here a new empty list) and return that value.",
      "Either way you get the list for k, then append.",
      "Both appends hit the same list, so you see [1, 2].",
    ],
  },
  {
    id: "dict-comprehension",
    level: 2,
    title: "Building a dict from a loop in one expression",
    code: `nums = [1, 2, 3]
squares = {n: n * n for n in nums}
print(squares[2])`,
    bullets: [
      "Curly braces with for inside build a dict instead of a list.",
      "Each n becomes a key and n squared becomes the stored value.",
      "Looking up 2 returns 4.",
    ],
  },
  {
    id: "walrus-if",
    level: 2,
    title: "Assigning and testing in one step with the walrus operator",
    code: `text = "hello"
if (n := len(text)) > 3:
    print("long enough", n)`,
    bullets: [
      ":= inside parentheses means compute len(text), store it as n, and also use that value in the comparison.",
      "So the condition reads both assign n and ask if n is greater than 3.",
      "The branch runs and prints long enough plus 5.",
    ],
  },
  {
    id: "unpack-call-star",
    level: 2,
    title: "Spreading a list into separate function arguments",
    code: `def add_three(a, b, c):
    return a + b + c

nums = [1, 2, 3]
print(add_three(*nums))`,
    bullets: [
      "add_three expects three separate numbers.",
      "*nums in a call means unpack this list positionally: first item as a, second as b, third as c.",
      "So the sum is 6.",
    ],
  },
  {
    id: "merge-dicts-pipe",
    level: 2,
    title: "Merging two dicts into a new one (Python 3.9+)",
    code: `a = {"x": 1}
b = {"y": 2, "x": 99}
print(a | b)`,
    bullets: [
      "The | operator on dicts builds a brand new dict containing keys from both sides.",
      "When both sides have the same key, the right-hand side wins for that key.",
      "So x becomes 99 from b, and y is 2. Original dicts a and b are unchanged.",
    ],
  },
  {
    id: "bytes-decode",
    level: 2,
    title: "Turning raw bytes into text with an encoding",
    code: `raw = b"caf\\xc3\\xa9"
print(raw.decode("utf-8"))`,
    bullets: [
      "The b prefix means bytes: raw binary data, not a str yet.",
      "decode chooses how those bytes map to characters. UTF-8 is the usual choice on the web.",
      "Here the bytes spell the word cafe with an acute accent on the e once decoded.",
    ],
  },
  {
    id: "regex-search",
    level: 2,
    title: "Looking for a pattern inside a string",
    code: `import re

m = re.search(r"\\d+", "Room 404")
if m:
    print(m.group(0))`,
    bullets: [
      "re.search scans the string for the first place the pattern matches.",
      "Here the pattern means one or more digits in a row.",
      "If found, group(0) is the matched text, here 404.",
    ],
  },
  {
    id: "datetime-isoformat",
    level: 2,
    title: "Getting a timestamp object and printing it cleanly",
    code: `from datetime import datetime, timezone

now = datetime.now(timezone.utc)
print(now.isoformat())`,
    bullets: [
      "datetime.now with UTC timezone asks the clock for the current instant in a timezone-aware way.",
      "isoformat turns that instant into a standard string good for logs and APIs.",
      "Exact string shape includes date, time, and offset information.",
    ],
  },
  {
    id: "enumerate-start",
    level: 2,
    title: "Starting numbering somewhere other than zero",
    code: `items = ["a", "b", "c"]
for rank, ch in enumerate(items, start=1):
    print(rank, ch)`,
    bullets: [
      "enumerate still walks items in order.",
      "start=1 means the first index handed to you is 1 instead of 0, useful for human-facing ranks.",
      "You print 1 a, then 2 b, then 3 c.",
    ],
  },
  {
    id: "itertools-chain",
    level: 2,
    title: "Walking several iterables as if they were glued together",
    code: `from itertools import chain

a = [1, 2]
b = [3, 4]
print(list(chain(a, b)))`,
    bullets: [
      "chain does not build one big list in memory up front.",
      "It yields 1, then 2, then 3, then 4 as if you concatenated the two inputs for iteration only.",
      "list(...) forces all values into a list for printing.",
    ],
  },
  {
    id: "itertools-islice",
    level: 2,
    title: "Taking the first few items from any iterator cheaply",
    code: `from itertools import islice

def naturals():
    n = 0
    while True:
        yield n
        n += 1

print(list(islice(naturals(), 3)))`,
    bullets: [
      "naturals is an infinite generator of 0, 1, 2, ...",
      "islice pulls only the first three values then stops asking naturals for more.",
      "So you can safely print [0, 1, 2] without an infinite loop.",
    ],
  },
  {
    id: "operator-itemgetter-sort",
    level: 2,
    title: "Sorting rows by a specific column key",
    code: `from operator import itemgetter

rows = [("ann", 91), ("bo", 88), ("cam", 95)]
print(sorted(rows, key=itemgetter(1)))`,
    bullets: [
      "Each row is a tuple of name then score.",
      "itemgetter(1) builds a small function that returns index 1 of whatever tuple you pass.",
      "sorted uses that as the comparison key, so ordering is by score ascending.",
    ],
  },
  {
    id: "functools-reduce",
    level: 2,
    title: "Collapsing a list down to one value with a repeated rule",
    code: `from functools import reduce

nums = [2, 3, 4]
print(reduce(lambda a, b: a * b, nums))`,
    bullets: [
      "reduce walks left to right, keeping an accumulator.",
      "Here the rule is multiply: start with 2, multiply by 3 to get 6, multiply by 4 to get 24.",
      "For sums and products on big data, dedicated builtins or math are often clearer, but reduce shows the pattern.",
    ],
  },
  {
    id: "copy-deepcopy",
    level: 2,
    title: "Cloning nested lists so inner lists do not stay shared",
    code: `import copy

a = [[1], [2]]
b = copy.deepcopy(a)
b[0].append(9)
print(a[0], b[0])`,
    bullets: [
      "a is a list whose elements are other lists.",
      "A shallow copy would share those inner lists. deepcopy walks the structure and duplicates inner mutable objects too.",
      "So appending inside b[0] does not change a[0]. You see [1] versus [1, 9] depending on which you print.",
    ],
  },
  {
    id: "zip-strict",
    level: 2,
    title: "Catching length mistakes when zipping two lists",
    code: `names = ["a", "b"]
scores = [1, 2, 3]
try:
    list(zip(names, scores, strict=True))
except ValueError as e:
    print("length mismatch")`,
    bullets: [
      "zip normally stops at the shorter list and silently ignores extras.",
      "strict=True means lengths must match or Python raises ValueError.",
      "That saves subtle bugs when you thought two columns lined up but one row was missing.",
    ],
  },
  {
    id: "logging-basic",
    level: 2,
    title: "Sending messages through the logging pipeline instead of print",
    code: `import logging

logging.basicConfig(level=logging.INFO)
logging.info("server started")`,
    bullets: [
      "basicConfig sets default behavior like minimum level and output format once per process in simple scripts.",
      "info writes a normal informational line if the level filter allows it.",
      "Real apps attach handlers for files or remote collectors; the idea is the same: one API, many sinks.",
    ],
  },
  {
    id: "csv-dictreader",
    level: 2,
    title: "Reading a CSV row as a dictionary keyed by column name",
    code: `import csv
from io import StringIO

raw = "name,score\\nAnn,91\\nBo,88\\n"
for row in csv.DictReader(StringIO(raw)):
    print(row["name"], row["score"])`,
    bullets: [
      "DictReader reads the first line as field names.",
      "Each later line becomes a dict mapping column name to cell text as strings.",
      "The loop prints each person's name and score using those keys.",
    ],
  },
  {
    id: "optional-type-hint",
    level: 2,
    title: "Telling readers a value might be missing (type hints)",
    code: `def greet(name: str | None) -> str:
    if name is None:
        return "Hello, friend"
    return f"Hello, {name}"`,
    bullets: [
      "The parameter name may be a real string or the special value None.",
      "The arrow return type says this function always returns a str when it finishes.",
      "Type hints do not change runtime by themselves; they guide humans and tools like mypy.",
    ],
  },
  {
    id: "context-manager-class",
    level: 3,
    title: "Writing your own with-block using enter and exit",
    code: `class Tag:
    def __enter__(self):
        print("enter")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("exit")
        return False

with Tag() as t:
    print("body")`,
    bullets: [
      "__enter__ runs when entering the with block. Its return value binds to t here.",
      "The indented body runs next.",
      "__exit__ always runs on the way out, even on errors. Returning False means do not swallow exceptions.",
    ],
  },
  {
    id: "typing-protocol",
    level: 3,
    title: "Promising an object has certain methods without inheritance",
    code: `from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

def render(x: Drawable) -> None:
    x.draw()`,
    bullets: [
      "Protocol describes the surface you need: anything with a draw method that returns None matches structurally.",
      "render does not care about the concrete class name, only that x supports draw.",
      "Static checkers use that hint; Python still uses duck typing at runtime.",
    ],
  },
  {
    id: "exception-notes-from",
    level: 2,
    title: "Raising a new error while keeping the original story attached",
    code: `try:
    int("nope")
except ValueError as e:
    raise RuntimeError("bad input") from e`,
    bullets: [
      "int raises ValueError for non-numeric text.",
      "You catch it and raise RuntimeError with your own message for callers.",
      "from e chains the exceptions so tracebacks show both the wrapper and the root cause.",
    ],
  },
  {
    id: "list-extend",
    level: 2,
    title: "Adding many items from another iterable at the end",
    code: `a = [1, 2]
a.extend([3, 4])
print(a)`,
    bullets: [
      "extend walks the other iterable and appends each element one by one.",
      "That differs from append which would add the whole list as a single nested item.",
      "Result is a flat [1, 2, 3, 4].",
    ],
  },

  // --- Advanced-heavy (level 3) ---
  {
    id: "slots-memory",
    level: 3,
    title: "Fixing which attribute names exist and shrinking instance memory",
    code: `class Point:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
print(p.x)`,
    bullets: [
      "__slots__ tells Python exactly which attributes instances may have.",
      "Instances no longer carry a per-object __dict__ by default, which saves memory at scale and catches typos like p.z = 3 early.",
      "You still read x and y like normal attributes.",
    ],
  },
  {
    id: "functools-wraps",
    level: 3,
    title: "Keeping the real function's name and docstring inside a wrapper",
    code: `from functools import wraps

def loud(fn):
    @wraps(fn)
    def inner(*a, **k):
        return fn(*a, **k)
    return inner

@loud
def add(a, b):
    """sum two numbers"""
    return a + b

print(add.__name__, add.__doc__.split()[0])`,
    bullets: [
      "Decorators often replace a function with an inner helper.",
      "Without wraps, that helper would steal the original name and docstring, which confuses help() and stack traces.",
      "@wraps(fn) copies metadata from the original add onto inner so the world still sees add as add.",
    ],
  },
  {
    id: "contextlib-contextmanager",
    level: 3,
    title: "Building a with-block from a generator with one yield",
    code: `from contextlib import contextmanager

@contextmanager
def demo():
    print("setup")
    yield 42
    print("teardown")

with demo() as x:
    print("body", x)`,
    bullets: [
      "contextmanager turns a generator into a context manager protocol for you.",
      "Everything before yield runs on enter, and the yielded value binds to x.",
      "After the with body, execution resumes for teardown, even if the body raised.",
    ],
  },
  {
    id: "cached-property",
    level: 3,
    title: "Computing an expensive attribute once per instance",
    code: `from functools import cached_property

class Report:
    @cached_property
    def total(self):
        print("compute")
        return sum(range(5))

r = Report()
print(r.total, r.total)`,
    bullets: [
      "The first time you read r.total, Python runs the method body and caches the return value on the instance.",
      "Later reads reuse the cache, so compute prints once even though you access total twice.",
      "Use this when the result depends only on self and should not be recomputed every access.",
    ],
  },
  {
    id: "abc-abstractmethod",
    level: 3,
    title: "Marking a base class so subclasses must fill in gaps",
    code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Square(Shape):
    def __init__(self, s: float):
        self.s = s

    def area(self) -> float:
        return self.s * self.s

print(Square(3).area())`,
    bullets: [
      "ABC marks Shape as abstract: you should not instantiate Shape itself.",
      "abstractmethod on area means any concrete subclass must define area or Python errors at instantiation time.",
      "Square supplies area, so you can build one and print 9.",
    ],
  },
  {
    id: "mro-diamond",
    level: 3,
    title: "How Python orders parents when classes overlap (MRO)",
    code: `class A:
    def f(self):
        return "A"

class B(A):
    pass

class C(A):
    def f(self):
        return "C"

class D(B, C):
    pass

print(D().f())
print([c.__name__ for c in D.__mro__])`,
    bullets: [
      "D inherits from B then C, both tie back to A.",
      "Method lookup walks the method resolution order list, not only depth-first naively.",
      "f on D finds C's version first here, so you see C. The printed MRO shows the full search order Python uses.",
    ],
  },
  {
    id: "asyncio-run",
    level: 3,
    title: "Running one async main function from a normal script entrypoint",
    code: `import asyncio

async def main():
    await asyncio.sleep(0)
    return "done"

print(asyncio.run(main()))`,
    bullets: [
      "async def defines a coroutine function. Calling main() returns a coroutine object, it does not run the body yet.",
      "await hands control back to the loop until sleep finishes, then resumes.",
      "asyncio.run sets up a loop, runs main to completion, then tears the loop down. Good top-level pattern in scripts.",
    ],
  },
  {
    id: "asyncio-gather",
    level: 3,
    title: "Running several coroutines and waiting for all of them",
    code: `import asyncio

async def slow(n):
    await asyncio.sleep(0)
    return n * 2

async def main():
    a, b = await asyncio.gather(slow(1), slow(2))
    return a + b

print(asyncio.run(main()))`,
    bullets: [
      "gather schedules both slow coroutines on the same event loop.",
      "await on gather pauses until every child finishes, then returns their results in order.",
      "Here you get 2 and 4, so the print is 6.",
    ],
  },
  {
    id: "typing-generic-box",
    level: 3,
    title: "A generic class that carries one type parameter through your code",
    code: `from typing import TypeVar, Generic

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, item: T):
        self.item = item

print(Box(10).item)`,
    bullets: [
      "TypeVar T stands for some concrete type you will pick at construction time.",
      "Generic[T] tells type checkers that Box is parameterized by that type.",
      "At runtime Python mostly ignores these hints, but your editor can catch mixing strings and ints across layers.",
    ],
  },
  {
    id: "typing-literal",
    level: 3,
    title: "Restricting a name to a small fixed set of string values",
    code: `from typing import Literal

Mode = Literal["read", "write"]

def open_kind(m: Mode) -> str:
    return m

print(open_kind("read"))`,
    bullets: [
      "Literal tells static tools that only those exact strings are legal values for Mode.",
      "Humans still see a normal str at runtime, so misuse is mainly caught before run if you run a checker.",
      "Useful for flags, opcodes, and API modes that must not drift.",
    ],
  },
  {
    id: "enum-auto",
    level: 3,
    title: "Giving names to a closed set of related constants",
    code: `from enum import Enum, auto

class Side(Enum):
    BUY = auto()
    SELL = auto()

print(Side.BUY, Side.BUY.name)`,
    bullets: [
      "Enum members are distinct objects compared by identity, not random strings scattered through the code.",
      "auto assigns stable internal values for you in newer Python versions.",
      "Printing shows the enum repr and the human-readable name BUY.",
    ],
  },
  {
    id: "dataclass-frozen-slots",
    level: 3,
    title: "Immutable data objects with less hidden dict overhead",
    code: `from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p.x)`,
    bullets: [
      "frozen=True means you cannot reassign fields after construction: treat instances like values.",
      "slots=True stores fields in a fixed layout similar to __slots__, which saves memory and speeds attribute access.",
      "You still read x and y with normal dot syntax.",
    ],
  },
  {
    id: "itertools-groupby-sorted",
    level: 3,
    title: "Grouping consecutive equal keys after sorting",
    code: `from itertools import groupby

pairs = [(1, "a"), (1, "b"), (2, "c")]
pairs.sort(key=lambda t: t[0])
for k, g in groupby(pairs, key=lambda t: t[0]):
    print(k, [x[1] for x in g])`,
    bullets: [
      "groupby only groups runs that are already adjacent, so you sort first when you mean true buckets by key.",
      "Each k is a key, g is an iterator over that run.",
      "Here key 1 maps to names a and b, key 2 maps to c.",
    ],
  },
  {
    id: "subprocess-run",
    level: 3,
    title: "Launching another program and reading its stdout as text",
    code: `import subprocess
import sys

r = subprocess.run(
    [sys.executable, "-c", "print(99)"],
    capture_output=True,
    text=True,
    check=True,
)
print(r.stdout.strip())`,
    bullets: [
      "run starts a child process with the argv list you pass. sys.executable is the same Python binary running this script.",
      "capture_output=True keeps stdout and stderr in memory instead of the console only.",
      "check=True turns a non-zero exit code into CalledProcessError so failures do not look like success.",
    ],
  },
  {
    id: "queue-fifo",
    level: 3,
    title: "A thread-safe first-in-first-out pipe between workers",
    code: `import queue

q = queue.Queue()
q.put(1)
q.put(2)
print(q.get(), q.get())`,
    bullets: [
      "Queue is designed for producer-consumer patterns across threads.",
      "put appends an item, get blocks until an item exists unless you configure timeouts.",
      "Print shows 1 then 2 in arrival order.",
    ],
  },
  {
    id: "threading-lock",
    level: 3,
    title: "Letting only one thread run a critical section at a time",
    code: `import threading

lock = threading.Lock()

def work():
    with lock:
        print("exclusive", end=" ")

t1 = threading.Thread(target=work)
t2 = threading.Thread(target=work)
t1.start()
t2.start()
t1.join()
t2.join()`,
    bullets: [
      "Lock is a mutex. Only one thread can hold it at once.",
      "with lock acquires on entry and releases on exit, even if the block errors.",
      "Both threads still run work, but the inner print sections will not interleave word fragments in the middle of each other.",
    ],
  },
  {
    id: "getattr-dynamic",
    level: 3,
    title: "Computing missing attributes on demand",
    code: `class Dyn:
    def __getattr__(self, name):
        return f"unknown:{name}"

d = Dyn()
print(d.foo, d.bar)`,
    bullets: [
      "__getattr__ runs only after normal lookup failed to find an attribute on the object or its class tree.",
      "Here any unknown name becomes a synthetic string, so d.foo and d.bar work without defining those fields ahead of time.",
      "Use carefully: typos on real attributes can silently turn into dynamic responses instead of errors.",
    ],
  },
  {
    id: "singledispatch-types",
    level: 3,
    title: "Choosing behavior based on the runtime type of the first argument",
    code: `from functools import singledispatch

@singledispatch
def describe(x):
    return f"other:{x}"

@describe.register(int)
def _(x):
    return f"int:{x}"

print(describe(5), describe("hi"))`,
    bullets: [
      "singledispatch builds a tiny registry from types to handler functions.",
      "The undecorated describe is the fallback for types with no specific registration.",
      "Dispatch uses the concrete type of the first argument at call time, so you see int:5 and other:hi.",
    ],
  },
  {
    id: "path-parts-parent",
    level: 3,
    title: "Inspecting a path as pieces without touching the disk yet",
    code: `from pathlib import Path

p = Path("data/logs/app.log")
print(p.parts)
print(p.parent.name)`,
    bullets: [
      "Path objects represent paths logically before you read or write files.",
      "parts splits the path into folder and file segments as a tuple-like sequence.",
      "parent walks up one directory level, here ending at logs, and name reads that final segment.",
    ],
  },

  // --- Domain examples (science, business, finance, economics, research) ---
  {
    id: "science-lab-replicates",
    level: 2,
    title: "Turning repeated instrument reads into a central value and spread",
    code: `from statistics import mean, stdev

reads_mm = [12.10, 11.95, 12.22, 12.03, 12.18]
print("mean_mm", round(mean(reads_mm), 3))
print("stdev_mm", round(stdev(reads_mm), 3))`,
    bullets: [
      "You have five thickness readings from the same coupon, in millimeters.",
      "mean answers where the cloud of points centers.",
      "stdev answers how noisy repeated pulls are around that center, useful before you trust one single read.",
    ],
  },
  {
    id: "science-radioactive-decay",
    level: 2,
    title: "How much material is left after several half-lives",
    code: `import math

half_life_days = 5.2
k = math.log(2) / half_life_days
days_elapsed = 10
fraction_left = math.exp(-k * days_elapsed)
print(round(fraction_left, 4), "of original activity left")`,
    bullets: [
      "half_life_days is how long until half the atoms have decayed on average, for this toy model.",
      "k converts that story into a continuous decay rate for the exponential curve.",
      "After 10 days you raise e to the negative k times time to get the fraction still active.",
    ],
  },
  {
    id: "science-unit-conversion",
    level: 2,
    title: "Converting sensor units before you compare to a reference table",
    code: `kelvin_reading = 310.15
celsius = kelvin_reading - 273.15
print(round(celsius, 2), "C")`,
    bullets: [
      "The probe reports Kelvin, an absolute scale.",
      "Subtract the fixed offset 273.15 to express the same physical temperature in Celsius.",
      "Now you can line up against human-scale thresholds in lab notes or regulations.",
    ],
  },
  {
    id: "research-prevalence",
    level: 2,
    title: "Estimating how common a positive test is in a screened cohort",
    code: `positive = 47
tested = 1200
prevalence = positive / tested
print(round(prevalence * 1000, 2), "positives per 1000 people tested")`,
    bullets: [
      "positive counts how many tests came back positive in this window.",
      "tested counts everyone who entered the denominator, including negatives.",
      "Dividing gives a simple proportion. Scaling to per 1000 is a familiar public health style headline number.",
    ],
  },
  {
    id: "research-replication-votes",
    level: 2,
    title: "Counting how many study rows hit a label you care about",
    code: `rows = [
    {"study": "A", "outcome": "significant"},
    {"study": "B", "outcome": "significant"},
    {"study": "A", "outcome": "null"},
]
hits = sum(1 for r in rows if r["outcome"] == "significant")
print(hits, "rows marked significant out of", len(rows))`,
    bullets: [
      "Each dict is one paper or one model run summarized as a row.",
      "The generator inside sum walks rows and adds 1 only when the outcome field matches significant.",
      "You get a quick tally without hand counting in a spreadsheet.",
    ],
  },
  {
    id: "ab-test-simulation",
    level: 2,
    title: "Simulating two conversion rates on fake traffic to see noise",
    code: `import random

random.seed(7)

def measured_rate(visits, true_rate):
    hits = sum(random.random() < true_rate for _ in range(visits))
    return hits / visits

a = measured_rate(800, 0.10)
b = measured_rate(800, 0.10)
print("arm A", round(a, 3), "arm B", round(b, 3))`,
    bullets: [
      "Both arms share the same true underlying rate here, ten percent.",
      "Each arm still reports a wiggly measured rate because visitors are random Bernoulli draws.",
      "This is why product teams insist on enough sample size and confidence intervals before calling a winner.",
    ],
  },
  {
    id: "econometrics-diff-in-means",
    level: 2,
    title: "A raw treatment minus control gap before fancier models",
    code: `from statistics import mean

control_hours = [6.1, 5.9, 6.0, 6.2]
treated_hours = [6.8, 7.0, 6.9, 7.1]
gap = mean(treated_hours) - mean(control_hours)
print(round(gap, 2), "extra hours sleep on average in this toy sample")`,
    bullets: [
      "control_hours is sleep logged for people who got the placebo app.",
      "treated_hours is sleep for people who got the coaching app.",
      "Subtracting means gives a simple average treatment effect sketch. Real papers add standard errors, covariates, and design checks.",
    ],
  },
  {
    id: "econometrics-log-change",
    level: 2,
    title: "Approximating percent change using log price ratio",
    code: `import math

price_t0 = 100.0
price_t1 = 108.0
log_return = math.log(price_t1 / price_t0)
print(round(log_return * 100, 2), "approximate percent change for small moves")`,
    bullets: [
      "Econometrics often works in logs because sums of log returns behave like multiplicative growth.",
      "log of the price ratio is close to the percent change when the move is not huge.",
      "Here prices rose eight points from 100 to 108, and the log object reports a compact growth summary.",
    ],
  },
  {
    id: "econ-demand-lookup",
    level: 2,
    title: "Reading quantity demanded off a tiny demand schedule",
    code: `demand_schedule = {24: 120, 20: 160, 16: 210}
price_usd = 20
qty = demand_schedule[price_usd]
print("At", price_usd, "USD buyers want", qty, "units in this table")`,
    bullets: [
      "Keys are hypothetical prices, values are how many units consumers buy at that price in this toy model.",
      "Lookup answers a what-if question: if we charge twenty dollars, how many units move.",
      "A real demand curve is smoother and estimated from data, but the dictionary shape matches how code stores grids.",
    ],
  },
  {
    id: "econ-consumer-subsidy",
    level: 2,
    title: "Passing a per-unit subsidy through to the price consumers see",
    code: `wholesale = 6.50
subsidy_per_unit = 1.25
consumer_price = wholesale - subsidy_per_unit
print(round(consumer_price, 2), "USD after subsidy")`,
    bullets: [
      "wholesale is what the clinic pays suppliers before policy.",
      "subsidy_per_unit is a government or insurer credit applied to each box sold.",
      "Subtracting gives the out-of-pocket number patients face at the counter in this simplified story.",
    ],
  },
  {
    id: "finance-npv-project",
    level: 2,
    title: "Discounting staged cash flows for a capital project",
    code: `def npv(rate, flows):
    total = 0.0
    for t, cf in enumerate(flows, start=1):
        total += cf / (1 + rate) ** t
    return total

flows_musd = [-2.5, 0.8, 1.0, 1.1]
print(round(npv(0.09, flows_musd), 3), "million USD NPV at 9 percent")`,
    bullets: [
      "flows_musd is money in millions: an upfront spend then three positive years.",
      "Each future year is divided by one plus the discount rate raised to the period index.",
      "The sum answers whether the project clears the hurdle rate in this stylized spreadsheet sense, not legal investment advice.",
    ],
  },
  {
    id: "finance-cagr",
    level: 2,
    title: "Smooth annual growth that connects two portfolio values",
    code: `start_usd = 100_000
end_usd = 130_000
years = 3
cagr = (end_usd / start_usd) ** (1 / years) - 1
print(round(cagr * 100, 2), "percent CAGR")`,
    bullets: [
      "CAGR imagines a constant yearly growth rate that would take you from start to end over the stated years.",
      "You divide end by start, raise to one over years, then subtract one to express as a return.",
      "Reporting in percent is how finance decks summarize long runs without showing every monthly wiggle.",
    ],
  },
  {
    id: "finance-cpi-inflation",
    level: 2,
    title: "Year-over-year inflation from a consumer price index level",
    code: `index_now = 315.2
index_year_ago = 298.5
yoy = (index_now / index_year_ago) - 1
print(round(yoy * 100, 2), "percent CPI inflation, year over year")`,
    bullets: [
      "Both numbers are index levels, not dollars, published by statistical agencies.",
      "Ratio minus one turns two levels into a growth rate over that horizon.",
      "Multiplying by one hundred is the usual headline percent format for news readers.",
    ],
  },
  {
    id: "finance-sharpe-toy",
    level: 3,
    title: "Reward per unit of volatility after subtracting a cash benchmark",
    code: `from statistics import mean, pstdev

monthly_returns = [0.01, -0.005, 0.02, 0.0, 0.008]
risk_free_monthly = 0.001
excess = [r - risk_free_monthly for r in monthly_returns]
sharpe_annualized = (mean(excess) / pstdev(excess)) * (12 ** 0.5)
print(round(sharpe_annualized, 2), "toy Sharpe-style ratio")`,
    bullets: [
      "Each monthly return is already expressed as a decimal, not a percent.",
      "You subtract a per-month cash yield to focus on reward for taking equity risk.",
      "Mean over population stdev, times square root of twelve, is a textbook annualization sketch, not a live compliance metric.",
    ],
  },
  {
    id: "business-mrr",
    level: 2,
    title: "Monthly recurring revenue from seats times average revenue per user",
    code: `active_subscribers = 420
arpu_usd = 29.0
mrr_usd = active_subscribers * arpu_usd
print(mrr_usd, "USD MRR before churn adjustments")`,
    bullets: [
      "active_subscribers counts paying seats this month.",
      "arpu_usd is average revenue per user, blended across plans in this toy.",
      "Multiplying gives a headline monthly recurring revenue before discounts, credits, or annual prepay effects.",
    ],
  },
  {
    id: "business-breakeven-units",
    level: 2,
    title: "How many units you must sell to cover fixed costs",
    code: `fixed_costs_usd = 50_000
price_usd = 40.0
variable_cost_usd = 22.0
contribution = price_usd - variable_cost_usd
units_to_breakeven = fixed_costs_usd / contribution
print(round(units_to_breakeven, 1), "units")`,
    bullets: [
      "fixed_costs_usd is rent, salaries, and other costs that do not scale with each mug sold.",
      "contribution is cash per unit left after variable costs like materials and shipping.",
      "Dividing fixed costs by contribution answers how many units pay off the overhead in this simplified model.",
    ],
  },
  {
    id: "business-inventory-turns",
    level: 2,
    title: "Turning average inventory and cost of goods sold into a turns ratio",
    code: `cogs_usd = 1_200_000
avg_inventory_usd = 200_000
turns = cogs_usd / avg_inventory_usd
print(round(turns, 2), "inventory turns per year")`,
    bullets: [
      "cogs_usd is what you spent to produce or buy goods you actually sold this year.",
      "avg_inventory_usd is the average dollar value sitting on shelves during the year.",
      "Dividing tells how many times inventory fully cycled, a classic retail operations KPI.",
    ],
  },
  {
    id: "policy-did-estimate",
    level: 2,
    title: "Difference-in-differences from four group averages",
    code: `treated_pre = 62
treated_post = 70
control_pre = 60
control_post = 63

did = (treated_post - treated_pre) - (control_post - control_pre)
print(did)`,
    bullets: [
      "You have one before and one after average for treated and control groups.",
      "First compute each group's change over time.",
      "Then subtract control change from treated change to remove shared background trends, under the parallel-trends assumption.",
    ],
  },
  {
    id: "policy-rdd-running-variable",
    level: 2,
    title: "Eligibility cutoff logic for regression discontinuity",
    code: `def assigned_to_program(score, cutoff=75):
    return int(score >= cutoff)

for s in [72, 75, 79]:
    print(s, assigned_to_program(s))`,
    bullets: [
      "A running variable score determines treatment assignment by a cutoff rule.",
      "People just below and just above the threshold are often comparable in RDD logic.",
      "The function prints who gets assigned under that policy rule.",
    ],
  },
  {
    id: "policy-plain-english-report",
    level: 2,
    title: "Turning a model estimate into policy language",
    code: `effect = 2.4
ci_low, ci_high = 0.8, 4.0
message = (
    f"Estimated effect: {effect:.1f} points per student. "
    f"Likely range: {ci_low:.1f} to {ci_high:.1f}."
)
print(message)`,
    bullets: [
      "effect is the best single estimate from your model.",
      "ci_low and ci_high define a plausible interval under the model assumptions.",
      "The f-string produces one plain-language sentence suitable for a policy brief.",
    ],
  },
  {
    id: "policy-rct-random-assignment",
    level: 2,
    title: "Randomly assigning people into treatment and control",
    code: `import random

random.seed(42)
ids = list(range(1, 11))
treated = set(random.sample(ids, k=5))

for pid in ids:
    is_treated = int(pid in treated)
    print(pid, is_treated)`,
    bullets: [
      "Set a random seed so this toy assignment is reproducible when you rerun the script.",
      "Sample five ids into treated, the remaining ids become control by definition.",
      "Print a 1 for treated and 0 for control. Random assignment is the key reason RCT groups are comparable on average.",
    ],
  },
  {
    id: "policy-rct-balance-check",
    level: 2,
    title: "Quick baseline balance check after randomization",
    code: `from statistics import mean

treated_age = [31, 28, 35, 30, 29]
control_age = [30, 27, 36, 31, 28]
age_gap = mean(treated_age) - mean(control_age)
print(round(age_gap, 2), "years baseline age gap")`,
    bullets: [
      "After randomization, you still check whether baseline covariates look similar by chance.",
      "This computes the mean age difference between treated and control before treatment starts.",
      "A small gap is reassuring. A large gap in a tiny sample can happen randomly, so report it and be transparent.",
    ],
  },
  {
    id: "policy-matching-nearest-age",
    level: 2,
    title: "Simple nearest-neighbor matching on one covariate",
    code: `treated_age = [21, 26, 30]
control_age = [20, 24, 28, 35]

for t in treated_age:
    nearest = min(control_age, key=lambda c: abs(c - t))
    print("treated", t, "matched control", nearest)`,
    bullets: [
      "For each treated unit, find the control unit with the closest age in this toy setup.",
      "This is one-variable nearest-neighbor matching and is only an intuition builder, not a full causal pipeline.",
      "Real matching work should check overlap, often use multiple covariates, and account for uncertainty in inference.",
    ],
  },
  {
    id: "policy-did-two-period-panel",
    level: 2,
    title: "Build two-period panel data for a DiD model",
    code: `rows = [
    {"group": "treated", "post": 0, "y": 12.1},
    {"group": "treated", "post": 1, "y": 14.0},
    {"group": "control", "post": 0, "y": 11.8},
    {"group": "control", "post": 1, "y": 12.3},
]

for r in rows:
    r["treated"] = int(r["group"] == "treated")
    r["treated_post"] = r["treated"] * r["post"]

print(rows[1])`,
    bullets: [
      "DiD regressions usually need treated, post, and their interaction treated_post.",
      "The interaction equals 1 only for treated units in the post period.",
      "In a standard two-way DiD setup, the interaction coefficient is the DiD estimate under parallel trends.",
    ],
  },
  {
    id: "policy-synthetic-control-weighted-combo",
    level: 2,
    title: "Synthetic control as a weighted average of donor units",
    code: `donor_outcomes = {"A": 52, "B": 61, "C": 58}
weights = {"A": 0.5, "B": 0.3, "C": 0.2}

synthetic_y = sum(weights[k] * donor_outcomes[k] for k in donor_outcomes)
treated_y = 65
gap = treated_y - synthetic_y
print(round(gap, 2), "treated minus synthetic gap")`,
    bullets: [
      "Synthetic control builds a comparison unit from weighted donor regions or units.",
      "Weights are chosen so pre-policy fit is good, then post-policy treated minus synthetic is interpreted as impact.",
      "This card shows the core weighted-average idea. Production work includes placebo and sensitivity checks.",
    ],
  },
  {
    id: "economics-elasticity-midpoint",
    level: 2,
    title: "Price elasticity with the midpoint formula",
    code: `q0, q1 = 100, 88
p0, p1 = 10.0, 11.0

pct_q = (q1 - q0) / ((q0 + q1) / 2)
pct_p = (p1 - p0) / ((p0 + p1) / 2)
elasticity = pct_q / pct_p
print(round(elasticity, 2))`,
    bullets: [
      "Midpoint elasticity uses average quantity and average price in the denominator to reduce direction bias.",
      "It measures how responsive demand is to a price change over this interval.",
      "Negative values are common for demand, because quantity tends to fall when price rises.",
    ],
  },
  {
    id: "ml-classification-metrics",
    level: 2,
    title: "Precision and recall from a confusion table",
    code: `tp, fp, fn = 42, 8, 10
precision = tp / (tp + fp)
recall = tp / (tp + fn)
print("precision", round(precision, 3))
print("recall", round(recall, 3))`,
    bullets: [
      "Precision asks: when the model predicts positive, how often is it right.",
      "Recall asks: of truly positive cases, how many the model catches.",
      "Teams choose trade-offs based on cost of false positives versus false negatives in the real application.",
    ],
  },
];

export function getPlainEnglishCards(): PlainEnglishCard[] {
  return cards;
}

export function getPlainEnglishCardsGrouped(): { level: PlainEnglishLevel; cards: PlainEnglishCard[] }[] {
  const out: { level: PlainEnglishLevel; cards: PlainEnglishCard[] }[] = [];
  for (const level of [1, 2, 3] as const) {
    const group = cards.filter((c) => c.level === level);
    if (group.length) out.push({ level, cards: group });
  }
  return out;
}
