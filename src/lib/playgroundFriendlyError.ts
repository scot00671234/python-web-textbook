/**
 * Short, plain-language nudges for common Python errors in the playground.
 * Full stderr stays available under "Technical details".
 */
export function friendlyPlaygroundError(stderr: string): string | null {
  const s = stderr.toLowerCase();
  if (!s.trim()) return null;

  if (s.includes("syntaxerror") || s.includes("invalid syntax")) {
    return "Python found a syntax problem. Check for a missing `(` after `print`, mismatched quotes, or a stray character at the start of a line.";
  }
  if (s.includes("nameerror")) {
    return "Python does not recognize a variable or function name. Check spelling and whether you defined it above.";
  }
  if (s.includes("indentationerror")) {
    return "Indentation is part of the grammar in Python. Line up spaces under `for`, `if`, or `def` blocks.";
  }
  if (s.includes("typeerror")) {
    return "Those two values do not support that operation together. Read the last line of the technical details for the exact types.";
  }
  if (s.includes("valueerror")) {
    return "A value was in the right shape but not valid for that operation (for example bad number text).";
  }
  if (s.includes("keyerror")) {
    return "That key is not in your dictionary. Check spelling or use `.get(...)` with a default.";
  }
  if (s.includes("indexerror")) {
    return "That index is past the end of the list (or the list is empty). Remember indexing starts at 0.";
  }
  if (s.includes("zerodivisionerror")) {
    return "You divided by zero somewhere.";
  }

  return "Something went wrong while running your code. Expand technical details below, or try Reset to starter code and edit again.";
}
