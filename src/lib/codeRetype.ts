/** Normalize for fair compare: LF endings, trim trailing spaces per line, trim trailing blank lines. */
export function normalizeCode(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const trimmed = lines.map((line) => line.replace(/[ \t]+$/g, ""));
  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === "") {
    trimmed.pop();
  }
  return trimmed.join("\n");
}

export type LineDiffOp =
  | { type: "equal"; line: string }
  | { type: "del"; line: string }
  | { type: "add"; line: string };

/** Line-based LCS diff: `userLines` vs `expectedLines` (expected is the target). */
export function diffLines(userLines: string[], expectedLines: string[]): LineDiffOp[] {
  const a = userLines;
  const b = expectedLines;
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  const stack: LineDiffOp[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      stack.push({ type: "equal", line: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "add", line: b[j - 1] });
      j--;
    } else if (i > 0) {
      stack.push({ type: "del", line: a[i - 1] });
      i--;
    } else {
      stack.push({ type: "add", line: b[j - 1] });
      j--;
    }
  }
  return stack.reverse();
}

export function codesMatchAfterNormalize(user: string, expected: string): boolean {
  return normalizeCode(user) === normalizeCode(expected);
}
